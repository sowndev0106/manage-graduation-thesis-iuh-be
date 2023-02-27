import { Container } from 'inversify';
import 'reflect-metadata';
import ErrorCollector from '@core/infrastructure/utilities/ErrorCollector';
import Nodemailer from '@core/infrastructure/nodemailer';
import UserDao from '@student/infrastructure/objection-js/daos/UserDao';
import IUserDao from '@student/domain/daos/IUserDao';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import MajorsDao from '@student/infrastructure/objection-js/daos/MajorsDao';
import IStudentDao from '@student/domain/daos/IStudentDao';
import StudentDao from '@student/infrastructure/objection-js/daos/StudentDao';
import TermDao from '../objection-js/daos/TermDao';
import ITermDao from '@student/domain/daos/ITermDao';
import TopicDao from '@lecturer/infrastructure/objection-js/daos/TopicDao';
import ITopicDao from '@lecturer/domain/daos/ITopicDao';

const container = new Container({
	autoBindInjectable: true,
	skipBaseClassChecks: true,
});

// Utilities
container.bind<ErrorCollector>('ErrorCollector').to(ErrorCollector);

// Mail
container.bind<Nodemailer>('Nodemailer').to(Nodemailer);

// Daos
container.bind<IUserDao>('UserDao').to(UserDao);
container.bind<IMajorsDao>('MajorsDao').to(MajorsDao);
container.bind<IStudentDao>('StudentDao').to(StudentDao);
container.bind<ITermDao>('TermDao').to(TermDao);
container.bind<ITopicDao>('TopicDao').to(TopicDao);

export default container;
