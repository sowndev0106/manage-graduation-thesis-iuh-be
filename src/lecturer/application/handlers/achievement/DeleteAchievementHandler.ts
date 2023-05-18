import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IAchievementDao from '@lecturer/domain/daos/IAchievementDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import NotificationStudentService from '@core/service/NotificationStudentService';
import Student from '@core/domain/entities/Student';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';

interface ValidatedInput {
	id: number;
}

@injectable()
export default class DeleteAchievementHandler extends RequestHandler {
	@inject('AchievementDao') private achievementDao!: IAchievementDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { id };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const achievement = await this.achievementDao.findEntityById(input.id);

		if (!achievement) {
			throw new NotFoundError('achievement not found');
		}

		const result = await this.achievementDao.deleteEntity(achievement);
		const student = await this.studentDao.findEntityById(achievement.studentTermId);
		await NotificationStudentService.send({
			user: student!,
			message: `Thành tích '${achievement.name} của bạn vừa được xóa'`,
			type: 'ACHIEVEMENT',
		});
		return result ? 'delete success' : 'delete fail';
	}
}
