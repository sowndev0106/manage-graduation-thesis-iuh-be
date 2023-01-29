import { injectable } from 'inversify';
import Dao from './Dao';
import RoleModel from '@core/infrastructure/objection-js/models/Role';
import Role from '@core/domain/entities/Role';
import { QueryBuilder, PartialModelObject } from 'objection';

@injectable()
export default class RoleDao extends Dao<Role, RoleModel> {
	protected initQuery(): QueryBuilder<RoleModel, RoleModel[]> {
		return RoleModel.query();
	}

	convertEntityToPartialModelObject(entity: Role) {
		const model = new RoleModel();
		model.$set({
			id: entity.id,
			name: entity.name,
		})

		return model;
	}

	convertModelToEntity(model: RoleModel) {
		const dbJson = model.$toDatabaseJson();
		const entity = Role.create(
			{		
				name: dbJson["name"] ,
			},
			Number(dbJson['id'])
		);
		
		return entity;
	}
}
