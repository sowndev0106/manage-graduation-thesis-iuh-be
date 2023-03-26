import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('transcript_detail', table => {
		table.increments('id').primary();
		table.float('grade').notNullable();
		table.integer('student_id').unsigned().references('id').inTable('student');
		table.integer('transcript_id').unsigned().references('id').inTable('transcript');
		table.integer('evaluation_detail_id').unsigned().references('id').inTable('evaluation_detail');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('transcript_detail');
}
