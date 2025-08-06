const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
      user: "amanuel",
      database: "members",
      password: "Aman1491",
      port: 5432
  });

  module.exports = {pool};