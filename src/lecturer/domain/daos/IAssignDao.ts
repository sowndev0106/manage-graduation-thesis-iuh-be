import IDao from '@core/domain/daos/IDao';
import Assign from '@core/domain/entities/Assign';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';

export default interface IAssignDao extends IDao<Assign> {
	findAll(termId?: number, groupLecturerId?: number, type?: TypeEvaluation, groupId?: number): Promise<Assign[]>;
	findOne(props: { groupLecturerId?: number; type?: TypeEvaluation; groupId?: number }): Promise<Assign | null>;
	findByLecturer(termId: number, lecturerId: number): Promise<Assign[]>;
	findOneExtends(props: { termId: number; lecturerId: number; studentId: number; typeEvaluation: TypeEvaluation }): Promise<Assign | null>;
}
