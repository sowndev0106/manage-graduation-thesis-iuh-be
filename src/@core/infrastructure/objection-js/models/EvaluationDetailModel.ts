import Objection, { Model } from 'objection';
import EvaluationDetail from '@core/domain/entities/EvaluationDetail';
import GroupModel from './GroupModel';
import StudentModel from './StudentModel';
import Evaluation from '@core/domain/entities/Evaluation';
import EvaluationModel from './EvaluationModel';

export default class EvaluationDetailModel extends Model {
	static get tableName() {
		return 'evaluation_detail';
	}

	static relationMappings = {
		evaluation: {
			relation: Model.BelongsToOneRelation,
			modelClass: StudentModel,
			join: {
				from: 'evaluation_detail.student_id',
				to: 'student.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: EvaluationDetail) {
		const model = new EvaluationDetailModel();
		model.$set({
			id: entity.id,
			name: entity.name,
			grade_max: entity.gradeMax,
			evaluation_id: entity.evaluationId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: EvaluationDetailModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof EvaluationDetailModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = EvaluationDetail.create(
			{
				name: dbJson['name'],
				gradeMax: dbJson['gradeMax'],
				evaluation: Evaluation.createById(dbJson['evaluation_id']),
			},
			Number(dbJson['id'])
		);
		const evaluation = dbJson['evaluation'] && EvaluationModel.convertModelToEntity(dbJson['evaluation']);

		if (evaluation) entity.update({ evaluation });

		return entity;
	}
}

module.exports = EvaluationDetailModel;
