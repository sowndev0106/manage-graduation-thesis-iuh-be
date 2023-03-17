import LecturerTerm from '@core/domain/entities/LecturerTerm';
import LecturerTermDaoCore from '@core/infrastructure/objection-js/daos/LecturerTermDao';
import ILecturerTermDao from '@student/domain/daos/ILecturerTermDao';
import { injectable } from 'inversify';

@injectable()
export default class LecturerTermDao extends LecturerTermDaoCore implements ILecturerTermDao {}
