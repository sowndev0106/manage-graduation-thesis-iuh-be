import { injectable } from 'inversify';
import Dao from './Dao';
import TranscriptModel from '@core/infrastructure/objection-js/models/TranscriptModel';
import Transcript from '@core/domain/entities/Transcript';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';
import ErrorCode from '@core/domain/errors/ErrorCode';

@injectable()
export default class TranscriptDao extends Dao<Transcript, TranscriptModel> {
	protected getModel(): ModelClass<TranscriptModel> {
		return TranscriptModel;
	}
	protected convertEntityToPartialModelGraph(entity: Transcript): PartialModelGraph<TranscriptModel, TranscriptModel & GraphParameters> {
		throw new ErrorCode('SERVER', 'Method not implemented.');
	}
	protected initQuery(): QueryBuilder<TranscriptModel, TranscriptModel[]> {
		return TranscriptModel.query();
	}

	convertEntityToPartialModelObject(entity: Transcript) {
		return TranscriptModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: TranscriptModel) {
		return TranscriptModel.convertModelToEntity(model);
	}
}
