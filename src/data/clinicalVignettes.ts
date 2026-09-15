import { ClinicalVignette } from '../types';

export const CLINICAL_CASE_VIGNETTES: ClinicalVignette[] = [
  {
    id: 'case_cardiac_emergency',
    title: 'Case 1: Acute Coronary Syndrome',
    subtitle: '58-Year-Old Male with Acute Retrosternal Pressure',
    patientDemographics: {
      ageGroup: 'adult',
      gender: 'male',
      durationDays: 1,
      severityScale: 9
    },
    symptoms: ['chest_pain', 'shortness_of_breath', 'sweating', 'palpitations', 'nausea'],
    vitals: {
      heartRate: 118,
      systolicBp: 88,
      diastolicBp: 58,
      respiratoryRate: 24,
      temperatureC: 36.6,
      oxygenSaturation: 91,
      bloodGlucose: 142
    },
    clinicalNarrative: 'Patient arrived with severe substernal squeezing chest pressure radiating to the left arm and jaw of 2 hours duration. Accompanied by marked diaphoresis, dyspnea, and lightheadedness. Hypotension and tachycardia noted on presentation.',
    expectedDiagnosis: 'Acute Coronary Syndrome / Angina Pectoris',
    teachingPoint: 'Critical emergency red-flag triage: Crushing chest pain combined with hypotension and diaphoresis must bypass outpatient consultation for immediate cardiac catheterization lab activation (Door-to-Balloon target < 90 mins).'
  },
  {
    id: 'case_appendicitis',
    title: 'Case 2: Acute Appendicitis',
    subtitle: '22-Year-Old Female with Migrating Abdominal Pain',
    patientDemographics: {
      ageGroup: 'young_adult',
      gender: 'female',
      durationDays: 1,
      severityScale: 8
    },
    symptoms: ['sharp_right_lower_pain', 'nausea', 'vomiting', 'mild_fever', 'loss_of_appetite'],
    vitals: {
      heartRate: 104,
      systolicBp: 114,
      diastolicBp: 74,
      respiratoryRate: 18,
      temperatureC: 38.4,
      oxygenSaturation: 98,
      bloodGlucose: 98
    },
    clinicalNarrative: 'Patient reports dull visceral cramping that began periumbilically 18 hours ago and migrated sharply to the right lower quadrant (McBurney point). Associated with marked anorexia, nausea, and low-grade pyrexia.',
    expectedDiagnosis: 'Acute Appendicitis',
    teachingPoint: 'Surgical emergency triage: Stimulant laxatives and heating pads are strictly contraindicated to avoid triggering appendiceal perforation. Patient should remain strictly NPO pending surgical ultrasound.'
  },
  {
    id: 'case_asthma_exacerbation',
    title: 'Case 3: Severe Bronchial Asthma Exacerbation',
    subtitle: '19-Year-Old Young Adult with Wheezing and Tachypnea',
    patientDemographics: {
      ageGroup: 'young_adult',
      gender: 'female',
      durationDays: 2,
      severityScale: 7
    },
    symptoms: ['wheezing', 'shortness_of_breath', 'chest_tightness', 'cough'],
    vitals: {
      heartRate: 112,
      systolicBp: 126,
      diastolicBp: 82,
      respiratoryRate: 26,
      temperatureC: 37.0,
      oxygenSaturation: 93,
      bloodGlucose: 102
    },
    clinicalNarrative: 'Known asthmatic presents with acute breathlessness following pollen exposure. Audible expiratory wheezes bilaterally, speaking in fragmented phrases, with supraclavicular retractions.',
    expectedDiagnosis: 'Bronchial Asthma (Exacerbation)',
    teachingPoint: 'Respiratory triage: High respiratory rate (26/min) and oxygen desaturation (93%) warrant immediate nebulized SABA therapy and systemic steroids. Beta-blockers and NSAIDs are strictly contraindicated.'
  },
  {
    id: 'case_dengue_fever',
    title: 'Case 4: Dengue Hemorrhagic Fever Presentation',
    subtitle: '31-Year-Old Male with Breakbone Pain and Rash',
    patientDemographics: {
      ageGroup: 'adult',
      gender: 'male',
      durationDays: 4,
      severityScale: 8
    },
    symptoms: ['fever', 'headache', 'joint_pain', 'muscle_aches', 'skin_rash', 'fatigue'],
    vitals: {
      heartRate: 98,
      systolicBp: 102,
      diastolicBp: 70,
      respiratoryRate: 19,
      temperatureC: 39.4,
      oxygenSaturation: 97,
      bloodGlucose: 110
    },
    clinicalNarrative: 'Patient returned 6 days ago from an endemic tropical region. Sudden onset of high spiking fever, severe retro-orbital headache, incapacitating arthralgia ("breakbone fever"), and faint petechial eruption across forearms.',
    expectedDiagnosis: 'Dengue Hemorrhagic Fever / Viral Infection',
    teachingPoint: 'Drug safety contraindication: Aspirin, Ibuprofen, and all NSAIDs must be strictly withheld due to platelet inhibition and severe fatal gastrointestinal bleeding risk. Paracetamol is the safe antipyretic.'
  },
  {
    id: 'case_bacterial_pneumonia',
    title: 'Case 5: Community-Acquired Pneumonia',
    subtitle: '69-Year-Old Senior with Productive Cough and Chills',
    patientDemographics: {
      ageGroup: 'senior',
      gender: 'male',
      durationDays: 5,
      severityScale: 8
    },
    symptoms: ['fever', 'chills', 'cough', 'sputum_production', 'shortness_of_breath', 'chest_tightness', 'fatigue'],
    vitals: {
      heartRate: 108,
      systolicBp: 106,
      diastolicBp: 64,
      respiratoryRate: 25,
      temperatureC: 38.9,
      oxygenSaturation: 91,
      bloodGlucose: 135
    },
    clinicalNarrative: 'Elderly patient presents with 5 days of worsening fever, rigors, purulent rust-colored sputum, and right-sided pleuritic chest tightness on deep inspiration. Lung auscultation demonstrates crackles in right lower lobe.',
    expectedDiagnosis: 'Pneumonia (Community-Acquired)',
    teachingPoint: 'CURB-65 and NEWS2 assessment: Age >= 65, respiratory rate 25/min, and SpO2 91% indicate high clinical deterioration risk requiring prompt chest radiograph, blood cultures, and targeted antimicrobial coverage.'
  },
  {
    id: 'case_diabetes_hyperglycemia',
    title: 'Case 6: Type 2 Diabetes Presentation',
    subtitle: '52-Year-Old Adult with Osmotic Symptoms & Lethargy',
    patientDemographics: {
      ageGroup: 'adult',
      gender: 'male',
      durationDays: 21,
      severityScale: 5
    },
    symptoms: ['fatigue', 'weight_loss_unexplained', 'increased_urination', 'excessive_thirst', 'blurred_vision'],
    vitals: {
      heartRate: 82,
      systolicBp: 138,
      diastolicBp: 88,
      respiratoryRate: 16,
      temperatureC: 36.9,
      oxygenSaturation: 98,
      bloodGlucose: 284
    },
    clinicalNarrative: 'Patient presents with a 3-week progressive history of severe thirst (polydipsia), waking up 4-5 times at night to urinate (polyuria), unintended 4 kg weight loss, and occasional blurred vision. Random capillary glucose measured 284 mg/dL.',
    expectedDiagnosis: 'Type 2 Diabetes Mellitus',
    teachingPoint: 'Metabolic evaluation: The classic triad of polyuria, polydipsia, and unexplained weight loss combined with blood glucose > 200 mg/dL confirms overt hyperglycemia requiring HbA1c testing and lifestyle/pharmacological initiation.'
  }
];
