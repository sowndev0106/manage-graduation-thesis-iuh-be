import IDao from '@core/domain/daos/IDao';
import Assign from '@core/domain/entities/Assign';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';

export default interface IAssignDao extends IDao<Assign> {
	findAll(termId?: number, lecturerId?: number, type?: TypeEvaluation, groupId?: number): Promise<Assign[]>;
	findOne(lecturerId: number, type?: TypeEvaluation, groupId?: number): Promise<Assign | null>;
}
