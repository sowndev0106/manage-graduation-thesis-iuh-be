import { injectable } from 'inversify';
import Dao from './Dao';
import StudentModel from '@core/infrastructure/objection-js/models/StudentModel';
import Student from '@core/domain/entities/Student';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';

@injectable()
export default class StudentDao extends Dao<Student, StudentModel> {
	protected getModel(): ModelClass<StudentModel> {
		return StudentModel;
	}

	protected convertEntityToPartialModelGraph(entity: Student): PartialModelGraph<StudentModel, StudentModel & GraphParameters> {
		const model = StudentModel.convertEntityToPartialModelGraph(entity);

		return model;
	}
	protected initQuery(): QueryBuilder<StudentModel, StudentModel[]> {
		return StudentModel.query();
	}
	convertEntityToPartialModelObject(entity: Student) {
		return StudentModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: StudentModel) {
		const entity = StudentModel.convertModelToEntity(model);

		return entity;
	}
}
