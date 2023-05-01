import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('transcript', table => {
		table.increments('id').primary();
		table.float('grade').notNullable();
		table.integer('student_term_id').unsigned().references('id').inTable('student_term');
		table.integer('lecturer_term_id').unsigned().references('id').inTable('lecturer_term');
		table.integer('evaluation_id').unsigned().references('id').inTable('evaluation');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('transcript');
}
