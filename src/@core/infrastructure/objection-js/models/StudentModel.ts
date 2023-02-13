import Objection, { Model } from 'objection';
import StudentEntity from '@core/domain/entities/Student';
import UserEntity from '@core/domain/entities/User';
import UserModel from './UserModel';
import User from './UserModel';

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
				user: dbJson['user_id'] && UserEntity.createById(Number(dbJson['user_id'])),
				createdAt: dbJson['created_at'] && new Date(dbJson['created_at']),
				updatedAt: dbJson['updated_at'] && new Date(dbJson['updated_at']),
			},
			Number(dbJson['id'])
		);

		const user = dbJson['user'] && UserModel.convertEntityToPartialModelObject(dbJson['user']);

		if (user) entity.updateUser(user);

		return entity;
	}
	static convertEntityToPartialModelObject(entity: StudentEntity) {
		const model = new StudentModel();

		model.$set({
			id: entity.id,
			type_training: entity.typeTraining,
			school_year: entity.schoolYear,
			user_id: entity.userId,
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
				from: 'student.user_id',
				to: 'user.id',
			},
		},
	};
}
