from flask import Blueprint, jsonify
from database import Product, ProductOrder, OrderTable, db  # Use existing db instance
from sqlalchemy import func, text  # Correct import
from datetime import datetime

sales_report_routes_bp = Blueprint('sales_routes', __name__)

@sales_report_routes_bp.route("/getsalesreport", methods=['GET'])
def get_sales_report():
    sales_data = []  # Ensure this is always defined

    try:
        start_date = datetime.strptime('2024-01-01', '%Y-%m-%d')
        end_date = datetime.strptime('2025-03-29', '%Y-%m-%d')

        sales_query = db.session.query(
            Product.name.label('product_name'),
            func.sum(ProductOrder.quantity).label('total_quantity_sold'),
            func.sum(ProductOrder.quantity * Product.price).label('total_sales')
        ).join(
            ProductOrder, ProductOrder.productid == Product.id
        ).join(
            OrderTable, ProductOrder.orderid == OrderTable.id
        ).filter(
            OrderTable.order_date.between(start_date, end_date)  
        ).group_by(
            Product.name
        ).order_by(
            text('total_sales DESC')
        ).all()

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

