import React, { useState } from 'react';
import {
  ClipboardList,
  ChevronRight,
  X,
  CheckCircle2,
  Circle,
  User
} from 'lucide-react';
import type { PatientData } from '../types';

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Omit<PatientData, 'id' | 'submissionDate'>>({
    name: '',
    age: '',
    gender: 'male',
    comorbidities: {
      diabetes: false,
      hypertension: false,
      pcod: false,
      ckd: false,
      rheumatoidArthritis: false,
      asthma: false
    },
    symptoms: {
      fever: { active: false, startDate: '', temperature: '' },
      nausea: { active: false, frequency: '' },
      rashes: { active: false, locations: '' },
      headache: { active: false, severity: 'mild' },
      musclePain: { active: false, bodyParts: '' },
      cough: { active: false, withExpectoration: false },
      weakness: { active: false },
      other: ''
    }
  });

  const [formStep, setFormStep] = useState<'basic' | 'history' | 'symptoms'>('basic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formStep === 'basic') {
      setFormStep('history');
    } else if (formStep === 'history') {
      setFormStep('symptoms');
    } else {
      const safeId = () => {
        try {
          if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
          }
        } catch (e) {}
        return 'p-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
      };

      const fullData: PatientData = {
        ...formData,
        id: safeId(),
        submissionDate: new Date().toISOString()
      };
      onSubmit(fullData);
    }
  };

  const toggleSymptom = (key: keyof Omit<PatientData['symptoms'], 'other'>) => {
    setFormData(prev => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [key]: { ...prev.symptoms[key], active: !prev.symptoms[key]?.active }
      }
    }));
  };

  const toggleComorbidity = (key: keyof PatientData['comorbidities']) => {
    setFormData(prev => ({
      ...prev,
      comorbidities: {
        ...prev.comorbidities,
        [key]: !prev.comorbidities[key]
      }
    }));
  };

  return (
    <div className="card fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="logo-icon">
            <ClipboardList size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Clinical Intake Form</h2>
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 800, letterSpacing: '0.1em' }}>PROTOCOL AI-v4</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{ 
                    width: '20px', 
                    height: '4px', 
                    borderRadius: '2px', 
                    backgroundColor: (s === 1 && formStep === 'basic') || (s === 2 && formStep === 'history') || (s === 3 && formStep === 'symptoms') ? 'var(--accent-cyan)' : 'var(--glass-border)' 
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <X size={28} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {formStep === 'basic' ? (
          <div className="fade-in">
            <div className="section-header">
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>1. Patient Identification</h3>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <label className="label-text">Full Legal Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '20px', top: '16px', color: 'var(--accent-cyan)' }} />
                <input
                  type="text"
                  style={{ paddingLeft: '56px' }}
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label className="label-text">Age</label>
                <input
                  type="number"
                  placeholder="Years"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label-text">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button type="submit" className="hospital-btn hospital-btn-primary" style={{ marginTop: '56px', width: '100%', height: '64px' }}>
              Next: Medical History
              <ChevronRight size={20} />
            </button>
          </div>
        ) : formStep === 'history' ? (
          <div className="fade-in">
            <div className="section-header">
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>2. Medical History & Risk Factors</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              {(Object.keys(formData.comorbidities) as Array<keyof PatientData['comorbidities']>).map(key => (
                <div 
                  key={key}
                  onClick={() => toggleComorbidity(key)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: `1px solid ${formData.comorbidities[key] ? 'var(--accent-cyan)' : 'var(--glass-border)'}`,
                    background: formData.comorbidities[key] ? 'rgba(125, 211, 252, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s'
                  }}
                >
                  {formData.comorbidities[key] ? <CheckCircle2 size={18} color="var(--accent-cyan)" /> : <Circle size={18} color="var(--glass-border)" />}
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <button type="button" onClick={() => setFormStep('basic')} className="hospital-btn hospital-btn-outline" style={{ flex: 1, height: '60px' }}>Back</button>
              <button type="submit" className="hospital-btn hospital-btn-primary" style={{ flex: 2, height: '60px' }}>
                Next: Current Symptoms
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="fade-in">
            <div className="section-header">
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>3. Current Symptom Analysis</h3>
            </div>
            
            <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
              {(['fever', 'nausea', 'rashes', 'headache', 'musclePain', 'cough', 'weakness'] as const).map((k) => {
                const isActive = formData.symptoms[k]?.active;
                return (
                  <div key={k}>
                    <div 
                      onClick={() => toggleSymptom(k)}
                      style={{
                        padding: '16px 24px',
                        borderRadius: '12px',
                        border: `1px solid ${isActive ? 'var(--accent-cyan)' : 'var(--glass-border)'}`,
                        background: isActive ? 'rgba(125, 211, 252, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                      {isActive ? <CheckCircle2 color="var(--accent-cyan)" size={22} /> : <Circle color="var(--glass-border)" size={22} />}
                    </div>

                    {isActive && (
                      <div style={{ 
                        marginTop: '12px', 
                        padding: '20px 24px', 
                        background: 'rgba(15, 23, 42, 0.4)', 
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                        marginLeft: '16px',
                        animation: 'fadeIn 0.3s ease-out'
                      }}>
                        {k === 'fever' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label className="label-text">Onset Date</label>
                              <input type="date" value={formData.symptoms.fever?.startDate} onChange={e => setFormData({...formData, symptoms: {...formData.symptoms, fever: {...formData.symptoms.fever!, startDate: e.target.value}}})} />
                            </div>
                            <div>
                              <label className="label-text">Max Temp (°C)</label>
                              <input type="text" placeholder="e.g. 38.5" value={formData.symptoms.fever?.temperature} onChange={e => setFormData({...formData, symptoms: {...formData.symptoms, fever: {...formData.symptoms.fever!, temperature: e.target.value}}})} />
                            </div>
                          </div>
                        )}
                        {k === 'nausea' && (
                          <div>
                            <label className="label-text">Frequency</label>
                            <select value={formData.symptoms.nausea?.frequency} onChange={e => setFormData({...formData, symptoms: {...formData.symptoms, nausea: {...formData.symptoms.nausea!, frequency: e.target.value}}})}>
                              <option value="">Select Level</option>
                              <option value="occasional">Occasional</option>
                              <option value="frequent">Frequent</option>
                              <option value="constant">Constant</option>
                            </select>
                          </div>
                        )}
                        {k === 'rashes' && (
                          <div>
                            <label className="label-text">Locations</label>
                            <input type="text" placeholder="e.g. Trunk, Extremities" value={formData.symptoms.rashes?.locations} onChange={e => setFormData({...formData, symptoms: {...formData.symptoms, rashes: {...formData.symptoms.rashes!, locations: e.target.value}}})} />
                          </div>
                        )}
                        {k === 'headache' && (
                          <div>
                            <label className="label-text">Severity</label>
                            <select value={formData.symptoms.headache?.severity} onChange={e => setFormData({...formData, symptoms: {...formData.symptoms, headache: {...formData.symptoms.headache!, severity: e.target.value}}})}>
                              <option value="mild">Mild</option>
                              <option value="moderate">Moderate</option>
                              <option value="severe">Severe</option>
                            </select>
                          </div>
                        )}
                        {k === 'musclePain' && (
                          <div>
                            <label className="label-text">Body Parts</label>
                            <input type="text" placeholder="e.g. Lower Back, Thighs" value={formData.symptoms.musclePain?.bodyParts} onChange={e => setFormData({...formData, symptoms: {...formData.symptoms, musclePain: {...formData.symptoms.musclePain!, bodyParts: e.target.value}}})} />
                          </div>
                        )}
                        {k === 'cough' && (
                          <div 
                            onClick={() => setFormData({...formData, symptoms: {...formData.symptoms, cough: {...formData.symptoms.cough!, withExpectoration: !formData.symptoms.cough?.withExpectoration}}})}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                          >
                            {formData.symptoms.cough?.withExpectoration ? <CheckCircle2 size={18} color="var(--accent-cyan)" /> : <Circle size={18} color="var(--glass-border)" />}
                            <span style={{ fontSize: '0.9rem' }}>Associated with Expectoration (Sputum)</span>
                          </div>
                        )}
                        {k === 'weakness' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <CheckCircle2 size={18} color="var(--accent-cyan)" />
                            <span>Generalized clinical weakness reported</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <label className="label-text">Chief Complaints / Clinical Notes</label>
            <textarea
              style={{ minHeight: '100px' }}
              placeholder="Paste raw clinical notes here for AI processing..."
              value={formData.symptoms.other}
              onChange={e => setFormData({ ...formData, symptoms: { ...formData.symptoms, other: e.target.value } })}
            />

            <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
              <button type="button" onClick={() => setFormStep('history')} className="hospital-btn hospital-btn-outline" style={{ flex: 1, height: '60px' }}>Back</button>
              <button type="submit" className="hospital-btn hospital-btn-primary" style={{ flex: 2, height: '60px' }}>
                Complete Intake & Scan
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </form>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default PatientForm;
