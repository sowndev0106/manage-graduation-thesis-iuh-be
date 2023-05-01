import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import IAchievementDao from '@lecturer/domain/daos/IAchievementDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import Achievement from '@core/domain/entities/Achievement';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import IStudentTermDao from '@lecturer/domain/daos/IStudentTermDao';
import StudentTerm from '@core/domain/entities/StudentTerm';

interface ValidatedInput {
	name: string;
	bonusGrade: number;
	studentTerm: StudentTerm;
}
@injectable()
export default class CreateAchievementHandler extends RequestHandler {
	@inject('AchievementDao') private achievementDao!: IAchievementDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	async validate(request: Request): Promise<ValidatedInput> {
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
		const term = await this.termDao.findEntityById(termId);
		if (!term) {
			throw new Error('Term not found');
		}
		const student = await this.studentDao.findEntityById(studentId);
		if (!student) {
			throw new Error('Student not found');
		}
		const studentTerm = await this.studentTermDao.findOne(termId, studentId);

		if (!studentTerm) {
			throw new Error(`student not in term ${termId}`);
		}
		return {
			name,
			studentTerm,
			bonusGrade,
		};
	}

	async handle(request: Request) {
		const { name, studentTerm, bonusGrade } = await this.validate(request);

		const achievement = await this.achievementDao.insertEntity(
			Achievement.create({
				name,
				studentTerm,
				bonusGrade,
			})
		);

		if (!achievement) throw new Error('Create Achievement fail');
		achievement.update({ studentTerm });
		return achievement.toJSON;
	}
}
