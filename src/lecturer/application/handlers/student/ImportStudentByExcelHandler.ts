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
import Student, { TypeTraining } from '@core/domain/entities/Student';
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
export default class ImportStudentByExcelHandler extends RequestHandler {
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
		const majorsId = this.errorCollector.collect('majors_id', () => EntityId.validate({ value: request.body['majors_id'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		// check validation once row and column excel
		const errors: Array<{ row: number; columns: any }> = [];

		// user
		const alUsernameExcel: { [key: string]: string } = {};

		// validaion data
		const dataValidate = data.map((e: any, index: number) => {
			const prop = {
				username: this.errorCollector.collect('username', () => {
					const username = Username.validate({ value: e['username'] });
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
		const allUsername = (await this.studentDao.getAllEntities()).reduce((acc: any, cur: any) => {
			return { ...acc, [cur.username]: cur.username };
		}, {});

		const passwordDefault = process.env.PASWSWORD_DEFAULT as string;

		const studentsPromise = data
			.filter(e => !allUsername[e.username])
			.map(async e => {
				const passwordEncript = await encriptTextBcrypt(e.password || passwordDefault);
				const student = await this.studentDao.insertEntity(
					Student.create({
						username: e.username,
						majors,
						password: passwordEncript,
						email: e.email,
						name: e.name,
						phoneNumber: e.phone,
						typeTraining: TypeTraining.UNIVERSITY,
						schoolYear: new Date().getFullYear().toString(),
					})
				);
				// insert in term
				return student;
			});

		const students = await Promise.all(studentsPromise);

		const result = await this.studentDao.insertGraphMultipleEntities(students);
		return result.map(e => e.toJSON);
	}
}
