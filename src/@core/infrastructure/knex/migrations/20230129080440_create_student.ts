import { TypeGender } from '@core/domain/entities/Lecturer';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('student', table => {
		table.increments('id').primary();
		table.string('type_training');
		table.string('school_year');
		table.string('username').notNullable().unique();
		table.string('password').defaultTo('123456');
		table.text('avatar');
		table.string('phone_number');
		table.string('email');
		table.string('name');
		table.enum('gender', ['MALE', 'FEMALE']);
		table.integer('majors_id').unsigned().references('id').inTable('majors');
		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('lecure');
}
