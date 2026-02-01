import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            multipleStatements: true
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS Project`);
        console.log("✔ DATABASE 'Project' created / already exists");

        await connection.query(`USE Project`);


        const createTablesSQL = `
        -- ร้านอาหาร
        CREATE TABLE IF NOT EXISTS restaurant_info (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            NAME VARCHAR(100) NOT NULL,
            DESCRIPTION TEXT,
            LOGO_URL VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            
            -- หมวดหมู่เมนู
            CREATE TABLE IF NOT EXISTS category (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                NAME VARCHAR(50) NOT NULL
                );
                
                -- รายการอาหาร
                CREATE TABLE IF NOT EXISTS menu_item (
                    ID INT AUTO_INCREMENT PRIMARY KEY,
                    CATEGORY_ID INT NOT NULL,
                    NAME VARCHAR(100) NOT NULL,
                    DESCRIPTION TEXT,
                    PRICE INT NOT NULL,
                    IMAGE_URL VARCHAR(255) DEFAULT '/image.png',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (CATEGORY_ID) REFERENCES category(ID)
                    ON DELETE CASCADE
                    );
                    
                    -- โต๊ะอาหาร
                    CREATE TABLE IF NOT EXISTS table_info (
                        ID INT AUTO_INCREMENT PRIMARY KEY,
                        TABLE_NUMBER VARCHAR(20) NOT NULL
                        );
                        
                        -- ออเดอร์
                        CREATE TABLE IF NOT EXISTS orders (
                            ID INT AUTO_INCREMENT PRIMARY KEY,
                            TABLE_ID INT,
                            STATUS ENUM('pending', 'preparing', 'served', 'paid') DEFAULT 'pending',
                            TOTAL DECIMAL(10,2) DEFAULT 0,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            FOREIGN KEY (table_id) REFERENCES table_info(id)
                            ON DELETE SET NULL
                            );
                            
                            -- รายการในออเดอร์
                            CREATE TABLE IF NOT EXISTS order_items (
                                ID INT AUTO_INCREMENT PRIMARY KEY,
                                ORDER_ID INT NOT NULL,
                                MENU_ITEM_ID INT NOT NULL,
                                QUANTITY INT DEFAULT 1,
                                PRICE DECIMAL(10,2) NOT NULL,
                                FOREIGN KEY (order_id) REFERENCES orders(id)
                                ON DELETE CASCADE,
                                FOREIGN KEY (menu_item_id) REFERENCES menu_item(id)
                                ON DELETE CASCADE
                                );
                                
                                CREATE TABLE IF NOT EXISTS user (
                                    ID INT AUTO_INCREMENT PRIMARY KEY,
                                    USERNAME VARCHAR(255) NOT NULL,
                                    PASSWORD VARCHAR(255) NOT NULL
                                    );
                                    `;

        await connection.query(createTablesSQL);
        console.log("✔ All tables created!");

        const defaultPassword = "password";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        console.log("✔ Default password hashed successfully.");

        await connection.query(
            "INSERT INTO user(USERNAME, PASSWORD) VALUES(?, ?) ON DUPLICATE KEY UPDATE PASSWORD = VALUES(PASSWORD)",
            ["admin", hashedPassword]
        );

        console.log("✔ Default user 'admin' inserted/updated with HASHED password.");

        await connection.query(
            "INSERT INTO restaurant_info(NAME, DESCRIPTION, LOGO_URL) VALUES(?, ?, ?)",
            ["Food UP", "TEXT Self-service water.", "/background.png"]
        )

        console.log("✔ Default NAME, DESCRIPTION, LOGO_URL.");
        await connection.end();
    }
    catch (err) {
        console.error("❌ ERROR:", err);
    }
}

createDatabase();