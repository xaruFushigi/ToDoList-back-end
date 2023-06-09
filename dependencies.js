//express
const express = require("express");
const expressSession = require("express-session");
const app = express();
//enviromental varibales
const dotenv = require("dotenv");
dotenv.config();
//database
const pg = require("pg");
const knex = require("knex");
const pgSession = require("connect-pg-simple")(expressSession);
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});
//checking connection to the database
const pool = new pg.Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});
pool.connect((err, client, release) => {
  if (err) {
    console.error("error connecting to database:", err);
    return;
  }
  client.query("SELECT NOW()", (err, result) => {
    release(); // release the client back to the pool
    if (err) {
      console.error("error executing query:", err);
      return;
    }
    console.log("database connected:", result.rows[0].now);
  });
});
const sessionStore = new pgSession({
  pool: pool,
  tableName: "session",
});
//Cross Origin Security
const cors = require("cors");
//cookies
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const csrf = require("csurf");
const csrfProtection = csrf({ cookies: true });

//exporting
module.exports = {
  express,
  expressSession,
  app,
  dotenv,
  db,
  cors,
  cookieParser,
  cookieSession,
  csrf,
  pool,
  csrfProtection,
  sessionStore,
  pgSession,
};
