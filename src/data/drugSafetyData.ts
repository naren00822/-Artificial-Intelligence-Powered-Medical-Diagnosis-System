import { DrugSafetyInfo } from '../types';

export const DRUG_SAFETY_DATABASE: Record<string, DrugSafetyInfo> = {
  dengue: {
    conditionId: 'dengue',
    conditionName: 'Dengue Hemorrhagic Fever',
    contraindicatedDrugs: [
      {
        drug: 'Aspirin (Acetylsalicylic Acid)',
        class: 'Salicylate / Antiplatelet',
        danger: 'Inhibits platelet aggregation and causes fatal gastrointestinal hemorrhage and bleeding diathesis in thrombocytopenic Dengue patients.',
        severity: 'critical'
      },
      {
        drug: 'Ibuprofen / Naproxen / Diclofenac',
        class: 'NSAIDs (Nonsteroidal Anti-inflammatory)',
        danger: 'Strongly increases gastrointestinal mucosal ulceration and platelet dysfunction, drastically elevating risk of Dengue shock syndrome.',
        severity: 'critical'
      },
      {
        drug: 'Intramuscular Injections (Any drug)',
        class: 'IM Route',
        danger: 'High risk of large muscle hematomas due to profound thrombocytopenia.',
        severity: 'high'
      }
    ],
    safeSupportiveCare: [
      'Paracetamol (Acetaminophen) strictly within recommended limits (Max 2g-3g/day under physician guidance)',
      'Aggressive oral rehydration therapy (ORS, coconut water, isotonic fluids)',
      'Continuous daily Complete Blood Count (CBC) monitoring for hematocrit and platelet count'
    ],
    clinicalMonitoring: [
      'Platelet count (< 100,000 /µL alert; < 20,000 /µL critical transfusion threshold)',
      'Hematocrit rise > 20% indicates vascular plasma leakage',
      'Blood pressure and pulse pressure (< 20 mmHg indicates impending shock)'
    ]
  },
  bronchial_asthma: {
    conditionId: 'bronchial_asthma',
    conditionName: 'Bronchial Asthma (Exacerbation)',
    contraindicatedDrugs: [
      {
        drug: 'Propranolol / Atenolol / Carvedilol (Beta-Blockers)',
        class: 'Non-selective and Beta-1 Blockers',
        danger: 'Blocks beta-2 adrenergic receptors in bronchial smooth muscle, triggering severe refractory bronchospasm and fatal status asthmaticus.',
        severity: 'critical'
      },
      {
        drug: 'Aspirin & NSAIDs (AERD Warning)',
        class: 'Cyclooxygenase (COX-1) Inhibitors',
        danger: 'In patients with Aspirin-Exacerbated Respiratory Disease (AERD), triggers cysteinyl leukotriene storm leading to severe bronchoconstriction and angioedema.',
        severity: 'critical'
      },
      {
        drug: 'Sedatives / Benzodiazepines',
        class: 'CNS Depressants',
        danger: 'Suppresses hypoxic respiratory drive during acute asthma exhaustion, precipitating acute hypercapnic respiratory arrest.',
        severity: 'high'
      }
    ],
    safeSupportiveCare: [
      'Inhaled Short-Acting Beta-2 Agonist (SABA) e.g., Salbutamol / Albuterol via spacer',
      'Inhaled Corticosteroids (ICS) e.g., Budesonide or Fluticasone as controller',
      'Supplemental oxygen to maintain target SpO2 between 93% and 95%'
    ],
    clinicalMonitoring: [
      'Peak Expiratory Flow Rate (PEFR)',
      'Respiratory rate and accessory muscle usage (sternocleidomastoid retractions)',
      'Pulse oximetry (SpO2)'
    ]
  },
  angina_ischemic_heart: {
    conditionId: 'angina_ischemic_heart',
    conditionName: 'Acute Coronary Syndrome / Angina Pectoris',
    contraindicatedDrugs: [
      {
        drug: 'Phosphodiesterase-5 Inhibitors (Sildenafil, Tadalafil)',
        class: 'PDE5 Inhibitors',
        danger: 'Co-administration with sublingual nitrates causes profound synergistic vasodilation and life-threatening refractory hypotension and cardiac arrest.',
        severity: 'critical'
      },
      {
        drug: 'COX-2 Inhibitors & High-Dose NSAIDs (Celecoxib, Diclofenac)',
        class: 'NSAIDs',
        danger: 'Induces pro-thrombotic state, increases coronary stent thrombosis, and accelerates myocardial re-infarction.',
        severity: 'high'
      },
      {
        drug: 'Decongestants (Pseudoephedrine, Phenylephrine)',
        class: 'Sympathomimetics',
        danger: 'Causes peripheral vasoconstriction and tachycardia, dramatically elevating myocardial oxygen demand and precipitating acute ischemia.',
        severity: 'high'
      }
    ],
    safeSupportiveCare: [
      'Emergency MONA protocol (Morphine, Oxygen, Nitroglycerin, Aspirin) administered exclusively by EMS/Hospital personnel',
      'Immediate 12-lead Electrocardiogram (ECG) within 10 minutes of arrival',
      'Urgent Cardiology consult for Percutaneous Coronary Intervention (PCI)'
    ],
    clinicalMonitoring: [
      'Cardiac Troponin I / T serial assays',
      'Continuous telemetry monitoring for ventricular arrhythmias / ST elevation',
      'Continuous blood pressure tracking'
    ]
  },
  appendicitis: {
    conditionId: 'appendicitis',
    conditionName: 'Acute Appendicitis',
    contraindicatedDrugs: [
      {
        drug: 'Laxatives & Cathartics (Bisacodyl, Senna, Magnesium Citrate)',
        class: 'Stimulant Laxatives',
        danger: 'Increases intraluminal pressure and peristalsis in the inflamed appendix, markedly precipitating rapid rupture and fatal generalized peritonitis.',
        severity: 'critical'
      },
      {
        drug: 'High-Dose Masking Analgesics before surgical evaluation',
        class: 'Strong Opioids / NSAIDs prior to diagnosis',
        danger: 'Masks peritoneal irritation signs (rebound tenderness, involuntary guarding), causing dangerous surgical consultation delay.',
        severity: 'high'
      },
      {
        drug: 'Oral Food & Liquids (Keep NPO)',
        class: 'Oral Intake',
        danger: 'Risk of pulmonary aspiration during emergency anesthesia and surgical appendectomy.',
        severity: 'critical'
      }
    ],
    safeSupportiveCare: [
      'Strict NPO (Nothing by Mouth) status',
      'Intravenous fluid resuscitation with normal saline or Ringer lactate',
      'Immediate general surgical consultation for laparoscopic appendectomy'
    ],
    clinicalMonitoring: [
      'Abdominal palpation for McBurney point tenderness and Rovsing sign',
      'Serial Complete Blood Count for leukocytosis (elevated WBC with left shift)',
      'Abdominal / Pelvic Ultrasound or Contrast-Enhanced CT scan'
    ]
  },
  gerd: {
    conditionId: 'gerd',
    conditionName: 'Gastroesophageal Reflux Disease (GERD)',
    contraindicatedDrugs: [
      {
        drug: 'Aspirin, Ibuprofen, Naproxen, Ketorolac (NSAIDs)',
        class: 'Nonsteroidal Anti-inflammatory Drugs',
        danger: 'Inhibits protective gastric mucosal prostaglandins, dramatically worsening erosive esophagitis and increasing peptic ulcer hemorrhage risk.',
        severity: 'high'
      },
      {
        drug: 'Oral Bisphosphonates (Alendronate) taken improperly',
        class: 'Bone resorption inhibitors',
        danger: 'Causes severe direct esophageal chemical ulceration if not taken with a full glass of water while remaining upright for 30 minutes.',
        severity: 'high'
      },
      {
        drug: 'Calcium Channel Blockers & Nitrates',
        class: 'Vasodilators',
        danger: 'Relaxes the Lower Esophageal Sphincter (LES) smooth muscle tone, facilitating chronic acid and bile regurgitation.',
        severity: 'moderate'
      }
    ],
    safeSupportiveCare: [
      'Proton Pump Inhibitors (PPIs) e.g., Omeprazole, Esomeprazole taken 30-60 minutes before breakfast under physician advice',
      'Elevate head of bed by 15-20 cm (using bed risers, not just stacked pillows)',
      'Avoid recumbent position for at least 3 hours post-meal'
    ],
    clinicalMonitoring: [
      'Screening for red-flag symptoms (dysphagia, odynophagia, unexplained weight loss, hematemesis)',
      'Upper gastrointestinal endoscopy (EGD) if symptoms persist > 8 weeks'
    ]
  },
  type2_diabetes: {
    conditionId: 'type2_diabetes',
    conditionName: 'Type 2 Diabetes Mellitus',
    contraindicatedDrugs: [
      {
        drug: 'Systemic Corticosteroids (Prednisone, Dexamethasone)',
        class: 'Glucocorticoids',
        danger: 'Dramatically stimulates hepatic gluconeogenesis and causes severe insulin resistance, triggering acute hyperosmolar hyperglycemic state (HHS).',
        severity: 'critical'
      },
      {
        drug: 'Non-Selective Beta-Blockers',
        class: 'Beta-Adrenergic Antagonists',
        danger: 'Blunts physiological sympathoadrenal warning signs of acute hypoglycemia (tremor, palpitations), masking dangerous hypoglycemia.',
        severity: 'high'
      },
      {
        drug: 'Thiazide Diuretics (High Doses)',
        class: 'Diuretics',
        danger: 'Inhibits insulin secretion from pancreatic beta cells and worsens glycemic control and hypokalemia.',
        severity: 'moderate'
      }
    ],
    safeSupportiveCare: [
      'Strict self-monitoring of blood glucose (fasting target 80-130 mg/dL, postprandial < 180 mg/dL)',
      'Medical nutrition therapy with carbohydrate counting and low glycemic index foods',
      'Structured 150 minutes/week moderate aerobic exercise'
    ],
    clinicalMonitoring: [
      'HbA1c (Glycated Hemoglobin) testing every 3 to 6 months',
      'Annual urine microalbumin-to-creatinine ratio (screening for diabetic nephropathy)',
      'Comprehensive dilated eye exam and diabetic foot sensory monofilament screening'
    ]
  },
  hypertension: {
    conditionId: 'hypertension',
    conditionName: 'Essential Hypertension',
    contraindicatedDrugs: [
      {
        drug: 'Decongestants (Pseudoephedrine, Oxymetazoline)',
        class: 'Alpha-1 Adrenergic Agonists',
        danger: 'Direct systemic arterial vasoconstriction causing sudden hypertensive crisis, stroke, or retinal detachment.',
        severity: 'critical'
      },
      {
        drug: 'Chronic NSAIDs (Ibuprofen, Naproxen, Celecoxib)',
        class: 'NSAIDs',
        danger: 'Inhibits renal vasodilating prostaglandins, promotes sodium and water retention, and blunts the efficacy of ACE inhibitors and ARBs.',
        severity: 'high'
      },
      {
        drug: 'Excessive Stimulants / Licorice (Glycyrrhizin)',
        class: 'Mineralocorticoid mimics',
        danger: 'Inhibits 11-beta-HSD2 enzyme leading to apparent mineralocorticoid excess, severe hypokalemia, and malignant hypertension.',
        severity: 'high'
      }
    ],
    safeSupportiveCare: [
      'DASH (Dietary Approaches to Stop Hypertension) diet emphasizing potassium and magnesium rich foods',
      'Sodium restriction to < 2,000 mg/day (1 teaspoon table salt)',
      'Regular home blood pressure log calibrated against clinic readings'
    ],
    clinicalMonitoring: [
      'Home Blood Pressure Monitoring (AM and PM readings)',
      'Serum Creatinine, eGFR, and Electrolytes (Sodium, Potassium)',
      'Routine 12-lead ECG for left ventricular hypertrophy (LVH)'
    ]
  }
};

export function getDrugSafetyForDisease(diseaseId: string, fallbackName: string): DrugSafetyInfo {
  if (DRUG_SAFETY_DATABASE[diseaseId]) {
    return DRUG_SAFETY_DATABASE[diseaseId];
  }

  // Generic fallback for any disease
  return {
    conditionId: diseaseId,
    conditionName: fallbackName,
    contraindicatedDrugs: [
      {
        drug: 'Unprescribed Systemic Antibiotics',
        class: 'Antimicrobial Agents',
        danger: 'Inappropriate use drives antimicrobial resistance and alters gut microbiome without clinical justification.',
        severity: 'high'
      },
      {
        drug: 'Unmonitored NSAIDs (High Doses)',
        class: 'COX Inhibitors',
        danger: 'Potential gastric mucosal injury, renal hypoperfusion, and masked clinical inflammatory signs.',
        severity: 'moderate'
      }
    ],
    safeSupportiveCare: [
      'Hydration with clear fluids and adequate physiological rest',
      'Follow prescribed therapy from a licensed physician',
      'Monitor for emergency warning signs (chest pain, dyspnea, confusion)'
    ],
    clinicalMonitoring: [
      'Symptom trajectory and temperature charting',
      'Routine vital signs evaluation'
    ]
  };
}
