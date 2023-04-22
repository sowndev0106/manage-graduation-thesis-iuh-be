import IDao from '@core/domain/daos/IDao';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import Transcript from '@core/domain/entities/Transcript';

export default interface ITranscriptDao extends IDao<Transcript> {
	findByStudentAndType(props: { termId: number; studentId: number; type: TypeEvaluation }): Promise<Transcript[]>;
}
