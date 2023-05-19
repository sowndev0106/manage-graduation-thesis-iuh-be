import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import Email from '@core/domain/validate-objects/Email';
import PhoneNumber from '@core/domain/validate-objects/PhoneNumber';
import Gender from '@core/domain/validate-objects/Gender';
import { deleteFileCloudynary } from '@core/infrastructure/cloudinary';
import IStudentDao from '@student/domain/daos/IStudentDao';
import Training from '@core/domain/validate-objects/Training';
import { TypeTraining } from '@core/domain/entities/Student';
import { TypeGender } from '@core/domain/entities/Lecturer';
import ErrorCode from '@core/domain/errors/ErrorCode';

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

		const studentByEmail = await this.studentDao.findOneByEmail(input.email);

		if (studentByEmail && studentByEmail.id != input.id) throw new ErrorCode('DUPLICATE_EMAIL', 'Email already exists');

		let student = await this.studentDao.findEntityById(input.id);

		input.typeTraining && student?.updateTypeTraining(input.typeTraining);
		input.schoolYear && student?.updateShoolYear(input.schoolYear);
		student?.updatePhoneNumber(input.phoneNumber);
		student?.updateEmail(input.email);
		student?.updateName(input.name);
		input.gender && student?.updateGender(input.gender);

		if (input.avatar) {
			deleteFileCloudynary(student?.avatar).then();
			student?.updateAvatar(input.avatar);
		}

		student = await this.studentDao.updateGraphEntity(student!);

		return student?.toJSON;
	}
}
