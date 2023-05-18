import { injectable } from 'inversify';
import Dao from './Dao';
import NotificationStudentModel from '@core/infrastructure/objection-js/models/NotificationStudentModel';
import NotificationStudent from '@core/domain/entities/NotificationStudent';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';
import ErrorCode from '@core/domain/errors/ErrorCode';

@injectable()
export default class NotificationStudentDao extends Dao<NotificationStudent, NotificationStudentModel> {
	protected getModel(): ModelClass<NotificationStudentModel> {
		return NotificationStudentModel;
	}

	protected convertEntityToPartialModelGraph(
		entity: NotificationStudent
	): PartialModelGraph<NotificationStudentModel, NotificationStudentModel & GraphParameters> {
		throw new ErrorCode('SERVER', 'Method not implemented.');
	}
	protected initQuery(): QueryBuilder<NotificationStudentModel, NotificationStudentModel[]> {
		return NotificationStudentModel.query();
	}

	convertEntityToPartialModelObject(entity: NotificationStudent) {
		return NotificationStudentModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: NotificationStudentModel) {
		return NotificationStudentModel.convertModelToEntity(model);
	}
}
