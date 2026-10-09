import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { INITIAL_GROUP_PHOTOS, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../../data/choirContent';
import choirHeroImg from '../../assets/images/choir_singing_moment_1791356740170.jpg';
import cathedralImg from '../../assets/images/nakuru_parish_cathedral_1791356761479.jpg';
import hymnalImg from '../../assets/images/sheet_music_hymnal_1791356751097.jpg';
import { ChoirLogo } from '../../components/ChoirLogo';
import { RealYouTubeIcon } from '../../components/RealYouTubeIcon';
import { ExternalLink } from 'lucide-react';

export const ChoirGalleryView: React.FC = () => {
  const { lang, groupPhotosList } = useChoir();

  const photosToDisplay = groupPhotosList && groupPhotosList.length > 0 ? groupPhotosList : INITIAL_GROUP_PHOTOS;

  const getImageSrc = (imageKey: string, customUrl?: string) => {
    if (customUrl) return customUrl;
    if (imageKey === 'nakuru_parish_cathedral') return cathedralImg;
    if (imageKey === 'sheet_music_hymnal') return hymnalImg;
    return choirHeroImg;
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <section className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] p-6 sm:p-8 space-y-4">
        <span className="text-[14px] font-semibold text-[#1058A8] font-source block">
          {lang === 'sw' ? 'Picha za kwaya nzima na utume' : 'Choir group gallery & ministry'}
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-fraunces text-[28px] sm:text-[40px] font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Picha za Kwaya Nzima' : 'Choir Ensemble Gallery'}
            </h1>
            <p className="text-[17px] text-slate-700 font-source mt-2 max-w-2xl leading-relaxed">
              {lang === 'sw'
                ? 'Waimbaji wote arobaini na nane wa Kwaya ya Mtakatifu Monika wakiwa katika sare za kiliturujia, mazoezi na huduma ya Misa Takatifu.'
                : 'The unified forty-eight choristers of St. Monica Catholic Choir in liturgical vestments, sacred rehearsals, and Holy Mass ministry.'}
            </p>
          </div>
          <ChoirLogo size={60} interactive={true} className="shrink-0 self-start sm:self-center" />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-[12px] transition-colors shadow-2xs"
          >
            <RealYouTubeIcon size={18} variant="badge" />
            <span>{lang === 'sw' ? 'Tazama video zetu za YouTube' : 'Watch choir on YouTube'} ({YOUTUBE_CHANNEL_HANDLE})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 5-line music-stave divider */}
        <div className="stave-divider my-4 max-w-md">
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
        </div>
      </section>

      {/* Main Group Photo Spotlight Banner */}
      <section className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-7 aspect-16/10 relative overflow-hidden bg-slate-900">
          <img
            src={choirHeroImg}
            alt="St. Monica Catholic Choir in Full Vestments"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0C2340]/80 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 bg-[#1058A8] text-white font-source text-[14px] px-3 py-1 rounded-[12px] font-semibold">
            {lang === 'sw' ? 'Kwaya Nzima ya Mtakatifu Monika' : 'Full Ensemble — 48 Choristers'}
          </span>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[14px] font-semibold text-[#1058A8] font-source block">
              {lang === 'sw' ? 'Sare za kiliturujia na umoja' : 'Liturgical vestments & unity'}
            </span>
            <h2 className="font-fraunces text-[28px] font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Sauti Nne, Jumuiya Moja' : 'Four Voices, One Sacred Fellowship'}
            </h2>
            <p className="text-[17px] text-[#0C2340]/80 font-source leading-relaxed">
              {lang === 'sw'
                ? 'Katika Kwaya ya Mtakatifu Monika, hatutazami uimbaji kama wa mtu binafsi au maonyesho ya soloists. Kila muumini na mwimbaji huvaa sare sawa za heshima, akisimama mbele ya Altare kwa unyenyekevu kutumikia sala ya kanisa zima.'
                : 'At St. Monica Catholic Choir, liturgical singing is never an individual spectacle or solo showcase. Every singer stands unified in dignity before the Holy Altar, blending forty-eight voices into a single reverent prayer for the congregation.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#0C2340]/10 text-[14px] font-source">
            <div className="p-3 bg-[#EAF4FB] rounded-[12px]">
              <span className="font-semibold text-[#1058A8] block">{lang === 'sw' ? 'Misa za Jumapili:' : 'Sunday Liturgies:'}</span>
              <span className="text-[#0C2340]/80 mt-0.5 block tabular-nums">Sunday High Mass (9:00 AM)</span>
            </div>
            <div className="p-3 bg-[#EAF4FB] rounded-[12px]">
              <span className="font-semibold text-[#1058A8] block">{lang === 'sw' ? 'Mavazi:' : 'Vestments:'}</span>
              <span className="text-[#0C2340]/80 mt-0.5 block">Blue & White Sacred Robes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Parish Moments */}
      <section className="space-y-6">
        <div>
          <h3 className="font-fraunces text-[28px] font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Muda wa Utume na Ushirika' : 'Moments of Fellowship & Ministry'}
          </h3>
          <p className="text-[17px] text-slate-600 font-source mt-1">
            {lang === 'sw'
              ? 'Picha halisi za kumbukumbu za kwaya katika matukio ya kikanisa, mazoezi na kurekodi.'
              : 'Photographs from choir rehearsals, parish feasts, diocesan festivals, and studio recordings.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photosToDisplay.map((photo) => (
            <div
              key={photo.id}
              className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] overflow-hidden hover:border-[#1058A8] transition-all flex flex-col justify-between"
            >
              <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
                <img
                  src={getImageSrc(photo.imageKey, photo.customUrl)}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-[#0C2340]/90 backdrop-blur-xs text-white text-[12px] font-source px-2.5 py-0.5 rounded-[12px] font-semibold tabular-nums">
                  {photo.year}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <span className="text-[14px] font-semibold text-[#1058A8] font-source block">
                  {lang === 'sw' ? photo.occasionSw : photo.occasion}
                </span>
                <h4 className="font-fraunces text-[22px] font-bold text-[#0C2340] leading-snug">
                  {lang === 'sw' ? photo.titleSw : photo.title}
                </h4>
                <p className="text-[14px] text-[#0C2340]/75 font-source leading-relaxed">
                  {lang === 'sw' ? photo.descriptionSw : photo.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
