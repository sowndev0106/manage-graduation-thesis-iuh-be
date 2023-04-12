import Objection, { Model } from 'objection';
import LecturerModel from './LecturerModel';
import Term from '@core/domain/entities/Term';
import TermModel from './TermModel';
import GroupLecturerMemberModel from './GroupLecturerMemberModel';
import GroupLecturer from '@core/domain/entities/GroupLecturer';

export default class GroupLecturerModel extends Model {
	static get tableName() {
		return 'group_lecturer';
	}

	static relationMappings = {
		term: {
			relation: Model.BelongsToOneRelation,
			modelClass: TermModel,
			join: {
				from: 'group_lecturer.term_id',
				to: 'term.id',
			},
		},
		members: {
			relation: Model.HasManyRelation,
			modelClass: GroupLecturerMemberModel,
			join: {
				from: 'group_lecturer.id',
				to: 'group_lecturer_member.group_lecturer_id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: GroupLecturer) {
		const model = new GroupLecturerModel();
		model.$set({
			name: entity.name,
			term_id: entity.termId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: GroupLecturerModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof GroupLecturerModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = GroupLecturer.create(
			{
				name: dbJson['name'],
				term: Term.createById(dbJson['term_id']),
			},
			Number(dbJson['id'])
		);
		const term = dbJson['term'] && TermModel.convertModelToEntity(dbJson['term']);
		const members = dbJson['members'] && dbJson['members'].map((e: any) => GroupLecturerMemberModel.convertModelToEntity(e));

		if (term) entity.update({ term });
		if (members) entity.update({ members });

		return entity;
	}
}

module.exports = GroupLecturerModel;
