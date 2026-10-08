import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE, CHOIR_STATS } from '../data/choirContent';
import { Youtube, ExternalLink, Heart, Sparkles, X, Music, CheckCircle } from 'lucide-react';

export const SongCutoffModal: React.FC = () => {
  const {
    isIntroCutoffOpen,
    dismissIntroCutoff,
    currentSong,
    addToCart,
    formatPrice,
    lang
  } = useChoir();

  if (!isIntroCutoffOpen) return null;

  const fullYoutubeUrl = currentSong.youtubeUrl || YOUTUBE_CHANNEL_URL;

  const handleSupportChoir = () => {
    // Add 100 KES Digital Song / Choir Support item to cart and open cart
    addToCart({
      id: `support-song-${currentSong.id}`,
      name: `${currentSong.title} — Digital Audio & Choir Support`,
      nameSw: `${currentSong.title} — Wimbo Kamili na Sadaka ya Kwaya`,
      type: 'digital_album',
      priceKes: 100,
      priceUsd: 1.00,
      description: `Complete authentic high-fidelity recording of "${currentSong.title}" and a 100 KES voluntary donation supporting St. Monica Catholic Choir Section 58 Nakuru ministry.`,
      descriptionSw: `Wimbo kamili wa "${currentSong.title}" na mchango wa hiari wa KES 100 kusaidia utume wa Kwaya ya Mtakatifu Monica Section 58 Nakuru. Lipa na M-Pesa.`,
      image: 'choir_singing_moment',
      badge: 'Support KES 100',
      downloadable: true
    });
    dismissIntroCutoff();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050C16]/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={dismissIntroCutoff}
    >
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#0C2340] via-[#09182C] to-[#061120] text-white rounded-3xl border border-sky-400/30 p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#1058A8]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={dismissIntroCutoff}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-sky-500/20 text-[#7EC8F0] border border-sky-400/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>{lang === 'sw' ? 'Mwisho wa Utangulizi (Sek 40)' : '40-Sec Preview Complete'}</span>
          </span>
        </div>

        {/* Title & Song Card */}
        <div className="space-y-2">
          <h3 className="font-fraunces text-2xl sm:text-3xl font-bold text-white leading-tight">
            {lang === 'sw' ? 'Umeupenda wimbo huu?' : 'Enjoying the hymn?'}
          </h3>
          <p className="text-sm text-slate-300 font-source leading-relaxed">
            {lang === 'sw'
              ? `Umesikiliza utangulizi wa sekunde 40 wa "${currentSong.titleSwahili}". Ili kusikiliza wimbo mzima bila kikomo, tembelea YouTube yetu au unga mkono kwaya yetu kwa KES 100 tu.`
              : `You just heard the opening 40-second intro of "${currentSong.title}". Continue listening to the full piece on our official YouTube channel, or support the choir for only KES 100.`}
          </p>
        </div>

        {/* Current Song Feature Strip */}
        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#1058A8] text-white flex items-center justify-center shrink-0 border border-sky-300/30">
            <Music className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-fraunces text-base font-bold text-white truncate">
              {lang === 'sw' ? currentSong.titleSwahili : currentSong.title}
            </h4>
            <p className="text-xs text-sky-200 truncate mt-0.5">
              {currentSong.composer} · {currentSong.voicing}
            </p>
          </div>
        </div>

        {/* 2 Modern Action Buttons */}
        <div className="space-y-3 pt-1">
          {/* Option 1: Watch & Listen Full on YouTube (FREE) */}
          <a
            href={fullYoutubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismissIntroCutoff}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Youtube className="w-5 h-5 fill-current shrink-0 text-white" />
              <span>
                {lang === 'sw' ? 'Sikiliza Wimbo Mzima YouTube (Bure)' : 'Listen Full Song on YouTube (Free)'}
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Option 2: Support the Choir for only 100 KES (Lipa na M-Pesa) */}
          <button
            onClick={handleSupportChoir}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all cursor-pointer flex items-center justify-between group border border-emerald-400/40"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 fill-current text-emerald-200 shrink-0" />
              <div className="text-left">
                <span className="block leading-tight">
                  {lang === 'sw' ? 'Unga Mkono Kwaya (KES 100)' : 'Support the Choir (Only KES 100)'}
                </span>
                <span className="text-[11px] font-normal text-emerald-100">
                  {lang === 'sw' ? 'Wimbo kamili wa MP3 · Lipa na M-Pesa' : 'Full MP3 download · Pay with M-Pesa'}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-bold tracking-wide">
              {formatPrice(100)}
            </span>
          </button>
        </div>

        {/* Reassurance text */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-slate-300 text-center">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            {lang === 'sw'
              ? `Kituo rasmi: ${YOUTUBE_CHANNEL_HANDLE} · Mapato huwezesha mavazi na noti.`
              : `Official channel: ${YOUTUBE_CHANNEL_HANDLE} · Supports choir vestments and scores.`}
          </span>
        </div>
      </div>
    </div>
  );
};
