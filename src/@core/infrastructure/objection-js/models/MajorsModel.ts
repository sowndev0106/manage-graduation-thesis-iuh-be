import Lecturer from '@core/domain/entities/Lecturer';
import Majors from '@core/domain/entities/Majors';
import Objection, { Model } from 'objection';
import LecturerModel from './LecturerModel';

export default class MajorsModel extends Model {
	static get tableName() {
		return 'majors';
	}

	static relationMappings = {
		head_lecturer: {
			relation: Model.BelongsToOneRelation,
			modelClass: LecturerModel,
			join: {
				from: 'majors.head_lecturer_id',
				to: 'lecturer.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: Majors) {
		const model = new MajorsModel();
		model.$set({
			id: entity.id,
			name: entity.name,
			head_lecturer_id: entity.headLecturerId,
		});

		return model;
	}

	static convertModelToEntity(model: MajorsModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof MajorsModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = Majors.create(
			{
				name: dbJson['name'],
				headLecturer: dbJson['head_lecturer_id'] && Lecturer.createById(dbJson['head_lecturer_id']),
			},
			Number(dbJson['id'])
		);
		const headLecturer = dbJson['head_lecturer'] && LecturerModel.convertEntityToPartialModelObject(dbJson['head_lecturer']);

		if (headLecturer) entity.updateheadLecturer(headLecturer);

		return entity;
	}
}

module.exports = MajorsModel;
