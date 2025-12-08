import mysql from 'mysql2';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'CSS222',
    database: 'project'
});

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));

connectDB.connect(err => {
    if (err) {
        console.error("❌ Error connecting to MySQL:", err);
        return;
    }
    console.log("✅ MySQL Connected!");
});

app.listen(5000, '0.0.0.0', () => {
    console.log("✅ Server is Running on port 5000");
});
