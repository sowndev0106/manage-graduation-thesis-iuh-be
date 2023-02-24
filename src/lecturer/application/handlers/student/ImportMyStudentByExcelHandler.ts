import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IUserDao from '@student/domain/daos/IUserDao';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import Username from '@core/domain/validate-objects/Username';
import SortText from '@core/domain/validate-objects/SortText';
import Email from '@core/domain/validate-objects/Email';
import PhoneNumber from '@core/domain/validate-objects/PhoneNumber';
import { converExcelBufferToObject } from '@core/infrastructure/xlsx';
import EntityId from '@core/domain/validate-objects/EntityID';
import Student, { TypeTraining } from '@core/domain/entities/Student';
import User from '@core/domain/entities/User';
import { encriptTextBcrypt } from '@core/infrastructure/bcrypt';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';

interface IValidatedInput {
	data: Array<{
		username: string;
		name?: string;
		email?: string;
		phone?: string;
		password?: string;
	}>;
	majorsId: number;
}

@injectable()
export default class ImportMyStudentByExcelHandler extends RequestHandler {
	@inject('UserDao') private userDao!: IUserDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;

	async validate(request: Request): Promise<IValidatedInput> {
		const file = request.file?.buffer;
		const data = this.errorCollector.collect('file', () => {
			if (!file) throw new Error('file is require');
			const result = converExcelBufferToObject(file);
			if (!result[0]['username']) {
				throw new Error(
					`This requirement specifies the need for a mandatory 'username' column and optional columns for 'password', 'name', 'phone', and 'email'.`
				);
			}
			return result;
		});

		const student = await this.studentDao.findGraphEntityById(Number(request.headers['id']), 'user');
		const majorsId = student?.user.majorsId!;

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		// check validation once row and column excel
		const errors: Array<{ row: number; columns: any }> = [];

		const allUsername = (await this.userDao.getAllEntities()).reduce((acc: any, cur: any) => {
			return { ...acc, [cur.username]: cur.username };
		}, {});
		// user
		const alUsernameExcel: { [key: string]: string } = {};

		// validaion data
		const dataValidate = data.map((e: any, index: number) => {
			const prop = {
				username: this.errorCollector.collect('username', () => {
					const username = Username.validate({ value: e['username'] });
					if (allUsername[username]) {
						throw new Error('username already exists in database');
					}
					if (alUsernameExcel[username]) {
						throw new Error('value is duplicated in file ');
					}
					alUsernameExcel[username] = username;
					return username;
				}),
				name: this.errorCollector.collect('name', () => SortText.validate({ value: e['name'], required: false })),
				email: this.errorCollector.collect('email', () => Email.validate({ value: e['email'], required: false })),
				phone: this.errorCollector.collect('phone', () => PhoneNumber.validate({ value: e['phone'], required: false })),
				password: this.errorCollector.collect('password', () => SortText.validate({ value: e['password'], required: false })),
			};

			if (this.errorCollector.hasError()) {
				errors.push({ row: index + 1, columns: this.errorCollector.errors });
				this.errorCollector.clear();
			}

			return prop;
		});

		if (errors.length) {
			throw new ValidationError(errors);
		}
		return { data: dataValidate, majorsId };
	}

	async handle(request: Request) {
		const { data, majorsId } = await this.validate(request);
		const majors = await this.majorsDao.findEntityById(majorsId);
		if (!majors) {
			throw new Error('major not found');
		}
		const passwordDefault = process.env.PASWSWORD_DEFAULT as string;

		const studentsPromise = data.map(async e => {
			const passwordEncript = await encriptTextBcrypt(e.password || passwordDefault);
			return Student.create({
				user: User.create({
					username: e.username,
					majors,
					password: passwordEncript,
					email: e.email,
					name: e.name,
					phoneNumber: e.phone,
				}),
				typeTraining: TypeTraining.University,
				schoolYear: new Date().getFullYear().toString(),
			});
		});

		const students = await Promise.all(studentsPromise);

		const result = await this.studentDao.insertGraphMultipleEntities(students);
		return result.map(e => e.toJSON);
	}
}
