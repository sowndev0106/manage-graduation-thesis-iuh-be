import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('term', table => {
		table.increments('id').primary().unsigned();
		table.string('name').notNullable();
		table.integer('majors_id').unsigned().references('id').inTable('majors');
		table.date('start_date').notNullable();
		table.date('end_date').notNullable();
		table.date('start_date_submit_topic').notNullable();
		table.date('end_date_submit_topic').notNullable();
		table.date('start_date_choose_topic').notNullable();
		table.date('end_date_choose_topic').notNullable();
		table.date('date_discussion').notNullable();
		table.date('date_report').notNullable();
		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('term');
}
