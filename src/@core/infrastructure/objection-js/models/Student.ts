import { Model } from 'objection';
import User from './User';

export default class Student extends Model {
	static get tableName() {
		return 'student';
	}
	static relationMappings = {
		user: {
			relation: Model.HasOneRelation,
			modelClass: User,
			join: {
				from: 'student.user_id',
				to: 'user.id',
			},
		},
	};
}
