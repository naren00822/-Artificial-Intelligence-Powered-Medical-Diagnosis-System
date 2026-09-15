import React, { useState } from 'react';
import { 
  BookOpen, 
  UserCheck, 
  ArrowRight, 
  Lightbulb, 
  Stethoscope, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CLINICAL_CASE_VIGNETTES } from '../data/clinicalVignettes';
import { ClinicalVignette } from '../types';

interface CaseVignettesSelectorProps {
  onSelectCase: (vignette: ClinicalVignette) => void;
  activeCaseId?: string;
}

export const CaseVignettesSelector: React.FC<CaseVignettesSelectorProps> = ({
  onSelectCase,
  activeCaseId
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-teal-50/60 hover:bg-teal-50 cursor-pointer transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-600 text-white shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-teal-950">
                Patient Simulator & Clinical Case Vignettes
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-white text-teal-800 border border-teal-200">
                6 Real-World Cases
              </span>
            </div>
            <p className="text-[11px] text-teal-900/80 mt-0.5">
              Load realistic patient intake scenarios to test diagnostic accuracy, vital signs early warning, and medication contraindications.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-xs font-semibold text-teal-800 flex items-center gap-1 hover:underline"
        >
          <span>{isExpanded ? 'Hide Cases' : 'Explore Case Studies'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-teal-100 bg-teal-50/20 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CLINICAL_CASE_VIGNETTES.map(vignette => {
              const isSelected = activeCaseId === vignette.id;

              return (
                <div
                  key={vignette.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between text-xs ${
                    isSelected 
                      ? 'bg-teal-100/60 border-teal-400 ring-2 ring-teal-500/20 shadow-xs' 
                      : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="font-bold text-slate-900 text-xs">
                        {vignette.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                        {vignette.patientDemographics.gender}, {vignette.patientDemographics.ageGroup}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-2">
                      {vignette.clinicalNarrative}
                    </p>

                    <div className="text-[10px] text-teal-800 bg-teal-50 border border-teal-200/80 rounded p-1.5 mb-3 flex items-start gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        <strong>Teaching Focus:</strong> {vignette.teachingPoint}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCase(vignette)}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isSelected 
                        ? 'bg-teal-700 text-white' 
                        : 'bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Case Loaded' : 'Load Patient Case'}</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
