from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import os
from pathlib import Path

from app.models.schemas import SymptomHistory, Alert, Recommendation, SymptomType, SymptomSeverity, AlertLevel


class DataStore:
    """A simple in-memory and file-based data store for the application"""
    
    def __init__(self):
        # In-memory storage
        self.symptoms = {}
        self.alerts = {}
        self.recommendations = {}
        
        # File paths for persistence
        self.data_dir = Path("data")
        self.symptoms_file = self.data_dir / "symptoms.json"
        self.alerts_file = self.data_dir / "alerts.json"
        self.recommendations_file = self.data_dir / "recommendations.json"
        
        # Create data directory if it doesn't exist
        self.data_dir.mkdir(exist_ok=True)
        
        # Load data from files if they exist
        self._load_data()
    
    def save_symptom(self, symptom: SymptomHistory) -> None:
        """Save a symptom to the data store"""
        user_id = symptom.user_id
        symptom_id = symptom.symptom_id
        
        # Initialize user's symptom list if it doesn't exist
        if user_id not in self.symptoms:
            self.symptoms[user_id] = {}
        
        # Convert to dict for storage
        symptom_dict = symptom.dict()
        
        # Convert enum values to strings for JSON serialization
        symptom_dict["symptom_type"] = str(symptom_dict["symptom_type"])
        symptom_dict["severity"] = str(symptom_dict["severity"])
        
        # Store by ID
        self.symptoms[user_id][symptom_id] = symptom_dict
        
        # Save to file
        self._save_symptoms()
    
    def get_symptoms_by_user(self, user_id: str) -> List[SymptomHistory]:
        """Get all symptoms for a user"""
        if user_id not in self.symptoms:
            return []
        
        # Convert dict to SymptomHistory objects
        symptoms = []
        for symptom_dict in self.symptoms[user_id].values():
            # Convert timestamp string back to datetime if needed
            if isinstance(symptom_dict["timestamp"], str):
                symptom_dict["timestamp"] = datetime.fromisoformat(symptom_dict["timestamp"])
            
            # Convert string values back to enums
            if isinstance(symptom_dict["symptom_type"], str):
                symptom_type_str = symptom_dict["symptom_type"].split('.')[-1].lower()
                symptom_dict["symptom_type"] = getattr(SymptomType, symptom_type_str.upper())
            
            if isinstance(symptom_dict["severity"], str):
                severity_str = symptom_dict["severity"].split('.')[-1].lower()
                symptom_dict["severity"] = getattr(SymptomSeverity, severity_str.upper())
            
            symptoms.append(SymptomHistory(**symptom_dict))
        
        # Sort by timestamp (oldest first)
        symptoms.sort(key=lambda x: x.timestamp)
        
        return symptoms
    
    def save_alert(self, alert: Alert) -> None:
        """Save an alert to the data store"""
        user_id = alert.user_id
        alert_id = alert.alert_id
        
        # Initialize user's alert list if it doesn't exist
        if user_id not in self.alerts:
            self.alerts[user_id] = {}
        
        # Convert to dict for storage
        alert_dict = alert.dict()
        
        # Convert enum values to strings for JSON serialization
        alert_dict["level"] = str(alert_dict["level"])
        
        # Store by ID
        self.alerts[user_id][alert_id] = alert_dict
        
        # Save to file
        self._save_alerts()
    
    def get_alerts_by_user(self, user_id: str) -> List[Alert]:
        """Get all alerts for a user"""
        if user_id not in self.alerts:
            return []
        
        # Convert dict to Alert objects
        alerts = []
        for alert_dict in self.alerts[user_id].values():
            # Convert timestamp string back to datetime if needed
            if isinstance(alert_dict["timestamp"], str):
                alert_dict["timestamp"] = datetime.fromisoformat(alert_dict["timestamp"])
            
            # Convert string values back to enums
            if isinstance(alert_dict["level"], str):
                level_str = alert_dict["level"].split('.')[-1].lower()
                alert_dict["level"] = getattr(AlertLevel, level_str.upper())
            
            alerts.append(Alert(**alert_dict))
        
        return alerts
    
    def save_recommendation(self, recommendation: Recommendation) -> None:
        """Save a recommendation to the data store"""
        user_id = recommendation.user_id
        recommendation_id = recommendation.recommendation_id
        
        # Initialize user's recommendation list if it doesn't exist
        if user_id not in self.recommendations:
            self.recommendations[user_id] = {}
        
        # Convert to dict for storage
        recommendation_dict = recommendation.dict()
        
        # Store by ID
        self.recommendations[user_id][recommendation_id] = recommendation_dict
        
        # Save to file
        self._save_recommendations()
    
    def get_recommendations_by_user(self, user_id: str) -> List[Recommendation]:
        """Get all recommendations for a user"""
        if user_id not in self.recommendations:
            return []
        
        # Convert dict to Recommendation objects
        recommendations = []
        for rec_dict in self.recommendations[user_id].values():
            # Convert timestamp string back to datetime if needed
            if isinstance(rec_dict["timestamp"], str):
                rec_dict["timestamp"] = datetime.fromisoformat(rec_dict["timestamp"])
            
            recommendations.append(Recommendation(**rec_dict))
        
        return recommendations
    
    def _load_data(self) -> None:
        """Load data from files"""
        # Load symptoms
        if self.symptoms_file.exists():
            try:
                with open(self.symptoms_file, "r") as f:
                    self.symptoms = json.load(f)
            except Exception as e:
                print(f"Error loading symptoms data: {e}")
        
        # Load alerts
        if self.alerts_file.exists():
            try:
                with open(self.alerts_file, "r") as f:
                    self.alerts = json.load(f)
            except Exception as e:
                print(f"Error loading alerts data: {e}")
        
        # Load recommendations
        if self.recommendations_file.exists():
            try:
                with open(self.recommendations_file, "r") as f:
                    self.recommendations = json.load(f)
            except Exception as e:
                print(f"Error loading recommendations data: {e}")
    
    def _save_symptoms(self) -> None:
        """Save symptoms to file"""
        try:
            with open(self.symptoms_file, "w") as f:
                json.dump(self.symptoms, f, default=self._json_serializer)
        except Exception as e:
            print(f"Error saving symptoms data: {e}")
    
    def _save_alerts(self) -> None:
        """Save alerts to file"""
        try:
            with open(self.alerts_file, "w") as f:
                json.dump(self.alerts, f, default=self._json_serializer)
        except Exception as e:
            print(f"Error saving alerts data: {e}")
    
    def _save_recommendations(self) -> None:
        """Save recommendations to file"""
        try:
            with open(self.recommendations_file, "w") as f:
                json.dump(self.recommendations, f, default=self._json_serializer)
        except Exception as e:
            print(f"Error saving recommendations data: {e}")
    
    def _json_serializer(self, obj):
        """Custom JSON serializer for objects not serializable by default"""
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, (SymptomType, SymptomSeverity, AlertLevel)):
            return str(obj)
        raise TypeError(f"Type {type(obj)} not serializable")
