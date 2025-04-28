from flask import Blueprint, jsonify, request

from database import db, Ingredient

# blueprint for handling ingredient-related routes
ingredient_routes_bp = Blueprint('ingredient_routes', __name__)

'''
GET ingredients endpoint

This endpoint gets all of the ingredients that can be used in menu items
'''
@ingredient_routes_bp.route("/getingredients", methods=['GET'])
def get_ingredients():
    ingredients = []

    try:
        # fetch all ingredients from database
        ingredients_results = Ingredient.query.all()

        # format ingredient data for response
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

        # extract and validate request data
        ingredient_id = data.get('id')
        new_quantity = data.get('quantity')

        if not ingredient_id:
            return jsonify({'error': 'Something went wrong!'}), 500
        if new_quantity is None:
            return jsonify({'error': 'Something went wrong!'}), 500
        if new_quantity < 0:
            return jsonify({'error': 'Quantity cannot be negative'}), 500
        
        # find and update ingredient
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

'''
ADD ingredient endpoint

This endpoint adds a new ingredient
'''
@ingredient_routes_bp.route("/addingredient", methods=['POST'])
def add_ingredient():
    try:
        data = request.get_json()

        # extract and validate request data
        id = data.get('id')
        name = data.get('name')
        quantity = data.get('quantity')
        supplier = data.get('supplier')
        expiration = data.get('expiration')

        # validate required fields
        if not id or not name or not supplier or quantity is None or not expiration:
            return jsonify({'error': 'Missing required fields'}), 400

        # validate quantity is positive
        if not isinstance(quantity, int) or quantity < 0:
            return jsonify({'error': 'Quantity must be a positive number'}), 400

        # create new ingredient
        new_ingredient = Ingredient(
            id=id,
            name=name,
            quantity=quantity,
            supplier=supplier,
            expiration=expiration
        )

        db.session.add(new_ingredient)
        db.session.commit()

    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    return jsonify({ "success": True, "data": { 'id': new_ingredient.id, 'name': new_ingredient.name, 'quantity': new_ingredient.quantity, 'supplier': new_ingredient.supplier, 'expiration': new_ingredient.expiration } })