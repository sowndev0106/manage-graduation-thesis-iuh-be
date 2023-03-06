import Group from '@core/domain/entities/Group';
import Objection, { Model } from 'objection';
import RequestJoinGroup from '@core/domain/entities/RequestJoinGroup';
import Student from '@core/domain/entities/Student';
import GroupModel from './GroupModel';
import StudentModel from './StudentModel';

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
		student: {
			relation: Model.BelongsToOneRelation,
			modelClass: StudentModel,
			join: {
				from: 'request_join_group.student_id',
				to: 'student.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: RequestJoinGroup) {
		const model = new RequestJoinGroupModel();
		model.$set({
			id: entity.id,
			message: entity.message,
			group_id: entity.groupId,
			student_id: entity.studentId,
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
				student: Student.createById(dbJson['student_id']),
			},
			Number(dbJson['id'])
		);
		const group = dbJson['group'] && GroupModel.convertModelToEntity(dbJson['group']);
		const student = dbJson['student'] && StudentModel.convertModelToEntity(dbJson['student']);

		if (group) entity.updateGroup(group);
		if (student) entity.updateStudent(student);

		return entity;
	}
}

module.exports = RequestJoinGroupModel;
