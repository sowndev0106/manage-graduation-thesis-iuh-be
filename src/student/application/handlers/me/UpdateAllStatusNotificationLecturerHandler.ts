import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import INotificationStudentDao from '@student/domain/daos/INotificationStudentDao';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	studentId: number;
}

@injectable()
export default class UpdateAllStatusNotificationStudentHandler extends RequestHandler {
	@inject('NotificationStudentDao') private notificationStudentDao!: INotificationStudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const studentId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { studentId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const response = await this.notificationStudentDao.readAll({ studentId: input.studentId });

		return response;
	}
}
