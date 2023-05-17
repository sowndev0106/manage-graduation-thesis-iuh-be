import { Knex } from 'knex';
export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('create_notification_lecturer', table => {
		table.increments('id').primary().unsigned();
		table.text('message').notNullable();
		table.boolean('read').defaultTo(false);
		table.string('type');

		table.integer('lecturer_id').unsigned().references('id').inTable('lecturer');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('create_notification_lecturer');
}
