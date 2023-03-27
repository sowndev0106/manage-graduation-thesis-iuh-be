import Assign from '@core/domain/entities/Assign';
import Objection, { Model } from 'objection';
import LecturerModel from './LecturerModel';
import Term from '@core/domain/entities/Term';
import TermModel from './TermModel';
import Group from '@core/domain/entities/Group';
import GroupModel from './GroupModel';
import Lecturer from '@core/domain/entities/Lecturer';

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
		lecturer: {
			relation: Model.BelongsToOneRelation,
			modelClass: LecturerModel,
			join: {
				from: 'assign.lecturer_id',
				to: 'lecturer.id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: Assign) {
		const model = new AssignModel();
		model.$set({
			id: entity.id,
			type_evaluation: entity.typeEvaluation,
			group_id: entity.groupId,
			lecturer_id: entity.lecturerId,
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
				lecturer: Lecturer.createById(dbJson['lecturer_id']),
				group: Group.createById(dbJson['group_id']),
			},
			Number(dbJson['id'])
		);

		const lecturer = dbJson['lecturer'] && LecturerModel.convertModelToEntity(dbJson['lecturer']);
		const group = dbJson['group'] && GroupModel.convertModelToEntity(dbJson['group']);

		if (lecturer) entity.update({ lecturer });
		if (group) entity.update({ group });

		return entity;
	}
}

module.exports = AssignModel;
