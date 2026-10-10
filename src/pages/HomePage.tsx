import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { CHOIR_STATS, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE, Song } from '../data/choirContent';
import { 
  Play, 
  Pause, 
  ArrowRight, 
  ShoppingBag, 
  MapPin,
  ExternalLink, 
  FileText,
  Clock
} from 'lucide-react';
import { RealYouTubeIcon } from '../components/RealYouTubeIcon';

import choirHeroImg from '../assets/images/choir_singing_moment_1791356740170.jpg';
import churchImg from '../assets/images/st_monica_parish_church_nakuru_1791446429035.jpg';
import choirmasterImg from '../assets/images/choirmaster_director_1791446339605.jpg';
import scorePreviewMachozi from '../assets/images/score_preview_machozi_1791446357129.jpg';
import scorePreviewMaisha from '../assets/images/score_preview_maisha_1791446372899.jpg';
import scorePreviewNimzima from '../assets/images/score_preview_nimzima_1791446398645.jpg';
import scorePreviewJumuiya from '../assets/images/score_preview_jumuiya_1791446413261.jpg';

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
    togglePlay,
    addToCart, 
    lang 
  } = useChoir();

  const getScoreImage = (id: string) => {
    if (id.includes('machozi')) return scorePreviewMachozi;
    if (id.includes('maisha')) return scorePreviewMaisha;
    if (id.includes('nimzima')) return scorePreviewNimzima;
    if (id.includes('jumuiya')) return scorePreviewJumuiya;
    return scorePreviewMachozi;
  };

  const featuredSong = songs[0] || {
    id: "song-machozi",
    title: "Machozi ya Imani",
    titleSwahili: "Machozi ya Imani",
    composer: "Atebe Mark T. · Recorded at Khakstudio",
    voicing: "SATB",
    album: "Nyimbo za Kiliturujia"
  };

  return (
    <div className="w-full space-y-0">
      
      {/* 1. HERO SECTION: Lightened overlay so singers' faces are clearly visible */}
      <section id="home-hero-section" className="relative min-h-[75vh] sm:min-h-[82vh] flex flex-col justify-end p-6 sm:p-12 lg:p-16 overflow-hidden bg-[#0C2340]">
        <img
          src={choirHeroImg}
          alt="St. Monica Catholic Choir"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Soft dark gradient fading to clear by the middle of the photo (50%) so singers' faces remain totally clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/60 via-30% to-transparent to-50%" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340]/85 via-transparent to-transparent sm:hidden" />

        <div className="relative z-10 w-full sm:max-w-[55%] lg:max-w-[50%] text-left space-y-4 pb-4 sm:pb-8">
          <h1 className="font-eb-garamond text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.1]">
            {lang === 'sw' ? (
              <>
                Kuunganisha mioyo kupitia<br />
                muziki mtakatifu
              </>
            ) : (
              <>
                Uniting hearts through<br />
                sacred music
              </>
            )}
          </h1>

          <p className="font-source text-base sm:text-lg text-white/95 leading-relaxed">
            {lang === 'sw'
              ? 'Kwaya ya Misa ya 3 · St. Monica Section 58'
              : 'St. Monica Section 58 3rd mass choir'}
          </p>

          {/* Action buttons: Single strong button, quiet YouTube link, outlined gallery */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            {/* Listen Now */}
            <button
              onClick={() => {
                if (currentSong.id === featuredSong.id) {
                  togglePlay();
                } else {
                  playSong(featuredSong as Song);
                }
              }}
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

            {/* Choir Group Gallery */}
            <button
              onClick={() => onNavigate('about-gallery')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/60 rounded-full transition-all cursor-pointer whitespace-nowrap backdrop-blur-xs"
            >
              <span>{lang === 'sw' ? 'Picha za Kwaya' : 'Choir Gallery'}</span>
            </button>

            {/* Official YouTube Channel */}
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/95 hover:text-white underline-offset-4 hover:underline transition-colors py-2 px-1 cursor-pointer"
            >
              <RealYouTubeIcon size={20} variant="badge" />
              <span>{lang === 'sw' ? 'Tazama YouTube' : 'YouTube Channel'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/70" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. ABOUT & STORY (Warm Cream Background) */}
      <section className="bg-[#FAF8F5] py-16 sm:py-20 border-b border-[#0C2340]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <h2 className="font-eb-garamond text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C2340] leading-tight">
                {lang === 'sw' 
                  ? 'Kutoka Altare ya Parokia Hadi Matamasha ya Kijimbo'
                  : 'From Parish Altar to Diocesan Celebrations'}
              </h2>

              <p className="text-base text-slate-800 font-source leading-relaxed">
                {lang === 'sw'
                  ? 'Kwaya ya Mtakatifu Monika ilianzishwa mwaka 2012 na kundi dogo la waimbaji waliojitolea katika Parokia ya Mtakatifu Monika, Nakuru. Tukio letu la kukumbukwa lilitokea mwaka 2019 kwenye Tamasha la Muziki wa Kikatoliki la Dekania ya Nakuru, ambapo uimbaji wetu wa "Machozi ya Imani" ulileta ukimya na sala ya dhati kanisani kabla ya baraka kuu.'
                  : 'St. Monica Catholic Choir began in 2012 with a dedicated circle of choristers at St. Monica Parish in Nakuru. A defining moment in our journey took place in 2019 at the Nakuru Deanery Choral Festival, when our four-part performance of "Machozi ya Imani" held the congregation in prayerful silence before the final blessing.'}
              </p>

              <p className="text-base text-slate-700 font-source leading-relaxed">
                {lang === 'sw'
                  ? 'Leo, tunaimba kila Dominika kwa sauti nne (Soprano, Alto, Tenor, Bass), tukihakikisha watoto na vijana wa parokia wanajifunza noti za solfa na kuendeleza utamaduni wa muziki mtakatifu.'
                  : 'Today, our choristers sing every Sunday in disciplined four-part harmony (SATB), training young parish voices in tonic sol-fa to keep liturgical tradition vibrant and alive.'}
              </p>

              {/* Stat cards: plain lining numerals sitting at same height, number shown only once with label beneath */}
              <div className="grid grid-cols-3 gap-4 pt-3">
                <div className="p-4 bg-white rounded-xl border border-[#0C2340]/10 shadow-2xs">
                  <span className="text-3xl sm:text-4xl font-bold font-source text-[#1058A8] block">
                    {CHOIR_STATS.membersCount}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-700 block mt-1">
                    {lang === 'sw' ? 'Waimbaji wa Kwaya' : 'Active Choristers'}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#0C2340]/10 shadow-2xs">
                  <span className="text-3xl sm:text-4xl font-bold font-source text-[#0C2340] block">
                    {CHOIR_STATS.yearsServing}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-700 block mt-1">
                    {lang === 'sw' ? 'Miaka ya Utume' : 'Years of Ministry'}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#0C2340]/10 shadow-2xs">
                  <span className="text-3xl sm:text-4xl font-bold font-source text-[#1058A8] block">
                    {CHOIR_STATS.repertoireCount}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-700 block mt-1">
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
                  alt="St. Monica Catholic Church, Section 58 Nakuru"
                  className="w-full h-72 sm:h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-white border-t border-[#0C2340]/10 flex items-center justify-between">
                  <div>
                    <strong className="text-sm font-bold text-[#0C2340] block">
                      St. Monica Catholic Church
                    </strong>
                    <span className="text-xs text-slate-600 block mt-0.5">
                      Section 58, Nakuru · Catholic Diocese of Nakuru
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

      {/* 3. OUR RECORDED SONGS */}
      <section className="bg-[#0C2340] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {lang === 'sw' ? 'Nyimbo Zetu Zilizorekodiwa' : 'Our Recorded Songs'}
              </h2>
              <p className="text-sm sm:text-base text-white/80 font-source mt-1">
                {lang === 'sw'
                  ? 'Nyimbo nne zilizorekodiwa na kwaya katika Section 58, Nakuru.'
                  : 'Four songs recorded by the choir at Section 58, Nakuru.'}
              </p>
            </div>

            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0E56A6] rounded-full transition-colors self-start sm:self-auto cursor-pointer"
            >
              <RealYouTubeIcon size={18} variant="badge" />
              <span>{lang === 'sw' ? 'Tembelea Kituo cha YouTube' : 'YouTube Channel'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* 4 Song Rows with One Clear Play Cue (icon on thumbnail only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songs.slice(0, 4).map((song) => {
              const isThisPlaying = currentSong.id === song.id && isPlaying;
              return (
                <div
                  key={song.id}
                  onClick={() => {
                    if (currentSong.id === song.id) {
                      togglePlay();
                    } else {
                      playSong(song);
                    }
                  }}
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
                      <h4 className="font-eb-garamond font-bold text-base text-white truncate group-hover:text-sky-300 transition-colors">
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
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate('music-repertoire')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full cursor-pointer transition-colors"
            >
              {lang === 'sw' ? 'Tazama Orodha ya Nyimbo na Maneno' : 'View Song Catalog & Song Lyrics'} →
            </button>
          </div>
        </div>
      </section>

      {/* 4. PHOTO BAND */}
      <section className="relative py-24 sm:py-28 overflow-hidden bg-[#0C2340]">
        <img
          src={choirHeroImg}
          alt="Choir vocal ministry"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[#0C2340]/60 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <blockquote className="font-eb-garamond text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug">
            {lang === 'sw'
              ? '“Uimbaji wenye nidhamu altaroni ni sala mara mbili mbele ya Mungu wetu.”'
              : '“Disciplined singing at the holy altar is prayer made twice before our God.”'}
          </blockquote>
          <p className="font-source text-sm sm:text-base text-sky-200">
            {lang === 'sw'
              ? 'Mtakatifu Augustino — Mwana wa Somo Wetu Mtakatifu Monika'
              : 'Saint Augustine — Son of Our Patroness Saint Monica'}
          </p>
        </div>
      </section>

      {/* 5. SHEET MUSIC SCORES: Authentic Score Previews & Buy Score Button */}
      <section className="bg-[#FAF8F5] py-16 sm:py-20 border-b border-[#0C2340]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Noti za Nyimbo Zilizopangiliwa' : 'Choral Sheet Music Scores'}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 font-source mt-1">
                {lang === 'sw'
                  ? 'Noti za sauti nne (Soprano, Alto, Tenor, Bass) zenye solfa na stafu kwa ajili ya walimu wa kwaya.'
                  : 'Official four-part scores (Soprano, Alto, Tenor, Bass) in tonic sol-fa and staff notation.'}
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

          {/* Cards for each score with individual page-one top preview, title with SATB tag, M-Pesa beside price, and Buy Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {sheetMusicList.slice(0, 4).map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl border border-[#0C2340]/15 p-4 flex flex-col justify-between shadow-2xs hover:border-[#1058A8] transition-all space-y-3"
              >
                <div className="space-y-2.5">
                  {/* Distinct Score Preview Image (top half of page one with faint PREVIEW mark) */}
                  <div className="w-full h-36 rounded-lg overflow-hidden bg-slate-100 border border-[#0C2340]/10 relative group">
                    <img
                      src={getScoreImage(item.id)}
                      alt={`${item.title} Score Preview`}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Title only with SATB small tag */}
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-eb-garamond font-bold text-base text-[#0C2340] leading-snug">
                      {lang === 'sw' ? item.titleSw : item.title}
                    </h4>
                    <span className="text-[10px] font-bold bg-[#EAF4FB] text-[#1058A8] px-1.5 py-0.5 rounded shrink-0">
                      SATB
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-source">
                    {lang === 'sw' ? 'Mtunzi:' : 'Composer:'} <strong className="text-slate-900">{item.composer}</strong>
                  </p>

                  <p className="text-[11px] text-slate-600 font-source">
                    Soprano · Alto · Tenor · Bass
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0C2340]/10 space-y-2.5">
                  {/* Price with small M-Pesa logo beside it */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-eb-garamond font-bold text-base text-[#1058A8]">
                        KES {item.priceKes}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded tracking-wider shadow-2xs">
                        M-PESA
                      </span>
                    </div>
                  </div>

                  {/* Clean Buy Score button */}
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
                    className="w-full py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{lang === 'sw' ? 'Nunua Noti' : 'Buy Score'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CHOIRMASTER MESSAGE & SUNDAY MASS SCHEDULE: Cream background with photo and dark text */}
      <section className="bg-[#FAF8F5] py-16 sm:py-20 border-b border-[#0C2340]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Choirmaster Profile & Message */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Ujumbe Kutoka kwa Mwalimu wa Kwaya' : 'A Word from the Choirmaster'}
              </h2>

              <p className="text-base text-slate-800 font-source leading-relaxed">
                {lang === 'sw'
                  ? '“Karibu sana kwenye jukwaa la Kwaya ya Mtakatifu Monika, Nakuru. Lengo letu kuu ni nidhamu ya sauti na heshima mbele ya Altare Takatifu. Tunafundisha waimbaji wetu kusoma noti za solfa kwa ufasaha, ili kila wimbo unaoimbwa uwe dhabihu safi na sala ya kicho mbele ya Mwenyezi Mungu.”'
                  : '“Welcome to the musical home of St. Monica Catholic Choir, Nakuru. Our continuous focus is vocal discipline and deep reverential worship before the Holy Altar. We teach our choristers strict tonic sol-fa sight singing, ensuring every song offered is an authentic sacrifice of praise before Almighty God.”'}
              </p>

              <div className="pt-2 flex items-center gap-3.5">
                {/* Choirmaster photo in a clean round frame */}
                <img
                  src={choirmasterImg}
                  alt="Mwalimu Joseph Otieno"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#1058A8] shadow-sm shrink-0"
                />
                <div>
                  <strong className="text-base font-bold text-[#0C2340] font-eb-garamond block">
                    Mwalimu Joseph Otieno
                  </strong>
                  <span className="text-sm text-slate-700 font-source block">
                    {lang === 'sw' ? 'Mkurugenzi wa Muziki na Mwalimu Mkuu wa Kwaya' : 'Director of Music & Choirmaster'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sunday Mass Schedule & Church Location */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-[#0C2340]/15 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1058A8]" />
                <h3 className="font-eb-garamond font-bold text-lg text-[#0C2340]">
                  {lang === 'sw' ? 'Ratiba ya Misa ya Jumapili' : 'Sunday Mass Schedule'}
                </h3>
              </div>

              <ul className="space-y-3 text-sm text-slate-800 font-source">
                <li className="flex items-center justify-between pb-2 border-b border-[#0C2340]/10">
                  <span>{lang === 'sw' ? 'Misa ya 1 (Asubuhi Mapema)' : '1st Mass (Dawn)'}</span>
                  <strong className="text-[#0C2340]">7:00 AM</strong>
                </li>
                <li className="flex items-center justify-between pb-2 border-b border-[#0C2340]/10 bg-[#EAF4FB] p-2.5 rounded-lg">
                  <span className="font-bold text-[#1058A8]">
                    {lang === 'sw' ? 'Sunday High Mass' : 'Sunday High Mass'}
                  </span>
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

