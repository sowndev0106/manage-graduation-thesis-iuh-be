import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IAchievementDao from '@lecturer/domain/daos/IAchievementDao';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import EntityId from '@core/domain/validate-objects/EntityID';

interface ValidatedInput {
	termId: number;
	studentId: number;
}

@injectable()
export default class GetListAchievementHandler extends RequestHandler {
	@inject('AchievementDao') private achievementDao!: IAchievementDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'] }));
		const studentId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.query['studentId'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { termId, studentId };
	}

	async handle(request: Request) {
		const { termId, studentId } = await this.validate(request);

		const listAchievement = await this.achievementDao.findAll({ termId, studentId });

		return listAchievement.map(e => e.toJSON);
	}
}
