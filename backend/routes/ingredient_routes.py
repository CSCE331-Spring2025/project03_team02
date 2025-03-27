from flask import Blueprint, jsonify

from database import Ingredient

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
