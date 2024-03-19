require("dotenv").config();
const CONFIG = require("../../../knexfile");
const knex = require("knex")(CONFIG.development, CONFIG.pool);
module.exports = { knex };
