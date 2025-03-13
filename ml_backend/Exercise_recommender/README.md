# Exercise Recommender API

An API that recommends safe and appropriate exercises for both pregnant (prenatal) and postpartum (postnatal) women based on their specific conditions and needs.

## Overview

This API uses a Large Language Model (LLM) to intelligently match user conditions with appropriate exercises from a database of safe exercises organized by prenatal trimester or postnatal stage.

## Features

- Recommends exercises based on user's age, weight, medical conditions, and joint pains
- Supports both prenatal (by trimester) and postnatal exercise recommendations
- Provides detailed exercise information including steps, precautions, benefits, and more
- Includes personalized reasoning for each recommended exercise
- Offers general advice tailored to the user's specific conditions

## API Endpoints

### `POST /api/recommend-exercises`

Generates personalized exercise recommendations based on user information.

#### Request Body for Prenatal (Pregnant) Women

```json
{
  "is_prenatal": true,
  "age": 28,
  "trimester": 1,
  "weight": 65,
  "medical_conditions": ["gestational diabetes", "mild hypertension"],
  "joint_pains": ["lower back", "knees"]
}
```

#### Request Body for Postnatal (Postpartum) Women

```json
{
  "is_prenatal": false,
  "age": 32,
  "weight": 70,
  "medical_conditions": ["mild hypertension"],
  "joint_pains": ["knees"]
}
```

#### Response

```json
{
  "recommendations": {
    "recommended_exercises": [
      {
        "exercise_id": 1,
        "reason": "Walking is a low-impact exercise that's safe for your gestational diabetes and won't strain your knees or back when done properly."
      },
      // More recommended exercises...
    ],
    "general_advice": "Focus on low-impact exercises that don't strain your lower back and knees. Monitor your blood pressure during exercise and stay well-hydrated to manage your mild hypertension."
  },
  "detailed_exercises": [
    // Full exercise details from the database
  ]
}
```

### `GET /api/health`

Health check endpoint to verify the API is running.

### `GET /`

Root endpoint that provides basic API information and available endpoints.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file with your LLM API key:
   ```
   GRQ_API_KEY=your_api_key_here
   ```
4. Run the application:
   ```
   python app.py
   ```

## Dependencies

- Flask
- Requests
- python-dotenv
- flask-cors

## Notes for Frontend Team

The API is designed to be called with specific information about the user. The frontend should collect:

1. Whether the user is prenatal or postnatal (is_prenatal flag)
2. Age in years
3. Trimester (1, 2, or 3) - only required for prenatal users
4. Weight in kg
5. Any medical conditions (as an array of strings)
6. Any joint pains (as an array of strings)

The API will return both the LLM's recommendations (with reasoning) and the full details of each recommended exercise from the database.

## Data Structure

The API uses the `merged_exercises.json` file which contains both prenatal and postnatal exercises:

- Prenatal exercises are organized by trimester (1, 2, 3)
- Postnatal exercises are provided as a separate collection

Each exercise contains information such as name, description, steps, precautions, benefits, difficulty level, and media links.
