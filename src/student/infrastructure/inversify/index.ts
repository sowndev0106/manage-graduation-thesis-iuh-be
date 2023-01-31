import 'reflect-metadata';
import container from '@core/infrastructure/inversify/index';
import UserDao from '@student/infrastructure/objection-js/daos/UserDao';
import IUserDao from '@student/domain/daos/IUserDao';

container.bind<IUserDao>('UserDao').to(UserDao);

export default container;
