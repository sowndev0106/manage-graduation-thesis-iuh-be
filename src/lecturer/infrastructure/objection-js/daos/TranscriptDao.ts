import Transcript from '@core/domain/entities/Transcript';
import { TypeEvaluation } from '@core/domain/entities/Evaluation';
import TranscriptDaoCore from '@core/infrastructure/objection-js/daos/TranscriptDao';
import ITranscriptDao from '@lecturer/domain/daos/ITranscriptDao';
import { injectable } from 'inversify';

@injectable()
export default class TranscriptDao extends TranscriptDaoCore implements ITranscriptDao {
	async findAll(assignId: number, studentId: number): Promise<Transcript[]> {
		const query = this.initQuery();

		const whereClause: Record<string, any> = {};

		whereClause['assign_id'] = assignId;
		whereClause['evaluation_id'] = studentId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
