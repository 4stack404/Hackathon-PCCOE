from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum


class SymptomSeverity(str, Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"


class SymptomType(str, Enum):
    NAUSEA = "nausea"
    FATIGUE = "fatigue"
    BACK_PAIN = "back_pain"
    SWELLING = "swelling"
    HEADACHE = "headache"
    BLOOD_PRESSURE = "blood_pressure"
    WEIGHT_CHANGE = "weight_change"
    SLEEP_ISSUE = "sleep_issue"
    MOOD_CHANGE = "mood_change"
    CONTRACTIONS = "contractions"
    FETAL_MOVEMENT = "fetal_movement"
    OTHER = "other"


class AlertLevel(str, Enum):
    INFO = "info"
    WARNING = "warning"
    URGENT = "urgent"


class SymptomLog(BaseModel):
    user_id: str
    symptom_type: SymptomType
    severity: SymptomSeverity
    timestamp: datetime = Field(default_factory=datetime.now)
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    additional_data: Optional[Dict[str, Any]] = None
    pregnancy_week: Optional[int] = None
    
    @validator('pregnancy_week')
    def validate_pregnancy_week(cls, v):
        if v is not None and (v < 1 or v > 42):
            raise ValueError('Pregnancy week must be between 1 and 42')
        return v


class Alert(BaseModel):
    alert_id: str
    user_id: str
    timestamp: datetime = Field(default_factory=datetime.now)
    level: AlertLevel
    title: str
    message: str
    related_symptoms: List[str] = []
    is_read: bool = False
    action_required: bool = False
    action_description: Optional[str] = None


class Recommendation(BaseModel):
    recommendation_id: str
    user_id: str
    timestamp: datetime = Field(default_factory=datetime.now)
    title: str
    description: str
    related_symptoms: List[str] = []
    category: str
    priority: int = 1  # 1 (low) to 5 (high)
    is_followed: bool = False


class SymptomHistory(BaseModel):
    symptom_id: str
    user_id: str
    symptom_type: SymptomType
    severity: SymptomSeverity
    timestamp: datetime
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    additional_data: Optional[Dict[str, Any]] = None
    pregnancy_week: Optional[int] = None
    analysis_result: Optional[Dict[str, Any]] = None


class SymptomLogResponse(BaseModel):
    symptom_id: str
    status: str
    analysis: Dict[str, Any]
    alerts: List[Alert]
    recommendations: List[Recommendation]
