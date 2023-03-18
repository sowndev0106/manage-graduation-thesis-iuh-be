import Lecturer from '@core/domain/entities/Lecturer';
import Group from '@core/domain/entities/Group';
import Objection, { Model } from 'objection';
import LecturerModel from './LecturerModel';
import Term from '@core/domain/entities/Term';
import Topic from '@core/domain/entities/Topic';
import TermModel from './TermModel';
import TopicModel from './TopicModel';
import GroupMember from '@core/domain/entities/GroupMember';
import GroupMemberModel from './GroupMemberModel';

export default class GroupModel extends Model {
	static get tableName() {
		return 'group';
	}

	static relationMappings = {
		term: {
			relation: Model.BelongsToOneRelation,
			modelClass: LecturerModel,
			join: {
				from: 'group.term_id',
				to: 'term.id',
			},
		},
		topic: {
			relation: Model.BelongsToOneRelation,
			modelClass: LecturerModel,
			join: {
				from: 'group.topic_id',
				to: 'topic.id',
			},
		},
		members: {
			relation: Model.HasManyRelation,
			modelClass: GroupMemberModel,
			join: {
				from: 'group.id',
				to: 'group_member.group_id',
			},
		},
	};

	static convertEntityToPartialModelObject(entity: Group) {
		const model = new GroupModel();
		model.$set({
			id: entity.id,
			name: entity.name,
			term_id: entity.termId,
			topic_id: entity.topicId || null,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		});

		return model;
	}

	static convertModelToEntity(model: GroupModel | Objection.Pojo) {
		let dbJson: Objection.Pojo;
		if (model instanceof GroupModel) {
			dbJson = model.$parseDatabaseJson(model.toJSON());
		} else {
			dbJson = model;
		}
		const entity = Group.create(
			{
				name: dbJson['name'],
				term: Term.createById(dbJson['term_id']),
				topic: Topic.createById(dbJson['topic_id']),
			},
			Number(dbJson['id'])
		);
		const term = dbJson['term'] && TermModel.convertModelToEntity(dbJson['term']);
		const topic = dbJson['topic'] && TopicModel.convertModelToEntity(dbJson['topic']);
		const members = dbJson['members'] && dbJson['members'].map((e: any) => GroupMemberModel.convertModelToEntity(e));

		if (term) entity.updateTerm(term);
		if (topic) entity.updateTopic(topic);
		if (members) entity.updateMembers(members);

		return entity;
	}
}

module.exports = GroupModel;
