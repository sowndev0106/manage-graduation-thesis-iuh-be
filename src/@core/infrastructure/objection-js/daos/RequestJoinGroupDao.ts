import { injectable } from 'inversify';
import Dao from './Dao';
import RequestJoinGroupModel from '@core/infrastructure/objection-js/models/RequestJoinGroupModel';
import RequestJoinGroup from '@core/domain/entities/RequestJoinGroup';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';

@injectable()
export default class RequestJoinGroupDao extends Dao<RequestJoinGroup, RequestJoinGroupModel> {
	protected getModel(): ModelClass<RequestJoinGroupModel> {
		return RequestJoinGroupModel;
	}
	protected convertEntityToPartialModelGraph(entity: RequestJoinGroup): PartialModelGraph<RequestJoinGroupModel, RequestJoinGroupModel & GraphParameters> {
		throw new Error('Method not implemented.');
	}
	protected initQuery(): QueryBuilder<RequestJoinGroupModel, RequestJoinGroupModel[]> {
		return RequestJoinGroupModel.query();
	}

	convertEntityToPartialModelObject(entity: RequestJoinGroup) {
		return RequestJoinGroupModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: RequestJoinGroupModel) {
		return RequestJoinGroupModel.convertModelToEntity(model);
	}
}
