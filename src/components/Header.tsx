import React from 'react';
import { 
  Stethoscope, 
  Cpu, 
  GitBranch, 
  Code2, 
  BookOpen, 
  Presentation, 
  GraduationCap, 
  AlertTriangle 
} from 'lucide-react';

export type ActiveTab = 'diagnosis' | 'model_lab' | 'architecture' | 'code' | 'docs' | 'presentation' | 'viva';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'diagnosis' as ActiveTab, label: 'Live Diagnosis', icon: Stethoscope },
    { id: 'model_lab' as ActiveTab, label: 'AI/ML Model Lab', icon: Cpu },
    { id: 'architecture' as ActiveTab, label: 'Architecture & DB', icon: GitBranch },
    { id: 'code' as ActiveTab, label: 'Python Code', icon: Code2 },
    { id: 'docs' as ActiveTab, label: 'Project Report', icon: BookOpen },
    { id: 'presentation' as ActiveTab, label: 'PPT Slides', icon: Presentation },
    { id: 'viva' as ActiveTab, label: 'Viva Voce Prep', icon: GraduationCap },
  ];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      {/* Top Warning Banner: Strict Medical Ethics */}
      <div className="bg-amber-50 border-b border-amber-200/60 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-medium">
            Academic Demonstration Only: This AI system provides preliminary educational triage. It does NOT replace a licensed medical doctor.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shadow-teal-700/20">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  AI Medical Diagnosis System
                </h1>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  College Capstone Project
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Clinical Decision Support System (CDSS) • Machine Learning & Triage Architecture
              </p>
            </div>
          </div>

          {/* Academic Badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-700">Random Forest Ensemble: 96.8% Accuracy</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-2 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
