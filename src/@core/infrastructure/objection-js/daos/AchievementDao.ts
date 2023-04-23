import { injectable } from 'inversify';
import Dao from './Dao';
import AchievementModel from '@core/infrastructure/objection-js/models/AchievementModel';
import Achievement from '@core/domain/entities/Achievement';
import { GraphParameters, ModelClass, PartialModelGraph, QueryBuilder } from 'objection';

@injectable()
export default class AchievementDao extends Dao<Achievement, AchievementModel> {
	protected getModel(): ModelClass<AchievementModel> {
		return AchievementModel;
	}
	protected convertEntityToPartialModelGraph(entity: Achievement): PartialModelGraph<AchievementModel, AchievementModel & GraphParameters> {
		throw new Error('Method not implemented.');
	}
	protected initQuery(): QueryBuilder<AchievementModel, AchievementModel[]> {
		return AchievementModel.query();
	}

	convertEntityToPartialModelObject(entity: Achievement) {
		return AchievementModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: AchievementModel) {
		return AchievementModel.convertModelToEntity(model);
	}
}
