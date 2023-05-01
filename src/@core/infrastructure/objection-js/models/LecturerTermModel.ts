import Objection, { Model } from 'objection';
import lecturerTerm from '@core/domain/entities/LecturerTerm';
import TermModel from './TermModel';
import lecturerModel from './LecturerModel';
import Term from '@core/domain/entities/Term';
import Lecturer from '@core/domain/entities/Lecturer';

export default class lecturerTermModel extends Model {
	static get tableName() {
		return 'lecturer_term';
	}

	static relationMappings = {
		lecturer: {
			relation: Model.BelongsToOneRelation,
			modelClass: lecturerModel,
			join: {
				from: 'lecturer_term.lecturer_id',
				to: 'lecturer.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: lecturerTerm) {
		const model = new lecturerTermModel();
		model.$set({
			id: entity.id,
			term_id: entity.termId,
			lecturer_id: entity.lecturerId,
			role: entity.role,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: lecturerTermModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof lecturerTermModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = lecturerTerm.create(
			{
				term: Term.createById(dbJson['term_id']),
				lecturer: Lecturer.createById(dbJson['lecturer_id']),
				role: dbJson['role'],
			},
			Number(dbJson['id'])
		);
		const lecturer = dbJson['lecturer'] && lecturerModel.convertModelToEntity(dbJson['lecturer']);

		if (lecturer) entity.update({ lecturer });

		return entity;
	}
}

module.exports = lecturerTermModel;
