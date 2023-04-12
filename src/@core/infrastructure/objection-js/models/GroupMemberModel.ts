import Group from '@core/domain/entities/Group';
import Objection, { Model } from 'objection';
import GroupMember from '@core/domain/entities/GroupMember';
import Student from '@core/domain/entities/Student';
import GroupModel from './GroupModel';
import StudentModel from './StudentModel';

export default class GroupMemberModel extends Model {
	static get tableName() {
		return 'group_member';
	}

	static relationMappings = {
		group: {
			relation: Model.BelongsToOneRelation,
			modelClass: GroupModel,
			join: {
				from: 'group_member.group_id',
				to: 'group.id',
			},
		},
		student: {
			relation: Model.BelongsToOneRelation,
			modelClass: StudentModel,
			join: {
				from: 'group_member.student_id',
				to: 'student.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: GroupMember) {
		const model = new GroupMemberModel();
		model.$set({
			id: entity.id,
			group_id: entity.groupId,
			student_id: entity.studentId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: GroupMemberModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof GroupMemberModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = GroupMember.create(
			{
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

module.exports = GroupMemberModel;
