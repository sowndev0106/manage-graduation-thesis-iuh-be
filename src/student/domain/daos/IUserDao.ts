import IDao from '@core/domain/daos/IDao';
import User from '@core/domain/entities/User';
import { injectable } from 'inversify';

export default interface IUserDao extends IDao<User> {
	findOneByUsernameAndPassword(username: string, password: string): Promise<User | null>;
	findOneByUsername(username: string): Promise<User | null>;
}
