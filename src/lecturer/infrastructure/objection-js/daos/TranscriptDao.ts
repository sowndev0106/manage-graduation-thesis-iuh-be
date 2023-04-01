import Transcript from '@core/domain/entities/Transcript';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import TranscriptDaoCore from '@core/infrastructure/objection-js/daos/TranscriptDao';
import ITranscriptDao from '@lecturer/domain/daos/ITranscriptDao';
import { injectable } from 'inversify';

@injectable()
export default class TranscriptDao extends TranscriptDaoCore implements ITranscriptDao {
	async findOne(props: { assignId: number; evaluationId: number; studentId: number }): Promise<Transcript | null> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		whereClause['assign_id'] = props.assignId;
		whereClause['evaluation_id'] = props.evaluationId;
		whereClause['student_id'] = props.studentId;

		const result = await query.findOne(whereClause);

		return result ? this.convertModelToEntity(result) : null;
	}
	async findAll(assignId: number, studentId: number): Promise<Transcript[]> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		whereClause['assign_id'] = assignId;
		whereClause['student_id'] = studentId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
