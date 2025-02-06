import { Pool } from "pg";
import csv from "csv-parser";
import stream from "stream";

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

export const insertTopAccounts = async (
  fileBuffer: Buffer
): Promise<number> => {
  const results: string[] = [];

  try {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    const parser = bufferStream.pipe(csv());
    for await (const row of parser) {
      if (row.username) {
        results.push(row.username.trim());
      }
    }

    const client = await pool.connect();
    try {
      for (const username of results) {
        await client.query(
          `INSERT INTO top_accounts (username) 
           VALUES ($1) 
           ON CONFLICT (username) DO NOTHING`,
          [username]
        );
      }
      return results.length;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing CSV:", error);
    throw new Error("Failed to insert accounts.");
  }
};

export const getTopAccounts = async (): Promise<string[]> => {
  try {
    const { rows } = await pool.query(
      "SELECT username FROM top_accounts ORDER BY username ASC"
    );
    return rows.map((row) => row.username);
  } catch (error) {
    console.error("Error fetching top accounts:", error);
    throw new Error("Failed to fetch accounts.");
  }
};
