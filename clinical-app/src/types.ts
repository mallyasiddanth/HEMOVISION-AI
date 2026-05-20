export interface PatientData {
  id: string;
  submissionDate: string;
  name: string;
  age: string;
  gender: string;
  comorbidities: {
    diabetes: boolean;
    hypertension: boolean;
    pcod: boolean;
    ckd: boolean; // Chronic Kidney Disease
    rheumatoidArthritis: boolean;
    asthma: boolean;
  };
  symptoms: {
    fever?: {
      active: boolean;
      startDate: string;
      temperature: string;
    };
    nausea?: {
      active: boolean;
      frequency: string;
    };
    rashes?: {
      active: boolean;
      locations: string;
    };
    headache?: {
      active: boolean;
      severity: string;
    };
    musclePain?: {
      active: boolean;
      bodyParts: string;
    };
    cough?: {
      active: boolean;
      withExpectoration: boolean;
    };
    weakness?: {
      active: boolean;
    };
    other: string;
  };
  diagnosticImages?: {
    eyes?: string;
    nailbeds?: string;
    hands?: string;
  };
  diagnosisData?: {
    dengueRisk: 'Low' | 'Moderate' | 'High';
    plateletCount: number;
    analysisConfidence: number;
    recommendation: string;
    trainingCorrelation?: string; // Shows which training case matched
  };
}
