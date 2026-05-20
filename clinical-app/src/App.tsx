import { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import PatientForm from './components/PatientForm';
import Dashboard from './components/Dashboard';
import DiagnosticCapture from './components/DiagnosticCapture';
import AnalysisScreen from './components/AnalysisScreen';
import ResultsScreen from './components/ResultsScreen';
import PatientDetail from './components/PatientDetail';
import { clinicalService } from './services/clinicalService';
import type { PatientData } from './types';
import './App.css';

type View = 'welcome' | 'dashboard' | 'form' | 'capture' | 'analyzing' | 'results' | 'detail';

function App() {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [activePatient, setActivePatient] = useState<PatientData | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Simulated Backend on mount
  useEffect(() => {
    async function loadData() {
      const records = await clinicalService.getRecords();
      setPatients(records);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleStart = () => {
    setCurrentView('dashboard');
  };

  const handleFormSubmit = (data: PatientData) => {
    console.log("Intake Complete:", data);
    setActivePatient(data);
    setCurrentView('capture');
  };

  const handleCaptureComplete = (images: { eyes: string; nailbeds: string; hands: string }) => {
    console.log("Biometrics Captured");
    if (activePatient) {
      setActivePatient({
        ...activePatient,
        diagnosticImages: images
      });
      setCurrentView('analyzing');
    }
  };

  const handleAnalysisComplete = (diagnosis: NonNullable<PatientData['diagnosisData']>) => {
    if (activePatient) {
      setActivePatient({
        ...activePatient,
        diagnosisData: diagnosis
      });
      setCurrentView('results');
    }
  };

  const handleSaveRecord = async () => {
    if (activePatient) {
      const success = await clinicalService.saveRecord(activePatient);
      if (success) {
        const records = await clinicalService.getRecords();
        setPatients(records);
        setActivePatient(null);
        setCurrentView('dashboard');
      } else {
        alert("Clinical Database error. Please try again.");
      }
    }
  };

  const handleViewPatientDetail = (patient: PatientData) => {
    setSelectedPatient(patient);
    setCurrentView('detail');
  };

  const handleCancel = () => {
    setActivePatient(null);
    setSelectedPatient(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo" onClick={handleCancel} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">HV</div>
            <span>HEMOVISION AI • CLINICAL TRIAGE</span>
          </div>
          
          <nav>
            <button 
              className={currentView === 'dashboard' || currentView === 'detail' ? 'active' : ''} 
              onClick={handleCancel}
            >
              Patient Dashboard
            </button>
            <button 
              className={currentView === 'form' ? 'active' : ''} 
              onClick={() => setCurrentView('form')}
            >
              Clinical Intake
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div className="logo-icon" style={{ width: '80px', height: '80px', fontSize: '2rem', animation: 'hrPulse 1s infinite' }}>ABC</div>
          </div>
        ) : (
          <>
            {currentView === 'welcome' && (
              <WelcomeScreen onStart={handleStart} />
            )}

            {currentView === 'dashboard' && (
              <Dashboard 
                patients={patients} 
                onAddPatient={() => setCurrentView('form')}
                onSelectPatient={handleViewPatientDetail}
              />
            )}
            
            {currentView === 'form' && (
              <PatientForm 
                onSubmit={handleFormSubmit} 
                onCancel={handleCancel}
              />
            )}

            {currentView === 'capture' && activePatient && (
              <DiagnosticCapture 
                patientData={activePatient}
                onComplete={handleCaptureComplete}
                onCancel={handleCancel}
              />
            )}

            {currentView === 'analyzing' && activePatient && (
              <AnalysisScreen 
                patientData={activePatient}
                onComplete={handleAnalysisComplete}
              />
            )}

            {currentView === 'results' && activePatient && (
              <ResultsScreen 
                patientData={activePatient}
                onSave={handleSaveRecord}
              />
            )}

            {currentView === 'detail' && selectedPatient && (
              <PatientDetail 
                patient={selectedPatient}
                onBack={handleCancel}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
