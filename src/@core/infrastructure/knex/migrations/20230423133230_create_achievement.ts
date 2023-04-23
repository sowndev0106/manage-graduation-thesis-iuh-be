import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('achievement', table => {
		table.increments('id').primary();
		table.float('bonus_grade').notNullable();
		table.string('name');
		table.integer('student_id').unsigned().references('id').inTable('student');
		table.integer('term_id').unsigned().references('id').inTable('term');
		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('achievement');
}
