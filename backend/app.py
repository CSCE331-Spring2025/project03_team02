import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from database import db, Employee

from routes.product_routes import product_routes_bp
from routes.ingredient_routes import ingredient_routes_bp
from routes.order_routes import order_routes_bp

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    
    app.register_blueprint(product_routes_bp)
    app.register_blueprint(ingredient_routes_bp)
    app.register_blueprint(order_routes_bp)

@app.route('/')
def home():
    employees = Employee.query.all()
    for emp in employees:
        print(f"ID: {emp.id}, Name: {emp.name}, Is Manager: {emp.is_manager}")
    return "Hello World"

if __name__ == '__main__':
    app.run(debug=True)