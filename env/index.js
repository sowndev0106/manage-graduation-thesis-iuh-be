const dotenv = require('dotenv');
var path = require('path');
console.log("run env ------------------------------------------------------- ")
dotenv.config({ path: `${path.resolve(__dirname)}/${process.env.NODE_ENV || 'develop'}.env` });