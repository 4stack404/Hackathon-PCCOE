import requests
import json
from datetime import datetime
import random
import time

# API base URL
BASE_URL = "http://localhost:8000"

# Test user ID
USER_ID = "test_user_123"

# Sample symptom data
sample_symptoms = [
    {
        "user_id": USER_ID,
        "symptom_type": "nausea",
        "severity": "mild",
        "description": "Feeling slightly nauseous in the morning",
        "duration_minutes": 30,
        "pregnancy_week": 8
    },
    {
        "user_id": USER_ID,
        "symptom_type": "fatigue",
        "severity": "moderate",
        "description": "Feeling very tired throughout the day",
        "duration_minutes": 240,
        "pregnancy_week": 8
    },
    {
        "user_id": USER_ID,
        "symptom_type": "headache",
        "severity": "moderate",
        "description": "Persistent headache on the right side",
        "duration_minutes": 120,
        "pregnancy_week": 8
    },
    {
        "user_id": USER_ID,
        "symptom_type": "back_pain",
        "severity": "mild",
        "description": "Lower back pain when standing for long periods",
        "duration_minutes": 60,
        "pregnancy_week": 9
    },
    {
        "user_id": USER_ID,
        "symptom_type": "nausea",
        "severity": "moderate",
        "description": "Nausea is getting worse, especially after eating",
        "duration_minutes": 45,
        "pregnancy_week": 9
    },
    {
        "user_id": USER_ID,
        "symptom_type": "blood_pressure",
        "severity": "mild",
        "description": "Slightly elevated blood pressure reading",
        "additional_data": {"systolic": 130, "diastolic": 85},
        "pregnancy_week": 10
    },
    {
        "user_id": USER_ID,
        "symptom_type": "nausea",
        "severity": "severe",
        "description": "Severe nausea with vomiting multiple times",
        "duration_minutes": 120,
        "pregnancy_week": 10
    },
    {
        "user_id": USER_ID,
        "symptom_type": "blood_pressure",
        "severity": "moderate",
        "description": "Blood pressure continues to rise",
        "additional_data": {"systolic": 140, "diastolic": 90},
        "pregnancy_week": 11
    },
    {
        "user_id": USER_ID,
        "symptom_type": "swelling",
        "severity": "moderate",
        "description": "Noticeable swelling in ankles and feet",
        "pregnancy_week": 11
    },
    {
        "user_id": USER_ID,
        "symptom_type": "blood_pressure",
        "severity": "severe",
        "description": "Very high blood pressure reading",
        "additional_data": {"systolic": 160, "diastolic": 100},
        "pregnancy_week": 12
    }
]


def log_symptom(symptom_data):
    """Log a symptom and get analysis"""
    url = f"{BASE_URL}/api/symptoms/log"
    
    # Add timestamp if not present
    if "timestamp" not in symptom_data:
        symptom_data["timestamp"] = datetime.now().isoformat()
    
    response = requests.post(url, json=symptom_data)
    
    if response.status_code == 200:
        print(f"Successfully logged {symptom_data['symptom_type']} symptom")
        print("Analysis:")
        result = response.json()
        print(json.dumps(result, indent=2))
        return result
    else:
        print(f"Error logging symptom: {response.status_code}")
        print(response.text)
        return None


def get_symptom_history():
    """Get symptom history for the test user"""
    url = f"{BASE_URL}/api/symptoms/history?user_id={USER_ID}"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        print("Successfully retrieved symptom history")
        history = response.json()
        print(f"Found {len(history)} symptoms")
        return history
    else:
        print(f"Error getting symptom history: {response.status_code}")
        print(response.text)
        return None


def get_alerts():
    """Get alerts for the test user"""
    url = f"{BASE_URL}/api/alerts?user_id={USER_ID}"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        print("Successfully retrieved alerts")
        alerts = response.json()
        print(f"Found {len(alerts)} alerts")
        print(json.dumps(alerts, indent=2))
        return alerts
    else:
        print(f"Error getting alerts: {response.status_code}")
        print(response.text)
        return None


def get_recommendations():
    """Get recommendations for the test user"""
    url = f"{BASE_URL}/api/recommendations?user_id={USER_ID}"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        print("Successfully retrieved recommendations")
        recommendations = response.json()
        print(f"Found {len(recommendations)} recommendations")
        print(json.dumps(recommendations, indent=2))
        return recommendations
    else:
        print(f"Error getting recommendations: {response.status_code}")
        print(response.text)
        return None


def run_test():
    """Run a full test of the API"""
    print("=== Testing Pregnancy Symptom Tracker API ===")
    
    # Log each symptom with a delay to simulate real usage
    for symptom in sample_symptoms:
        log_symptom(symptom)
        time.sleep(1)  # Small delay between requests
    
    # # Get symptom history
    # print("\n=== Getting Symptom History ===")
    # get_symptom_history()
    
    # # Get alerts
    # print("\n=== Getting Alerts ===")
    # get_alerts()
    
    # # Get recommendations
    # print("\n=== Getting Recommendations ===")
    # get_recommendations()


if __name__ == "__main__":
    run_test()
