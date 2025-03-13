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

# Load exercise data
def load_exercise_data():
    data_path = os.path.join(os.path.dirname(__file__), 'data/merged_exercises.json')
    print(f"Loading exercise data from: {data_path}")
    with open(data_path, 'r') as f:
        data = json.load(f)
    # Print a sample exercise to verify structure
    if 'prenatal_exercises' in data and '1' in data['prenatal_exercises']:
        print("Loaded prenatal exercises successfully")
    if 'postnatal_exercises' in data:
        print("Loaded postnatal exercises successfully")
    return data

exercise_data = load_exercise_data()

# LLM API configuration
GRQ_API_KEY = os.getenv('GRQ_API_KEY')
GRQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Function to generate exercise recommendations using LLM with exercises from database
def generate_exercise_recommendations(user_info):
    # Extract user information
    trimester = user_info.get('trimester')
    weight = user_info.get('weight')
    age = user_info.get('age')
    medical_conditions = user_info.get('medical_conditions', [])
    joint_pains = user_info.get('joint_pains', [])
    is_prenatal = user_info.get('is_prenatal', True)  # Default to prenatal if not specified
    
    # Get exercises for the specified trimester or postnatal
    if is_prenatal and 'prenatal_exercises' in exercise_data and str(trimester) in exercise_data['prenatal_exercises']:
        trimester_exercises = exercise_data['prenatal_exercises'][str(trimester)]['exercises']
    elif not is_prenatal and 'postnatal_exercises' in exercise_data:
        trimester_exercises = exercise_data['postnatal_exercises']
    else:
        # If we can't find exercises, use fallback
        return fallback_recommendations(user_info)
    
    # Create a simplified version of the exercises with only essential information
    simplified_exercises = []
    for exercise in trimester_exercises:
        simplified_exercises.append({
            "id": exercise.get("id"),
            "name": exercise.get("name"),
            "description": exercise.get("description"),
            "difficulty": exercise.get("difficulty", "moderate"),
            "precautions": exercise.get("precautions", [])[:2]  # Only first 2 precautions
        })
    
    # Create the prompt for the LLM
    stage_text = "pregnancy trimester " + str(trimester) if is_prenatal else "postnatal period"
    
    prompt = f"""
    You are a professional {'prenatal' if is_prenatal else 'postnatal'} fitness expert. I will provide you with a simplified JSON database of exercises suitable for {stage_text} and information about a {'pregnant' if is_prenatal else 'postpartum'} woman.
    
    Here's the exercise database:
    {simplified_exercises}
    
    Here's information about the woman:
    - Age: {age}
    - {'Trimester: ' + str(trimester) if is_prenatal else 'Postnatal'}
    - Weight: {weight} kg
    - Medical conditions: {', '.join(medical_conditions) if medical_conditions else 'None'}
    - Joint pains: {', '.join(joint_pains) if joint_pains else 'None'}
    
    Based on this information, recommend 3-5 exercises that would be most suitable for her. For each exercise, provide the exercise ID and a brief explanation of why it's appropriate for her specific situation.
    
    Also provide general advice for exercising safely during {stage_text}.
    
    Format your response as a JSON object with the following structure:
    {{
        "recommended_exercises": [
            {{
                "exercise_id": 1,
                "reason": "This exercise is good because..."
            }},
            ...
        ],
        "general_advice": "General advice text here..."
    }}
    """
    
    try:
        # Try using the LLM API
        return call_llm_api(prompt, user_info)
    except Exception as e:
        print(f"Error calling LLM API: {e}")
        # If LLM fails, use fallback
        return fallback_recommendations(user_info)

# Function to call the LLM API
def call_llm_api(prompt, user_info):
    # Call the LLM API
    headers = {
        "Authorization": f"Bearer {GRQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that provides exercise recommendations for pregnant and postpartum women."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 1000
    }
    
    response = requests.post(GRQ_API_URL, headers=headers, json=payload)
    response.raise_for_status()  # Raise an exception for HTTP errors
    
    result = response.json()
    content = result['choices'][0]['message']['content']
    
    # Try to parse the JSON response
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        # If JSON parsing fails, extract JSON from the text response
        # This handles cases where the LLM might add extra text around the JSON
        import re
        json_match = re.search(r'\{\s*"recommended_exercises".*\}\s*\}', content, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(0))
            except:
                pass
        
        # If all parsing attempts fail, use fallback
        return fallback_recommendations(user_info)

# Fallback function for when the LLM API fails due to payload size
def fallback_recommendations(user_info):
    # Extract user information
    trimester = user_info.get('trimester')
    joint_pains = user_info.get('joint_pains', [])
    medical_conditions = user_info.get('medical_conditions', [])
    is_prenatal = user_info.get('is_prenatal', True)  # Default to prenatal if not specified
    
    # Get exercises for the specified trimester or postnatal
    if is_prenatal and 'prenatal_exercises' in exercise_data and str(trimester) in exercise_data['prenatal_exercises']:
        trimester_exercises = exercise_data['prenatal_exercises'][str(trimester)]['exercises']
    elif not is_prenatal and 'postnatal_exercises' in exercise_data:
        trimester_exercises = exercise_data['postnatal_exercises']
    else:
        # Return empty recommendations if no exercises found
        return {
            "recommended_exercises": [],
            "general_advice": "No suitable exercises found for your condition. Please consult with your healthcare provider."
        }
    
    # Simple rule-based recommendations
    recommended_exercises = []
    exercise_count = 0
    max_exercises = 5
    
    # Check for joint pains to avoid certain exercises
    has_back_pain = any('back' in pain.lower() for pain in joint_pains)
    has_knee_pain = any('knee' in pain.lower() for pain in joint_pains)
    has_diabetes = any('diabetes' in condition.lower() for condition in medical_conditions)
    has_hypertension = any('hypertension' in condition.lower() or 'blood pressure' in condition.lower() for condition in medical_conditions)
    
    for exercise in trimester_exercises:
        if exercise_count >= max_exercises:
            break
            
        # Skip exercises that might worsen joint pain
        if has_back_pain and any('back' in precaution.lower() for precaution in exercise.get('precautions', [])):
            continue
            
        if has_knee_pain and any('knee' in precaution.lower() for precaution in exercise.get('precautions', [])):
            continue
        
        # Prioritize low-impact exercises for those with hypertension
        if has_hypertension and exercise.get('difficulty', 'moderate').lower() == 'easy':
            reason = "Low-impact exercise suitable for someone with hypertension."
            recommended_exercises.append({"exercise_id": exercise.get('id'), "reason": reason})
            exercise_count += 1
            continue
            
        # Prioritize cardio exercises for those with diabetes
        if has_diabetes and 'cardio' in exercise.get('description', '').lower():
            reason = "Cardio exercise beneficial for managing blood glucose levels."
            recommended_exercises.append({"exercise_id": exercise.get('id'), "reason": reason})
            exercise_count += 1
            continue
            
        # Add other exercises to fill out the recommendations
        if exercise_count < max_exercises:
            stage_text = "your trimester" if is_prenatal else "the postnatal period"
            reason = f"Safe and appropriate exercise for {stage_text}."
            recommended_exercises.append({"exercise_id": exercise.get('id'), "reason": reason})
            exercise_count += 1
    
    # If we couldn't find any exercises, add the first few that don't have contraindications
    if not recommended_exercises:
        for exercise in trimester_exercises[:max_exercises]:
            stage_text = "your trimester" if is_prenatal else "the postnatal period"
            reason = f"Safe and appropriate exercise for {stage_text}."
            recommended_exercises.append({"exercise_id": exercise.get('id'), "reason": reason})
    
    # General advice based on conditions
    general_advice = "Focus on gentle, regular exercise. Stay hydrated and stop if you feel discomfort."
    if has_hypertension:
        general_advice += " Monitor your blood pressure before and after exercise."
    if has_diabetes:
        general_advice += " Regular exercise can help manage your blood glucose levels."
    
    if not is_prenatal:
        general_advice += " As you recover from childbirth, start slowly and gradually increase intensity as you feel stronger."
    
    return {
        "recommended_exercises": recommended_exercises,
        "general_advice": general_advice
    }

# Function to get detailed exercise information by ID
def get_exercise_details(trimester, exercise_ids):
    detailed_exercises = []
    
    # Check if we're dealing with prenatal or postnatal exercises
    is_prenatal = trimester != 'postnatal'
    
    # Get the appropriate exercises list
    if is_prenatal and 'prenatal_exercises' in exercise_data and str(trimester) in exercise_data['prenatal_exercises']:
        trimester_exercises = exercise_data['prenatal_exercises'][str(trimester)]['exercises']
    elif not is_prenatal and 'postnatal_exercises' in exercise_data:
        trimester_exercises = exercise_data['postnatal_exercises']
    else:
        return []
    
    for exercise_id in exercise_ids:
        found = False
        for exercise in trimester_exercises:
            if exercise.get('id') == exercise_id:
                detailed_exercises.append(exercise)
                found = True
                break
        
        # If exercise ID not found, it might be a string - try converting to int
        if not found:
            try:
                exercise_id_int = int(exercise_id)
                for exercise in trimester_exercises:
                    if exercise.get('id') == exercise_id_int:
                        detailed_exercises.append(exercise)
                        break
            except (ValueError, TypeError):
                # If conversion fails, just continue
                pass
    
    # If no exercises were found, return at least one exercise as a fallback
    if not detailed_exercises and trimester_exercises:
        detailed_exercises.append(trimester_exercises[0])
    
    return detailed_exercises

# API endpoint for exercise recommendations
@app.route('/api/recommend-exercises', methods=['POST'])
def recommend_exercises():
    try:
        # Get user information from request
        user_info = request.json
        
        # Validate required fields
        if not user_info:
            return jsonify({"error": "No user information provided"}), 400
        
        # Check if is_prenatal flag is present
        is_prenatal = user_info.get('is_prenatal', True)  # Default to prenatal if not specified
        
        # If prenatal, validate trimester
        if is_prenatal and 'trimester' not in user_info:
            return jsonify({"error": "Trimester is required for prenatal recommendations"}), 400
        
        # Generate recommendations
        recommendations = generate_exercise_recommendations(user_info)
        
        if not recommendations:
            return jsonify({"error": "Failed to generate exercise recommendations"}), 500
        
        # Extract exercise IDs from recommendations
        exercise_ids = [exercise['exercise_id'] for exercise in recommendations['recommended_exercises']]
        
        # Get detailed exercise information
        trimester = user_info.get('trimester', 'postnatal' if not is_prenatal else 1)
        detailed_exercises = get_exercise_details(trimester if is_prenatal else 'postnatal', exercise_ids)
        
        # Return recommendations and detailed exercise information
        return jsonify({
            "recommendations": recommendations,
            "detailed_exercises": detailed_exercises
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to generate exercise recommendations"}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

# Add a root route for basic navigation
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': 'Exercise Recommender API is running',
        'endpoints': {
            '/api/recommend-exercises': 'POST - Generate exercise recommendations based on user information',
            '/api/health': 'GET - Check API health'
        }
    })

# Run the application
if __name__ == '__main__':
    # Get port from environment variable (for Render deployment) or use default 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
