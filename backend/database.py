from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import UniqueConstraint
from datetime import datetime
import uuid

db = SQLAlchemy()

class Employee(db.Model):
    __tablename__ = 'employee'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    name = db.Column(db.Text, nullable=False)
    is_manager = db.Column(db.Boolean, nullable=False, default=False)
    email = db.Column(db.Text, nullable=False, default=False)

    orders = db.relationship('OrderTable', backref='employee', cascade="all, delete", lazy=True)

class Customer(db.Model):
    __tablename__ = 'customer'

    id = db.Column(db.Text, primary_key=True, default=uuid.uuid4, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    birthday = db.Column(db.Date, nullable=True)
    points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # One-to-many relationship: Customer can have many orders
    orders = db.relationship('OrderTable', backref='customer', cascade="all, delete", lazy=True)

    product_reviews = db.relationship('ProductReview', backref='customer', cascade="all, delete", lazy=True)

class Ingredient(db.Model):
    __tablename__ = 'ingredient'
    __table_args__ = (
        UniqueConstraint('name', name='ingredient_name_key'),
    )

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    name = db.Column(db.Text, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    supplier = db.Column(db.Text, nullable=False)
    expiration = db.Column(db.Date, nullable=False)

    product_ingredients = db.relationship('ProductIngredient', backref='ingredient', cascade="all, delete", lazy=True)


class OrderTable(db.Model):
    __tablename__ = 'ordertable'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    employeeid = db.Column(UUID(as_uuid=True), db.ForeignKey('employee.id', ondelete='CASCADE'), nullable=False)

    # Foreign key to customer table
    customerid = db.Column(UUID(as_uuid=True), db.ForeignKey('customer.id', ondelete='CASCADE'), nullable=False)

    total = db.Column(db.Numeric(10, 2), nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    completed = db.Column(db.Boolean, default=False, nullable=False)

    product_orders = db.relationship('ProductOrder', backref='order', cascade="all, delete", lazy=True)

class Product(db.Model):
    __tablename__ = 'product'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    customizations = db.Column(db.Text, nullable=True)
    has_boba = db.Column(db.Boolean, nullable=False, default=False)
    is_seasonal = db.Column(db.Boolean, nullable=False, default=False)
    alerts = db.Column(db.Text, nullable=True)

    image_url = db.Column(db.Text)

    product_ingredients = db.relationship('ProductIngredient', backref='product', cascade="all, delete", lazy=True)
    product_orders = db.relationship('ProductOrder', backref='product', cascade="all, delete", lazy=True)

    product_reviews = db.relationship('ProductReview', backref='product', cascade="all, delete", lazy=True)


class ProductIngredient(db.Model):
    __tablename__ = 'product_ingredient'
    

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    productid = db.Column(UUID(as_uuid=True), db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False)
    ingredientid = db.Column(UUID(as_uuid=True), db.ForeignKey('ingredient.id', ondelete='CASCADE'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)


class ProductOrder(db.Model):
    __tablename__ = 'product_order'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    orderid = db.Column(UUID(as_uuid=True), db.ForeignKey('ordertable.id', ondelete='CASCADE'), nullable=False)
    productid = db.Column(UUID(as_uuid=True), db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

class ProductReview(db.Model):
    __tablename__ = 'product_review'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    
    product_id = db.Column(UUID(as_uuid=True), db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False)
    customer_id = db.Column(db.Text, db.ForeignKey('customer.id', ondelete='CASCADE'), nullable=False)
    
    review_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)