import Lecturer from '@core/domain/entities/Lecturer';
import Group from '@core/domain/entities/Group';
import Objection, { Model } from 'objection';
import LecturerModel from './LecturerModel';
import Term from '@core/domain/entities/Term';
import Topic from '@core/domain/entities/Topic';
import TermModel from './TermModel';
import TopicModel from './TopicModel';
import GroupMember from '@core/domain/entities/groupMember';
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
			modelClass: LecturerModel,
			join: {
				from: 'group_member.group_id',
				to: 'group.id',
			},
		},
		student: {
			relation: Model.BelongsToOneRelation,
			modelClass: LecturerModel,
			join: {
				from: 'group_member.student_id',
				to: 'group.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: GroupMember) {
		const model = new GroupMemberModel();
		model.$set({
			id: entity.id,
			group_id: entity.groupId,
			student_id: entity.studentId,
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
