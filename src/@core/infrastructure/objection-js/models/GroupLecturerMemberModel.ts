import Objection, { Model } from 'objection';
import GroupLecturerMember from '@core/domain/entities/GroupLecturerMember';
import Lecturer from '@core/domain/entities/Lecturer';
import GroupLecturerModel from './GroupLecturerModel';
import LecturerModel from './LecturerModel';
import GroupLecturer from '@core/domain/entities/GroupLecturer';
import lecturerTermModel from './LecturerTermModel';
import LecturerTerm from '@core/domain/entities/LecturerTerm';

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
		lecturer_term: {
			relation: Model.BelongsToOneRelation,
			modelClass: lecturerTermModel,
			join: {
				from: 'group_lecturer_member.lecturer_term_id',
				to: 'lecturer_term.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: GroupLecturerMember) {
		const model = new GroupLecturerMemberModel();
		model.$set({
			id: entity.id,
			group_lecturer_id: entity.groupLecturerId,
			lecturer_term_id: entity.lecturerTermId,
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
				lecturerTerm: LecturerTerm.createById(dbJson['lecturer__term_id']),
			},
			Number(dbJson['id'])
		);
		const groupLecturer = dbJson['group_lecturer'] && GroupLecturerModel.convertModelToEntity(dbJson['group_lecturer']);
		const lecturerTerm = dbJson['lecturer_term'] && LecturerModel.convertModelToEntity(dbJson['lecturer_term']);

		if (groupLecturer) entity.update({ groupLecturer });
		if (lecturerTerm) entity.update({ lecturerTerm });

		return entity;
	}
}

module.exports = GroupLecturerMemberModel;
