import GroupDaoCore from '@core/infrastructure/objection-js/daos/GroupDao';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import { injectable } from 'inversify';

@injectable()
export default class GroupDao extends GroupDaoCore implements IGroupDao {}
