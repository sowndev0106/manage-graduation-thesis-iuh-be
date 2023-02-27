import { injectable } from 'inversify';
import Dao from './Dao';
import TopicModel from '@core/infrastructure/objection-js/models/TopicModel';
import Topic from '@core/domain/entities/Topic';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';

@injectable()
export default class TopicDao extends Dao<Topic, TopicModel> {
	protected getModel(): ModelClass<TopicModel> {
		return TopicModel;
	}
	protected convertEntityToPartialModelGraph(entity: Topic): PartialModelGraph<TopicModel, TopicModel & GraphParameters> {
		throw new Error('Method not implemented.');
	}
	protected initQuery(): QueryBuilder<TopicModel, TopicModel[]> {
		return TopicModel.query();
	}

	convertEntityToPartialModelObject(entity: Topic) {
		return TopicModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: TopicModel) {
		return TopicModel.convertModelToEntity(model);
	}
}
