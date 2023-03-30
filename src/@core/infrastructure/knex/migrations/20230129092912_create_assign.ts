import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('assign', table => {
		table.increments('id').primary();
		table.enum('type_evaluation', ['ADVISOR', 'REVIEWER', 'SESSION_HOST']);
		table.integer('group_id').unsigned().references('id').inTable('group');
		table.integer('group_lecturer_id').unsigned().references('id').inTable('group_lecturer');
		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('assign');
}
