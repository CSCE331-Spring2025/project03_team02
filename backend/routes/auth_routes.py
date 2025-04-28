from flask import Blueprint, jsonify, request
import requests
import os
from flask_jwt_extended import create_access_token
from datetime import datetime
import uuid
from dotenv import load_dotenv

from database import db, Employee, Customer

load_dotenv()

auth_routes_bp = Blueprint('auth_routes', __name__)

GOOGLE_CLIENT_ID = os.environ['GOOGLE_CLIENT_ID']
GOOGLE_SECRET_KEY = os.environ['GOOGLE_SECRET_KEY']


@auth_routes_bp.route('/google_employee_login', methods=['POST'])
def employee_login():
    try:
        auth_code = request.get_json().get('code')
        if not auth_code:
            return jsonify(message="Missing authorization code"), 400

        # Step 1: Exchange code for access token
        data = {
            'code': auth_code,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_SECRET_KEY,
            'redirect_uri': 'postmessage',
            'grant_type': 'authorization_code'
        }

        token_response = requests.post(
            'https://oauth2.googleapis.com/token', data=data).json()

        if 'access_token' not in token_response:
            return jsonify(message="Invalid authorization code"), 401

        # Step 2: Fetch user info from Google
        headers = {
            'Authorization': f'Bearer {token_response["access_token"]}'
        }
        user_info = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo', headers=headers).json()
        email = user_info.get('email')

        if not email:
            return jsonify(message="Unable to fetch user email"), 401

        # Step 3: Check if user exists in database
        employee = Employee.query.filter_by(email=email).first()
        if not employee:
            return jsonify(message="User not authorized"), 401
        
        user_info['is_manager'] = employee.is_manager
        user_info['id'] = employee.id

        # Step 4: Create JWT and return
        jwt_token = create_access_token(identity=email)
        response = jsonify(user=user_info)
        response.set_cookie('access_token_cookie',
                            value=jwt_token, secure=True, httponly=True)

        return response, 200

    except Exception as e:
        return jsonify(message="Server error", error=str(e)), 500
    
@auth_routes_bp.route('/google_customer_login', methods=['POST'])
def customer_login():
    try:
        auth_code = request.get_json().get('code')
        if not auth_code:
            return jsonify(message="Missing authorization code"), 400

        # Step 1: Exchange code for access token
        data = {
            'code': auth_code,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_SECRET_KEY,
            'redirect_uri': 'postmessage',
            'grant_type': 'authorization_code'
        }

        token_response = requests.post(
            'https://oauth2.googleapis.com/token', data=data).json()

        if 'access_token' not in token_response:
            return jsonify(message="Invalid authorization code"), 401

        # Step 2: Fetch user info from Google
        headers = {
            'Authorization': f'Bearer {token_response["access_token"]}'
        }
        user_info = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo', headers=headers).json()
        email = user_info.get('email')

        # Fetch birthdate using Google People API
        people_api_resp = requests.get(
            'https://people.googleapis.com/v1/people/me?personFields=birthdays',
            headers=headers
        ).json()
        
        birthdays = people_api_resp.get('birthdays', [])
        if birthdays:
            birthdate = birthdays[0].get('date', {})
            user_info['birthday'] = birthdate  # e.g., {'year': 1999, 'month': 4, 'day': 19}
        else:
            user_info['birthday'] = None

        if not email:
            return jsonify(message="Unable to fetch user email"), 401

        # Step 3: Check if user exists in database
        customer = Customer.query.filter_by(email=email).first()
        if not customer:
            new_customer_id = str(uuid.uuid4())
            name = user_info.get('name')
            email = user_info.get('email')
            birthday = user_info.get('birthday')
            points = 0
            created_at = datetime.now()
            updated_at = datetime.now()
            
            customer = Customer(id=new_customer_id, name=name, email=email, birthday=birthday, points=points, created_at=created_at, updated_at=updated_at)
            db.session.add(customer)
            db.session.commit()
            
        user_info['id'] = customer.id
        user_info['points'] = customer.points

        # Step 4: Create JWT and return
        jwt_token = create_access_token(identity=email)
        response = jsonify(user=user_info)
        response.set_cookie('access_token_cookie',
                            value=jwt_token, secure=True, httponly=True)

        return response, 200

    except Exception as e:
        print(e)
        return jsonify(message="Server error", error=str(e)), 500