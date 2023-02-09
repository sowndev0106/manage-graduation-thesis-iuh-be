import { Model } from 'objection';

export default class RoleModel extends Model {
	static get tableName() {
		return 'role';
	}
}

module.exports = RoleModel;
