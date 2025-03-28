from flask import Blueprint, jsonify, request
from datetime import datetime
import uuid

from database import db, OrderTable, ProductOrder, Ingredient

order_routes_bp = Blueprint('order_routes', __name__)

'''
POST orders endpoint

This endpoint creates a new order in the order table, product_order table and decrements ingredients
'''
@order_routes_bp.route('/submitorder', methods=['POST'])
def submit_order():
    data = request.get_json()
    
    order_id = uuid.uuid4()
    products = data.get('products')
    ingredients = data.get('ingredients')
    employee_id = data.get('employee_id')
    total = data.get('total')
    order_date = datetime.now()

    try:
        order = OrderTable(id=order_id, employeeid=employee_id, total=total, order_date=order_date)
        db.session.add(order)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    try:
        for product_id in products:
            product_order_id = uuid.uuid4()
            order_id = order.id
            quantity = 1

            product_order = ProductOrder(id=product_order_id, orderid=order_id, productid=product_id, quantity=quantity)
        db.session.add(product_order)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500
    
    try:
        for ingredient_id in ingredients:
            db_ingredient = Ingredient.query.filter_by(id=ingredient_id).first()

            if(db_ingredient.quantity <= 0):
                raise Exception("Invalid Ingredient Quantity")
            
            db_ingredient.quantity = db_ingredient.quantity - 1
        db.session.add(product_order)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500
    
    return jsonify({ 'data': { 'id': order.id, 'employee_id': order.employeeid, 'total': order.total, 'order_date': order.order_date } })