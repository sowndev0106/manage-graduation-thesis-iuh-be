import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('evaluation_criteria', table => {
		table.increments('id').primary();
		table.string('name').notNullable();
		table.text('content').notNullable();

		table.integer('term_id').unsigned().references('id').inTable('term');
		table.integer('lecturer_id').unsigned().references('id').inTable('lecturer');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('evaluation_criteria');
}
