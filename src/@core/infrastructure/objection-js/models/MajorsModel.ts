import Majors from '@core/domain/entities/Majors';
import Objection, { Model } from 'objection';

export default class MajorsModel extends Model {
	static get tableName() {
		return 'majors';
	}

	static relationMappings = {};

	static convertEntityToPartialModelObject(entity: Majors) {
		const model = new MajorsModel();
		model.$set({
			id: entity.id,
			name: entity.name,
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
				createdAt: dbJson['created_at'] && new Date(dbJson['created_at']),
				updatedAt: dbJson['updated_at'] && new Date(dbJson['updated_at']),
			},
			Number(dbJson['id'])
		);

		return entity;
	}
}

module.exports = MajorsModel;
