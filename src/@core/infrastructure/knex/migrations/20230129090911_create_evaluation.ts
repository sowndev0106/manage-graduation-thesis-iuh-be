import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('evaluation', table => {
		table.increments('id').primary();
		table.enum('type_evaluation', ['MID_TERM', 'END_TERM']);

		table.integer('term_id').unsigned().references('id').inTable('term');
		table.integer('lecturer_id').unsigned().references('id').inTable('lecturer');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('evaluation');
}
