import uuid
import numpy as np
import pandas as pd
from datetime import datetime
from typing import List, Dict, Any, Optional
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

from app.models.schemas import SymptomLog, SymptomHistory, SymptomType, SymptomSeverity
from app.utils.data_store import DataStore


class SymptomService:
    def __init__(self):
        self.data_store = DataStore()
        self.anomaly_detector = IsolationForest(contamination=0.05, random_state=42)
        self.scaler = StandardScaler()
        self.is_model_trained = False
        
    def save_symptom(self, symptom_data: SymptomLog) -> SymptomHistory:
        """Save symptom data and return a SymptomHistory object"""
        # Generate a unique ID for the symptom log
        symptom_id = str(uuid.uuid4())
        
        # Create a SymptomHistory object
        symptom_history = SymptomHistory(
            symptom_id=symptom_id,
            user_id=symptom_data.user_id,
            symptom_type=symptom_data.symptom_type,
            severity=symptom_data.severity,
            timestamp=symptom_data.timestamp,
            description=symptom_data.description,
            duration_minutes=symptom_data.duration_minutes,
            additional_data=symptom_data.additional_data,
            pregnancy_week=symptom_data.pregnancy_week,
            analysis_result=None  # Will be updated after analysis
        )
        
        # Save to data store
        self.data_store.save_symptom(symptom_history)
        
        return symptom_history
    
    def analyze_symptom(self, symptom_data: SymptomLog) -> Dict[str, Any]:
        """Analyze symptom data using ML algorithms"""
        # Get user's symptom history
        history = self.data_store.get_symptoms_by_user(symptom_data.user_id)
        
        # Prepare analysis result
        analysis_result = {
            "anomaly_detected": False,
            "risk_level": "low",
            "trend": "stable",
            "similar_patterns": [],
            "confidence": 0.0
        }
        
        # If we have enough data, perform anomaly detection
        if len(history) >= 5:
            # Extract features from symptom history
            features = self._extract_features(history + [symptom_data])
            
            # Train the model if not already trained
            if not self.is_model_trained or len(history) % 10 == 0:  # Retrain every 10 new symptoms
                self._train_anomaly_detector(features[:-1])  # Train on all but the latest data point
            
            # Predict anomaly for the new symptom
            latest_features = features[-1:]
            anomaly_score = self._predict_anomaly(latest_features)
            
            # Update analysis result
            analysis_result["anomaly_detected"] = bool(anomaly_score < -0.5)  # Convert numpy.bool_ to Python bool
            analysis_result["confidence"] = float(min(1.0, abs(anomaly_score) * 2))  # Convert to Python float
            
            # Determine risk level based on anomaly score and symptom severity
            risk_level = self._determine_risk_level(anomaly_score, symptom_data)
            analysis_result["risk_level"] = risk_level
            
            # Analyze trend based on recent symptoms of the same type
            trend = self._analyze_trend(history, symptom_data)
            analysis_result["trend"] = trend
            
            # Find similar patterns in the past
            similar_patterns = self._find_similar_patterns(history, symptom_data)
            analysis_result["similar_patterns"] = similar_patterns
        else:
            # Not enough data for ML analysis, use rule-based approach
            analysis_result = self._rule_based_analysis(symptom_data)
        
        # Ensure all values are Python native types, not NumPy types
        analysis_result = self._convert_numpy_types(analysis_result)
        
        return analysis_result
    
    def get_symptom_history(self, user_id: str, start_date: datetime) -> List[SymptomHistory]:
        """Get symptom history for a user starting from a specific date"""
        all_symptoms = self.data_store.get_symptoms_by_user(user_id)
        
        # Filter symptoms by date
        filtered_symptoms = [s for s in all_symptoms if s.timestamp >= start_date]
        
        return filtered_symptoms
    
    def _extract_features(self, symptoms: List) -> np.ndarray:
        """Extract numerical features from symptom data for ML analysis"""
        features = []
        
        for symptom in symptoms:
            # Convert severity to numerical value
            severity_value = {
                SymptomSeverity.MILD: 1,
                SymptomSeverity.MODERATE: 2,
                SymptomSeverity.SEVERE: 3
            }.get(symptom.severity, 0)
            
            # Create feature vector
            feature_vector = [
                severity_value,
                symptom.duration_minutes if symptom.duration_minutes else 0,
                symptom.pregnancy_week if symptom.pregnancy_week else 0,
                # One-hot encoding of symptom type
                1 if symptom.symptom_type == SymptomType.NAUSEA else 0,
                1 if symptom.symptom_type == SymptomType.FATIGUE else 0,
                1 if symptom.symptom_type == SymptomType.BACK_PAIN else 0,
                1 if symptom.symptom_type == SymptomType.SWELLING else 0,
                1 if symptom.symptom_type == SymptomType.HEADACHE else 0,
                1 if symptom.symptom_type == SymptomType.BLOOD_PRESSURE else 0,
                1 if symptom.symptom_type == SymptomType.WEIGHT_CHANGE else 0,
                1 if symptom.symptom_type == SymptomType.SLEEP_ISSUE else 0,
                1 if symptom.symptom_type == SymptomType.MOOD_CHANGE else 0,
                1 if symptom.symptom_type == SymptomType.CONTRACTIONS else 0,
                1 if symptom.symptom_type == SymptomType.FETAL_MOVEMENT else 0,
                1 if symptom.symptom_type == SymptomType.OTHER else 0,
            ]
            
            features.append(feature_vector)
        
        # Convert to numpy array
        features_array = np.array(features)
        
        # Scale features
        if len(features_array) > 1:  # Only scale if we have more than one data point
            features_array = self.scaler.fit_transform(features_array)
        
        return features_array
    
    def _train_anomaly_detector(self, features: np.ndarray) -> None:
        """Train the anomaly detection model"""
        if len(features) > 0:
            self.anomaly_detector.fit(features)
            self.is_model_trained = True
    
    def _predict_anomaly(self, features: np.ndarray) -> float:
        """Predict anomaly score for new symptom data"""
        if self.is_model_trained:
            # Get anomaly score (-1 to 1, where lower values indicate anomalies)
            return float(self.anomaly_detector.score_samples(features)[0])  # Convert to Python float
        return 0.0
    
    def _determine_risk_level(self, anomaly_score: float, symptom_data: SymptomLog) -> str:
        """Determine risk level based on anomaly score and symptom severity"""
        # Convert severity to numerical value
        severity_value = {
            SymptomSeverity.MILD: 1,
            SymptomSeverity.MODERATE: 2,
            SymptomSeverity.SEVERE: 3
        }.get(symptom_data.severity, 0)
        
        # High-risk symptoms that require attention even if mild
        high_risk_symptoms = [SymptomType.BLOOD_PRESSURE, SymptomType.CONTRACTIONS, SymptomType.FETAL_MOVEMENT]
        
        # Determine base risk from anomaly score
        if anomaly_score < -0.8:
            base_risk = "high"
        elif anomaly_score < -0.5:
            base_risk = "medium"
        else:
            base_risk = "low"
        
        # Adjust risk based on severity and symptom type
        if severity_value == 3 or (severity_value >= 2 and symptom_data.symptom_type in high_risk_symptoms):
            # Severe symptoms or moderate high-risk symptoms
            return "high"
        elif severity_value == 2 or (severity_value >= 1 and symptom_data.symptom_type in high_risk_symptoms):
            # Moderate symptoms or mild high-risk symptoms
            return "medium" if base_risk == "low" else base_risk
        else:
            # Mild symptoms of low-risk types
            return base_risk
    
    def _analyze_trend(self, history: List[SymptomHistory], current_symptom: SymptomLog) -> str:
        """Analyze trend of symptoms over time"""
        # Filter history to only include symptoms of the same type
        same_type_symptoms = [s for s in history if s.symptom_type == current_symptom.symptom_type]
        
        # Sort by timestamp
        same_type_symptoms.sort(key=lambda x: x.timestamp)
        
        # If we have less than 3 symptoms of this type, we can't determine a trend
        if len(same_type_symptoms) < 3:
            return "stable"
        
        # Get the last 3 symptoms (excluding the current one)
        recent_symptoms = same_type_symptoms[-3:]
        
        # Convert severity to numerical values
        severity_values = []
        for symptom in recent_symptoms:
            value = {
                SymptomSeverity.MILD: 1,
                SymptomSeverity.MODERATE: 2,
                SymptomSeverity.SEVERE: 3
            }.get(symptom.severity, 0)
            severity_values.append(value)
        
        # Add current symptom severity
        current_severity = {
            SymptomSeverity.MILD: 1,
            SymptomSeverity.MODERATE: 2,
            SymptomSeverity.SEVERE: 3
        }.get(current_symptom.severity, 0)
        severity_values.append(current_severity)
        
        # Calculate trend
        if severity_values[-1] > severity_values[-2] > severity_values[-3]:
            return "worsening"
        elif severity_values[-1] < severity_values[-2] < severity_values[-3]:
            return "improving"
        elif severity_values[-1] > severity_values[-2]:
            return "slightly_worsening"
        elif severity_values[-1] < severity_values[-2]:
            return "slightly_improving"
        else:
            return "stable"
    
    def _find_similar_patterns(self, history: List[SymptomHistory], current_symptom: SymptomLog) -> List[Dict[str, Any]]:
        """Find similar symptom patterns in the past"""
        similar_patterns = []
        
        # If we don't have enough history, return empty list
        if len(history) < 5:
            return similar_patterns
        
        # Group symptoms by week
        symptoms_by_week = {}
        for symptom in history:
            week = symptom.pregnancy_week
            if week:
                if week not in symptoms_by_week:
                    symptoms_by_week[week] = []
                symptoms_by_week[week].append(symptom)
        
        # Current week
        current_week = current_symptom.pregnancy_week
        
        # If we don't have a current week, return empty list
        if not current_week:
            return similar_patterns
        
        # Look for similar patterns in previous weeks
        for week, symptoms in symptoms_by_week.items():
            # Skip current week
            if week == current_week:
                continue
            
            # Check if this week had similar symptoms
            for symptom in symptoms:
                if symptom.symptom_type == current_symptom.symptom_type and symptom.severity == current_symptom.severity:
                    similar_patterns.append({
                        "week": int(week),  # Convert to Python int
                        "symptom_id": symptom.symptom_id,
                        "symptom_type": str(symptom.symptom_type),
                        "severity": str(symptom.severity),
                        "timestamp": symptom.timestamp.isoformat()
                    })
        
        # Sort by week (descending) and limit to 3 most recent
        similar_patterns.sort(key=lambda x: x["week"], reverse=True)
        return similar_patterns[:3]
    
    def _rule_based_analysis(self, symptom_data: SymptomLog) -> Dict[str, Any]:
        """Rule-based analysis for when we don't have enough data for ML"""
        # High-risk symptoms that require attention even if mild
        high_risk_symptoms = [SymptomType.BLOOD_PRESSURE, SymptomType.CONTRACTIONS, SymptomType.FETAL_MOVEMENT]
        
        # Convert severity to numerical value
        severity_value = {
            SymptomSeverity.MILD: 1,
            SymptomSeverity.MODERATE: 2,
            SymptomSeverity.SEVERE: 3
        }.get(symptom_data.severity, 0)
        
        # Determine risk level based on severity and symptom type
        if severity_value == 3 or (severity_value >= 2 and symptom_data.symptom_type in high_risk_symptoms):
            risk_level = "high"
            anomaly_detected = True
            confidence = 0.7
        elif severity_value == 2 or (severity_value >= 1 and symptom_data.symptom_type in high_risk_symptoms):
            risk_level = "medium"
            anomaly_detected = False
            confidence = 0.5
        else:
            risk_level = "low"
            anomaly_detected = False
            confidence = 0.8
        
        return {
            "anomaly_detected": bool(anomaly_detected),  # Convert to Python bool
            "risk_level": risk_level,
            "trend": "stable",  # Not enough data to determine trend
            "similar_patterns": [],  # Not enough data to find patterns
            "confidence": float(confidence),  # Convert to Python float
            "note": "Rule-based analysis (insufficient data for ML)"
        }
        
    def _convert_numpy_types(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Convert NumPy types to Python native types"""
        if isinstance(data, dict):
            return {k: self._convert_numpy_types(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._convert_numpy_types(item) for item in data]
        elif isinstance(data, np.integer):
            return int(data)
        elif isinstance(data, np.floating):
            return float(data)
        elif isinstance(data, np.ndarray):
            return self._convert_numpy_types(data.tolist())
        elif isinstance(data, np.bool_):
            return bool(data)
        else:
            return data
