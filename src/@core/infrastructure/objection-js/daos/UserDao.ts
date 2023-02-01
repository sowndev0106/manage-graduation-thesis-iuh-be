import { injectable } from 'inversify';
import Dao from './Dao';
import UserModel from '@core/infrastructure/objection-js/models/User';
import User from '@core/domain/entities/User';
import { QueryBuilder, PartialModelObject } from 'objection';

@injectable()
export default class UserDao extends Dao<User, UserModel> {
	protected initQuery(): QueryBuilder<UserModel, UserModel[]> {
		return UserModel.query();
	}

	convertEntityToPartialModelObject(entity: User) {
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
			level: entity.level,
			majors_id: entity.majorsId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	convertModelToEntity(model: UserModel) {
		const dbJson = model.$toDatabaseJson();
		const entity = User.create(
			{
				username: dbJson['username'],
				avatar: dbJson['avatar'],
				phoneNumber: dbJson['phone_number'],
				password: dbJson['password'],
				email: dbJson['email'],
				name: dbJson['name'],
				gender: dbJson['gender'],
				level: dbJson['level'],
				majorsId: dbJson['majors_id'],
				createdAt: dbJson['created_at'] && new Date(dbJson['created_at']),
				updatedAt: dbJson['updated_at'] && new Date(dbJson['updated_at']),
			},
			Number(dbJson['id'])
		);

		return entity;
	}
}
