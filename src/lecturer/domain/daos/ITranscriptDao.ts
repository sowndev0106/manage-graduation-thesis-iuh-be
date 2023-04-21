import IDao from '@core/domain/daos/IDao';
import Transcript from '@core/domain/entities/Transcript';

export default interface ITranscriptDao extends IDao<Transcript> {
	findAll(props: { termId: number; lecturerId: number; studentId: number }): Promise<Transcript[]>;
	findByStudentAndType(props: { termId: number; studentId: number; typ }): Promise<Transcript[]>;
	findOne(props: { lecturerId: number; evaluationId: number; studentId: number }): Promise<Transcript | null>;
}
