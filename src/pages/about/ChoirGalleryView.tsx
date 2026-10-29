import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { INITIAL_GROUP_PHOTOS, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../../data/choirContent';
import choirHeroImg from '../../assets/images/choir_singing_moment_1791356740170.jpg';
import cathedralImg from '../../assets/images/nakuru_parish_cathedral_1791356761479.jpg';
import hymnalImg from '../../assets/images/sheet_music_hymnal_1791356751097.jpg';
import { ChoirLogo } from '../../components/ChoirLogo';
import { ExternalLink, UserPlus } from 'lucide-react';
import { AboutNavTabs } from '../../components/AboutNavTabs';
import { AfricanGeometricBorder } from '../../components/AfricanGeometricBorder';
import { getAssetUrl } from '../../utils/assetHelper';

interface ChoirGalleryViewProps {
  onNavigate?: (route: string) => void;
}

export const ChoirGalleryView: React.FC<ChoirGalleryViewProps> = ({ onNavigate = () => {} }) => {
  const { lang, groupPhotosList, openJoinModal } = useChoir();

  const photosToDisplay = groupPhotosList || [];

  const getImageSrc = (imageKey: string, customUrl?: string) => {
    if (customUrl) return getAssetUrl(customUrl);
    if (imageKey === 'nakuru_parish_cathedral') return getAssetUrl('/assets/choir/choir_06.jpg');
    if (imageKey === 'sheet_music_hymnal') return getAssetUrl('/assets/choir/choir_05.jpg');
    return getAssetUrl('/assets/choir/choir_01.jpg');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title Banner (Matching Music Section Slim Banner) */}
      <section className="relative h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        <img 
          src={getAssetUrl('/assets/choir/choir_02.jpg')} 
          alt="St. Monica Catholic Choir in Sacred Vestments" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/80 to-[#0C2340]/25" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
            {lang === 'sw' ? 'Picha za Kwaya' : 'Choir Gallery'}
          </span>
          <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? 'Picha za Kwaya Nzima' : 'Choir Ensemble Gallery'}
          </h1>
          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-xl leading-snug">
            {lang === 'sw'
              ? 'Waimbaji wa Kwaya ya Misa ya Tatu katika sare za kwaya na Misa ya Jumapili.'
              : 'Choristers of St. Monica Third Mass Choir in liturgical vestments and parish events.'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* Unified Section Navigation Tabs */}
      <AboutNavTabs currentTab="about-gallery" onNavigate={onNavigate} />

      {/* Main Group Photo Spotlight Banner */}
      <section className="bg-white/95 border border-[#0C2340]/10 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]">
        <div className="lg:col-span-7 aspect-16/10 relative overflow-hidden bg-slate-900">
          <img
            src={getAssetUrl('/assets/choir/choir_01.jpg')}
            alt="St. Monica Catholic Choir"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340]/80 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 bg-[#1058A8] text-white font-source text-xs px-3.5 py-1.5 rounded-xl font-semibold shadow-xs">
            {lang === 'sw' ? 'Kwaya ya Mtakatifu Monika' : 'Third Mass Choir, St. Monica Parish'}
          </span>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[#1058A8] font-source block uppercase tracking-wider">
              {lang === 'sw' ? 'Sare za kiliturujia na umoja' : 'Liturgical vestments & unity'}
            </span>
            <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Sauti Nne, Jumuiya Moja' : 'Four Voices, One Sacred Fellowship'}
            </h2>
            <p className="text-sm text-[#0C2340]/80 font-source leading-relaxed">
              {lang === 'sw'
                ? 'Katika Kwaya ya Mtakatifu Monika, waimbaji wote huvaa sare za heshima na kusimama pamoja mbele ya Altare kumwimbia na kumsifu Mungu.'
                : 'At St. Monica Catholic Choir, singers stand united in dignity before the altar, singing four-part sacred music for Sunday Mass.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#0C2340]/10 text-xs font-source">
            <div className="p-3 bg-[#EAF4FB] rounded-xl border border-[#7EC8F0]/30 shadow-xs">
              <span className="font-semibold text-[#1058A8] block">{lang === 'sw' ? 'Misa za Jumapili:' : 'Sunday Liturgies:'}</span>
              <span className="text-[#0C2340]/80 mt-0.5 block tabular-nums">Third Mass / High Mass (10:00 AM)</span>
            </div>
            <div className="p-3 bg-[#EAF4FB] rounded-xl border border-[#7EC8F0]/30 shadow-xs">
              <span className="font-semibold text-[#1058A8] block">{lang === 'sw' ? 'Mavazi:' : 'Vestments:'}</span>
              <span className="text-[#0C2340]/80 mt-0.5 block">Blue & White Sacred Robes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Choral Family Banner */}
      <section className="p-5 sm:p-6 bg-[#0C2340] text-white rounded-2xl border border-[#1058A8]/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-[#1058A8]/20 border border-[#1058A8]/30 flex items-center justify-center shrink-0">
            <ChoirLogo size={48} variant="simplified" className="w-11 h-11" />
          </div>
          <div className="space-y-0.5 text-left">
            <span className="text-xs font-bold text-[#7EC8F0] uppercase tracking-wider font-source">
              {lang === 'sw' ? 'Jiunge na Kwaya' : 'Join Our Choral Family'}
            </span>
            <h3 className="font-eb-garamond text-xl sm:text-2xl font-bold text-white">
              {lang === 'sw' ? 'Kuwa Sehemu ya Picha Hizi na Utume Wetu' : 'Become Part of These Moments & Liturgical Praise'}
            </h3>
            <p className="text-xs text-slate-300 font-source max-w-xl">
              {lang === 'sw'
                ? 'Tunakaribisha waimbaji wote wa Soprano, Alto, Tenor na Bass kumtukuza Mungu kwa pamoja katika Misa ya Jumapili.'
                : 'We warmly welcome choristers across all four vocal parts to unite in sacred song at Sunday Mass.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => openJoinModal()}
          className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg hover:shadow-amber-500/25 active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 font-source shrink-0"
        >
          <UserPlus className="w-4 h-4 text-slate-950" />
          <span>{lang === 'sw' ? 'Jiunge Nasi' : 'Join Us'}</span>
        </button>
      </section>

      {/* Grid of Parish Moments */}
      <section className="space-y-6">
        <div>
          <h3 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Muda wa Utume na Ushirika' : 'Moments of Fellowship & Ministry'}
          </h3>
          <p className="text-sm text-slate-600 font-source mt-1">
            {lang === 'sw'
              ? 'Picha halisi za kumbukumbu za kwaya katika matukio ya kikanisa, mazoezi na kurekodi.'
              : 'Photographs from choir rehearsals, parish feasts, diocesan festivals, and studio recordings.'}
          </p>
        </div>

        {photosToDisplay.length === 0 ? (
          <div className="text-center py-14 px-6 bg-white/95 border border-[#0C2340]/10 rounded-2xl space-y-2 shadow-xs">
            <h4 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Hakuna Picha Kwenye Matunzio Kwa Sasa' : 'No Photographs in Gallery Currently'}
            </h4>
            <p className="text-xs text-slate-500 font-source max-w-md mx-auto">
              {lang === 'sw'
                ? 'Picha zote za matunzio zimeondolewa au bado hazijawekwa. Unaweza kupakia picha mpya kwenye paneli ya Admin.'
                : 'All gallery photos have been removed or none have been published yet. You can upload new photographs from the Admin panel.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photosToDisplay.map((photo) => (
              <div
                key={photo.id}
                className="bg-white/95 border border-[#0C2340]/10 rounded-2xl overflow-hidden hover:border-[#1058A8]/40 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] transition-all flex flex-col justify-between"
              >
                <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
                  <img
                    src={getImageSrc(photo.imageKey, photo.customUrl)}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {photo.year && photo.year.trim() !== '' && photo.year.trim() !== '2024' && (
                    <span className="absolute top-3 left-3 bg-[#0C2340]/90 text-white text-[11px] font-source px-2.5 py-0.5 rounded-lg font-semibold tabular-nums shadow-xs">
                      {photo.year}
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-xs font-semibold text-[#1058A8] font-source block">
                    {photo.occasion || photo.occasionSw}
                  </span>
                  <h4 className="font-eb-garamond text-xl font-bold text-[#0C2340] leading-snug">
                    {photo.title || photo.titleSw}
                  </h4>
                  <p className="text-xs text-[#0C2340]/85 font-source leading-relaxed">
                    {photo.description}
                  </p>
                  {lang === 'sw' && photo.descriptionSw && photo.descriptionSw !== photo.description && (
                    <p className="text-[11px] text-slate-500 font-source italic pt-1 border-t border-slate-100">
                      {photo.descriptionSw}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
