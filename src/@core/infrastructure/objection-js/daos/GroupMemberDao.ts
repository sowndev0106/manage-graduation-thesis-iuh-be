import { injectable } from 'inversify';
import Dao from './Dao';
import GroupMemberModel from '@core/infrastructure/objection-js/models/GroupMemberModel';
import GroupMember from '@core/domain/entities/GroupMember';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';

@injectable()
export default class GroupMemberDao extends Dao<GroupMember, GroupMemberModel> {
	protected getModel(): ModelClass<GroupMemberModel> {
		return GroupMemberModel;
	}
	protected convertEntityToPartialModelGraph(entity: GroupMember): PartialModelGraph<GroupMemberModel, GroupMemberModel & GraphParameters> {
		throw new Error('Method not implemented.');
	}
	protected initQuery(): QueryBuilder<GroupMemberModel, GroupMemberModel[]> {
		return GroupMemberModel.query();
	}

	convertEntityToPartialModelObject(entity: GroupMember) {
		return GroupMemberModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: GroupMemberModel) {
		return GroupMemberModel.convertModelToEntity(model);
	}
}
