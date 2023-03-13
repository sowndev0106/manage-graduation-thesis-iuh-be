import IDao from '@core/domain/daos/IDao';
import RequestJoinGroup, { TypeRquestJoinGroup } from '@core/domain/entities/RequestJoinGroup';

export default interface IRequestJoinGroupDao extends IDao<RequestJoinGroup> {
	findAllByGroupIdAndType(groupId: number, type: TypeRquestJoinGroup): Promise<RequestJoinGroup[]>;
	findByGroupIdAndStudentId(groupId: number, studentId: number): Promise<RequestJoinGroup | null>;
	findAllByStudentIdAndType(studentId: number, type: TypeRquestJoinGroup): Promise<RequestJoinGroup[]>;
}
