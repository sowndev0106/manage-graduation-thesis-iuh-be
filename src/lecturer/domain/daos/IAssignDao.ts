import IDao from '@core/domain/daos/IDao';
import Assign from '@core/domain/entities/Assign';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';

export default interface IAssignDao extends IDao<Assign> {
	findAll(props: { termId?: number; groupLecturerId?: number; type?: TypeEvaluation; groupId?: number }): Promise<Assign[]>;
	findOne(props: { groupLecturerId?: number; type?: TypeEvaluation; groupId?: number }): Promise<Assign | null>;
	findByLecturer(props: { lecturerTermId: number; typeEvaluation?: TypeEvaluation }): Promise<Assign[]>;
	findOneExtends(props: { lecturerTermId: number; studentTermId: number; typeEvaluation: TypeEvaluation }): Promise<Assign | null>;
}
