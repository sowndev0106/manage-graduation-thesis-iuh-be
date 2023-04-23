import Achievement from '@core/domain/entities/Achievement';
import Objection, { Model } from 'objection';
import StudentModel from './StudentModel';
import Student from '@core/domain/entities/Student';
import TermModel from './TermModel';
import Term from '@core/domain/entities/Term';

export default class AchievementModel extends Model {
	static get tableName() {
		return 'achievement';
	}
	static relationMappings = {
		student: {
			relation: Model.BelongsToOneRelation,
			modelClass: StudentModel,
			join: {
				from: 'achievement.student_id',
				to: 'student.id',
			},
		},
		term: {
			relation: Model.BelongsToOneRelation,
			modelClass: TermModel,
			join: {
				from: 'achievement.term_id',
				to: 'term.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: Achievement) {
		const model = new AchievementModel();
		model.$set({
			id: entity.id,
			student_id: entity.studentId,
			name: entity.name,
			bonus_grade: entity.bonusGrade,
			term_id: entity.termId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: AchievementModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof AchievementModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = Achievement.create(
			{
				name: dbJson['name'],
				bonusGrade: dbJson['bonus_grade'],
				student: Student.createById(dbJson['student_id']),
				term: Term.createById(dbJson['term_id']),
			},
			Number(dbJson['id'])
		);

		const student = dbJson['student'] && StudentModel.convertModelToEntity(dbJson['student']);
		if (student) entity.update({ student });

		const term = dbJson['term'] && StudentModel.convertModelToEntity(dbJson['term']);
		if (term) entity.update({ term });

		return entity;
	}
}

module.exports = AchievementModel;
