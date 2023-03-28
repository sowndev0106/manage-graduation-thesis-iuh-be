import IDao from '@core/domain/daos/IDao';
import RequestJoinGroup, { TypeRequestJoinGroup } from '@core/domain/entities/RequestJoinGroup';

export default interface IRequestJoinGroupDao extends IDao<RequestJoinGroup> {}
