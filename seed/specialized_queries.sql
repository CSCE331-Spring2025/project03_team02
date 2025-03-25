"Five preselected queries for database demo"

"Verify Orders Contain Products (Rodrigo)"
SELECT o.id AS order_id, COUNT(po.productid) AS total_products
FROM ordertable o
JOIN product_order po ON o.id = po.orderid
GROUP BY o.id
ORDER BY total_products DESC
LIMIT 10;

"Check Orders per Employee (Arun)"
SELECT e.id, e.name, COUNT(o.id) AS total_orders
FROM employee e
LEFT JOIN ordertable o ON e.id = o.employeeid
GROUP BY e.id, e.name
ORDER BY total_orders DESC;

"Best of the Worst (Srikar)"
SELECT DATE_TRUNC('week', order_date) AS week_start,
        SUM(total) AS total_revenue,
        COUNT(po.productid) AS total_menu_items_sold
FROM ordertable o
JOIN product_order po ON o.id = po.orderid
GROUP BY week_start
ORDER BY total_revenue ASC, total_menu_items_sold DESC
LIMIT 10; 

"Validate Peak Sales Days (AJ)"
SELECT order_date, SUM(total) AS daily_sales
FROM ordertable
GROUP BY order_date
ORDER BY daily_sales DESC
LIMIT 3;

"Validate Total Inventory Used (Brayden)"
SELECT i.name, SUM(po.quantity) AS total_used
FROM ingredient i
JOIN product_ingredient pi ON i.id = pi.ingredientid
JOIN product_order po ON pi.productid = po.productid
GROUP BY i.name
ORDER BY total_used DESC;
