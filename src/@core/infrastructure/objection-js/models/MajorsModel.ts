import { Model } from 'objection';

export default class MajorsModel extends Model {
	static get tableName() {
		return 'majors';
	}
}

module.exports = MajorsModel;
