import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('student', table => {
		table.increments('id').primary();
		table.string('type_training');
		table.string('school_year');
		table.integer('user_id').unsigned().references('id').inTable('user');
		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('lecure');
}
