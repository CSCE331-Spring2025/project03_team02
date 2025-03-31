from flask import Blueprint, jsonify, request

from database import db, Ingredient

ingredient_routes_bp = Blueprint('ingredient_routes', __name__)

'''
GET ingredients endpoint

This endpoint gets all of the ingredients that can be used in menu items
'''
@ingredient_routes_bp.route("/getingredients", methods=['GET'])
def get_ingredients():
    ingredients = []

    try:
        ingredients_results = Ingredient.query.all()

        for ingredient in ingredients_results:
            ingredients.append({
                'id': str(ingredient.id),
                'name': ingredient.name,
                'quantity': ingredient.quantity,
                'supplier': ingredient.supplier,
                'expiration': ingredient.expiration
            })

    except Exception as error:
        print(error)

        return jsonify({'error': 'Something went wrong!'}), 500

    return jsonify({'data': ingredients})

'''
UPDATE ingredient SET quantity endpoint

This endpoint changes the quantity of a specific ingredient id
'''
@ingredient_routes_bp.route("/updateingredientstock", methods=['POST'])
def update_ingredient_stock():
    try:
        data = request.get_json()

        ingredient_id = data.get('id')
        new_quantity = data.get('quantity')

        if not ingredient_id:
            return jsonify({'error': 'Something went wrong!'}), 500
        if new_quantity is None:
            return jsonify({'error': 'Something went wrong!'}), 500
        if new_quantity < 0:
            return jsonify({'error': 'Quantity cannot be negative'}), 500
        
        ingredient = Ingredient.query.filter_by(id=ingredient_id).first()
        if not ingredient:
            return jsonify({'error': 'Ingredient not found'}), 404

        ingredient.quantity = new_quantity
        db.session.commit()

    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    return jsonify({ "success": True, 'data': { 'id': ingredient.id, 'name': ingredient.name, 'quantity': ingredient.quantity, 'supplier': ingredient.supplier, 'expiration': ingredient.expiration } })
