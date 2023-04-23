import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import IStudentDao from '@student/domain/daos/IStudentDao';
import ITermDao from '@student/domain/daos/ITermDao';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';
import Term from '@core/domain/entities/Term';
import Student from '@core/domain/entities/Student';
import Achievement from '@core/domain/entities/Achievement';
import IAchievementDao from '@lecturer/domain/daos/IAchievementDao';

interface ValidatedInput {
	achievement: Achievement;
	name: string;
	bonusGrade: number;
	term: Term;
	student: Student;
}
@injectable()
export default class UpdateAchievementHandler extends RequestHandler {
	@inject('AchievementDao') private achievementDao!: IAchievementDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('TermDao') private termDao!: ITermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const studentId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.body['studentId'] }));
		const bonusGrade = this.errorCollector.collect('bonusGrade', () => {
			const value = PositiveNumber.validate({ value: request.body['bonusGrade'] });
			if (value >= 10) throw new Error('bonusGrade must be < 10');
			return value;
		});

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		const achievement = await this.achievementDao.findEntityById(id);
		if (!achievement) {
			throw new Error('achievement not found');
		}
		const term = await this.termDao.findEntityById(termId);
		if (!term) {
			throw new Error('Term not found');
		}
		const student = await this.studentDao.findEntityById(studentId);
		if (!student) {
			throw new Error('Student not found');
		}
		return {
			achievement,
			name,
			term,
			student,
			bonusGrade,
		};
	}

	async handle(request: Request) {
		const { achievement, name, term, student, bonusGrade } = await this.validate(request);

		achievement.update({
			name,
			term,
			student,
			bonusGrade,
		});

		const achievementResult = await this.achievementDao.updateEntity(achievement);

		if (!achievementResult) throw new Error('Create Achievement fail');
		achievementResult.update({ student });

		return achievementResult.toJSON;
	}
}
