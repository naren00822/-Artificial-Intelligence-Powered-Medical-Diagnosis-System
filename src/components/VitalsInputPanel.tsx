import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  Wind, 
  Thermometer, 
  Gauge, 
  Droplet, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Info
} from 'lucide-react';
import { PatientVitals, EarlyWarningScore } from '../types';
import { computeEarlyWarningScores, DEFAULT_HEALTHY_VITALS } from '../services/clinicalVitalsEngine';

interface VitalsInputPanelProps {
  vitals: PatientVitals;
  onChange: (vitals: PatientVitals) => void;
  earlyWarningScore?: EarlyWarningScore;
}

export const VitalsInputPanel: React.FC<VitalsInputPanelProps> = ({
  vitals,
  onChange,
  earlyWarningScore
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Compute live score if not passed
  const currentEws = earlyWarningScore || computeEarlyWarningScores(vitals);

  const getRiskColor = (risk: EarlyWarningScore['news2Risk']) => {
    switch (risk) {
      case 'High':
        return 'bg-rose-50 border-rose-300 text-rose-800';
      case 'Medium':
        return 'bg-amber-50 border-amber-300 text-amber-800';
      case 'Low-Medium':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      case 'Low':
      default:
        return 'bg-emerald-50 border-emerald-300 text-emerald-800';
    }
  };

  const applyPreset = (preset: Partial<PatientVitals>) => {
    onChange({ ...vitals, ...preset });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-600 text-white shadow-xs">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Bedside Vital Signs & Clinical Early Warning (NEWS2)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-teal-100 text-teal-800 border border-teal-200">
                qSOFA & Sepsis Triage
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Heart Rate: <strong className="text-slate-800">{vitals.heartRate} bpm</strong> • 
              BP: <strong className="text-slate-800">{vitals.systolicBp}/{vitals.diastolicBp}</strong> • 
              SpO2: <strong className="text-slate-800">{vitals.oxygenSaturation}%</strong> • 
              Temp: <strong className="text-slate-800">{vitals.temperatureC}°C</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* NEWS2 Mini Badge */}
          <div className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${getRiskColor(currentEws.news2Risk)}`}>
            <span>NEWS2: {currentEws.news2Score}</span>
            <span className="text-[10px] font-bold uppercase">({currentEws.news2Risk} Risk)</span>
          </div>

          <button
            type="button"
            className="p-1 rounded-md text-slate-500 hover:text-slate-700"
            aria-label={isOpen ? 'Collapse vitals' : 'Expand vitals'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Vitals Controls */}
      {isOpen && (
        <div className="p-5 border-t border-slate-200 space-y-5">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Quick Clinical Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset(DEFAULT_HEALTHY_VITALS)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition-colors"
            >
              Normal Resting
            </button>
            <button
              type="button"
              onClick={() => applyPreset({ heartRate: 116, temperatureC: 39.2, respiratoryRate: 22, systolicBp: 104 })}
              className="text-[11px] px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-medium transition-colors"
            >
              Febrile / Pyrexic
            </button>
            <button
              type="button"
              onClick={() => applyPreset({ respiratoryRate: 26, oxygenSaturation: 91, heartRate: 112 })}
              className="text-[11px] px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-medium transition-colors"
            >
              Respiratory Distress (SpO2 91%)
            </button>
            <button
              type="button"
              onClick={() => applyPreset({ systolicBp: 86, diastolicBp: 54, heartRate: 122, respiratoryRate: 24 })}
              className="text-[11px] px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-medium transition-colors"
            >
              Hypotensive Shock (Sys 86)
            </button>
          </div>

          {/* Vitals Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Heart Rate */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="text-slate-600 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  Heart Rate (Pulse)
                </span>
                <span className="font-bold text-slate-900">{vitals.heartRate} bpm</span>
              </label>
              <input
                type="range"
                min={35}
                max={180}
                value={vitals.heartRate}
                onChange={e => onChange({ ...vitals, heartRate: parseInt(e.target.value) })}
                className="w-full accent-rose-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>35 Brady</span>
                <span>Normal: 60-100</span>
                <span>180 Tachy</span>
              </div>
            </div>

            {/* Blood Pressure (Systolic / Diastolic) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="text-slate-600 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-600" />
                  Systolic / Diastolic BP
                </span>
                <span className="font-bold text-slate-900">{vitals.systolicBp} / {vitals.diastolicBp} mmHg</span>
              </label>
              <input
                type="range"
                min={70}
                max={220}
                value={vitals.systolicBp}
                onChange={e => onChange({ ...vitals, systolicBp: parseInt(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>70 Shock</span>
                <span>Normal: 120/80</span>
                <span>220 Crisis</span>
              </div>
            </div>

            {/* Respiratory Rate */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="text-slate-600 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-teal-600" />
                  Respiratory Rate
                </span>
                <span className="font-bold text-slate-900">{vitals.respiratoryRate} /min</span>
              </label>
              <input
                type="range"
                min={6}
                max={40}
                value={vitals.respiratoryRate}
                onChange={e => onChange({ ...vitals, respiratoryRate: parseInt(e.target.value) })}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>6 Bradypnea</span>
                <span>Normal: 12-20</span>
                <span>40 Tachypnea</span>
              </div>
            </div>

            {/* Temperature */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="text-slate-600 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                  Body Temperature
                </span>
                <span className="font-bold text-slate-900">{vitals.temperatureC}°C ({(vitals.temperatureC * 9/5 + 32).toFixed(1)}°F)</span>
              </label>
              <input
                type="range"
                min={34.5}
                max={41.5}
                step={0.1}
                value={vitals.temperatureC}
                onChange={e => onChange({ ...vitals, temperatureC: parseFloat(e.target.value) })}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>34.5 Hypo</span>
                <span>Normal: 36.5-37.5</span>
                <span>41.5 Severe</span>
              </div>
            </div>

            {/* Oxygen Saturation (SpO2) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="text-slate-600 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-600" />
                  Oxygen Saturation (SpO2)
                </span>
                <span className={`font-bold ${vitals.oxygenSaturation < 94 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {vitals.oxygenSaturation}%
                </span>
              </label>
              <input
                type="range"
                min={80}
                max={100}
                value={vitals.oxygenSaturation}
                onChange={e => onChange({ ...vitals, oxygenSaturation: parseInt(e.target.value) })}
                className="w-full accent-cyan-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>80% Severe</span>
                <span>Target: 95-100%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Capillary Blood Glucose */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="text-slate-600 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-purple-600" />
                  Capillary Blood Glucose
                </span>
                <span className="font-bold text-slate-900">{vitals.bloodGlucose || 100} mg/dL</span>
              </label>
              <input
                type="range"
                min={50}
                max={400}
                value={vitals.bloodGlucose || 100}
                onChange={e => onChange({ ...vitals, bloodGlucose: parseInt(e.target.value) })}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>50 Hypo</span>
                <span>Normal: 70-140</span>
                <span>400 Hyper</span>
              </div>
            </div>
          </div>

          {/* Clinical Early Warning Summary */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-teal-600" />
                  Physiological Early Warning Assessment
                </h4>
                <p className="text-[11px] text-slate-500">
                  Adheres to Royal College of Physicians National Early Warning Score (NEWS2) & Sepsis-3 qSOFA protocols.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">NEWS2 Aggregate:</span>
                  <span className="text-sm font-black text-slate-900">{currentEws.news2Score} / 20</span>
                </div>
                <div className="text-right pl-3 border-l border-slate-200">
                  <span className="text-[10px] text-slate-500 block">qSOFA Sepsis:</span>
                  <span className={`text-sm font-black ${currentEws.qSofaScore >= 2 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {currentEws.qSofaScore} / 3
                  </span>
                </div>
              </div>
            </div>

            {/* Active Clinical Flags */}
            {currentEws.flags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {currentEws.flags.map((flag, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200"
                  >
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    {flag}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md p-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All physiological vital signs are currently within safe baseline ambulatory parameters.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
