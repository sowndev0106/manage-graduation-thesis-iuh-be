import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('transcript', table => {
		table.increments('id').primary();
		table.enum('type_lecturer_transcript', ['instructor', 'opponent', 'council']);

		table.integer('evaluation_id').unsigned().references('id').inTable('evaluation');
		table.integer('group_id').unsigned().references('id').inTable('group');
		table.integer('lecturer_id').unsigned().references('id').inTable('lecturer');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('transcript');
}
