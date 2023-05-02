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
import { TypeGender } from '@core/domain/entities/Lecturer';
import IStudentTermDao from '@lecturer/domain/daos/IStudentTermDao';
import StudentTerm from '@core/domain/entities/StudentTerm';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import Email from '@core/domain/validate-objects/Email';
import PhoneNumber from '@core/domain/validate-objects/PhoneNumber';
import SortText from '@core/domain/validate-objects/SortText';
import Training from '@core/domain/validate-objects/Training';
import Gender from '@core/domain/validate-objects/Gender';

interface ValidatedInput {
	username: string;
	majorsId: number;
	termId: number;
	password?: string;
	phoneNumber?: string;
	email?: string;
	name?: string;
	typeTraining?: TypeTraining;
	schoolYear?: string;
	avatar?: string;
	gender?: TypeGender;
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
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const password = this.errorCollector.collect('password', () => Password.validate({ value: request.body['password'], required: false }));
		const phoneNumber = this.errorCollector.collect('phoneNumber', () => PhoneNumber.validate({ value: request.body['phoneNumber'], required: false }));
		const email = this.errorCollector.collect('email', () => Email.validate({ value: request.body['email'], required: false }));
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'], required: false }));
		const typeTraining = this.errorCollector.collect('typeTraining', () => Training.validate({ value: request.body['typeTraining'], required: false }));
		const schoolYear = this.errorCollector.collect('schoolYear', () => SortText.validate({ value: request.body['schoolYear'], required: false }));
		const gender = this.errorCollector.collect('gender', () => Gender.validate({ value: request.body['gender'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { username, password, majorsId, termId, phoneNumber, email, name, gender, typeTraining, schoolYear };
	}

	async handle(request: Request) {
		const { username, password, majorsId, termId, phoneNumber, email, name, gender, typeTraining, schoolYear } = await this.validate(request);

		let user = await this.studentDao.findByUsername(username);
		if (user) throw new ConflictError('username already exists');

		let majors = await this.majorsDao.findEntityById(majorsId);
		if (!majors) throw new NotFoundError('majors not found');

		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('majors not found');

		const defaultPassword = '123456';

		const passwordEncript = await encriptTextBcrypt(password || defaultPassword);

		let student = Student.create({
			username: username,
			password: passwordEncript,
			majors: majors,
			phoneNumber,
			email,
			name,
			gender,
			typeTraining,
			schoolYear,
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
