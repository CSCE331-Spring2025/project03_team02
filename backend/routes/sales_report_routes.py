from flask import Blueprint, jsonify, request
from database import Product, ProductOrder, OrderTable, db  # Use existing db instance
from sqlalchemy import func, text
from datetime import datetime, timedelta

sales_report_routes_bp = Blueprint('sales_routes', __name__)

@sales_report_routes_bp.route("/getsalesreport", methods=['GET'])
def get_sales_report():
    sales_data = []

    try:
        # Get parameters from the request
        interval = request.args.get('interval', default='today')
        start_date_str = request.args.get('startDate')
        end_date_str = request.args.get('endDate')

        # Default date range if no custom dates provided
        if not start_date_str or not end_date_str:
            # Set start and end dates for the given interval
            now = datetime.now()

            if interval == 'pastHour':
                start_date = now - timedelta(hours=1)
                end_date = now
            elif interval == 'today':
                start_date = datetime(now.year, now.month, now.day)
                end_date = now
            elif interval == 'thisWeek':
                start_date = now - timedelta(days=now.weekday())  # Start of the week
                end_date = now
            elif interval == 'thisMonth':
                start_date = datetime(now.year, now.month, 1)
                end_date = now
            elif interval == 'thisYear':
                start_date = datetime(now.year, 1, 1)
                end_date = now
            elif interval == 'custom' and start_date_str and end_date_str:
                # If custom date range provided, use those
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d %H:%M:%S')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d %H:%M:%S')
            else:
                # Default to today if no valid interval is passed
                start_date = datetime(now.year, now.month, now.day)
                end_date = now
        else:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d %H:%M:%S')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d %H:%M:%S')

        print(f"Using start_date: {start_date}, end_date: {end_date}")

        # Query the database based on the calculated or provided date range
        sales_query = db.session.query(
            Product.name.label('product_name'),
            func.sum(ProductOrder.quantity).label('total_quantity_sold'),
            func.sum(ProductOrder.quantity * Product.price).label('total_sales')
        ).join(
            ProductOrder, ProductOrder.productid == Product.id
        ).join(
            OrderTable, ProductOrder.orderid == OrderTable.id
        ).filter(
            OrderTable.order_date.between(start_date, end_date)  # Filter based on the date range
        ).group_by(
            Product.name
        ).order_by(
            text('total_sales DESC')
        ).all()

        # Collect the result
        for item in sales_query:
            sales_data.append({
                'product_name': item.product_name,
                'total_quantity_sold': item.total_quantity_sold,
                'total_sales': float(item.total_sales)
            })

    except Exception as error:
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    return jsonify({'data': sales_data})

