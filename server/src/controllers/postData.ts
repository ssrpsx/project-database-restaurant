import type { Request, Response } from "express";
import { db } from "../server";
import type { RowDataPacket } from "mysql2";

interface dataRestaurantInfo extends RowDataPacket {
    ID: number;
    NAME: string;
    DESCRIPTION: string;
    LOGO_URL: string;
}

interface dataMenuItem extends RowDataPacket {
    ID: number;
    NAME: string;
    CATEGORY_ID: number;
    PRICE: number;
    IMAGE_URL: string;
}

export const post_restaurant_info = async (req: Request, res: Response) => {
    try {
        const { storeTitle, storeDescription } = req.body;
        const file = req.file;

        const [rows] = await db.query<dataRestaurantInfo[]>(
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

        // Update banner (ถ้ามีไฟล์ใหม่)
        if (file) {
            const newPath = "/uploads/" + file.filename;
            fields.push("LOGO_URL = ?");
            values.push(newPath);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: "No data to update" });
        }

        values.push(1);

        const sql = `UPDATE restaurant_info SET ${fields.join(", ")} WHERE ID = ?`;

        await db.query(sql, values);

        return res.json({ message: "Update Successfully" });

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const post_category = async (req: Request, res: Response) => {
    const { name } = req.body;

    const [rows] = await db.query<dataMenuItem[]>(
        "SELECT * FROM category WHERE NAME = ?;", [name]
    );

    const data = rows[0];

    if (data) {
        return res.status(400).json({ message: "Already have this category name" });
    }

    await db.query('INSERT INTO category (NAME) VALUES (?)', [name]);

    return res.status(200).json({ message: "Added successfully" })
};

export const post_menu = async (req: Request, res: Response) => {
    const { category_id, name, price, desc } = req.body;

    const [rows] = await db.query<dataMenuItem[]>(
        "SELECT * FROM menu_item WHERE NAME = ?;", [name]
    );

    const data = rows[0];

    if (data) {
        return res.status(400).json({ message: "Already have this menu name" });
    }

    await db.query('INSERT INTO menu_item(CATEGORY_ID, NAME, PRICE, DESCRIPTION) VALUE(?, ?, ?, ?);', [category_id, name, price, desc]);

    return res.status(200).json({ message: "Added successfully" })
};

export const post_table_number = async (req: Request, res: Response) => {
    const { table_number } = req.body;

    const [rows] = await db.query<dataMenuItem[]>(
        "SELECT * FROM table_info WHERE TABLE_NUMBER = ?;", [table_number]
    );

    const data = rows[0];

    if (data) {
        return res.status(400).json({ message: "Already have this table name" });
    }

    await db.query('INSERT INTO table_info(TABLE_NUMBER) VALUE(?);', [table_number]);

    return res.status(200).json({ message: "Added successfully" })
};

export const post_order = async (req: Request, res: Response) => {
    try {
        const { table_number, quantity, price } = req.body;
        const id = req.params.id;

        const [rows] = await db.query<dataMenuItem[]>(
            "SELECT * FROM table_info WHERE TABLE_NUMBER = ?", [table_number]
        );

        const [orderResult]: any = await db.query(
            "INSERT INTO orders(TABLE_ID, TOTAL) VALUES(?, ?)",
            [rows[0].ID, quantity * price]
        );

        const orderId = orderResult.insertId;
        console.log("New order ID:", orderId);

        await db.query(
            "INSERT INTO order_items(ORDER_ID, MENU_ITEM_ID, QUANTITY, PRICE) VALUES(?, ?, ?, ?)",
            [orderId, id, quantity, price]
        );

        res.status(200).json({
            message: "Order successfully created",
            order_id: orderId
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};
