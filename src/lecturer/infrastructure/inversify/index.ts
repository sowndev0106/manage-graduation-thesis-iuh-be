import 'reflect-metadata';
import { Container } from 'inversify';
import ErrorCollector from '@core/infrastructure/utilities/ErrorCollector';
import Nodemailer from '@core/infrastructure/nodemailer';
import IUserDao from '@lecturer/domain/daos/IUserDao';
import IMajorsDao from '@lecturer/domain/daos/IMajorsDao';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';

import StudentDao from '../objection-js/daos/StudentDao';
import MajorsDao from '../objection-js/daos/MajorsDao';
import UserDao from '../objection-js/daos/UserDao';
import LecturerDao from '../objection-js/daos/LecturerDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import TermDao from '../objection-js/daos/TermDao';

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
container.bind<ILecturerDao>('LecturerDao').to(LecturerDao);
container.bind<ITermDao>('TermDao').to(TermDao);

export default container;
