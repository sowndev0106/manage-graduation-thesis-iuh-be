import { injectable } from 'inversify';
import Dao from './Dao';
import EvaluationDetailModel from '@core/infrastructure/objection-js/models/EvaluationDetailModel';
import EvaluationDetail from '@core/domain/entities/EvaluationDetail';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';

@injectable()
export default class EvaluationDetailDao extends Dao<EvaluationDetail, EvaluationDetailModel> {
	protected getModel(): ModelClass<EvaluationDetailModel> {
		return EvaluationDetailModel;
	}
	protected convertEntityToPartialModelGraph(entity: EvaluationDetail): PartialModelGraph<EvaluationDetailModel, EvaluationDetailModel & GraphParameters> {
		throw new Error('Method not implemented.');
	}
	protected initQuery(): QueryBuilder<EvaluationDetailModel, EvaluationDetailModel[]> {
		return EvaluationDetailModel.query();
	}

	convertEntityToPartialModelObject(entity: EvaluationDetail) {
		return EvaluationDetailModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: EvaluationDetailModel) {
		return EvaluationDetailModel.convertModelToEntity(model);
	}
}
