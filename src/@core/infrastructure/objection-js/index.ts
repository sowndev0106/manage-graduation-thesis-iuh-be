import knex from 'knex';
import knexConfigs from '@core/infrastructure/knex';
import { Model } from 'objection';

Model.knex(knex(knexConfigs));
