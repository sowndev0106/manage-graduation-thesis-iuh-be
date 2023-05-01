import { injectable } from 'inversify';
import GroupLecturerMemberDaoCore from '@core/infrastructure/objection-js/daos/GroupLecturerMemberDao';
import IGroupLecturerMemberDao from '@student/domain/daos/IGroupLecturerMemberDao';

@injectable()
export default class GroupLecturerMemberDao extends GroupLecturerMemberDaoCore implements IGroupLecturerMemberDao {}
