import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('lecturer', table => {
		table.increments('id').primary();
		table.string('degree');
		table.boolean('is_admin');
		table.integer('user_id').unsigned().references('id').inTable('user');
		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('lecturer');
}
