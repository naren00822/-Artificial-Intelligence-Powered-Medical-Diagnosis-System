import React, { useState } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Mic, 
  Maximize2, 
  CheckCircle2, 
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { PRESENTATION_SLIDES_DATA } from '../data/academicData';

export const PresentationView: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(true);

  const currentSlide = PRESENTATION_SLIDES_DATA[currentSlideIndex];
  const totalSlides = PRESENTATION_SLIDES_DATA.length;

  const nextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Presentation className="w-6 h-6 text-teal-600" />
            12-Slide College Presentation (PPT) Mode & Speaker Scripts
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Clean, examination-ready slides covering problem statement, architecture, ML results, and ethics. 
            Includes verbatim speaker notes detailing exactly what to say to the college examiners.
          </p>
        </div>

        {/* Slide Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="text-xs font-semibold text-slate-600">
            Slide <span className="text-teal-700 font-bold">{currentSlideIndex + 1}</span> of {totalSlides}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === totalSlides - 1}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation Thumbnails */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {PRESENTATION_SLIDES_DATA.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
              currentSlideIndex === idx
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {slide.id}. {slide.title.length > 25 ? slide.title.substring(0, 22) + '...' : slide.title}
          </button>
        ))}
      </div>

      {/* Main Slide Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 sm:p-12 relative overflow-hidden min-h-100 flex flex-col justify-between">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/70 rounded-bl-full pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-50 rounded-tr-full pointer-events-none -z-0" />

        <div className="relative z-10 space-y-6">
          {/* Top Metadata */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-xs uppercase font-bold tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              {currentSlide.visualTag}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              AI-Powered Medical Diagnosis System • Capstone
            </span>
          </div>

          {/* Slide Title */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentSlide.title}
            </h3>
            <p className="text-sm font-medium text-teal-700 mt-1">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Slide Bullets */}
          <div className="space-y-3.5 pt-4">
            {currentSlide.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-normal">
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-8 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Department of Computer Science & Engineering</span>
          <span className="font-mono font-semibold text-slate-600">Slide {currentSlideIndex + 1} of {totalSlides}</span>
        </div>
      </div>

      {/* Speaker Notes (What to say out loud during viva/presentation) */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
            <Mic className="w-4 h-4 text-amber-700" />
            Speaker Talk Script (What you should say to the examiners for Slide {currentSlideIndex + 1})
          </h4>
          <span className="text-[11px] text-amber-800 font-semibold bg-amber-100 px-2.5 py-0.5 rounded-full">
            Viva Presentation Script
          </span>
        </div>

        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed italic bg-white/70 p-4 rounded-lg border border-amber-200/60">
          "{currentSlide.speakerNotes}"
        </p>
        
        <div className="flex items-center justify-between text-[11px] text-amber-800 pt-1">
          <span>Tip: Speak with confidence, maintain eye contact with the examiners, and emphasize patient safety.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="text-amber-900 hover:underline font-semibold disabled:opacity-40"
            >
              Previous Slide
            </button>
            <span>•</span>
            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === totalSlides - 1}
              className="text-amber-900 hover:underline font-semibold disabled:opacity-40"
            >
              Next Slide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
