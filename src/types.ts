export type RiskLevel = 'low' | 'moderate' | 'high' | 'emergency';

export interface Symptom {
  id: string;
  name: string;
  category: 'General' | 'Respiratory' | 'Gastrointestinal' | 'Neurological' | 'Cardiovascular' | 'Dermatological' | 'Musculoskeletal';
  severityWeight: number; // 1 to 5 scale
  description: string;
  commonInConditions?: string[];
}

export interface Disease {
  id: string;
  name: string;
  category: string;
  description: string;
  symptoms: string[]; // symptom IDs
  riskLevel: RiskLevel;
  recommendedSpecialist: string;
  precautions: string[];
  safeSelfCare: string[];
  typicalTests: string[];
  redFlagWarning?: string;
  doctorConsultAdvice: string;
}

export interface PatientVitals {
  heartRate: number; // bpm (e.g. 75)
  systolicBp: number; // mmHg (e.g. 120)
  diastolicBp: number; // mmHg (e.g. 80)
  respiratoryRate: number; // breaths/min (e.g. 16)
  temperatureC: number; // Celsius (e.g. 37.0)
  oxygenSaturation: number; // % (e.g. 98)
  bloodGlucose?: number; // mg/dL (e.g. 100)
}

export interface EarlyWarningScore {
  news2Score: number;
  news2Risk: 'Low' | 'Low-Medium' | 'Medium' | 'High';
  qSofaScore: number;
  qSofaRisk: 'Low' | 'High Sepsis Risk';
  flags: string[];
}

export interface PatientProfile {
  ageGroup: 'child' | 'young_adult' | 'adult' | 'senior';
  gender: 'male' | 'female' | 'other';
  durationDays: number;
  severityScale: number; // 1-10
  preExistingConditions: string[];
  isPregnant?: boolean;
  vitals?: PatientVitals;
}

export interface DifferentialMatch {
  disease: Disease;
  probability: number; // 0 to 100
  matchedSymptoms: string[];
  unmatchedSymptoms: string[];
  keyContributingSymptoms: string[];
}

export interface ModelComparisonResult {
  algorithm: 'Random Forest (Ensemble)' | 'Support Vector Machine (RBF)' | 'Multinomial Naive Bayes' | 'K-Nearest Neighbors (k=5)';
  shortName: string;
  predictedDisease: string;
  confidence: number; // 0 - 100
  latencyMs: number;
  matchedFeatureCount: number;
  modelWeight: string;
}

export interface DrugSafetyInfo {
  conditionId: string;
  conditionName: string;
  contraindicatedDrugs: {
    drug: string;
    class: string;
    danger: string;
    severity: 'critical' | 'high' | 'moderate';
  }[];
  safeSupportiveCare: string[];
  clinicalMonitoring: string[];
}

export interface ClinicalVignette {
  id: string;
  title: string;
  subtitle: string;
  patientDemographics: {
    ageGroup: PatientProfile['ageGroup'];
    gender: PatientProfile['gender'];
    durationDays: number;
    severityScale: number;
  };
  symptoms: string[];
  vitals: PatientVitals;
  clinicalNarrative: string;
  expectedDiagnosis: string;
  teachingPoint: string;
}

export interface SavedAssessment {
  id: string;
  savedAt: string; // ISO timestamp
  formattedDate: string;
  customLabel?: string;
  notes?: string;
  result: DiagnosisResult;
}

export interface DiagnosisResult {
  id: string;
  timestamp: string;
  patientProfile: PatientProfile;
  selectedSymptoms: string[];
  primaryDiagnosis: DifferentialMatch;
  differentialDiagnoses: DifferentialMatch[];
  triageLevel: RiskLevel;
  emergencyAlert: boolean;
  emergencyReason?: string;
  aiExplanation?: string;
  earlyWarningScore?: EarlyWarningScore;
  modelComparisons?: ModelComparisonResult[];
  drugSafety?: DrugSafetyInfo;
}

export interface MLModelBenchmark {
  algorithm: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTimeMs: number;
  pros: string;
  cons: string;
  whyAppropriate: string;
}

export interface ConfusionMatrixCell {
  actual: string;
  predicted: string;
  count: number;
  percentage: number;
}

export interface FeatureImportance {
  symptom: string;
  importanceScore: number; // 0.0 - 1.0
  category: string;
}

export interface VivaCard {
  id: string;
  category: 'AI & ML' | 'Algorithms' | 'Metrics' | 'Dataset' | 'System & Implementation' | 'Ethics & Limitations';
  question: string;
  answer: string;
  simpleExplanation: string;
  examinerFollowUp?: string;
}

export interface PresentationSlide {
  id: number;
  title: string;
  subtitle: string;
  bullets: string[];
  speakerNotes: string;
  visualTag: string;
}

export interface CodeFile {
  filename: string;
  language: string;
  description: string;
  code: string;
  lineExplanations: { lineRange: string; explanation: string }[];
}
