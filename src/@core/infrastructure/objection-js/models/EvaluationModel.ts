import Evaluation from '@core/domain/entities/Evaluation';
import Objection, { Model } from 'objection';
import LecturerModel from './LecturerModel';
import Term from '@core/domain/entities/Term';
import TermModel from './TermModel';
import EvaluationDetailModel from './EvaluationDetailModel';

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
		details: {
			relation: Model.HasManyRelation,
			modelClass: EvaluationDetailModel,
			join: {
				from: 'evaluation.id',
				to: 'evaluation_detail.evaluation_id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: Evaluation) {
		const model = new EvaluationModel();
		model.$set({
			id: entity.id,
			type: entity.type,
			term_id: entity.termId,
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
				type: dbJson['type'],
				term: Term.createById(dbJson['term_id']),
			},
			Number(dbJson['id'])
		);
		const term = dbJson['term'] && TermModel.convertModelToEntity(dbJson['term']);
		const details = dbJson['details'] && dbJson['details'].map((e: any) => EvaluationDetailModel.convertModelToEntity(e));

		if (term) entity.update({ term });
		if (details) entity.update({ details });

		return entity;
	}
}

module.exports = EvaluationModel;
