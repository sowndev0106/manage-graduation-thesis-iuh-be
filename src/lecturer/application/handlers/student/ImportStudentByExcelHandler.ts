import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import Username from '@core/domain/validate-objects/Username';
import SortText from '@core/domain/validate-objects/SortText';
import Email from '@core/domain/validate-objects/Email';
import PhoneNumber from '@core/domain/validate-objects/PhoneNumber';
import { converExcelBufferToObject } from '@core/infrastructure/xlsx';
import EntityId from '@core/domain/validate-objects/EntityID';
import { encriptTextBcrypt } from '@core/infrastructure/bcrypt';
import Lecturer, { TypeDegree, TypeGender, TypeRoleLecturer } from '@core/domain/entities/Lecturer';
import Majors from '@core/domain/entities/Majors';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import Term from '@core/domain/entities/Term';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import IStudentTermDao from '@lecturer/domain/daos/IStudentTermDao';
import Student, { TypeTraining } from '@core/domain/entities/Student';
import StudentTerm from '@core/domain/entities/StudentTerm';
import ErrorCode from '@core/domain/errors/ErrorCode';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface IValidatedInput {
	users: Array<{
		username: string;
		name?: string;
		email?: string;
		phone?: string;
		password?: string;
	}>;
	majors: Majors;
	term: Term;
}

@injectable()
export default class ImportStudentByExcelHandler extends RequestHandler {
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;

	async validate(request: Request): Promise<IValidatedInput> {
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.body['majorsId'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));

		const file = request.file?.buffer;
		const users = this.errorCollector.collect('file', () => {
			if (!file) throw new Error('file is require');
			const result = converExcelBufferToObject(file);
			if (!result[0]['username']) {
				throw new ErrorCode(
					'IMPORT_STUDENT_MISSING_COLUMN',
					`This requirement specifies the need for a mandatory 'username' column and optional columns for 'password', 'name', 'phone', and 'email'.`
				);
			}
			return result;
		});

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		const usersValidate: Array<any> = [];

		// user
		const alUsernameExcel: { [key: string]: string } = {};
		for (const user of users) {
			const prop = {
				username: this.errorCollector.collect('username', () => {
					const username = Username.validate({ value: user['username'] });
					if (alUsernameExcel[username]) {
						return;
					}
					alUsernameExcel[username] = username;
					return username;
				}),
				name: this.errorCollector.collect('name', () => SortText.validate({ value: user['name'], required: false })),
				email: this.errorCollector.collect('email', () => Email.validate({ value: user['email'], required: false })),
				phone: this.errorCollector.collect('phone', () => PhoneNumber.validate({ value: user['phone'], required: false })),
				password: this.errorCollector.collect('password', () => SortText.validate({ value: user['password'], required: false })),
			};
			usersValidate.push(prop);
		}
		const majors = await this.majorsDao.findEntityById(majorsId);
		if (!majors) {
			throw new NotFoundError('major not found');
		}
		const term = await this.termDao.findEntityById(termId);
		if (!term) {
			throw new NotFoundError('term not found');
		}

		return { users: usersValidate, majors, term };
	}

	async handle(request: Request) {
		const { users, majors, term } = await this.validate(request);

		const passwordDefault = process.env.PASWSWORD_DEFAULT as string;

		const studentsPromise = users.map(async user => {
			const passwordEncript = await encriptTextBcrypt(user.password || passwordDefault);
			let student = await this.studentDao.findByUsername(user.username);
			if (!student) {
				student = await this.studentDao.insertEntity(
					Student.create({
						username: user.username,
						majors,
						password: passwordEncript,
						email: user.email,
						name: user.name,
						phoneNumber: user.phone,
						typeTraining: TypeTraining.UNIVERSITY,
						gender: TypeGender.MALE,
						schoolYear: new Date().getFullYear().toString(),
					})
				);
			}
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
			return student;
		});

		const students = await Promise.all(studentsPromise);

		return students.map(e => e.toJSON);
	}
}
