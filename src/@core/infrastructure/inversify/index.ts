import { Container } from 'inversify';
import 'reflect-metadata';
import ErrorCollector from '@core/infrastructure/utilities/ErrorCollector';
import Nodemailer from '@core/infrastructure/nodemailer';

const container = new Container({
	autoBindInjectable: true,
	skipBaseClassChecks: true,
});

// Utilities
container.bind<ErrorCollector>('ErrorCollector').to(ErrorCollector);

// Mail
container.bind<Nodemailer>('Nodemailer').to(Nodemailer);

// Repositories

// Daos

export default container;
