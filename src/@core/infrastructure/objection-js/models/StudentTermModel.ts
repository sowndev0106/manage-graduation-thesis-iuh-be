import term from '@core/domain/entities/term';
import Objection, { Model } from 'objection';
import StudentTerm from '@core/domain/entities/StudentTerm';
import Student from '@core/domain/entities/Student';
import StudentModel from './StudentModel';
import TermModel from './TermModel';
import Term from '@core/domain/entities/term';

export default class StudentTermModel extends Model {
	static get tableName() {
		return 'student_term';
	}

	static relationMappings = {
		term: {
			relation: Model.BelongsToOneRelation,
			modelClass: TermModel,
			join: {
				from: 'student_term.term_id',
				to: 'term.id',
			},
		},
		student: {
			relation: Model.BelongsToOneRelation,
			modelClass: StudentModel,
			join: {
				from: 'student_term.student_id',
				to: 'student.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: StudentTerm) {
		const model = new StudentTermModel();
		model.$set({
			id: entity.id,
			term_id: entity.termId,
			student_id: entity.studentId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: StudentTermModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof StudentTermModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = StudentTerm.create(
			{
				term: Term.createById(dbJson['term_id']),
				student: Student.createById(dbJson['student_id']),
			},
			Number(dbJson['id'])
		);
		const term = dbJson['term'] && TermModel.convertModelToEntity(dbJson['term']);
		const student = dbJson['student'] && StudentModel.convertModelToEntity(dbJson['student']);

		if (term) entity.updateterm(term);
		if (student) entity.update({ student });

		return entity;
	}
}

module.exports = StudentTermModel;
