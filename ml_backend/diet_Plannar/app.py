from flask import Flask, request, jsonify
import json
import os
from dotenv import load_dotenv
import requests
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load recipes data
with open('data/recipes.json', 'r') as f:
    recipes_data = json.load(f)

# GRQ LLM API configuration
GRQ_API_KEY = os.getenv('GRQ_API_KEY')
GRQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Function to generate diet plan using GRQ LLM with recipes from database
def generate_diet_plan(calories_needed):
    # Create a simplified version of the recipes with only id, title, and calories
    simplified_recipes = []
    for recipe in recipes_data:
        simplified_recipes.append({
            "id": recipe.get("id"),
            "title": recipe.get("title"),
            "calories": recipe.get("calories")
        })
    
    # Convert simplified recipes to a string format for the LLM
    recipes_str = json.dumps(simplified_recipes)
    
    # Prepare prompt for the LLM
    prompt = f"""
    You are a professional nutritionist and diet planner. I will provide you with a simplified JSON database of recipes (containing only id, title, and calories) and a daily calorie target.
    
    Daily calorie target: {calories_needed} calories
    
    Recipe database: {recipes_str}
    
    Your task is to create a comprehensive daily diet plan by selecting recipes from the provided database that would be suitable for someone with this calorie target. The diet plan should include:
    
    1. Multiple options for breakfast (at least 3 different recipes from the database)
    2. Multiple options for lunch (at least 3 different recipes from the database)
    3. Multiple options for dinner (at least 3 different recipes from the database)
    4. Multiple options for snacks (at least 2 suggestions - these can be your own suggestions since the database doesn't contain snacks)
    
    For each meal option, provide ONLY:
    - The recipe ID from the database
    - A brief comment on why this recipe is suitable for this meal and calorie target
    
    For snacks, since they're not in the database, suggest appropriate snacks with estimated calories.
    
    Format your response as a JSON object with the following structure:
    {{
        "breakfast": [
            {{
                "recipe_id": id_from_database,
                "comment": "Brief comment on suitability"
            }},
            ...
        ],
        "lunch": [...],
        "dinner": [...],
        "snacks": [
            {{
                "name": "Snack suggestion",
                "calories": estimated_calories,
                "description": "Brief description or key ingredients"
            }},
            ...
        ]
    }}
    
    Only return the JSON object, no additional text.
    """
    
    # Call GRQ LLM API
    headers = {
        "Authorization": f"Bearer {GRQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama3-70b-8192",  # Using Llama 3 70B model
        "messages": [
            {"role": "system", "content": "You are a professional nutritionist and diet planner."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 2000
    }
    
    try:
        response = requests.post(GRQ_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        return json.loads(result['choices'][0]['message']['content'])
    except Exception as e:
        print(f"Error calling GRQ API: {e}")
        return None

# Function to get detailed recipe information by ID
def get_recipe_details(recipe_ids):
    detailed_recipes = []
    for recipe_id in recipe_ids:
        for recipe in recipes_data:
            if recipe.get('id') == recipe_id:
                detailed_recipes.append(recipe)
                break
    return detailed_recipes

# API endpoint for diet plan generation
@app.route('/api/diet-plan', methods=['POST'])
def create_diet_plan():
    data = request.json
    
    # Validate input
    if not data or 'calories' not in data:
        return jsonify({'error': 'Calories value is required'}), 400
    
    try:
        calories = float(data['calories'])
        if calories <= 0:
            return jsonify({'error': 'Calories must be a positive number'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid calories value'}), 400
    
    # Generate diet plan using LLM with recipes from database
    diet_plan = generate_diet_plan(calories)
    
    if not diet_plan:
        return jsonify({'error': 'Failed to generate diet plan'}), 500
    
    # Get recipe IDs from the diet plan
    breakfast_ids = [item['recipe_id'] for item in diet_plan.get('breakfast', [])]
    lunch_ids = [item['recipe_id'] for item in diet_plan.get('lunch', [])]
    dinner_ids = [item['recipe_id'] for item in diet_plan.get('dinner', [])]
    
    # Get detailed recipe information
    breakfast_details = get_recipe_details(breakfast_ids)
    lunch_details = get_recipe_details(lunch_ids)
    dinner_details = get_recipe_details(dinner_ids)
    
    # Create enhanced response
    response = {
        'diet_plan': diet_plan
    }
    
    return jsonify(response)

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

# Add a root route for basic navigation
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': 'Diet Planner API is running',
        'endpoints': {
            '/api/diet-plan': 'POST - Generate a diet plan based on calorie needs',
            '/api/health': 'GET - Check API health'
        }
    })

# Run the app
if __name__ == '__main__':
    # Get port from environment variable or default to 10000
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
