from flask import Blueprint, jsonify, request

from database import db, Product, Ingredient, ProductIngredient

# blueprint for handling product-related routes
product_routes_bp = Blueprint('product_routes', __name__)

'''
GET products endpoint

This endpoint gets all of the menu items avaliable for sale
'''

@product_routes_bp.route("/getproducts", methods=['GET'])
def get_products():
    products = []

    try:
        # fetch all products and ingredients
        product_result = Product.query.all()
        ingredient_result = Ingredient.query.all()
        ingredient_map = {
            str(ingredient.id): ingredient for ingredient in ingredient_result
        }

        # format product data with ingredients and reviews
        for product in product_result:
            ingredients = []

            # get ingredient details for each product
            for pi in product.product_ingredients:
                ingredient = ingredient_map.get(str(pi.ingredientid))
                if ingredient is None:
                    continue

                ingredient_data = {
                    'id': str(ingredient.id),
                    'name': ingredient.name,
                    'quantity': ingredient.quantity,
                    'supplier': ingredient.supplier,
                    'expiration': ingredient.expiration.isoformat()  # ensure serializable
                }
                ingredients.append(ingredient_data)

            # get review details for each product
            reviews = []
            for review in product.product_reviews:
                review_data = {
                    'id': str(review.id),
                    'customer_id': review.customer_id,
                    'review_text': review.review_text,
                    'created_at': review.created_at.isoformat() if review.created_at else None
                }
                reviews.append(review_data)

            products.append({
                'id': str(product.id),
                'name': product.name,
                'description': product.description,
                'price': float(product.price),
                'customizations': product.customizations,
                'has_boba': product.has_boba,
                'is_seasonal': product.is_seasonal,
                'ingredients': ingredients,
                'image_url': product.image_url,
                'alerts': product.alerts,
                'reviews': reviews
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

        # extract and validate request data
        product_id = data.get('id')
        new_price = data.get('price')

        if not product_id:
            return jsonify({'error': 'Something went wrong!'}), 500
        if new_price is None:
            return jsonify({'error': 'Something went wrong!'}), 500
        if new_price < 0:
            return jsonify({'error': ':Price cannot be negative'}), 500

        # find and update product price
        product = Product.query.filter_by(id=product_id).first()
        if not product:
            return jsonify({'error': 'Ingredient not found'}), 404

        product.price = new_price
        db.session.commit()

    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    return jsonify({"success": True, 'data': {'id': product.id, 'name': product.name, 'description': product.description, 'price': product.price, 'customizations': product.customizations, 'has_boba': product.has_boba}})


'''
ADD menu item endpoint

This endpoint creates a new menu item (regular or seasonal) with the provided details
'''

@product_routes_bp.route("/addmenuitem", methods=['POST'])
def add_menu_item():
    try:
        data = request.get_json()

        # extract product details from request
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')
        customizations = data.get('customizations')
        alerts = data.get('alerts')
        has_boba = data.get('has_boba', False)
        is_seasonal = data.get('is_seasonal', False)
        ingredient_ids = data.get('ingredient_ids', [])

        # validate required fields
        if not name or not description or price is None:
            return jsonify({'error': 'Missing required fields'}), 400

        if price < 0:
            return jsonify({'error': 'Price cannot be negative'}), 400

        # create new product
        new_product = Product(
            name=name,
            description=description,
            price=price,
            customizations=customizations,
            has_boba=has_boba,
            alerts=alerts,
            is_seasonal=is_seasonal
        )

        db.session.add(new_product)
        db.session.flush()  # get the new product id

        # add ingredients to the product
        for ing_data in ingredient_ids:
            ingredient_id = ing_data.get('id')
            quantity = ing_data.get('quantity', 1)

            # check if ingredient exists
            ingredient = Ingredient.query.filter_by(id=ingredient_id).first()
            if not ingredient:
                db.session.rollback()
                return jsonify({'error': f'Ingredient with ID {ingredient_id} not found'}), 404

            # create product ingredient relationship
            product_ingredient = ProductIngredient(
                productid=new_product.id,
                ingredientid=ingredient_id,
                quantity=quantity
            )

            db.session.add(product_ingredient)

        db.session.commit()

        # return the newly created product
        return jsonify({
            'success': True,
            'data': {
                'id': str(new_product.id),
                'name': new_product.name,
                'description': new_product.description,
                'price': float(new_product.price),
                'customizations': new_product.customizations,
                'has_boba': new_product.has_boba,
                'is_seasonal': new_product.is_seasonal
            }
        })

    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500


'''
ADD product endpoint

This endpoint adds a new product to the menu
'''

@product_routes_bp.route("/addproduct", methods=['POST'])
def add_product():
    try:
        data = request.get_json()

        # extract and validate product details
        id = data.get('id')
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')
        customizations = data.get('customizations')
        alerts = data.get('alerts')
        boba = data.get('boba')

        if not id or not name or not description or price is None:
            return jsonify({'error': 'Missing required fields'}), 400

        if not isinstance(price, (int, float)) or price < 0:
            return jsonify({'error': 'Price must be a positive number'}), 400

        has_boba = True if boba == 'Yes' else False

        # create new product
        new_product = Product(
            id=id,
            name=name,
            description=description,
            price=price,
            customizations=customizations,
            alerts=alerts,
            has_boba=has_boba
        )

        db.session.add(new_product)
        db.session.commit()

    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    return jsonify({"success": True, "data": {'id': new_product.id, 'name': new_product.name, 'description': new_product.description, 'price': new_product.price, 'customizations': new_product.customizations, 'boba': new_product.has_boba}})
