import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Sparkles, 
  Clock, 
  Target, 
  Activity, 
  Flame, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SymptomGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SymptomGuideModal: React.FC<SymptomGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'opqrst' | 'comparisons' | 'checklist'>('rules');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="symptom-guide-title"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            type="button"
            id="close-symptom-guide-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close guide modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="symptom-guide-title" className="text-lg font-bold text-white">
                  How to Provide Accurate Symptom Descriptions
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  AI Accuracy Guide
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Guidance on structuring your symptoms, timeline, and vitals to help our diagnostic ensemble (Random Forest, SVM, Naive Bayes) generate precise, actionable assessments.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar border-b border-slate-800 pb-1 text-xs">
            <button
              type="button"
              id="tab-guide-rules"
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'rules'
                  ? 'bg-teal-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>5 Golden Rules</span>
            </button>
            <button
              type="button"
              id="tab-guide-opqrst"
              onClick={() => setActiveTab('opqrst')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'opqrst'
                  ? 'bg-teal-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>The OPQRST Method</span>
            </button>
            <button
              type="button"
              id="tab-guide-comparisons"
              onClick={() => setActiveTab('comparisons')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'comparisons'
                  ? 'bg-teal-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Good vs. Poor Examples</span>
            </button>
            <button
              type="button"
              id="tab-guide-checklist"
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'checklist'
                  ? 'bg-teal-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quality Checklist</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 text-slate-800">
          {/* TAB 1: 5 GOLDEN RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-xs text-teal-900 leading-relaxed flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Why Precision Matters:</strong> Machine learning clinical decision trees weigh symptom combinations together. Providing specific cardinal symptoms with proper duration and vitals enables high-confidence disease discrimination and triggers essential drug safety warnings.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rule 1 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                    <h4 className="text-xs font-bold text-slate-900">Focus on the Primary &quot;Chief Complaint&quot;</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Identify the main symptom causing you the most concern (e.g. crushing chest pain, high fever, or wheezing). Select that first, then add the accompanying symptoms directly linked to this episode.
                  </p>
                </div>

                {/* Rule 2 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                    <h4 className="text-xs font-bold text-slate-900">Aim for 2 to 5 Correlated Symptoms</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Selecting only 1 symptom is too broad and leads to wide uncertainty. Selecting more than 8-10 unrelated complaints can introduce statistical noise. <strong>2 to 5 specific symptoms</strong> provides optimal diagnostic specificity.
                  </p>
                </div>

                {/* Rule 3 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                    <h4 className="text-xs font-bold text-slate-900">Accurately Set Duration & Timeline</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Duration fundamentally changes diagnostic probabilities. A cough lasting 3 days indicates acute viral or bacterial respiratory infection, whereas a cough lasting 45+ days points towards chronic etiologies (e.g. GERD, asthma, or COPD).
                  </p>
                </div>

                {/* Rule 4 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                    <h4 className="text-xs font-bold text-slate-900">Include Objective Vital Signs</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Bedside vitals (heart rate, blood pressure, temperature, oxygen saturation SpO2) activate our <strong>NEWS2 and qSOFA</strong> early warning engines, identifying physiological deterioration or sepsis before symptoms alone might.
                  </p>
                </div>

                {/* Rule 5 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">5</span>
                    <h4 className="text-xs font-bold text-slate-900">Never Exclude Red-Flag Symptoms</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Symptoms like sudden shortness of breath, radiating arm or jaw pain, acute confusion, or high fever with neck stiffness are critical clinical indicators. Even if subtle, always select them to ensure emergency triage alerts trigger.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THE OPQRST METHOD */}
          {activeTab === 'opqrst' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700">
                <p className="font-semibold text-slate-900 mb-1">
                  The Clinical OPQRST Assessment Framework
                </p>
                <p className="text-[11px] text-slate-600">
                  Physicians and emergency medical technicians use the OPQRST mnemonic during patient history-taking. Thinking through these six dimensions ensures you choose the most accurate symptoms:
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center shrink-0">
                    O
                  </div>
                  <div className="text-xs">
                    <strong className="text-slate-900 block">Onset (When and how did it start?)</strong>
                    <span className="text-slate-600 text-[11px]">
                      Did symptoms emerge suddenly like a thunderclap (acute, e.g. myocardial infarction or kidney stones) or gradually over days (insidious, e.g. walking pneumonia or viral prodrome)? Use the Duration slider accordingly.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center shrink-0">
                    P
                  </div>
                  <div className="text-xs">
                    <strong className="text-slate-900 block">Provocation / Palliation (What makes it better or worse?)</strong>
                    <span className="text-slate-600 text-[11px]">
                      Does exertion worsen chest pain? Does lying flat worsen shortness of breath (orthopnea)? Does eating trigger abdominal discomfort? These details distinguish cardiac, respiratory, and gastrointestinal conditions.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center shrink-0">
                    Q
                  </div>
                  <div className="text-xs">
                    <strong className="text-slate-900 block">Quality (How does it feel?)</strong>
                    <span className="text-slate-600 text-[11px]">
                      Describe the sensation: Sharp, stabbing, dull ache, burning, pressure, or tightness. For instance, &quot;tight retrosternal pressure&quot; vs. &quot;sharp pleuritic pain on inspiration&quot; lead to entirely different clinical hypotheses.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center shrink-0">
                    R
                  </div>
                  <div className="text-xs">
                    <strong className="text-slate-900 block">Region &amp; Radiation (Where is it, does it travel?)</strong>
                    <span className="text-slate-600 text-[11px]">
                      Does pain stay localized or radiate to the neck, left arm, back, or groin? Pain radiating to the left arm points toward cardiac ischemia; pain radiating from the flank to the groin suggests nephrolithiasis.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center shrink-0">
                    S
                  </div>
                  <div className="text-xs">
                    <strong className="text-slate-900 block">Severity (How intense is it?)</strong>
                    <span className="text-slate-600 text-[11px]">
                      Use the 1 to 10 numerical pain and distress rating scale. A score of 8-10 automatically triggers high-urgency clinical escalation in our triage matrix.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center shrink-0">
                    T
                  </div>
                  <div className="text-xs">
                    <strong className="text-slate-900 block">Timing (Is it constant, episodic, or cyclical?)</strong>
                    <span className="text-slate-600 text-[11px]">
                      Does the fever spike at night? Are asthma symptoms worse at 4 AM? Does migraine pain pulse for 4 to 72 hours?
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GOOD VS POOR EXAMPLES */}
          {activeTab === 'comparisons' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Observe how varying symptom input precision impacts the machine learning confidence and clinical utility of the assessment:
              </p>

              {/* Comparison Case 1: Cardiac vs Indigestion */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-2.5 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-800">
                  Scenario A: Suspected Cardiac Emergency
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-xs">
                  {/* Poor Input */}
                  <div className="p-4 bg-rose-50/40 space-y-2">
                    <div className="flex items-center gap-1.5 text-rose-800 font-bold text-[11px] uppercase">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Low Precision Input (Vague)
                    </div>
                    <p className="text-[11px] text-slate-700">
                      <strong>Selected:</strong> Fatigue, Nausea (2 symptoms)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      <strong>AI Result:</strong> Low confidence differential (Gastroenteritis 38%, Migraine 24%). Emergency cardiac condition is completely missed due to missing cardinal indicators.
                    </p>
                  </div>

                  {/* Good Input */}
                  <div className="p-4 bg-emerald-50/40 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      High Precision Input (Clinically Accurate)
                    </div>
                    <p className="text-[11px] text-slate-700">
                      <strong>Selected:</strong> Chest Pain + Shortness of Breath + Sweating + Nausea
                    </p>
                    <p className="text-[11px] text-slate-700">
                      <strong>AI Result:</strong> Myocardial Infarction predicted with <strong>94% confidence</strong>, ensemble consensus 4/4 models, immediate Red-Flag Emergency alert, and Aspirin/Nitroglycerin contraindication audit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison Case 2: Tropical Febrile Illness */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-2.5 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-800">
                  Scenario B: Febrile Vector-Borne Infection
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-xs">
                  {/* Poor Input */}
                  <div className="p-4 bg-rose-50/40 space-y-2">
                    <div className="flex items-center gap-1.5 text-rose-800 font-bold text-[11px] uppercase">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Low Precision Input
                    </div>
                    <p className="text-[11px] text-slate-700">
                      <strong>Selected:</strong> Fever only (1 symptom)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      <strong>AI Result:</strong> Generic Common Cold / Viral Syndrome (32% confidence). Crucial hemorrhagic risks are unflagged.
                    </p>
                  </div>

                  {/* Good Input */}
                  <div className="p-4 bg-emerald-50/40 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      High Precision Input
                    </div>
                    <p className="text-[11px] text-slate-700">
                      <strong>Selected:</strong> High Fever + Severe Joint/Bone Pain + Behind-the-Eyes Headache + Rash
                    </p>
                    <p className="text-[11px] text-slate-700">
                      <strong>AI Result:</strong> Dengue Fever identified with <strong>91% confidence</strong>. System instantly triggers a <strong>CRITICAL NSAID / Ibuprofen warning</strong> due to severe bleeding hazards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QUALITY CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-xs text-teal-900">
                <p className="font-bold mb-1">Pre-Assessment Clinical Quality Self-Audit</p>
                <p className="text-[11px] text-teal-800/90">
                  Before clicking &quot;Run Medical Diagnosis,&quot; verify that your input satisfies these four clinical dimensions:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">1. Cardinal Symptom Anchor</strong>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Have you selected the central defining symptom that brought on this episode?
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">2. Associated Findings (2 to 5 total)</strong>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Did you include concurrent symptoms (e.g. fever + chills, or cough + sputum)?
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">3. Accurate Duration &amp; Pain Scale</strong>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Is the number of days since first onset set realistically on the duration slider?
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">4. Vital Signs Reviewed</strong>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      If you have measured temperature, heart rate, or pulse oximetry at home, are they reflected in the Bedside Vitals panel?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono shadow-2xs">ESC</kbd> or click outside to dismiss.
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              id="got-it-symptom-guide-btn"
              onClick={onClose}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Understood &amp; Return to Triage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
