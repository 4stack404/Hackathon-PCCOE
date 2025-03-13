import random
from datetime import datetime, timedelta
import uuid

from app.models.schemas import (
    SymptomLog, 
    SymptomType, 
    SymptomSeverity,
    Alert,
    AlertLevel,
    Recommendation
)


def generate_sample_symptoms(user_id: str, num_samples: int = 20, days_back: int = 30):
    """Generate sample symptom data for testing"""
    symptoms = []
    
    # List of symptom types
    symptom_types = list(SymptomType)
    severity_levels = list(SymptomSeverity)
    
    # Current date
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days_back)
    
    # Generate random symptoms
    for _ in range(num_samples):
        # Random timestamp between start_date and end_date
        timestamp = start_date + timedelta(
            seconds=random.randint(0, int((end_date - start_date).total_seconds()))
        )
        
        # Random symptom type and severity
        symptom_type = random.choice(symptom_types)
        severity = random.choice(severity_levels)
        
        # Random pregnancy week (1-40)
        pregnancy_week = random.randint(1, 40)
        
        # Random duration (5-120 minutes)
        duration = random.randint(5, 120) if random.random() > 0.3 else None
        
        # Create symptom log
        symptom = SymptomLog(
            user_id=user_id,
            symptom_type=symptom_type,
            severity=severity,
            timestamp=timestamp,
            description=f"Sample {symptom_type} symptom with {severity} severity",
            duration_minutes=duration,
            pregnancy_week=pregnancy_week,
            additional_data={}
        )
        
        symptoms.append(symptom)
    
    # Sort by timestamp
    symptoms.sort(key=lambda x: x.timestamp)
    
    return symptoms


def generate_anomaly_symptoms(user_id: str, base_symptom_type: SymptomType = SymptomType.BLOOD_PRESSURE):
    """Generate a sequence of symptoms that show an anomaly pattern"""
    symptoms = []
    
    # Current date
    now = datetime.now()
    
    # Generate a sequence of worsening symptoms over 5 days
    for i in range(5):
        timestamp = now - timedelta(days=5-i)
        
        # Severity increases over time
        if i < 2:
            severity = SymptomSeverity.MILD
        elif i < 4:
            severity = SymptomSeverity.MODERATE
        else:
            severity = SymptomSeverity.SEVERE
        
        # Create symptom log
        symptom = SymptomLog(
            user_id=user_id,
            symptom_type=base_symptom_type,
            severity=severity,
            timestamp=timestamp,
            description=f"Worsening {base_symptom_type} symptom (day {i+1})",
            duration_minutes=random.randint(10, 60),
            pregnancy_week=random.randint(20, 30),
            additional_data={}
        )
        
        symptoms.append(symptom)
    
    return symptoms


def generate_sample_alerts(user_id: str, num_alerts: int = 5):
    """Generate sample alerts for testing"""
    alerts = []
    alert_levels = list(AlertLevel)
    symptom_types = list(SymptomType)
    
    for i in range(num_alerts):
        # Random alert level
        level = random.choice(alert_levels)
        
        # Random related symptom
        related_symptom = random.choice(symptom_types)
        
        # Create alert
        alert = Alert(
            alert_id=str(uuid.uuid4()),
            user_id=user_id,
            timestamp=datetime.now() - timedelta(days=random.randint(0, 7)),
            level=level,
            title=f"Sample {level} Alert for {related_symptom}",
            message=f"This is a sample {level} alert related to {related_symptom} symptoms.",
            related_symptoms=[str(related_symptom)],
            is_read=random.random() > 0.5,
            action_required=level == AlertLevel.URGENT,
            action_description="Sample action description" if level == AlertLevel.URGENT else None
        )
        
        alerts.append(alert)
    
    return alerts


def generate_sample_recommendations(user_id: str, num_recommendations: int = 5):
    """Generate sample recommendations for testing"""
    recommendations = []
    symptom_types = list(SymptomType)
    categories = ["Nutrition", "Rest & Exercise", "Physical Comfort", "Mental Health", "Medical Monitoring"]
    
    for i in range(num_recommendations):
        # Random related symptom and category
        related_symptom = random.choice(symptom_types)
        category = random.choice(categories)
        
        # Random priority (1-5)
        priority = random.randint(1, 5)
        
        # Create recommendation
        recommendation = Recommendation(
            recommendation_id=str(uuid.uuid4()),
            user_id=user_id,
            timestamp=datetime.now() - timedelta(days=random.randint(0, 7)),
            title=f"Sample Recommendation for {related_symptom}",
            description=f"This is a sample recommendation for managing {related_symptom} symptoms.",
            related_symptoms=[str(related_symptom)],
            category=category,
            priority=priority,
            is_followed=random.random() > 0.5
        )
        
        recommendations.append(recommendation)
    
    return recommendations
