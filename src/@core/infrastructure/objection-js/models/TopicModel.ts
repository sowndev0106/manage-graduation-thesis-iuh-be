import Lecturer from '@core/domain/entities/Lecturer';
import Majors from '@core/domain/entities/Majors';
import Term from '@core/domain/entities/Term';
import Topic from '@core/domain/entities/Topic';
import Objection, { Model } from 'objection';
import LecturerModel from './LecturerModel';
import TermModel from './TermModel';

export default class TopicModel extends Model {
	static get tableName() {
		return 'topic';
	}

	static relationMappings = {
		lecturer: {
			relation: Model.BelongsToOneRelation,
			modelClass: LecturerModel,
			join: {
				from: 'topic.lecturer_id',
				to: 'lecturer.id',
			},
		},
		term: {
			relation: Model.BelongsToOneRelation,
			modelClass: TermModel,
			join: {
				from: 'topic.term_id',
				to: 'term.id',
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
			lecturer_id: entity.lecturerId,
			term_id: entity.term.id,
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
				lecturer: Lecturer.createById(dbJson['lecturer_id']),
				term: Term.createById(dbJson['term_id']),
				createdAt: dbJson['created_at'],
				updatedAt: dbJson['updated_at'],
			},
			Number(dbJson['id'])
		);
		const lecutrer = dbJson['lecturer'] && LecturerModel.convertModelToEntity(dbJson['lecturer']);

		lecutrer && entity.updateLecturer(lecutrer);

		const term = dbJson['term'] && TermModel.convertModelToEntity(dbJson['term']);

		term && entity.updateTerm(term);

		return entity;
	}
}

module.exports = TopicModel;
