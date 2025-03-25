"Weekly Sales History (Rodrigo)"
SELECT DATE_TRUNC('week', order_date) AS week_start, COUNT(*) AS total_orders
FROM ordertable
GROUP BY week_start
ORDER BY week_start ASC;

"Realistic Sales History (Arun)"
SELECT DATE_TRUNC('hour', order_date) AS hour, 
        COUNT(*) AS order_count, 
        SUM(total) AS total_revenue
FROM ordertable
GROUP BY hour
ORDER BY hour ASC;

"Peak Sales Days (AJ)"
SELECT order_date, SUM(total) AS daily_revenue
FROM ordertable
GROUP BY order_date
ORDER BY daily_revenue DESC
LIMIT 10;

"Menu Item Inventory Usage (Srikar)"
SELECT p.name AS menu_item, COUNT(pi.ingredientid) AS total_ingredients_used
FROM product p
JOIN product_ingredient pi ON p.id = pi.productid
GROUP BY p.name
ORDER BY total_ingredients_used DESC;

"Best of the Worst (Brayden)"
SELECT DATE_TRUNC('week', order_date) AS week_start,
        SUM(total) AS total_revenue,
        COUNT(po.productid) AS total_menu_items_sold
FROM ordertable o
JOIN product_order po ON o.id = po.orderid
GROUP BY week_start
ORDER BY total_revenue ASC, total_menu_items_sold DESC
LIMIT 10;