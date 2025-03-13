import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

from app.models.schemas import SymptomLog, Alert, AlertLevel, SymptomType
from app.utils.data_store import DataStore


class AlertService:
    def __init__(self):
        self.data_store = DataStore()
    
    def generate_alerts(self, symptom_data: SymptomLog, analysis_result: Dict[str, Any]) -> List[Alert]:
        """Generate alerts based on symptom data and analysis results"""
        alerts = []
        
        # Check if an anomaly was detected
        if analysis_result.get("anomaly_detected", False):
            # Create an anomaly alert
            alert = self._create_anomaly_alert(symptom_data, analysis_result)
            alerts.append(alert)
        
        # Check risk level
        risk_level = analysis_result.get("risk_level", "low")
        if risk_level == "high":
            # Create a high-risk alert
            alert = self._create_high_risk_alert(symptom_data, analysis_result)
            alerts.append(alert)
        
        # Check for specific symptom types that always need alerts
        if symptom_data.symptom_type in [SymptomType.BLOOD_PRESSURE, SymptomType.CONTRACTIONS, SymptomType.FETAL_MOVEMENT]:
            # Create a specific symptom alert
            alert = self._create_specific_symptom_alert(symptom_data)
            alerts.append(alert)
        
        # Save alerts to data store
        for alert in alerts:
            self.data_store.save_alert(alert)
        
        return alerts
    
    def get_alerts(self, user_id: str, start_date: datetime) -> List[Alert]:
        """Get alerts for a user starting from a specific date"""
        all_alerts = self.data_store.get_alerts_by_user(user_id)
        
        # Filter alerts by date
        filtered_alerts = [a for a in all_alerts if a.timestamp >= start_date]
        
        # Sort by timestamp (newest first)
        filtered_alerts.sort(key=lambda x: x.timestamp, reverse=True)
        
        return filtered_alerts
    
    def _create_anomaly_alert(self, symptom_data: SymptomLog, analysis_result: Dict[str, Any]) -> Alert:
        """Create an alert for an anomaly detection"""
        alert_id = str(uuid.uuid4())
        confidence = analysis_result.get("confidence", 0.0)
        confidence_str = f"{confidence * 100:.1f}%" if confidence > 0 else "Unknown"
        
        return Alert(
            alert_id=alert_id,
            user_id=symptom_data.user_id,
            level=AlertLevel.WARNING,
            title="Unusual Symptom Pattern Detected",
            message=f"Our system has detected an unusual pattern in your {symptom_data.symptom_type.value} symptoms. "
                   f"This may be worth discussing with your healthcare provider. "
                   f"Confidence: {confidence_str}",
            related_symptoms=[str(symptom_data.symptom_type)],
            action_required=True,
            action_description="Consider contacting your healthcare provider to discuss these symptoms."
        )
    
    def _create_high_risk_alert(self, symptom_data: SymptomLog, analysis_result: Dict[str, Any]) -> Alert:
        """Create an alert for high-risk symptoms"""
        alert_id = str(uuid.uuid4())
        
        return Alert(
            alert_id=alert_id,
            user_id=symptom_data.user_id,
            level=AlertLevel.URGENT,
            title=f"High-Risk {symptom_data.symptom_type.value.replace('_', ' ').title()} Symptoms",
            message=f"Your reported {symptom_data.symptom_type.value.replace('_', ' ')} symptoms are classified as high-risk. "
                   f"Please consider seeking medical attention.",
            related_symptoms=[str(symptom_data.symptom_type)],
            action_required=True,
            action_description="Contact your healthcare provider as soon as possible."
        )
    
    def _create_specific_symptom_alert(self, symptom_data: SymptomLog) -> Alert:
        """Create an alert for specific symptom types that always need monitoring"""
        alert_id = str(uuid.uuid4())
        
        # Customize message based on symptom type
        if symptom_data.symptom_type == SymptomType.BLOOD_PRESSURE:
            title = "Blood Pressure Changes Detected"
            message = "Changes in blood pressure during pregnancy should be monitored closely. "
            action = "Monitor your blood pressure regularly and report significant changes to your healthcare provider."
            level = AlertLevel.WARNING if symptom_data.severity.value in ["moderate", "severe"] else AlertLevel.INFO
        
        elif symptom_data.symptom_type == SymptomType.CONTRACTIONS:
            title = "Contractions Reported"
            message = "Regular contractions may indicate preterm labor or other conditions that require attention. "
            action = "Time your contractions and contact your healthcare provider if they become regular or painful."
            level = AlertLevel.URGENT if symptom_data.severity.value == "severe" else AlertLevel.WARNING
        
        elif symptom_data.symptom_type == SymptomType.FETAL_MOVEMENT:
            title = "Changes in Fetal Movement"
            message = "Changes in fetal movement patterns can be important indicators of fetal well-being. "
            action = "Monitor fetal kick counts and contact your healthcare provider if you notice decreased movement."
            level = AlertLevel.URGENT if symptom_data.severity.value == "severe" else AlertLevel.WARNING
        
        else:
            # Default alert for other symptoms
            title = f"{symptom_data.symptom_type.value.replace('_', ' ').title()} Symptoms Reported"
            message = "Your symptoms have been logged and will be monitored. "
            action = "Continue to track your symptoms and report any changes to your healthcare provider."
            level = AlertLevel.INFO
        
        return Alert(
            alert_id=alert_id,
            user_id=symptom_data.user_id,
            level=level,
            title=title,
            message=message,
            related_symptoms=[str(symptom_data.symptom_type)],
            action_required=level != AlertLevel.INFO,
            action_description=action
        )
