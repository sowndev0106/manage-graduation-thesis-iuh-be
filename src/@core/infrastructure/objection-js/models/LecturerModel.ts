import Objection, { Model } from 'objection';
import LecturerEntity from '@core/domain/entities/Lecturer';
import UserEntity from '@core/domain/entities/User';
import UserModel from './UserModel';
import User from './UserModel';

export default class LecturerModel extends Model {
	static get tableName() {
		return 'lecturer';
	}
	static convertModelToEntity(model: LecturerModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof LecturerModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = LecturerEntity.create(
			{
				degree: dbJson['degree'],
				isAdmin: dbJson['is_admin'] == 1,
				user: dbJson['user_id'] && UserEntity.createById(Number(dbJson['user_id'])),
				createdAt: dbJson['created_at'] && new Date(dbJson['created_at']),
				updatedAt: dbJson['updated_at'] && new Date(dbJson['updated_at']),
			},
			Number(dbJson['id'])
		);

		const user = dbJson['user'] && UserModel.convertModelToEntity(dbJson['user']);

		if (user) entity.updateUser(user);

		return entity;
	}
	static convertEntityToPartialModelObject(entity: LecturerEntity) {
		const model = new LecturerModel();

		model.$set({
			id: entity.id,
			degree: entity.degree,
			is_admin: entity.isAdmin,
			user_id: entity.userId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}
	static convertEntityToPartialModelGraph(entity: LecturerEntity): Object {
		const model = {
			id: entity.id,
			degree: entity.degree,
			is_admin: entity.isAdmin,
			user: UserModel.convertEntityToPartialModelObject(entity.user),
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		};

		return model;
	}
	static relationMappings = {
		user: {
			relation: Model.HasOneRelation,
			modelClass: User,
			join: {
				from: 'lecturer.user_id',
				to: 'user.id',
			},
		},
	};
}
