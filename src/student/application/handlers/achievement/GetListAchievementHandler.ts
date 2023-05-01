import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IAchievementDao from '@student/domain/daos/IAchievementDao';
import IStudentDao from '@student/domain/daos/IStudentDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';
import StudentTerm from '@core/domain/entities/StudentTerm';

interface ValidatedInput {
	studentTerm: StudentTerm;
}

@injectable()
export default class GetListAchievementHandler extends RequestHandler {
	@inject('AchievementDao') private achievementDao!: IAchievementDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'] }));
		const studentId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.query['studentId'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		const studentTerm = await this.studentTermDao.findOne(termId, studentId);
		if (!studentTerm) {
			throw new Error(`student not in term ${termId}`);
		}
		return { studentTerm };
	}

	async handle(request: Request) {
		const { studentTerm } = await this.validate(request);
		const listAchievement = await this.achievementDao.findAll({ studentTermId: studentTerm.id! });

		return listAchievement.map(e => e.toJSON);
	}
}
