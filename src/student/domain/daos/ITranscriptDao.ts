import IDao from '@core/domain/daos/IDao';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import Transcript from '@core/domain/entities/Transcript';

export default interface ITranscriptDao extends IDao<Transcript> {
	findAll(props: { lecturerTermId: number; studentTermId: number }): Promise<Transcript[]>;
	findByStudentAndType(props: { studentTermId: number; type: TypeEvaluation }): Promise<Transcript[]>;
	findOne(props: { lecturerTermId: number; evaluationId: number; studentTermId: number }): Promise<Transcript | null>;
}
