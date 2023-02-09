import { injectable } from 'inversify';
import Dao from './Dao';
import StudentModel from '@core/infrastructure/objection-js/models/StudentModel';
import Student from '@core/domain/entities/Student';
import { QueryBuilder } from 'objection';
import UserModel from '../models/UserModel';
import UserDao from './UserDao';
import User from '@core/domain/entities/User';

@injectable()
export default class StudentDao extends Dao<Student, StudentModel> {
	protected initQuery(): QueryBuilder<StudentModel, StudentModel[]> {
		return StudentModel.query();
	}

	convertEntityToPartialModelObject(entity: Student) {
		const model = new StudentModel();
		model.$set({
			id: entity.id,
			type_training: entity.typeTraining,
			school_year: entity.schoolYear,
			user_id: entity.userId,
		});

		return model;
	}

	convertModelToEntity(model: StudentModel) {
		const entity = StudentModel.convertModelToEntity(model);

		return entity;
	}
}
