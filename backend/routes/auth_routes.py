from flask import Blueprint, jsonify, request
import requests
import os
from flask_jwt_extended import create_access_token
from dotenv import load_dotenv

from database import Employee

load_dotenv()

auth_routes_bp = Blueprint('auth_routes', __name__)

GOOGLE_CLIENT_ID = os.environ['GOOGLE_CLIENT_ID']
GOOGLE_SECRET_KEY = os.environ['GOOGLE_SECRET_KEY']


@auth_routes_bp.route('/google_login', methods=['POST'])
def login():
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

        # Step 4: Create JWT and return
        jwt_token = create_access_token(identity=email)
        response = jsonify(user=user_info)
        response.set_cookie('access_token_cookie',
                            value=jwt_token, secure=True, httponly=True)

        return response, 200

    except Exception as e:
        return jsonify(message="Server error", error=str(e)), 500