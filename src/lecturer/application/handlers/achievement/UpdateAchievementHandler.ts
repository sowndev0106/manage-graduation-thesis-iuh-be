import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import IStudentDao from '@student/domain/daos/IStudentDao';
import ITermDao from '@student/domain/daos/ITermDao';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';
import Achievement from '@core/domain/entities/Achievement';
import IAchievementDao from '@lecturer/domain/daos/IAchievementDao';
import StudentTerm from '@core/domain/entities/StudentTerm';
import IStudentTermDao from '@lecturer/domain/daos/IStudentTermDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ErrorCode from '@core/domain/errors/ErrorCode';
import NotificationStudentService from '@core/service/NotificationStudentService';

interface ValidatedInput {
	achievement: Achievement;
	name: string;
	bonusGrade: number;
	studentTerm: StudentTerm;
}
@injectable()
export default class UpdateAchievementHandler extends RequestHandler {
	@inject('AchievementDao') private achievementDao!: IAchievementDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
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
			throw new NotFoundError('achievement not found');
		}
		const term = await this.termDao.findEntityById(termId);
		if (!term) {
			throw new NotFoundError('Term not found');
		}
		const student = await this.studentDao.findEntityById(studentId);
		if (!student) {
			throw new NotFoundError('Student not found');
		}
		const studentTerm = await this.studentTermDao.findOne(termId, studentId);

		if (!studentTerm) {
			throw new ErrorCode('STUDENT_NOT_IN_TERM', `student not in term ${termId}`);
		}
		return {
			achievement,
			name,
			studentTerm,
			bonusGrade,
		};
	}

	async handle(request: Request) {
		const { achievement, name, studentTerm, bonusGrade } = await this.validate(request);

		achievement.update({
			name,
			studentTerm,
			bonusGrade,
		});

		const achievementResult = await this.achievementDao.updateEntity(achievement);

		if (!achievementResult) throw new ErrorCode('FAIL_CREATE_ENTITY', 'Create Achievement fail');
		achievementResult.update({ studentTerm });
		const student = await this.studentDao.findEntityById(achievement.studentTermId);

		await NotificationStudentService.send({
			user: student!,
			message: `Thành tích '${achievement.name}' của bạn vừa được cập nhật`,
			type: 'ACHIEVEMENT',
		});

		return achievementResult.toJSON;
	}
}
