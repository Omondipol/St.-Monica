import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { BookOpen, Heart, Image, Users, Mic } from 'lucide-react';

interface AboutNavTabsProps {
  currentTab: string;
  onNavigate: (route: string) => void;
}

export const AboutNavTabs: React.FC<AboutNavTabsProps> = ({ currentTab, onNavigate }) => {
  const { lang } = useChoir();

  const tabs = [
    {
      id: 'about-story',
      labelSw: 'Historia Yetu',
      labelEn: 'Our Story',
      icon: BookOpen,
      badge: '1994'
    },
    {
      id: 'about-patron',
      labelSw: 'Mtakatifu Monika',
      labelEn: 'Patron Saint',
      icon: Heart,
      badge: 'Feast 27 Aug'
    },
    {
      id: 'about-gallery',
      labelSw: 'Picha za Kwaya',
      labelEn: 'Choir Gallery',
      icon: Image,
      badge: '12'
    },
    {
      id: 'about-leadership',
      labelSw: 'Walimu na Viongozi',
      labelEn: 'Trainers & Officials',
      icon: Users,
      badge: '6'
    },
    {
      id: 'about-sections',
      labelSw: 'Sauti za Kwaya',
      labelEn: 'Voice Sections',
      icon: Mic,
      badge: 'SATB'
    }
  ];

  return (
    <div className="w-full">
      <nav 
        className="bg-white/95 backdrop-blur-sm border border-[#0C2340]/12 rounded-2xl p-1.5 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] flex items-center gap-1.5 overflow-x-auto scrollbar-none"
        aria-label="About section tabs"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id || (tab.id === 'about-gallery' && currentTab === 'about-portraits');
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onNavigate(tab.id);
              }}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-source font-semibold flex items-center gap-2 shrink-0 cursor-pointer transition-all duration-150 ${
                isActive
                  ? 'bg-[#1058A8] text-white shadow-sm shadow-[#1058A8]/25'
                  : 'text-[#0C2340]/75 hover:text-[#0C2340] hover:bg-[#FAF8F5] active:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-[#1058A8]'}`} />
              <span>{lang === 'sw' ? tab.labelSw : tab.labelEn}</span>
              {tab.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#0C2340]/5 text-[#0C2340]/60'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
