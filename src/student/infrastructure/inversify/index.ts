import 'reflect-metadata';
import container from '@core/infrastructure/inversify/index';
import UserDao from '@student/infrastructure/objection-js/daos/UserDao';
import IUserDao from '@student/domain/daos/IUserDao';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import MajorsDao from '@student/infrastructure/objection-js/daos/MajorsDao';

container.bind<IUserDao>('UserDao').to(UserDao);
container.bind<IMajorsDao>('MajorsDao').to(MajorsDao);

export default container;
