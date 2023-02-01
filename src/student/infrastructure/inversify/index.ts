import 'reflect-metadata';
import container from '@core/infrastructure/inversify/index';
import UserDao from '@student/infrastructure/objection-js/daos/UserDao';
import IUserDao from '@student/domain/daos/IUserDao';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import MajorsDao from '@student/infrastructure/objection-js/daos/MajorsDao';
import IStudentDao from '@student/domain/daos/IStudentDao';
import StudentDao from '@student/infrastructure/objection-js/daos/StudentDao';

container.bind<IUserDao>('UserDao').to(UserDao);
container.bind<IMajorsDao>('MajorsDao').to(MajorsDao);
container.bind<IStudentDao>('StudentDao').to(StudentDao);

export default container;
