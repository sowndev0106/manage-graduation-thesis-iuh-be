import IDao from '@core/domain/daos/IDao';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import Transcript from '@core/domain/entities/Transcript';

export default interface ITranscriptDao extends IDao<Transcript> {
	findAll(props: { termId: number; lecturerId: number; studentId: number }): Promise<Transcript[]>;
<<<<<<< HEAD
	findByStudentAndType(props: { termId: number; studentId: number; typ }): Promise<Transcript[]>;
=======
	findByStudentAndType(props: { termId: number; studentId: number; type: TypeEvaluation }): Promise<Transcript[]>;
>>>>>>> 137e7f664aa0d6aba4b95b5b1f2c7e9999e4cefd
	findOne(props: { lecturerId: number; evaluationId: number; studentId: number }): Promise<Transcript | null>;
}
