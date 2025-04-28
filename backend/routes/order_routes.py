import math
from flask import Blueprint, jsonify, request
from datetime import datetime
import uuid

from database import Customer, db, OrderTable, ProductOrder, Ingredient

# blueprint for handling order-related routes
order_routes_bp = Blueprint('order_routes', __name__)

@order_routes_bp.route('/getorders', methods=['GET'])
def get_orders():
    try:
        # fetch incomplete orders sorted by date
        orders = OrderTable.query.filter_by(completed=False).order_by(OrderTable.order_date.asc()).all()
        result = []

        # format order data with product and ingredient details
        for order in orders:
            products_info = []
            for po in order.product_orders:
                product = po.product
                ingredients = [
                    {"id": ing.ingredient.id, "name": ing.ingredient.name}
                    for ing in product.product_ingredients
                ]
                products_info.append({
                    "id": str(product.id),
                    "name": product.name,
                    "description": product.description,
                    "price": float(product.price),
                    "ingredients": ingredients
                })

            result.append({
                "id": str(order.id),
                "employee_id": str(order.employeeid),
                "total": float(order.total),
                "order_date": order.order_date.isoformat(),
                "products": products_info
            })

        return jsonify({"orders": result})

    except Exception as error:
        print(error)
        return jsonify({"error": "Failed to fetch orders"}), 500


@order_routes_bp.route('/completeorder', methods=['POST'])
def complete_order():
    data = request.get_json()
    order_id = data.get('orderId')

    # validate order id
    if not order_id:
        return jsonify({"error": "Missing orderId"}), 400

    try:
        # find and mark order as complete
        order = OrderTable.query.get(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order.completed = True
        db.session.commit()

        return jsonify({"message": "Order marked as complete"}), 200

    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({"error": "Failed to complete order"}), 500


'''
POST orders endpoint

This endpoint creates a new order in the order table, product_order table and decrements ingredients
'''
@order_routes_bp.route('/submitorder', methods=['POST'])
def submit_order():
    data = request.get_json()
    
    # extract order details from request
    order_id = uuid.uuid4()
    products = data.get('products')
    ingredients = data.get('ingredients')
    employee_id = data.get('employee_id')
    customer_id = data.get('customer')
    total = data.get('total')
    discount = data.get('discount')
    order_date = datetime.now()

    try:
        # create new order record
        order = OrderTable(id=order_id, employeeid=employee_id, total=total, order_date=order_date)
        customer = Customer.query.filter_by(id=str(customer_id)).first()
        
        db.session.add(order)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    try:
        for product_id in products:
            product_order_id = uuid.uuid4()
            product_order = ProductOrder(id=product_order_id, orderid=order.id, productid=product_id, quantity=1)
            db.session.add(product_order)
        if customer:
            if discount > 0:
                if customer.points * 0.1 <= total:
                    customer.points = 0
                else:
                    customer.points -= math.floor(discount) * 10
            else:
                customer.points += math.ceil(total)

        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    
    try:
        for ingredient_id in ingredients:
            db_ingredient = Ingredient.query.filter_by(id=ingredient_id).first()
            if db_ingredient.quantity <= 0:
                raise Exception("Invalid Ingredient Quantity")
            db_ingredient.quantity -= 1

        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    
    return jsonify({ 'data': { 'id': order.id, 'employee_id': order.employeeid, 'total': order.total, 'order_date': order.order_date } })