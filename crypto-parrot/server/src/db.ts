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
  registered_on: number;
  access_token: string;
  refresh_token: string;
  rate_limit: Record<string, { request_count: number; last_reset: string }>;
}

export const checkRateLimit = async (
  userId: number,
  feature: string
): Promise<boolean> => {
  const maxRequests = 5;

  const result = await pool.query(
    "SELECT rate_limit FROM users WHERE tg_user_id = $1",
    [userId]
  );

  if (result.rows.length === 0) {
    return false;
  }

  let rateLimit = result.rows[0].rate_limit || {};
  const now = new Date().toISOString();

  if (!rateLimit[feature]) {
    rateLimit[feature] = { request_count: 1, last_reset: now };
  } else {
    const { request_count, last_reset } = rateLimit[feature];
    const hoursSinceReset =
      (new Date(now).getTime() - new Date(last_reset).getTime()) /
      (1000 * 60 * 60);

    if (hoursSinceReset >= 48) {
      rateLimit[feature] = { request_count: 1, last_reset: now };
    } else if (request_count >= maxRequests) {
      return false;
    } else {
      rateLimit[feature].request_count += 1;
    }
  }

  await pool.query("UPDATE users SET rate_limit = $1 WHERE tg_user_id = $2", [
    JSON.stringify(rateLimit),
    userId,
  ]);

  return true;
};

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

export const getUserByTelegramId = async (
  tg_user_id: number
): Promise<User | null> => {
  const query = `SELECT * FROM users WHERE tg_user_id = $1`;
  const result = await pool.query(query, [tg_user_id]);

  return result.rows[0] || null;
};

export default pool;
