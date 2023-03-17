import { injectable } from 'inversify';
import Dao from './Dao';
import LecturerTermModel from '@core/infrastructure/objection-js/models/LecturerTermModel';
import LecturerTerm from '@core/domain/entities/LecturerTerm';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';

@injectable()
export default class LecturerTermDao extends Dao<LecturerTerm, LecturerTermModel> {
	protected getModel(): ModelClass<LecturerTermModel> {
		return LecturerTermModel;
	}
	protected convertEntityToPartialModelGraph(entity: LecturerTerm): PartialModelGraph<LecturerTermModel, LecturerTermModel & GraphParameters> {
		throw new Error('Method not implemented.');
	}
	protected initQuery(): QueryBuilder<LecturerTermModel, LecturerTermModel[]> {
		return LecturerTermModel.query();
	}

	convertEntityToPartialModelObject(entity: LecturerTerm) {
		return LecturerTermModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: LecturerTermModel) {
		return LecturerTermModel.convertModelToEntity(model);
	}
}
