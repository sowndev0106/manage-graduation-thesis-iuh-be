import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('student_term', table => {
		table.increments('id').primary();

		table.integer('term_id').unsigned().references('id').inTable('term');
		table.integer('student_id').unsigned().references('id').inTable('student');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('student_term');
}
