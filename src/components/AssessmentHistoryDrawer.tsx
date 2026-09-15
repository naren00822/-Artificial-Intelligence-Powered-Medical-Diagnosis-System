import React, { useState, useMemo, useRef } from 'react';
import {
  History,
  X,
  Clock,
  Trash2,
  Download,
  Upload,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Tag,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  HeartPulse,
  Stethoscope,
  ExternalLink,
  FileText,
  BarChart2
} from 'lucide-react';
import { SavedAssessment, DiagnosisResult, RiskLevel } from '../types';
import { SYMPTOMS_DATASET } from '../data/medicalData';
import { 
  getAssessmentHistory,
  deleteAssessmentFromHistory, 
  clearAllAssessmentHistory, 
  updateAssessmentMetadata,
  exportHistoryAsJSON,
  importHistoryFromJSON
} from '../services/historyStorage';
import { SymptomFrequencyDashboardCard } from './SymptomFrequencyDashboardCard';

interface AssessmentHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedAssessment[];
  onHistoryChange: (updatedHistory: SavedAssessment[]) => void;
  onLoadAssessment: (assessment: SavedAssessment) => void;
  currentAssessmentId?: string;
}

export const AssessmentHistoryDrawer: React.FC<AssessmentHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onHistoryChange,
  onLoadAssessment,
  currentAssessmentId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'records' | 'analytics'>('records');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper symptom name lookup
  const getSymptomName = (symId: string) => {
    const s = SYMPTOMS_DATASET.find(item => item.id === symId);
    return s ? s.name : symId.replace(/_/g, ' ');
  };

  // Filtered history
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const query = searchQuery.toLowerCase();
    return history.filter(item => {
      const diseaseName = item.result.primaryDiagnosis?.disease.name.toLowerCase() || '';
      const customLabel = item.customLabel?.toLowerCase() || '';
      const notes = item.notes?.toLowerCase() || '';
      const matchedSymptoms = item.result.selectedSymptoms.some(sId => 
        getSymptomName(sId).toLowerCase().includes(query)
      );
      return diseaseName.includes(query) || customLabel.includes(query) || notes.includes(query) || matchedSymptoms;
    });
  }, [history, searchQuery]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteAssessmentFromHistory(id);
    onHistoryChange(updated);
  };

  const handleClearAll = () => {
    clearAllAssessmentHistory();
    onHistoryChange([]);
    setConfirmClearAll(false);
  };

  const handleStartEditing = (item: SavedAssessment, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditLabel(item.customLabel || '');
    setEditNotes(item.notes || '');
  };

  const handleSaveMetadata = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = updateAssessmentMetadata(id, editLabel.trim() || undefined, editNotes.trim() || undefined);
    onHistoryChange(updated);
    setEditingId(null);
  };

  const handleExport = () => {
    const jsonStr = exportHistoryAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-assessment-history-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importHistoryFromJSON(content);
        if (res.success) {
          // Re-read history
          onHistoryChange(getAssessmentHistory());
          alert(`Successfully imported ${res.count || 0} historical assessment(s).`);
        } else {
          alert(`Import failed: ${res.error || 'Invalid file format'}`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getTriageBadge = (level: RiskLevel) => {
    switch (level) {
      case 'emergency':
        return {
          label: 'Emergency',
          color: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: ShieldAlert
        };
      case 'high':
        return {
          label: 'High Urgency',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: AlertTriangle
        };
      case 'moderate':
        return {
          label: 'Moderate',
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Info
        };
      default:
        return {
          label: 'Low / Self-Care',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2
        };
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-drawer-title"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="history-drawer-title" className="text-base font-bold text-white">
                    Assessment History
                  </h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                    {history.length} Saved in LocalStorage
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Revisit, inspect, or reload previously computed patient evaluations.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="close-history-drawer-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close history drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar & Action Utilities */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                id="search-history-input"
                placeholder="Search history by disease, symptom, or note..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                id="export-history-json-btn"
                onClick={handleExport}
                disabled={history.length === 0}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Export history as JSON file"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                type="button"
                id="import-history-json-btn"
                onClick={handleImportClick}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
                title="Import assessment records from JSON file"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                className="hidden" 
              />

              {history.length > 0 && !confirmClearAll && (
                <button
                  type="button"
                  id="request-clear-history-btn"
                  onClick={() => setConfirmClearAll(true)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium text-rose-300 hover:bg-rose-950/60 transition-colors"
                  title="Clear all saved history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Confirm Clear All Banner */}
          {confirmClearAll && (
            <div className="mt-3 p-2.5 bg-rose-950/80 border border-rose-800 rounded-lg flex items-center justify-between text-xs text-rose-200 animate-in fade-in duration-150">
              <span className="text-[11px]">Delete all {history.length} saved assessments from this browser?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="confirm-clear-history-btn"
                  onClick={handleClearAll}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-[11px]"
                >
                  Yes, Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Drawer Tab Switcher: Records vs D3 Analytics */}
          <div className="mt-3.5 flex items-center gap-2 border-t border-slate-800/80 pt-3">
            <button
              type="button"
              id="drawer-tab-records"
              onClick={() => setActiveDrawerTab('records')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeDrawerTab === 'records'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Saved Evaluations ({history.length})</span>
            </button>

            <button
              type="button"
              id="drawer-tab-analytics"
              onClick={() => setActiveDrawerTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeDrawerTab === 'analytics'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Symptom Frequency (D3.js)</span>
            </button>
          </div>
        </div>

        {/* Drawer Body: Records List or D3 Analytics */}
        {activeDrawerTab === 'analytics' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50/50">
            <SymptomFrequencyDashboardCard 
              history={history}
              onHistoryChange={onHistoryChange}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-slate-50/50">
          {history.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center my-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Assessment History Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                Evaluations generated in the Diagnosis View are automatically saved locally to your browser so you can return to them anytime.
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center my-6">
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No matching evaluations found</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Try searching with a different symptom or disease keyword.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const res = item.result;
              const isCurrent = currentAssessmentId === item.id;
              const isExpanded = expandedRecordId === item.id;
              const isEditing = editingId === item.id;
              const triage = getTriageBadge(res.triageLevel);
              const TriageIcon = triage.icon;
              const vitals = res.patientProfile.vitals;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border transition-all shadow-2xs hover:shadow-xs overflow-hidden ${
                    isCurrent 
                      ? 'border-teal-400 ring-2 ring-teal-500/20' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Item Header */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">
                            {res.primaryDiagnosis.disease.name}
                          </span>
                          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            {res.primaryDiagnosis.probability}% match
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-teal-600" />
                              Active in View
                            </span>
                          )}
                        </div>

                        {/* Date and Custom Label */}
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.formattedDate}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {item.id}
                          </span>
                        </div>
                      </div>

                      {/* Triage Badge */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${triage.color}`}>
                        <TriageIcon className="w-3 h-3" />
                        {triage.label}
                      </span>
                    </div>

                    {/* Custom Label / Note Display */}
                    {item.customLabel && !isEditing && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
                        <Tag className="w-3 h-3 text-amber-700" />
                        <span>{item.customLabel}</span>
                      </div>
                    )}

                    {item.notes && !isEditing && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-200/60 italic">
                        &quot;{item.notes}&quot;
                      </p>
                    )}

                    {/* Metadata Editing Form */}
                    {isEditing && (
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 mt-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                            Custom Label / Title (e.g. &quot;Mother&apos;s checkup&quot;)
                          </label>
                          <input
                            type="text"
                            value={editLabel}
                            onChange={e => setEditLabel(e.target.value)}
                            placeholder="Add a label..."
                            className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                            Notes / Physician comments
                          </label>
                          <textarea
                            rows={2}
                            value={editNotes}
                            onChange={e => setEditNotes(e.target.value)}
                            placeholder="Add personal notes..."
                            className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={e => handleSaveMetadata(item.id, e)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Save Note
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Demographic Summary & Vitals */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 pt-1">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium capitalize">
                        {res.patientProfile.ageGroup.replace('_', ' ')} • {res.patientProfile.gender}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                        {res.patientProfile.durationDays}d duration
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                        Pain {res.patientProfile.severityScale}/10
                      </span>
                      {vitals && (
                        <span className="px-2 py-0.5 bg-teal-50 border border-teal-200 rounded text-teal-800 font-medium flex items-center gap-1">
                          <HeartPulse className="w-3 h-3 text-teal-600" />
                          HR {vitals.heartRate} • BP {vitals.systolicBp}/{vitals.diastolicBp} • SpO2 {vitals.oxygenSaturation}%
                        </span>
                      )}
                      {res.earlyWarningScore && (
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono text-[10px]">
                          NEWS2: {res.earlyWarningScore.news2Score}
                        </span>
                      )}
                    </div>

                    {/* Evaluated Symptoms Chips */}
                    <div className="pt-1">
                      <div className="flex flex-wrap gap-1">
                        {res.selectedSymptoms.slice(0, 5).map(sId => (
                          <span
                            key={sId}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {getSymptomName(sId)}
                          </span>
                        ))}
                        {res.selectedSymptoms.length > 5 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-medium">
                            +{res.selectedSymptoms.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Bar for this Record */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          id={`load-assessment-${item.id}-btn`}
                          onClick={() => {
                            onLoadAssessment(item);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                          title="Restore this evaluation into the workspace"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Load &amp; Revisit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedRecordId(isExpanded ? null : item.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors"
                        >
                          <span>{isExpanded ? 'Hide Details' : 'Inspect'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={e => handleStartEditing(item, e)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                            title="Add label or clinical note"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          id={`delete-assessment-${item.id}-btn`}
                          onClick={e => handleDelete(item.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                          title="Delete assessment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Accordion Inspection Panel */}
                  {isExpanded && (
                    <div className="bg-slate-50 p-4 border-t border-slate-200 space-y-3 text-xs text-slate-700 animate-in fade-in duration-150">
                      <div>
                        <span className="font-bold text-slate-900 block mb-1">Differential Diagnoses:</span>
                        <div className="space-y-1">
                          {res.differentialDiagnoses.map((diff, dIdx) => (
                            <div key={dIdx} className="flex justify-between items-center text-[11px] bg-white p-1.5 rounded border border-slate-200">
                              <span className="font-medium text-slate-800">{diff.disease.name}</span>
                              <span className="font-bold text-slate-600">{diff.probability}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {res.drugSafety && res.drugSafety.contraindicatedDrugs.length > 0 && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                          <span className="font-bold text-rose-900 block mb-1 flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            Drug Contraindications Flagged:
                          </span>
                          <p className="text-[11px] text-rose-800">
                            {res.drugSafety.contraindicatedDrugs.map(d => d.drug).join(', ')}
                          </p>
                        </div>
                      )}

                      <div>
                        <span className="font-bold text-slate-900 block mb-1">Recommended Next Steps:</span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Consult: <strong className="text-slate-800">{res.primaryDiagnosis.disease.recommendedSpecialist}</strong>. {res.primaryDiagnosis.disease.doctorConsultAdvice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        )}

        {/* Drawer Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Storage: Browser LocalStorage (No remote transmission)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
};
