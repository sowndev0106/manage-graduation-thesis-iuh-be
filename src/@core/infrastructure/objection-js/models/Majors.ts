import {Model} from 'objection'

export default class Majors extends Model {
  static get tableName() {
    return 'majors';
  }
}

module.exports = Majors;