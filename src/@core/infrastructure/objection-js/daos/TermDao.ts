import { injectable } from 'inversify';
import Dao from './Dao';
import TermModel from '@core/infrastructure/objection-js/models/TermModel';
import Term from '@core/domain/entities/Term';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';
import ErrorCode from '@core/domain/errors/ErrorCode';

@injectable()
export default class TermDao extends Dao<Term, TermModel> {
	protected getModel(): ModelClass<TermModel> {
		return TermModel;
	}
	protected convertEntityToPartialModelGraph(entity: Term): PartialModelGraph<TermModel, TermModel & GraphParameters> {
		throw new ErrorCode('SERVER', 'Method not implemented.');
	}
	protected initQuery(): QueryBuilder<TermModel, TermModel[]> {
		return TermModel.query();
	}

	convertEntityToPartialModelObject(entity: Term) {
		return TermModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: TermModel) {
		return TermModel.convertModelToEntity(model);
	}
}
