import { injectable } from 'inversify';
import Dao from './Dao';
import MajorsModel from '@core/infrastructure/objection-js/models/MajorsModel';
import Majors from '@core/domain/entities/Majors';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';

@injectable()
export default class MajorsDao extends Dao<Majors, MajorsModel> {
	protected getModel(): ModelClass<MajorsModel> {
		return MajorsModel;
	}
	protected convertEntityToPartialModelGraph(entity: Majors): PartialModelGraph<MajorsModel, MajorsModel & GraphParameters> {
		throw new Error('Method not implemented.');
	}
	protected initQuery(): QueryBuilder<MajorsModel, MajorsModel[]> {
		return MajorsModel.query();
	}

	convertEntityToPartialModelObject(entity: Majors) {
		return MajorsModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: MajorsModel) {
		return MajorsModel.convertModelToEntity(model);
	}
}
