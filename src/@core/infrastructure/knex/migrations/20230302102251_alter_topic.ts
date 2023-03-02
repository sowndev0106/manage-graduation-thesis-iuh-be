import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('topic', table => {
		table.integer('majors_id').unsigned().references('id').inTable('majors');
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('topic', table => {
		table.dropColumn('majors_id');
	});
}
