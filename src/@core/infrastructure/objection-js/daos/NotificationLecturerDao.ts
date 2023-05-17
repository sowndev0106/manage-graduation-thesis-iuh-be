import { injectable } from 'inversify';
import Dao from './Dao';
import NotificationLecturerModel from '@core/infrastructure/objection-js/models/NotificationLecturerModel';
import NotificationLecturer from '@core/domain/entities/NotificationLecturer';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';
import ErrorCode from '@core/domain/errors/ErrorCode';

@injectable()
export default class NotificationLecturerDao extends Dao<NotificationLecturer, NotificationLecturerModel> {
	protected getModel(): ModelClass<NotificationLecturerModel> {
		return NotificationLecturerModel;
	}
	protected convertEntityToPartialModelGraph(
		entity: NotificationLecturer
	): PartialModelGraph<NotificationLecturerModel, NotificationLecturerModel & GraphParameters> {
		throw new ErrorCode('SERVER', 'Method not implemented.');
	}
	protected initQuery(): QueryBuilder<NotificationLecturerModel, NotificationLecturerModel[]> {
		return NotificationLecturerModel.query();
	}

	convertEntityToPartialModelObject(entity: NotificationLecturer) {
		return NotificationLecturerModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: NotificationLecturerModel) {
		return NotificationLecturerModel.convertModelToEntity(model);
	}
}
