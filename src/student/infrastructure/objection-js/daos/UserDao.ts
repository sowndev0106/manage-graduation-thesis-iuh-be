import User from '@core/domain/entities/User';
import UserDaoCore from '@core/infrastructure/objection-js/daos/UserDao';
import IUserDao from '@student/domain/daos/IUserDao';
import UserModel from '@core/infrastructure/objection-js/models/UserModel';
import { injectable } from 'inversify';

@injectable()
export default class UserDao extends UserDaoCore implements IUserDao {
	async findOneByUsername(username: string): Promise<User | null> {
		const query = this.initQuery();

		const model = await query.findOne({
			username: username,
		});

		const entity = model ? this.convertModelToEntity(model) : null;

		return entity;
	}
	async findOneByUsernameAndPassword(username: string, password: string): Promise<User | null> {
		const query = this.initQuery();

		const model = await query.findOne({
			username: username,
			password: password,
		});

		const entity = model ? this.convertModelToEntity(model) : null;

		return entity;
	}
}
