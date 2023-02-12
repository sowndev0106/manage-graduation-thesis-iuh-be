import { injectable } from 'inversify';
import Dao from './Dao';
import LecturerModel from '@core/infrastructure/objection-js/models/LecturerModel';
import Lecturer from '@core/domain/entities/Lecturer';
import { GraphParameters, PartialModelGraph, QueryBuilder } from 'objection';

@injectable()
export default class LecturerDao extends Dao<Lecturer, LecturerModel> {
	protected convertEntityToPartialModelGraph(entity: Lecturer): PartialModelGraph<LecturerModel, LecturerModel & GraphParameters> {
		return LecturerModel.convertEntityToPartialModelGraph(entity);
	}
	protected initQuery(): QueryBuilder<LecturerModel, LecturerModel[]> {
		return LecturerModel.query();
	}

	convertEntityToPartialModelObject(entity: Lecturer) {
		return LecturerModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: LecturerModel) {
		const entity = LecturerModel.convertModelToEntity(model);

		return entity;
	}
}
