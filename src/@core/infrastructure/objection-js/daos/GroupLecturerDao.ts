import { injectable } from 'inversify';
import Dao from './Dao';
import GroupLecturerModel from '@core/infrastructure/objection-js/models/GroupLecturerModel';
import GroupLecturer from '@core/domain/entities/GroupLecturer';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';

@injectable()
export default class GroupLecturerDao extends Dao<GroupLecturer, GroupLecturerModel> {
	protected getModel(): ModelClass<GroupLecturerModel> {
		return GroupLecturerModel;
	}
	protected convertEntityToPartialModelGraph(entity: GroupLecturer): PartialModelGraph<GroupLecturerModel, GroupLecturerModel & GraphParameters> {
		throw new Error('Method not implemented.');
	}
	protected initQuery(): QueryBuilder<GroupLecturerModel, GroupLecturerModel[]> {
		return GroupLecturerModel.query();
	}

	convertEntityToPartialModelObject(entity: GroupLecturer) {
		return GroupLecturerModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: GroupLecturerModel) {
		return GroupLecturerModel.convertModelToEntity(model);
	}
}
