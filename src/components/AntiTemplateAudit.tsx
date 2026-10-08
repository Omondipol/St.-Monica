import React, { useState } from 'react';
import { ANTI_TEMPLATE_RULES } from '../data/planData';
import { ShieldCheck, AlertOctagon, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export const AntiTemplateAudit: React.FC = () => {
  // Audit test state for 10 criteria
  const [checklistState, setChecklistState] = useState<{ [id: number]: boolean }>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
  });

  const toggleItem = (id: number) => {
    setChecklistState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetAll = (passAll: boolean) => {
    const newState: { [id: number]: boolean } = {};
    ANTI_TEMPLATE_RULES.forEach(r => {
      newState[r.id] = passAll;
    });
    setChecklistState(newState);
  };

  const failedCount = Object.values(checklistState).filter(val => !val).length;
  const isApproved = failedCount <= 2;

  // Comparison items from Section 2
  const comparativeItems = [
    {
      habit: "Hero with a slogan and two buttons, then identical centered sections",
      whyReadsTemplated: "Same rhythm everywhere; says nothing specific about the parish",
      whatWeDo: "Open with a real moment: full-bleed photo or video of the choir singing, a short line in our own voice, and a play button for a real recording.",
    },
    {
      habit: "Six identical icon cards (values)",
      whyReadsTemplated: "Interchangeable with any organization in the world",
      whatWeDo: "Values written as short statements with a concrete practice behind each, set in an editorial layout.",
    },
    {
      habit: "Placeholder-style copy ('use this area to feature...')",
      whyReadsTemplated: "Never replaced with real content; looks unfinished",
      whatWeDo: "No lorem or instructional text allowed; a page does not go live until real content exists.",
    },
    {
      habit: "Vague claims ('award-winning', 'so much more than a choir')",
      whyReadsTemplated: "No proof or verifiability",
      whatWeDo: "Facts, dates, numbers and names, with photos and recordings as evidence.",
    },
    {
      habit: "Stock phrasing and gradient/glass effects",
      whyReadsTemplated: "Looks machine-made and trendy without soul",
      whatWeDo: "Printed-programme aesthetic: paper textures, music-stave lines, strong type, real photography.",
    },
    {
      habit: "Everything symmetrical, centered, rounded",
      whyReadsTemplated: "No personality or cultural rootedness",
      whatWeDo: "Asymmetric grids, large type, generous white space, a few deliberate surprises.",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1058A8] mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Quality Gate & Anti-Slop Discipline</span>
        </div>
        <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
          Section 13: Design Review Checklist (Anti-Template Test)
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#0C2340]/80 font-source max-w-3xl">
          Binding quality rule: <span className="font-semibold text-[#0C2340]">"Before each design is approved, check every item. If more than two fail, redesign the section."</span> 
          Test any page mockup or proposal below using the 10-point rubric.
        </p>

        {/* Live Status Bar */}
        <div className={`mt-6 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
          isApproved 
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
            : 'bg-rose-50/80 border-rose-300 text-rose-950'
        }`}>
          <div className="flex items-center gap-3">
            {isApproved ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                {isApproved ? 'DESIGN APPROVED TO PROCEED' : 'DESIGN REJECTED — MUST REDESIGN'}
              </span>
              <p className="text-xs font-source">
                {failedCount} of 10 criteria failing (Max allowed failures: 2)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => resetAll(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#0C2340]/20 rounded-md hover:bg-slate-50 text-[#0C2340] cursor-pointer"
            >
              Pass All
            </button>
            <button
              onClick={() => resetAll(false)}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#0C2340]/20 rounded-md hover:bg-slate-50 text-rose-700 cursor-pointer"
            >
              Fail All
            </button>
          </div>
        </div>
      </div>

      {/* The 10 Interactive Criteria */}
      <div className="bg-white border border-[#0C2340]/10 rounded-xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-[#0C2340]/10">
          <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
            The 10-Point Audit Rubric
          </h3>
          <p className="text-xs text-[#0C2340]/60 font-source mt-0.5">
            Click any row to toggle its evaluation status for the current page design review.
          </p>
        </div>

        <div className="divide-y divide-[#0C2340]/5">
          {ANTI_TEMPLATE_RULES.map((rule) => {
            const isPassing = checklistState[rule.id];
            return (
              <div
                key={rule.id}
                onClick={() => toggleItem(rule.id)}
                className="p-4 sm:p-5 hover:bg-[#F8FAFC] transition-colors flex items-start gap-4 cursor-pointer"
              >
                <button
                  type="button"
                  className={`mt-0.5 p-1 rounded-md shrink-0 transition-colors ${
                    isPassing 
                      ? 'text-emerald-600 hover:text-emerald-700' 
                      : 'text-rose-600 hover:text-rose-700'
                  }`}
                  aria-label={isPassing ? "Passing" : "Failing"}
                >
                  {isPassing ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-[#1058A8] font-bold">Rule {rule.id.toString().padStart(2, '0')}</span>
                    <span className="text-xs font-bold text-[#0C2340]">{rule.rule}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#0C2340]/80 font-source">
                    {rule.description}
                  </p>
                  <p className="text-[11px] text-[#0C2340]/50 italic">
                    Risk if ignored: {rule.failureRisk}
                  </p>
                </div>

                <span className={`text-[11px] font-bold px-2.5 py-1 rounded shrink-0 tabular-numbers ${
                  isPassing 
                    ? 'bg-emerald-100/70 text-emerald-800' 
                    : 'bg-rose-100/70 text-rose-800'
                }`}>
                  {isPassing ? 'PASS' : 'FAIL'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2 Comparative Analysis: Generic AI Habits vs St. Monica Approach */}
      <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider block">
            Section 2 Analytical Framework
          </span>
          <h3 className="font-fraunces text-2xl font-bold text-[#0C2340] mt-1">
            Why Choir Sites Feel Generic vs. How St. Monica Avoids It
          </h3>
          <p className="text-xs text-[#0C2340]/70 font-source mt-1">
            Contrasting typical WordPress / Squarespace / AI template traps with tailored design countermeasures.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-source">
            <thead>
              <tr className="bg-[#EAF4FB]/60 border-b border-[#0C2340]/10 text-[#0C2340]/70 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-1/4">Generic Habit Seen</th>
                <th className="py-3 px-4 w-1/4">Why It Reads as Templated</th>
                <th className="py-3 px-4 w-1/2">What We Do Instead (St. Monica Plan)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0C2340]/5">
              {comparativeItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC]">
                  <td className="py-3.5 px-4 font-semibold text-[#0C2340] align-top">
                    {item.habit}
                  </td>
                  <td className="py-3.5 px-4 text-[#0C2340]/70 italic align-top">
                    {item.whyReadsTemplated}
                  </td>
                  <td className="py-3.5 px-4 text-[#1058A8] font-medium align-top bg-[#EAF4FB]/20">
                    {item.whatWeDo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
