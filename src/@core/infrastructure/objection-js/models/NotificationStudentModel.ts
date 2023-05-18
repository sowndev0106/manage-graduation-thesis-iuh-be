import Objection, { Model } from 'objection';
import NotificationStudent from '@core/domain/entities/NotificationStudent';
import studentTermModel from './StudentTermModel';
import StudentModel from './StudentModel';
import Student from '@core/domain/entities/Student';

export default class NotificationStudentModel extends Model {
	static get tableName() {
		return 'notification_student';
	}

	static relationMappings = {
		student: {
			relation: Model.BelongsToOneRelation,
			modelClass: StudentModel,
			join: {
				from: 'notification_student.student_id',
				to: 'student.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: NotificationStudent) {
		const model = new NotificationStudentModel();
		model.$set({
			id: entity.id,
			message: entity.message,
			type: entity.type,
			read: entity.read,
			student_id: entity.studentId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: NotificationStudentModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof NotificationStudentModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = NotificationStudent.create(
			{
				type: dbJson['type'],
				message: dbJson['message'],
				read: dbJson['read'],
				student: Student.createById(dbJson['student_id']),
				createdAt: dbJson['created_at'] && new Date(dbJson['created_at']),
				updatedAt: dbJson['updated_at'] && new Date(dbJson['updated_at']),
			},
			Number(dbJson['id'])
		);
		const student = dbJson['student'] && studentTermModel.convertModelToEntity(dbJson['student']);

		student && entity.update({ student });

		return entity;
	}
}

module.exports = NotificationStudentModel;
