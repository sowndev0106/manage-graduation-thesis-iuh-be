import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('group_lecturer_member', table => {
		table.increments('id').primary();
		table.integer('group_lecturer_id').unsigned().references('id').inTable('group_lecturer');
		table.integer('lecturer_id').unsigned().references('id').inTable('lecturer');
		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('group_lecturer_member');
}
