import pool from "../db";

export const authenticateAPIKey = (allowedRoles: ("admin" | "app")[]) => {
  return async (req: any, res: any, next: any) => {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      return res.status(401).json({ error: "API key is required." });
    }

    try {
      const result = await pool.query(
        "SELECT role FROM api_keys WHERE key = $1",
        [apiKey]
      );
      if (result.rowCount === 0) {
        return res
          .status(403)
          .json({ error: "Invalid or unauthorized API key." });
      }

      const { role } = result.rows[0];
      if (!allowedRoles.includes(role)) {
        return res
          .status(403)
          .json({ error: "Forbidden: Insufficient privileges." });
      }

      req["apiRole"] = role;
      next();
    } catch (error) {
      console.error("Error validating API key:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};
