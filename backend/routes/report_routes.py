from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
from sqlalchemy import func, cast, Date
from database import db, OrderTable, ProductOrder, Product, Ingredient, ProductIngredient, Employee

report_routes_bp = Blueprint('report_routes', __name__)

'''
GET X-Report endpoint

This endpoint gets sales data for the selected time range (daily, weekly, monthly)
'''
@report_routes_bp.route("/getxreport", methods=['GET'])
def get_x_report():
    try:
        # Get time range from request parameters
        time_range = request.args.get('timeRange', 'daily')
        
        today = datetime.now().date()
        
        if time_range == 'weekly':
            # Calculate start of week (Monday)
            start_date = today - timedelta(days=today.weekday())
            end_date = today
            period_name = "Weekly"
            time_unit_name = "Daily"  
            filter_condition = func.date(OrderTable.order_date) >= start_date
        elif time_range == 'monthly':
            # Calculate start of month
            start_date = today.replace(day=1)
            end_date = today
            period_name = "Monthly"
            time_unit_name = "Weekly" 
            filter_condition = func.date(OrderTable.order_date) >= start_date
        else:
            # Daily (default)
            start_date = today
            end_date = today
            period_name = "Daily"
            time_unit_name = "Hourly"  
            filter_condition = func.date(OrderTable.order_date) == today
        
        # Get basic sales totals with the appropriate filter
        orders_query = OrderTable.query.filter(filter_condition)
        total_orders = orders_query.count()
        
        # Calculate sales totals
        sales_data = db.session.query(
            func.sum(OrderTable.total).label('subtotal')
        ).filter(filter_condition).first()
        
        subtotal = float(sales_data.subtotal or 0)
        tax_total = subtotal * 0.0825 
        total_sales = subtotal + tax_total
        
        time_breakdown = []
        
        if time_range == 'daily':
            # Hourly breakdown for daily reports
            for hour in range(0, 24):
                start_time = datetime.combine(today, datetime.min.time()) + timedelta(hours=hour)
                end_time = start_time + timedelta(hours=1)
                
                hour_sales = db.session.query(
                    func.sum(OrderTable.total).label('total')
                ).filter(
                    OrderTable.order_date >= start_time,
                    OrderTable.order_date < end_time
                ).first()
                
                hour_total = float(hour_sales.total or 0)
                if hour_total > 0:  # Only include hours with sales
                    time_breakdown.append({
                        "hour": start_time.strftime("%I:%M %p"),
                        "total": hour_total
                    })
        
        elif time_range == 'weekly':
            # Daily breakdown for weekly reports
            for day_offset in range(7):
                day_date = start_date + timedelta(days=day_offset)
                if day_date > today:
                    break  
                
                day_sales = db.session.query(
                    func.sum(OrderTable.total).label('total')
                ).filter(
                    func.date(OrderTable.order_date) == day_date
                ).first()
                
                day_total = float(day_sales.total or 0)
                if day_total > 0 or day_date == today: 
                    time_breakdown.append({
                        "hour": day_date.strftime("%a, %b %d"), 
                        "total": day_total
                    })
        
        else:  # monthly
            # Weekly breakdown for monthly reports
            current_week_start = start_date
            week_number = 1
            
            while current_week_start <= today:
                week_end = min(current_week_start + timedelta(days=6), today)
                
                week_sales = db.session.query(
                    func.sum(OrderTable.total).label('total')
                ).filter(
                    func.date(OrderTable.order_date) >= current_week_start,
                    func.date(OrderTable.order_date) <= week_end
                ).first()
                
                week_total = float(week_sales.total or 0)
                time_breakdown.append({
                    "hour": f"Week {week_number} ({current_week_start.strftime('%b %d')} - {week_end.strftime('%b %d')})",
                    "total": week_total
                })
                
                current_week_start = week_end + timedelta(days=1)
                week_number += 1
        
        product_sales = []
        product_data = db.session.query(
            Product.id,
            Product.name,
            func.sum(ProductOrder.quantity).label('quantity'),
            func.sum(Product.price * ProductOrder.quantity).label('total')
        ).join(
            ProductOrder, ProductOrder.productid == Product.id
        ).join(
            OrderTable, OrderTable.id == ProductOrder.orderid
        ).filter(
            filter_condition
        ).group_by(
            Product.id, Product.name
        ).all()
        
        for product in product_data:
            product_sales.append({
                "name": product.name,
                "quantity": product.quantity,
                "total": float(product.total or 0)
            })
        
        # Get employee performance
        employee_performance = []
        employee_data = db.session.query(
            Employee.id,
            Employee.name,
            func.count(OrderTable.id).label('orders'),
            func.sum(OrderTable.total).label('sales')
        ).join(
            OrderTable, OrderTable.employeeid == Employee.id
        ).filter(
            filter_condition
        ).group_by(
            Employee.id, Employee.name
        ).all()
        
        for employee in employee_data:
            employee_performance.append({
                "name": employee.name,
                "orders": employee.orders,
                "sales": float(employee.sales or 0)
            })
        
        # Compile the report data
        report_data = {
            "totalOrders": total_orders,
            "subtotal": subtotal,
            "totalTax": tax_total,
            "totalSales": total_sales,
            "timeRange": time_range,
            "periodName": period_name,
            "timeUnitName": time_unit_name,
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
            "hourlySales": time_breakdown,
            "productSales": product_sales,
            "employeePerformance": employee_performance
        }
        
        return jsonify({"data": report_data})
        
    except Exception as error:
        print(f"Error generating X-Report: {error}")
        return jsonify({'error': f'Error generating X-Report: {str(error)}'}), 500

'''
POST Z-Report endpoint

This endpoint generates a Z-Report for the selected time range (daily, weekly, monthly)
'''
@report_routes_bp.route("/generatezreport", methods=['POST'])
def generate_z_report():
    try:
        data = request.get_json()
        time_range = data.get('timeRange', 'daily')
        
        today = datetime.now().date()
        
        if time_range == 'weekly':
            start_date = today - timedelta(days=today.weekday())
            period_name = "Weekly"
            filter_condition = func.date(OrderTable.order_date) >= start_date
            period_text = "This Week"
        elif time_range == 'monthly':
            start_date = today.replace(day=1)
            period_name = "Monthly"
            filter_condition = func.date(OrderTable.order_date) >= start_date
            period_text = "This Month"
        else:
            start_date = today
            period_name = "Daily"
            filter_condition = func.date(OrderTable.order_date) == today
            period_text = "Today"
        
        orders_query = OrderTable.query.filter(filter_condition)
        total_orders = orders_query.count()
        
        sales_data = db.session.query(
            func.sum(OrderTable.total).label('subtotal')
        ).filter(filter_condition).first()
        
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
            ProductOrder, ProductOrder.productid == Product.id
        ).join(
            OrderTable, OrderTable.id == ProductOrder.orderid
        ).filter(
            filter_condition
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
            func.count(OrderTable.id).label('orders'),
            func.sum(OrderTable.total).label('sales')
        ).join(
            OrderTable, OrderTable.employeeid == Employee.id
        ).filter(
            filter_condition
        ).group_by(
            Employee.id, Employee.name
        ).all()
        
        for employee in employee_data:
            sales_per_employee.append({
                "name": employee.name,
                "orders": employee.orders,
                "sales": float(employee.sales or 0)
            })
        
        # Compile the Z-Report data
        z_report_data = {
            "totalOrders": total_orders,
            "subtotal": subtotal,
            "totalTax": tax_total,
            "totalSales": total_sales,
            "timeRange": time_range,
            "periodName": period_name,
            "periodText": period_text,
            "startDate": start_date.isoformat(),
            "endDate": today.isoformat(),
            "ingredientsUsed": ingredients_used,
            "salesPerEmployee": sales_per_employee,
            "reportDate": today.isoformat(),
            "generatedAt": datetime.now().isoformat()
        }
        
        return jsonify({"data": z_report_data})
        
    except Exception as error:
        print(f"Error generating Z-Report: {error}")
        return jsonify({'error': f'Error generating Z-Report: {str(error)}'}), 500