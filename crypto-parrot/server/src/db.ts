import { Pool } from "pg";
import dotenv from "dotenv";
import { trackEvent } from "./utils/posthog";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  trackEvent("database", "database-error", {
    error_message: JSON.stringify(err),
  });
});

interface User {
  tg_user_id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  tg_username: string;
  wallet_address: string;
  photo_url: string;
  referral_code: string;
  registered_on: number; // Unix timestamp
  access_token: string;
  refresh_token: string;
}

export const checkRateLimit = async (
  userId: number,
  feature: string
): Promise<boolean> => {
  const maxRequests = 5;

  const result = await pool.query(
    "SELECT request_count, last_reset FROM user_requests WHERE user_id = $1 AND feature = $2",
    [userId, feature]
  );

  if (result.rows.length === 0) {
    await pool.query(
      "INSERT INTO user_requests (user_id, feature, request_count) VALUES ($1, $2, 1)",
      [userId, feature]
    );
    return true;
  }

  const { request_count, last_reset } = result.rows[0];

  const now = new Date();
  const resetTime = new Date(last_reset);
  const hoursSinceReset =
    (now.getTime() - resetTime.getTime()) / (1000 * 60 * 60);

  if (hoursSinceReset >= 48) {
    await pool.query(
      "UPDATE user_requests SET request_count = 1, last_reset = NOW() WHERE user_id = $1 AND feature = $2",
      [userId, feature]
    );
    return true;
  }

  if (request_count >= maxRequests) {
    return false;
  }

  await pool.query(
    "UPDATE user_requests SET request_count = request_count + 1 WHERE user_id = $1 AND feature = $2",
    [userId, feature]
  );

  return true;
};

/**
 * Insert or update a user in the database using tg_user_id as the primary key.
 */
export const upsertUser = async (user: User): Promise<void> => {
  const query = `
    INSERT INTO users (
      tg_user_id, user_id, first_name, last_name, tg_username,
      wallet_address, photo_url, referral_code, registered_on,
      access_token, refresh_token
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, to_timestamp($9), $10, $11
    )
    ON CONFLICT (tg_user_id)
    DO UPDATE SET
      user_id = EXCLUDED.user_id,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      tg_username = EXCLUDED.tg_username,
      wallet_address = EXCLUDED.wallet_address,
      photo_url = EXCLUDED.photo_url,
      referral_code = EXCLUDED.referral_code,
      registered_on = EXCLUDED.registered_on,
      access_token = EXCLUDED.access_token,
      refresh_token = EXCLUDED.refresh_token;
  `;

  const values = [
    user.tg_user_id,
    user.user_id,
    user.first_name,
    user.last_name,
    user.tg_username,
    user.wallet_address,
    user.photo_url,
    user.referral_code,
    user.registered_on,
    user.access_token,
    user.refresh_token,
  ];

  await pool.query(query, values);
};

/**
 * Fetch a user by Telegram user ID.
 */
export const getUserByTelegramId = async (
  tg_user_id: number
): Promise<User | null> => {
  const query = `SELECT * FROM users WHERE tg_user_id = $1`;
  const result = await pool.query(query, [tg_user_id]);

  return result.rows[0] || null;
};

export default pool;
