import Transcript from '@core/domain/entities/Transcript';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import TranscriptDaoCore from '@core/infrastructure/objection-js/daos/TranscriptDao';
import ITranscriptDao from '@student/domain/daos/ITranscriptDao';
import { injectable } from 'inversify';

@injectable()
export default class TranscriptDao extends TranscriptDaoCore implements ITranscriptDao {
	async findByStudentAndType(props: { termId: number; studentId: number; type: TypeEvaluation }): Promise<Transcript[]> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		whereClause['student_id'] = props.studentId;
		query.join('evaluation', 'transcript.evaluation_id', '=', 'evaluation.id');
		whereClause['evaluation.type'] = props.type;
		whereClause['evaluation.term_id'] = props.termId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
	async findOne(props: { lecturerId: number; evaluationId: number; studentId: number }): Promise<Transcript | null> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		whereClause['lecturer_id'] = props.lecturerId;
		whereClause['evaluation_id'] = props.evaluationId;
		whereClause['student_id'] = props.studentId;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findAll(props: { termId: number; lecturerId: number; studentId: number }): Promise<Transcript[]> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		whereClause['lecturer_id'] = props.lecturerId;
		whereClause['student_id'] = props.studentId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
