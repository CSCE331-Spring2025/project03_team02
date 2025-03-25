"Order breakdown by week"
SELECT 
    DATE_TRUNC('week', order_date) AS order_week,
    COUNT(*) AS total_orders,
    SUM(total) AS total_revenue
FROM ordertable
GROUP BY order_week
ORDER BY order_week;

"Check Total Revenue"
SELECT SUM(total) AS total_revenue FROM ordertable;

"Validate Peak Sales Days"
SELECT order_date, SUM(total) AS daily_sales
FROM ordertable
GROUP BY order_date
ORDER BY daily_sales DESC
LIMIT 3;

"Check total orders"
SELECT COUNT(*) AS total_orders FROM ordertable;

"Check Total Revenue"
SELECT SUM(total) AS total_revenue FROM ordertable;

"Check Orders per Employee"
SELECT e.id, e.name, COUNT(o.id) AS total_orders
FROM employee e
LEFT JOIN ordertable o ON e.id = o.employeeid
GROUP BY e.id, e.name
ORDER BY total_orders DESC;

"Best of the Worst"
SELECT DATE_TRUNC('week', order_date) AS week_start,
        SUM(total) AS total_revenue,
        COUNT(po.productid) AS total_menu_items_sold
FROM ordertable o
JOIN product_order po ON o.id = po.orderid
GROUP BY week_start
ORDER BY total_revenue ASC, total_menu_items_sold DESC
LIMIT 10;

"Validate Weekly Sales Trends"
SELECT DATE_TRUNC('week', order_date) AS week_start, SUM(total) AS weekly_sales
FROM ordertable
GROUP BY week_start
ORDER BY week_start DESC;

"Verify Orders Contain Products"
SELECT o.id AS order_id, COUNT(po.productid) AS total_products
FROM ordertable o
JOIN product_order po ON o.id = po.orderid
GROUP BY o.id
ORDER BY total_products DESC
LIMIT 10;

"Check Product Popularity"
SELECT p.name, COUNT(po.productid) AS total_ordered
FROM product p
JOIN product_order po ON p.id = po.productid
GROUP BY p.name
ORDER BY total_ordered DESC
LIMIT 10;

"Validate Orders with Highest Value"
SELECT id, employeeid, total, order_date
FROM ordertable
ORDER BY total DESC
LIMIT 10;

"Validate Total Inventory Used"
SELECT i.name, SUM(po.quantity) AS total_used
FROM ingredient i
JOIN product_ingredient pi ON i.id = pi.ingredientid
JOIN product_order po ON pi.productid = po.productid
GROUP BY i.name
ORDER BY total_used DESC;

"Validate Average Order Size"
SELECT ROUND(AVG(product_count), 2) AS avg_products_per_order
FROM (
SELECT COUNT(po.productid) AS product_count
FROM ordertable o
JOIN product_order po ON o.id = po.orderid
GROUP BY o.id
) subquery;

"Most Frequently Ordered Ingredient"
SELECT 
    i.name AS ingredient_name,
    COUNT(pi.id) AS times_used
FROM product_ingredient pi
JOIN ingredient i ON pi.ingredientid = i.id
JOIN product_order po ON pi.productid = po.productid
GROUP BY i.name
ORDER BY times_used DESC
LIMIT 10;

"Check Revenue by Employee"
SELECT e.id, e.name, SUM(o.total) AS total_sales
FROM employee e
JOIN ordertable o ON e.id = o.employeeid
GROUP BY e.id, e.name
ORDER BY total_sales DESC
LIMIT 5;

"Average Order Value (AOV) Over Time"
SELECT 
    DATE_TRUNC('month', order_date) AS order_month,
    COUNT(id) AS total_orders,
    SUM(total) AS total_revenue,
    ROUND(AVG(total), 2) AS avg_order_value
FROM ordertable
GROUP BY order_month
ORDER BY order_month;

"Validate Number of Product-Ingredient Relationships"
SELECT p.name, COUNT(pi.ingredientid) AS total_ingredients
FROM product p
JOIN product_ingredient pi ON p.id = pi.productid
GROUP BY p.name
ORDER BY total_ingredients DESC
LIMIT 10;

"Check Inventory Consumption by Date"
SELECT ordertable.order_date, i.name, SUM(po.quantity) AS total_used
FROM ingredient i
JOIN product_ingredient pi ON i.id = pi.ingredientid
JOIN product_order po ON pi.productid = po.productid
JOIN ordertable ON po.orderid = ordertable.id
GROUP BY ordertable.order_date, i.name
ORDER BY ordertable.order_date DESC, total_used DESC;

"Verify Daily Revenue Trends"
SELECT * FROM ordertable ORDER BY RANDOM() LIMIT 10;

"Validate Products Missing Ingredients"
SELECT p.name AS product_name
FROM product p
LEFT JOIN product_ingredient pi ON p.id = pi.productid
WHERE pi.productid IS NULL;

"Validate Ingredients Not Used in Any Product"
SELECT i.name AS ingredient_name
FROM ingredient i
LEFT JOIN product_ingredient pi ON i.id = pi.ingredientid
WHERE pi.ingredientid IS NULL;