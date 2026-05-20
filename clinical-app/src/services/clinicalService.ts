import type { PatientData } from '../types';

// Use the same protocol as the frontend (http or https)
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8000/api`;

/**
 * Clinical Backend Service
 * Handles data persistence and secure retrieval of patient EHR (Electronic Health Records)
 * via the Python FastAPI backend.
 */
export const clinicalService = {
  /**
   * Retrieves all patient records from the FastAPI/SQLite backend
   */
  async getRecords(): Promise<PatientData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (e) {
      console.error("Backend Fetch Error:", e);
      return [];
    }
  },

  /**
   * Persists a new clinical intake record to the backend database
   */
  async saveRecord(patient: PatientData): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patient),
      });
      return response.ok;
    } catch (e) {
      console.error("Backend Save Error:", e);
      return false;
    }
  },

  /**
   * Generates a secure clinical report for export (Client-side)
   */
  exportReport(patient: PatientData): void {
    const diagnosis = patient.diagnosisData;
    if (!diagnosis) return;

    const reportContent = `
================================================================================
                                HEMOVISION AI
                        OFFICIAL DIAGNOSTIC REPORT
================================================================================

PATIENT INFORMATION:
-------------------
Record ID:      ${patient.id}
Full Name:      ${patient.name}
Age/Gender:     ${patient.age}Y / ${patient.gender.toUpperCase()}
Timestamp:      ${new Date(patient.submissionDate).toLocaleString()}

CLINICAL INDICATORS:
-------------------
Comorbidities:  ${Object.entries(patient.comorbidities).filter(([_, v]) => v).map(([k]) => k.replace(/([A-Z])/g, ' $1').toUpperCase()).join(', ') || 'NONE REPORTED'}
Symptoms:       ${Object.entries(patient.symptoms).filter(([_k, v]) => typeof v === 'object' && (v as any)?.active).map(([k]) => k.toUpperCase()).join(', ')}

AI DIAGNOSTIC INFERENCE:
-----------------------
Dengue Risk:    ${diagnosis.dengueRisk.toUpperCase()}
Est. Platelets: ${diagnosis.plateletCount.toLocaleString()} cells/mcL
Confidence:     ${diagnosis.analysisConfidence}%
Correlation:    ${diagnosis.trainingCorrelation}

TRIAGE RECOMMENDATIONS:
----------------------
${diagnosis.recommendation}

--------------------------------------------------------------------------------
DISCLAIMER: THIS IS AN AI-GENERATED TRIAGE REPORT.
VERIFIED BY: HEMOVISION-V5.0 PROTOCOL
================================================================================
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EHR_REPORT_${patient.name.replace(/\s+/g, '_')}_${patient.id.slice(0, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Downloads the complete patient database as an Excel file
   */
  async downloadExcel(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/export/excel`);
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "HEMOVISION_Master_Database.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (e) {
      console.error("Excel Export Error:", e);
      alert("Failed to generate Excel export.");
    }
  },

  /**
   * Securely shares report summary via Web Share API (Client-side)
   */
  async shareReport(patient: PatientData): Promise<void> {
    const diagnosis = patient.diagnosisData;
    if (!diagnosis) return;

    const shareText = `HEMOVISION AI Clinical Report - Patient: ${patient.name}. Risk: ${diagnosis.dengueRisk}. Platelets: ${diagnosis.plateletCount.toLocaleString()}. Verified by AI.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Clinical Diagnostic Report',
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        console.error("Sharing failed", err);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Report summary copied to secure clipboard.");
    }
  }
};
