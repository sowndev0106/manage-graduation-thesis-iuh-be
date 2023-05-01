import Achievement from '@core/domain/entities/Achievement';
import Objection, { Model } from 'objection';
import StudentModel from './StudentModel';
import Student from '@core/domain/entities/Student';
import TermModel from './TermModel';
import Term from '@core/domain/entities/Term';
import StudentTerm from '@core/domain/entities/StudentTerm';
import StudentTermModel from './StudentTermModel';

export default class AchievementModel extends Model {
	static get tableName() {
		return 'achievement';
	}
	static relationMappings = {
		student_term: {
			relation: Model.BelongsToOneRelation,
			modelClass: StudentTermModel,
			join: {
				from: 'achievement.student_term_id',
				to: 'student_term.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: Achievement) {
		const model = new AchievementModel();
		model.$set({
			id: entity.id,
			student_term_id: entity.studentTermId,
			name: entity.name,
			bonus_grade: entity.bonusGrade,
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
				studentTerm: StudentTerm.createById(dbJson['student_term_id']),
			},
			Number(dbJson['id'])
		);

		const studentTerm = dbJson['student_term'] && StudentModel.convertModelToEntity(dbJson['student_term']);
		if (studentTerm) entity.update({ studentTerm });

		return entity;
	}
}

module.exports = AchievementModel;
