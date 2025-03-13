# Pregnancy Symptom Tracker API

A machine learning-based API for tracking pregnancy symptoms and generating healthcare alerts.

## Project Overview

This API is designed to help pregnant individuals track their symptoms, receive personalized recommendations, and get alerts for potentially concerning symptoms. The system uses machine learning algorithms to analyze symptom patterns and detect anomalies.

## Features

- **Symptom Tracking**: Log and monitor various pregnancy symptoms
- **Anomaly Detection**: ML-powered detection of unusual symptom patterns
- **Risk Assessment**: Evaluation of symptom severity and potential risks
- **Personalized Recommendations**: Get tailored advice based on symptoms and pregnancy stage
- **Healthcare Alerts**: Receive notifications for high-risk symptoms

## API Endpoints

### Symptom Logging

```
POST /api/symptoms/log
```

Logs a new symptom entry and returns immediate analysis, alerts, and recommendations.

### Symptom History

```
GET /api/symptoms/history?user_id={user_id}&days={days}
```

Retrieves symptom history for a user over a specified period.

### Alerts

```
GET /api/alerts?user_id={user_id}&days={days}
```

Gets current health alerts for a user.

### Recommendations

```
GET /api/recommendations?user_id={user_id}
```

Gets personalized recommendations based on symptom history.

## Machine Learning Components

- **Isolation Forest**: Used for anomaly detection in symptom patterns
- **Risk Level Assessment**: Algorithm to determine risk based on symptom severity and ML analysis
- **Trend Analysis**: Tracking symptom progression over time

## Installation and Setup

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the server:
   ```
   uvicorn app.main:app --reload
   ```

## Deployment

This project is configured for deployment on Render. The necessary configuration files (`render.yaml` and `Procfile`) are included in the repository.

## Dependencies

- FastAPI: `fastapi==0.104.1`
- Uvicorn: `uvicorn==0.23.2`
- NumPy: `numpy==1.26.0`
- Pandas: `pandas==2.1.1`
- Scikit-learn: `scikit-learn==1.3.1`
- Pydantic: `pydantic==2.5.2`
- Python-dotenv: `python-dotenv==1.0.0`
- Joblib: `joblib==1.3.2`

## Testing

Run the test script to validate the functionality of the API and ML components:

```
python test_api.py
```

## API Documentation

Interactive API documentation is available at `/docs` when the server is running (e.g., http://127.0.0.1:8000/docs).
