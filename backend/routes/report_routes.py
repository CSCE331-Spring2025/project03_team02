from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from sqlalchemy import func, cast, Date
from database import db, Employee
import uuid

from database import ordertable as Order, product_order as OrderProduct, product as Product, ingredient as Ingredient, product_ingredient as ProductIngredient

report_routes_bp = Blueprint('report_routes', __name__)

'''
GET X-Report endpoint

This endpoint gets the current day's sales data for the X-Report
'''
@report_routes_bp.route("/getxreport", methods=['GET'])
def get_x_report():
    try:
       
        today = datetime.now().date()
        
        orders_query = Order.query.filter(func.date(Order.order_date) == today)
        total_orders = orders_query.count()
        
        sales_data = db.session.query(
            func.sum(Order.total).label('subtotal')
        ).filter(func.date(Order.order_date) == today).first()
        
        subtotal = float(sales_data.subtotal or 0)
        tax_total = subtotal * 0.0825  
        total_sales = subtotal + tax_total
        
        hourly_sales = []
        for hour in range(0, 24):
            start_time = datetime.combine(today, datetime.min.time()) + timedelta(hours=hour)
            end_time = start_time + timedelta(hours=1)
            
            hour_sales = db.session.query(
                func.sum(Order.total).label('total')
            ).filter(
                Order.order_date >= start_time,
                Order.order_date < end_time
            ).first()
            
            hour_total = float(hour_sales.total or 0)
            if hour_total > 0: 
                hourly_sales.append({
                    "hour": start_time.strftime("%I:%M %p"),
                    "total": hour_total
                })
        
        product_sales = []
        product_data = db.session.query(
            Product.id,
            Product.name,
            func.sum(OrderProduct.quantity).label('quantity'),
            func.sum(Product.price * OrderProduct.quantity).label('total')
        ).join(
            OrderProduct, OrderProduct.productid == Product.id
        ).join(
            Order, Order.id == OrderProduct.orderid
        ).filter(
            func.date(Order.order_date) == today
        ).group_by(
            Product.id, Product.name
        ).all()
        
        for product in product_data:
            product_sales.append({
                "name": product.name,
                "quantity": product.quantity,
                "total": float(product.total or 0)
            })
        
        employee_performance = []
        employee_data = db.session.query(
            Employee.id,
            Employee.name,
            func.count(Order.id).label('orders'),
            func.sum(Order.total).label('sales')
        ).join(
            Order, Order.employeeid == Employee.id
        ).filter(
            func.date(Order.order_date) == today
        ).group_by(
            Employee.id, Employee.name
        ).all()
        
        for employee in employee_data:
            employee_performance.append({
                "name": employee.name,
                "orders": employee.orders,
                "sales": float(employee.sales or 0)
            })
        
        report_data = {
            "totalOrders": total_orders,
            "subtotal": subtotal,
            "totalTax": tax_total,
            "totalSales": total_sales,
            "hourlySales": hourly_sales,
            "productSales": product_sales,
            "employeePerformance": employee_performance
        }
        
        return jsonify({"data": report_data})
        
    except Exception as error:
        print(f"Error generating X-Report: {error}")
        return jsonify({'error': 'Error generating X-Report'}), 500

'''
POST Z-Report endpoint

This endpoint generates a Z-Report (end-of-day report) and resets the X-Report data
'''
@report_routes_bp.route("/generatezreport", methods=['POST'])
def generate_z_report():
    try:

        today = datetime.now().date()
        

        orders_query = Order.query.filter(func.date(Order.order_date) == today)
        total_orders = orders_query.count()
        

        sales_data = db.session.query(
            func.sum(Order.total).label('subtotal')
        ).filter(func.date(Order.order_date) == today).first()
        
        subtotal = float(sales_data.subtotal or 0)
        tax_total = subtotal * 0.0825  
        total_sales = subtotal + tax_total
        

        ingredients_used = []
        ingredient_data = db.session.query(
            Ingredient.id,
            Ingredient.name,
            func.count(ProductIngredient.id).label('count')
        ).join(
            ProductIngredient, ProductIngredient.ingredientid == Ingredient.id
        ).join(
            Product, Product.id == ProductIngredient.productid
        ).join(
            OrderProduct, OrderProduct.productid == Product.id
        ).join(
            Order, Order.id == OrderProduct.orderid
        ).filter(
            func.date(Order.order_date) == today
        ).group_by(
            Ingredient.id, Ingredient.name
        ).all()
        
        for ingredient in ingredient_data:
            ingredients_used.append({
                "name": ingredient.name,
                "count": ingredient.count
            })
        

        sales_per_employee = []
        employee_data = db.session.query(
            Employee.id,
            Employee.name,
            func.count(Order.id).label('orders'),
            func.sum(Order.total).label('sales')
        ).join(
            Order, Order.employeeid == Employee.id
        ).filter(
            func.date(Order.order_date) == today
        ).group_by(
            Employee.id, Employee.name
        ).all()
        
        for employee in employee_data:
            sales_per_employee.append({
                "name": employee.name,
                "orders": employee.orders,
                "sales": float(employee.sales or 0)
            })
        

        z_report_data = {
            "totalOrders": total_orders,
            "subtotal": subtotal,
            "totalTax": tax_total,
            "totalSales": total_sales,
            "ingredientsUsed": ingredients_used,
            "salesPerEmployee": sales_per_employee,
            "reportDate": today.isoformat(),
            "generatedAt": datetime.now().isoformat()
        }
        
        
        return jsonify({"data": z_report_data})
        
    except Exception as error:
        print(f"Error generating Z-Report: {error}")
        return jsonify({'error': 'Error generating Z-Report'}), 500