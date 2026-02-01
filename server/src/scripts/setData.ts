import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            multipleStatements: true
        });

        await connection.query(`USE Project`);

        const categories = [
            'ผัด', 'ต้ม', 'แกง', 'ยำ', 'ส้มตำ',
            'ก๋วยเตี๋ยว', 'ราดหน้า', 'อาหารทะเล',
            'สเต็ก', 'อาหารจานเดียว', 'ของทอด',
            'ของหวาน', 'เครื่องดื่ม'
        ];

        const categoryValues = categories.map(c => [c]);

        await connection.query(
            `INSERT INTO category (Name) VALUES ?`,
            [categoryValues]
        );

        console.log("✔ INSERT CATEGORY SUCCESS");

        const menuItems = [
            // ผัด (1)
            [1, "ผัดซีอิ๊ว", 60, "/import/1.png"],
            [1, "ผัดมาม่า", 60, "/import/ผัดมาม่า.png"],
            [1, "ผัดไท", 60, "/import/ผัดไท.png"],

            // ต้ม (2)
            [2, "ต้มข่าไก่", 70, "/import/ต้มข่าไก่.png"],
            [2, "ต้มจืด", 60, "/import/ต้มจืด.png"],
            [2, "ต้มยำกุ้ง", 80, "/import/ต้มยำกุ้ง.png"],

            // แกง (3)
            [3, "แกงมัสสะหมั่น", 80, "/import/แกงมัสสะหมั่น.png"],
            [3, "แกงส้ม", 70, "/import/แกงส้ม.png"],
            [3, "แกงเขียวหวาน", 80, "/import/แกงเขียวหวาน.png"],

            // ยำ (4)
            [4, "ยำรวมมิตร", 70, "/import/ยำรวมมิตร.jpg"],
            [4, "ยำวุ้นเส้น", 70, "/import/ยำวุ้นเส้น.jpg"],
            [4, "ยำแซลม่อน", 90, "/import/ยำแซลม่อน.jpg"],

            // ส้มตำ (5)
            [5, "ส้มตำข้าวโพด", 60, "/import/ส้มตำข้าวโพด.jpg"],
            [5, "ส้มตำปูปลาร้า", 60, "/import/ส้มตำปูปลาร้า.jpg"],
            [5, "ส้มตำไทย", 60, "/import/ส้มตำไทย.jpg"],

            // ก๋วยเตี๋ยว (6)
            [6, "ก๋วยเตี๋ยวน้ำใส", 60, "/import/ก๋วยเตี๋ยวน้ำใส.jpg"],
            [6, "ก๋วยเตี๋ยวเรือ", 60, "/import/ก๋วยเตี๋ยวเรือ.jpg"],
            [6, "บะหมี่ต้มยำ", 60, "/import/บะหมี่ต้มยำ.jpg"],

            // ราดหน้า (7)
            [7, "ราดหน้าทะเล", 80, "/import/ราดหน้าทะเล.jpg"],
            [7, "ราดหน้าหมู", 70, "/import/ราดหน้าหมู.png"],

            // อาหารทะเล (8)
            [8, "กุ้งเผา", 150, "/import/กุ้งเผา.jpg"],
            [8, "ปลาหมึกทอด", 120, "/import/ปลาหมึกทอด.jpg"],
            [8, "แซลมอนดอง", 150, "/import/แซลมอนดอง.jpg"],

            // สเต็ก (9)
            [9, "สเต๊กซี่โครงไก่", 120, "/import/สเต๊กซี่โครงไก่.jpg"],
            [9, "สเต๊กเนื้อ", 150, "/import/สเต๊กเนื้อ.jpg"],
            [9, "สเต๊กไก่", 120, "/import/สเต๊กไก่.jpg"],

            // อาหารจานเดียว (10)
            [10, "ข้าวผัดกุ้ง", 70, "/import/ข้าวผัดกุ้ง.jpg"],
            [10, "ข้าวมันไก่", 60, "/import/ข้าวมันไก่.jpg"],
            [10, "ข้าวหน้าเป็ด", 80, "/import/ข้าวหน้าเป็ด.jpg"],

            // ของทอด (11)
            [11, "ทอดมันกุ้ง", 60, "/import/ทอดมันกุ้ง.jpg"],
            [11, "นักเก็ตไก่", 60, "/import/นักเก็ตไก่.jpg"],
            [11, "เอ็นไก่ทอด", 60, "/import/เอ็นไก่ทอด.jpg"],

            // ของหวาน (12)
            [12, "กล้วยบวดชี", 50, "/import/กล้วยบวดชี.jpg"],
            [12, "บัวลอย", 50, "/import/บัวลอย.jpg"],
            [12, "ไอติม", 40, "/import/ไอติม.jpg"],

            // เครื่องดื่ม (13)
            [13, "ชาเย็น", 35, "/import/ชาเย็น.jpg"],
            [13, "น้ำเปล่า", 15, "/import/น้ำเปล่า.jpg"],
            [13, "โค้ก", 20, "/import/โค้ก.jpg"]
        ];

        await connection.query(
            `INSERT INTO menu_item (CATEGORY_ID, NAME, PRICE, IMAGE_URL) VALUES ?`,
            [menuItems]
        );

        console.log("✔ INSERT MENU ITEM SUCCESS");

        const tables = [
            ['undefined'], ['A1'], ['A2'], ['A3'], ['A4'], ['A5']
        ];

        await connection.query(
            `INSERT INTO table_info (TABLE_NUMBER) VALUES ?`,
            [tables]
        );

        console.log("✔ INSERT TABLE INFO SUCCESS");

        const NUM_RECORDS = 1000;
        const values = [];
        for (let i = 0; i < NUM_RECORDS; i++) {

            const daysAgo = Math.floor(Math.random() * 365);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);

            date.setHours(Math.floor(Math.random() * 24));
            date.setMinutes(Math.floor(Math.random() * 60));

            const createdAt = date.toISOString().slice(0, 19).replace('T', ' ');

            const total = (Math.random() * (3000 - 100) + 100).toFixed(2);

            const tableId = Math.floor(Math.random() * 5) + 1;

            values.push([tableId, 'paid', total, createdAt, createdAt]);
        }

        const sql = `INSERT INTO orders (TABLE_ID, STATUS, TOTAL, created_at, updated_at) VALUES ?`;
        await connection.query(sql, [values]);

        console.log(`✔ INSERT DATA SUCCESS`);

        await connection.end();

        console.log(`✔ INSERT ALL SUCCESS`);
    }
    catch (err) {
        console.error("❌ ERROR:", err);
    }
}

createDatabase();
