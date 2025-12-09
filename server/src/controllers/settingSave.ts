import type { Request, Response } from "express";
import { db } from "../server";
import type { RowDataPacket } from "mysql2";
import fs from "fs";
import path from "path";

interface data extends RowDataPacket {
    id: number;
    NAME: string;
    DESCRIPTION: string;
    LOGO_URL: string;
}

export const save = async (req: Request, res: Response) => {
    try {
        const { storeTitle, storeDescription } = req.body;
        const file = req.file; // 👈 มาจาก multer

        // โหลดข้อมูลปัจจุบัน
        const [rows] = await db.query<data[]>(
            "SELECT * FROM restaurant_info WHERE id = 1"
        );
        const current = rows[0];

        if (!current) return res.status(400).json({ message: "Not found" });

        const fields = [];
        const values: any[] = [];

        // Update title
        if (storeTitle && storeTitle.length !== 0) {
            fields.push("NAME = ?");
            values.push(storeTitle);
        }

        // Update description
        if (storeDescription && storeDescription.length !== 0) {
            fields.push("DESCRIPTION = ?");
            values.push(storeDescription);
        }

        console.log("1")
        // Update banner (ถ้ามีไฟล์ใหม่)
        if (file) {
            const newPath = "/uploads/" + file.filename;
            fields.push("LOGO_URL = ?");
            values.push(newPath);

            // ย้ายรูปเก่าไปถังขยะ
            const oldFile = current.LOGO_URL; // "/uploads/banner_123.png"
            const oldPath = path.join("public", oldFile);
            const binPath = path.join("public/bin", path.basename(oldFile));

            if (fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, binPath); // ย้ายไปถังขยะ
            }
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: "No data to update" });
        }

        values.push(1);

        const sql = `UPDATE restaurant_info SET ${fields.join(", ")} WHERE ID = ?`;

        await db.query(sql, values);

        return res.json({ message: "Success" });

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const get_data = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query<data[]>(
            "SELECT * FROM restaurant_info WHERE id = 1"
        );

        const data = rows[0];

        if (!data) {
            return res.status(400).json({ message: "Error." });
        }

        return res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};