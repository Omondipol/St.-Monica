import React, { useState } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { supabase } from '../../lib/supabase';
import { INITIAL_GROUP_PHOTOS, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../../data/choirContent';
import choirHeroImg from '../../assets/images/choir_singing_moment_1791356740170.jpg';
import cathedralImg from '../../assets/images/nakuru_parish_cathedral_1791356761479.jpg';
import hymnalImg from '../../assets/images/sheet_music_hymnal_1791356751097.jpg';
import { ChoirLogo } from '../../components/ChoirLogo';
import { ExternalLink, UserPlus, ZoomIn, X } from 'lucide-react';
import { AboutNavTabs } from '../../components/AboutNavTabs';
import { AfricanGeometricBorder } from '../../components/AfricanGeometricBorder';
import { getAssetUrl } from '../../utils/assetHelper';

interface ChoirGalleryViewProps {
  onNavigate?: (route: string) => void;
}

export const ChoirGalleryView: React.FC<ChoirGalleryViewProps> = ({ onNavigate = () => {} }) => {
  const { lang, groupPhotosList, leadersList, openJoinModal } = useChoir();
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; title: string; desc?: string; year?: string } | null>(null);

  const leaderPhotoUrls = new Set(
    (leadersList || [])
      .map(l => l.photoUrl)
      .filter((url): url is string => Boolean(url && typeof url === 'string' && url.trim().length > 0))
  );

  const photosToDisplay = (groupPhotosList || []).filter(
    p => !leaderPhotoUrls.has(p.customUrl || '') && !leaderPhotoUrls.has(p.id)
  );

  const getImageSrc = (imageKey: string, customUrl?: string) => {
    if (customUrl) return getAssetUrl(customUrl);
    if (imageKey === 'nakuru_parish_cathedral') return getAssetUrl('/assets/choir/choir_06.jpg');
    if (imageKey === 'sheet_music_hymnal') return getAssetUrl('/assets/choir/choir_05.jpg');
    return getAssetUrl('/assets/choir/choir_01.jpg');
  };

  return (
    <div className="space-y-10 sm:space-y-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title Banner matching Home Page generous scale */}
      <section className="relative min-h-[220px] sm:min-h-[260px] lg:min-h-[280px] rounded-3xl overflow-hidden border border-[#0C2340]/15 shadow-lg select-none flex flex-col justify-between py-10 px-6 sm:px-12">
        <img 
          src={getAssetUrl('/assets/choir/choir_02.jpg')} 
          alt="St. Monica Catholic Choir in Sacred Vestments" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/85 to-[#0C2340]/30" />
        
        <div className="relative z-10 my-auto text-white space-y-2 sm:space-y-3">
          <span className="text-xs sm:text-sm font-bold text-amber-300 font-source block uppercase tracking-widest">
            {lang === 'sw' ? 'Picha za Kwaya' : 'Choir Gallery'}
          </span>
          <h1 className="font-eb-garamond text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? 'Picha za Kwaya Nzima' : 'Choir Ensemble Gallery'}
          </h1>
          <p className="font-source text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
            {lang === 'sw'
              ? 'Waimbaji wa Kwaya ya Misa ya Tatu katika sare za kwaya, Misa za Jumapili, na matukio ya kikanisa.'
              : 'Choristers of St. Monica Third Mass Choir in liturgical vestments, Sunday Masses, and parish celebrations.'}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* Navigation Tabs */}
      <AboutNavTabs currentTab="about-gallery" onNavigate={onNavigate} />

      {/* Main Group Photo Spotlight Banner - Large Surface Occupancy */}
      <section className="bg-white border border-[#0C2340]/12 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-sm">
        <div 
          onClick={() => setSelectedPhoto({
            src: getAssetUrl('/assets/choir/choir_01.jpg'),
            title: lang === 'sw' ? 'Kwaya ya Mtakatifu Monika Katika Sare' : 'Third Mass Choir, St. Monica Parish',
            desc: lang === 'sw' ? 'Waimbaji wote wakiwa mbele ya Altare ya Parokia ya Mtakatifu Monika.' : 'Full choir ensemble standing united before the parish altar.'
          })}
          className="lg:col-span-7 h-[320px] sm:h-[420px] lg:h-[480px] relative overflow-hidden bg-slate-900 group cursor-pointer"
        >
          <img
            src={getAssetUrl('/assets/choir/choir_01.jpg')}
            alt="St. Monica Catholic Choir"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340]/80 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
            <span className="bg-[#1058A8] text-white font-source text-xs sm:text-sm px-4 py-2 rounded-xl font-semibold shadow-md">
              {lang === 'sw' ? 'Kwaya ya Mtakatifu Monika' : 'Third Mass Choir, St. Monica Parish'}
            </span>
            <span className="bg-black/70 hover:bg-black text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Tazama HD' : 'View HD'}</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs sm:text-sm font-bold text-[#1058A8] font-source block uppercase tracking-wider">
              {lang === 'sw' ? 'Sare za kiliturujia na umoja' : 'Liturgical vestments & unity'}
            </span>
            <h2 className="font-eb-garamond text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Sauti Nne, Jumuiya Moja' : 'Four Voices, One Sacred Fellowship'}
            </h2>
            <p className="text-base text-slate-700 font-source leading-relaxed">
              {lang === 'sw'
                ? 'Katika Kwaya ya Mtakatifu Monika, waimbaji wote huvaa sare za heshima na kusimama pamoja mbele ya Altare kumwimbia na kumsifu Mungu kwa nidhamu ya sauti nne.'
                : 'At St. Monica Catholic Choir, singers stand united in dignity before the altar, singing four-part sacred music for Sunday Mass with reverence and fraternal love.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#0C2340]/10 text-xs sm:text-sm font-source">
            <div className="p-4 bg-[#EAF4FB] rounded-2xl border border-[#7EC8F0]/30 shadow-xs">
              <span className="font-bold text-[#1058A8] block">{lang === 'sw' ? 'Misa za Jumapili:' : 'Sunday Liturgies:'}</span>
              <span className="text-[#0C2340] font-medium mt-1 block">Third Mass (10:00 AM)</span>
            </div>
            <div className="p-4 bg-[#EAF4FB] rounded-2xl border border-[#7EC8F0]/30 shadow-xs">
              <span className="font-bold text-[#1058A8] block">{lang === 'sw' ? 'Mavazi Rasmi:' : 'Vestments:'}</span>
              <span className="text-[#0C2340] font-medium mt-1 block">Blue & White Sacred Robes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Choral Family Banner */}
      <section className="p-6 sm:p-8 bg-[#0C2340] text-white rounded-3xl border border-[#1058A8]/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#1058A8]/20 border border-[#1058A8]/30 flex items-center justify-center shrink-0">
            <ChoirLogo size={52} variant="simplified" className="w-13 h-13" />
          </div>
          <div className="space-y-1 text-left">
            <span className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-widest font-source">
              {lang === 'sw' ? 'Jiunge na Kwaya' : 'Join Our Choral Family'}
            </span>
            <h3 className="font-eb-garamond text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              {lang === 'sw' ? 'Kuwa Sehemu ya Picha Hizi na Utume Wetu' : 'Become Part of These Moments & Liturgical Praise'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-source max-w-xl leading-relaxed">
              {lang === 'sw'
                ? 'Tunakaribisha waimbaji wote wa Soprano, Alto, Tenor na Bass kumtukuza Mungu kwa pamoja katika Misa ya Jumapili.'
                : 'We warmly welcome choristers across all four vocal parts to unite in sacred song at Sunday Mass.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => openJoinModal()}
          className="w-full sm:w-auto py-3.5 px-7 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-lg hover:shadow-amber-500/25 active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 font-source shrink-0"
        >
          <UserPlus className="w-4 h-4 text-slate-950" />
          <span>{lang === 'sw' ? 'Jiunge Nasi' : 'Join Us'}</span>
        </button>
      </section>

      {/* Grid of Parish Moments - Large Surface Screen Occupancy */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#0C2340]/10">
          <div>
            <h3 className="font-eb-garamond text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Muda wa Utume na Ushirika' : 'Moments of Fellowship & Ministry'}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 font-source mt-1">
              {lang === 'sw'
                ? 'Picha halisi za kumbukumbu za kwaya katika matukio ya kikanisa, mazoezi na kurekodi.'
                : 'Photographs from choir rehearsals, parish feasts, diocesan festivals, and studio recordings.'}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 font-source hidden sm:inline-block">
            {photosToDisplay.length} {lang === 'sw' ? 'picha' : 'photos'}
          </span>
        </div>

        {photosToDisplay.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white border border-[#0C2340]/10 rounded-3xl space-y-3 shadow-xs">
            <h4 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Hakuna Picha Kwenye Matunzio Kwa Sasa' : 'No Photographs in Gallery Currently'}
            </h4>
            <p className="text-sm text-slate-500 font-source max-w-md mx-auto">
              {lang === 'sw'
                ? 'Picha zote za matunzio zimeondolewa au bado hazijawekwa. Unaweza kupakia picha mpya kwenye paneli ya Admin.'
                : 'All gallery photos have been removed or none have been published yet. You can upload new photographs from the Admin panel.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {photosToDisplay.map((photo) => {
              const photoSrc = getImageSrc(photo.imageKey, photo.customUrl);
              return (
                <div
                  key={photo.id}
                  className="bg-white border border-[#0C2340]/12 rounded-3xl overflow-hidden hover:border-[#1058A8]/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Generous landscape surface occupancy */}
                  <div 
                    onClick={() => setSelectedPhoto({
                      src: photoSrc,
                      title: photo.title || photo.titleSw || 'Choir Moment',
                      desc: photo.description || photo.descriptionSw,
                      year: photo.year
                    })}
                    className="h-64 sm:h-72 w-full relative overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={photoSrc}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {photo.year && photo.year.trim() !== '' && photo.year.trim() !== '2024' && (
                      <span className="absolute top-3.5 left-3.5 bg-[#0C2340]/90 text-white text-xs font-source px-3 py-1 rounded-lg font-semibold tabular-nums shadow-xs">
                        {photo.year}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>HD View</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-2.5">
                    <span className="text-xs font-bold text-[#1058A8] font-source block uppercase tracking-wider">
                      {photo.occasion || photo.occasionSw}
                    </span>
                    <h4 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340] leading-snug">
                      {photo.title || photo.titleSw}
                    </h4>
                    <p className="text-sm text-slate-700 font-source leading-relaxed">
                      {photo.description}
                    </p>
                    {lang === 'sw' && photo.descriptionSw && photo.descriptionSw !== photo.description && (
                      <p className="text-xs text-slate-500 font-source italic pt-2 border-t border-slate-100">
                        {photo.descriptionSw}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Lightbox Modal for Gallery Photos */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="w-full h-full max-h-[75vh] object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-white space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                  {selectedPhoto.title}
                </h3>
                {selectedPhoto.year && (
                  <span className="text-xs font-bold text-[#1058A8] bg-[#EAF4FB] px-3 py-1 rounded-full font-source">
                    {selectedPhoto.year}
                  </span>
                )}
              </div>
              {selectedPhoto.desc && (
                <p className="text-sm text-slate-700 font-source pt-1 leading-relaxed">
                  {selectedPhoto.desc}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
