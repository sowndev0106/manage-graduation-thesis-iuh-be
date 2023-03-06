import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('request_join_group', table => {
		table.increments('id').primary();
		table.string('message');

		table.integer('group_id').unsigned().references('id').inTable('group');
		table.integer('student_id').unsigned().references('id').inTable('student');
		table.enum('type', ['REQUEST_JOIN', 'REQUEST_INVITE']);

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('request_join_group');
}
