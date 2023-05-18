import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import INotificationLecturerDao from '@lecturer/domain/daos/INotificationLecturerDao';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	lecturerId: number;
}

@injectable()
export default class UpdateAllStatusNotificationLecturerHandler extends RequestHandler {
	@inject('NotificationLecturerDao') private notificationLecturerDao!: INotificationLecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const lecturerId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { lecturerId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const response = await this.notificationLecturerDao.readAll({ lecturerId: input.lecturerId });

		return response;
	}
}
