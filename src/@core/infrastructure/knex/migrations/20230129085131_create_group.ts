import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('group', table => {
		table.increments('id').primary();
		table.string('name');
		table
			.enum('status', ['OPEN', 'FAIL_ADVISOR', 'FAIL_REVIEWER', 'FAIL_SESSION_HOST', 'PASS_ADVISOR', 'PASS_REVIEWER', 'PASS_SESSION_HOST'])
			.defaultTo('OPEN');
		table.integer('term_id').unsigned().references('id').inTable('term');
		table.integer('topic_id').unsigned().references('id').inTable('topic');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('group');
}
