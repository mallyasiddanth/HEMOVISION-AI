from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import json
import datetime

import models
from models import SessionLocal, PatientModel, PatientCreate, Patient

app = FastAPI(title="HEMOVISION AI EHR Backend")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database
models.init_db()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/patients", response_model=List[Patient])
def read_patients(db: Session = Depends(get_db)):
    db_patients = db.query(PatientModel).all()
    
    # Convert back from JSON strings to objects
    result = []
    for p in db_patients:
        result.append(Patient(
            id=p.id,
            submissionDate=p.submissionDate.isoformat() if isinstance(p.submissionDate, datetime.datetime) else p.submissionDate,
            name=p.name,
            age=p.age,
            gender=p.gender,
            comorbidities=json.loads(p.comorbidities),
            symptoms=json.loads(p.symptoms),
            diagnosticImages=json.loads(p.diagnosticImages) if p.diagnosticImages else None,
            diagnosisData=json.loads(p.diagnosisData) if p.diagnosisData else None
        ))
    return result

@app.post("/api/patients", response_model=Patient)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    # Convert nested objects to JSON strings for SQLite storage
    db_patient = PatientModel(
        id=patient.id,
        submissionDate=datetime.datetime.fromisoformat(patient.submissionDate.replace('Z', '+00:00')),
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        comorbidities=json.dumps(patient.comorbidities),
        symptoms=json.dumps(patient.symptoms),
        diagnosticImages=json.dumps(patient.diagnosticImages) if patient.diagnosticImages else None,
        diagnosisData=json.dumps(patient.diagnosisData) if patient.diagnosisData else None
    )
    
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    
    return patient

from fastapi.responses import FileResponse
import pandas as pd
import os

@app.get("/api/export/excel")
def export_patients_excel(db: Session = Depends(get_db)):
    print("Excel Export Triggered")
    try:
        db_patients = db.query(PatientModel).all()
        print(f"Found {len(db_patients)} patients")
        
        data = []
        for p in db_patients:
            # Flatten the nested structures for Excel
            comorbidities = json.loads(p.comorbidities)
            symptoms = json.loads(p.symptoms)
            diagnosis = json.loads(p.diagnosisData) if p.diagnosisData else {}
            
            flat_record = {
                "Patient ID": p.id,
                "Date": p.submissionDate.isoformat() if isinstance(p.submissionDate, datetime.datetime) else p.submissionDate,
                "Name": p.name,
                "Age": p.age,
                "Gender": p.gender,
                "Risk Level": diagnosis.get("dengueRisk", "N/A"),
                "Platelet Count": diagnosis.get("plateletCount", "N/A"),
                "AI Confidence": diagnosis.get("analysisConfidence", "N/A"),
                "Comorbidities": ", ".join([k for k, v in comorbidities.items() if v]),
                "Symptoms": ", ".join([k for k, v in symptoms.items() if isinstance(v, dict) and v.get("active")]),
                "Recommendation": diagnosis.get("recommendation", "N/A")
            }
            data.append(flat_record)
        
        df = pd.DataFrame(data)
        file_path = "hemovision_patients_master.xlsx"
        print(f"Saving Excel to {file_path}")
        df.to_excel(file_path, index=False)
        print("Excel file saved successfully")
        
        return FileResponse(
            path=file_path, 
            filename="HEMOVISION_Master_Database.xlsx",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        print(f"EXCEL EXPORT ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
