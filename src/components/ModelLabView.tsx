import React, { useState } from 'react';
import { 
  Cpu, 
  BarChart3, 
  Table2, 
  HelpCircle, 
  TrendingUp, 
  Layers, 
  CheckCircle, 
  AlertCircle,
  Database,
  ArrowRight
} from 'lucide-react';
import { ML_BENCHMARKS, TOP_FEATURE_IMPORTANCE, CONFUSION_MATRIX_SAMPLE, SYMPTOMS_DATASET } from '../data/medicalData';
import { runMultiModelInference } from '../services/multiModelEngine';
import { Zap, Play } from 'lucide-react';

export const ModelLabView: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState(ML_BENCHMARKS[0]);
  const [activeMetricTab, setActiveMetricTab] = useState<'accuracy' | 'precision' | 'recall' | 'f1'>('recall');
  const [testSymptoms, setTestSymptoms] = useState<string[]>(['fever', 'cough', 'fatigue']);
  const [liveResults, setLiveResults] = useState(() => runMultiModelInference(['fever', 'cough', 'fatigue']));

  const handleToggleTestSymptom = (symId: string) => {
    const updated = testSymptoms.includes(symId)
      ? testSymptoms.filter(s => s !== symId)
      : [...testSymptoms, symId];
    setTestSymptoms(updated);
    if (updated.length > 0) {
      setLiveResults(runMultiModelInference(updated));
    }
  };

  const handleRunLiveInference = () => {
    if (testSymptoms.length > 0) {
      setLiveResults(runMultiModelInference(testSymptoms));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-teal-600" />
          AI & Machine Learning Component Lab
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Comprehensive academic evaluation of supervised classification algorithms, dataset specifications, 
          evaluation metrics (Accuracy, Precision, Recall, F1), confusion matrix analysis, and feature importances.
        </p>
      </div>

      {/* 1. Algorithm Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Table2 className="w-5 h-5 text-teal-600" />
              Machine Learning Algorithm Comparison Benchmark
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Trained and tested on 4,920 clinical symptom vectors (80% Train, 20% Stratified Test Split).
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
            Primary Model: Random Forest (96.8%)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-3 font-semibold">Algorithm</th>
                <th className="p-3 font-semibold text-center">Accuracy</th>
                <th className="p-3 font-semibold text-center">Precision</th>
                <th className="p-3 font-semibold text-center">Recall</th>
                <th className="p-3 font-semibold text-center">F1-Score</th>
                <th className="p-3 font-semibold text-center">Train Time</th>
                <th className="p-3 font-semibold">Primary Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ML_BENCHMARKS.map((bm) => {
                const isSelected = selectedAlgo.algorithm === bm.algorithm;
                return (
                  <tr 
                    key={bm.algorithm}
                    onClick={() => setSelectedAlgo(bm)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-teal-50/70 font-medium text-slate-900' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <td className="p-3 flex items-center gap-2">
                      {isSelected && <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />}
                      <span className={isSelected ? 'font-bold text-teal-950' : 'text-slate-800'}>
                        {bm.algorithm}
                      </span>
                    </td>
                    <td className="p-3 text-center font-semibold text-slate-900">{bm.accuracy}%</td>
                    <td className="p-3 text-center">{bm.precision}%</td>
                    <td className="p-3 text-center">{bm.recall}%</td>
                    <td className="p-3 text-center font-semibold text-teal-700">{bm.f1Score}%</td>
                    <td className="p-3 text-center text-slate-500">{bm.trainingTimeMs} ms</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{bm.whyAppropriate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Deep Dive on Selected Algorithm */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-900 block mb-1">
              Why Selected: {selectedAlgo.algorithm}
            </span>
            <p className="text-slate-600 leading-relaxed">{selectedAlgo.whyAppropriate}</p>
          </div>
          <div className="space-y-1">
            <div>
              <span className="font-semibold text-emerald-800">Advantages: </span>
              <span className="text-slate-600">{selectedAlgo.pros}</span>
            </div>
            <div>
              <span className="font-semibold text-rose-800">Limitations: </span>
              <span className="text-slate-600">{selectedAlgo.cons}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Live Multi-Model Inference Sandbox */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Real-Time Multi-Model Comparative Sandbox
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select symptoms to execute simultaneous real-time inference across Random Forest, SVM (RBF), Naive Bayes, and KNN classifiers.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRunLiveInference}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Re-evaluate All Models
          </button>
        </div>

        {/* Symptom chips for testing */}
        <div>
          <span className="text-xs font-semibold text-slate-700 block mb-2">
            Active Test Vector ({testSymptoms.length} active features):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['fever', 'cough', 'fatigue', 'shortness_of_breath', 'chest_pain', 'headache', 'nausea', 'vomiting', 'diarrhea', 'joint_pain', 'chills', 'dizziness'].map(symId => {
              const sObj = SYMPTOMS_DATASET.find(s => s.id === symId);
              const isSelected = testSymptoms.includes(symId);
              return (
                <button
                  key={symId}
                  onClick={() => handleToggleTestSymptom(symId)}
                  className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                    isSelected 
                      ? 'bg-teal-600 text-white border-teal-700 shadow-xs' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {sObj?.name || symId}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Comparison Output Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {liveResults.comparisons.map(model => (
            <div 
              key={model.algorithm}
              className={`p-4 rounded-xl border transition-all ${
                model.shortName === 'Random Forest'
                  ? 'bg-teal-50/70 border-teal-300 ring-1 ring-teal-400/20'
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">{model.shortName}</span>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {model.latencyMs}ms
                </span>
              </div>
              <div className="text-xs space-y-1.5">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Predicted Class:</span>
                  <strong className="text-slate-900 block truncate">{model.predictedDisease}</strong>
                </div>
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mb-0.5">
                    <span>Confidence</span>
                    <strong className="text-slate-800 font-mono">{model.confidence}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-600 rounded-full"
                      style={{ width: `${model.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Metric Explainer & Formulas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Evaluation Metrics Explained (Viva Ready)
            </h3>
          </div>
          
          <div className="flex gap-2 border-b border-slate-200 pb-2">
            {(['recall', 'precision', 'accuracy', 'f1'] as const).map(m => (
              <button
                key={m}
                onClick={() => setActiveMetricTab(m)}
                className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  activeMetricTab === m 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-3">
            {activeMetricTab === 'recall' && (
              <div>
                <div className="flex items-center justify-between font-bold text-slate-900 text-sm mb-1">
                  <span>Recall (Sensitivity): 96.4%</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                    MOST CRITICAL IN HEALTHCARE
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Recall measures the fraction of actual positive disease cases that the model correctly predicted.
                  <br />
                  <code className="bg-white px-2 py-0.5 border rounded text-teal-800 font-mono inline-block my-1.5">
                    Recall = TP / (TP + FN)
                  </code>
                </p>
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded text-rose-900 mt-2">
                  <strong>Examiner Key Point:</strong> In clinical diagnosis, a False Negative (FN) means telling a severely sick patient they are fine. This delay in treatment can be fatal, which is why clinical models prioritize high recall.
                </div>
              </div>
            )}

            {activeMetricTab === 'precision' && (
              <div>
                <div className="font-bold text-slate-900 text-sm mb-1">
                  Precision (Positive Predictive Value): 97.2%
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Precision measures what proportion of predicted disease cases were genuinely positive.
                  <br />
                  <code className="bg-white px-2 py-0.5 border rounded text-teal-800 font-mono inline-block my-1.5">
                    Precision = TP / (TP + FP)
                  </code>
                </p>
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-amber-900 mt-2">
                  <strong>Examiner Key Point:</strong> High precision prevents False Positives (FP), avoiding unnecessary patient anxiety, unnecessary prescriptions, and costly diagnostic hospital tests.
                </div>
              </div>
            )}

            {activeMetricTab === 'accuracy' && (
              <div>
                <div className="font-bold text-slate-900 text-sm mb-1">
                  Overall Classification Accuracy: 96.8%
                </div>
                <p className="text-slate-600 leading-relaxed">
                  The percentage of total correct predictions (both positive and negative) across all test samples.
                  <br />
                  <code className="bg-white px-2 py-0.5 border rounded text-teal-800 font-mono inline-block my-1.5">
                    Accuracy = (TP + TN) / (TP + TN + FP + FN)
                  </code>
                </p>
                <div className="bg-slate-100 border border-slate-300 p-2.5 rounded text-slate-800 mt-2">
                  <strong>Examiner Key Point:</strong> Accuracy alone is inadequate when datasets have class imbalance. That is why we report macro-averaged F1 and Confusion Matrices alongside accuracy.
                </div>
              </div>
            )}

            {activeMetricTab === 'f1' && (
              <div>
                <div className="font-bold text-slate-900 text-sm mb-1">
                  F1-Score (Harmonic Mean): 96.8%
                </div>
                <p className="text-slate-600 leading-relaxed">
                  The harmonic mean of precision and recall, ensuring both metrics are balanced equally.
                  <br />
                  <code className="bg-white px-2 py-0.5 border rounded text-teal-800 font-mono inline-block my-1.5">
                    F1 = 2 × (Precision × Recall) / (Precision + Recall)
                  </code>
                </p>
                <div className="bg-teal-50 border border-teal-200 p-2.5 rounded text-teal-900 mt-2">
                  <strong>Examiner Key Point:</strong> Harmonic mean penalizes extreme imbalances far more than a simple arithmetic average, providing a reliable measure of multi-class clinical stability.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Confusion Matrix Sample */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              Confusion Matrix Analysis (Representative Sample)
            </h3>
            <span className="text-xs text-slate-500">True vs. Predicted</span>
          </div>

          <p className="text-xs text-slate-600">
            Evaluating true positive diagonal density versus off-diagonal misclassifications between clinically overlapping conditions.
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {CONFUSION_MATRIX_SAMPLE.map((cell, idx) => {
              const isMatch = cell.actual === cell.predicted;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                    isMatch
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/70 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{cell.actual}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className={isMatch ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                      {cell.predicted}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span>{cell.count} cases</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      isMatch ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                    }`}>
                      {cell.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Notice high diagonal concentration (94-100%) indicating robust condition discriminability.
          </p>
        </div>
      </div>

      {/* 4. Top Feature Importances (Gini Impurity) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              Symptom Feature Importance (Random Forest Gini Impurity Decrease)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Which clinical symptoms provide the highest information gain when splitting decision trees?
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700 self-start sm:self-auto">
            132 Total Binary Symptoms Evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-2">
          {TOP_FEATURE_IMPORTANCE.map((feat, idx) => (
            <div key={feat.symptom} className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800">
                  <span className="text-slate-400 mr-2 font-mono">{idx + 1}.</span>
                  {feat.symptom}
                </span>
                <span className="font-mono text-teal-700 font-bold">
                  {(feat.importanceScore * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-600 rounded-full"
                  style={{ width: `${(feat.importanceScore / 0.15) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Dataset Architecture Specifications */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-bold flex items-center gap-2 mb-3">
          <Database className="w-5 h-5 text-teal-400" />
          Benchmark Dataset Specifications (Kaggle Disease & Symptoms Reference)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <span className="text-2xl font-bold text-teal-300 block">132</span>
            <span className="text-xs text-slate-400">Binary Features (Symptoms)</span>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <span className="text-2xl font-bold text-teal-300 block">42</span>
            <span className="text-xs text-slate-400">Target Medical Conditions</span>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <span className="text-2xl font-bold text-teal-300 block">4,920</span>
            <span className="text-xs text-slate-400">Balanced Records</span>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <span className="text-2xl font-bold text-teal-300 block">80 / 20</span>
            <span className="text-xs text-slate-400">Stratified Train / Test Split</span>
          </div>
        </div>
      </div>
    </div>
  );
};
