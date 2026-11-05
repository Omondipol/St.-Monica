import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { BookOpen, Heart, Image, Users, Mic } from 'lucide-react';

interface AboutNavTabsProps {
  currentTab: string;
  onNavigate: (route: string) => void;
}

export const AboutNavTabs: React.FC<AboutNavTabsProps> = ({ currentTab, onNavigate }) => {
  const { lang, leadersList, activeMembers, groupPhotosList } = useChoir();

  const leaderCount = leadersList ? leadersList.length : 6;
  const photoCount = groupPhotosList ? groupPhotosList.length : 12;

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
      badge: String(photoCount)
    },
    {
      id: 'about-leadership',
      labelSw: 'Walimu na Maafisa',
      labelEn: 'Trainers & Officials',
      icon: Users,
      badge: String(leaderCount)
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
        className="bg-white/95 backdrop-blur-sm border border-[#0C2340]/12 rounded-2xl p-2 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none"
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
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-source font-semibold flex items-center gap-2 shrink-0 cursor-pointer transition-all duration-150 ${
                isActive
                  ? 'bg-[#1058A8] text-white shadow-md shadow-[#1058A8]/25 ring-1 ring-[#1058A8]'
                  : 'text-[#0C2340]/75 hover:text-[#0C2340] hover:bg-[#FAF8F5] active:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#1058A8]'}`} />
              <span>{lang === 'sw' ? tab.labelSw : tab.labelEn}</span>
              {tab.badge && (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#0C2340]/5 text-[#0C2340]/70'
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
