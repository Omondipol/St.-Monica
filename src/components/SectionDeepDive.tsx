import React, { useState } from 'react';
import { SECTION_ANALYSIS } from '../data/planData';
import { BookOpen, Search, ArrowRight, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

export const SectionDeepDive: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>("01");
  const [filterQuery, setFilterQuery] = useState<string>("");

  const currentSection = SECTION_ANALYSIS.find(s => s.number === selectedSection) || SECTION_ANALYSIS[0];

  const filteredSections = SECTION_ANALYSIS.filter(s => 
    s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.summary.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.number.includes(filterQuery)
  );

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1058A8] mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Exhaustive Document Breakdown (Pages 1–16)</span>
        </div>
        <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
          13-Section Deep Dive & Critical Analysis
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#0C2340]/80 font-source max-w-3xl">
          Granular inspection of every chapter in Polycarp Ochieng's proposal. 
          Examine the strategic implications, developer commentary, verbatim textual requirements, 
          and governance responsibilities for the St. Monica Choir leadership.
        </p>

        {/* Search bar */}
        <div className="mt-6 pt-4 border-t border-[#0C2340]/10 flex items-center max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#0C2340]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across all 13 sections (e.g. M-Pesa, audio, Sprints)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-source border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
            />
          </div>
        </div>
      </div>

      {/* Two-Column Master / Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Section Navigator Rail */}
        <div className="lg:col-span-4 bg-white border border-[#0C2340]/10 rounded-xl p-3 shadow-xs space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-[#0C2340]/50 uppercase tracking-wider">
            Table of Contents (13 Sections)
          </div>
          
          <div className="space-y-1 max-h-[640px] overflow-y-auto pr-1">
            {filteredSections.map((sec) => {
              const isSelected = sec.number === selectedSection;
              return (
                <button
                  key={sec.number}
                  onClick={() => setSelectedSection(sec.number)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-source transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#1058A8] text-white font-semibold shadow-xs'
                      : 'text-[#0C2340]/80 hover:bg-[#EAF4FB] hover:text-[#0C2340]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <span className={`font-mono text-[11px] shrink-0 ${isSelected ? 'text-white' : 'text-[#1058A8]'}`}>
                      {sec.number}.
                    </span>
                    <span className="truncate">{sec.title}</span>
                  </div>
                  <span className={`text-[10px] shrink-0 ${isSelected ? 'text-white/80' : 'text-[#0C2340]/40'}`}>
                    p.{sec.page}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Inspection of Selected Section */}
        <div className="lg:col-span-8 bg-white border border-[#0C2340]/10 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#0C2340]/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1058A8] mb-1">
              <span>SECTION {currentSection.number}</span>
              <span aria-hidden="true">·</span>
              <span>ORIGINAL DOCUMENT PAGE {currentSection.page}</span>
            </div>
            <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
              {currentSection.number}. {currentSection.title}
            </h3>
          </div>

          {/* Section Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#0C2340]/60 uppercase tracking-wider">
              Executive Synopsis
            </h4>
            <p className="text-sm sm:text-base text-[#0C2340]/90 leading-relaxed font-source bg-[#F8FAFC] p-4 rounded-lg border border-[#0C2340]/5">
              {currentSection.summary}
            </p>
          </div>

          {/* Verbatim Excerpts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#1058A8] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Verbatim Plan Excerpts</span>
            </h4>
            <div className="space-y-2">
              {currentSection.keyQuotes.map((quote, idx) => (
                <blockquote 
                  key={idx}
                  className="p-3.5 border-l-3 border-[#1058A8] bg-[#EAF4FB]/50 rounded-r-lg text-xs sm:text-sm text-[#0C2340] italic font-source leading-relaxed"
                >
                  "{quote}"
                </blockquote>
              ))}
            </div>
          </div>

          {/* Developer Commentary & Strategic Insights */}
          <div className="p-5 bg-[#0C2340] text-white rounded-xl space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#7EC8F0] uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Lead Developer Commentary & Implementation Impact</span>
            </div>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-source">
              {currentSection.developerInsights}
            </p>
          </div>

          {/* Next Section Stepper */}
          <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-between">
            <span className="text-xs text-[#0C2340]/50 font-source">
              Inspecting {currentSection.number} of 13
            </span>
            <div className="flex items-center gap-2">
              {parseInt(currentSection.number) > 1 && (
                <button
                  onClick={() => {
                    const prevNum = (parseInt(currentSection.number) - 1).toString().padStart(2, '0');
                    setSelectedSection(prevNum);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] hover:bg-[#7EC8F0]/30 rounded-md cursor-pointer transition-colors"
                >
                  ← Previous
                </button>
              )}
              {parseInt(currentSection.number) < 13 && (
                <button
                  onClick={() => {
                    const nextNum = (parseInt(currentSection.number) + 1).toString().padStart(2, '0');
                    setSelectedSection(nextNum);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-md cursor-pointer transition-colors flex items-center gap-1"
                >
                  Next Section <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
