from flask import Blueprint, request, jsonify
from sqlalchemy import func
from datetime import datetime, timedelta
from database import db, OrderTable, ProductOrder, Product, ProductIngredient, Ingredient

charts_routes_bp = Blueprint('charts_routes', __name__)

@charts_routes_bp.route('/getproductsusedchart', methods=['GET'])
def get_products_used_chart():
    interval = request.args.get("interval")
    now = datetime.utcnow()

    if interval == "day":
        start_dt = datetime(now.year, now.month, now.day)
        end_dt = now
    elif interval == "week":
        start_dt = now - timedelta(days=now.weekday())
        end_dt = now
    elif interval == "month":
        start_dt = datetime(now.year, now.month, 1)
        end_dt = now
    elif interval == "year":
        start_dt = datetime(now.year, 1, 1)
        end_dt = now
    else:
        # Default to day view if unspecified
        start_dt = datetime(now.year, now.month, now.day)
        end_dt = now

    query = (
        db.session.query(
            Product.name.label("label"),
            func.sum(ProductOrder.quantity).label("value")
        )
        .join(Product, Product.id == ProductOrder.productid)
        .join(OrderTable, OrderTable.id == ProductOrder.orderid)
        .filter(OrderTable.order_date >= start_dt, OrderTable.order_date <= end_dt)
        .group_by(Product.name)
    )
    results = query.all()
    data = [{"label": r.label, "value": r.value} for r in results]
    return jsonify({"data": data})

@charts_routes_bp.route('/getingredientsusedchart', methods=['GET'])
def get_ingredients_used_chart():
    interval = request.args.get("interval")
    now = datetime.utcnow()

    if interval == "day":
        start_dt = datetime(now.year, now.month, now.day)
        end_dt = now
    elif interval == "week":
        start_dt = now - timedelta(days=now.weekday())
        end_dt = now
    elif interval == "month":
        start_dt = datetime(now.year, now.month, 1)
        end_dt = now
    elif interval == "year":
        start_dt = datetime(now.year, 1, 1)
        end_dt = now
    else:
        start_dt = datetime(now.year, now.month, now.day)
        end_dt = now

    query = (
        db.session.query(
            Ingredient.name.label("label"),
            func.sum(ProductOrder.quantity * ProductIngredient.quantity).label("value")
        )
        .join(Product, Product.id == ProductOrder.productid)
        .join(ProductIngredient, ProductIngredient.productid == Product.id)
        .join(Ingredient, Ingredient.id == ProductIngredient.ingredientid)
        .join(OrderTable, OrderTable.id == ProductOrder.orderid)
        .filter(OrderTable.order_date >= start_dt, OrderTable.order_date <= end_dt)
        .group_by(Ingredient.name)
    )
    results = query.all()
    data = [{"label": r.label, "value": r.value} for r in results]
    return jsonify({"data": data})
