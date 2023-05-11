import { injectable } from 'inversify';
import Dao from './Dao';
import GroupModel from '@core/infrastructure/objection-js/models/GroupModel';
import Group from '@core/domain/entities/Group';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';
import ErrorCode from '@core/domain/errors/ErrorCode';

@injectable()
export default class GroupDao extends Dao<Group, GroupModel> {
	protected getModel(): ModelClass<GroupModel> {
		return GroupModel;
	}
	protected convertEntityToPartialModelGraph(entity: Group): PartialModelGraph<GroupModel, GroupModel & GraphParameters> {
		throw new ErrorCode('SERVER', 'Method not implemented.');
	}
	protected initQuery(): QueryBuilder<GroupModel, GroupModel[]> {
		return GroupModel.query();
	}

	convertEntityToPartialModelObject(entity: Group) {
		return GroupModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: GroupModel) {
		return GroupModel.convertModelToEntity(model);
	}
}
