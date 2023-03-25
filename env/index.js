const dotenv = require('dotenv');
var path = require('path');
// dotenv.config({ path: `${path.resolve(__dirname)}/${process.env.NODE_ENV || 'local'}.env` });
dotenv.config({path:`${path.resolve(__dirname)}/${process.env.NODE_ENV || 'develop'}.env`})
