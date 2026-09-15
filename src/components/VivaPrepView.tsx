import React, { useState } from 'react';
import { 
  GraduationCap, 
  HelpCircle, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';
import { VIVA_QUESTIONS_DATA } from '../data/academicData';

const VIVA_CATEGORIES = [
  'All',
  'AI & ML',
  'Algorithms',
  'Metrics',
  'Dataset',
  'System & Implementation',
  'Ethics & Limitations'
] as const;

export const VivaPrepView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'study' | 'quiz'>('study');
  
  // Quiz / Flashcard State
  const [quizIndex, setQuizIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);

  const filteredQuestions = VIVA_QUESTIONS_DATA.filter(q => {
    const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const currentQuizCard = VIVA_QUESTIONS_DATA[quizIndex];

  const handleQuizNext = (known: boolean) => {
    if (known) {
      setKnownCount(prev => prev + 1);
    } else {
      setReviewedCount(prev => prev + 1);
    }

    if (quizIndex < VIVA_QUESTIONS_DATA.length - 1) {
      setQuizIndex(prev => prev + 1);
      setIsAnswerRevealed(false);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setIsAnswerRevealed(false);
    setKnownCount(0);
    setReviewedCount(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-teal-600" />
            Viva Voce Oral Examination Trainer
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Frequently asked questions by college examiners on AI/ML algorithms, evaluation metrics (Recall vs Precision), 
            data preprocessing, and medical ethics. Includes interactive flashcards and study guides.
          </p>
        </div>

        {/* Study vs Quiz Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setMode('study')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              mode === 'study' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Study List Mode
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              mode === 'quiz' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Flashcard Quiz Mode
          </button>
        </div>
      </div>

      {/* QUIZ FLASHCARD MODE */}
      {mode === 'quiz' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Flashcard <strong className="text-teal-700">{quizIndex + 1}</strong> of {VIVA_QUESTIONS_DATA.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-700 font-semibold">Mastered: {knownCount}</span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-700 font-semibold">Review: {reviewedCount}</span>
            </div>
          </div>

          {/* Flashcard Card */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-sm space-y-6 min-h-80 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  {currentQuizCard.category}
                </span>
                <span className="text-xs text-slate-400">Oral Viva Simulation</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentQuizCard.question}
              </h3>

              {isAnswerRevealed ? (
                <div className="space-y-3 pt-4 border-t border-slate-100 animate-fadeIn">
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Model Examiner Answer:</strong>
                    {currentQuizCard.answer}
                  </div>
                  <div className="bg-teal-50 border border-teal-200 p-3 rounded-lg text-xs text-teal-950">
                    <strong className="text-teal-800">💡 College Examiner Tip:</strong> {currentQuizCard.simpleExplanation}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-3">
                    Try answering aloud to yourself first before revealing the answer.
                  </p>
                  <button
                    onClick={() => setIsAnswerRevealed(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Reveal Model Answer
                  </button>
                </div>
              )}
            </div>

            {/* Answer feedback buttons */}
            {isAnswerRevealed && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  onClick={() => handleQuizNext(false)}
                  className="px-4 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                >
                  Need to Review Again
                </button>
                <button
                  onClick={() => handleQuizNext(true)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
                >
                  I Knew This! Next Question →
                </button>
              </div>
            )}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleRestartQuiz}
              className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Restart Flashcard Session
            </button>
          </div>
        </div>
      )}

      {/* STUDY LIST MODE */}
      {mode === 'study' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search viva questions (e.g. recall, overfitting, random forest)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {VIVA_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Question Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q, idx) => (
              <div 
                key={q.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {q.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Q{idx + 1}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h4>

                  <p className="text-xs text-slate-700 leading-relaxed pt-1">
                    {q.answer}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-[11px] text-slate-600">
                  <span className="font-semibold text-teal-800">Examiner Context: </span>
                  {q.simpleExplanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
