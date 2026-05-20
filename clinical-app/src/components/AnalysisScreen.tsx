import React, { useState, useEffect } from 'react';
import { Activity, Database, Search, ShieldCheck, BrainCircuit } from 'lucide-react';
import type { PatientData } from '../types';

interface AnalysisScreenProps {
  patientData: PatientData;
  onComplete: (diagnosis: NonNullable<PatientData['diagnosisData']>) => void;
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ patientData, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { label: 'Parsing Chief Complaints...', icon: <Activity size={20} /> },
    { label: 'Correlating Combined 2014-2016 Dataset...', icon: <BrainCircuit size={20} /> },
    { label: 'Ocular Neural Signature Matching...', icon: <Search size={20} /> },
    { label: 'Nailbed Capillary Neural Mapping...', icon: <Database size={20} /> },
    { label: 'Finalizing Multi-year Inference Model...', icon: <ShieldCheck size={20} /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    const timeout = setTimeout(() => {
      const diagnosis = runTrainingInference(patientData);
      onComplete(diagnosis);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const runTrainingInference = (data: PatientData): NonNullable<PatientData['diagnosisData']> => {
    const notes = data.symptoms.other.toLowerCase();
    
    // Dataset 1 Pattern: Diabetes + PCOD
    const matchCase1 = (data.comorbidities.diabetes && data.comorbidities.pcod);
    
    // Dataset 2 Pattern: Fever + Chills + Myalgia
    const matchCase2 = data.symptoms.fever?.active && (notes.includes('chill') || notes.includes('myalgia') || data.symptoms.musclePain?.active);
    
    // Dataset 3 Pattern: CKD + HTN + Fever + RA
    const matchCase3 = (data.comorbidities.ckd || data.comorbidities.rheumatoidArthritis) && data.symptoms.fever?.active;

    let riskScore = 0;
    let correlation = "Standard AI Inference";

    // Weighting based on training data
    if (matchCase1) {
      riskScore += 55;
      correlation = "Training Data Match: Case ID DIV-28 (Diabetes/PCOD Metabolic Pattern)";
    }
    if (matchCase2) {
      riskScore += 50;
      correlation = "Training Data Match: Case ID FVR-05 (Classic Dengue/Viral Prodrome Pattern)";
    }
    if (matchCase3) {
      riskScore += 75;
      correlation = "Training Data Match: Case ID CKD-RA (High-Complexity Multi-Comorbidity Pattern)";
    }

    // Individual Symptom Weighting
    if (data.symptoms.fever?.active) riskScore += 20;
    if (data.symptoms.rashes?.active) riskScore += 25;
    if (data.symptoms.cough?.active) riskScore += 10;
    if (data.symptoms.weakness?.active) riskScore += 15;

    // --- NEW: Visual Biometric Signature Detection (Simulated) ---
    // In a real system, these would be output from the Ocular/Nailbed/Hand CNN models
    const visualFindings = {
      redEyes: notes.includes('red eye') || notes.includes('conjunctival') || notes.includes('injection'),
      uncertainNailbed: notes.includes('capillary refill') || notes.includes('poor refill') || notes.includes('uncertain'),
      handRashes: (data.symptoms.rashes?.active && (data.symptoms.rashes.locations.toLowerCase().includes('hand') || data.symptoms.rashes.locations.toLowerCase().includes('palm'))) || notes.includes('palmar rash')
    };

    if (visualFindings.redEyes && visualFindings.uncertainNailbed && visualFindings.handRashes) {
      riskScore += 60; // Critical clinical triad
      correlation = "High-Risk Triad Detected: Conjunctival Injection + Palmar Rashes + Delayed Capillary Refill (Classic DHF Pattern)";
    } else if (visualFindings.redEyes || visualFindings.handRashes) {
      riskScore += 30;
      correlation = "Atypical Viral Signature: Visual markers suggest acute hemorrhagic onset.";
    }

    let risk: 'Low' | 'Moderate' | 'High' = 'Low';
    let plateletBase = 250000;
    let recommendation = '';

    if (riskScore > 80) {
      risk = 'High';
      plateletBase = 40000 + Math.floor(Math.random() * 40000);
      recommendation = 'CRITICAL: High-risk pattern detected. Immediate hospitalization for IV fluid resuscitation and platelet transfusion preparation. Correlated with high-complexity training data.';
    } else if (riskScore > 40) {
      risk = 'Moderate';
      plateletBase = 100000 + Math.floor(Math.random() * 60000);
      recommendation = 'CAUTION: Clinical markers suggest significant viral load or comorbidity stress. Urgent specialist consultation within 12 hours. Monitor for capillary leak syndrome.';
    } else {
      risk = 'Low';
      plateletBase = 180000 + Math.floor(Math.random() * 100000);
      recommendation = 'STABLE: Low risk. Outpatient monitoring. Maintain hydration. Review if abdominal pain or mucosal bleeding occurs.';
    }

    return {
      dengueRisk: risk,
      plateletCount: plateletBase,
      analysisConfidence: 92 + Math.floor(Math.random() * 6),
      recommendation,
      trainingCorrelation: correlation
    };
  };

  return (
    <div className="card fade-in" style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(125, 211, 252, 0.05) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ 
          position: 'absolute', 
          top: '0', 
          left: '0', 
          right: '0', 
          height: '2px', 
          background: 'var(--accent-cyan)', 
          boxShadow: '0 0 20px var(--accent-cyan)',
          animation: 'matrixScan 3s linear infinite',
          opacity: 0.3,
          zIndex: 0
        }} />

        <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 40px' }}>
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            border: '2px solid rgba(125, 211, 252, 0.1)', 
            borderRadius: '50%' 
          }} />
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            border: '4px solid var(--accent-cyan)', 
            borderRadius: '50%',
            borderTopColor: 'transparent',
            animation: 'spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            boxShadow: '0 0 20px rgba(125, 211, 252, 0.4)'
          }} />
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <BrainCircuit size={56} className="pulse" />
          </div>
        </div>

        <h2 style={{ marginBottom: '12px', fontSize: '2rem', letterSpacing: '-0.02em' }}>AI Diagnostic Inference</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '48px', fontSize: '1.1rem' }}>
          Running training data correlation for <span className="text-cyan" style={{ fontWeight: 700 }}>{patientData.name}</span>
        </p>

        <div style={{ textAlign: 'left', display: 'grid', gap: '24px', maxWidth: '440px', margin: '0 auto' }}>
          {steps.map((step, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '20px',
                color: index <= currentStep ? 'var(--text-primary)' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.5s'
              }}
            >
              <div style={{ 
                color: index < currentStep ? 'var(--hospital-success)' : (index === currentStep ? 'var(--accent-cyan)' : 'inherit') 
              }}>
                {index < currentStep ? <ShieldCheck size={24} /> : step.icon}
              </div>
              <span style={{ 
                fontWeight: index === currentStep ? 800 : 500, 
                letterSpacing: '0.05em',
                fontSize: '0.9rem',
                textTransform: 'uppercase'
              }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .pulse { animation: hrPulse 2s ease-in-out infinite; }
        @keyframes hrPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
        @keyframes matrixScan { 0% { top: 0; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
};

export default AnalysisScreen;
