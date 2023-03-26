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
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import Lecturer, { TypeDegree, TypeGender, TypeRoleLecturer } from '@core/domain/entities/Lecturer';
import Majors from '@core/domain/entities/Majors';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import Term from '@core/domain/entities/Term';
import LecturerTerm from '@core/domain/entities/LecturerTerm';

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
export default class ImportLecturerByExcelHandler extends RequestHandler {
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('LecturerTermDao') private LecturertermDao!: ILecturerTermDao;

	async validate(request: Request): Promise<IValidatedInput> {
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.body['majorsId'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));

		const file = request.file?.buffer;
		const users = this.errorCollector.collect('file', () => {
			if (!file) throw new Error('file is require');
			const result = converExcelBufferToObject(file);
			if (!result[0]['username']) {
				throw new Error(
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
			throw new Error('major not found');
		}
		const term = await this.termDao.findEntityById(termId);
		if (!term) {
			throw new Error('term not found');
		}

		return { users: usersValidate, majors, term };
	}

	async handle(request: Request) {
		const { users, majors, term } = await this.validate(request);

		const passwordDefault = process.env.PASWSWORD_DEFAULT as string;

		const lecturersPromise = users.map(async user => {
			const passwordEncript = await encriptTextBcrypt(user.password || passwordDefault);
			let lecturer = await this.lecturerDao.findByUsername(user.username);
			if (!lecturer) {
				lecturer = await this.lecturerDao.insertEntity(
					Lecturer.create({
						username: user.username,
						majors,
						password: passwordEncript,
						email: user.email,
						name: user.name,
						phoneNumber: user.phone,
						isAdmin: false,
						degree: TypeDegree.MASTERS,
						role: TypeRoleLecturer.LECTURER,
						gender: TypeGender.FEMALE,
					})
				);
			}
			let lecturerterm = await this.LecturertermDao.findOne(term.id!, lecturer.id!);
			if (!lecturerterm) {
				// insert to lecturer term
				await this.LecturertermDao.insertEntity(
					LecturerTerm.create({
						lecturer,
						term,
						role: lecturer.role,
					})
				);
			}
			return lecturer;
		});

		const lecturers = await Promise.all(lecturersPromise);

		return lecturers.map(e => e.toJSON);
	}
}
