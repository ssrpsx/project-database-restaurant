use project;

select * from restaurant_info WHERE id = 1;

UPDATE restaurant_info SET LOGO_URL = '/banner.png' WHERE id = 1;

INSERT INTO category (NAME) VALUES("ต้มยำ");

select * from category WHERE NAME = 'ต้มยำ';

select * from category;

DELETE FROM category WHERE id = 2;

UPDATE category SET Name = "123" WHERE ID = 19;

INSERT INTO restaurant_info(NAME, DESCRIPTION, LOGO_URL) VALUES("My Restaurant11","TEXT","banner.png");

select * from menu_item;

select * from orders;

SELECT * FROM menu_item WHERE NAME LIKE '%ผัด%';

SELECT * FROM order_items;

SELECT * FROM menu_item;

SELECT * FROM orders;

SELECT * FROM table_info;

DELETE FROM menu_item WHERE id = 2;

INSERT INTO menu_item(CATEGORY_ID, NAME, PRICE, IMAGE_URL) VALUES
(1, "ก๋วยเตี๋ยวน้ำใส", 60, "/import/ก๋วยเตี๋ยวน้ำใส.jpg"),
(1, "ก๋วยเตี๋ยวเรือ", 60, "/import/ก๋วยเตี๋ยวเรือ.jpg"),
(1, "บะหมี่ต้มยำ", 60, "/import/บะหมี่ต้มยำ.jpg");

INSERT INTO orders(TABLE_ID, total) VALUES(3, 500);

SELECT o.ID as order_id, 
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
WHERE o.STATUS IN ('pending', 'preparing', 'served') AND TABLE_NUMBER = 'A2'
ORDER BY o.created_at ASC;
   
SELECT 
	MONTH(created_at) as month, 
	SUM(TOTAL) as total_revenue
FROM orders 
WHERE STATUS = 'paid' 
AND YEAR(created_at) = 2025
GROUP BY MONTH(created_at)
ORDER BY month ASC;