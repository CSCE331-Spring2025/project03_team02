import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import db, Employee
import logging

from routes.product_routes import product_routes_bp
from routes.ingredient_routes import ingredient_routes_bp
from routes.order_routes import order_routes_bp
from routes.employee_routes import employee_routes_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

load_dotenv()

app = Flask(__name__)
# Configure CORS
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": "*"}})

# Add CORS headers to all responses
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

# Handle OPTIONS method for preflight requests
@app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    return '', 200

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Initialize app with blueprints
with app.app_context():
    db.create_all()
    
    app.register_blueprint(product_routes_bp)
    app.register_blueprint(ingredient_routes_bp)
    app.register_blueprint(order_routes_bp)
    app.register_blueprint(employee_routes_bp)

@app.route('/')
def home():
    try:
        # Check if the database is accessible
        Employee.query.all()
        logging.info("Backend API is running and database is accessible")
        return jsonify({"status": "success", "message": "Backend API is running"})
    except Exception as e:
        logging.error(f"Error in home route: {e}")
        return jsonify({"status": "error", "message": "Database connection error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)