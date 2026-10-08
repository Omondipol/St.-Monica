import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { Users, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { ChoirLogo } from '../../components/ChoirLogo';
import { RealYouTubeIcon } from '../../components/RealYouTubeIcon';
import { YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../../data/choirContent';
import choirHeroImg from '../../assets/images/choir_singing_moment_1791356740170.jpg';
import cathedralImg from '../../assets/images/nakuru_parish_cathedral_1791356761479.jpg';
import hymnalImg from '../../assets/images/sheet_music_hymnal_1791356751097.jpg';

export const ChoirGalleryView: React.FC = () => {
  const { lang, groupPhotosList } = useChoir();

  const getImageSrc = (imageKey: string, customUrl?: string) => {
    if (customUrl) return customUrl;
    if (imageKey === 'nakuru_parish_cathedral') return cathedralImg;
    if (imageKey === 'sheet_music_hymnal') return hymnalImg;
    return choirHeroImg;
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-source">
          <Users className="w-4 h-4" />
          <span>{lang === 'sw' ? 'Picha za Kwaya Nzima na Utume' : 'Choir Group Gallery & Ministry'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Picha za Kwaya Nzima' : 'Choir Ensemble Gallery'}
            </h1>
            <p className="text-base text-slate-700 font-source mt-2 max-w-2xl">
              {lang === 'sw'
                ? 'Waimbaji wote arobaini na nane (48) wa Parokia ya Mtakatifu Monica, Section 58 Nakuru wakiwa katika sare za kiliturujia, mazoezi na huduma ya Misa Takatifu.'
                : 'The unified forty-eight (48) choristers of St. Monica Parish, Section 58 Nakuru in liturgical vestments, sacred rehearsals, and Holy Mass ministry.'}
            </p>
          </div>
          <ChoirLogo size={60} interactive={true} className="shrink-0 self-start sm:self-center" />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-2xs"
          >
            <RealYouTubeIcon size={18} variant="badge" />
            <span>{lang === 'sw' ? 'Tazama Video zetu za YouTube' : 'Watch Choir on YouTube'} ({YOUTUBE_CHANNEL_HANDLE})</span>
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
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-7 aspect-16/10 relative overflow-hidden bg-slate-900">
          <img
            src={choirHeroImg}
            alt="St. Monica Choir Section 58 Nakuru in Full Vestments"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0C2340]/80 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 bg-[#1058A8] text-white font-mono text-xs px-3 py-1 rounded-lg font-bold">
            {lang === 'sw' ? 'Kwaya Nzima ya Mtakatifu Monica' : 'Full Ensemble — 48 Choristers'}
          </span>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-[#1058A8] uppercase font-mono tracking-wider">
              {lang === 'sw' ? 'SARE ZA KILITURUJIA' : 'LITURGICAL VESTMENTS & UNITY'}
            </span>
            <h2 className="font-fraunces text-2xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Sauti Nne, Jumuiya Moja' : 'Four Voices, One Sacred Fellowship'}
            </h2>
            <p className="text-xs sm:text-sm text-[#0C2340]/80 font-source leading-relaxed">
              {lang === 'sw'
                ? 'Katika Kwaya ya Mtakatifu Monica, hatutazami uimbaji kama wa mtu binafsi au maonyesho ya soloists. Kila muumini na mwimbaji huvaa sare sawa za heshima, akisimama mbele ya Altare kwa unyenyekevu kutumikia sala ya kanisa zima.'
                : 'At St. Monica Catholic Choir, liturgical singing is never an individual spectacle or solo showcase. Every singer stands unified in dignity before the Holy Altar, blending forty-eight voices into a single reverent prayer for the congregation.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#0C2340]/10 text-xs font-source">
            <div className="p-3 bg-[#EAF4FB] rounded-xl">
              <span className="font-bold text-[#1058A8] block">{lang === 'sw' ? 'Misa za Jumapili:' : 'Sunday Liturgies:'}</span>
              <span className="text-[#0C2340]/80 mt-0.5 block">Sunday High Mass (9:00 AM)</span>
            </div>
            <div className="p-3 bg-[#EAF4FB] rounded-xl">
              <span className="font-bold text-[#1058A8] block">{lang === 'sw' ? 'Sikukuu ya Somo:' : 'Patronal Feast:'}</span>
              <span className="text-[#0C2340]/80 mt-0.5 block">{lang === 'sw' ? '27 Agosti (Mtakatifu Monika)' : '27 August (St. Monica)'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid of Group Moments */}
      <section className="space-y-6">
        <div>
          <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Matukio ya Kwaya Katika Picha' : 'Choir Ministry in Pictures'}
          </h3>
          <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
            {lang === 'sw'
              ? 'Picha za kwaya wakati wa Misa Kuu, tamasha za kijimbo za Nakuru, na mazoezi ya sauti nne.'
              : 'Photographs of the ensemble during Sunday High Masses, Nakuru Deanery festivals, and vocal rehearsals.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groupPhotosList.map((photo) => (
            <div
              key={photo.id}
              className="bg-white border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-xs hover:border-[#1058A8]/50 transition-all flex flex-col justify-between"
            >
              <div className="aspect-16/10 relative overflow-hidden bg-slate-100">
                <img
                  src={getImageSrc(photo.imageKey, photo.customUrl)}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-[#0C2340]/90 backdrop-blur-xs text-white text-[11px] font-source px-2.5 py-0.5 rounded font-bold">
                  {photo.year}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <span className="text-xs font-bold text-[#1058A8] font-source block uppercase">
                  {lang === 'sw' ? photo.occasionSw : photo.occasion}
                </span>
                <h4 className="font-fraunces text-base font-bold text-[#0C2340] leading-snug">
                  {lang === 'sw' ? photo.titleSw : photo.title}
                </h4>
                <p className="text-xs text-[#0C2340]/75 font-source leading-relaxed">
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
