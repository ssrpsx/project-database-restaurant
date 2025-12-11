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