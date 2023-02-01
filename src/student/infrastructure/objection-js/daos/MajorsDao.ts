import Majors from '@core/domain/entities/Majors';
import MajorsDaoCore from '@core/infrastructure/objection-js/daos/MajorsDao';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import MajorsModel from '@core/infrastructure/objection-js/models/Majors';
import { injectable } from 'inversify';

@injectable()
export default class MajorsDao extends MajorsDaoCore implements IMajorsDao {}
