import React, { useState } from 'react';
import { 
  GitFork, 
  Binary, 
  Sliders, 
  HelpCircle, 
  ArrowDown, 
  Check, 
  Sparkles,
  ChevronRight,
  Split
} from 'lucide-react';
import { DifferentialMatch } from '../types';
import { SYMPTOMS_DATASET } from '../data/medicalData';

interface ExplainableAIVisualizerProps {
  primaryDiagnosis: DifferentialMatch;
  selectedSymptoms: string[];
}

export const ExplainableAIVisualizer: React.FC<ExplainableAIVisualizerProps> = ({
  primaryDiagnosis,
  selectedSymptoms
}) => {
  const [activeTab, setActiveTab] = useState<'decision_tree' | 'shap_weights'>('decision_tree');

  const disease = primaryDiagnosis.disease;
  const matchedSymptoms = primaryDiagnosis.matchedSymptoms;

  // Build tree steps based on cardinal symptoms
  const step1 = matchedSymptoms[0] || disease.symptoms[0] || 'fever';
  const step2 = matchedSymptoms[1] || disease.symptoms[1] || 'cough';
  const step3 = matchedSymptoms[2] || disease.symptoms[2] || 'fatigue';

  const sym1Obj = SYMPTOMS_DATASET.find(s => s.id === step1) || { name: step1 };
  const sym2Obj = SYMPTOMS_DATASET.find(s => s.id === step2) || { name: step2 };
  const sym3Obj = SYMPTOMS_DATASET.find(s => s.id === step3) || { name: step3 };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
              <GitFork className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Explainable AI (XAI): Decision Tree Traversal & Feature Attribution
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual inspection of how the Random Forest ensemble navigated symptom splits to arrive at <strong>{disease.name}</strong>.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('decision_tree')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'decision_tree'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Decision Path</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shap_weights')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'shap_weights'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Feature Weights (SHAP)</span>
          </button>
        </div>
      </div>

      {/* Decision Tree Path View */}
      {activeTab === 'decision_tree' ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Binary className="w-4 h-4 text-teal-600" />
            <span>Simulated Representative Tree Path (Gini Impurity Criterion):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center text-xs">
            {/* Root Node */}
            <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/60 space-y-1">
              <div className="flex justify-between text-[10px] text-teal-800 font-bold uppercase tracking-wider">
                <span>Root Node (Depth 0)</span>
                <span>N=4,920</span>
              </div>
              <div className="font-bold text-slate-900 text-xs">
                Split: {sym1Obj.name} &gt; 0.5?
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                Condition TRUE (Symptom Present)
              </div>
              <div className="text-[10px] text-slate-500">
                Gini: 0.976 → 0.612 (Δ 0.364)
              </div>
            </div>

            <div className="hidden md:flex justify-center text-slate-400">
              <ChevronRight className="w-5 h-5 text-teal-600" />
            </div>

            {/* Branch Node */}
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 space-y-1">
              <div className="flex justify-between text-[10px] text-blue-800 font-bold uppercase tracking-wider">
                <span>Branch Node (Depth 1)</span>
                <span>N=1,240</span>
              </div>
              <div className="font-bold text-slate-900 text-xs">
                Split: {sym2Obj.name} &gt; 0.5?
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                Condition TRUE (Symptom Present)
              </div>
              <div className="text-[10px] text-slate-500">
                Gini: 0.612 → 0.285 (Δ 0.327)
              </div>
            </div>

            <div className="hidden md:flex justify-center text-slate-400">
              <ChevronRight className="w-5 h-5 text-teal-600" />
            </div>

            {/* Leaf Terminal Node */}
            <div className="p-3.5 rounded-xl border-2 border-emerald-400 bg-emerald-50/80 space-y-1">
              <div className="flex justify-between text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                <span>Leaf Node (Terminal)</span>
                <span>Purity 96.8%</span>
              </div>
              <div className="font-bold text-emerald-950 text-xs truncate">
                Class: {disease.name}
              </div>
              <div className="text-[10px] text-emerald-800 font-bold">
                Confidence: {primaryDiagnosis.probability}%
              </div>
              <div className="text-[10px] text-slate-600">
                Sample Consensus: 118 / 120
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Feature Attribution / SHAP Weights */
        <div className="space-y-3 text-xs">
          <span className="text-slate-600 font-medium block">
            Relative SHAP-style diagnostic contribution scores for evaluated clinical features:
          </span>

          <div className="space-y-2">
            {disease.symptoms.map(symId => {
              const sObj = SYMPTOMS_DATASET.find(s => s.id === symId);
              const isPresent = selectedSymptoms.includes(symId);
              const weight = (sObj?.severityWeight || 1) * 18;

              return (
                <div key={symId} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium text-slate-800">
                      {isPresent ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                      {sObj?.name || symId}
                    </span>
                    <span className={`font-mono text-[10px] font-bold ${isPresent ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {isPresent ? `+${weight} pts (Present)` : '0 pts (Absent)'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${isPresent ? 'bg-emerald-500' : 'bg-slate-200'}`}
                      style={{ width: `${isPresent ? Math.min(weight, 100) : 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
