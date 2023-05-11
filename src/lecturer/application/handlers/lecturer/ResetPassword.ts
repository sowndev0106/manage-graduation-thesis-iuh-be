import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import Password from '@core/domain/validate-objects/Password';
import { compareTextBcrypt } from '@core/infrastructure/bcrypt';
import ForbiddenError from '@core/domain/errors/ForbiddenError';
import { encriptTextBcrypt } from '@core/infrastructure/bcrypt';
import Lecturer from '@core/domain/entities/Lecturer';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	me: Lecturer;
	lecturer: Lecturer;
	password: string;
}

@injectable()
export default class ResetPassword extends RequestHandler {
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const lecturerId = this.errorCollector.collect('lecturerId', () => EntityId.validate({ value: request.params['lecturerId'] }));
		const password = this.errorCollector.collect('password', () => Password.validate({ value: request.body['password'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let lecturer = await this.lecturerDao.findEntityById(lecturerId);
		if (!lecturer) throw new NotFoundError('lecturer not found');

		let me = await this.lecturerDao.findEntityById(Number(request.headers['id']));
		if (!me) throw new NotFoundError('Error! please login again');
		return {
			me,
			password,
			lecturer,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		if (!input.me.isAdmin && input.me.majorsId != input.lecturer.majorsId) {
			throw new ErrorCode('DONT_HAVE_PERMISSION_THIS_MAJORS', `You don\'t have permission to lecturer with majors ${input.lecturer.majorsId}`);
		}
		const newPassword = await encriptTextBcrypt(input.password);

		input.lecturer?.update({ password: newPassword });

		input.lecturer = await this.lecturerDao.updateEntity(input.lecturer);

		return input.lecturer?.toJSON;
	}
}
