import { injectable } from 'inversify';
import Dao from './Dao';
import GroupLecturerMemberModel from '@core/infrastructure/objection-js/models/GroupLecturerMemberModel';
import GroupLecturerMember from '@core/domain/entities/GroupLecturerMember';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';
import ErrorCode from '@core/domain/errors/ErrorCode';

@injectable()
export default class GroupLecturerMemberDao extends Dao<GroupLecturerMember, GroupLecturerMemberModel> {
	protected getModel(): ModelClass<GroupLecturerMemberModel> {
		return GroupLecturerMemberModel;
	}
	protected convertEntityToPartialModelGraph(
		entity: GroupLecturerMember
	): PartialModelGraph<GroupLecturerMemberModel, GroupLecturerMemberModel & GraphParameters> {
		throw new ErrorCode('SERVER', 'Method not implemented.');
	}
	protected initQuery(): QueryBuilder<GroupLecturerMemberModel, GroupLecturerMemberModel[]> {
		return GroupLecturerMemberModel.query();
	}

	convertEntityToPartialModelObject(entity: GroupLecturerMember) {
		return GroupLecturerMemberModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: GroupLecturerMemberModel) {
		return GroupLecturerMemberModel.convertModelToEntity(model);
	}
}
