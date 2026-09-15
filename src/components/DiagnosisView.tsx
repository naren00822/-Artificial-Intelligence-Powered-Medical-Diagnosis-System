import React, { useState } from 'react';
import { 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Activity, 
  HelpCircle, 
  Sparkles, 
  Printer, 
  RotateCcw, 
  User, 
  Clock, 
  HeartHandshake, 
  ChevronRight,
  Send,
  Loader2,
  Stethoscope,
  Lightbulb,
  History,
  Bookmark,
  BarChart2
} from 'lucide-react';
import { SYMPTOMS_DATASET } from '../data/medicalData';
import { PatientProfile, DiagnosisResult, RiskLevel, PatientVitals, ClinicalVignette, SavedAssessment } from '../types';
import { runMedicalDiagnosis } from '../services/diagnosisEngine';
import { DEFAULT_HEALTHY_VITALS } from '../services/clinicalVitalsEngine';
import { getAssessmentHistory, saveAssessmentToHistory } from '../services/historyStorage';
import { MedicalDisclaimerGate } from './MedicalDisclaimerGate';
import { VitalsInputPanel } from './VitalsInputPanel';
import { CaseVignettesSelector } from './CaseVignettesSelector';
import { MultiModelComparisonCard } from './MultiModelComparisonCard';
import { DrugSafetyCard } from './DrugSafetyCard';
import { ExplainableAIVisualizer } from './ExplainableAIVisualizer';
import { SymptomGuideModal } from './SymptomGuideModal';
import { SymptomQualityTooltip } from './SymptomQualityTooltip';
import { AssessmentHistoryDrawer } from './AssessmentHistoryDrawer';
import { SymptomFrequencyDashboardCard } from './SymptomFrequencyDashboardCard';

const CATEGORIES = [
  'All',
  'General',
  'Respiratory',
  'Cardiovascular',
  'Gastrointestinal',
  'Neurological',
  'Dermatological',
  'Musculoskeletal'
] as const;

const QUICK_BUNDLES = [
  {
    name: 'Flu / Viral Infection',
    symptoms: ['fever', 'chills', 'fatigue', 'muscle_aches', 'cough', 'headache']
  },
  {
    name: 'Severe Gastrointestinal',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain_general', 'dehydration']
  },
  {
    name: 'Respiratory Distress',
    symptoms: ['shortness_of_breath', 'cough', 'chest_tightness', 'wheezing']
  },
  {
    name: 'Migraine Attack',
    symptoms: ['headache', 'light_sensitivity', 'nausea', 'dizziness']
  },
  {
    name: 'Emergency Chest Alert',
    symptoms: ['chest_pain', 'shortness_of_breath', 'sweating', 'palpitations']
  }
];

export const DiagnosisView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['fever', 'cough', 'fatigue']);
  const [vitals, setVitals] = useState<PatientVitals>(DEFAULT_HEALTHY_VITALS);
  const [activeCaseId, setActiveCaseId] = useState<string | undefined>();
  
  const [profile, setProfile] = useState<PatientProfile>({
    ageGroup: 'adult',
    gender: 'female',
    durationDays: 3,
    severityScale: 6,
    preExistingConditions: ['None'],
    vitals: DEFAULT_HEALTHY_VITALS
  });

  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(() => {
    return runMedicalDiagnosis(['fever', 'cough', 'fatigue'], {
      ageGroup: 'adult',
      gender: 'female',
      durationDays: 3,
      severityScale: 6,
      preExistingConditions: ['None'],
      vitals: DEFAULT_HEALTHY_VITALS
    });
  });

  // AI Consultation states
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Mandatory Medical Disclaimer persistent state
  const [isDisclaimerAcknowledged, setIsDisclaimerAcknowledged] = useState<boolean>(() => {
    try {
      return localStorage.getItem('medical_disclaimer_ack_v1') === 'true';
    } catch {
      return false;
    }
  });

  const [acknowledgedTimestamp, setAcknowledgedTimestamp] = useState<string | null>(() => {
    try {
      return localStorage.getItem('medical_disclaimer_timestamp_v1');
    } catch {
      return null;
    }
  });

  const [isReviewDisclaimerOpen, setIsReviewDisclaimerOpen] = useState(false);
  const [isSymptomGuideOpen, setIsSymptomGuideOpen] = useState(false);

  // Local Storage Assessment History State
  const [history, setHistory] = useState<SavedAssessment[]>(() => getAssessmentHistory());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [viewingHistorical, setViewingHistorical] = useState<SavedAssessment | null>(null);

  const handleAcknowledgeDisclaimer = () => {
    const formattedDate = new Date().toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    setIsDisclaimerAcknowledged(true);
    setAcknowledgedTimestamp(formattedDate);
    try {
      localStorage.setItem('medical_disclaimer_ack_v1', 'true');
      localStorage.setItem('medical_disclaimer_timestamp_v1', formattedDate);
    } catch (e) {
      console.warn('Unable to persist disclaimer acknowledgment to localStorage:', e);
    }
  };

  const filteredSymptoms = SYMPTOMS_DATASET.filter(symptom => {
    const matchesSearch = symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          symptom.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || symptom.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleApplyBundle = (symptoms: string[]) => {
    setSelectedSymptoms(symptoms);
  };

  const handleSelectCase = (vignette: ClinicalVignette) => {
    setActiveCaseId(vignette.id);
    const updatedProfile: PatientProfile = {
      ...vignette.patientDemographics,
      preExistingConditions: ['None'],
      vitals: vignette.vitals
    };
    setProfile(updatedProfile);
    setVitals(vignette.vitals);
    setSelectedSymptoms(vignette.symptoms);

    const result = runMedicalDiagnosis(vignette.symptoms, updatedProfile);
    setDiagnosisResult(result);
    setAiResponse(null);
    setViewingHistorical(null);
    const updatedHistory = saveAssessmentToHistory(result, `Vignette: ${vignette.title}`);
    setHistory(updatedHistory);
  };

  const handleVitalsChange = (newVitals: PatientVitals) => {
    setVitals(newVitals);
    const updatedProfile: PatientProfile = { ...profile, vitals: newVitals };
    setProfile(updatedProfile);
    if (selectedSymptoms.length > 0) {
      const result = runMedicalDiagnosis(selectedSymptoms, updatedProfile);
      setDiagnosisResult(result);
      const updatedHistory = saveAssessmentToHistory(result);
      setHistory(updatedHistory);
    }
  };

  const handleRunDiagnosis = () => {
    if (selectedSymptoms.length === 0) return;
    const updatedProfile: PatientProfile = { ...profile, vitals };
    const result = runMedicalDiagnosis(selectedSymptoms, updatedProfile);
    setDiagnosisResult(result);
    setAiResponse(null); // Reset AI question on new diagnosis
    setViewingHistorical(null);
    const updatedHistory = saveAssessmentToHistory(result);
    setHistory(updatedHistory);
  };

  const handleLoadHistoricalAssessment = (saved: SavedAssessment) => {
    setSelectedSymptoms(saved.result.selectedSymptoms);
    setProfile(saved.result.patientProfile);
    if (saved.result.patientProfile.vitals) {
      setVitals(saved.result.patientProfile.vitals);
    } else {
      setVitals(DEFAULT_HEALTHY_VITALS);
    }
    setDiagnosisResult(saved.result);
    setActiveCaseId(undefined);
    setAiResponse(null);
    setViewingHistorical(saved);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setActiveCaseId(undefined);
    setVitals(DEFAULT_HEALTHY_VITALS);
    setProfile({
      ageGroup: 'adult',
      gender: 'female',
      durationDays: 3,
      severityScale: 6,
      preExistingConditions: ['None'],
      vitals: DEFAULT_HEALTHY_VITALS
    });
    setDiagnosisResult(null);
    setAiResponse(null);
    setViewingHistorical(null);
  };

  const handleAskAI = async (customPrompt?: string) => {
    if (!diagnosisResult) return;
    const questionToSend = customPrompt || aiQuestion;
    if (!questionToSend.trim()) return;

    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diseaseName: diagnosisResult.primaryDiagnosis.disease.name,
          symptoms: diagnosisResult.selectedSymptoms,
          userQuestion: questionToSend
        })
      });
      const data = await res.json();
      if (data.explanation) {
        setAiResponse(data.explanation);
      }
    } catch (err) {
      console.error('AI consultation request failed:', err);
      setAiResponse('Unable to retrieve AI clinical explanation at this time. Please consult your physician directly.');
    } finally {
      setAiLoading(false);
      setAiQuestion('');
    }
  };

  const getTriageBadge = (level: RiskLevel) => {
    switch (level) {
      case 'emergency':
        return {
          label: 'CRITICAL EMERGENCY',
          color: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: ShieldAlert
        };
      case 'high':
        return {
          label: 'HIGH RISK / URGENT',
          color: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: AlertCircle
        };
      case 'moderate':
        return {
          label: 'MODERATE RISK',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Activity
        };
      case 'low':
      default:
        return {
          label: 'MILD / LOW RISK',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Persistent Medical Disclaimer & Gate Modal */}
      <MedicalDisclaimerGate
        isAcknowledged={isDisclaimerAcknowledged}
        onAcknowledge={handleAcknowledgeDisclaimer}
        onReview={() => setIsReviewDisclaimerOpen(true)}
        isReviewOpen={isReviewDisclaimerOpen}
        onCloseReview={() => setIsReviewDisclaimerOpen(false)}
        acknowledgedTimestamp={acknowledgedTimestamp}
        assessmentData={{
          profile,
          diagnosisResult,
          selectedSymptoms
        }}
      />

      <div className="screen-only-content space-y-6">
        {/* Intro Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Stethoscope className="w-6 h-6 text-teal-600" />
            Interactive Clinical Diagnosis & Symptom Triage
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Select patient symptoms across bodily systems to generate probabilistic multi-class disease predictions, 
            risk-level triage, clinical precautions, and specialist referrals powered by the Random Forest Ensemble.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            type="button"
            id="open-history-btn"
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            title="View saved assessment history in localStorage"
          >
            <History className="w-3.5 h-3.5 text-teal-600" />
            <span>History ({history.length})</span>
          </button>
          <button
            type="button"
            id="header-frequency-btn"
            onClick={() => {
              const el = document.getElementById('symptom-frequency-card-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            title="Jump to D3 Symptom Frequency Analysis"
          >
            <BarChart2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Frequency Chart</span>
          </button>
          <button
            type="button"
            id="header-symptom-guide-btn"
            onClick={() => setIsSymptomGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors shadow-2xs"
          >
            <Lightbulb className="w-3.5 h-3.5 text-teal-600" />
            <span>Symptom Accuracy Guide</span>
          </button>
          <button
            id="reset-symptoms-btn"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
          <button
            id="print-assessment-btn"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF Summary
          </button>
        </div>
      </div>

      {/* Case Vignettes / Patient Simulator Carousel */}
      <CaseVignettesSelector 
        onSelectCase={handleSelectCase} 
        activeCaseId={activeCaseId} 
      />

      {/* Historical Symptom Frequency Summary Dashboard Card (D3.js) */}
      <div id="symptom-frequency-card-section">
        <SymptomFrequencyDashboardCard 
          history={history}
          onHistoryChange={setHistory}
          onSelectSymptom={toggleSymptom}
        />
      </div>

      {/* Grid: Left Column (Symptom & Patient Input) / Right Column (Diagnostic Result) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Symptom Input & Patient Demographics (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Patient Context Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-semibold text-slate-900">Patient Clinical Context</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Age Group</label>
                <select
                  id="patient-age-group"
                  value={profile.ageGroup}
                  onChange={e => setProfile({ ...profile, ageGroup: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="child">Child (0 - 12 yrs)</option>
                  <option value="young_adult">Young Adult (13 - 25 yrs)</option>
                  <option value="adult">Adult (26 - 59 yrs)</option>
                  <option value="senior">Senior (60+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Biological Sex</label>
                <select
                  id="patient-gender"
                  value={profile.gender}
                  onChange={e => setProfile({ ...profile, gender: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 flex items-center justify-between">
                  <span>Symptom Duration</span>
                  <span className="font-semibold text-teal-700">{profile.durationDays} days</span>
                </label>
                <input
                  id="patient-duration"
                  type="range"
                  min={1}
                  max={30}
                  value={profile.durationDays}
                  onChange={e => setProfile({ ...profile, durationDays: parseInt(e.target.value) })}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 flex items-center justify-between">
                  <span>Severity Scale</span>
                  <span className="font-semibold text-amber-700">{profile.severityScale} / 10</span>
                </label>
                <input
                  id="patient-severity"
                  type="range"
                  min={1}
                  max={10}
                  value={profile.severityScale}
                  onChange={e => setProfile({ ...profile, severityScale: parseInt(e.target.value) })}
                  className="w-full accent-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Bedside Vitals & Physiological Early Warning (NEWS2 / qSOFA) */}
          <VitalsInputPanel 
            vitals={vitals}
            onChange={handleVitalsChange}
            earlyWarningScore={diagnosisResult?.earlyWarningScore}
          />

          {/* Quick Presets / Clinical Bundles */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              Common Clinical Symptom Bundles:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_BUNDLES.map(bundle => (
                <button
                  key={bundle.name}
                  onClick={() => handleApplyBundle(bundle.symptoms)}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-700 transition-colors"
                >
                  + {bundle.name}
                </button>
              ))}
            </div>
          </div>

          {/* Symptom Selector Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span>Select Symptoms</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                  {selectedSymptoms.length} Selected
                </span>
              </h3>
            </div>

            {/* Real-time Symptom Quality Tooltip & Guide Trigger */}
            <SymptomQualityTooltip 
              selectedSymptomCount={selectedSymptoms.length}
              durationDays={profile.durationDays}
              onOpenGuide={() => setIsSymptomGuideOpen(true)}
            />

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="symptom-search-input"
                type="text"
                placeholder="Search symptoms (e.g. fever, cough, chest pain, rash)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Symptom Selection Grid */}
            <div className="max-h-72 overflow-y-auto pr-1 space-y-1.5 border-t border-slate-100 pt-3">
              {filteredSymptoms.map(sym => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    id={`symptom-btn-${sym.id}`}
                    onClick={() => toggleSymptom(sym.id)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-start justify-between transition-all ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-500 text-teal-950 font-medium'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{sym.name}</span>
                        {sym.severityWeight >= 4 && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-semibold">
                            Critical
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{sym.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center ${
                      isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Run Assessment Button */}
            <button
              id="run-assessment-submit-btn"
              onClick={handleRunDiagnosis}
              disabled={selectedSymptoms.length === 0}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all ${
                selectedSymptoms.length > 0
                  ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Activity className="w-4 h-4" />
              Compute Diagnostic Assessment ({selectedSymptoms.length} Symptoms)
            </button>
          </div>

        </div>

        {/* Right Column: Diagnostic Output & Clinical Recommendations (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* If No Symptoms Selected */}
          {!diagnosisResult || selectedSymptoms.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">No Symptoms Currently Evaluated</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Please select one or more symptoms from the left panel or click one of the quick clinical bundles to generate a diagnosis report.
              </p>
            </div>
          ) : (
            <>
              {/* Historical Assessment Revisit Banner */}
              {viewingHistorical && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-950 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-bold">Viewing Historical Evaluation:</span>
                      <span className="ml-1 text-amber-900">
                        Saved {viewingHistorical.formattedDate}
                        {viewingHistorical.customLabel ? ` • "${viewingHistorical.customLabel}"` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsHistoryOpen(true)}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100/80 border border-amber-300 rounded-md text-[11px] font-semibold text-amber-900 transition-colors"
                    >
                      Browse History
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingHistorical(null)}
                      className="px-2 py-1 text-amber-700 hover:text-amber-950 text-[11px] font-medium"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Emergency Red Flag Alert (If applicable) */}
              {diagnosisResult.emergencyAlert && (
                <div className="bg-rose-50 border-2 border-rose-500 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start gap-3.5">
                    <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-900 tracking-tight flex items-center gap-2">
                        EMERGENCY MEDICAL WARNING DETECTED
                        <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase">
                          Action Required
                        </span>
                      </h4>
                      <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                        {diagnosisResult.emergencyReason || 
                         'Your selected symptoms indicate a potential acute clinical emergency. Do not attempt home self-treatment.'}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-semibold text-rose-900 bg-rose-200/80 px-2.5 py-1 rounded-md">
                          Call Emergency Services (911 / 112) or proceed to the nearest Emergency Room immediately.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Diagnosis Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full pointer-events-none -z-0" />
                
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                        Primary Predicted Condition
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsHistoryOpen(true)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                        title="Saved in browser localStorage history"
                      >
                        <Bookmark className="w-3 h-3 text-teal-600" />
                        <span>Saved Locally</span>
                      </button>
                    </div>
                    {(() => {
                      const badge = getTriageBadge(diagnosisResult.triageLevel);
                      const BadgeIcon = badge.icon;
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                          <BadgeIcon className="w-3.5 h-3.5" />
                          {badge.label}
                        </span>
                      );
                    })()}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {diagnosisResult.primaryDiagnosis.disease.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {diagnosisResult.primaryDiagnosis.disease.description}
                  </p>

                  {/* Confidence Progress Bar */}
                  <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700">Algorithmic Match Probability</span>
                      <span className="font-bold text-teal-700 text-sm">
                        {diagnosisResult.primaryDiagnosis.probability}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${diagnosisResult.primaryDiagnosis.probability}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5">
                      Calculated via Random Forest ensemble tree consensus based on {selectedSymptoms.length} input features.
                    </p>
                  </div>

                  {/* Feature Attribution: Why this prediction? */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-teal-600" />
                      Feature Attribution (Contributing Symptoms):
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {diagnosisResult.primaryDiagnosis.matchedSymptoms.map(symId => {
                        const sym = SYMPTOMS_DATASET.find(s => s.id === symId);
                        return (
                          <span
                            key={symId}
                            className="inline-flex items-center gap-1 text-[11px] bg-teal-50 text-teal-900 border border-teal-200/80 px-2.5 py-1 rounded-md"
                          >
                            <CheckCircle2 className="w-3 h-3 text-teal-600" />
                            {sym?.name || symId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Differential Diagnoses Comparison */}
              {diagnosisResult.differentialDiagnoses.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
                    <span>Differential Diagnoses Considered</span>
                    <span className="text-[11px] font-normal text-slate-400">Ranked by score</span>
                  </h4>
                  <div className="space-y-2.5">
                    {diagnosisResult.differentialDiagnoses.map((diff, index) => (
                      <div
                        key={diff.disease.id}
                        className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 font-semibold text-[10px] flex items-center justify-center">
                            {index + 2}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-800">{diff.disease.name}</span>
                            <span className="text-[10px] text-slate-500 block">
                              {diff.matchedSymptoms.length} matching symptom{diff.matchedSymptoms.length === 1 ? '' : 's'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-700">{diff.probability}%</span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            diff.disease.riskLevel === 'emergency' ? 'bg-rose-100 text-rose-700' :
                            diff.disease.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {diff.disease.riskLevel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Care Plan & Precautions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recommended Specialist & Tests */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-teal-600" />
                    Recommended Care
                  </h4>
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block">Consult Specialist:</span>
                    <span className="text-xs font-semibold text-teal-900 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded inline-block mt-0.5">
                      {diagnosisResult.primaryDiagnosis.disease.recommendedSpecialist}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block">Diagnostic Tests Often Ordered:</span>
                    <ul className="mt-1 space-y-1 text-xs text-slate-700 list-disc list-inside">
                      {diagnosisResult.primaryDiagnosis.disease.typicalTests.map((test, i) => (
                        <li key={i}>{test}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Precautions & Safe Self-Care */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Safe Precautions & Home Care
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {diagnosisResult.primaryDiagnosis.disease.precautions.slice(0, 3).map((precaution, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Multi-Model Ensemble Consensus & Validation */}
              <MultiModelComparisonCard 
                comparisons={diagnosisResult.modelComparisons}
                primaryDiseaseName={diagnosisResult.primaryDiagnosis.disease.name}
              />

              {/* Pharmacotherapy Safety & Contraindications */}
              <DrugSafetyCard 
                drugSafety={diagnosisResult.drugSafety} 
              />

              {/* Explainable AI Visualizer (Decision Path & Feature Weights) */}
              <ExplainableAIVisualizer 
                primaryDiagnosis={diagnosisResult.primaryDiagnosis}
                selectedSymptoms={selectedSymptoms}
              />

              {/* Gemini AI Clinical Assistant / Deep Dive */}
              <div className="bg-linear-to-r from-teal-900 to-slate-900 text-white rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-300" />
                    <h4 className="text-sm font-bold tracking-tight">
                      AI Clinical Insight (Powered by Gemini)
                    </h4>
                  </div>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-200 border border-teal-500/30">
                    Server-Side @google/genai
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Ask educational questions about {diagnosisResult.primaryDiagnosis.disease.name}, explore biological causes, or generate recommended questions for your in-person physician appointment.
                </p>

                {/* Quick AI Prompts */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAskAI('What specific questions should I ask my doctor regarding these symptoms?')}
                    className="text-[11px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md transition-colors"
                  >
                    💬 Questions to ask doctor
                  </button>
                  <button
                    onClick={() => handleAskAI('Explain the underlying biological pathology of this condition in simple layman terms.')}
                    className="text-[11px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md transition-colors"
                  >
                    🔬 Biological mechanism
                  </button>
                  <button
                    onClick={() => handleAskAI('What specific red-flag danger signs require emergency room care for this condition?')}
                    className="text-[11px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md transition-colors"
                  >
                    ⚠️ Red flags to monitor
                  </button>
                </div>

                {/* Custom AI Input */}
                <div className="flex gap-2">
                  <input
                    id="ai-consult-input"
                    type="text"
                    value={aiQuestion}
                    onChange={e => setAiQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAskAI()}
                    placeholder="Ask a medical education question..."
                    className="flex-1 text-xs bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <button
                    id="ai-consult-submit-btn"
                    onClick={() => handleAskAI()}
                    disabled={aiLoading || !aiQuestion.trim()}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Ask AI
                  </button>
                </div>

                {/* AI Response Output */}
                {aiResponse && (
                  <div className="mt-4 p-4 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-200 leading-relaxed space-y-2 whitespace-pre-line">
                    <div className="flex items-center gap-1.5 text-teal-300 font-semibold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Clinical Educational Summary:
                    </div>
                    {aiResponse}
                  </div>
                )}
              </div>

              {/* Strict Medical Disclaimer Footer Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-600 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-slate-800">Academic & Ethical Directive: </span>
                  This prediction is generated by an academic Random Forest classification model with {diagnosisResult.primaryDiagnosis.probability}% confidence score.
                  It represents a probabilistic correlation, NOT a clinical diagnosis. Always seek the advice of your physician or qualified healthcare provider with any questions you may have regarding a medical condition.
                </div>
              </div>

            </>
          )}

        </div>

      </div>

      {/* Symptom Accuracy & Best Practices Modal */}
      <SymptomGuideModal 
        isOpen={isSymptomGuideOpen} 
        onClose={() => setIsSymptomGuideOpen(false)} 
      />

      {/* Assessment LocalStorage History Drawer */}
      <AssessmentHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onHistoryChange={setHistory}
        onLoadAssessment={handleLoadHistoricalAssessment}
        currentAssessmentId={diagnosisResult?.id}
      />
    </div>
  </div>
  );
};
