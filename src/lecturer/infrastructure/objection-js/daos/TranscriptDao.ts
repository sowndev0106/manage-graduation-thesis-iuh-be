import Transcript from '@core/domain/entities/Transcript';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import TranscriptDaoCore from '@core/infrastructure/objection-js/daos/TranscriptDao';
import ITranscriptDao from '@lecturer/domain/daos/ITranscriptDao';
import { injectable } from 'inversify';

@injectable()
export default class TranscriptDao extends TranscriptDaoCore implements ITranscriptDao {
	async findByStudentAndType(props: { termId: number; studentTermId: number; type: TypeEvaluation }): Promise<Transcript[]> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		whereClause['student_term_id'] = props.studentTermId;
		query.join('evaluation', 'transcript.evaluation_id', '=', 'evaluation.id');
		whereClause['evaluation.type'] = props.type;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
	async findOne(props: { lecturerTermId: number; evaluationId: number; studentTermId: number }): Promise<Transcript | null> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		whereClause['lecturer_term_id'] = props.lecturerTermId;
		whereClause['evaluation_id'] = props.evaluationId;
		whereClause['student_term_id'] = props.studentTermId;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findAll(props: { lecturerTermId: number; studentTermId: number }): Promise<Transcript[]> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		whereClause['lecturer_term_id'] = props.lecturerTermId;
		whereClause['student_term_id'] = props.studentTermId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
