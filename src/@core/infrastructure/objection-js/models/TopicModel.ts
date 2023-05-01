import LecturerTerm from '@core/domain/entities/LecturerTerm';
import Objection, { Model } from 'objection';
import LecturerModel from './LecturerModel';
import Topic from '@core/domain/entities/Topic';
import lecturerTermModel from './LecturerTermModel';

export default class TopicModel extends Model {
	static get tableName() {
		return 'topic';
	}

	static relationMappings = {
		lecturer_term: {
			relation: Model.BelongsToOneRelation,
			modelClass: lecturerTermModel,
			join: {
				from: 'topic.lecturer_term_id',
				to: 'lecturer_term.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: Topic) {
		const model = new TopicModel();
		model.$set({
			id: entity.id,
			name: entity.name,
			quantity_group_max: entity.quantityGroupMax,
			description: entity.description,
			note: entity.note,
			target: entity.target,
			standrad_output: entity.standradOutput,
			require_input: entity.requireInput,
			comment: entity.comment,
			status: entity.status,
			lecturer_term_id: entity.lecturerTermId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: TopicModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof TopicModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = Topic.create(
			{
				name: dbJson['name'],
				quantityGroupMax: Number(dbJson['quantity_group_max']),
				description: dbJson['description'],
				note: dbJson['note'],
				target: dbJson['target'],
				standradOutput: dbJson['standrad_output'],
				requireInput: dbJson['require_input'],
				comment: dbJson['comment'],
				status: dbJson['status'],
				lecturerTerm: LecturerTerm.createById(dbJson['lecturer_term_id']),
				createdAt: dbJson['created_at'],
				updatedAt: dbJson['updated_at'],
			},
			Number(dbJson['id'])
		);
		const lecturerTerm = dbJson['lecturer_term'] && lecturerTermModel.convertModelToEntity(dbJson['lecturer_term']);

		lecturerTerm && entity.update({ lecturerTerm });

		return entity;
	}
}

module.exports = TopicModel;
