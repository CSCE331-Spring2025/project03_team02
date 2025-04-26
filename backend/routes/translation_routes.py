from flask import Blueprint, request, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv()

translation_routes_bp = Blueprint('translation_routes_bp', __name__)

# # Using DeepL Translation API | Limited to 500,000 char per month
# DEEPL_API_KEY = os.getenv("DEEPL_API_KEY")
# DEEPL_API_URL = "https://api-free.deepl.com/v2/translate"

# Using Azure Translation API | Limited to 2M char per month
AZURE_TRANSLATOR_KEY = os.getenv("AZURE_TRANSLATOR_KEY")
AZURE_TRANSLATOR_ENDPOINT = os.getenv("AZURE_TRANSLATOR_ENDPOINT")
AZURE_TRANSLATOR_REGION = os.getenv("AZURE_TRANSLATOR_REGION")

@translation_routes_bp.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    texts = data.get("texts")
    target_lang = data.get("target_lang", "en")

    if not texts:
        return jsonify({"error": "No texts provided"}), 400

    headers = {
        "Ocp-Apim-Subscription-Key": AZURE_TRANSLATOR_KEY,
        "Ocp-Apim-Subscription-Region": AZURE_TRANSLATOR_REGION,
        "Content-Type": "application/json"
    }

    body = [{"Text": text} for text in texts]

    response = requests.post(
        f"{AZURE_TRANSLATOR_ENDPOINT}/translate?api-version=3.0&to={target_lang.lower()}",
        headers=headers,
        json=body
    )

    if response.status_code == 200:
        json_response = response.json()
        translations = [item["translations"][0]["text"] for item in json_response]
        return jsonify({"translations": translations})
    else:
        return jsonify({"error": response.text}), response.status_code
