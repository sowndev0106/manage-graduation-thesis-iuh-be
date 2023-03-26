import { Knex } from 'knex';
export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('evaluation_detail', table => {
		table.increments('id').primary();

		table.text('name').notNullable();

		table.float('grade_max').notNullable();

		table.integer('evaluation_id').unsigned().references('id').inTable('evaluation').onDelete('CASCADE');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('evaluation_detail');
}
