import pg from "pg";
import dotenv from "./dotenv.js";

dotenv.config({ path: "../.env" });

console.log(process.env.PGUSER, "fda");

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
};

const pool = new pg.Pool(config);

export { pool };
