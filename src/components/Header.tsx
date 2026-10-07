import React from 'react';
import { FileText, Printer, CheckCircle, Music, ShieldCheck, Database, Calendar } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onPrint }) => {
  const navItems = [
    { id: 'summary', label: 'Executive Summary', icon: FileText },
    { id: 'datapoints', label: 'Key Data Points', icon: Database },
    { id: 'deepdive', label: '13-Section Analysis', icon: Calendar },
    { id: 'anti-template', label: 'Anti-Template Audit', icon: ShieldCheck },
    { id: 'actions', label: 'Choir Action Tracker', icon: CheckCircle },
    { id: 'mass-planner', label: 'Mass Planner Demo', icon: Music },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-[#0C2340]/10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly adheres to Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-6 nav links) - Zone 3 (1-2 primary actions) */}
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Zone - Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('summary')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="font-fraunces text-xl lg:text-2xl font-bold tracking-tight text-[#0C2340] group-hover:text-[#1058A8] transition-colors">
                St. Monica Choir Nakuru
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 Nav links - single-line clean text buttons */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors rounded-md cursor-pointer ${
                    isActive
                      ? 'bg-[#1058A8] text-white shadow-xs'
                      : 'text-[#0C2340]/80 hover:text-[#0C2340] hover:bg-[#EAF4FB]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('report-view')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                activeTab === 'report-view'
                  ? 'bg-[#EAF4FB] border-[#1058A8] text-[#1058A8]'
                  : 'border-[#0C2340]/20 text-[#0C2340] hover:bg-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Formal Dossier</span>
            </button>
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0C2340] hover:bg-[#1058A8] rounded-md transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-[#0C2340]/5 gap-1 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded-md shrink-0 ${
                activeTab === item.id
                  ? 'bg-[#1058A8] text-white'
                  : 'text-[#0C2340]/70 hover:bg-[#EAF4FB]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('report-view')}
            className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded-md shrink-0 ${
              activeTab === 'report-view'
                ? 'bg-[#1058A8] text-white'
                : 'text-[#0C2340]/70 hover:bg-[#EAF4FB]'
            }`}
          >
            Formal Dossier
          </button>
        </div>
      </div>
    </header>
  );
};
