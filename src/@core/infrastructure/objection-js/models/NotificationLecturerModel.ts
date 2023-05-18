import Objection, { Model } from 'objection';
import NotificationLecturer from '@core/domain/entities/NotificationLecturer';
import lecturerTermModel from './LecturerTermModel';
import LecturerModel from './LecturerModel';
import Lecturer from '@core/domain/entities/Lecturer';

export default class NotificationLecturerModel extends Model {
	static get tableName() {
		return 'notification_lecturer';
	}

	static relationMappings = {
		lecturer: {
			relation: Model.BelongsToOneRelation,
			modelClass: LecturerModel,
			join: {
				from: 'notification_lecturer.lecturer_id',
				to: 'lecturer.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: NotificationLecturer) {
		const model = new NotificationLecturerModel();
		model.$set({
			id: entity.id,
			message: entity.message,
			type: entity.type,
			read: entity.read,
			lecturer_id: entity.lecturerId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: NotificationLecturerModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof NotificationLecturerModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = NotificationLecturer.create(
			{
				type: dbJson['type'],
				message: dbJson['message'],
				read: dbJson['read'],
				lecturer: Lecturer.createById(dbJson['lecturer_id']),
				createdAt: dbJson['created_at'] && new Date(dbJson['created_at']),
				updatedAt: dbJson['updated_at'] && new Date(dbJson['updated_at']),
			},
			Number(dbJson['id'])
		);
		const lecturer = dbJson['lecturer'] && lecturerTermModel.convertModelToEntity(dbJson['lecturer']);

		lecturer && entity.update({ lecturer });

		return entity;
	}
}

module.exports = NotificationLecturerModel;
