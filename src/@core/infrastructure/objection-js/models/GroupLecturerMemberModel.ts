import Objection, { Model } from 'objection';
import GroupLecturerMember from '@core/domain/entities/GroupLecturerMember';
import Lecturer from '@core/domain/entities/Lecturer';
import GroupLecturerModel from './GroupLecturerModel';
import LecturerModel from './LecturerModel';
import GroupLecturer from '@core/domain/entities/GroupLecturer';

export default class GroupLecturerMemberModel extends Model {
	static get tableName() {
		return 'group_lecturer_member';
	}

	static relationMappings = {
		group_lecturer: {
			relation: Model.BelongsToOneRelation,
			modelClass: GroupLecturerModel,
			join: {
				from: 'group_lecturer_member.group_lecturer_id',
				to: 'group_lecturer.id',
			},
		},
		lecturer: {
			relation: Model.BelongsToOneRelation,
			modelClass: LecturerModel,
			join: {
				from: 'group_lecturer_member.lecturer_id',
				to: 'lecturer.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: GroupLecturerMember) {
		const model = new GroupLecturerMemberModel();
		model.$set({
			id: entity.id,
			group_lecturer_id: entity.groupLecturerId,
			lecturer_id: entity.lecturerId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: GroupLecturerMemberModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof GroupLecturerMemberModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = GroupLecturerMember.create(
			{
				groupLecturer: GroupLecturer.createById(dbJson['group_lecturer_id']),
				lecturer: Lecturer.createById(dbJson['lecturer_id']),
			},
			Number(dbJson['id'])
		);
		const group_lecturer = dbJson['group_lecturer'] && GroupLecturerModel.convertModelToEntity(dbJson['group_lecturer']);
		const lecturer = dbJson['lecturer'] && LecturerModel.convertModelToEntity(dbJson['lecturer']);

		if (group_lecturer) entity.updateGroup(group_lecturer);
		if (lecturer) entity.updateLecturer(lecturer);

		return entity;
	}
}

module.exports = GroupLecturerMemberModel;
