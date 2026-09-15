import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Pill, 
  HeartHandshake, 
  Activity, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { DrugSafetyInfo } from '../types';

interface DrugSafetyCardProps {
  drugSafety?: DrugSafetyInfo;
}

export const DrugSafetyCard: React.FC<DrugSafetyCardProps> = ({ drugSafety }) => {
  if (!drugSafety) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              <Pill className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Pharmacotherapy Safety & Contraindication Advisory
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Clinical medication contraindications, harmful drug interactions, and safe supportive care guidelines for {drugSafety.conditionName}.
          </p>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-rose-100 text-rose-800 border border-rose-300 self-start sm:self-auto">
          High-Risk Medication Safeguard
        </span>
      </div>

      {/* Contraindicated Drugs List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          Medications Strictly Contraindicated or High-Risk:
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {drugSafety.contraindicatedDrugs.map((item, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <strong className="text-xs font-bold text-rose-950">
                  {item.drug}
                </strong>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                  item.severity === 'critical' 
                    ? 'bg-rose-600 text-white border-rose-700' 
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {item.severity}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Drug Class: {item.class}
              </div>
              <p className="text-[11px] text-rose-900/90 leading-relaxed">
                <strong>Mechanism of Harm:</strong> {item.danger}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Supportive Regimens & Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
        {/* Safe Supportive Care */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-teal-600" />
            Recommended Safe Supportive Measures
          </h4>
          <ul className="space-y-1.5 text-slate-700 text-[11px]">
            {drugSafety.safeSupportiveCare.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Clinical Monitoring Parameters */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-600" />
            Key Clinical & Laboratory Monitoring
          </h4>
          <ul className="space-y-1.5 text-slate-700 text-[11px]">
            {drugSafety.clinicalMonitoring.map((param, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                <span>{param}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Regulatory Reminder */}
      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          <strong>Clinical Prescribing Notice:</strong> Medication adjustments must only be conducted by licensed healthcare professionals following comprehensive physical assessment and review of patient allergy history.
        </span>
      </div>
    </div>
  );
};
