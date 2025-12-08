import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './database/database.js';

dotenv.config();

const app = express();

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
