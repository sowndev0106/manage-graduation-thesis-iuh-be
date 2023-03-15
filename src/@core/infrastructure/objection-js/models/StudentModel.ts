import Objection, { Model } from 'objection';
import StudentEntity from '@core/domain/entities/Student';
import Majors from '@core/domain/entities/Majors';
import MajorsModel from './MajorsModel';

export default class StudentModel extends Model {
	static get tableName() {
		return 'student';
	}
	static convertModelToEntity(model: StudentModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof StudentModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = StudentEntity.create(
			{
				typeTraining: dbJson['type_training'],
				schoolYear: dbJson['school_year'],
				username: dbJson['username'],
				avatar: dbJson['avatar'],
				phoneNumber: dbJson['phone_number'],
				password: dbJson['password'],
				email: dbJson['email'],
				name: dbJson['name'],
				gender: dbJson['gender'],
				majors: dbJson['majors_id'] && Majors.createById(dbJson['majors_id']),
				createdAt: dbJson['created_at'] && new Date(dbJson['created_at']),
				updatedAt: dbJson['updated_at'] && new Date(dbJson['updated_at']),
			},
			Number(dbJson['id'])
		);

		const majors = dbJson['majors'] && MajorsModel.convertModelToEntity(dbJson['majors']);

		if (majors) entity.updateMajors(majors);

		return entity;
	}
	static convertEntityToPartialModelObject(entity: StudentEntity) {
		const model = new StudentModel();

		model.$set({
			id: entity.id,
			type_training: entity.typeTraining,
			school_year: entity.schoolYear,
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

		return model;
	}
	static convertEntityToPartialModelGraph(entity: StudentEntity): Object {
		const model = {
			id: entity.id,
			type_training: entity.typeTraining,
			school_year: entity.schoolYear,
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
		};

		return model;
	}
	static relationMappings = {};
}
