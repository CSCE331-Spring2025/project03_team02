from flask import Blueprint, jsonify

from database import Product

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

        for product in product_result:
            products.append({
                'id': str(product.id),
                'name': product.name,
                'description': product.description,
                'price': float(product.price),
                'customizations': product.customizations,
                'has_boba': product.has_boba,
                'product_ingredients': [
                    {
                        'id': str(pi.id),
                        'ingredientid': str(pi.ingredientid),
                        'quantity': pi.quantity
                    } for pi in product.product_ingredients
                ]
            })

    except Exception as error:
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    return jsonify({'data': products})
