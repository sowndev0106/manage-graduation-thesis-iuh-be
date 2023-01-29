// parse variable environment *** requie first
import "..//..//..//..//env/index.js"

const config = {
    client: process.env.DB_CLIENT,
    connection: {
      host : process.env.DB_HOST,  
      port : Number(process.env.DB_PORT),
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_NAME
    }
  }


// check config
const knex = require('knex')(config);

export default config;