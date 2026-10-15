import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { Music, Disc, FileText, ShoppingBag } from 'lucide-react';

interface MusicNavTabsProps {
  currentTab: string;
  onNavigate: (route: string) => void;
}

export const MusicNavTabs: React.FC<MusicNavTabsProps> = ({ currentTab, onNavigate }) => {
  const { lang, songs, sheetMusicList } = useChoir();

  const tabs = [
    {
      id: 'music-repertoire',
      aliases: ['music', 'music-repertoire'],
      labelSw: 'Nyimbo Zetu',
      labelEn: 'Our Songs',
      icon: Music,
      badge: `${songs.length}`
    },
    {
      id: 'music-albums',
      aliases: ['music-albums'],
      labelSw: 'Albamu Yetu',
      labelEn: 'Our Album',
      icon: Disc,
      badge: '1'
    },
    {
      id: 'music-library',
      aliases: ['music-library'],
      labelSw: 'Maktaba ya Muziki',
      labelEn: 'Music Library',
      icon: FileText,
      badge: '28'
    },
    {
      id: 'shop',
      aliases: ['shop'],
      labelSw: 'Noti za Kwaya',
      labelEn: 'Music Store',
      icon: ShoppingBag,
      badge: `${sheetMusicList.length}`
    }
  ];

  return (
    <div className="w-full">
      <nav 
        className="bg-white/95 backdrop-blur-sm border border-[#0C2340]/12 rounded-2xl p-1.5 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] flex items-center gap-1.5 overflow-x-auto scrollbar-none"
        aria-label="Music section tabs"
      >
        {tabs.map((tab) => {
          const isActive = tab.aliases.includes(currentTab);
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
