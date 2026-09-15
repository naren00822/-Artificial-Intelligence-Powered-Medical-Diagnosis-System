import React, { useState } from 'react';
import { 
  HelpCircle, 
  Lightbulb, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Sparkles,
  Target
} from 'lucide-react';

interface SymptomQualityTooltipProps {
  selectedSymptomCount: number;
  durationDays: number;
  onOpenGuide: () => void;
}

export const SymptomQualityTooltip: React.FC<SymptomQualityTooltipProps> = ({
  selectedSymptomCount,
  durationDays,
  onOpenGuide
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Compute live quality rating
  let qualityLabel = 'Incomplete';
  let qualityColor = 'text-slate-500 bg-slate-100 border-slate-200';
  let qualityScore = 0;
  let tipText = 'Select 2 to 5 primary symptoms to begin AI evaluation.';

  if (selectedSymptomCount === 0) {
    qualityLabel = 'No Symptoms Selected';
    qualityColor = 'text-slate-500 bg-slate-100 border-slate-200';
    qualityScore = 0;
    tipText = 'Select your primary symptoms to form a clinical diagnostic vector.';
  } else if (selectedSymptomCount === 1) {
    qualityLabel = 'Low Specificity (1 Symptom)';
    qualityColor = 'text-amber-800 bg-amber-50 border-amber-200';
    qualityScore = 40;
    tipText = 'Single symptoms yield wide differentials. Add 1-3 correlated symptoms for higher precision.';
  } else if (selectedSymptomCount >= 2 && selectedSymptomCount <= 5) {
    qualityLabel = 'Optimal AI Specificity';
    qualityColor = 'text-emerald-800 bg-emerald-50 border-emerald-200';
    qualityScore = 95;
    tipText = 'Ideal cluster! 2-5 correlated symptoms provide high Random Forest & SVM classification confidence.';
  } else if (selectedSymptomCount >= 6 && selectedSymptomCount <= 8) {
    qualityLabel = 'High Specificity (Broad)';
    qualityColor = 'text-teal-800 bg-teal-50 border-teal-200';
    qualityScore = 90;
    tipText = 'Comprehensive clinical vector. Ensure symptoms relate to the current acute episode.';
  } else {
    qualityLabel = 'High Feature Density (9+)';
    qualityColor = 'text-blue-800 bg-blue-50 border-blue-200';
    qualityScore = 80;
    tipText = 'Many symptoms selected. Exclude historical or unrelated complaints to avoid classifier noise.';
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
        {/* Left: Quality Badge & Quick Status */}
        <div className="flex items-center gap-2">
          <div 
            className="relative cursor-help"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label="Toggle symptom accuracy tooltip"
          >
            <div className={`px-2.5 py-1 rounded-md border text-[11px] font-bold flex items-center gap-1.5 ${qualityColor}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Input Quality: {qualityLabel}</span>
              <Info className="w-3.5 h-3.5 ml-0.5 opacity-70" />
            </div>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {selectedSymptomCount} selected • {durationDays}d timeline
          </span>
        </div>

        {/* Right: Guide Modal Trigger Button */}
        <button
          type="button"
          id="open-symptom-guide-btn"
          onClick={onOpenGuide}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-teal-800 bg-teal-100/70 hover:bg-teal-100 border border-teal-200 transition-colors shadow-2xs"
          title="Open comprehensive medical symptom description guide"
        >
          <Lightbulb className="w-3.5 h-3.5 text-teal-700" />
          <span>How to Describe Symptoms</span>
          <ChevronRight className="w-3 h-3 text-teal-600" />
        </button>
      </div>

      {/* Floating Hover/Click Tooltip Popover */}
      {showTooltip && (
        <div 
          className="absolute z-30 left-0 top-full mt-2 w-80 sm:w-96 p-4 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 text-xs space-y-3 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-teal-400" />
              Tips for Accurate AI Assessment
            </span>
            <span className="text-[10px] text-teal-400 font-mono font-bold">
              Score: {qualityScore}%
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            {tipText}
          </p>

          <div className="space-y-1.5 text-[11px] text-slate-300 border-t border-slate-800 pt-2">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Cardinal symptom:</strong> Pick your chief complaint first (e.g. chest pain or fever).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Cluster (2-5):</strong> Add concurrent symptoms (e.g. cough + chills).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Vitals &amp; Timeline:</strong> Set duration and vitals for NEWS2 early warning.</span>
            </div>
          </div>

          <button
            type="button"
            id="tooltip-learn-more-btn"
            onClick={() => {
              setShowTooltip(false);
              onOpenGuide();
            }}
            className="w-full mt-2 py-1.5 px-3 bg-teal-500 hover:bg-teal-600 text-white text-[11px] font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-1"
          >
            <span>Read Complete OPQRST &amp; Accuracy Guide</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
