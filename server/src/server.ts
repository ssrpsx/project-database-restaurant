import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from "mysql2/promise";

dotenv.config();

const app = express();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});


app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

(async () => {
    try {
        const [rows] = await db.query("SELECT 1");
        console.log("✅ MySQL Connected!");
    } catch (err) {
        console.error("❌ Database connection error:", err);
    }
})();

app.listen(5000, '0.0.0.0', () => {
    console.log("🚀 Server running on port 5000");
});
