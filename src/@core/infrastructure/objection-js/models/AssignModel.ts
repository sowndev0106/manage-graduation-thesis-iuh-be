import Assign from '@core/domain/entities/Assign';
import Objection, { Model } from 'objection';
import LecturerModel from './LecturerModel';
import Term from '@core/domain/entities/Term';
import TermModel from './TermModel';
import Group from '@core/domain/entities/Group';
import GroupModel from './GroupModel';
import Lecturer from '@core/domain/entities/Lecturer';
import GroupLecturer from '@core/domain/entities/GroupLecturer';
import GroupLecturerModel from './GroupLecturerModel';

export default class AssignModel extends Model {
	static get tableName() {
		return 'assign';
	}

	static relationMappings = {
		group: {
			relation: Model.BelongsToOneRelation,
			modelClass: GroupModel,
			join: {
				from: 'assign.group_id',
				to: 'group.id',
			},
		},
		group_lecturer: {
			relation: Model.BelongsToOneRelation,
			modelClass: GroupLecturerModel,
			join: {
				from: 'assign.group_lecturer_id',
				to: 'group_lecturer.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: Assign) {
		const model = new AssignModel();
		model.$set({
			id: entity.id,
			type_evaluation: entity.typeEvaluation,
			group_id: entity.groupId,
			group_lecturer_id: entity.groupLecturerId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: AssignModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof AssignModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = Assign.create(
			{
				typeEvaluation: dbJson['type_evaluation'],
				groupLecturer: GroupLecturer.createById(dbJson['group_lecturer_id']),
				group: Group.createById(dbJson['group_id']),
			},
			Number(dbJson['id'])
		);

		const groupLecturer = dbJson['group_lecturer'] && LecturerModel.convertModelToEntity(dbJson['group_lecturer']);
		const group = dbJson['group'] && GroupModel.convertModelToEntity(dbJson['group']);

		if (groupLecturer) entity.update({ groupLecturer });
		if (group) entity.update({ group });

		return entity;
	}
}

module.exports = AssignModel;
