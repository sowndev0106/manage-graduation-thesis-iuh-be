import Group from '@core/domain/entities/Group';
import Objection, { Model } from 'objection';
import RequestJoinGroup from '@core/domain/entities/RequestJoinGroup';
import Student from '@core/domain/entities/Student';
import GroupModel from './GroupModel';
import StudentModel from './StudentModel';
import StudentTermModel from './StudentTermModel';
import StudentTerm from '@core/domain/entities/StudentTerm';

export default class RequestJoinGroupModel extends Model {
	static get tableName() {
		return 'request_join_group';
	}

	static relationMappings = {
		group: {
			relation: Model.BelongsToOneRelation,
			modelClass: GroupModel,
			join: {
				from: 'request_join_group.group_id',
				to: 'group.id',
			},
		},
		student_term: {
			relation: Model.BelongsToOneRelation,
			modelClass: StudentTermModel,
			join: {
				from: 'request_join_group.student_term_id',
				to: 'student_term.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: RequestJoinGroup) {
		const model = new RequestJoinGroupModel();
		model.$set({
			id: entity.id,
			message: entity.message,
			group_id: entity.groupId,
			student_term_id: entity.studentTermId,
			type: entity.type,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: RequestJoinGroupModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof RequestJoinGroupModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = RequestJoinGroup.create(
			{
				message: dbJson['message'],
				type: dbJson['type'],
				group: Group.createById(dbJson['group_id']),
				studentTerm: StudentTerm.createById(dbJson['student_term_id']),
			},
			Number(dbJson['id'])
		);
		const group = dbJson['group'] && GroupModel.convertModelToEntity(dbJson['group']);
		const studentTerm = dbJson['student_term'] && StudentTermModel.convertModelToEntity(dbJson['student_term']);

		if (group) entity.update({ group });
		if (studentTerm) entity.update({ studentTerm });

		return entity;
	}
}

module.exports = RequestJoinGroupModel;
