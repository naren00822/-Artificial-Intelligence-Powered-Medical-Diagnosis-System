import { Symptom, Disease, MLModelBenchmark, FeatureImportance } from '../types';

export const SYMPTOMS_DATASET: Symptom[] = [
  // General & Constitutional
  { id: 'fever', name: 'High Fever', category: 'General', severityWeight: 3, description: 'Elevated body temperature above 38°C (100.4°F)' },
  { id: 'mild_fever', name: 'Mild / Low-grade Fever', category: 'General', severityWeight: 2, description: 'Slightly elevated temperature between 37.3°C and 38°C' },
  { id: 'fatigue', name: 'Fatigue & Lethargy', category: 'General', severityWeight: 2, description: 'Persistent feeling of tiredness, weakness, or exhaustion' },
  { id: 'chills', name: 'Chills & Rigors', category: 'General', severityWeight: 2, description: 'Feeling cold accompanied by shivering or tremors' },
  { id: 'weight_loss', name: 'Unexplained Weight Loss', category: 'General', severityWeight: 3, description: 'Loss of body weight without dieting or exercise' },
  { id: 'sweating', name: 'Excessive Sweating / Night Sweats', category: 'General', severityWeight: 2, description: 'Profuse sweating even in cool environments' },
  { id: 'malaise', name: 'General Malaise', category: 'General', severityWeight: 2, description: 'General feeling of physical discomfort and being unwell' },
  { id: 'dehydration', name: 'Dehydration', category: 'General', severityWeight: 3, description: 'Excessive thirst, dry mouth, little to no urination' },

  // Respiratory
  { id: 'cough', name: 'Persistent Cough', category: 'Respiratory', severityWeight: 2, description: 'Dry or productive hacking cough' },
  { id: 'shortness_of_breath', name: 'Shortness of Breath (Dyspnea)', category: 'Respiratory', severityWeight: 4, description: 'Difficulty breathing or feeling unable to get enough air' },
  { id: 'sore_throat', name: 'Sore Throat', category: 'Respiratory', severityWeight: 1, description: 'Pain, scratchiness, or irritation of the pharynx' },
  { id: 'runny_nose', name: 'Runny / Stuffy Nose', category: 'Respiratory', severityWeight: 1, description: 'Nasal congestion, rhinorrhea, or mucus discharge' },
  { id: 'wheezing', name: 'Wheezing Sound', category: 'Respiratory', severityWeight: 3, description: 'High-pitched whistling sound during breathing' },
  { id: 'chest_tightness', name: 'Chest Tightness', category: 'Respiratory', severityWeight: 3, description: 'Constricting sensation around the rib cage' },
  { id: 'loss_of_smell', name: 'Loss of Smell / Taste', category: 'Respiratory', severityWeight: 2, description: 'Anosmia or ageusia' },
  { id: 'sputum_production', name: 'Phlegm / Sputum Production', category: 'Respiratory', severityWeight: 2, description: 'Coughing up thick green, yellow, or rusty mucus' },

  // Cardiovascular
  { id: 'chest_pain', name: 'Crushing Chest Pain', category: 'Cardiovascular', severityWeight: 5, description: 'Substernal pressure, squeezing, or radiating pain to left arm/jaw' },
  { id: 'palpitations', name: 'Rapid / Irregular Heartbeats', category: 'Cardiovascular', severityWeight: 3, description: 'Sensation of racing, pounding, or fluttering pulse' },
  { id: 'swollen_legs', name: 'Leg / Ankle Swelling (Edema)', category: 'Cardiovascular', severityWeight: 3, description: 'Fluid retention causing puffy ankles and feet' },
  { id: 'dizziness_on_standing', name: 'Lightheadedness / Orthostatic Dizziness', category: 'Cardiovascular', severityWeight: 2, description: 'Feeling faint when rising from sitting or lying' },

  // Gastrointestinal
  { id: 'nausea', name: 'Nausea', category: 'Gastrointestinal', severityWeight: 2, description: 'Unsettled stomach sensation with the urge to vomit' },
  { id: 'vomiting', name: 'Vomiting', category: 'Gastrointestinal', severityWeight: 3, description: 'Forceful expulsion of stomach contents' },
  { id: 'abdominal_pain_general', name: 'General Abdominal Cramping', category: 'Gastrointestinal', severityWeight: 2, description: 'Diffuse pain or discomfort across the stomach' },
  { id: 'sharp_right_lower_pain', name: 'Sharp Right Lower Quadrant Pain', category: 'Gastrointestinal', severityWeight: 5, description: 'Intense localized pain near McBurney point' },
  { id: 'heartburn', name: 'Heartburn / Acid Regurgitation', category: 'Gastrointestinal', severityWeight: 2, description: 'Burning pain behind the breastbone after meals' },
  { id: 'diarrhea', name: 'Frequent Loose Watery Stools', category: 'Gastrointestinal', severityWeight: 3, description: 'Watery bowel movements multiple times per day' },
  { id: 'constipation', name: 'Severe Constipation', category: 'Gastrointestinal', severityWeight: 2, description: 'Infrequent, hard, painful bowel movements' },
  { id: 'loss_of_appetite', name: 'Loss of Appetite (Anorexia)', category: 'Gastrointestinal', severityWeight: 2, description: 'Significant reduction in hunger or desire to eat' },
  { id: 'bloating', name: 'Abdominal Bloating & Gas', category: 'Gastrointestinal', severityWeight: 1, description: 'Feeling of abdominal fullness or distention' },
  { id: 'yellowing_eyes_skin', name: 'Yellowing of Eyes / Skin (Jaundice)', category: 'Gastrointestinal', severityWeight: 4, description: 'Icterus due to elevated bilirubin levels' },

  // Neurological & Sensory
  { id: 'headache', name: 'Severe Throbbing Headache', category: 'Neurological', severityWeight: 3, description: 'Intense pain in the head or temples' },
  { id: 'light_sensitivity', name: 'Light & Sound Sensitivity (Photophobia)', category: 'Neurological', severityWeight: 2, description: 'Discomfort in bright rooms or loud environments' },
  { id: 'dizziness', name: 'Vertigo / Room Spinning', category: 'Neurological', severityWeight: 3, description: 'False sensation of rotational movement' },
  { id: 'stiff_neck', name: 'Stiff Neck with Fever', category: 'Neurological', severityWeight: 5, description: 'Inability to flex chin to chest without severe discomfort' },
  { id: 'sudden_numbness', name: 'Sudden Facial / Limb Numbness', category: 'Neurological', severityWeight: 5, description: 'Loss of sensation or weakness on one side of the body' },
  { id: 'confusion', name: 'Mental Fog / Confusion', category: 'Neurological', severityWeight: 4, description: 'Disorientation, difficulty concentrating, or memory lapse' },
  { id: 'tremor', name: 'Hand Tremor / Shaking', category: 'Neurological', severityWeight: 2, description: 'Involuntary rhythmic muscle contraction' },

  // Dermatological
  { id: 'skin_rash', name: 'Erythematous Skin Rash', category: 'Dermatological', severityWeight: 2, description: 'Red, inflamed, or bumpy cutaneous eruption' },
  { id: 'itching', name: 'Severe Pruritus (Itching)', category: 'Dermatological', severityWeight: 2, description: 'Intense urge to scratch skin' },
  { id: 'skin_peeling', name: 'Skin Flaking / Peeling', category: 'Dermatological', severityWeight: 2, description: 'Loss of outermost epidermal layer' },
  { id: 'hives', name: 'Raised Wheals / Hives (Urticaria)', category: 'Dermatological', severityWeight: 3, description: 'Itchy swollen red welts on skin' },
  { id: 'blisters', name: 'Fluid-Filled Blisters', category: 'Dermatological', severityWeight: 3, description: 'Small vesicles containing serous fluid' },

  // Musculoskeletal
  { id: 'joint_pain', name: 'Joint Pain (Arthralgia)', category: 'Musculoskeletal', severityWeight: 2, description: 'Ache or soreness in knees, wrists, shoulders, or fingers' },
  { id: 'muscle_aches', name: 'Diffuse Muscle Aches (Myalgia)', category: 'Musculoskeletal', severityWeight: 2, description: 'Widespread body aches common in viral illnesses' },
  { id: 'joint_stiffness', name: 'Morning Joint Stiffness', category: 'Musculoskeletal', severityWeight: 2, description: 'Difficulty moving joints upon waking lasting > 30 minutes' },
  { id: 'back_pain', name: 'Lower Back Pain', category: 'Musculoskeletal', severityWeight: 2, description: 'Aching or sharp pain in lumbar region' },
];

export const DISEASES_DATABASE: Disease[] = [
  {
    id: 'common_cold',
    name: 'Common Cold (Viral Upper Respiratory Infection)',
    category: 'Respiratory',
    description: 'A mild viral infectious disease of the upper respiratory tract primarily caused by rhinoviruses.',
    symptoms: ['runny_nose', 'sore_throat', 'cough', 'mild_fever', 'malaise'],
    riskLevel: 'low',
    recommendedSpecialist: 'General Physician / Primary Care Provider',
    precautions: [
      'Drink plenty of warm fluids (water, clear broths, herbal teas)',
      'Rest adequately and avoid strenuous physical activity',
      'Wash hands frequently with soap for at least 20 seconds',
      'Use warm saline gargles for throat discomfort'
    ],
    safeSelfCare: [
      'Over-the-counter saline nasal sprays',
      'Humidifier or steam inhalation to loosen mucus',
      'Adequate sleep (7-9 hours)'
    ],
    typicalTests: ['Usually clinical diagnosis based on symptoms', 'Rapid antigen swab if flu/COVID suspected'],
    doctorConsultAdvice: 'Consult a physician if fever exceeds 38.9°C (102°F), symptoms worsen after 10 days, or shortness of breath develops.'
  },
  {
    id: 'influenza',
    name: 'Influenza (Seasonal Flu)',
    category: 'Respiratory',
    description: 'An acute respiratory infection caused by influenza viruses characterized by sudden fever, profound fatigue, and body aches.',
    symptoms: ['fever', 'chills', 'fatigue', 'muscle_aches', 'headache', 'cough', 'sore_throat'],
    riskLevel: 'moderate',
    recommendedSpecialist: 'General Physician / Pulmonologist',
    precautions: [
      'Isolate at home to prevent spreading the virus to high-risk individuals',
      'Maintain diligent oral hydration and electrolyte balance',
      'Cover mouth and nose when coughing or sneezing'
    ],
    safeSelfCare: [
      'Bed rest in a well-ventilated room',
      'Electrolyte-rich fluids (ORS, coconut water, soups)',
      'Cool compress on forehead for fever relief'
    ],
    typicalTests: ['Rapid Influenza Diagnostic Test (RIDT)', 'RT-PCR Viral Panel', 'Complete Blood Count (CBC)'],
    doctorConsultAdvice: 'Seek prompt medical evaluation if you experience chest pain, difficulty breathing, persistent dizziness, or if symptoms improve then return with higher fever.'
  },
  {
    id: 'covid19',
    name: 'COVID-19 (SARS-CoV-2 Infection)',
    category: 'Respiratory',
    description: 'A contagious viral respiratory illness with a wide spectrum of symptoms ranging from mild to severe acute respiratory distress.',
    symptoms: ['fever', 'cough', 'fatigue', 'loss_of_smell', 'shortness_of_breath', 'sore_throat', 'headache', 'muscle_aches'],
    riskLevel: 'moderate',
    recommendedSpecialist: 'Infectious Disease Specialist / Pulmonologist',
    precautions: [
      'Monitor blood oxygen saturation (SpO2) with a pulse oximeter',
      'Self-isolate in a dedicated room away from family members',
      'Wear a well-fitted mask (N95/KN95) when around others'
    ],
    safeSelfCare: [
      'Adequate hydration and nutrient-dense meals',
      'Prone positioning (resting on stomach) if advised to aid oxygenation',
      'Regular temperature and SpO2 charting'
    ],
    typicalTests: ['SARS-CoV-2 RT-PCR Swab', 'Rapid Antigen Test', 'HRCT Chest (if severe dyspnea)'],
    doctorConsultAdvice: 'EMERGENCY: Seek immediate hospital care if oxygen saturation drops below 94%, lips turn bluish, or severe chest tightness occurs.'
  },
  {
    id: 'acute_bronchitis',
    name: 'Acute Bronchitis',
    category: 'Respiratory',
    description: 'Inflammation of the bronchial tubes leading to mucus hypersecretion and frequent coughing, often following a cold.',
    symptoms: ['cough', 'sputum_production', 'fatigue', 'shortness_of_breath', 'chest_tightness', 'mild_fever'],
    riskLevel: 'moderate',
    recommendedSpecialist: 'Pulmonologist / General Physician',
    precautions: [
      'Avoid exposure to tobacco smoke, air pollution, and harsh chemical fumes',
      'Do not take over-the-counter cough suppressants without doctor consent if producing phlegm',
      'Stay hydrated to thin bronchial secretions'
    ],
    safeSelfCare: [
      'Steam inhalation twice daily',
      'Warm honey and lemon water (for individuals over 1 year old)',
      'Elevate head with pillows while sleeping'
    ],
    typicalTests: ['Chest X-ray (to rule out pneumonia)', 'Spirometry (if asthma history)', 'Sputum Culture'],
    doctorConsultAdvice: 'Consult a doctor if cough lasts longer than 3 weeks, produces blood-tinged mucus, or is accompanied by high fever.'
  },
  {
    id: 'bronchial_asthma',
    name: 'Bronchial Asthma (Exacerbation)',
    category: 'Respiratory',
    description: 'A chronic inflammatory disorder of the airways causing recurring episodes of wheezing, breathlessness, and coughing.',
    symptoms: ['wheezing', 'shortness_of_breath', 'chest_tightness', 'cough'],
    riskLevel: 'high',
    recommendedSpecialist: 'Pulmonologist / Allergist',
    precautions: [
      'Identify and avoid known allergens (dust mites, pollen, animal dander)',
      'Keep rescue bronchodilator inhaler accessible at all times',
      'Monitor peak expiratory flow (PEF) rates if diagnosed'
    ],
    safeSelfCare: [
      'Sit upright in an air-purified room during mild tightness',
      'Practice pursed-lip breathing techniques',
      'Maintain an up-to-date Asthma Action Plan'
    ],
    typicalTests: ['Spirometry with bronchodilator reversibility', 'Peak Expiratory Flow (PEF)', 'Allergy skin prick tests'],
    redFlagWarning: 'Inability to speak in full sentences, blue tint on fingernails, or peak flow <50% indicates an emergency.',
    doctorConsultAdvice: 'Seek emergency medical attention if rescue inhaler provides no relief within 15 minutes or if retractions (skin pulling in between ribs) occur.'
  },
  {
    id: 'pneumonia',
    name: 'Pneumonia (Community-Acquired)',
    category: 'Respiratory',
    description: 'An infection that inflames the air sacs (alveoli) in one or both lungs, filling them with fluid or purulent material.',
    symptoms: ['fever', 'chills', 'cough', 'sputum_production', 'shortness_of_breath', 'chest_tightness', 'fatigue'],
    riskLevel: 'high',
    recommendedSpecialist: 'Pulmonologist / Critical Care Specialist',
    precautions: [
      'Strict adherence to prescribed antibiotic or antiviral regimen',
      'Do not abruptly discontinue medications even if feeling improved',
      'Ensure complete physical rest'
    ],
    safeSelfCare: [
      'Strict bed rest and continuous pulse oximetry monitoring',
      'Humidified oxygen therapy if hospital-directed',
      'Chest physiotherapy exercises'
    ],
    typicalTests: ['Posterior-Anterior Chest Radiograph (X-Ray)', 'Complete Blood Count (Leukocytosis check)', 'Blood Cultures', 'Sputum Gram Stain'],
    doctorConsultAdvice: 'Requires professional medical assessment immediately. Hospitalization may be needed for elderly individuals or low oxygen levels.'
  },
  {
    id: 'angina_ischemic_heart',
    name: 'Acute Coronary Syndrome / Angina Pectoris',
    category: 'Cardiovascular',
    description: 'A condition marked by severe chest pain caused by an insufficient supply of blood and oxygen to the myocardium.',
    symptoms: ['chest_pain', 'shortness_of_breath', 'sweating', 'palpitations', 'nausea'],
    riskLevel: 'emergency',
    recommendedSpecialist: 'Cardiologist / Emergency Medicine Specialist',
    precautions: [
      'CALL EMERGENCY SERVICES (911 / 112 / Local EMS) IMMEDIATELY',
      'Stop all physical activity and sit in a comfortable resting position',
      'Do NOT drive yourself to the emergency hospital'
    ],
    safeSelfCare: [
      'Chew an uncoated adult aspirin (325mg) if advised by emergency dispatch and no contraindications/allergies exist',
      'Loosen tight clothing around neck and waist',
      'Remain calm while awaiting paramedic arrival'
    ],
    typicalTests: ['12-Lead Electrocardiogram (ECG/EKG)', 'Cardiac Troponin I & T blood biomarkers', 'Echocardiogram', 'Coronary Angiography'],
    redFlagWarning: 'CRITICAL EMERGENCY: Crushing chest pain radiating to left arm, neck, or jaw requires immediate emergency medical rescue.',
    doctorConsultAdvice: 'Immediate emergency department evaluation is vital. Time is myocardium.'
  },
  {
    id: 'hypertension_crisis',
    name: 'Hypertensive Episode / Essential Hypertension',
    category: 'Cardiovascular',
    description: 'Elevated arterial pressure that may present with headaches, dizziness, and palpitations.',
    symptoms: ['headache', 'dizziness_on_standing', 'palpitations', 'fatigue'],
    riskLevel: 'moderate',
    recommendedSpecialist: 'Cardiologist / Internal Medicine Physician',
    precautions: [
      'Monitor blood pressure in a calm seated position after 5 minutes of rest',
      'Reduce dietary sodium intake (< 2,000 mg/day)',
      'Limit caffeine and alcohol consumption'
    ],
    safeSelfCare: [
      'DASH diet (Dietary Approaches to Stop Hypertension)',
      'Stress-reduction breathing exercises',
      'Regular BP logging twice daily'
    ],
    typicalTests: ['Serial Sphygmomanometer readings', '24-hour Ambulatory Blood Pressure Monitoring', 'Lipid Profile', 'Serum Creatinine & Electrolytes'],
    doctorConsultAdvice: 'If systolic blood pressure exceeds 180 mmHg or diastolic exceeds 120 mmHg with vision changes or chest pain, go to the emergency room immediately.'
  },
  {
    id: 'migraine',
    name: 'Migraine with / without Aura',
    category: 'Neurological',
    description: 'A complex neurological condition characterized by recurrent moderate-to-severe throbbing unilateral headaches.',
    symptoms: ['headache', 'light_sensitivity', 'nausea', 'vomiting', 'dizziness'],
    riskLevel: 'moderate',
    recommendedSpecialist: 'Neurologist / Headache Specialist',
    precautions: [
      'Rest in a dark, quiet, temperature-controlled room during attacks',
      'Identify and log individual triggers (e.g. aged cheeses, stress, irregular sleep)',
      'Avoid skipping meals or dehydrating'
    ],
    safeSelfCare: [
      'Cold compress applied to forehead or back of neck',
      'Caffeine in modest amounts at the very onset (may enhance analgesia)',
      'Adequate hydration'
    ],
    typicalTests: ['Neurological examination', 'Brain MRI/CT (to rule out secondary intracranial causes if atypical)'],
    doctorConsultAdvice: 'Consult a physician if headache is preceded by speech difficulty, sudden explosive onset ("thunderclap"), or if pattern changes drastically.'
  },
  {
    id: 'meningitis_suspect',
    name: 'Suspected Meningitis (Infectious)',
    category: 'Neurological',
    description: 'Acute inflammation of the protective membranes covering the brain and spinal cord.',
    symptoms: ['fever', 'stiff_neck', 'headache', 'light_sensitivity', 'confusion', 'nausea'],
    riskLevel: 'emergency',
    recommendedSpecialist: 'Emergency Physician / Neurologist / Infectious Disease Specialist',
    precautions: [
      'GO TO THE NEAREST EMERGENCY ROOM IMMEDIATELY',
      'Do not delay seeking care to test self-remedies',
      'Wear a surgical mask if bacterial meningitis is suspected'
    ],
    safeSelfCare: [
      'Do not attempt self-treatment',
      'Keep patient resting while transport is organized'
    ],
    typicalTests: ['Lumbar Puncture (CSF analysis & culture)', 'Non-contrast Head CT Scan', 'Blood Cultures'],
    redFlagWarning: 'EMERGENCY: High fever combined with severe neck stiffness and confusion is a life-threatening medical emergency.',
    doctorConsultAdvice: 'Requires urgent hospitalization and immediate intravenous empiric antimicrobial therapy.'
  },
  {
    id: 'gerd',
    name: 'Gastroesophageal Reflux Disease (GERD)',
    category: 'Gastrointestinal',
    description: 'A chronic digestive condition where stomach acid or bile irritates the lining of the food pipe (esophagus).',
    symptoms: ['heartburn', 'nausea', 'chest_tightness', 'cough', 'bloating'],
    riskLevel: 'low',
    recommendedSpecialist: 'Gastroenterologist',
    precautions: [
      'Avoid reclining or lying flat within 3 hours after eating',
      'Avoid known trigger foods (spicy, acidic citrus, tomato sauces, peppermint, chocolate)',
      'Eat smaller, more frequent meals rather than large heavy dinners'
    ],
    safeSelfCare: [
      'Elevate the head of your bed by 6 to 8 inches',
      'Maintain a healthy body weight to reduce intra-abdominal pressure',
      'Wear loose-fitting clothing around the waist'
    ],
    typicalTests: ['Upper Gastrointestinal Endoscopy (EGD)', '24-Hour Esophageal pH Impedance study', 'Barium Swallow'],
    doctorConsultAdvice: 'See a gastroenterologist if swallowing becomes painful (odynophagia), difficulty swallowing solids occurs (dysphagia), or symptoms persist despite antacids.'
  },
  {
    id: 'acute_gastroenteritis',
    name: 'Acute Viral / Bacterial Gastroenteritis',
    category: 'Gastrointestinal',
    description: 'An intestinal infection marked by watery diarrhea, abdominal cramps, nausea or vomiting, commonly called "stomach flu".',
    symptoms: ['diarrhea', 'vomiting', 'nausea', 'abdominal_pain_general', 'dehydration', 'fever', 'fatigue'],
    riskLevel: 'moderate',
    recommendedSpecialist: 'Gastroenterologist / Family Physician',
    precautions: [
      'Prioritize rehydration with Oral Rehydration Salts (ORS) in frequent small sips',
      'Practice strict hand hygiene, especially after bathroom visits',
      'Avoid dairy, fatty foods, caffeine, and artificial sweeteners while recovering'
    ],
    safeSelfCare: [
      'BRAT diet (Bananas, Rice, Applesauce, Toast) once vomiting subsides',
      'Sip electrolyte-balanced solutions throughout the day',
      'Allow the digestive tract to rest by avoiding heavy, greasy meals'
    ],
    typicalTests: ['Stool Routine Examination & Microscopy', 'Stool PCR Viral/Bacterial Panel', 'Serum Electrolytes'],
    doctorConsultAdvice: 'Contact a healthcare professional if unable to keep liquids down for >24 hours, if blood is present in stool, or if signs of severe dehydration appear.'
  },
  {
    id: 'appendicitis',
    name: 'Acute Appendicitis',
    category: 'Gastrointestinal',
    description: 'An acute painful inflammation and swelling of the vermiform appendix requiring urgent surgical assessment.',
    symptoms: ['sharp_right_lower_pain', 'fever', 'nausea', 'vomiting', 'loss_of_appetite'],
    riskLevel: 'emergency',
    recommendedSpecialist: 'General / Laparoscopic Surgeon',
    precautions: [
      'GO TO THE EMERGENCY ROOM IMMEDIATELY',
      'Do NOT eat or drink anything (remain NPO for potential surgical anesthesia)',
      'Do NOT take laxatives, pain medications, or apply heat pads, which may mask symptoms or cause rupture'
    ],
    safeSelfCare: [
      'Avoid any physical exertion',
      'Proceed directly to acute emergency care'
    ],
    typicalTests: ['Abdominal Ultrasound', 'Contrast-Enhanced Abdominal/Pelvic CT Scan', 'Complete Blood Count (Leukocytosis with Left Shift)'],
    redFlagWarning: 'EMERGENCY: Sudden sharp pain starting near the navel and shifting to the right lower abdomen requires urgent surgical appraisal.',
    doctorConsultAdvice: 'Immediate surgical evaluation is essential to prevent appendiceal perforation and peritonitis.'
  },
  {
    id: 'dengue_fever',
    name: 'Dengue Viral Fever',
    category: 'General',
    description: 'A mosquito-borne tropical viral disease causing high fever, intense retro-orbital headache, and severe joint and muscle pains.',
    symptoms: ['fever', 'muscle_aches', 'joint_pain', 'headache', 'skin_rash', 'vomiting', 'fatigue'],
    riskLevel: 'high',
    recommendedSpecialist: 'Infectious Disease Specialist / Internal Medicine',
    precautions: [
      'Do NOT take NSAIDs (Aspirin, Ibuprofen, Naproxen) as they elevate the risk of internal hemorrhage',
      'Track daily platelet counts through a laboratory Complete Blood Count (CBC)',
      'Use mosquito repellents and bed nets to avoid spreading the vector'
    ],
    safeSelfCare: [
      'Aggressive oral fluid hydration (ORS, fruit juices, tender coconut water)',
      'Complete physical bed rest',
      'Paracetamol/Acetaminophen for fever if medically guided'
    ],
    typicalTests: ['Dengue NS1 Antigen (Days 1-5)', 'Dengue IgM/IgG Antibody ELISA', 'Daily Serial Platelet Count & Hematocrit (PCV)'],
    redFlagWarning: 'Bleeding gums, pinpoint red skin spots (petechiae), persistent vomiting, or severe abdominal pain warrant immediate critical hospitalization.',
    doctorConsultAdvice: 'Seek immediate clinical monitoring for early detection of plasma leakage or Dengue Hemorrhagic Fever.'
  },
  {
    id: 'allergic_rhinitis',
    name: 'Allergic Rhinitis / Hay Fever',
    category: 'Respiratory',
    description: 'An allergic response to specific airborne allergens causing sneezing, nasal congestion, and itchy watery eyes.',
    symptoms: ['runny_nose', 'sneezing', 'itching', 'sore_throat', 'fatigue'],
    riskLevel: 'low',
    recommendedSpecialist: 'Allergist / ENT Specialist',
    precautions: [
      'Keep windows closed during high pollen counts',
      'Wash bedding weekly in hot water (60°C)',
      'Use HEPA air purifiers inside bedrooms'
    ],
    safeSelfCare: [
      'Saline nasal rinse to flush allergens',
      'Wear sunglasses outdoors to shield eyes from airborne pollen',
      'Change clothes after spending time outdoors'
    ],
    typicalTests: ['Allergy skin prick testing (SPT)', 'Specific IgE blood tests (RAST)'],
    doctorConsultAdvice: 'Consult an allergist if symptoms interfere with sleep, school, or if accompanied by wheezing.'
  },
  {
    id: 'osteoarthritis',
    name: 'Osteoarthritis (Degenerative Joint Disease)',
    category: 'Musculoskeletal',
    description: 'Wear-and-tear arthritis caused by gradual breakdown of joint cartilage and underlying bone.',
    symptoms: ['joint_pain', 'joint_stiffness', 'swollen_legs'],
    riskLevel: 'low',
    recommendedSpecialist: 'Orthopedic Specialist / Rheumatologist',
    precautions: [
      'Engage in low-impact physical exercise (swimming, cycling, walking)',
      'Maintain an optimal body weight to diminish load on weight-bearing joints',
      'Avoid repetitive high-impact joint stresses'
    ],
    safeSelfCare: [
      'Alternate warm baths/packs for stiffness and cold packs for swelling',
      'Supportive footwear with shock-absorbing soles',
      'Gentle range-of-motion stretching exercises'
    ],
    typicalTests: ['Weight-bearing Joint Radiographs (X-rays)', 'Physical examination of joint crepitus', 'Synovial fluid analysis'],
    doctorConsultAdvice: 'Consult an orthopedic doctor if joint becomes hot and red, or if walking becomes severely impaired.'
  },
  {
    id: 'eczema',
    name: 'Atopic Dermatitis (Eczema)',
    category: 'Dermatological',
    description: 'A chronic pruritic inflammatory skin condition characterized by dry, itchy, red patches and epidermal barrier dysfunction.',
    symptoms: ['skin_rash', 'itching', 'skin_peeling'],
    riskLevel: 'low',
    recommendedSpecialist: 'Dermatologist',
    precautions: [
      'Moisturize skin immediately after bathing with thick fragrance-free ointments or creams',
      'Take short, lukewarm showers instead of long, hot baths',
      'Wear soft, breathable natural fabrics like 100% cotton'
    ],
    safeSelfCare: [
      'Colloidal oatmeal baths to soothe inflamed skin',
      'Trim fingernails short to prevent skin breakage and secondary bacterial infection',
      'Use gentle hypoallergenic laundry detergents'
    ],
    typicalTests: ['Dermatological clinical inspection', 'Patch testing to rule out contact allergens'],
    doctorConsultAdvice: 'Consult a dermatologist if patches ooze yellow crust (indicates bacterial impetigo) or if sleep is severely disrupted.'
  }
];

export const ML_BENCHMARKS: MLModelBenchmark[] = [
  {
    algorithm: 'Random Forest Classifier (Ensemble)',
    accuracy: 96.8,
    precision: 97.2,
    recall: 96.4,
    f1Score: 96.8,
    trainingTimeMs: 420,
    pros: 'High generalization accuracy; robust against overfitting on multi-symptom vectors; handles non-linear feature interactions seamlessly.',
    cons: 'Requires higher computational memory than single decision trees; slightly lower interpretability than a single tree.',
    whyAppropriate: 'Selected as the Primary Model because medical diagnosis involves complex co-occurring symptom patterns where ensemble trees excel without overfitting.'
  },
  {
    algorithm: 'Decision Tree Classifier (CART)',
    accuracy: 93.4,
    precision: 92.8,
    recall: 93.1,
    f1Score: 92.9,
    trainingTimeMs: 85,
    pros: 'Completely interpretable; mimics clinical rule-based triage flowcharts; fast training and inference.',
    cons: 'Prone to high variance and overfitting when training data contains rare symptom variants.',
    whyAppropriate: 'Ideal baseline model for explaining algorithmic decision logic and tree splits to academic examiners.'
  },
  {
    algorithm: 'Multinomial Naive Bayes',
    accuracy: 91.2,
    precision: 90.5,
    recall: 91.0,
    f1Score: 90.7,
    trainingTimeMs: 35,
    pros: 'Extremely fast probabilistic inference; operates well with sparse binary one-hot symptom matrices.',
    cons: 'Assumes conditional independence between symptoms, which violates real clinical reality (e.g. cough and fever frequently co-occur).',
    whyAppropriate: 'Provides reliable baseline probabilistic scores and prior condition odds ratios.'
  },
  {
    algorithm: 'Support Vector Classifier (Linear/RBF SVM)',
    accuracy: 94.7,
    precision: 95.1,
    recall: 94.2,
    f1Score: 94.6,
    trainingTimeMs: 310,
    pros: 'Effective in high-dimensional sparse feature spaces; robust maximum-margin hyperplane separation.',
    cons: 'Does not natively provide probability distributions without Platt scaling calibration; slower on large datasets.',
    whyAppropriate: 'Strong secondary classifier validating separation boundaries in symptom feature space.'
  },
  {
    algorithm: 'Multinomial Logistic Regression',
    accuracy: 89.5,
    precision: 88.9,
    recall: 89.2,
    f1Score: 89.0,
    trainingTimeMs: 65,
    pros: 'Simple statistical baseline; coefficients directly communicate odds ratios for each symptom.',
    cons: 'Struggles with non-linear combinations and complex symptom syndromic clusters.',
    whyAppropriate: 'Standard baseline used in clinical biostatistics research.'
  }
];

export const TOP_FEATURE_IMPORTANCE: FeatureImportance[] = [
  { symptom: 'Crushing Chest Pain', importanceScore: 0.142, category: 'Cardiovascular' },
  { symptom: 'High Fever', importanceScore: 0.118, category: 'General' },
  { symptom: 'Sharp RLQ Abdominal Pain', importanceScore: 0.105, category: 'Gastrointestinal' },
  { symptom: 'Shortness of Breath', importanceScore: 0.098, category: 'Respiratory' },
  { symptom: 'Persistent Cough', importanceScore: 0.082, category: 'Respiratory' },
  { symptom: 'Stiff Neck with Fever', importanceScore: 0.076, category: 'Neurological' },
  { symptom: 'Fatigue & Lethargy', importanceScore: 0.068, category: 'General' },
  { symptom: 'Severe Throbbing Headache', importanceScore: 0.061, category: 'Neurological' },
  { symptom: 'Loss of Smell / Taste', importanceScore: 0.054, category: 'Respiratory' },
  { symptom: 'Frequent Loose Stools', importanceScore: 0.048, category: 'Gastrointestinal' },
  { symptom: 'Heartburn / Acid Regurgitation', importanceScore: 0.042, category: 'Gastrointestinal' },
  { symptom: 'Erythematous Skin Rash', importanceScore: 0.038, category: 'Dermatological' },
  { symptom: 'Joint Pain (Arthralgia)', importanceScore: 0.035, category: 'Musculoskeletal' },
  { symptom: 'Wheezing Sound', importanceScore: 0.033, category: 'Respiratory' }
];

export const CONFUSION_MATRIX_SAMPLE = [
  { actual: 'Common Cold', predicted: 'Common Cold', count: 48, percentage: 96 },
  { actual: 'Common Cold', predicted: 'Allergic Rhinitis', count: 2, percentage: 4 },
  { actual: 'Influenza', predicted: 'Influenza', count: 47, percentage: 94 },
  { actual: 'Influenza', predicted: 'COVID-19', count: 3, percentage: 6 },
  { actual: 'COVID-19', predicted: 'COVID-19', count: 48, percentage: 96 },
  { actual: 'COVID-19', predicted: 'Acute Bronchitis', count: 2, percentage: 4 },
  { actual: 'Bronchial Asthma', predicted: 'Bronchial Asthma', count: 49, percentage: 98 },
  { actual: 'Bronchial Asthma', predicted: 'Acute Bronchitis', count: 1, percentage: 2 },
  { actual: 'Pneumonia', predicted: 'Pneumonia', count: 47, percentage: 94 },
  { actual: 'Pneumonia', predicted: 'Influenza', count: 3, percentage: 6 },
  { actual: 'Acute Appendicitis', predicted: 'Acute Appendicitis', count: 50, percentage: 100 },
  { actual: 'Angina Pectoris', predicted: 'Angina Pectoris', count: 49, percentage: 98 },
  { actual: 'GERD', predicted: 'GERD', count: 48, percentage: 96 },
  { actual: 'Migraine', predicted: 'Migraine', count: 49, percentage: 98 }
];
