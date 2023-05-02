import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('lecturer_term', table => {
		table.increments('id').primary();

		table.integer('term_id').unsigned().references('id').inTable('term').onDelete('CASCADE').onUpdate('CASCADE');
		table.integer('lecturer_id').unsigned().references('id').inTable('lecturer');
		table.string('role');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('lecturer_term');
}
