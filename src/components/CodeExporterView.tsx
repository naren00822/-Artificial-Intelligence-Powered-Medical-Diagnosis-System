import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  HelpCircle, 
  FileText, 
  Layers 
} from 'lucide-react';
import { CODE_FILES_DATA } from '../data/academicData';

export const CodeExporterView: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [showExplanations, setShowExplanations] = useState(true);

  const activeFile = CODE_FILES_DATA[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-teal-600" />
            Software Development & Student Source Code Exporter
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Beginner-friendly, modular Python and SQL source code for college project submission. 
            Includes model training, Streamlit / Flask interfaces, and line-by-line examiner explanations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Download {activeFile.filename}
          </button>
        </div>
      </div>

      {/* Tech Stack Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-teal-400" />
          <span className="font-bold">Recommended Student Technology Stack:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['Python 3.10+', 'Pandas', 'NumPy', 'Scikit-Learn', 'Streamlit', 'Flask', 'SQLite3', 'Joblib'].map((tech) => (
            <span key={tech} className="bg-white/10 px-2.5 py-1 rounded font-mono text-teal-200 border border-white/10">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {CODE_FILES_DATA.map((file, idx) => (
          <button
            key={file.filename}
            onClick={() => setActiveFileIndex(idx)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeFileIndex === idx
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            {file.filename}
          </button>
        ))}
      </div>

      {/* Code Viewer & Line-by-Line Explanations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Code Box (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-teal-400 font-bold">{activeFile.filename}</span>
            <span>{activeFile.language.toUpperCase()}</span>
          </div>

          <div className="p-4 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed max-h-128 overflow-y-auto">
            <pre>
              <code>{activeFile.code}</code>
            </pre>
          </div>
        </div>

        {/* Right: Line-by-Line Explanation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                Line-by-Line Academic Explanation
              </h3>
              <button
                onClick={() => setShowExplanations(!showExplanations)}
                className="text-[11px] text-teal-700 hover:underline font-medium"
              >
                {showExplanations ? 'Hide' : 'Show'}
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeFile.description}
            </p>

            {showExplanations && (
              <div className="space-y-3 pt-2">
                {activeFile.lineExplanations.map((exp, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1">
                    <span className="font-mono font-bold text-teal-800 text-[11px] block">
                      📌 {exp.lineRange}
                    </span>
                    <p className="text-slate-700 leading-relaxed">{exp.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Terminal Run Instructions */}
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 text-xs space-y-2">
            <span className="font-bold text-slate-900 block">
              💻 How to Run this on your Machine (Terminal):
            </span>
            <div className="font-mono text-[11px] bg-slate-900 text-teal-300 p-2.5 rounded-lg space-y-1 overflow-x-auto">
              <div># 1. Install required packages</div>
              <div>pip install pandas numpy scikit-learn streamlit flask joblib</div>
              <div className="pt-2"># 2. Train the Random Forest model</div>
              <div>python train_model.py</div>
              <div className="pt-2"># 3. Launch Streamlit Web UI</div>
              <div>streamlit run app_streamlit.py</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
