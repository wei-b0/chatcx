import { Client } from "pg";
import csv from "csv-parser";
import stream from "stream";

export const insertTopAccounts = async (
  fileBuffer: Buffer
): Promise<number> => {
  const results: string[] = [];

  try {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    const parser = bufferStream.pipe(csv({ headers: true }));
    for await (const row of parser) {
      Object.values(row).forEach((username: any) => {
        results.push(username.trim());
      });
    }

    const client = new Client({
      connectionString: process.env.DB_CONNECTION_STRING,
    });

    await client.connect();

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
      await client.end();
    }
  } catch (error) {
    console.error("Error processing CSV:", error);
    throw new Error("Failed to insert accounts.");
  }
};

export const getTopAccounts = async (): Promise<string[]> => {
  try {
    const client = new Client({
      connectionString: process.env.DB_CONNECTION_STRING,
    });

    await client.connect();
    const { rows } = await client.query(
      "SELECT username FROM top_accounts ORDER BY username ASC"
    );
    await client.end();

    return rows.map((row) => row.username);
  } catch (error) {
    console.error("Error fetching top accounts:", error);
    throw new Error("Failed to fetch accounts.");
  }
};
