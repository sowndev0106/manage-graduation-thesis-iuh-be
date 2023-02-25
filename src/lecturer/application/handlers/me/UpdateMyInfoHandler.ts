import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IUserDao from '@student/domain/daos/IUserDao';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import SortText from '@core/domain/validate-objects/SortText';
import Email from '@core/domain/validate-objects/Email';
import PhoneNumber from '@core/domain/validate-objects/PhoneNumber';
import Gender from '@core/domain/validate-objects/Gender';
import { TypeGender } from '@core/domain/entities/User';
import Degree from '@core/domain/validate-objects/Degree';
import { TypeDegree } from '@core/domain/entities/Lecturer';
import { deleteFileCloudynary } from '@core/infrastructure/cloudinary';

interface ValidatedInput {
	id: number;
	phoneNumber: string;
	email: string;
	name: string;
	avatar?: string;
	gender?: TypeGender;
	degree?: TypeDegree;
}

@injectable()
export default class UpdateMyInfoHandler extends RequestHandler {
	@inject('UserDao') private userDao!: IUserDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const phoneNumber = this.errorCollector.collect('phoneNumber', () => PhoneNumber.validate({ value: request.body['phoneNumber'] }));
		const email = this.errorCollector.collect('email', () => Email.validate({ value: request.body['email'] }));
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const gender = this.errorCollector.collect('gender', () => Gender.validate({ value: request.body['gender'], required: false }));
		const degree = this.errorCollector.collect('degree', () => Degree.validate({ value: request.body['degree'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		console.log(request.file);
		return {
			id: Number(request.headers['id']),
			phoneNumber,
			email,
			name,
			gender,
			degree,
			avatar: request.file?.path,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		let lecturer = await this.lecturerDao.findGraphEntityById(input.id, 'user');

		input.degree && lecturer?.updateDegree(input.degree);
		lecturer?.user.updatePhoneNumber(input.phoneNumber);
		lecturer?.user.updateEmail(input.email);
		lecturer?.user.updateName(input.name);
		input.gender && lecturer?.user.updateGender(input.gender);
		if (input.avatar) {
			deleteFileCloudynary(lecturer?.user.avatar).then();
			lecturer?.user.updateAvatar(input.avatar);
		}

		lecturer = await this.lecturerDao.updateGraphEntity(lecturer!);

		return lecturer?.toJSON;
	}
}
