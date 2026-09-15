import React from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Layers, 
  TrendingUp, 
  ShieldCheck,
  Scale
} from 'lucide-react';
import { ModelComparisonResult } from '../types';

interface MultiModelComparisonCardProps {
  comparisons?: ModelComparisonResult[];
  primaryDiseaseName: string;
}

export const MultiModelComparisonCard: React.FC<MultiModelComparisonCardProps> = ({
  comparisons,
  primaryDiseaseName
}) => {
  if (!comparisons || comparisons.length === 0) return null;

  const totalModels = comparisons.length;
  const agreementCount = comparisons.filter(
    m => m.predictedDisease.toLowerCase() === primaryDiseaseName.toLowerCase()
  ).length;

  const agreementPercentage = Math.round((agreementCount / totalModels) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Multi-Model Ensemble Consensus & Comparative Validation
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Validates Random Forest predictions concurrently against SVM, Naive Bayes, and KNN classifiers to evaluate algorithmic agreement.
          </p>
        </div>

        {/* Agreement Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            agreementCount >= 3 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}>
            {agreementCount >= 3 ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600" />
            )}
            <span>
              {agreementCount} / {totalModels} Models Agree ({agreementPercentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Models */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {comparisons.map(model => {
          const isAgreed = model.predictedDisease.toLowerCase() === primaryDiseaseName.toLowerCase();
          const isPrimary = model.shortName === 'Random Forest';

          return (
            <div 
              key={model.algorithm}
              className={`p-4 rounded-xl border transition-all ${
                isPrimary 
                  ? 'bg-teal-50/50 border-teal-300 ring-1 ring-teal-400/30' 
                  : isAgreed 
                    ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300' 
                    : 'bg-amber-50/40 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-bold text-xs text-slate-900 truncate">
                  {model.shortName}
                </span>
                {isPrimary && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-600 text-white shrink-0">
                    Primary
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Prediction</span>
                  <strong className={`block truncate ${isAgreed ? 'text-slate-900' : 'text-amber-800'}`}>
                    {model.predictedDisease}
                  </strong>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-slate-500">Confidence</span>
                    <strong className="text-slate-900 font-mono">{model.confidence}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        isPrimary ? 'bg-teal-600' : isAgreed ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${model.confidence}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    {model.latencyMs}ms inference
                  </span>
                  <span>{model.matchedFeatureCount} features</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Note */}
      <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2 border border-slate-200">
        <Scale className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Ensemble Validation Theory:</strong> Single classifiers can be vulnerable to local decision boundary artifacts or feature correlation bias. Cross-validating predictions across decision trees (Random Forest), maximum-margin hyperplanes (SVM), conditional probability (Naive Bayes), and nearest neighbor distance (KNN) enhances decision robustness before human clinical review.
        </p>
      </div>
    </div>
  );
};
