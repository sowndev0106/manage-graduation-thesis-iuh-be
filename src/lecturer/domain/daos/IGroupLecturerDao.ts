import IDao from '@core/domain/daos/IDao';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import GroupLecturer from '@core/domain/entities/GroupLecturer';

export default interface IGroupLecturerDao extends IDao<GroupLecturer> {
	findOne(props: { termId: number; name?: string }): Promise<GroupLecturer | null>;
	findAll(props: { termId: number; name?: string; groupId: number; type: TypeEvaluation }): Promise<GroupLecturer[]>;
}
