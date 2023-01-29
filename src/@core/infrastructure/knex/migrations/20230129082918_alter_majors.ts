import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('majors', table => {
		table.integer('head_lecturer_id').unsigned().references('id').inTable('lecturer');
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('majors', table => {
		table.dropColumn('head_lecturer_id');
	});
}
