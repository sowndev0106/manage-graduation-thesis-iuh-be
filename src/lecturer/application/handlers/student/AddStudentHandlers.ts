import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Username from '@core/domain/validate-objects/Username';
import Password from '@core/domain/validate-objects/Password';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ConflictError from '@core/domain/errors/ConflictError';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import { encriptTextBcrypt } from '@core/infrastructure/bcrypt';
import StudentDao from '@student/infrastructure/objection-js/daos/StudentDao';
import Student, { TypeTraining } from '@core/domain/entities/Student';
import Majors from '@core/domain/entities/Majors';
import { faker } from '@faker-js/faker';
import { TypeGender } from '@core/domain/entities/Lecturer';
import IStudentTermDao from '@lecturer/domain/daos/IStudentTermDao';
import StudentTerm from '@core/domain/entities/StudentTerm';
import ITermDao from '@lecturer/domain/daos/ITermDao';

interface ValidatedInput {
	username: string;
	password?: string;
	majorsId: number;
	termId: number;
}

@injectable()
export default class AddStudentHandlers extends RequestHandler {
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('StudentDao') private studentDao!: StudentDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.body['majorsId'] }));
		const username = this.errorCollector.collect('username', () => Username.validate({ value: request.body['username'] }));
		const password = this.errorCollector.collect('password', () => Password.validate({ value: request.body['password'], required: false }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { username, password, majorsId, termId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let user = await this.studentDao.findByUsername(input.username);
		if (user) throw new ConflictError('username already exists');

		let majors = await this.majorsDao.findEntityById(input.majorsId);
		if (!majors) throw new NotFoundError('majors not found');

		let term = await this.termDao.findEntityById(input.termId);
		if (!term) throw new NotFoundError('majors not found');

		const defaultPassword = '123456';

		const passwordEncript = await encriptTextBcrypt(input.password || defaultPassword);

		let student = Student.create({
			username: input.username,
			password: passwordEncript,
			majors: Majors.createById(1),
			gender: TypeGender.FEMALE,
			schoolYear: new Date().getFullYear().toString(),
			typeTraining: TypeTraining.UNIVERSITY,
		});

		student = await this.studentDao.insertEntity(student);

		let studentterm = await this.studentTermDao.findOne(term.id!, student.id!);
		if (!studentterm) {
			// insert to student term
			await this.studentTermDao.insertEntity(
				StudentTerm.create({
					student,
					term,
				})
			);
		}
		return student.toJSON;
	}
}
