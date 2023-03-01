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
import { deleteFileCloudynary } from '@core/infrastructure/cloudinary';
import IStudentDao from '@student/domain/daos/IStudentDao';
import Training from '@core/domain/validate-objects/Training';
import { TypeTraining } from '@core/domain/entities/Student';

interface ValidatedInput {
	id: number;
	phoneNumber: string;
	email: string;
	name: string;
	typeTraining?: TypeTraining;
	schoolYear?: string;
	avatar?: string;
	gender?: TypeGender;
}

@injectable()
export default class UpdateMyInfoHandler extends RequestHandler {
	@inject('UserDao') private userDao!: IUserDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const phoneNumber = this.errorCollector.collect('phoneNumber', () => PhoneNumber.validate({ value: request.body['phoneNumber'] }));
		const email = this.errorCollector.collect('email', () => Email.validate({ value: request.body['email'] }));
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const typeTraining = this.errorCollector.collect('typeTraining', () => Training.validate({ value: request.body['typeTraining'], required: false }));
		const schoolYear = this.errorCollector.collect('schoolYear', () => SortText.validate({ value: request.body['schoolYear'], required: false }));
		const gender = this.errorCollector.collect('gender', () => Gender.validate({ value: request.body['gender'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return {
			id: Number(request.headers['id']),
			phoneNumber,
			email,
			name,
			gender,
			avatar: request.file?.path,
			typeTraining,
			schoolYear,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		let student = await this.studentDao.findGraphEntityById(input.id, 'user');

		input.typeTraining && student?.updateTypeTraining(input.typeTraining);
		input.schoolYear && student?.updateShoolYear(input.schoolYear);
		student?.user.updatePhoneNumber(input.phoneNumber);
		student?.user.updateEmail(input.email);
		student?.user.updateName(input.name);
		input.gender && student?.user.updateGender(input.gender);

		if (input.avatar) {
			deleteFileCloudynary(student?.user.avatar).then();
			student?.user.updateAvatar(input.avatar);
		}

		student = await this.studentDao.updateGraphEntity(student!);

		return student?.toJSON;
	}
}
