import React from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Share2, 
  Download, 
  Home,
  FileText,
  Activity,
  User,
  ShieldCheck,
  BrainCircuit,
  Stethoscope
} from 'lucide-react';
import { clinicalService } from '../services/clinicalService';
import type { PatientData } from '../types';

interface ResultsScreenProps {
  patientData: PatientData;
  onSave: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ patientData, onSave }) => {
  const diagnosis = patientData.diagnosisData!;

  const getRiskColor = () => {
    switch (diagnosis.dengueRisk) {
      case 'High': return 'var(--hospital-danger)';
      case 'Moderate': return 'var(--hospital-warning)';
      case 'Low': return 'var(--hospital-success)';
    }
  };

  const getRiskIcon = () => {
    switch (diagnosis.dengueRisk) {
      case 'High': return <AlertTriangle size={48} />;
      case 'Moderate': return <Info size={48} />;
      case 'Low': return <CheckCircle size={48} />;
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.4)' }}>
        {/* REPORT HEADER */}
        <div style={{ 
          background: `linear-gradient(135deg, ${getRiskColor()} 0%, var(--bg-deep) 150%)`, 
          color: 'white', 
          padding: '64px',
          textAlign: 'center',
          position: 'relative',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          <div style={{ position: 'absolute', top: '32px', right: '32px', opacity: 0.1 }}>
            <FileText size={160} />
          </div>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center', color: 'white' }}>
            <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', backdropFilter: 'blur(8px)' }}>
              {getRiskIcon()}
            </div>
          </div>
          <h1 style={{ margin: 0, fontSize: '3rem', color: 'white', letterSpacing: '-0.03em' }}>Risk Assessment: {diagnosis.dengueRisk}</h1>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '10px', 
            marginTop: '20px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: '8px 24px',
            borderRadius: '30px',
            fontSize: '0.95rem',
            fontWeight: 700,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <ShieldCheck size={18} color="var(--accent-cyan)" />
            AI VERIFIED ANALYSIS • {diagnosis.analysisConfidence}% CONFIDENCE
          </div>
        </div>

        {/* REPORT BODY */}
        <div style={{ padding: '56px' }}>
          {/* AI TRAINING CORRELATION ALERT */}
          <div style={{ 
            marginBottom: '40px', 
            padding: '16px 24px', 
            background: 'rgba(125, 211, 252, 0.1)', 
            border: '1px solid rgba(125, 211, 252, 0.2)', 
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <BrainCircuit color="var(--accent-cyan)" size={24} />
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>AI TRAINING DATA CORRELATION</div>
              <div style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{diagnosis.trainingCorrelation}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', marginBottom: '56px' }}>
            {/* PLATELET CARD */}
            <div style={{ 
              background: 'var(--glass-bg)', 
              padding: '40px', 
              borderRadius: '24px', 
              textAlign: 'center',
              border: '1px solid var(--glass-border)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
            }}>
              <span className="label-text">Estimated Platelet Count</span>
              <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'white', margin: '16px 0', letterSpacing: '-0.04em' }}>
                {diagnosis.plateletCount.toLocaleString()}
              </div>
              <div style={{ 
                display: 'inline-block',
                padding: '8px 24px',
                borderRadius: '14px',
                fontSize: '0.9rem',
                fontWeight: 900,
                letterSpacing: '0.05em',
                color: 'var(--bg-deep)',
                backgroundColor: diagnosis.plateletCount < 100000 ? 'var(--hospital-danger)' : (diagnosis.plateletCount < 150000 ? 'var(--hospital-warning)' : 'var(--hospital-success)'),
                boxShadow: '0 0 20px rgba(0,0,0,0.2)'
              }}>
                {diagnosis.plateletCount < 100000 ? 'CRITICAL THRESHOLD' : (diagnosis.plateletCount < 150000 ? 'LOW RANGE' : 'NORMAL PHYSIOLOGICAL RANGE')}
              </div>
            </div>

            {/* PATIENT SUMMARY */}
            <div style={{ padding: '10px' }}>
              <div className="section-header">
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Clinical Profile</h3>
              </div>
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                    <User size={22} />
                  </div>
                  <div>
                    <div className="label-text" style={{ marginBottom: '4px', fontSize: '0.7rem' }}>Subject Name</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{patientData.name}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                    <Stethoscope size={22} />
                  </div>
                  <div>
                    <div className="label-text" style={{ marginBottom: '4px', fontSize: '0.7rem' }}>Comorbidities</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {Object.entries(patientData.comorbidities).filter(([_, v]) => v).map(([k, _]) => k.replace(/([A-Z])/g, ' $1')).join(', ') || 'None Reported'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RECOMMENDATIONS */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(125, 211, 252, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={18} color="var(--accent-cyan)" />
              </div>
              AI Triage Recommendations
            </h3>
            <div style={{ 
              padding: '32px', 
              borderRadius: '24px', 
              border: '1px solid var(--glass-border)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              lineHeight: 1.8,
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
            }}>
              {diagnosis.recommendation}
            </div>
          </div>

          {/* ACTION BAR */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={onSave}
              className="hospital-btn hospital-btn-primary"
              style={{ flex: 2, height: '64px', fontSize: '1.1rem' }}
            >
              <Home size={22} />
              Finalize & Sync Records
            </button>
            <button
              onClick={() => clinicalService.exportReport(patientData)}
              className="hospital-btn hospital-btn-outline"
              style={{ flex: 1, height: '64px' }}
            >
              <Download size={22} />
              Export Data
            </button>
            <button
              onClick={() => clinicalService.shareReport(patientData)}
              className="hospital-btn hospital-btn-outline"
              style={{ flex: 1, height: '64px' }}
            >
              <Share2 size={22} />
              Secure Share
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '48px', opacity: 0.5, letterSpacing: '0.05em' }}>
        <p>© 2026 HEMOVISION AI • CLINICAL DIAGNOSTIC PROTOCOL v5.0.0 <br />
        ENCRYPTED END-TO-END • CLINICAL DATASET TRAINED</p>
      </div>
    </div>
  );
};

export default ResultsScreen;
