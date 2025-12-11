import type { Request, Response } from "express";
import { db } from "../server";
import type { RowDataPacket } from "mysql2";

interface data extends RowDataPacket {
    id: number;
    NAME: string;
    DESCRIPTION: string;
    LOGO_URL: string;
}

export const delete_category = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const [rows] = await db.query<data[]>(
            "SELECT * FROM category WHERE id = ?", [id]
        );

        const data = rows[0];

        if (!data) {
            return res.status(400).json({ message: "Error. cannot find this category in database" });
        }

        await db.query('DELETE FROM category WHERE id = ?', [id]);

        return res.status(200).json("Deleted successfully");
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};

export const delete_menu = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const [rows] = await db.query<data[]>(
            "SELECT * FROM menu_item WHERE id = ?", [id]
        );

        const data = rows[0];

        if (!data) {
            return res.status(400).json({ message: "Error. cannot find this menu in database" });
        }

        await db.query('DELETE FROM menu_item WHERE id = ?', [id]);

        return res.status(200).json("Deleted successfully");
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};

export const delete_table_number = async (req: Request, res: Response) => {
    try {
        console.log("ada")

        const id = req.params.id;

        const [rows] = await db.query<data[]>(
            "SELECT * FROM table_info WHERE id = ?", [id]
        );

        const data = rows[0];

        if (!data) {
            return res.status(400).json({ message: "Error. cannot find this table in database" });
        }

        await db.query('DELETE FROM table_info WHERE id = ?', [id]);

        return res.status(200).json("Deleted successfully");
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};