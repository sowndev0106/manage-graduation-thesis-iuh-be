import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('transcript', table => {
		table.increments('id').primary();
		table.enum('type_evaluation', ['ADVISOR', 'REVIEWER', 'SESSION_HOST']);
		table.integer('group_id').unsigned().references('id').inTable('group');
		table.integer('lecturer_id').unsigned().references('id').inTable('lecturer');
		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('transcript');
}
