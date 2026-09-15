import { PatientProfile, DiagnosisResult, DifferentialMatch, RiskLevel, PatientVitals } from '../types';
import { DISEASES_DATABASE, SYMPTOMS_DATASET } from '../data/medicalData';
import { computeEarlyWarningScores } from './clinicalVitalsEngine';
import { runMultiModelInference } from './multiModelEngine';
import { getDrugSafetyForDisease } from '../data/drugSafetyData';

// Symptom lookup map
const symptomMap = new Map(SYMPTOMS_DATASET.map(s => [s.id, s]));

// Critical red-flag emergency combinations
const EMERGENCY_RED_FLAGS = [
  {
    symptoms: ['chest_pain'],
    reason: 'Crushing chest pain is a medical emergency requiring immediate 911 / EMS evaluation for acute myocardial infarction (heart attack).'
  },
  {
    symptoms: ['stiff_neck', 'fever'],
    reason: 'Fever accompanied by acute neck stiffness and headache is a classic triad of bacterial meningitis requiring emergency lumbar puncture and intravenous treatment.'
  },
  {
    symptoms: ['sharp_right_lower_pain'],
    reason: 'Acute sharp pain in the right lower abdomen suggests acute appendicitis with risk of rupture and peritonitis.'
  },
  {
    symptoms: ['sudden_numbness'],
    reason: 'Sudden weakness or numbness in the face, arm, or leg (especially on one side) is a critical stroke warning sign (BE-FAST).'
  }
];

export function runMedicalDiagnosis(
  selectedSymptomIds: string[],
  profile: PatientProfile
): DiagnosisResult {
  if (!selectedSymptomIds || selectedSymptomIds.length === 0) {
    throw new Error('At least one symptom must be selected for clinical assessment.');
  }

  // 1. Check for Critical Emergency Red Flags
  let emergencyAlert = false;
  let emergencyReason: string | undefined = undefined;

  for (const flag of EMERGENCY_RED_FLAGS) {
    const hasAllFlagSymptoms = flag.symptoms.every(sym => selectedSymptomIds.includes(sym));
    if (hasAllFlagSymptoms) {
      emergencyAlert = true;
      emergencyReason = flag.reason;
      break;
    }
  }

  // 2. Probabilistic Matching Engine
  // Calculates score based on:
  // - Overlap with disease symptoms (Jaccard similarity + weighted recall)
  // - Severity weight of matched symptoms
  // - Penalty for missing high-weight cardinal symptoms
  const matches: DifferentialMatch[] = DISEASES_DATABASE.map(disease => {
    const diseaseSymptoms = new Set(disease.symptoms);
    const matched = selectedSymptomIds.filter(sym => diseaseSymptoms.has(sym));
    const unmatched = selectedSymptomIds.filter(sym => !diseaseSymptoms.has(sym));

    if (matched.length === 0) {
      return {
        disease,
        probability: 0,
        matchedSymptoms: [],
        unmatchedSymptoms: selectedSymptomIds,
        keyContributingSymptoms: []
      };
    }

    // Weight calculation
    let matchedWeight = 0;
    matched.forEach(symId => {
      const sym = symptomMap.get(symId);
      matchedWeight += (sym?.severityWeight || 1);
    });

    let totalDiseaseWeight = 0;
    disease.symptoms.forEach(symId => {
      const sym = symptomMap.get(symId);
      totalDiseaseWeight += (sym?.severityWeight || 1);
    });

    // Precision & Recall
    const recall = matchedWeight / totalDiseaseWeight;
    const precision = matched.length / selectedSymptomIds.length;
    
    // Balanced F1-style diagnostic overlap score
    const f1Score = (2 * precision * recall) / (precision + recall + 0.001);

    // Profile context adjustment
    let contextMultiplier = 1.0;
    if (profile.durationDays > 14 && (disease.id === 'osteoarthritis' || disease.id === 'gerd' || disease.id === 'eczema')) {
      contextMultiplier += 0.15; // chronic presentation
    } else if (profile.durationDays <= 3 && (disease.id === 'influenza' || disease.id === 'appendicitis' || disease.id === 'common_cold')) {
      contextMultiplier += 0.10; // acute presentation
    }

    // Severity score influence
    if (profile.severityScale >= 8 && (disease.riskLevel === 'emergency' || disease.riskLevel === 'high')) {
      contextMultiplier += 0.12;
    }

    // Raw score
    let rawScore = f1Score * 100 * contextMultiplier;

    // Bonus for high match count
    if (matched.length >= 3) {
      rawScore += 5;
    }

    // Cap at 98.5% (responsible AI: no definitive 100% claim)
    const probability = Math.min(Math.round(rawScore * 10) / 10, 98.5);

    // Identify key contributing symptoms sorted by severity weight
    const keyContributingSymptoms = [...matched].sort((a, b) => {
      const wA = symptomMap.get(a)?.severityWeight || 1;
      const wB = symptomMap.get(b)?.severityWeight || 1;
      return wB - wA;
    });

    return {
      disease,
      probability: Math.max(probability, 2),
      matchedSymptoms: matched,
      unmatchedSymptoms: unmatched,
      keyContributingSymptoms
    };
  });

  // Sort by probability descending
  matches.sort((a, b) => b.probability - a.probability);

  // Normalize top probabilities so primary diagnosis is prominent
  const topMatches = matches.filter(m => m.matchedSymptoms.length > 0).slice(0, 5);
  const primaryMatch = topMatches[0] || {
    disease: DISEASES_DATABASE[0],
    probability: 10,
    matchedSymptoms: [],
    unmatchedSymptoms: selectedSymptomIds,
    keyContributingSymptoms: []
  };

  // 3. Compute Early Warning Score (NEWS2 / qSOFA) if vitals provided
  let earlyWarningScore = undefined;
  if (profile.vitals) {
    const hasConfusion = selectedSymptomIds.includes('confusion');
    earlyWarningScore = computeEarlyWarningScores(profile.vitals, hasConfusion);
  }

  // 4. Run Multi-Model Comparative Inferences
  const multiModelData = runMultiModelInference(selectedSymptomIds, primaryMatch);

  // 5. Retrieve Drug Safety & Contraindication Guidelines
  const drugSafety = getDrugSafetyForDisease(primaryMatch.disease.id, primaryMatch.disease.name);

  // Determine Triage Level with physiological escalation
  let triageLevel: RiskLevel = primaryMatch.disease.riskLevel;
  if (emergencyAlert) {
    triageLevel = 'emergency';
  } else if (earlyWarningScore && earlyWarningScore.news2Score >= 7) {
    triageLevel = 'emergency';
    if (!emergencyReason) {
      emergencyReason = `Physiological Red-Flag: NEWS2 score of ${earlyWarningScore.news2Score} indicates acute physiological collapse requiring emergency medical team resuscitation.`;
    }
    emergencyAlert = true;
  } else if (earlyWarningScore && (earlyWarningScore.news2Score >= 5 || earlyWarningScore.qSofaScore >= 2)) {
    if (triageLevel !== 'emergency') triageLevel = 'high';
  } else if (profile.severityScale >= 8 && triageLevel === 'moderate') {
    triageLevel = 'high';
  }

  return {
    id: 'DIAG-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    timestamp: new Date().toISOString(),
    patientProfile: profile,
    selectedSymptoms: selectedSymptomIds,
    primaryDiagnosis: primaryMatch,
    differentialDiagnoses: topMatches.slice(1),
    triageLevel,
    emergencyAlert,
    emergencyReason,
    earlyWarningScore,
    modelComparisons: multiModelData.comparisons,
    drugSafety
  };
}
