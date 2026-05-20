from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import datetime
import json

# Database Setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./clinical_data.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemy Models
class PatientModel(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, index=True)
    submissionDate = Column(DateTime, default=datetime.datetime.utcnow)
    name = Column(String)
    age = Column(String)
    gender = Column(String)
    
    # Store nested objects as JSON strings
    comorbidities = Column(Text) # JSON string
    symptoms = Column(Text)      # JSON string
    diagnosticImages = Column(Text, nullable=True) # JSON string
    diagnosisData = Column(Text, nullable=True)    # JSON string

# Pydantic Schemas for Validation
class PatientBase(BaseModel):
    id: str
    submissionDate: str
    name: str
    age: str
    gender: str
    comorbidities: Dict[str, bool]
    symptoms: Dict[str, Any]
    diagnosticImages: Optional[Dict[str, str]] = None
    diagnosisData: Optional[Dict[str, Any]] = None

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    class Config:
        from_attributes = True

# Helper to initialize database
def init_db():
    Base.metadata.create_all(bind=engine)
