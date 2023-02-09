import { injectable } from 'inversify';
import Dao from './Dao';
import MajorsModel from '@core/infrastructure/objection-js/models/MajorsModel';
import Majors from '@core/domain/entities/Majors';
import { QueryBuilder } from 'objection';

@injectable()
export default class MajorsDao extends Dao<Majors, MajorsModel> {
	protected initQuery(): QueryBuilder<MajorsModel, MajorsModel[]> {
		return MajorsModel.query();
	}

	convertEntityToPartialModelObject(entity: Majors) {
		const model = new MajorsModel();
		model.$set({
			id: entity.id,
			name: entity.name,
		});

		return model;
	}

	convertModelToEntity(model: MajorsModel) {
		const dbJson = model.$toDatabaseJson();
		const entity = Majors.create(
			{
				name: dbJson['name'],
				headLecturerId: dbJson['head_lecturer_id'] && Number(dbJson['head_lecturer_id']),
			},
			Number(dbJson['id'])
		);

		return entity;
	}
}
