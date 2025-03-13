from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime, timedelta
import uvicorn
import os
from pathlib import Path

from app.models.schemas import (
    SymptomLog, 
    SymptomHistory, 
    Alert, 
    Recommendation,
    SymptomLogResponse
)
from app.services.symptom_service import SymptomService
from app.services.alert_service import AlertService
from app.services.recommendation_service import RecommendationService

# Create data directory if it doesn't exist
data_dir = Path("data")
data_dir.mkdir(exist_ok=True)

app = FastAPI(
    title="Pregnancy Symptom Tracker API",
    description="API for tracking pregnancy symptoms and generating healthcare alerts using ML",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify the actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service instances
symptom_service = SymptomService()
alert_service = AlertService()
recommendation_service = RecommendationService()


@app.get("/")
async def root():
    return {"message": "Welcome to the Pregnancy Symptom Tracker API"}


@app.post("/api/symptoms/log", response_model=SymptomLogResponse)
async def log_symptom(symptom_data: SymptomLog):
    """Log a new symptom entry and get immediate analysis"""
    try:
        # Save the symptom data
        saved_data = symptom_service.save_symptom(symptom_data)
        
        # Analyze the symptom data using ML
        analysis_result = symptom_service.analyze_symptom(symptom_data)
        
        # Generate alerts if necessary
        alerts = alert_service.generate_alerts(symptom_data, analysis_result)
        
        # Generate recommendations
        recommendations = recommendation_service.generate_recommendations(symptom_data, analysis_result)
        
        return {
            "symptom_id": saved_data.symptom_id,
            "status": "success",
            "analysis": analysis_result,
            "alerts": alerts,
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/symptoms/history", response_model=List[SymptomHistory])
async def get_symptom_history(user_id: str, days: Optional[int] = 30):
    """Get symptom history for a user over a specified period"""
    try:
        # Calculate the start date based on the specified number of days
        start_date = datetime.now() - timedelta(days=days)
        
        # Get symptom history from the service
        history = symptom_service.get_symptom_history(user_id, start_date)
        
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/alerts", response_model=List[Alert])
async def get_alerts(user_id: str, days: Optional[int] = 7):
    """Get current health alerts for a user"""
    try:
        # Calculate the start date based on the specified number of days
        start_date = datetime.now() - timedelta(days=days)
        
        # Get alerts from the service
        alerts = alert_service.get_alerts(user_id, start_date)
        
        return alerts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/recommendations", response_model=List[Recommendation])
async def get_recommendations(user_id: str):
    """Get personalized recommendations based on symptom history"""
    try:
        # Get recommendations from the service
        recommendations = recommendation_service.get_recommendations(user_id)
        
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
