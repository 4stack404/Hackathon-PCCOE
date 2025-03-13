import requests
import json

# Define the API endpoint
url = "http://localhost:5000/api/recommend-exercises"

# Define test data for prenatal (pregnant) woman
prenatal_test_data = {
    "is_prenatal": True,
    "age": 30,
    "trimester": 2,
    "weight": 68,
    "medical_conditions": ["gestational diabetes"],
    "joint_pains": ["lower back"]
}

# Define test data for postnatal (postpartum) woman
postnatal_test_data = {
    "is_prenatal": False,
    "age": 32,
    "weight": 70,
    "medical_conditions": ["mild hypertension"],
    "joint_pains": ["knees"]
}

# Function to test the API and print results
def test_api(test_data, test_type):
    print(f"\n=== TESTING {test_type.upper()} EXERCISE RECOMMENDATIONS ===\n")
    print(f"Sending request with data: {json.dumps(test_data, indent=2)}\n")
    
    # Send the request
    response = requests.post(url, json=test_data)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        
        # Print the recommendations
        print("\n=== EXERCISE RECOMMENDATIONS ===\n")
        print(f"General Advice: {data['recommendations']['general_advice']}\n")
        
        print("Recommended Exercises:")
        for i, exercise in enumerate(data['recommendations']['recommended_exercises'], 1):
            print(f"\n{i}. Exercise ID: {exercise['exercise_id']}")
            print(f"   Reason: {exercise['reason']}")
        
        print("\n=== DETAILED EXERCISE INFORMATION ===\n")
        for i, exercise in enumerate(data['detailed_exercises'], 1):
            print(f"{i}. {exercise['name']}")
            print(f"   Description: {exercise['description']}")
            print(f"   Difficulty: {exercise.get('difficulty', 'Not specified')}")
            print(f"   Image: {exercise.get('image', 'No image available')}")
            print(f"   Video: {exercise.get('video', 'No video available')}")
            print("   Steps:")
            for step in exercise.get('steps', [])[:3]:  # Show only first 3 steps
                print(f"     - {step}")
            print("   ...")
            print()
        
        return True
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return False

# Test prenatal recommendations
prenatal_success = test_api(prenatal_test_data, "prenatal")

# Test postnatal recommendations
postnatal_success = test_api(postnatal_test_data, "postnatal")

# Print summary
print("\n=== TEST SUMMARY ===\n")
print(f"Prenatal API Test: {'Successful' if prenatal_success else 'Failed'}")
print(f"Postnatal API Test: {'Successful' if postnatal_success else 'Failed'}")
