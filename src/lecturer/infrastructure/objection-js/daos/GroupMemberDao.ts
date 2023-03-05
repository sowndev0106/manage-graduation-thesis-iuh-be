import GroupMemberDaoCore from '@core/infrastructure/objection-js/daos/GroupMemberDao';
import IGroupMemberDao from '@lecturer/domain/daos/IGroupMemberDao';
import { injectable } from 'inversify';

@injectable()
export default class GroupMemberDao extends GroupMemberDaoCore implements IGroupMemberDao {}
