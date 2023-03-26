import Evaluation from '@core/domain/entities/Evaluation';
import Objection, { Model } from 'objection';
import LecturerModel from './LecturerModel';
import Term from '@core/domain/entities/Term';
import TermModel from './TermModel';

export default class EvaluationModel extends Model {
	static get tableName() {
		return 'evaluation';
	}

	static relationMappings = {
		term: {
			relation: Model.BelongsToOneRelation,
			modelClass: LecturerModel,
			join: {
				from: 'evaluation.term_id',
				to: 'term.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: Evaluation) {
		const model = new EvaluationModel();
		model.$set({
			id: entity.id,
			type: entity.type,
			term_id: entity.termId,
			name: entity.name,
			grade_max: entity.gradeMax,
			description: entity.description,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: EvaluationModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof EvaluationModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = Evaluation.create(
			{
				name: dbJson['name'],
				gradeMax: dbJson['grade_max'],
				description: dbJson['description'],
				type: dbJson['type'],
				term: Term.createById(dbJson['term_id']),
			},
			Number(dbJson['id'])
		);
		const term = dbJson['term'] && TermModel.convertModelToEntity(dbJson['term']);

		if (term) entity.update({ term });

		return entity;
	}
}

module.exports = EvaluationModel;
