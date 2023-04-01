import IDao from '@core/domain/daos/IDao';
import Transcript from '@core/domain/entities/Transcript';

export default interface ITranscriptDao extends IDao<Transcript> {
	findAll(assignId: number, studentId: number): Promise<Transcript[]>;
	findOne(props: { assignId: number; evaluationId: number; studentId: number }): Promise<Transcript | null>;
}
