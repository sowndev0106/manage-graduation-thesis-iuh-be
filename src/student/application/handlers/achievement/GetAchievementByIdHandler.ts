import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IAchievementDao from '@student/domain/daos/IAchievementDao';
import ILecturerDao from '@student/domain/daos/ILecturerDao';
import IStudentDao from '@student/domain/daos/IStudentDao';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';

interface ValidatedInput {
	id: number;
}

@injectable()
export default class GetAchievementByIdHandler extends RequestHandler {
	@inject('AchievementDao') private achievementDao!: IAchievementDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: String(request.params['id']) }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { id };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const achievement = await this.achievementDao.findEntityById(input.id);

		if (!achievement) {
			throw new Error('achievement not found');
		}
		const studentTerm = await this.studentTermDao.findOneGraphById(achievement.studentTermId!);

		studentTerm && achievement.update({ studentTerm });

		return achievement.toJSON;
	}
}
