import Transcript from '@core/domain/entities/Transcript';
import Objection, { Model } from 'objection';
import StudentModel from './StudentModel';
import EvaluationModel from './EvaluationModel';
import LecturerModel from './LecturerModel';
import Student from '@core/domain/entities/Student';
import Lecturer from '@core/domain/entities/Lecturer';
import Evaluation from '@core/domain/entities/Evaluation';

export default class TranscriptModel extends Model {
	static get tableName() {
		return 'transcript';
	}

	static relationMappings = {
		student: {
			relation: Model.BelongsToOneRelation,
			modelClass: StudentModel,
			join: {
				from: 'transcript.student_id',
				to: 'student.id',
			},
		},
		lecturer: {
			relation: Model.BelongsToOneRelation,
			modelClass: LecturerModel,
			join: {
				from: 'transcript.lecturer_id',
				to: 'lecturer.id',
			},
		},
		evaluation: {
			relation: Model.BelongsToOneRelation,
			modelClass: EvaluationModel,
			join: {
				from: 'transcript.evaluation_id',
				to: 'evaluation.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: Transcript) {
		const model = new TranscriptModel();
		model.$set({
			id: entity.id,
			grade: entity.grade,
			student_id: entity.studentId,
			lecturer_id: entity.lecturerId,
			evaluation_id: entity.evaluationId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: TranscriptModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof TranscriptModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = Transcript.create(
			{
				grade: dbJson['grade'],
				student: Student.createById(dbJson['student_id']),
				lecturer: Lecturer.createById(dbJson['lecturer_id']),
				evaluation: Evaluation.createById(dbJson['evaluation_id']),
			},
			Number(dbJson['id'])
		);

		const student = dbJson['student'] && StudentModel.convertModelToEntity(dbJson['student']);
		const lecturer = dbJson['lecturer'] && LecturerModel.convertModelToEntity(dbJson['lecturer']);
		const evaluation = dbJson['evaluation'] && EvaluationModel.convertModelToEntity(dbJson['evaluation']);

		if (student) entity.update({ student });
		if (lecturer) entity.update({ lecturer });
		if (evaluation) entity.update({ evaluation });

		return entity;
	}
}

module.exports = TranscriptModel;
