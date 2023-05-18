import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import INotificationLecturerDao from '@lecturer/domain/daos/INotificationLecturerDao';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	lecturerId: number;
	notificationId: number;
}

@injectable()
export default class UpdateStatusNotificationLecturerHandler extends RequestHandler {
	@inject('NotificationLecturerDao') private notificationLecturerDao!: INotificationLecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const notificationId = this.errorCollector.collect('notificationId', () => EntityId.validate({ value: String(request.params['notificationId']) }));
		const lecturerId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { lecturerId, notificationId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const notification = await this.notificationLecturerDao.findEntityById(input.notificationId);
		if (!notification) {
			throw new ErrorCode('NOT_FOUND', 'NotificationLecturer not found');
		}
		notification.update({ read: true });
		const response = await this.notificationLecturerDao.updateEntity(notification);
		return response?.toJSON;
	}
}
