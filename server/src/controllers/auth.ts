import type { Request, Response } from "express";
import { db } from "../server";
import type { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface UserRow extends RowDataPacket {
    id: number;
    USERNAME: string;
    PASSWORD: string;
}

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const usernameNormalized = username.trim().toLowerCase();

        const [rows] = await db.query<UserRow[]>(
            "SELECT * FROM user WHERE username = ?",
            [usernameNormalized]
        );

        const user = rows[0];

        if (!user) {
            return res.status(400).json({ message: "User not found or Invalid credentials." });
        }
        
        const isMatch = await bcrypt.compare(password, user.PASSWORD);

        if (!isMatch) 
        {
            return res.status(400).json({ message: "Invalid username or password." });
        }
        
        const payload = {
            user: {
                id: user.id,
                username: user.username,
            }
        };

        const token = jwt.sign(payload, "jwtsecret");

        return res.json({ token, payload });

    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};

export const change = async (req: Request, res: Response) => {
    try {
        const { username, password_old, password_1, password_2 } = req.body;

        const [rows] = await db.query<UserRow[]>(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        const user = rows[0];

        if (!user) {
            return res.status(400).send("User not found!!!");
        }

        const isMatch = await bcrypt.compare(password_old, user.password);
        if (!isMatch) return res.status(400).send("Old password incorrect.");

        if (password_1 !== password_2) {
            return res.status(400).send("New passwords do not match.");
        }

        if (password_old === password_1) {
            return res.status(400).send("New password must be different.");
        }

        const hash = await bcrypt.hash(password_1, 10);

        await db.query(
            "UPDATE users SET password = ? WHERE username = ?",
            [hash, username]
        );

        return res.send("Password changed successfully.");

    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};