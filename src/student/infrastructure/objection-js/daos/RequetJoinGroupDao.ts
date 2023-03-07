import RequestJoinGroup from '@core/domain/entities/RequestJoinGroup';
import RequestJoinGroupDaoCore from '@core/infrastructure/objection-js/daos/RequestJoinGroupDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import { injectable } from 'inversify';

@injectable()
export default class RequestJoinGroupDao extends RequestJoinGroupDaoCore implements IRequestJoinGroupDao {}
