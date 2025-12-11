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

export const get_restaurant_info = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query<dataRestaurantInfo[]>(
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
        return res.status(500).json({ message: "Error." });
    }
};

export const get_category = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query<dataMenuItem[]>(
            "SELECT * FROM category"
        );

        const data = rows;

        if (!data) {
            return res.status(400).json({ message: "Error." });
        }

        return res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error." });
    }
};

export const get_menus = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query<dataMenuItem[]>(
            "SELECT * FROM menu_item"
        );

        const data = rows;

        if (!data) {
            return res.status(400).json({ message: "Error." });
        }

        return res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error." });
    }
};

export const get_menus_detail = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const [rows] = await db.query<dataMenuItem[]>(
            "SELECT * FROM menu_item WHERE id = ?", [id]
        );

        const data = rows;

        if (!data) {
            return res.status(400).json({ message: "Error." });
        }

        return res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error." });
    }
};

export const get_table_number = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query<dataMenuItem[]>(
            "SELECT * FROM table_info"
        );

        const data = rows;

        if (!data) {
            return res.status(400).json({ message: "Error." });
        }

        return res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error." });
    }
};

export const get_search = async (req: Request, res: Response) => {
    try {
        const keyword = req.query.keyword as string;

        if (!keyword) {
            return res.status(400).json({ message: "keyword is required" });
        }

        const [rows] = await db.query<dataMenuItem[]>(
            `SELECT * FROM menu_item WHERE NAME LIKE ?`,
            [`%${keyword}%`]
        );

        return res.status(200).json(rows);
    }
    catch (err) {
        console.error("❌ Search error:", err);
        return res.status(500).json({ message: "Error." });
    }
};

export const get_kitchen_orders = async (req: Request, res: Response) => {
    try {
        const sql = `
            SELECT 
                o.ID as order_id, 
                o.STATUS, 
                o.created_at,
                t.TABLE_NUMBER,
                oi.ID as item_id,
                oi.QUANTITY,
                m.NAME as menu_name,
                m.IMAGE_URL
            FROM orders o
            LEFT JOIN table_info t ON o.TABLE_ID = t.ID
            JOIN order_items oi ON o.ID = oi.ORDER_ID
            JOIN menu_item m ON oi.MENU_ITEM_ID = m.ID
            WHERE o.STATUS IN ('pending', 'preparing', 'served')
            ORDER BY o.created_at ASC
        `;

        const [rows] = await db.query<any[]>(sql);

        const ordersMap = new Map();

        rows.forEach(row => {
            if (!ordersMap.has(row.order_id)) {
                ordersMap.set(row.order_id, {
                    id: row.order_id,
                    table_number: row.TABLE_NUMBER || 'N/A',
                    status: row.STATUS,
                    created_at: row.created_at,
                    items: []
                });
            }

            const order = ordersMap.get(row.order_id);
            order.items.push({
                item_id: row.item_id,
                name: row.menu_name,
                quantity: row.QUANTITY,
                image: row.IMAGE_URL
            });
        });

        const result = Array.from(ordersMap.values());

        res.json(result);

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ordersController.ts

export const get_orders_by_table = async (req: Request, res: Response) => {
    try {
        const { table_number } = req.params;

        console.log(table_number)

        const sql = `
            SELECT 
                o.ID as order_id, 
                o.STATUS, 
                o.created_at,
                t.TABLE_NUMBER,
                oi.ID as item_id,
                oi.QUANTITY,
                oi.PRICE,
                m.NAME as menu_name,
                m.IMAGE_URL
            FROM orders o
            LEFT JOIN table_info t ON o.TABLE_ID = t.ID
            JOIN order_items oi ON o.ID = oi.ORDER_ID
            JOIN menu_item m ON oi.MENU_ITEM_ID = m.ID
            WHERE o.STATUS IN ('pending', 'preparing', 'served') 
            AND t.TABLE_NUMBER = ?
            ORDER BY o.created_at ASC
        `;

        const [rows] = await db.query<any[]>(sql, [table_number]);

        const ordersMap = new Map();

        rows.forEach(row => {
            if (!ordersMap.has(row.order_id)) {
                ordersMap.set(row.order_id, {
                    round_id: row.order_id,
                    timestamp: row.created_at,
                    status: row.STATUS,
                    items: []
                });
            }

            const order = ordersMap.get(row.order_id);
            order.items.push({
                item_id: row.item_id,
                name: row.menu_name,
                status: row.STATUS,
                imageURL: row.IMAGE_URL,
                price: parseFloat(row.PRICE),
                quantity: row.QUANTITY
            });
        });

        const result = Array.from(ordersMap.values());

        console.log(result)
        res.json(result);

    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};