import Objection, { Model } from 'objection';
import LecturerEntity from '@core/domain/entities/Lecturer';
import Majors from '@core/domain/entities/Majors';
import MajorsModel from './MajorsModel';

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
				username: dbJson['username'],
				avatar: dbJson['avatar'],
				phoneNumber: dbJson['phone_number'],
				password: dbJson['password'],
				email: dbJson['email'],
				name: dbJson['name'],
				gender: dbJson['gender'],
				majors: dbJson['majors_id'] && Majors.createById(dbJson['majors_id']),
				role: dbJson['role'],
				createdAt: dbJson['created_at'] && new Date(dbJson['created_at']),
				updatedAt: dbJson['updated_at'] && new Date(dbJson['updated_at']),
			},
			Number(dbJson['id'])
		);

		const majors = dbJson['majors'] && MajorsModel.convertModelToEntity(dbJson['majors']);

		if (majors) entity.updateMajors(majors);

		return entity;
	}
	static convertEntityToPartialModelObject(entity: LecturerEntity) {
		const model = new LecturerModel();

		model.$set({
			id: entity.id,
			degree: entity.degree,
			is_admin: entity.isAdmin,
			username: entity.username,
			avatar: entity.avatar,
			phone_number: entity.phoneNumber,
			password: entity.password,
			email: entity.email,
			name: entity.name,
			gender: entity.gender,
			role: entity.role,
			majors_id: entity.majorsId,
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
			username: entity.username,
			avatar: entity.avatar,
			phone_number: entity.phoneNumber,
			password: entity.password,
			email: entity.email,
			name: entity.name,
			gender: entity.gender,
			role: entity.role,
			majors_id: entity.majorsId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		};

		return model;
	}
	static relationMappings = {};
}
