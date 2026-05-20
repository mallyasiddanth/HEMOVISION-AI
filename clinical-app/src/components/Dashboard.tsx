import React from 'react';
import type { PatientData } from '../types';
import { 
  Users, 
  Calendar, 
  ChevronRight, 
  Plus,
  FileText,
  Clock,
  Shield,
  Activity,
  Download
} from 'lucide-react';
import { clinicalService } from '../services/clinicalService';

interface DashboardProps {
  patients: PatientData[];
  onAddPatient: () => void;
  onSelectPatient: (patient: PatientData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ patients, onAddPatient, onSelectPatient }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'High': return 'var(--hospital-danger)';
      case 'Moderate': return 'var(--hospital-warning)';
      case 'Low': return 'var(--hospital-success)';
      default: return 'var(--accent-cyan)';
    }
  };

  const stats = {
    total: patients.length,
    highRisk: patients.filter(p => p.diagnosisData?.dengueRisk === 'High').length,
    avgConfidence: patients.length > 0 
      ? Math.round(patients.reduce((acc, p) => acc + (p.diagnosisData?.analysisConfidence || 0), 0) / patients.length) 
      : 0,
    latestPlatelets: patients.length > 0 ? [...patients].sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())[0].diagnosisData?.plateletCount : 0
  };

  return (
    <div className="fade-in">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '48px',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '32px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-cyan)', marginBottom: '12px' }}>
            <FileText size={20} />
            <span style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.15em' }}>AI CLINICAL DATABASE</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '2.5rem', letterSpacing: '-0.02em' }}>Patient Overview</h1>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {patients.length > 0 && (
            <button
              onClick={() => clinicalService.downloadExcel()}
              className="hospital-btn hospital-btn-outline"
            >
              <Download size={20} />
              Export Master Excel
            </button>
          )}
          <button
            onClick={onAddPatient}
            className="hospital-btn hospital-btn-primary"
          >
            <Plus size={20} />
            New Clinical Intake
          </button>
        </div>
      </div>

      {patients.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <Users size={20} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)' }}>TOTAL SCANS</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.total}</div>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <Activity size={20} color="var(--hospital-danger)" />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)' }}>HIGH RISK CASES</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stats.highRisk > 0 ? 'var(--hospital-danger)' : 'white' }}>{stats.highRisk}</div>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <Shield size={20} color="var(--hospital-success)" />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)' }}>AVG CONFIDENCE</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.avgConfidence}%</div>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <Clock size={20} color="var(--accent-blue)" />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)' }}>LATEST PLATELETS</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.latestPlatelets?.toLocaleString() || 'N/A'}</div>
          </div>
        </div>
      )}

      {patients.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '120px 40px', 
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(10px)',
          borderRadius: '32px',
          border: '1px dashed var(--glass-border)'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: 'var(--glass-bg)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'var(--accent-cyan)'
          }}>
            <Users size={40} />
          </div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>No Patient Records Found</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 40px', fontSize: '1.1rem' }}>
            The AI clinical database is currently empty. Begin by registering a new patient intake session.
          </p>
          <button
            onClick={onAddPatient}
            className="hospital-btn hospital-btn-outline"
          >
            Create First Clinical Record
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '24px' }}>
          {[...patients].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()).map((patient) => (
            <div 
              key={patient.id}
              className="card"
              onClick={() => onSelectPatient(patient)}
              style={{
                padding: '28px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: `4px solid ${getRiskColor(patient.diagnosisData?.dengueRisk)}`,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.01)';
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.background = 'var(--glass-bg)';
              }}
            >
              <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  background: 'linear-gradient(135deg, rgba(125, 211, 252, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                  borderRadius: '18px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                  fontWeight: 800,
                  fontSize: '1.6rem',
                  border: '1px solid rgba(125, 211, 252, 0.2)'
                }}>
                  {patient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', marginBottom: '6px' }}>{patient.name}</h3>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    <span>{patient.age}Y • {patient.gender.toUpperCase()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="var(--accent-cyan)" />
                      {formatDate(patient.submissionDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '64px' }}>
                {patient.diagnosisData && (
                  <div style={{ textAlign: 'center', minWidth: '160px' }}>
                    <span className="label-text" style={{ marginBottom: '8px' }}>Risk Status</span>
                    <div style={{ 
                      color: 'var(--bg-deep)', 
                      background: getRiskColor(patient.diagnosisData.dengueRisk),
                      padding: '8px 20px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {patient.diagnosisData.dengueRisk}
                    </div>
                  </div>
                )}

                {patient.diagnosisData && (
                  <div style={{ textAlign: 'center', minWidth: '140px' }}>
                    <span className="label-text" style={{ marginBottom: '8px' }}>Platelets</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {patient.diagnosisData.plateletCount.toLocaleString()}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)' }}>
                  <Clock size={20} />
                  <ChevronRight size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
