import { injectable } from 'inversify';
import GroupLecturerDaoCore from '@core/infrastructure/objection-js/daos/GroupLecturerDao';
import IGroupLecturerDao from '@student/domain/daos/IGroupLecturerDao';

@injectable()
export default class GroupLecturerDao extends GroupLecturerDaoCore implements IGroupLecturerDao {}
