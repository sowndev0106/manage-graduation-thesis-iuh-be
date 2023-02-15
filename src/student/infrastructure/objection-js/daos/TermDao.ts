import TermDaoCore from '@core/infrastructure/objection-js/daos/TermDao';
import ITermDao from '@student/domain/daos/ITermDao';
import { injectable } from 'inversify';

@injectable()
export default class TermDao extends TermDaoCore implements ITermDao {}
