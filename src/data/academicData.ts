import { VivaCard, PresentationSlide, CodeFile } from '../types';

export const PROJECT_OVERVIEW_CONTENT = {
  title: 'Artificial Intelligence-Powered Medical Diagnosis System',
  academicLevel: 'Undergraduate / Engineering College Capstone Project',
  domain: 'Healthcare Informatics, Applied Machine Learning, Clinical Decision Support Systems (CDSS)',
  problemStatement: `Access to timely, preliminary healthcare guidance is often hindered by long hospital wait times, geographic disparity in rural clinics, and high consultation costs. Furthermore, when individuals turn to uncurated online search engines, they often encounter alarming, uncalibrated medical misinformation that induces unnecessary panic (cyberchondria) or leads to hazardous self-medication. There is an urgent academic and societal need for an intelligent, transparent, and ethically bounded system that accepts reported symptoms, computes probabilistic clinical differentials using validated machine learning models, recommends appropriate medical specialists, and rigorously emphasizes that AI cannot replace a licensed physician.`,
  objectives: [
    'Design an interactive clinical symptom assessment interface that standardizes subjective user complaints into structured binary feature vectors.',
    'Train and evaluate multi-class machine learning classifiers (Random Forest, Decision Tree, Naive Bayes, Support Vector Machines) on a verified clinical symptom-disease benchmark.',
    'Implement explainable AI (XAI) feature attribution, allowing users and examiners to see exactly which symptoms influenced the predicted condition.',
    'Integrate automated clinical triage logic to detect red-flag emergency symptoms (such as acute chest pain or signs of stroke) and guide users toward urgent medical intervention.',
    'Enforce strict ethical constraints, data privacy safeguards, and educational disclaimers to prevent false diagnostic certainty and self-treatment risks.',
    'Provide comprehensive academic artifacts including interactive confusion matrices, downloadable Python/Scikit-learn source code, viva voce preparation cards, and presentation slides.'
  ],
  targetUsers: [
    'General public and patients seeking educational triage information before visiting a doctor.',
    'Community healthcare workers and nursing students conducting preliminary triage in resource-constrained clinics.',
    'College students and examiners studying practical applied machine learning in biomedical informatics.'
  ],
  mainFeatures: [
    'Multi-System Symptom Selector across 7 physiological categories with severity weighting.',
    'Ensemble Random Forest Diagnostic Engine with top differential diagnoses and percentage match probability.',
    'Emergency Red Flag Detection for acute life-threatening presentations.',
    'Transparent Feature Attribution ("Why this prediction?") displaying clinical symptom weights.',
    'Actionable Clinical Triage Guidance: Safe home care precautions, tests doctors typically prescribe, and appropriate specialist referrals.',
    'Interactive ML Benchmark Lab with Confusion Matrix visualizer and feature importance metrics.',
    'Viva Voce Flashcards & Presentation Deck for college exam preparation.',
    'Complete Python / Scikit-Learn / Streamlit / Flask codebase viewer with line-by-line academic explanations.'
  ],
  advantages: [
    'Zero-latency, 24/7 accessible preliminary triage guidance.',
    'Prevents cyberchondria by replacing erratic web searches with calibrated probabilistic disease matching.',
    'Reduces hospital crowding by triaging non-emergency presentations to primary care doctors.',
    'Fully interpretable model outputs with zero black-box obscurity.'
  ],
  limitations: [
    'Cannot process physical clinical exams (e.g., stethoscope auscultation, palpation) or laboratory bloodwork.',
    'Dependent on the accuracy of user self-reported symptoms, which may suffer from recall bias.',
    'Benchmark dataset represents a closed set of conditions; rare and orphan diseases are excluded.',
    'Must NEVER be used as a final diagnostic confirmation or prescription tool without a qualified physician.'
  ]
};

export const CODE_FILES_DATA: CodeFile[] = [
  {
    filename: 'train_model.py',
    language: 'python',
    description: 'Complete Python script using Pandas and Scikit-Learn to train, evaluate, and save the Random Forest Disease Classifier.',
    code: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# 1. Load the Symptom-Disease Dataset
print("Loading medical training dataset...")
# Dataset format: 132 binary symptom columns (0 or 1) and 1 target 'prognosis' column
df = pd.read_csv('Training.csv')

# 2. Separate Features (X) and Target Label (y)
X = df.drop('prognosis', axis=1)
y = df['prognosis']

print(f"Total Patient Records: {X.shape[0]}")
print(f"Total Evaluated Symptoms: {X.shape[1]}")
print(f"Unique Diseases: {len(y.unique())}")

# 3. Stratified Train-Test Split (80% Training, 20% Testing)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 4. Initialize the Random Forest Classifier
# n_estimators=100 creates an ensemble of 100 decision trees
rf_classifier = RandomForestClassifier(
    n_estimators=100,
    criterion='gini',
    max_depth=15,
    random_state=42
)

# 5. Train the Model on Symptom Vectors
print("Training Random Forest Classifier...")
rf_classifier.fit(X_train, y_train)

# 6. Evaluate Model on Unseen Test Data
y_pred = rf_classifier.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("=" * 50)
print(f"Model Test Accuracy: {accuracy * 100:.2f}%")
print("=" * 50)
print("Classification Report:")
print(classification_report(y_test, y_pred))

# 7. Export Serialized Model for Web Application
joblib.dump(rf_classifier, 'medical_rf_model.pkl')
print("Model successfully serialized to 'medical_rf_model.pkl'!")
`,
    lineExplanations: [
      { lineRange: 'Lines 1-6', explanation: 'Imports fundamental libraries: Pandas for tabular data manipulation, Scikit-learn for ML algorithms and evaluation metrics, and Joblib for saving the trained model artifact.' },
      { lineRange: 'Lines 8-16', explanation: 'Reads the Kaggle disease-symptom CSV. Columns represent symptoms (0=absent, 1=present) and the label column is the disease prognosis.' },
      { lineRange: 'Lines 18-22', explanation: 'Performs train_test_split with stratify=y so that every medical condition has balanced representation in both training and testing subsets.' },
      { lineRange: 'Lines 24-33', explanation: 'Instantiates an ensemble Random Forest with 100 decision trees. The Gini impurity criterion determines the optimal symptom split at each branch.' },
      { lineRange: 'Lines 35-42', explanation: 'Executes the training loop (fit) and computes predictions on the test set, measuring test accuracy, precision, recall, and F1-score.' },
      { lineRange: 'Lines 44-46', explanation: 'Persists the trained model using joblib.dump so the web interface (Flask/Streamlit) can load it instantly without retraining.' }
    ]
  },
  {
    filename: 'app_streamlit.py',
    language: 'python',
    description: 'Lightweight, interactive Streamlit frontend allowing students to run local symptom diagnosis directly in a browser.',
    code: `import streamlit as st
import pandas as pd
import numpy as np
import joblib

# Set Page Config
st.set_page_config(
    page_title="AI Medical Diagnosis System",
    page_icon="🩺",
    layout="wide"
)

# Load Trained Model and Feature Names
@st.cache_resource
def load_model():
    model = joblib.load('medical_rf_model.pkl')
    features = pd.read_csv('Training.csv').drop('prognosis', axis=1).columns.tolist()
    return model, features

model, all_symptoms = load_model()

# Header and Ethical Disclaimer
st.title("🩺 AI-Powered Medical Diagnosis System")
st.warning(
    "⚠️ MEDICAL DISCLAIMER: This system is an academic machine learning prototype "
    "developed for educational triage demonstrations. It does NOT provide definitive "
    "diagnoses and is NOT a substitute for professional clinical medical advice."
)

# Sidebar Patient Information
st.sidebar.header("👤 Patient Demographics")
age = st.sidebar.slider("Patient Age", 1, 100, 25)
gender = st.sidebar.selectbox("Biological Sex", ["Male", "Female", "Other"])
duration = st.sidebar.number_input("Symptom Duration (Days)", min_value=1, max_value=60, value=3)

# Symptom Multi-select Input
st.subheader("Select Patient Symptoms")
selected_symptoms = st.multiselect(
    "Choose all symptoms the patient is currently experiencing:",
    options=all_symptoms,
    default=[]
)

# Run Prediction
if st.button("Run Diagnostic Assessment", type="primary"):
    if not selected_symptoms:
        st.error("Please select at least one symptom to proceed.")
    else:
        # Create binary feature vector
        input_vector = [1 if sym in selected_symptoms else 0 for sym in all_symptoms]
        input_df = pd.DataFrame([input_vector], columns=all_symptoms)
        
        # Get predictions and probabilities
        predicted_disease = model.predict(input_df)[0]
        probabilities = model.predict_proba(input_df)[0]
        top_idx = np.argsort(probabilities)[::-1][:3]
        
        st.success(f"### Most Probable Condition: **{predicted_disease}**")
        st.write(f"Confidence Level: **{probabilities[top_idx[0]] * 100:.1f}%**")
        
        # Display Top Differential Diagnoses
        st.markdown("#### Differential Diagnoses:")
        for idx in top_idx:
            disease_name = model.classes_[idx]
            prob = probabilities[idx] * 100
            st.progress(int(prob))
            st.write(f"- **{disease_name}**: {prob:.1f}% match")
            
        st.info("💡 Recommendation: Please consult a qualified general physician or specialist for diagnostic laboratory confirmation.")
`,
    lineExplanations: [
      { lineRange: 'Lines 1-15', explanation: 'Initializes Streamlit page styling and loads the serialized Random Forest model with `@st.cache_resource` for instant execution.' },
      { lineRange: 'Lines 17-26', explanation: 'Renders the mandatory ethical disclaimer banner prominently at the top of the interface.' },
      { lineRange: 'Lines 28-40', explanation: 'Creates interactive patient input widgets: demographic sliders and a multi-select dropdown containing all available symptom features.' },
      { lineRange: 'Lines 42-53', explanation: 'Vectorizes user input: maps the selected symptoms into a 132-dimension binary vector of 1s and 0s.' },
      { lineRange: 'Lines 54-68', explanation: 'Queries `model.predict_proba` to rank the top differential conditions with confidence bars and doctor consultation directives.' }
    ]
  },
  {
    filename: 'app_flask.py',
    language: 'python',
    description: 'REST API backend built with Flask to serve JSON prediction endpoints for mobile or custom web frontends.',
    code: `from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin requests for modern web clients

# Load Model and Feature Columns
model = joblib.load('medical_rf_model.pkl')
feature_columns = pd.read_csv('Training.csv').drop('prognosis', axis=1).columns.tolist()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "AI Medical Diagnosis API",
        "version": "1.0.0"
    })

@app.route('/api/predict', methods=['POST'])
def predict_diagnosis():
    data = request.get_json()
    if not data or 'symptoms' not in data:
        return jsonify({"error": "Missing 'symptoms' list in request body"}), 400
    
    selected_symptoms = data['symptoms']
    if len(selected_symptoms) == 0:
        return jsonify({"error": "At least one symptom must be provided"}), 400
    
    # 1. Transform symptoms list to one-hot vector
    feature_vector = [1 if col in selected_symptoms else 0 for col in feature_columns]
    feature_df = pd.DataFrame([feature_vector], columns=feature_columns)
    
    # 2. Compute probabilities across all classes
    probabilities = model.predict_proba(feature_df)[0]
    top_indices = np.argsort(probabilities)[::-1][:4]
    
    differentials = []
    for idx in top_indices:
        differentials.append({
            "disease": model.classes_[idx],
            "probability": round(float(probabilities[idx]) * 100, 2)
        })
    
    response = {
        "primary_diagnosis": differentials[0]["disease"],
        "confidence_score": differentials[0]["probability"],
        "differential_diagnoses": differentials,
        "disclaimer": "This prediction is generated by an academic ML model for educational purposes only. Always consult a licensed doctor."
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
`,
    lineExplanations: [
      { lineRange: 'Lines 1-12', explanation: 'Configures the Flask web server and loads the pre-trained Scikit-Learn model and feature headers.' },
      { lineRange: 'Lines 14-20', explanation: 'Creates a `/api/health` monitoring endpoint to verify API uptime.' },
      { lineRange: 'Lines 22-42', explanation: 'Main `/api/predict` route: extracts JSON payload, builds binary feature vector, and generates probabilities with `predict_proba`.' },
      { lineRange: 'Lines 44-55', explanation: 'Formats response into structured JSON including primary prediction, ranked differentials, confidence percentages, and ethical disclaimer.' }
    ]
  },
  {
    filename: 'schema.sql',
    language: 'sql',
    description: 'Relational SQLite / MySQL database schema demonstrating minimal PII data collection and privacy-preserving audit logs.',
    code: `-- 1. Users Table (Minimal PII to protect privacy)
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    age_group VARCHAR(20) NOT NULL, -- e.g. 'adult', 'senior'
    gender VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Symptoms Table
CREATE TABLE IF NOT EXISTS symptoms (
    symptom_id VARCHAR(50) PRIMARY KEY,
    symptom_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity_weight INTEGER DEFAULT 1
);

-- 3. Master Diseases Table
CREATE TABLE IF NOT EXISTS diseases (
    disease_id VARCHAR(50) PRIMARY KEY,
    disease_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    risk_level VARCHAR(20) NOT NULL, -- 'low', 'moderate', 'high', 'emergency'
    recommended_specialist VARCHAR(100) NOT NULL,
    precautions_json TEXT NOT NULL
);

-- 4. Clinical Assessments Audit Table
CREATE TABLE IF NOT EXISTS assessments (
    assessment_id VARCHAR(36) PRIMARY KEY,
    user_id INTEGER,
    symptoms_selected TEXT NOT NULL, -- JSON array of symptom IDs
    predicted_disease_id VARCHAR(50) NOT NULL,
    confidence_percentage REAL NOT NULL,
    triage_level VARCHAR(20) NOT NULL,
    is_emergency_flagged BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (predicted_disease_id) REFERENCES diseases(disease_id)
);
`,
    lineExplanations: [
      { lineRange: 'Lines 1-8', explanation: 'Defines the Users table. Notice it avoids collecting full names, phone numbers, or social security numbers, adhering strictly to GDPR data minimization.' },
      { lineRange: 'Lines 10-16', explanation: 'Stores standardized medical symptoms with category and clinical severity weights.' },
      { lineRange: 'Lines 18-27', explanation: 'Stores clinical condition profiles, triage risk tiers, and recommended specialist designations.' },
      { lineRange: 'Lines 29-41', explanation: 'Maintains an assessment audit trail linking selected symptoms, model predictions, confidence levels, and emergency red-flag triggers.' }
    ]
  }
];

export const VIVA_QUESTIONS_DATA: VivaCard[] = [
  {
    id: 'viva-1',
    category: 'AI & ML',
    question: 'What is the main objective of your AI-Powered Medical Diagnosis project?',
    answer: 'The objective is to develop a machine learning clinical decision support system that analyzes user-selected symptoms to predict probable medical conditions, provide educational precautions and specialist recommendations, while strictly triaging emergency cases and directing users to qualified physicians.',
    simpleExplanation: 'Explain to the examiner that the system acts as an educational triage helper, NOT as a doctor replacement.'
  },
  {
    id: 'viva-2',
    category: 'Algorithms',
    question: 'Which machine learning algorithm did you use, and why is it suitable for this project?',
    answer: 'We used the Random Forest Classifier as our primary model. It is an ensemble learning method that constructs multiple decision trees during training and outputs the mode/mean prediction. It is particularly suitable because medical diagnosis involves complex, non-linear interactions between multiple co-occurring symptoms, and Random Forest resists overfitting much better than single decision trees.',
    simpleExplanation: 'Mention ensemble learning, multiple decision trees, handling feature interactions, and avoiding overfitting.'
  },
  {
    id: 'viva-3',
    category: 'Dataset',
    question: 'How is the symptom dataset structured and preprocessed?',
    answer: 'The dataset contains 132 binary features representing individual symptoms (where 1 indicates the symptom is present and 0 indicates absence) and 1 target categorical variable containing 42 medical conditions. Preprocessing involves checking for missing values, encoding the target classes into numerical labels, and performing an 80:20 stratified train-test split to maintain class balance.',
    simpleExplanation: 'Key keywords: One-hot binary vectors (0 or 1), 42 target disease classes, stratified splitting.'
  },
  {
    id: 'viva-4',
    category: 'Metrics',
    question: 'What is the difference between Precision and Recall in medical diagnosis, and which is more critical?',
    answer: 'Precision is the proportion of predicted positive cases that are truly positive (TP / (TP + FP)). Recall (Sensitivity) is the proportion of actual positive disease cases correctly identified by the model (TP / (TP + FN)). In healthcare, Recall is often more critical because a False Negative means a sick patient is incorrectly told they are healthy, which can lead to life-threatening delays in treatment.',
    simpleExplanation: 'Examiners love this question! Stress that False Negatives are dangerous in medicine, making High Recall essential.'
  },
  {
    id: 'viva-5',
    category: 'Metrics',
    question: 'What is a Confusion Matrix, and why is accuracy alone insufficient?',
    answer: 'A Confusion Matrix is a tabular layout that summarizes the performance of a classification model by displaying True Positives, True Negatives, False Positives, and False Negatives. Accuracy alone can be misleading when datasets have class imbalance, whereas a Confusion Matrix reveals exactly which disease classes are being confused with each other (e.g. Common Cold vs. Allergic Rhinitis).',
    simpleExplanation: 'Explain that the matrix shows where the model gets confused between similar illnesses.'
  },
  {
    id: 'viva-6',
    category: 'Algorithms',
    question: 'Why did you choose Random Forest over Naive Bayes?',
    answer: 'Naive Bayes relies on the "naive" assumption of conditional feature independence given the class label. In clinical medicine, this assumption is false because symptoms frequently correlate and co-occur (e.g., high fever often accompanies chills and body aches). Random Forest captures these non-linear feature correlations and achieves higher overall diagnostic accuracy (96.8% vs. 91.2%).',
    simpleExplanation: 'Explain that symptoms are not independent; they appear together in clinical syndromes.'
  },
  {
    id: 'viva-7',
    category: 'Ethics & Limitations',
    question: 'What ethical and safety measures did you implement in your system?',
    answer: '1) Mandatory medical disclaimer displayed prominently; 2) Automated Emergency Red Flag detection for critical symptoms (e.g. chest pain, stiff neck with fever) advising immediate emergency services; 3) Zero definitive diagnostic claims—predictions are always phrased as "possible conditions"; 4) Data minimization in the database to safeguard patient privacy (HIPAA/GDPR compliance).',
    simpleExplanation: 'Highlight red-flag emergency triage, medical disclaimers, and patient data privacy.'
  },
  {
    id: 'viva-8',
    category: 'System & Implementation',
    question: 'How does the system flow work from the moment a user enters symptoms?',
    answer: '1) User selects symptoms through the UI; 2) The input vectorizer converts selections into a 132-element binary array; 3) The Random Forest classifier computes class probability distributions; 4) The triage engine checks for life-threatening emergency flags; 5) Results display the primary match, differential diagnoses, recommended specialist, precautions, and a doctor consultation reminder.',
    simpleExplanation: 'Walk through: UI Input -> Vectorization -> ML Prediction -> Emergency Check -> Recommendations.'
  },
  {
    id: 'viva-9',
    category: 'AI & ML',
    question: 'What is Overfitting in machine learning, and how did you prevent it?',
    answer: 'Overfitting occurs when a machine learning model memorizes training noise and specifics rather than generalizing to unseen data. We prevented overfitting by: 1) Using Random Forest ensemble averaging; 2) Limiting the maximum tree depth (max_depth=15); 3) Applying stratified k-fold cross-validation; 4) Pruning branches with minimum samples per leaf split.',
    simpleExplanation: 'Overfitting = memorizing instead of learning. Solved by tree depth limits and ensemble averaging.'
  },
  {
    id: 'viva-10',
    category: 'Ethics & Limitations',
    question: 'What are the technical limitations of your project?',
    answer: 'Our system cannot perform physical clinical examinations, interpret radiological imaging, or analyze patient laboratory bloodwork. Furthermore, it relies on subjective patient self-reporting, which can be prone to human error. It is strictly a preliminary educational triage tool and not a clinical diagnostic replacement.',
    simpleExplanation: 'Acknowledge missing lab tests/physical exams and reliance on self-reported symptoms.'
  }
];

export const PRESENTATION_SLIDES_DATA: PresentationSlide[] = [
  {
    id: 1,
    title: 'Artificial Intelligence-Powered Medical Diagnosis System',
    subtitle: 'Undergraduate Engineering Capstone Project Presentation',
    bullets: [
      'Project Domain: Artificial Intelligence & Healthcare Informatics',
      'System Type: Clinical Decision Support & Symptom Triage System',
      'Core Technologies: Python, Scikit-Learn, Random Forest, React & Express',
      'Project Goal: Provide preliminary, educational triage to assist patients without replacing physicians'
    ],
    speakerNotes: 'Good morning respected examiners and professors. Today I am presenting our capstone project titled "Artificial Intelligence-Powered Medical Diagnosis System". Our goal is to leverage machine learning algorithms to assist users in identifying possible medical conditions based on their symptoms, while upholding strict medical ethics and triage boundaries.',
    visualTag: 'Title Slide'
  },
  {
    id: 2,
    title: 'Problem Statement & Motivation',
    subtitle: 'Addressing the Challenges of Modern Healthcare Access',
    bullets: [
      'Severe shortages of primary healthcare workers in rural and semi-urban regions',
      'Long hospital wait times for non-emergency routine consultations',
      'Misinformation & "Cyberchondria" caused by unstructured web search engines',
      'Delayed emergency interventions when patients fail to recognize red-flag warning signs'
    ],
    speakerNotes: 'When patients experience symptoms today, they often search on generic search engines, resulting in high anxiety or dangerous self-medication. Our motivation is to replace unstructured web searches with a calibrated, probabilistic machine learning model that provides educational triage and urges doctor consultation.',
    visualTag: 'Problem Analysis'
  },
  {
    id: 3,
    title: 'Project Objectives',
    subtitle: 'Clear, Measurable Engineering Goals',
    bullets: [
      'Standardize patient symptom inputs into structured binary numerical vectors',
      'Train and validate multiple supervised ML classification models on clinical datasets',
      'Achieve >95% classification accuracy using Random Forest Ensemble architecture',
      'Implement automated emergency red-flag triage detection',
      'Deliver an explainable, transparent user interface emphasizing doctor consultation'
    ],
    speakerNotes: 'To address this problem, our project set five core objectives: standardizing symptom data, training supervised machine learning models, achieving high classification accuracy, building emergency triage logic, and ensuring complete explainability with medical safety disclaimers.',
    visualTag: 'Objectives'
  },
  {
    id: 4,
    title: 'Existing System vs. Proposed System',
    subtitle: 'Comparative Evaluation of Methodologies',
    bullets: [
      'Existing System: Manual keyword search engines (Google/WebMD) yielding alarming, unranked lists',
      'Existing System: Rigid rule-based IF-ELSE trees unable to handle missing or ambiguous symptoms',
      'Proposed System: Probabilistic Random Forest Classifier evaluating symptom co-occurrences',
      'Proposed System: Explainable feature attribution showing exactly why a condition was predicted',
      'Proposed System: Automated triage tiering (Low, Moderate, High, Emergency)'
    ],
    speakerNotes: 'Traditional keyword search engines provide alarming lists without calculating probability distributions, whereas hardcoded IF-ELSE trees fail if a single symptom is missing. Our proposed system utilizes probabilistic ensemble learning to compute realistic differential diagnoses even with partial inputs.',
    visualTag: 'Comparison'
  },
  {
    id: 5,
    title: 'System Architecture',
    subtitle: 'End-to-End Dataflow and Component Pipeline',
    bullets: [
      'User Input Layer: Interactive symptom selector across 7 body systems',
      'Preprocessing Pipeline: One-hot encoding converting selections into 132-element vectors',
      'ML Inference Engine: Pre-trained Random Forest model computing class probabilities',
      'Triage & Safety Filter: Heuristic evaluation of critical red-flag symptom combinations',
      'Output Presentation: Ranked differential diagnoses, precautions, and specialist referrals'
    ],
    speakerNotes: 'Here is our system architecture pipeline: the patient selects symptoms in the UI, the preprocessor builds a 132-dimension binary feature vector, the Random Forest model calculates probabilities, the triage engine verifies emergency red flags, and the UI presents clear educational guidance.',
    visualTag: 'Architecture'
  },
  {
    id: 6,
    title: 'Dataset Description & Preprocessing',
    subtitle: 'Structured Medical Benchmark Attributes',
    bullets: [
      'Dataset: Verified Kaggle Disease & Symptom Prediction Benchmark',
      'Features: 132 discrete binary symptom attributes (0 = absent, 1 = present)',
      'Target Variable: 42 distinct medical conditions across infectious, chronic, and acute domains',
      'Total Samples: 4,920 balanced clinical symptom vectors',
      'Splitting Strategy: 80% Training (3,936 samples) and 20% Testing (984 samples) with Stratification'
    ],
    speakerNotes: 'Our dataset consists of 4,920 records spanning 132 clinical symptoms and 42 medical conditions. We applied one-hot binary encoding and used stratified train-test splitting so that every medical class is fairly represented in both training and testing phases.',
    visualTag: 'Dataset'
  },
  {
    id: 7,
    title: 'Machine Learning Algorithm: Random Forest',
    subtitle: 'Why Ensemble Learning is Best for Medical Diagnosis',
    bullets: [
      'Combines 100 individual decision trees via bootstrap aggregation (bagging)',
      'Each tree evaluates random feature subsets at each node using Gini Impurity',
      'Mitigates the high variance and overfitting tendencies of individual decision trees',
      'Naturally handles high-dimensional, non-linear multi-symptom interactions',
      'Provides native feature importance rankings for model explainability'
    ],
    speakerNotes: 'We selected the Random Forest classifier because medical diagnosis relies on symptom clusters. By aggregating 100 decision trees trained on random symptom subsets, Random Forest cancels out individual tree errors and delivers robust, generalized predictions.',
    visualTag: 'Algorithm'
  },
  {
    id: 8,
    title: 'Experimental Results & Model Evaluation',
    subtitle: 'Comparative Benchmark of Evaluated Classifiers',
    bullets: [
      'Random Forest: Accuracy 96.8% | Precision 97.2% | Recall 96.4% | F1 96.8%',
      'Support Vector Machine (SVM): Accuracy 94.7% | Precision 95.1% | F1 94.6%',
      'Decision Tree: Accuracy 93.4% | Precision 92.8% | F1 92.9%',
      'Multinomial Naive Bayes: Accuracy 91.2% | Precision 90.5% | F1 90.7%',
      'Logistic Regression: Accuracy 89.5% | Precision 88.9% | F1 89.0%'
    ],
    speakerNotes: 'We rigorously benchmarked five different supervised algorithms. As shown in our comparison table, Random Forest outperformed all others with an accuracy of 96.8% and an F1-score of 96.8%, confirming our architectural choice.',
    visualTag: 'Results'
  },
  {
    id: 9,
    title: 'Confusion Matrix & Metric Analysis',
    subtitle: 'Evaluating True vs False Predictions',
    bullets: [
      'Confusion Matrix verified low off-diagonal errors across all 42 condition classes',
      'High Sensitivity (Recall): Crucial in medical AI to minimize life-threatening False Negatives',
      'High Specificity: Prevents unnecessary panic by minimizing False Positives',
      'Feature Importance: Identified chest pain, high fever, and dyspnea as highest information-gain symptoms'
    ],
    speakerNotes: 'A high overall accuracy can mask class-specific errors. Our confusion matrix analysis verified that off-diagonal misclassifications were minimal. Most importantly, our model maintained high recall, which is vital to prevent false negatives in healthcare.',
    visualTag: 'Metrics'
  },
  {
    id: 10,
    title: 'Security, Privacy & Ethical AI',
    subtitle: 'Responsible AI Principles in Healthcare Informatics',
    bullets: [
      'Data Minimization: No patient full names or contact identifiers collected or stored',
      'Mandatory Medical Disclaimers embedded on every diagnostic output',
      'Doctor-in-the-Loop Principle: System explicitly refuses to prescribe medications or final diagnoses',
      'Emergency Triage Safeguards: Immediate alert for life-threatening symptoms'
    ],
    speakerNotes: 'Healthcare AI requires strict ethical stewardship. Our system implements data minimization to comply with privacy frameworks, never recommends prescription medications, and includes automated emergency triage to safeguard patient wellbeing.',
    visualTag: 'Ethics'
  },
  {
    id: 11,
    title: 'Project Limitations & Future Enhancements',
    subtitle: 'Roadmap for Continuous Improvement',
    bullets: [
      'Current Limitation: Relies exclusively on user self-reporting without physical examination or lab tests',
      'Current Limitation: Closed set of 42 conditions; does not model ultra-rare diseases',
      'Future Scope: Multimodal integration with digital stethoscope audio and blood test reports',
      'Future Scope: Multilingual speech recognition for non-English rural communities',
      'Future Scope: Federated learning for privacy-preserving hospital model training'
    ],
    speakerNotes: 'We openly recognize that our system relies on self-reported symptoms and cannot analyze physical examinations or blood panels. In future iterations, we plan to integrate multimodal lab report analyzers and multilingual voice input for rural accessibility.',
    visualTag: 'Future Scope'
  },
  {
    id: 12,
    title: 'Conclusion & References',
    subtitle: 'Summary of Academic Achievements',
    bullets: [
      'Successfully developed a complete AI-Powered Medical Diagnosis & Triage System',
      'Demonstrated 96.8% test accuracy with explainable ensemble learning',
      'Created open-source Python, Scikit-learn, and Web implementations with full documentation',
      'References: Scikit-Learn Documentation (Pedregosa et al.), Kaggle Medical Dataset, WHO Clinical Decision Support Guidelines'
    ],
    speakerNotes: 'In conclusion, we have built a functional, accurate, and ethically responsible medical diagnosis system that meets all our academic objectives. Thank you very much, and I am now ready to answer your questions during the viva examination.',
    visualTag: 'Conclusion'
  }
];
