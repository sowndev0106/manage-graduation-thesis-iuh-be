import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import IAchievementDao from '@lecturer/domain/daos/IAchievementDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import Achievement from '@core/domain/entities/Achievement';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';
import Text from '@core/domain/validate-objects/Text';
import Lecturer from '@core/domain/entities/Lecturer';
import Term from '@core/domain/entities/Term';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import Student from '@core/domain/entities/Student';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';

interface ValidatedInput {
	name: string;
	bonusGrade: number;
	term: Term;
	student: Student;
}
@injectable()
export default class CreateAchievementHandler extends RequestHandler {
	@inject('AchievementDao') private achievementDao!: IAchievementDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
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
		return {
			name,
			term,
			student,
			bonusGrade,
		};
	}

	async handle(request: Request) {
		const { name, term, student, bonusGrade } = await this.validate(request);
		console.log(
			Achievement.create({
				name,
				term,
				student,
				bonusGrade,
			}).toJSON
		);
		const achievement = await this.achievementDao.insertEntity(
			Achievement.create({
				name,
				term,
				student,
				bonusGrade,
			})
		);

		if (!achievement) throw new Error('Create Achievement fail');
		achievement.update({ student });
		return achievement.toJSON;
	}
}
