import IDao from '@core/domain/daos/IDao';
import RequestJoinGroup, { TypeRequestJoinGroup } from '@core/domain/entities/RequestJoinGroup';

export default interface IRequestJoinGroupDao extends IDao<RequestJoinGroup> {
	deleteByStudentTerm(props: { studentTermId: number }): Promise<any>;
	findOneByGroupIdAndStudentTermId(props: { groupId: number; studentTermId: number }): Promise<RequestJoinGroup | null>;
	findAll(props: { studentTermId?: number; type?: TypeRequestJoinGroup; groupId?: number }): Promise<RequestJoinGroup[]>;
}
