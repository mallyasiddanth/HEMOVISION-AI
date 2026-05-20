import React from 'react';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Activity, 
  Stethoscope, 
  BrainCircuit, 
  ShieldCheck,
  Download,
  Share2,
  CheckCircle2
} from 'lucide-react';
import type { PatientData } from '../types';
import { clinicalService } from '../services/clinicalService';

interface PatientDetailProps {
  patient: PatientData;
  onBack: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack }) => {
  const diagnosis = patient.diagnosisData;

  const getRiskColor = () => {
    if (!diagnosis) return 'var(--accent-cyan)';
    switch (diagnosis.dengueRisk) {
      case 'High': return 'var(--hospital-danger)';
      case 'Moderate': return 'var(--hospital-warning)';
      case 'Low': return 'var(--hospital-success)';
    }
  };

  return (
    <div className="fade-in">
      {/* HEADER BAR */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '20px'
      }}>
        <button 
          onClick={onBack}
          className="hospital-btn hospital-btn-outline"
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={18} />
          Back to Overview
        </button>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>RECORD ID</div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{patient.id}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* LEFT COLUMN: PRIMARY DATA */}
        <div style={{ display: 'grid', gap: '32px' }}>
          {/* PATIENT IDENTITY CARD */}
          <div className="card" style={{ padding: '32px', display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'linear-gradient(135deg, rgba(125, 211, 252, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(125, 211, 252, 0.2)',
              fontSize: '2rem',
              fontWeight: 800
            }}>
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '2.2rem', letterSpacing: '-0.02em' }}>{patient.name}</h1>
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color="var(--accent-cyan)" />
                  {patient.age}Y • {patient.gender.toUpperCase()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} color="var(--accent-cyan)" />
                  Registered: {new Date(patient.submissionDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* AI DIAGNOSTIC INSIGHTS */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ 
              background: `linear-gradient(90deg, ${getRiskColor()} 0%, rgba(30, 58, 138, 0.4) 100%)`, 
              padding: '24px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white', letterSpacing: '0.1em' }}>AI LONGITUDINAL NEURAL STATUS (COMBINED 2014-2016)</span>
                <h3 style={{ margin: '4px 0 0', color: 'white', fontSize: '1.4rem' }}>{diagnosis?.dengueRisk} Risk Profile</h3>
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '8px 20px', 
                borderRadius: '12px', 
                fontWeight: 800,
                color: 'white',
                backdropFilter: 'blur(4px)'
              }}>
                {diagnosis?.analysisConfidence}% CONFIDENCE
              </div>
            </div>
            
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                  <div className="label-text">Platelet Count Estimation</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>{diagnosis?.plateletCount.toLocaleString()}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>CELLS PER MICROLITER</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                  <div className="label-text">Training Correlation</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '8px' }}>{diagnosis?.trainingCorrelation}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: 'var(--hospital-success)', fontSize: '0.85rem', fontWeight: 700 }}>
                    <ShieldCheck size={16} />
                    Verified Pattern Match
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 16px', color: 'white' }}>
                  <Activity size={18} color="var(--accent-cyan)" />
                  Clinical Recommendations
                </h4>
                <div style={{ 
                  padding: '20px', 
                  background: 'rgba(15, 23, 42, 0.4)', 
                  borderRadius: '16px', 
                  border: '1px solid var(--glass-border)',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)'
                }}>
                  {diagnosis?.recommendation}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CLINICAL INDICATORS & BIOMETRICS */}
        <div style={{ display: 'grid', gap: '32px' }}>
          {/* BIOMETRICS CARD */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BrainCircuit size={20} color="var(--accent-cyan)" />
              Biometric Data
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <span className="label-text" style={{ fontSize: '0.65rem' }}>Ocular Neural Scan</span>
                <div style={{ 
                  aspectRatio: '16/9', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid var(--glass-border)',
                  position: 'relative'
                }}>
                  <img src={patient.diagnosticImages?.eyes} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Eye Scan" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }} />
                </div>
              </div>
              <div>
                <span className="label-text" style={{ fontSize: '0.65rem' }}>Nailbed Capillary Map</span>
                <div style={{ 
                  aspectRatio: '16/9', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid var(--glass-border)',
                  position: 'relative'
                }}>
                  <img src={patient.diagnosticImages?.nailbeds} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Nailbed Scan" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }} />
                </div>
              </div>
              {patient.diagnosticImages?.hands && (
                <div>
                  <span className="label-text" style={{ fontSize: '0.65rem' }}>Palmar Surface Scan</span>
                  <div style={{ 
                    aspectRatio: '16/9', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    border: '1px solid var(--glass-border)',
                    position: 'relative'
                  }}>
                    <img src={patient.diagnosticImages?.hands} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Hand Scan" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MEDICAL HISTORY CARD */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Stethoscope size={20} color="var(--accent-cyan)" />
              Clinical History
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <span className="label-text" style={{ fontSize: '0.65rem', marginBottom: '8px' }}>COMORBIDITIES</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(patient.comorbidities).filter(([_, v]) => v).map(([k]) => (
                    <span key={k} style={{ 
                      padding: '4px 12px', 
                      background: 'rgba(125, 211, 252, 0.1)', 
                      border: '1px solid rgba(125, 211, 252, 0.2)', 
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--accent-cyan)',
                      textTransform: 'uppercase'
                    }}>
                      {k.replace(/([A-Z])/g, ' $1')}
                    </span>
                  )) || <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>None Reported</span>}
                </div>
              </div>
              
              <div style={{ marginTop: '12px' }}>
                <span className="label-text" style={{ fontSize: '0.65rem', marginBottom: '8px' }}>REPORTED SYMPTOMS</span>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {Object.entries(patient.symptoms).filter(([_k, v]) => typeof v === 'object' && v?.active).map(([k]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '0.9rem' }}>
                      <CheckCircle2 size={14} color="var(--accent-cyan)" />
                      <span style={{ textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'grid', gap: '12px' }}>
              <button 
                className="hospital-btn hospital-btn-primary" 
                style={{ width: '100%' }}
                onClick={() => clinicalService.exportReport(patient)}
              >
                <Download size={18} />
                Export Full EHR
              </button>
              <button 
                className="hospital-btn hospital-btn-outline" 
                style={{ width: '100%' }}
                onClick={() => clinicalService.shareReport(patient)}
              >
                <Share2 size={18} />
                Secure Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
