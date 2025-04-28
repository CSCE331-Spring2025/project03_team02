from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime

from database import db, ProductReview, Customer, Product

# blueprint for handling review-related routes
review_routes_bp = Blueprint('review_routes', __name__)

@review_routes_bp.route("/addreview", methods=['POST'])
def add_review():
    try:
        data = request.get_json()

        # extract and validate review details
        product_id = data.get('product_id')
        customer_id = data.get('customer_id')
        review_text = data.get('review_text')
        review_id = uuid.uuid4()

        if not product_id or not customer_id or not review_text:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # verify product and customer exist
        product = Product.query.get(product_id)
        customer = Customer.query.get(customer_id)

        if not product:
            return jsonify({'error': 'Product not found'}), 400
        
        if not customer:
            return jsonify({'error': 'Customer not found'}), 400
        
        # create new review
        new_review = ProductReview(
            id=review_id,
            product_id=product_id,
            customer_id=customer_id,
            review_text=review_text,
            created_at=datetime.now()
        )

        db.session.add(new_review)
        db.session.commit()

        return jsonify({
            'success': True,
            'data': {
                'id': str(new_review.id),
                'product_id': str(new_review.id),
                'customer_id': str(new_review.customer_id),
                'review_text': str(new_review.review_text) 
            }
        })
    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500
    
@review_routes_bp.route("/deletereview", methods=['POST'])
def delete_review():
    try:
        data = request.get_json()

        # extract and validate request data
        review_id = data.get('review_id')
        customer_id = data.get('customer_id')
        
        if not review_id or not customer_id:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # find review and verify ownership
        review = ProductReview.query.get(review_id)

        if not review:
            return jsonify({'error': 'Product not found'}), 400
        
        if not (review.customer_id == customer_id):
            return jsonify({'error': 'Unauthorized'}), 403

        # delete review
        db.session.delete(review)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'error': 'Something went wrong!'}), 500

    return jsonify({
            'success': True
        })