import { injectable } from 'inversify';
import Dao from './Dao';
import StudentTermModel from '@core/infrastructure/objection-js/models/StudentTermModel';
import StudentTerm from '@core/domain/entities/StudentTerm';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';

@injectable()
export default class StudentTermDao extends Dao<StudentTerm, StudentTermModel> {
	protected getModel(): ModelClass<StudentTermModel> {
		return StudentTermModel;
	}
	protected convertEntityToPartialModelGraph(entity: StudentTerm): PartialModelGraph<StudentTermModel, StudentTermModel & GraphParameters> {
		throw new Error('Method not implemented.');
	}
	protected initQuery(): QueryBuilder<StudentTermModel, StudentTermModel[]> {
		return StudentTermModel.query();
	}

	convertEntityToPartialModelObject(entity: StudentTerm) {
		return StudentTermModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: StudentTermModel) {
		return StudentTermModel.convertModelToEntity(model);
	}
}
