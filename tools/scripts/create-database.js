/* eslint-disable no-console */
// eslint-disable-next-line node/no-unpublished-require
require('./../../dist/bootstrap');
const Knex = require('knex');
const { exit } = require('process');

console.log('--- CREATE DB IF NOT EXISTS');

const knex = Knex({
	client: process.env.KNEX_CLIENT,
	connection: {
		host: process.env.KNEX_DB_HOST,
		port: process.env.KNEX_DB_PORT,
		user: process.env.KNEX_DB_USERNAME,
		password: process.env.KNEX_DB_PASSWORD,
		charset: process.env.KNEX_DB_CHARSET,
	},
});

const query = `\
	CREATE DATABASE IF NOT EXISTS ${process.env.KNEX_DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
`;

knex.raw(query).then(() => {
	console.log('--- DONE');
	exit();
});
