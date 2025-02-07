import { Pool } from "pg";
import { DATABASE_URL, MAX_CREDITS } from "../config/env";

const pool = new Pool({ connectionString: DATABASE_URL });

export const getUserCredits = async (userId: number) => {
  const client = await pool.connect();
  const result = await client.query(
    `SELECT credits FROM user_credits WHERE user_id = $1`,
    [userId]
  );
  client.release();
  return result.rows.length ? result.rows[0].credits : null;
};

export const initializeUser = async (userId: number, username: string) => {
  const client = await pool.connect();
  await client.query(
    `INSERT INTO user_credits (user_id, username, credits) VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE SET username = EXCLUDED.username`,
    [userId, username, MAX_CREDITS]
  );
  client.release();
};

export const decrementUserCredits = async (userId: number) => {
  const client = await pool.connect();
  await client.query(
    `UPDATE user_credits SET credits = credits - 1 WHERE user_id = $1`,
    [userId]
  );
  client.release();
};
