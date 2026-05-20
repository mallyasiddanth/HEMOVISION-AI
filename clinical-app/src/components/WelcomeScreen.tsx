import React from 'react';
import { Shield, Brain, Activity, ArrowRight, Heart, FlaskConical } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      textAlign: 'center',
      padding: '0 20px'
    }}>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(125, 211, 252, 0.08) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      <div className="logo-icon" style={{ 
        width: '100px', 
        height: '100px', 
        fontSize: '2.5rem', 
        marginBottom: '40px',
        animation: 'hrPulse 2s ease-in-out infinite'
      }}>
        ABC
      </div>

      <h1 style={{ 
        fontSize: '4rem', 
        letterSpacing: '-0.04em', 
        marginBottom: '24px',
        lineHeight: 1.1,
        background: 'linear-gradient(to right, #fff 0%, var(--accent-cyan) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Precision Diagnostics <br /> Powered by AI
      </h1>

      <p style={{ 
        fontSize: '1.4rem', 
        color: 'var(--text-secondary)', 
        maxWidth: '700px', 
        marginBottom: '64px',
        lineHeight: 1.6
      }}>
        Next-generation clinical triage protocol integrating longitudinal multi-year datasets 
        for rapid Dengue risk assessment and biometric analysis.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', maxWidth: '1000px', marginBottom: '80px' }}>
        <div className="card" style={{ padding: '32px', textAlign: 'left', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ color: 'var(--accent-cyan)', marginBottom: '16px' }}>
            <Brain size={32} />
          </div>
          <h3 style={{ margin: '0 0 12px', fontSize: '1.2rem' }}>Neural Mapping</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Advanced ocular and capillary scanning for objective clinical indicators.</p>
        </div>
        <div className="card" style={{ padding: '32px', textAlign: 'left', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ color: 'var(--accent-cyan)', marginBottom: '16px' }}>
            <FlaskConical size={32} />
          </div>
          <h3 style={{ margin: '0 0 12px', fontSize: '1.2rem' }}>Dataset Correlation</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Pattern matching against 2014-2016 verified hospital clinical records.</p>
        </div>
        <div className="card" style={{ padding: '32px', textAlign: 'left', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ color: 'var(--accent-cyan)', marginBottom: '16px' }}>
            <Shield size={32} />
          </div>
          <h3 style={{ margin: '0 0 12px', fontSize: '1.2rem' }}>EHR Security</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>End-to-end encrypted medical record management and secure sharing.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        <button 
          onClick={onStart}
          className="hospital-btn hospital-btn-primary"
          style={{ padding: '20px 48px', fontSize: '1.2rem' }}
        >
          Initialize Clinical System
          <ArrowRight size={24} />
        </button>
      </div>

      <div style={{ marginTop: '80px', display: 'flex', gap: '32px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} />
          SYSTEM LIVE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={16} />
          HEMOVISION v5.0
        </div>
      </div>

      <style>{`
        @keyframes hrPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.9; } }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
