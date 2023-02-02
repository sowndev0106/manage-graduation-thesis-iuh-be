import { injectable } from 'inversify';
import Dao from './Dao';
import StudentModel from '@core/infrastructure/objection-js/models/Student';
import Student from '@core/domain/entities/Student';
import { QueryBuilder } from 'objection';

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
		// console.log(model);
		const dbJson = model.$toDatabaseJson();
		const entity = Student.create(
			{
				typeTraining: dbJson['type_training'],
				schoolYear: dbJson['school_year'],
				user: dbJson['user_id'] && Number(dbJson['user_id']),
			},
			Number(dbJson['id'])
		);
		console.log(dbJson['user']);

		return entity;
	}
}
