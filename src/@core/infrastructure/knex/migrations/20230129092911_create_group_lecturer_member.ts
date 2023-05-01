import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('group_lecturer_member', table => {
		table.increments('id').primary();
		table.integer('group_lecturer_id').unsigned().references('id').inTable('group_lecturer').onDelete('CASCADE');
		table.integer('lecturer_term_id').unsigned().references('id').inTable('lecturer_term');
		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('group_lecturer_member');
}
