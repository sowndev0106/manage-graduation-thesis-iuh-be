import { injectable } from 'inversify';
import Dao from './Dao';
import EvaluationModel from '@core/infrastructure/objection-js/models/EvaluationModel';
import Evaluation from '@core/domain/entities/Evaluation';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';
import ErrorCode from '@core/domain/errors/ErrorCode';

@injectable()
export default class EvaluationDao extends Dao<Evaluation, EvaluationModel> {
	protected getModel(): ModelClass<EvaluationModel> {
		return EvaluationModel;
	}
	protected convertEntityToPartialModelGraph(entity: Evaluation): PartialModelGraph<EvaluationModel, EvaluationModel & GraphParameters> {
		throw new ErrorCode('SERVER', 'Method not implemented.');
	}
	protected initQuery(): QueryBuilder<EvaluationModel, EvaluationModel[]> {
		return EvaluationModel.query();
	}

	convertEntityToPartialModelObject(entity: Evaluation) {
		return EvaluationModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: EvaluationModel) {
		return EvaluationModel.convertModelToEntity(model);
	}
}
