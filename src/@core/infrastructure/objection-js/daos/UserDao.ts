import { injectable } from 'inversify';
import Dao from './Dao';
import UserModel from '@core/infrastructure/objection-js/models/UserModel';
import User from '@core/domain/entities/User';
import Objection, { QueryBuilder, PartialModelObject } from 'objection';

@injectable()
export default class UserDao extends Dao<User, UserModel> {
	protected getModel(): Objection.ModelClass<UserModel> {
		return UserModel;
	}
	protected convertEntityToPartialModelGraph(entity: User): Objection.PartialModelGraph<UserModel, UserModel & Objection.GraphParameters> {
		throw new Error('Method not implemented.');
	}
	protected initQuery(): QueryBuilder<UserModel, UserModel[]> {
		return UserModel.query();
	}

	convertEntityToPartialModelObject(entity: User) {
		return UserModel.convertEntityToPartialModelObject(entity);
	}

	convertModelToEntity(model: UserModel) {
		return UserModel.convertModelToEntity(model);
	}
}
