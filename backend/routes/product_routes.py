from flask import Blueprint, jsonify

from database import Product, Ingredient

product_routes_bp = Blueprint('product_routes', __name__)

'''
GET products endpoint

This endpoint gets all of the menu items avaliable for sale
'''
@product_routes_bp.route("/getproducts", methods=['GET'])
def get_products():
    products = []

    try:
        product_result = Product.query.all()
        ingredient_result = Ingredient.query.all()
        ingredient_map = {
            str(ingredient.id): ingredient for ingredient in ingredient_result}

        for product in product_result:
            ingredients = []

            for pi in product.product_ingredients:
                ingredient = ingredient_map.get(str(pi.ingredientid))
                ingredient_data = {
                  'id': str(ingredient.id),
                    'name': ingredient.name,
                    'quantity': ingredient.quantity,
                    'supplier': ingredient.supplier,
                    'expiration': ingredient.expiration.isoformat()  # ensure serializable
                }
                ingredients.append(ingredient_data)

            products.append({
                'id': str(product.id),
                'name': product.name,
                'description': product.description,
                'price': float(product.price),
                'customizations': product.customizations,
                'has_boba': product.has_boba,
                'ingredients': ingredients
            })

    except Exception as error:
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    return jsonify({'data': products})
