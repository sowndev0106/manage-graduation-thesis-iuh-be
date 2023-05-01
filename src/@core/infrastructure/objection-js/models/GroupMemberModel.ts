import Group from '@core/domain/entities/Group';
import Objection, { Model } from 'objection';
import GroupMember from '@core/domain/entities/GroupMember';
import GroupModel from './GroupModel';
import StudentTermModel from './StudentTermModel';
import StudentTerm from '@core/domain/entities/StudentTerm';

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
		student_term: {
			relation: Model.BelongsToOneRelation,
			modelClass: StudentTermModel,
			join: {
				from: 'group_member.student_term_id',
				to: 'student_term.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: GroupMember) {
		const model = new GroupMemberModel();
		model.$set({
			id: entity.id,
			group_id: entity.groupId,
			student_term_id: entity.studentTermId,
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

module.exports = GroupMemberModel;
