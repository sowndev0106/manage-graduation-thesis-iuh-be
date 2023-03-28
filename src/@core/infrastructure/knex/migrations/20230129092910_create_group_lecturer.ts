import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('group_lecturer', table => {
		table.increments('id').primary();
		table.string('name');
		table.integer('term_id').unsigned().references('id').inTable('term');
		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('group_lecturer');
}
