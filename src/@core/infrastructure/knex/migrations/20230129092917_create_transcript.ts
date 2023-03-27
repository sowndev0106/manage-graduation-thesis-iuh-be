import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('transcript', table => {
		table.increments('id').primary();
		table.float('grade').notNullable();
		table.integer('student_id').unsigned().references('id').inTable('student');
		table.integer('assign_id').unsigned().references('id').inTable('assign');
		table.integer('evaluation_id').unsigned().references('id').inTable('evaluation');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('transcript');
}
