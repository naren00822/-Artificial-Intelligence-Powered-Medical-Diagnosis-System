import { PatientVitals, EarlyWarningScore } from '../types';

export const DEFAULT_HEALTHY_VITALS: PatientVitals = {
  heartRate: 76,
  systolicBp: 120,
  diastolicBp: 80,
  respiratoryRate: 16,
  temperatureC: 36.8,
  oxygenSaturation: 98,
  bloodGlucose: 95
};

export function computeEarlyWarningScores(vitals: PatientVitals, mentalConfusion: boolean = false): EarlyWarningScore {
  let news2 = 0;
  const flags: string[] = [];

  // 1. Respiration Rate (breaths/min)
  if (vitals.respiratoryRate <= 8) {
    news2 += 3;
    flags.push(`Bradypnea (${vitals.respiratoryRate} /min - critically low)`);
  } else if (vitals.respiratoryRate >= 9 && vitals.respiratoryRate <= 11) {
    news2 += 1;
  } else if (vitals.respiratoryRate >= 12 && vitals.respiratoryRate <= 20) {
    news2 += 0;
  } else if (vitals.respiratoryRate >= 21 && vitals.respiratoryRate <= 24) {
    news2 += 2;
    flags.push(`Tachypnea (${vitals.respiratoryRate} /min)`);
  } else if (vitals.respiratoryRate >= 25) {
    news2 += 3;
    flags.push(`Severe Tachypnea (${vitals.respiratoryRate} /min)`);
  }

  // 2. Oxygen Saturation (SpO2 %)
  if (vitals.oxygenSaturation <= 91) {
    news2 += 3;
    flags.push(`Critical Hypoxemia (SpO2 ${vitals.oxygenSaturation}%)`);
  } else if (vitals.oxygenSaturation >= 92 && vitals.oxygenSaturation <= 93) {
    news2 += 2;
    flags.push(`Moderate Hypoxemia (SpO2 ${vitals.oxygenSaturation}%)`);
  } else if (vitals.oxygenSaturation >= 94 && vitals.oxygenSaturation <= 95) {
    news2 += 1;
    flags.push(`Mild Desaturation (SpO2 ${vitals.oxygenSaturation}%)`);
  }

  // 3. Systolic Blood Pressure (mmHg)
  if (vitals.systolicBp <= 90) {
    news2 += 3;
    flags.push(`Hypotension / Shock Risk (Systolic ${vitals.systolicBp} mmHg)`);
  } else if (vitals.systolicBp >= 91 && vitals.systolicBp <= 100) {
    news2 += 2;
  } else if (vitals.systolicBp >= 101 && vitals.systolicBp <= 110) {
    news2 += 1;
  } else if (vitals.systolicBp >= 220) {
    news2 += 3;
    flags.push(`Hypertensive Crisis (Systolic ${vitals.systolicBp} mmHg)`);
  }

  // 4. Pulse / Heart Rate (bpm)
  if (vitals.heartRate <= 40) {
    news2 += 3;
    flags.push(`Severe Bradycardia (HR ${vitals.heartRate} bpm)`);
  } else if (vitals.heartRate >= 41 && vitals.heartRate <= 50) {
    news2 += 1;
  } else if (vitals.heartRate >= 91 && vitals.heartRate <= 110) {
    news2 += 1;
  } else if (vitals.heartRate >= 111 && vitals.heartRate <= 130) {
    news2 += 2;
    flags.push(`Tachycardia (HR ${vitals.heartRate} bpm)`);
  } else if (vitals.heartRate >= 131) {
    news2 += 3;
    flags.push(`Severe Tachycardia (HR ${vitals.heartRate} bpm)`);
  }

  // 5. Body Temperature (°C)
  if (vitals.temperatureC <= 35.0) {
    news2 += 3;
    flags.push(`Hypothermia (${vitals.temperatureC}°C)`);
  } else if (vitals.temperatureC >= 35.1 && vitals.temperatureC <= 36.0) {
    news2 += 1;
  } else if (vitals.temperatureC >= 38.1 && vitals.temperatureC <= 39.0) {
    news2 += 1;
    flags.push(`Pyrexia / Fever (${vitals.temperatureC}°C)`);
  } else if (vitals.temperatureC >= 39.1) {
    news2 += 2;
    flags.push(`High Pyrexia (${vitals.temperatureC}°C)`);
  }

  // 6. Blood Glucose Flag (Optional)
  if (vitals.bloodGlucose !== undefined) {
    if (vitals.bloodGlucose < 70) {
      flags.push(`Hypoglycemia (${vitals.bloodGlucose} mg/dL)`);
    } else if (vitals.bloodGlucose > 200) {
      flags.push(`Hyperglycemia (${vitals.bloodGlucose} mg/dL)`);
    }
  }

  // Compute NEWS2 Risk category
  let news2Risk: EarlyWarningScore['news2Risk'] = 'Low';
  if (news2 >= 7) {
    news2Risk = 'High';
  } else if (news2 >= 5) {
    news2Risk = 'Medium';
  } else if (news2 >= 1) {
    news2Risk = 'Low-Medium';
  }

  // Compute qSOFA Score (Quick Sepsis Organ Failure)
  // 1 pt for Systolic BP <= 100
  // 1 pt for Resp Rate >= 22
  // 1 pt for Altered Mentation
  let qSofa = 0;
  if (vitals.systolicBp <= 100) qSofa += 1;
  if (vitals.respiratoryRate >= 22) qSofa += 1;
  if (mentalConfusion) qSofa += 1;

  const qSofaRisk: EarlyWarningScore['qSofaRisk'] = qSofa >= 2 ? 'High Sepsis Risk' : 'Low';

  return {
    news2Score: news2,
    news2Risk,
    qSofaScore: qSofa,
    qSofaRisk,
    flags
  };
}
