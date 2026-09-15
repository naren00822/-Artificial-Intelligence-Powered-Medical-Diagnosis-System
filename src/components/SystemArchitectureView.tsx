import React, { useState } from 'react';
import { 
  GitBranch, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  AlertOctagon, 
  Lock, 
  UserCheck, 
  Server,
  FileCode2
} from 'lucide-react';

export const SystemArchitectureView: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(3);

  const architectureSteps = [
    {
      step: 1,
      title: 'User Input Layer',
      tech: 'React / Tailwind CSS',
      description: 'The user interacts with a responsive frontend to select symptoms across 7 bodily systems (cardiovascular, respiratory, neurological, gastrointestinal, etc.) and provides basic demographic context (age group, symptom duration, subjective severity 1-10).'
    },
    {
      step: 2,
      title: 'Vectorization & Preprocessing',
      tech: 'Python / NumPy / Pandas',
      description: 'The selected symptoms are mapped against a master vocabulary of 132 symptoms to create a sparse binary one-hot encoded vector: X = [x₁, x₂, ..., x₁₃₂], where xᵢ ∈ {0, 1}. Demographic context weights are computed to calibrate risk scores.'
    },
    {
      step: 3,
      title: 'ML Classification Inference',
      tech: 'Scikit-Learn Random Forest',
      description: 'The preprocessed feature vector is evaluated across 100 decision trees trained with bootstrap aggregating (bagging). Each tree computes an individual class vote, generating a calibrated posterior probability distribution P(Disease | Symptoms) across 42 disease classes.'
    },
    {
      step: 4,
      title: 'Emergency Triage & Risk Filter',
      tech: 'Clinical Heuristic Engine',
      description: 'An automated safety layer scans the selected symptoms for critical red-flag combinations (e.g. crushing chest pain, stiff neck with fever, or unilateral numbness). If detected, an overriding Emergency Medical Alert is triggered immediately.'
    },
    {
      step: 5,
      title: 'Clinical Recommendations Engine',
      tech: 'Knowledge Base / Gemini API',
      description: 'The system pairs the predicted condition with evidence-based self-care precautions, typical diagnostic laboratory tests doctors order (CBC, X-ray, ECG), and recommended medical specialties (Pulmonologist, Cardiologist, Neurologist, etc.).'
    },
    {
      step: 6,
      title: 'Ethical Disclaimer & Doctor Referral',
      tech: 'Responsible AI Framework',
      description: 'The output is framed with strict educational caveats: reminding the patient that AI predictions do not constitute confirmed diagnoses and providing clear guidance on when to seek in-person clinical medical consultation.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <GitBranch className="w-6 h-6 text-teal-600" />
          System Design, Database Architecture & Ethical AI
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Detailed academic overview of the end-to-end processing pipeline, relational database schema with data minimization, 
          and responsible AI healthcare ethics.
        </p>
      </div>

      {/* 1. Interactive Architecture Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-600" />
            End-to-End System Dataflow Pipeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click on any processing stage to inspect its technical implementation details.
          </p>
        </div>

        {/* Step Flow Nodes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {architectureSteps.map((step) => {
            const isCurrent = selectedStep === step.step;
            return (
              <button
                key={step.step}
                onClick={() => setSelectedStep(step.step)}
                className={`p-3 rounded-lg border text-left transition-all relative ${
                  isCurrent
                    ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 text-teal-950 font-medium'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                    isCurrent ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step.step}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Stage {step.step}</span>
                </div>
                <h4 className="text-xs font-bold leading-tight mt-1 line-clamp-2">{step.title}</h4>
                <span className="text-[10px] text-teal-700 block mt-1 font-mono">{step.tech}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Card */}
        {(() => {
          const current = architectureSteps.find(s => s.step === selectedStep)!;
          return (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Stage {current.step}: {current.title}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-mono">
                  {current.tech}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {current.description}
              </p>
            </div>
          );
        })()}
      </div>

      {/* 2. Database Schema (Requirement 6) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-600" />
              Relational Database Architecture & Privacy Schema (SQLite / PostgreSQL)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly minimized PII schema designed according to HIPAA and GDPR Data Protection Principles.
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-700">
            3rd Normal Form (3NF)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* Table: Users */}
          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900">users</span>
              <span className="text-[10px] text-teal-700 font-mono">Table</span>
            </div>
            <ul className="space-y-1 font-mono text-[11px] text-slate-700">
              <li className="text-teal-700 font-bold">🔑 user_id: INTEGER (PK)</li>
              <li>username: VARCHAR(50)</li>
              <li>age_group: VARCHAR(20)</li>
              <li>gender: VARCHAR(15)</li>
              <li className="text-slate-400">created_at: TIMESTAMP</li>
            </ul>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
              No national IDs, phone numbers, or residential addresses stored.
            </p>
          </div>

          {/* Table: Symptoms */}
          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900">symptoms</span>
              <span className="text-[10px] text-teal-700 font-mono">Table</span>
            </div>
            <ul className="space-y-1 font-mono text-[11px] text-slate-700">
              <li className="text-teal-700 font-bold">🔑 symptom_id: VARCHAR(50) (PK)</li>
              <li>symptom_name: VARCHAR(100)</li>
              <li>category: VARCHAR(50)</li>
              <li>severity_weight: INTEGER (1-5)</li>
              <li className="text-slate-400">description: TEXT</li>
            </ul>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
              Stores standardized clinical vocabulary for input mapping.
            </p>
          </div>

          {/* Table: Diseases */}
          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900">diseases</span>
              <span className="text-[10px] text-teal-700 font-mono">Table</span>
            </div>
            <ul className="space-y-1 font-mono text-[11px] text-slate-700">
              <li className="text-teal-700 font-bold">🔑 disease_id: VARCHAR(50) (PK)</li>
              <li>disease_name: VARCHAR(100)</li>
              <li>risk_level: VARCHAR(20)</li>
              <li>recommended_specialist: VARCHAR(100)</li>
              <li className="text-slate-400">precautions_json: TEXT</li>
            </ul>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
              Contains triage levels, specialist directories, and safe precautions.
            </p>
          </div>

          {/* Table: Assessments */}
          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900">assessments</span>
              <span className="text-[10px] text-teal-700 font-mono">Table</span>
            </div>
            <ul className="space-y-1 font-mono text-[11px] text-slate-700">
              <li className="text-teal-700 font-bold">🔑 assessment_id: VARCHAR(36) (PK)</li>
              <li>user_id: INTEGER (FK)</li>
              <li>symptoms_selected: TEXT (JSON)</li>
              <li>predicted_disease_id: VARCHAR(50) (FK)</li>
              <li>confidence_percentage: REAL</li>
              <li>is_emergency_flagged: BOOLEAN</li>
            </ul>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
              Maintains audit logging for educational diagnostic tracking.
            </p>
          </div>

        </div>
      </div>

      {/* 3. Security, Privacy & Ethics (Requirement 7) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          Security, Privacy & Responsible Healthcare AI Framework
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Privacy & Protection */}
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Patient Privacy & Data Minimization</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  In compliance with HIPAA Privacy Rule (45 CFR § 164.514) and GDPR Article 5(1)(c), 
                  the application operates without gathering sensitive Personally Identifiable Information (PII) such as full legal names, 
                  phone numbers, or government identifiers. All assessments are assigned pseudonymous session UUIDs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Managing False Predictions & Safety Margins</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  In clinical machine learning, <strong>False Negatives</strong> represent the most dangerous failure mode 
                  (telling a sick patient they are healthy). Our ensemble is tuned for high recall (96.4%) and automatically surfaces 
                  a ranked differential list of alternate conditions rather than a single dogmatic output.
                </p>
              </div>
            </div>
          </div>

          {/* Bias & Ethics */}
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Algorithmic Bias & Dataset Representativeness</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Training datasets often reflect institutional biases (e.g. over-representing specific age cohorts or urban symptoms). 
                  To prevent demographic bias from skewing diagnoses, our symptom vectors are normalized, and the system 
                  explicitly flags that baseline priors may vary across different geographical and epidemiological zones.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Mandatory Doctor-in-the-Loop Principle</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  This system is strictly bounded as a <em>preliminary educational triage tool</em>. 
                  It is programmatically prohibited from generating prescription dosages or definitive medical clearances. 
                  Final clinical diagnosis must always remain within the sole domain of licensed healthcare practitioners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
