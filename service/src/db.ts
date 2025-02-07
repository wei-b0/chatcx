import { Pool } from "pg";
import { DB_CONNECTION_STRING } from "./config/env";

const pool = new Pool({
  connectionString: DB_CONNECTION_STRING,
  max: 10,
  idleTimeoutMillis: 30000,
});

export default pool;
