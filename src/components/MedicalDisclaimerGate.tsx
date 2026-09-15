import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  PhoneCall, 
  Stethoscope, 
  X,
  Info,
  Printer,
  Activity,
  AlertTriangle,
  Calendar,
  FileCheck,
  User
} from 'lucide-react';
import { PatientProfile, DiagnosisResult } from '../types';
import { SYMPTOMS_DATASET } from '../data/medicalData';

export interface AssessmentDataForPrint {
  profile?: PatientProfile;
  diagnosisResult?: DiagnosisResult | null;
  selectedSymptoms?: string[];
}

interface MedicalDisclaimerProps {
  isAcknowledged: boolean;
  onAcknowledge: () => void;
  onReview: () => void;
  isReviewOpen: boolean;
  onCloseReview: () => void;
  acknowledgedTimestamp?: string | null;
  assessmentData?: AssessmentDataForPrint;
}

export const MedicalDisclaimerGate: React.FC<MedicalDisclaimerProps> = ({
  isAcknowledged,
  onAcknowledge,
  onReview,
  isReviewOpen,
  onCloseReview,
  acknowledgedTimestamp,
  assessmentData
}) => {
  const [hasCheckedConsent, setHasCheckedConsent] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const currentDateFormatted = new Date().toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const profile = assessmentData?.profile;
  const diagnosisResult = assessmentData?.diagnosisResult;
  const selectedSymptomsList = (assessmentData?.selectedSymptoms || []).map(symId => {
    const found = SYMPTOMS_DATASET.find(s => s.id === symId);
    return found || { id: symId, name: symId, category: 'General', severityWeight: 1, description: '' };
  });

  return (
    <>
      {/* 1. On-Screen Interactive State: Persistent Banner OR Modal Gate */}
      {isAcknowledged && !isReviewOpen ? (
        <div 
          id="persistent-medical-disclaimer-banner"
          className="bg-amber-500/10 border-2 border-amber-500/40 rounded-xl p-4 text-amber-950 shadow-xs relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5 sm:mt-0 shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-amber-900">
                    Mandatory Medical Disclaimer
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    User Acknowledged
                  </span>
                  {acknowledgedTimestamp && (
                    <span className="text-[10px] text-amber-800/80 font-mono hidden md:inline">
                      ({acknowledgedTimestamp})
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-900/90 mt-0.5 leading-relaxed">
                  <strong>Educational Demonstration Only:</strong> This AI Clinical Decision Support System is an academic project. It does <em>not</em> provide medical diagnoses, clinical advice, or treatment plans. Always consult a board-certified physician for any medical concerns.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                id="print-disclaimer-summary-btn"
                type="button"
                onClick={handlePrint}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-amber-950 border border-amber-300 transition-colors flex items-center gap-1.5 shadow-xs"
                title="Print a hard copy of the assessment summary and disclaimers for your records"
              >
                <Printer className="w-3.5 h-3.5 text-amber-800" />
                <span>Print Hard Copy</span>
              </button>
              <button
                id="re-read-disclaimer-btn"
                type="button"
                onClick={onReview}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200/90 text-amber-900 border border-amber-300 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>Review Terms</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          id="medical-disclaimer-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
        >
          <div 
            id="medical-disclaimer-card"
            className="bg-white rounded-2xl border-2 border-amber-400 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col relative"
          >
            {/* Top High-Visibility Header */}
            <div className="bg-linear-to-r from-amber-600 to-amber-700 text-white p-6 rounded-t-2xl relative">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  id="modal-header-print-btn"
                  type="button"
                  onClick={handlePrint}
                  className="p-1.5 px-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Print hard copy of assessment summary and disclaimers for your records"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print Records</span>
                </button>
                {isReviewOpen && isAcknowledged && (
                  <button
                    onClick={onCloseReview}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                    aria-label="Close review"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 pr-24 sm:pr-28">
                <div className="w-12 h-12 rounded-xl bg-white text-amber-600 flex items-center justify-center shrink-0 shadow-md">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-black/20 text-amber-100">
                      Strict Clinical Ethics
                    </span>
                    <span className="text-[10px] font-semibold text-amber-100">
                      Academic Capstone
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white mt-1">
                    Mandatory Medical & Clinical Disclaimer
                  </h3>
                  <p className="text-xs text-amber-100 mt-0.5">
                    Please read and explicitly acknowledge these conditions before proceeding to the diagnosis tool.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5 text-slate-700 text-xs leading-relaxed">
              {/* Emergency Alert Box */}
              <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex items-start gap-3">
                <PhoneCall className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-rose-900 text-sm">
                    Experiencing a Medical Emergency?
                  </h4>
                  <p className="text-rose-800 text-xs leading-relaxed">
                    If you or someone nearby is experiencing acute chest pain, shortness of breath, severe bleeding, loss of consciousness, slurred speech, or stroke-like symptoms, 
                    <strong> immediately call 911 / 112 or go to the nearest emergency department</strong>. Do not delay professional medical intervention to use this application.
                  </p>
                </div>
              </div>

              {/* Key Principles Checklist */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  Core Ethical Principles & Scope Limitations:
                </h4>

                <div className="grid grid-cols-1 gap-2.5">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Strictly Educational & Academic Demonstration</strong>
                      This application is an undergraduate computer science capstone project developed to explore supervised machine learning algorithms (Random Forest, SVM, Naive Bayes) applied to medical tabular benchmark datasets. It is not an FDA-cleared or certified medical device.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-900 block">No Doctor-Patient Relationship or Prescriptions</strong>
                      Using this application does not establish a physician-patient relationship. The system cannot prescribe medications, formulate official clinical treatment courses, or provide medical clearances.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Probabilistic Predictions & Model Uncertainty</strong>
                      Algorithmic outputs represent statistical correlations across 132 binary features. Like all AI classifiers, the model may produce false positives or false negatives and cannot replace thorough clinical physical examination, auscultation, or laboratory diagnostics.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
                      4
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Confidentiality & Data Privacy</strong>
                      To protect your privacy in compliance with HIPAA and GDPR data minimization standards, this tool does not store Personally Identifiable Information (such as full names, national identifiers, or residential addresses).
                    </div>
                  </div>
                </div>
              </div>

              {/* Explicit User Checkbox Consent */}
              <div className="pt-2 border-t border-slate-200">
                <label className="flex items-start gap-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100/50 transition-colors">
                  <input
                    id="disclaimer-consent-checkbox"
                    type="checkbox"
                    checked={hasCheckedConsent}
                    onChange={e => setHasCheckedConsent(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 mt-0.5 accent-teal-600"
                  />
                  <span className="text-xs font-semibold text-slate-800 select-none leading-relaxed">
                    I understand and agree that this software is strictly for educational demonstration, does not constitute professional medical advice or clinical diagnosis, and will not be used in lieu of a certified healthcare provider.
                  </span>
                </label>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 p-4 px-6 rounded-b-2xl border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 text-center sm:text-left">
                Acknowledgment will be remembered in this browser session.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="modal-footer-print-btn"
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  title="Print hard copy of assessment summary and disclaimers for your records"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print Hard Copy</span>
                </button>
                {isReviewOpen && isAcknowledged && (
                  <button
                    type="button"
                    onClick={onCloseReview}
                    className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Close Review
                  </button>
                )}
                <button
                  id="acknowledge-disclaimer-submit-btn"
                  type="button"
                  disabled={!hasCheckedConsent}
                  onClick={() => {
                    onAcknowledge();
                    if (isReviewOpen) onCloseReview();
                  }}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all ${
                    hasCheckedConsent
                      ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer shadow-teal-700/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  I Acknowledge & Accept Terms
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Formal Hard Copy Printable Sheet (Active on window.print()) */}
      <div 
        id="printable-assessment-disclaimer-sheet"
        className="hidden print:block text-slate-900 bg-white font-sans text-xs leading-normal"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-teal-800">
                AI Clinical Decision Support System (CDSS) • Academic Engineering Capstone
              </p>
              <h1 className="text-xl font-black text-slate-900 mt-1 uppercase tracking-tight">
                Clinical Assessment Summary & Mandatory Medical Disclaimer Record
              </h1>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Official Hard Copy Documentation for Patient Personal Records and Physician Consultation
              </p>
            </div>
            <div className="text-right text-[10px] text-slate-600 border border-slate-300 rounded p-2 bg-slate-50">
              <div><strong>Record Ref:</strong> CDSS-{(diagnosisResult?.id || 'ACAD-DEMO').slice(0, 10).toUpperCase()}</div>
              <div><strong>Printed:</strong> {currentDateFormatted}</div>
              <div><strong>Classifier:</strong> Random Forest Ensemble (100 Trees)</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between bg-amber-50 border border-amber-300 rounded px-3 py-1.5 text-[11px] text-amber-950 font-medium">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              Medical Disclaimer Acknowledgment Status:
            </span>
            <span className="font-semibold text-emerald-800">
              {isAcknowledged 
                ? `VERIFIED & USER ACKNOWLEDGED (${acknowledgedTimestamp || 'Current Session'})`
                : 'PRE-ACKNOWLEDGED REVIEW COPY'}
            </span>
          </div>
        </div>

        {/* Emergency Alert Box (If flagged) */}
        {diagnosisResult?.emergencyAlert && (
          <div className="border-2 border-rose-600 bg-rose-50 text-rose-950 p-3 rounded mb-4 print-avoid-break">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-800 uppercase">
              <PhoneCall className="w-4 h-4 text-rose-700" />
              Emergency Clinical Warning Detected
            </div>
            <p className="text-xs text-rose-900 mt-1 font-semibold">
              {diagnosisResult.emergencyReason || 'Acute symptoms indicate potential medical emergency.'}
            </p>
            <p className="text-[11px] text-rose-800 mt-1">
              <strong>Mandatory Directive:</strong> Immediately call emergency services (911 / 112) or proceed to the nearest hospital emergency department. Do not rely on home self-care or algorithm recommendations.
            </p>
          </div>
        )}

        {/* Section 1: Patient Context & Clinical Profile */}
        <div className="border border-slate-300 rounded p-3 mb-4 print-avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-teal-700" />
            1. Patient Clinical Context & Bedside Vital Signs
          </h2>
          <div className="grid grid-cols-4 gap-2 text-[11px] mb-2">
            <div>
              <span className="text-slate-500 block">Age Demographic:</span>
              <strong className="text-slate-900 capitalize">{profile?.ageGroup ? profile.ageGroup.replace('_', ' ') : 'Adult'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Biological Sex:</span>
              <strong className="text-slate-900 capitalize">{profile?.gender || 'Not specified'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Symptom Duration:</span>
              <strong className="text-slate-900">{profile?.durationDays || 3} Day(s)</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Severity Rating:</span>
              <strong className="text-slate-900">{profile?.severityScale || 5} / 10 Scale</strong>
            </div>
          </div>

          {/* Vitals Telemetry */}
          {profile?.vitals && (
            <div className="pt-2 border-t border-slate-200 grid grid-cols-5 gap-2 text-[10px] bg-slate-50 p-2 rounded">
              <div>
                <span className="text-slate-500 block">Heart Rate:</span>
                <strong className="text-slate-900">{profile.vitals.heartRate} bpm</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Blood Pressure:</span>
                <strong className="text-slate-900">{profile.vitals.systolicBp}/{profile.vitals.diastolicBp} mmHg</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Resp. Rate:</span>
                <strong className="text-slate-900">{profile.vitals.respiratoryRate} /min</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Temperature:</span>
                <strong className="text-slate-900">{profile.vitals.temperatureC}°C</strong>
              </div>
              <div>
                <span className="text-slate-500 block">SpO2 / Glucose:</span>
                <strong className="text-slate-900">{profile.vitals.oxygenSaturation}% / {profile.vitals.bloodGlucose || 100} mg/dL</strong>
              </div>
            </div>
          )}

          {diagnosisResult?.earlyWarningScore && (
            <div className="mt-2 text-[10px] flex items-center justify-between border border-slate-200 rounded px-2 py-1 bg-white">
              <span><strong>Royal College NEWS2 Score:</strong> {diagnosisResult.earlyWarningScore.news2Score} / 20 ({diagnosisResult.earlyWarningScore.news2Risk} Deterioration Risk)</span>
              <span><strong>qSOFA Score:</strong> {diagnosisResult.earlyWarningScore.qSofaScore} / 3 ({diagnosisResult.earlyWarningScore.qSofaRisk})</span>
            </div>
          )}
        </div>

        {/* Section 2: Evaluated Symptoms */}
        <div className="border border-slate-300 rounded p-3 mb-4 print-avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-700" />
            2. Evaluated Symptoms ({selectedSymptomsList.length} Features Evaluated)
          </h2>
          {selectedSymptomsList.length === 0 ? (
            <p className="text-slate-500 italic text-[11px]">No specific symptoms selected at time of record generation.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              {selectedSymptomsList.map(s => (
                <div key={s.id} className="flex items-center justify-between border-b border-slate-100 py-0.5">
                  <span className="font-medium text-slate-800">• {s.name}</span>
                  <span className="text-slate-500 text-[10px]">
                    [{s.category}, Severity {s.severityWeight}/5]
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Diagnostic Assessment Findings */}
        <div className="border border-slate-300 rounded p-3 mb-4 print-avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
            3. Decision Support Diagnostic Findings & Triage
          </h2>
          {diagnosisResult ? (
            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between items-start bg-slate-50 p-2.5 rounded border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">Primary Predicted Condition:</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {diagnosisResult.primaryDiagnosis.disease.name}
                  </h3>
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    {diagnosisResult.primaryDiagnosis.disease.description}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="text-xs font-bold text-slate-900">
                    Match: <span className="text-teal-700 text-sm">{diagnosisResult.primaryDiagnosis.probability}%</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded border border-slate-300 bg-white inline-block">
                    Triage: {diagnosisResult.triageLevel.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Contributing Features */}
              <div>
                <strong className="text-slate-800 block text-[10px] uppercase font-bold text-slate-600">
                  Feature Attribution (Contributing Symptoms):
                </strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {diagnosisResult.primaryDiagnosis.matchedSymptoms.map(symId => {
                    const s = SYMPTOMS_DATASET.find(item => item.id === symId);
                    return (
                      <span key={symId} className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-700">
                        {s ? s.name : symId}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Differential Diagnoses */}
              {diagnosisResult.differentialDiagnoses.length > 0 && (
                <div>
                  <strong className="text-slate-800 block text-[10px] uppercase font-bold text-slate-600">
                    Differential Diagnoses Considered:
                  </strong>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {diagnosisResult.differentialDiagnoses.slice(0, 4).map(diff => (
                      <div key={diff.disease.id} className="border border-slate-200 p-1.5 rounded bg-slate-50/50 flex justify-between items-center text-[10px]">
                        <span className="font-semibold text-slate-800">{diff.disease.name}</span>
                        <span className="text-slate-600 font-mono font-bold">{diff.probability}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Precautions & Specialist Referral */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <strong className="text-[10px] font-bold uppercase text-slate-700 block mb-1">
                    Clinical Precautions & Self-Care:
                  </strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-700">
                    {diagnosisResult.primaryDiagnosis.disease.precautions.slice(0, 3).map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-[10px] font-bold uppercase text-slate-700 block mb-1">
                    Physician Specialist Referral:
                  </strong>
                  <p className="text-[11px] font-bold text-slate-900">
                    {diagnosisResult.primaryDiagnosis.disease.recommendedSpecialist}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    {diagnosisResult.primaryDiagnosis.disease.doctorConsultAdvice}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 italic text-[11px]">
              No diagnosis calculated yet. This document serves as a symptom intake and disclaimer record.
            </p>
          )}
        </div>

        {/* Section 4: Mandatory Legal & Medical Disclaimers (Complete Text) */}
        <div className="border-2 border-amber-400 bg-amber-50/40 rounded p-3 mb-4 print-avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 border-b border-amber-300 pb-1 mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            4. Mandatory Legal & Medical Disclaimers for Patient Records
          </h2>
          <div className="space-y-1.5 text-[10px] text-slate-800 leading-relaxed">
            <p>
              <strong>1. Strictly Academic & Educational Demonstration:</strong> This system was created as an undergraduate computer science engineering capstone to study supervised machine learning classifiers on benchmark medical datasets. It is NOT an FDA-cleared, CE-certified, or clinically licensed medical device.
            </p>
            <p>
              <strong>2. Non-Diagnostic Statement & No Physician-Patient Relationship:</strong> The findings in this document are strictly probabilistic statistical correlations and DO NOT constitute a medical diagnosis, clinical opinion, treatment plan, or prescription. Using this tool does not establish a doctor-patient relationship.
            </p>
            <p>
              <strong>3. Emergency Escalation Directive:</strong> If you or someone in your presence experiences acute chest pain, dyspnea (shortness of breath), slurred speech, sudden paralysis, severe bleeding, or loss of consciousness, immediately call emergency services (911 / 112) or go to the nearest emergency medical facility.
            </p>
            <p>
              <strong>4. Algorithmic Uncertainty:</strong> Machine learning models possess inherent statistical error rates, including false positive and false negative predictions. Clinical decisions must always be made by a certified, licensed medical practitioner following physical examination and laboratory testing.
            </p>
            <p>
              <strong>5. HIPAA & GDPR Confidentiality:</strong> No Personally Identifiable Information (PII) is stored or retained on remote servers.
            </p>
          </div>
        </div>

        {/* Section 5: Signature & Archival Acknowledgment */}
        <div className="border border-slate-300 rounded p-3 print-avoid-break">
          <div className="text-[10px] text-slate-700 mb-3">
            <strong>Patient / User Acknowledgment:</strong> I acknowledge that I have read, received, and understood this assessment summary and the mandatory medical disclaimers outlined above. I agree that this document will not be used in place of professional medical consultation.
          </div>
          <div className="grid grid-cols-3 gap-6 text-[10px] pt-4">
            <div className="border-t border-slate-400 pt-1">
              <span className="text-slate-500 block">User / Patient Signature:</span>
              <span className="text-slate-400 italic">Signature on Record</span>
            </div>
            <div className="border-t border-slate-400 pt-1">
              <span className="text-slate-500 block">Date of Print / Acknowledgment:</span>
              <strong className="text-slate-900">{acknowledgedTimestamp || currentDateFormatted}</strong>
            </div>
            <div className="border-t border-slate-400 pt-1">
              <span className="text-slate-500 block">Record Retention Notice:</span>
              <span className="text-slate-700 font-medium">Archival Copy for Physician Review</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
