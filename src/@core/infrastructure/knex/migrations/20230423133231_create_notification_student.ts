import { Knex } from 'knex';
export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('notification_student', table => {
		table.increments('id').primary().unsigned();
		table.text('message').notNullable();
		table.boolean('read').defaultTo(false);
		table.string('type');
		table.integer('student_id').unsigned().references('id').inTable('student');

		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('notification_student');
}
