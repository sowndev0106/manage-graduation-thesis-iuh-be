import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('group_member', table => {
		table.increments('id').primary();

		table.integer('group_id').unsigned().references('id').inTable('group').onDelete('CASCADE');
		table.integer('student_term_id').unsigned().references('id').inTable('student_term');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('create_group_member');
}
