from flask import Blueprint, jsonify, request

from database import db, Product, Ingredient

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

'''
UPDATE product SET price endpoint

This endpoint changes the price of a specific product id
'''
@product_routes_bp.route("/updateproductprice", methods=['POST'])
def update_product_price():
    try:
        data = request.get_json()

        product_id = data.get('id')
        new_price = data.get('price')

        if not product_id:
            return jsonify({'error': 'Something went wrong!'}), 500
        if new_price is None:
            return jsonify({'error': 'Something went wrong!'}), 500
        if new_price < 0:
            return jsonify({'error': ':Price cannot be negative'}), 500
        
        product = Product.query.filter_by(id=product_id).first()
        if not product:
            return jsonify({'error': 'Ingredient not found'}), 404

        product.price = new_price
        db.session.commit()

    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    return jsonify({ "success": True, 'data': { 'id': product.id, 'name': product.name, 'description': product.description, 'price': product.price, 'customizations': product.customizations, 'has_boba': product.has_boba } })
