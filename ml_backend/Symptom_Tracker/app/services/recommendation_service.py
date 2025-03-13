import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

from app.models.schemas import SymptomLog, Recommendation, SymptomType, SymptomSeverity
from app.utils.data_store import DataStore


class RecommendationService:
    def __init__(self):
        self.data_store = DataStore()
    
    def generate_recommendations(self, symptom_data: SymptomLog, analysis_result: Dict[str, Any]) -> List[Recommendation]:
        """Generate personalized recommendations based on symptom data and analysis"""
        recommendations = []
        
        # Get recommendations based on symptom type
        type_recommendations = self._get_recommendations_by_type(symptom_data)
        recommendations.extend(type_recommendations)
        
        # Get recommendations based on risk level
        risk_level = analysis_result.get("risk_level", "low")
        risk_recommendations = self._get_recommendations_by_risk(symptom_data, risk_level)
        recommendations.extend(risk_recommendations)
        
        # Get trimester-specific recommendations if pregnancy week is available
        if symptom_data.pregnancy_week:
            trimester = self._get_trimester(symptom_data.pregnancy_week)
            trimester_recommendations = self._get_recommendations_by_trimester(symptom_data, trimester)
            recommendations.extend(trimester_recommendations)
        
        # Save recommendations to data store
        for recommendation in recommendations:
            self.data_store.save_recommendation(recommendation)
        
        return recommendations
    
    def get_recommendations(self, user_id: str) -> List[Recommendation]:
        """Get all recommendations for a user"""
        recommendations = self.data_store.get_recommendations_by_user(user_id)
        
        # Sort by priority (highest first) and then by timestamp (newest first)
        recommendations.sort(key=lambda x: (-x.priority, -x.timestamp.timestamp()))
        
        return recommendations
    
    def _get_recommendations_by_type(self, symptom_data: SymptomLog) -> List[Recommendation]:
        """Get recommendations based on symptom type"""
        recommendations = []
        
        # Create a recommendation based on symptom type
        if symptom_data.symptom_type == SymptomType.NAUSEA:
            recommendation = Recommendation(
                recommendation_id=str(uuid.uuid4()),
                user_id=symptom_data.user_id,
                title="Managing Nausea",
                description="Try eating small, frequent meals and avoiding strong smells. Ginger tea or supplements may help reduce nausea.",
                related_symptoms=[str(SymptomType.NAUSEA)],
                category="Nutrition",
                priority=3 if symptom_data.severity == SymptomSeverity.SEVERE else 2,
                timestamp=datetime.now(),
                is_followed=False
            )
            recommendations.append(recommendation)
        
        elif symptom_data.symptom_type == SymptomType.FATIGUE:
            recommendation = Recommendation(
                recommendation_id=str(uuid.uuid4()),
                user_id=symptom_data.user_id,
                title="Managing Fatigue",
                description="Ensure you're getting adequate rest and consider light exercise like walking. Staying hydrated and eating iron-rich foods may help with energy levels.",
                related_symptoms=[str(SymptomType.FATIGUE)],
                category="Rest and Exercise",
                priority=2,
                timestamp=datetime.now(),
                is_followed=False
            )
            recommendations.append(recommendation)
        
        elif symptom_data.symptom_type == SymptomType.BACK_PAIN:
            recommendation = Recommendation(
                recommendation_id=str(uuid.uuid4()),
                user_id=symptom_data.user_id,
                title="Relieving Back Pain",
                description="Try gentle stretching, applying heat, and maintaining good posture. A pregnancy support belt may help alleviate lower back pain.",
                related_symptoms=[str(SymptomType.BACK_PAIN)],
                category="Physical Comfort",
                priority=3 if symptom_data.severity == SymptomSeverity.SEVERE else 2,
                timestamp=datetime.now(),
                is_followed=False
            )
            recommendations.append(recommendation)
        
        elif symptom_data.symptom_type == SymptomType.BLOOD_PRESSURE:
            recommendation = Recommendation(
                recommendation_id=str(uuid.uuid4()),
                user_id=symptom_data.user_id,
                title="Blood Pressure Management",
                description="Monitor your blood pressure regularly. Maintain a balanced diet low in sodium, stay hydrated, and practice relaxation techniques to help lower blood pressure.",
                related_symptoms=[str(SymptomType.BLOOD_PRESSURE)],
                category="Monitoring",
                priority=5 if symptom_data.severity == SymptomSeverity.SEVERE else 4,
                timestamp=datetime.now(),
                is_followed=False
            )
            recommendations.append(recommendation)
        
        elif symptom_data.symptom_type == SymptomType.CONTRACTIONS:
            recommendation = Recommendation(
                recommendation_id=str(uuid.uuid4()),
                user_id=symptom_data.user_id,
                title="Monitoring Contractions",
                description="Time your contractions (duration and frequency). Stay hydrated and rest on your left side. Contact your healthcare provider if contractions become regular or painful.",
                related_symptoms=[str(SymptomType.CONTRACTIONS)],
                category="Monitoring",
                priority=5,
                timestamp=datetime.now(),
                is_followed=False
            )
            recommendations.append(recommendation)
        
        # Add more symptom-specific recommendations as needed
        
        return recommendations
    
    def _get_recommendations_by_risk(self, symptom_data: SymptomLog, risk_level: str) -> List[Recommendation]:
        """Get recommendations based on risk level"""
        recommendations = []
        
        if risk_level == "high":
            recommendation = Recommendation(
                recommendation_id=str(uuid.uuid4()),
                user_id=symptom_data.user_id,
                title="High-Risk Symptom Action Plan",
                description="Your symptoms indicate a high-risk situation. Please contact your healthcare provider to discuss these symptoms.",
                related_symptoms=[str(symptom_data.symptom_type)],
                category="Medical Attention",
                priority=5,
                timestamp=datetime.now(),
                is_followed=False
            )
            recommendations.append(recommendation)
        
        elif risk_level == "medium":
            recommendation = Recommendation(
                recommendation_id=str(uuid.uuid4()),
                user_id=symptom_data.user_id,
                title="Moderate Risk Monitoring",
                description="Monitor your symptoms closely and log any changes. If symptoms worsen, contact your healthcare provider.",
                related_symptoms=[str(symptom_data.symptom_type)],
                category="Monitoring",
                priority=3,
                timestamp=datetime.now(),
                is_followed=False
            )
            recommendations.append(recommendation)
        
        return recommendations
    
    def _get_recommendations_by_trimester(self, symptom_data: SymptomLog, trimester: int) -> List[Recommendation]:
        """Get trimester-specific recommendations"""
        recommendations = []
        
        if trimester == 1 and symptom_data.symptom_type == SymptomType.NAUSEA:
            recommendation = Recommendation(
                recommendation_id=str(uuid.uuid4()),
                user_id=symptom_data.user_id,
                title="First Trimester Nausea Management",
                description="Morning sickness is common in the first trimester. Try eating crackers before getting out of bed and consider vitamin B6 supplements after consulting with your doctor.",
                related_symptoms=[str(SymptomType.NAUSEA)],
                category="First Trimester",
                priority=2,
                timestamp=datetime.now(),
                is_followed=False
            )
            recommendations.append(recommendation)
        
        elif trimester == 2 and symptom_data.symptom_type == SymptomType.BACK_PAIN:
            recommendation = Recommendation(
                recommendation_id=str(uuid.uuid4()),
                user_id=symptom_data.user_id,
                title="Second Trimester Back Care",
                description="As your baby grows in the second trimester, back pain may increase. Consider prenatal yoga or swimming to strengthen your back muscles.",
                related_symptoms=[str(SymptomType.BACK_PAIN)],
                category="Second Trimester",
                priority=2,
                timestamp=datetime.now(),
                is_followed=False
            )
            recommendations.append(recommendation)
        
        elif trimester == 3 and symptom_data.symptom_type == SymptomType.SWELLING:
            recommendation = Recommendation(
                recommendation_id=str(uuid.uuid4()),
                user_id=symptom_data.user_id,
                title="Third Trimester Swelling Relief",
                description="Elevate your feet when sitting and avoid standing for long periods. Compression stockings may help reduce swelling in your legs.",
                related_symptoms=[str(SymptomType.SWELLING)],
                category="Third Trimester",
                priority=2,
                timestamp=datetime.now(),
                is_followed=False
            )
            recommendations.append(recommendation)
        
        # Add more trimester-specific recommendations as needed
        
        return recommendations
    
    def _get_trimester(self, pregnancy_week: int) -> int:
        """Determine trimester based on pregnancy week"""
        if pregnancy_week <= 13:
            return 1  # First trimester
        elif pregnancy_week <= 26:
            return 2  # Second trimester
        else:
            return 3  # Third trimester
