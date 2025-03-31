from flask import Blueprint, request, jsonify
from sqlalchemy import func
from datetime import datetime, timedelta
from database import db, OrderTable, ProductOrder, Product, ProductIngredient, Ingredient

charts_routes_bp = Blueprint('charts_routes', __name__)


def get_date_range(interval):
    """Helper function to determine date range based on interval"""
    now = datetime.utcnow()

    if interval == "day":
        start_dt = datetime(now.year, now.month, now.day)
    elif interval == "week":
        monday = now - timedelta(days=now.weekday())
        start_dt = datetime(monday.year, monday.month, monday.day)
    elif interval == "month":
        start_dt = datetime(now.year, now.month, 1)
    elif interval == "year":
        start_dt = datetime(now.year, 1, 1)
    else:
        raise ValueError("Invalid interval provided")

    return start_dt, now


@charts_routes_bp.route('/getproductsusedchart', methods=['GET'])
def get_products_used_chart():
    interval = request.args.get("interval", "daily").lower()

    try:
        start_dt, end_dt = get_date_range(interval)

        query = (
            db.session.query(
                Product.name.label("label"),
                func.count(ProductOrder.productid).label("value")
            )
            .join(Product, Product.id == ProductOrder.productid)
            .join(OrderTable, OrderTable.id == ProductOrder.orderid)
            .filter(OrderTable.order_date >= start_dt, OrderTable.order_date <= end_dt)
            .group_by(Product.name)
            .order_by(func.count(ProductOrder.productid).desc())
        )

        results = query.all()
        data = [{"label": r.label, "value": r.value} for r in results]

        if not data:
            data = [{"label": "No Data", "value": 0}]

        return jsonify({"data": data})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@charts_routes_bp.route('/getingredientsusedchart', methods=['GET'])
def get_ingredients_used_chart():
    interval = request.args.get("interval", "daily").lower()

    try:
        start_dt, end_dt = get_date_range(interval)

        query = (
            db.session.query(
                Ingredient.name.label("label"),
                func.sum(ProductOrder.quantity *
                         ProductIngredient.quantity).label("value")
            )
            .join(Product, Product.id == ProductOrder.productid)
            .join(ProductIngredient, ProductIngredient.productid == Product.id)
            .join(Ingredient, Ingredient.id == ProductIngredient.ingredientid)
            .join(OrderTable, OrderTable.id == ProductOrder.orderid)
            .filter(OrderTable.order_date >= start_dt, OrderTable.order_date <= end_dt)
            .group_by(Ingredient.name)
            .order_by(Ingredient.name)
        )

        results = query.all()
        data = [{"label": r.label, "value": r.value} for r in results]

        if not data:
            data = [{"label": "No Data", "value": 0}]

        return jsonify({"data": data})

    except Exception as e:
        return jsonify({"error": str(e)}), 400
