import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('evaluation_detail', table => {
		table.increments('id').primary();
		table.float('grade_max').notNullable();

		table.integer('evaluation_id').unsigned().references('id').inTable('evaluation');
		table.integer('evaluation_criteria_id').unsigned().references('id').inTable('evaluation_criteria');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('evaluation_detail');
}
