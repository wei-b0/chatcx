import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  max: 10,
  idleTimeoutMillis: 30000,
});

export default pool;
