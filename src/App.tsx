import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { DiagnosisView } from './components/DiagnosisView';
import { ModelLabView } from './components/ModelLabView';
import { SystemArchitectureView } from './components/SystemArchitectureView';
import { CodeExporterView } from './components/CodeExporterView';
import { DocumentationView } from './components/DocumentationView';
import { PresentationView } from './components/PresentationView';
import { VivaPrepView } from './components/VivaPrepView';
import { Stethoscope, HeartHandshake, ShieldCheck, Github, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('diagnosis');

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'diagnosis' && <DiagnosisView />}
        {activeTab === 'model_lab' && <ModelLabView />}
        {activeTab === 'architecture' && <SystemArchitectureView />}
        {activeTab === 'code' && <CodeExporterView />}
        {activeTab === 'docs' && <DocumentationView />}
        {activeTab === 'presentation' && <PresentationView />}
        {activeTab === 'viva' && <VivaPrepView />}
      </main>

      {/* Academic Project Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
              AI
            </div>
            <span className="font-semibold text-slate-700">
              Artificial Intelligence-Powered Medical Diagnosis System
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline">Undergraduate Engineering Capstone</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button 
              onClick={() => setActiveTab('docs')} 
              className="hover:text-teal-700 hover:underline"
            >
              Academic Report
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('presentation')} 
              className="hover:text-teal-700 hover:underline"
            >
              PPT Slides
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('viva')} 
              className="hover:text-teal-700 hover:underline"
            >
              Viva Questions
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

