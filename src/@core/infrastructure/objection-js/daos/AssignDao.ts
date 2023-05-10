import { injectable } from 'inversify';
import Dao from './Dao';
import AssignModel from '@core/infrastructure/objection-js/models/AssignModel';
import Assign from '@core/domain/entities/Assign';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';
import ErrorCode from '@core/domain/errors/ErrorCode';

@injectable()
export default class AssignDao extends Dao<Assign, AssignModel> {
	protected getModel(): ModelClass<AssignModel> {
		return AssignModel;
	}
	protected convertEntityToPartialModelGraph(entity: Assign): PartialModelGraph<AssignModel, AssignModel & GraphParameters> {
		throw new ErrorCode('SERVER', 'Method not implemented.');
	}
	protected initQuery(): QueryBuilder<AssignModel, AssignModel[]> {
		return AssignModel.query();
	}

	convertEntityToPartialModelObject(entity: Assign) {
		return AssignModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: AssignModel) {
		return AssignModel.convertModelToEntity(model);
	}
}
