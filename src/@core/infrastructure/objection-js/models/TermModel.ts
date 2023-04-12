import Majors from '@core/domain/entities/Majors';
import Term from '@core/domain/entities/Term';
import Objection, { Model } from 'objection';
import MajorsModel from './MajorsModel';

export default class TermModel extends Model {
	static get tableName() {
		return 'term';
	}
	static convertModelToEntity(model: TermModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof TermModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = Term.create(
			{
				name: dbJson['name'],
				startDate: dbJson['start_date'],
				endDate: dbJson['end_date'],
				startDateSubmitTopic: dbJson['start_date_submit_topic'],
				endDateSubmitTopic: dbJson['end_date_submit_topic'],
				startDateChooseTopic: dbJson['start_date_choose_topic'],
				endDateChooseTopic: dbJson['end_date_choose_topic'],
				startDateDiscussion: dbJson['start_date_discussion'],
				endDateDiscussion: dbJson['end_date_discussion'],
				startDateReport: dbJson['start_date_report'],
				endDateReport: dbJson['end_date_report'],
				isPublicResult: dbJson['is_public_result'],
				majors: dbJson['majors_id'] && Majors.createById(Number(dbJson['majors_id'])),
				createdAt: dbJson['created_at'],
				updatedAt: dbJson['updated_at'],
			},
			Number(dbJson['id'])
		);

		const majors = dbJson['majors'] && MajorsModel.convertEntityToPartialModelObject(dbJson['majors']);

		if (majors) entity.updateMajors(majors);

		return entity;
	}
	static convertEntityToPartialModelObject(entity: Term) {
		const model = new TermModel();

		model.$set({
			id: entity.id,
			name: entity.name,
			majors_id: entity.majorsId,
			start_date: entity.startDate,
			end_date: entity.endDate,
			start_date_submit_topic: entity.startDateSubmitTopic,
			end_date_submit_topic: entity.endDateSubmitTopic,
			start_date_choose_topic: entity.startDateChooseTopic,
			end_date_choose_topic: entity.endDateChooseTopic,
			start_date_discussion: entity.startDateDiscussion,
			end_date_discussion: entity.endDateDiscussion,
			start_date_report: entity.startDateReport,
			end_date_report: entity.endDateReport,
			is_public_result: entity.isPublicResult,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}
	static relationMappings = {
		majors: {
			relation: Model.HasOneRelation,
			modelClass: MajorsModel,
			join: {
				from: 'term.majors_id',
				to: 'majors.id',
			},
		},
	};
}

module.exports = TermModel;
