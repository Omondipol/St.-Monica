import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { CHOIR_STATS, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE, Song } from '../data/choirContent';
import { 
  Play, 
  Pause, 
  ArrowRight, 
  ShoppingBag, 
  MapPin,
  Youtube, 
  ExternalLink, 
  FileText,
  Clock,
  CheckCircle2
} from 'lucide-react';

import choirHeroImg from '../assets/images/choir_singing_moment_1791356740170.jpg';
import hymnalImg from '../assets/images/sheet_music_hymnal_1791356751097.jpg';
import churchImg from '../assets/images/nakuru_parish_cathedral_1791356761479.jpg';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { 
    songs, 
    sheetMusicList, 
    currentSong, 
    isPlaying, 
    playSong, 
    addToCart, 
    formatPrice,
    lang 
  } = useChoir();

  const featuredSong = songs[0] || {
    id: "song-machozi",
    title: "Machozi ya Imani",
    titleSwahili: "Machozi ya Imani",
    composer: "Atebe Mark T.",
    voicing: "SATB",
    album: "Nyimbo za Kiliturujia za SEC 58"
  };

  return (
    <div className="w-full space-y-0">
      
      {/* 1. HERO SECTION: Clean human-made look, no duplicated logos or small caps labels */}
      <section className="relative min-h-[75vh] sm:min-h-[82vh] flex flex-col justify-end p-6 sm:p-12 lg:p-16 overflow-hidden bg-[#0C2340]">
        <img
          src={choirHeroImg}
          alt="St. Monica Catholic Choir Section 58 Nakuru"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Dignified scrim */}
        <div className="absolute inset-0 bg-[#0C2340]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340] via-[#0C2340]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340] via-[#0C2340]/75 to-transparent/20" />

        <div className="relative z-10 max-w-3xl space-y-5 pb-4 sm:pb-8">
          <h1 className="font-fraunces text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            {lang === 'sw' 
              ? 'Kuinua Mioyo Katika Sala na Wimbo'
              : 'Lifting Hearts in Sacred Song'}
          </h1>

          <p className="font-source text-base sm:text-lg text-white/95 max-w-2xl leading-relaxed">
            {lang === 'sw'
              ? 'Tunaimba katika Misa Kuu ya Jumapili na maadhimisho ya kijimbo, na tunatoa muziki wetu bure kwa utukufu wa Mungu.'
              : 'We sing at Sunday High Mass and diocesan celebrations, and we offer our music freely.'}
          </p>

          {/* Action buttons: Single strong button, quiet YouTube link, outlined gallery */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            {/* Listen Now: Single strong filled button */}
            <button
              onClick={() => playSong(featuredSong as Song)}
              className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-bold text-[#0C2340] bg-white hover:bg-[#EAF4FB] rounded-full transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {isPlaying && currentSong.id === featuredSong.id ? (
                <>
                  <Pause className="w-4 h-4 fill-current text-[#1058A8]" />
                  <span>{lang === 'sw' ? 'Sitisha Wimbo' : 'Pause Song'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-[#1058A8] ml-0.5" />
                  <span>{lang === 'sw' ? 'Sikiliza Sasa' : 'Listen Now'}</span>
                </>
              )}
            </button>

            {/* Choir Group Gallery: Clear outlined button */}
            <button
              onClick={() => onNavigate('about-gallery')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/60 rounded-full transition-all cursor-pointer whitespace-nowrap backdrop-blur-xs"
            >
              <span>{lang === 'sw' ? 'Picha za Kwaya' : 'Choir Gallery'}</span>
            </button>

            {/* Official YouTube Channel: Small quiet link */}
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white underline-offset-4 hover:underline transition-colors py-2 px-1 cursor-pointer"
            >
              <Youtube className="w-4 h-4 fill-current text-red-500 shrink-0" />
              <span>{lang === 'sw' ? 'Tazama YouTube' : 'YouTube Channel'}</span>
              <ExternalLink className="w-3 h-3 text-white/70" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY & PARISH MILESTONE (Warm Cream Background, Edge to Edge) */}
      <section className="bg-[#FAF8F5] py-16 sm:py-20 border-b border-[#0C2340]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <h2 className="font-fraunces text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C2340] leading-tight">
                {lang === 'sw' 
                  ? 'Kutoka Altare ya Section 58 Hadi Matamasha ya Kijimbo'
                  : 'From the Section 58 Altar to Diocesan Festivals'}
              </h2>

              <p className="text-base text-slate-800 font-source leading-relaxed">
                {lang === 'sw'
                  ? 'Kwaya ya Mtakatifu Monica ilianzishwa mwaka 2012 na kundi dogo la waimbaji waliojitolea katika Parokia ya Section 58 Nakuru. Tukio letu la kukumbukwa lilitokea mwaka 2019 kwenye Tamasha la Muziki wa Kikatoliki la Dekania ya Nakuru, ambapo uimbaji wetu wa "Machozi ya Imani" ulileta ukimya na sala ya dhati kanisani kabla ya baraka kuu.'
                  : 'St. Monica Catholic Choir began in 2012 with a dedicated circle of choristers at Section 58 Parish in Nakuru. A defining moment in our journey took place in 2019 at the Nakuru Deanery Choral Festival, when our four-part performance of "Machozi ya Imani" held the cathedral congregation in prayerful silence before the final blessing.'}
              </p>

              <p className="text-base text-slate-700 font-source leading-relaxed">
                {lang === 'sw'
                  ? 'Leo, tunaimba kila Dominika kwa sauti nne (Soprano, Alto, Tenor, Bass), tukihakikisha watoto na vijana wa parokia wanajifunza noti za solfa na kuendeleza utamaduni wa muziki mtakatifu.'
                  : 'Today, our choristers sing every Sunday in disciplined four-part harmony (SATB), training young parish voices in tonic sol-fa to keep liturgical tradition vibrant and alive.'}
              </p>

              {/* Verified Honest Stats (No "4+") */}
              <div className="grid grid-cols-3 gap-4 pt-3">
                <div className="p-4 bg-white rounded-xl border border-[#0C2340]/10 shadow-2xs">
                  <span className="text-3xl font-bold font-fraunces text-[#1058A8] block">
                    {CHOIR_STATS.membersCount}
                  </span>
                  <span className="text-sm font-medium text-slate-700 block mt-1">
                    {lang === 'sw' ? 'Waimbaji wa SATB' : 'Active Choristers'}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#0C2340]/10 shadow-2xs">
                  <span className="text-3xl font-bold font-fraunces text-[#0C2340] block">
                    {CHOIR_STATS.yearsServing}
                  </span>
                  <span className="text-sm font-medium text-slate-700 block mt-1">
                    {lang === 'sw' ? 'Miaka Parokiani' : 'Years at Sec 58'}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#0C2340]/10 shadow-2xs">
                  <span className="text-3xl font-bold font-fraunces text-[#1058A8] block">
                    {CHOIR_STATS.repertoireCount}
                  </span>
                  <span className="text-sm font-medium text-slate-700 block mt-1">
                    {lang === 'sw' ? 'Noti za Kwaya' : 'Choral Scores'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-6">
                <button
                  onClick={() => onNavigate('about-story')}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1058A8] hover:underline cursor-pointer"
                >
                  <span>{lang === 'sw' ? 'Soma historia yetu yote' : 'Read our full story'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('about-leadership')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#0C2340] cursor-pointer"
                >
                  <span>{lang === 'sw' ? 'Walimu na viongozi' : 'Choir leadership'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md bg-white">
                <img
                  src={churchImg}
                  alt="St. Monica Parish Section 58 Nakuru"
                  className="w-full h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-white border-t border-[#0C2340]/10 flex items-center justify-between">
                  <div>
                    <strong className="text-sm font-bold text-[#0C2340] block">
                      St. Monica Catholic Church
                    </strong>
                    <span className="text-xs text-slate-600 block mt-0.5">
                      Section 58, Nakuru (CDDN)
                    </span>
                  </div>
                  <a
                    href={CHOIR_STATS.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#1058A8] hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Map</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ACTUAL RECORDED SONGS (Edge to Edge Liturgical Navy Section) */}
      <section className="bg-[#0C2340] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-fraunces text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {lang === 'sw' ? 'Nyimbo Zetu Halisi za Kwaya' : 'Our Actual Recorded Songs'}
              </h2>
              <p className="text-sm sm:text-base text-white/80 font-source mt-1">
                {lang === 'sw'
                  ? `Nyimbo halisi zilizorekodiwa na Kwaya ya Mtakatifu Monica Section 58 (${YOUTUBE_CHANNEL_HANDLE}).`
                  : `Authentic hymns recorded by St. Monica Choir Section 58 (${YOUTUBE_CHANNEL_HANDLE}).`}
              </p>
            </div>

            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Youtube className="w-4 h-4 fill-current" />
              <span>{lang === 'sw' ? 'Tembelea Kituo cha YouTube' : 'YouTube Channel'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* 4 Song Rows with One Clear Play Action & Video Thumbnail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songs.slice(0, 4).map((song) => {
              const isThisPlaying = currentSong.id === song.id && isPlaying;
              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song)}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    isThisPlaying
                      ? 'bg-white/15 border-sky-400 shadow-md ring-1 ring-sky-400/50'
                      : 'bg-[#132B4A] hover:bg-[#1A385E] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* 16:9 Video Thumbnail with Play Badge */}
                    <div className="relative w-20 sm:w-24 aspect-16/9 rounded-lg overflow-hidden shrink-0 border border-white/15 shadow-xs">
                      <img
                        src={song.thumbnailUrl}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className={`absolute inset-0 flex items-center justify-center transition-colors ${
                        isThisPlaying ? 'bg-[#1058A8]/60' : 'bg-black/35 group-hover:bg-black/20'
                      }`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${
                          isThisPlaying ? 'bg-white text-[#1058A8]' : 'bg-white/90 text-[#0C2340] group-hover:bg-white'
                        }`}>
                          {isThisPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-fraunces font-bold text-base text-white truncate group-hover:text-sky-300 transition-colors">
                        {lang === 'sw' ? song.titleSwahili : song.title}
                      </h4>
                      <p className="text-xs text-white/75 truncate font-source mt-0.5">
                        {song.composer}
                      </p>
                      <span className="text-[11px] text-sky-300/90 font-medium block mt-0.5">
                        {song.voicing} · {song.duration}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2">
                    <span className="text-xs font-semibold text-sky-300 group-hover:underline">
                      {isThisPlaying ? (lang === 'sw' ? 'Inacheza' : 'Playing') : (lang === 'sw' ? 'Sikiliza' : 'Play')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate('music-repertoire')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full cursor-pointer transition-colors"
            >
              {lang === 'sw' ? 'Tazama Nyimbo Zote na Maneno' : 'View Full Hymn Catalog & Lyrics'} →
            </button>
          </div>
        </div>
      </section>

      {/* 4. FULL-WIDTH PHOTO BAND (Choir Rehearsal & Reverence Moment) */}
      <section className="relative py-24 sm:py-28 overflow-hidden bg-[#0C2340]">
        <img
          src={choirHeroImg}
          alt="Choir vocal ministry"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[#0C2340]/60 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <blockquote className="font-fraunces text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug">
            {lang === 'sw'
              ? '"Uimbaji wenye nidhamu altaroni ni sala mara mbili mbele ya Mungu wetu."'
              : '"Disciplined singing at the holy altar is prayer made twice before our God."'}
          </blockquote>
          <p className="font-source text-sm sm:text-base text-sky-200">
            {lang === 'sw'
              ? 'Mtakatifu Augustino — Mwana wa Somo Wetu Mtakatifu Monika'
              : 'Saint Augustine — Son of Our Patroness Saint Monica'}
          </p>
        </div>
      </section>

      {/* 5. SHEET MUSIC SCORES (Cream Background, Cards Only For Scores) */}
      <section className="bg-[#FAF8F5] py-16 sm:py-20 border-b border-[#0C2340]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-fraunces text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Noti za Nyimbo Zilizopangiliwa (SATB)' : 'Choral Sheet Music Scores (SATB)'}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 font-source mt-1">
                {lang === 'sw'
                  ? 'Noti za sauti nne (Soprano, Alto, Tenor, Bass) zenye solfa na stafu kwa ajili ya walimu wa kwaya. Malipo ya haraka na salama kwa M-Pesa.'
                  : 'Official four-part scores (Soprano, Alto, Tenor, Bass) in tonic sol-fa and staff notation. Instant PDF delivery via M-Pesa.'}
              </p>
            </div>

            <button
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#0C2340] bg-white hover:bg-[#EAF4FB] border border-[#0C2340]/20 rounded-xl cursor-pointer self-start sm:self-auto transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#1058A8]" />
              <span>{lang === 'sw' ? 'Duka Lote la Noti' : 'All Sheet Music'}</span>
            </button>
          </div>

          {/* Cards ONLY for score items with cover previews & M-Pesa */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {sheetMusicList.slice(0, 4).map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl border border-[#0C2340]/15 p-4 flex flex-col justify-between shadow-2xs hover:border-[#1058A8] transition-all space-y-3"
              >
                <div className="space-y-2.5">
                  {/* Score cover thumbnail */}
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-[#EAF4FB] border border-[#0C2340]/10 relative">
                    <img
                      src={hymnalImg}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-2 left-2 bg-[#0C2340]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      SATB Vocal Score
                    </span>
                  </div>

                  <h4 className="font-fraunces font-bold text-base text-[#0C2340] leading-snug line-clamp-2">
                    {lang === 'sw' ? item.titleSw : item.title}
                  </h4>

                  <p className="text-xs text-slate-700 font-source">
                    {lang === 'sw' ? 'Mtunzi:' : 'Composer:'} <strong className="text-slate-900">{item.composer}</strong>
                  </p>

                  <p className="text-[11px] text-slate-600 font-source">
                    Soprano · Alto · Tenor · Bass (SATB)
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0C2340]/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-fraunces font-bold text-base text-[#1058A8]">
                      KES {item.priceKes}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>M-Pesa</span>
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart({
                      id: `prod-${item.id}`,
                      name: item.title,
                      nameSw: item.titleSw,
                      type: 'sheet_music',
                      priceKes: item.priceKes,
                      priceUsd: item.priceUsd,
                      description: item.description,
                      descriptionSw: item.descriptionSw,
                      image: 'sheet_music_hymnal',
                      downloadable: true
                    })}
                    className="w-full py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{lang === 'sw' ? 'Nunua kwa M-Pesa' : 'Pay with M-Pesa'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CHOIRMASTER MESSAGE & SUNDAY MASS SCHEDULE (Navy/Cream Split) */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Choirmaster Profile & Message */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Ujumbe Kutoka kwa Mwalimu wa Kwaya' : 'A Word from the Choirmaster'}
              </h2>

              <p className="text-base text-slate-800 font-source leading-relaxed">
                {lang === 'sw'
                  ? '"Karibu sana kwenye jukwaa la Kwaya ya Mtakatifu Monica, Parokia ya Section 58 Nakuru. Lengo letu kuu ni nidhamu ya sauti na heshima mbele ya Altare Takatifu. Tunafundisha waimbaji wetu kusoma noti za solfa kwa ufasaha, ili kila wimbo unaoimbwa uwe dhabihu safi na sala ya kicho mbele ya Mwenyezi Mungu."'
                  : '"Welcome to the musical home of St. Monica Catholic Choir, Section 58 Parish Nakuru. Our continuous focus is vocal discipline and deep reverential worship before the Holy Altar. We teach our choristers strict tonic sol-fa sight singing, ensuring every hymn offered is an authentic sacrifice of praise before Almighty God."'}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1058A8] text-white flex items-center justify-center font-fraunces font-bold text-lg shadow-sm">
                  PO
                </div>
                <div>
                  <strong className="text-base font-bold text-[#0C2340] font-fraunces block">
                    Mwalimu Polycarp Ochieng
                  </strong>
                  <span className="text-sm text-slate-700 font-source block">
                    {lang === 'sw' ? 'Mkurugenzi wa Muziki na Mwalimu Mkuu wa Kwaya' : 'Director of Music & Choirmaster'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sunday Mass Schedule & Church Location */}
            <div className="lg:col-span-5 bg-[#FAF8F5] rounded-2xl p-6 sm:p-7 border border-[#0C2340]/15 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1058A8]" />
                <h3 className="font-fraunces font-bold text-lg text-[#0C2340]">
                  {lang === 'sw' ? 'Ratiba ya Misa ya Jumapili' : 'Sunday Mass Schedule'}
                </h3>
              </div>

              <ul className="space-y-3 text-sm text-slate-800 font-source">
                <li className="flex items-center justify-between pb-2 border-b border-[#0C2340]/10">
                  <span>{lang === 'sw' ? 'Misa ya 1 (Asubuhi Mapema)' : '1st Mass (Dawn)'}</span>
                  <strong className="text-[#0C2340]">7:00 AM</strong>
                </li>
                <li className="flex items-center justify-between pb-2 border-b border-[#0C2340]/10 bg-[#EAF4FB] p-2 rounded-lg">
                  <span className="font-bold text-[#1058A8]">{lang === 'sw' ? 'Misa Kuu ya Kwaya' : 'Choir High Mass'}</span>
                  <strong className="text-[#1058A8]">9:00 AM</strong>
                </li>
                <li className="flex items-center justify-between pb-2 border-b border-[#0C2340]/10">
                  <span>{lang === 'sw' ? 'Misa ya 3 (Vijana)' : '3rd Mass (Youth)'}</span>
                  <strong className="text-[#0C2340]">11:00 AM</strong>
                </li>
              </ul>

              <div className="pt-2 text-xs text-slate-700 font-source space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#1058A8] shrink-0 mt-0.5" />
                  <span>{CHOIR_STATS.churchAddress}</span>
                </div>

                <a
                  href={CHOIR_STATS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1058A8] hover:underline pt-1"
                >
                  <span>{lang === 'sw' ? 'Fungua Ramani ya Google' : 'Open in Google Maps'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
