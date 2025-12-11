import type { Request, Response } from "express";
import { db } from "../server";
import type { RowDataPacket } from "mysql2";

interface dataMenuItem extends RowDataPacket {
    ID: number;
    NAME: string;
    CATEGORY_ID: number;
    PRICE: number;
    IMAGE_URL: string;
}

export const update_category = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { name } = req.body;

        const [rows] = await db.query<dataMenuItem[]>(
            "SELECT * FROM category WHERE id = ?", [id]
        );

        const data = rows[0];

        if (!data) {
            return res.status(400).json({ message: "Error. cannot find this category in database" });
        }

        await db.query('UPDATE category SET Name = ? WHERE ID = ?;', [name, id]);

        return res.status(200).json("Update successfully");
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};

export const update_menu = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { name, price, desc } = req.body;

        const file = req.file;

        const [rows] = await db.query<any[]>(
            "SELECT * FROM menu_item WHERE id = ?", [id]
        );
        const current = rows[0];

        if (!current) return res.status(404).json({ message: "Menu not found" });

        const fields: string[] = [];
        const values: any[] = [];

        if (name && name.trim() !== "") {
            fields.push("NAME = ?");
            values.push(name);
        }

        if (price && price.toString().trim() !== "") {
            fields.push("PRICE = ?");
            values.push(price);
        }

        if (desc !== undefined && desc !== "null") {
            fields.push("DESCRIPTION = ?");
            values.push(desc);
        }

        if (file) {
            const imagePath = `/uploads/${file.filename}`;

            fields.push("IMAGE_URL = ?");
            values.push(imagePath);
        }

        // 4. ถ้าไม่มีอะไรส่งมาให้อัปเดตเลย
        if (fields.length === 0) {
            return res.status(400).json({ message: "No data to update" });
        }

        values.push(id);
        const sql = `UPDATE menu_item SET ${fields.join(", ")} WHERE ID = ?`;

        await db.query(sql, values);

        return res.json({
            message: "Update Successfully",
            newImage: file ? `/uploads/${file.filename}` : null
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const update_order_status = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
        res.json({ message: "Status updated" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};