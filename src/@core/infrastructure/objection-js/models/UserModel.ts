import UserEntity from '@core/domain/entities/User';
import Objection, { Model } from 'objection';

export default class UserModel extends Model {
	static convertModelToEntity(model: UserModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof UserModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = UserEntity.create(
			{
				username: dbJson['username'],
				avatar: dbJson['avatar'],
				phoneNumber: dbJson['phone_number'],
				password: dbJson['password'],
				email: dbJson['email'],
				name: dbJson['name'],
				gender: dbJson['gender'],
				majorsId: dbJson['majors_id'],
				createdAt: dbJson['created_at'] && new Date(dbJson['created_at']),
				updatedAt: dbJson['updated_at'] && new Date(dbJson['updated_at']),
			},
			Number(dbJson['id'])
		);

		return entity;
	}
	static convertEntityToPartialModelObject(entity: UserEntity) {
		const model = new UserModel();

		model.$set({
			id: entity.id,
			username: entity.username,
			avatar: entity.avatar,
			phone_number: entity.phoneNumber,
			password: entity.password,
			email: entity.email,
			name: entity.name,
			gender: entity.gender,
			majors_id: entity.majorsId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});
		console.log(model);
		return model;
	}
	static get tableName() {
		return 'user';
	}
}
