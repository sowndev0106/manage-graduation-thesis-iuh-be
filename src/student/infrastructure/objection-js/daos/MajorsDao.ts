import MajorsDaoCore from '@core/infrastructure/objection-js/daos/MajorsDao';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import { injectable } from 'inversify';

@injectable()
export default class MajorsDao extends MajorsDaoCore implements IMajorsDao {}
