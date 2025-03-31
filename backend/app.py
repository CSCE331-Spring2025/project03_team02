import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from database import db, Employee
import logging

from routes.product_routes import product_routes_bp
from routes.ingredient_routes import ingredient_routes_bp
from routes.order_routes import order_routes_bp
from routes.employee_routes import employee_routes_bp
from routes.sales_report_routes import sales_report_routes_bp
from routes.charts_routes import charts_routes_bp

load_dotenv()

app = Flask(__name__)
# Configure CORS
CORS(app, supports_credentials=True)

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
    app.register_blueprint(sales_report_routes_bp)
    app.register_blueprint(charts_routes_bp)

@app.route('/')
def home():
    return "Hello World"

if __name__ == '__main__':
    app.run(debug=True, port=5001)
