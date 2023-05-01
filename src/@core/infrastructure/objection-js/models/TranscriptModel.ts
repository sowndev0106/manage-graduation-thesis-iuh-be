import Transcript from '@core/domain/entities/Transcript';
import Objection, { Model } from 'objection';
import StudentModel from './StudentModel';
import EvaluationModel from './EvaluationModel';
import LecturerModel from './LecturerModel';
import Student from '@core/domain/entities/Student';
import Lecturer from '@core/domain/entities/Lecturer';
import Evaluation from '@core/domain/entities/Evaluation';
import lecturerTermModel from './LecturerTermModel';
import StudentTerm from '@core/domain/entities/StudentTerm';
import LecturerTerm from '@core/domain/entities/LecturerTerm';
import StudentTermModel from './StudentTermModel';

export default class TranscriptModel extends Model {
	static get tableName() {
		return 'transcript';
	}

	static relationMappings = {
		student_term: {
			relation: Model.BelongsToOneRelation,
			modelClass: StudentTermModel,
			join: {
				from: 'transcript.student_term_id',
				to: 'student_term.id',
			},
		},
		lecturer_term: {
			relation: Model.BelongsToOneRelation,
			modelClass: lecturerTermModel,
			join: {
				from: 'transcript.lecturer_term_id',
				to: 'lecturer_term.id',
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
			student_term_id: entity.studentTermId,
			lecturer_term_id: entity.lecturerTermId,
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
				studentTerm: StudentTerm.createById(dbJson['student_term_id']),
				lecturerTerm: LecturerTerm.createById(dbJson['lecturer_term_id']),
				evaluation: Evaluation.createById(dbJson['evaluation_id']),
			},
			Number(dbJson['id'])
		);

		const studentTerm = dbJson['student_term'] && StudentTermModel.convertModelToEntity(dbJson['student_term']);
		const lecturerTerm = dbJson['lecturer_term'] && lecturerTermModel.convertModelToEntity(dbJson['lecturer_term']);
		const evaluation = dbJson['evaluation'] && EvaluationModel.convertModelToEntity(dbJson['evaluation']);

		if (studentTerm) entity.update({ studentTerm });
		if (lecturerTerm) entity.update({ lecturerTerm });
		if (evaluation) entity.update({ evaluation });

		return entity;
	}
}

module.exports = TranscriptModel;
