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
				dateDiscussion: dbJson['date_discussion'],
				dateReport: dbJson['date_report'],
				majors: dbJson['majors_id'] && Majors.createById(Number(dbJson['user_id'])),
				createdAt: dbJson['created_at'] && new Date(dbJson['created_at']),
				updatedAt: dbJson['updated_at'] && new Date(dbJson['updated_at']),
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
			date_discussion: entity.dateDiscussion,
			date_report: entity.dateReport,
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
