import React, { useState, useEffect } from 'react';
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
  Clock,
  UserPlus,
  Sparkles
} from 'lucide-react';
import { RealYouTubeIcon } from '../components/RealYouTubeIcon';
import { CoreValuesSection } from '../components/CoreValuesSection';

import heroSlide1Mass from '../assets/images/hero_slide_1_mass.jpg';
import heroSlide2Faces from '../assets/images/hero_slide_2_faces.jpg';
import heroSlide3Director from '../assets/images/hero_slide_3_director.jpg';
import heroSlide4Scores from '../assets/images/hero_slide_4_scores.jpg';
import heroSlide5Church from '../assets/images/hero_slide_5_church.jpg';

import heroSlide1Portrait from '../assets/images/hero_slide_1_portrait.jpg';
import heroSlide2Portrait from '../assets/images/hero_slide_2_portrait.jpg';
import heroSlide3Portrait from '../assets/images/hero_slide_3_portrait.jpg';
import choirHeroImg from '../assets/images/choir_singing_moment_1791356740170.jpg';

import churchImg from '../assets/images/st_monica_parish_church_nakuru_1791446429035.jpg';
import choirmasterImg from '../assets/images/choirmaster_director_1791446339605.jpg';
import scorePreviewMachozi from '../assets/images/score_preview_machozi_1791446357129.jpg';
import scorePreviewMaisha from '../assets/images/score_preview_maisha_1791446372899.jpg';
import scorePreviewNimzima from '../assets/images/score_preview_nimzima_1791446398645.jpg';
import scorePreviewJumuiya from '../assets/images/score_preview_jumuiya_1791446413261.jpg';

const DESKTOP_HERO_SLIDES = [
  {
    src: heroSlide1Mass,
    alt: "Full choir shot at Mass altar in St. Monica Catholic Church, Section 58",
    description: "Full Choir at Sunday High Mass"
  },
  {
    src: heroSlide5Church,
    alt: "St. Monica's Catholic Church sanctuary and altar, Section 58 Nakuru",
    description: "Parish Sanctuary & Church"
  },
  {
    src: heroSlide2Faces,
    alt: "Close-up of singers' faces singing liturgical praises",
    description: "Singers in Sacred Song"
  },
  {
    src: heroSlide3Director,
    alt: "The choirmaster directing the four vocal sections",
    description: "Choirmaster Directing"
  }
];

const MOBILE_HERO_SLIDES = [
  {
    src: heroSlide1Portrait,
    alt: "Full choir shot at Mass altar",
    description: "Full Choir at Mass"
  },
  {
    src: heroSlide5Church,
    alt: "St. Monica's Catholic Church sanctuary",
    description: "Parish Church"
  },
  {
    src: heroSlide2Portrait,
    alt: "Close-up of singers' faces",
    description: "Choristers Singing"
  },
  {
    src: heroSlide3Portrait,
    alt: "The choirmaster directing",
    description: "Choirmaster Directing"
  }
];

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
    lang,
    heroContent,
    choirStats,
    massSchedule,
    siteNotice,
    openJoinModal
  } = useChoir();

  // Part 3: Rotating hero background slideshow (5 photos on desktop, 3 on mobile)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handleMotionChange);
    return () => mql.removeEventListener('change', handleMotionChange);
  }, []);

  const activeSlides = isMobile ? MOBILE_HERO_SLIDES : DESKTOP_HERO_SLIDES;

  // Preload remaining photos in the background after the first photo mounts
  useEffect(() => {
    activeSlides.slice(1).forEach(slide => {
      const img = new Image();
      img.src = slide.src;
    });
  }, [isMobile]);

  // Keep index within bounds if switching mobile/desktop
  useEffect(() => {
    if (currentSlideIndex >= activeSlides.length) {
      setCurrentSlideIndex(0);
    }
  }, [activeSlides.length, currentSlideIndex]);

  // 5.5-second auto advance, pause on hover, stop on prefers-reduced-motion
  useEffect(() => {
    if (prefersReducedMotion || isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeSlides.length, isHovered, prefersReducedMotion]);

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
      
      {/* 1. HERO SECTION: 5-Photo rotating crossfade slideshow (7s interval, 1.5s crossfade, 4% zoom, pause on hover) */}
      <section 
        id="home-hero-section" 
        className="relative min-h-[calc(100vh-96px)] w-full flex flex-col justify-end p-6 sm:p-12 lg:p-16 overflow-hidden bg-[#0C2340]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Slides: Absolute stacked layers with smooth 1000ms crossfade and continuous Ken Burns zooming */}
        {activeSlides.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-[1000ms] ease-in-out overflow-hidden ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              <img
                key={isActive ? `active-${slide.src}-${currentSlideIndex}` : `inactive-${slide.src}`}
                src={slide.src}
                alt={slide.alt}
                loading={index === 0 ? 'eager' : 'lazy'}
                className={`w-full h-full object-cover object-center contrast-[1.05] brightness-[1.01] will-change-transform ${
                  !prefersReducedMotion && isActive
                    ? 'animate-ken-burns'
                    : 'scale-100'
                }`}
                referrerPolicy="no-referrer"
              />
            </div>
          );
        })}

        {/* Strong dark gradient on the left so headline and buttons are always crystal clear against every photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340] via-[#0C2340]/90 via-40% to-transparent to-75% z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340]/90 via-[#0C2340]/40 to-transparent sm:hidden z-10 pointer-events-none" />

        {/* Hero Content (shuffles smoothly with slides, Slide 1 is default, Slide 2 has singing quote & Join Us button) */}
        {(() => {
          const heroSlideContents = [
            // Slide 1 (index 0): Exactly how it is currently
            {
              eyebrow: null,
              headline: lang === 'sw' ? (heroContent?.headlineSw || 'Kuunganisha mioyo kupitia muziki mtakatifu') : (heroContent?.headlineEn || 'Uniting hearts through sacred music'),
              author: null,
              subhead: lang === 'sw' ? (heroContent?.subheadSw || 'Kwaya ya Misa ya Tatu, Mtakatifu Monika (Section 58 Nakuru)') : (heroContent?.subheadEn || 'St. Monica Third Mass Choir (Section 58, Nakuru)'),
              type: 'default' as const
            },
            // Slide 2 (index 1): St. Augustine singing quote + Join Us button
            {
              eyebrow: lang === 'sw' ? 'Maneno ya Mtakatifu Augustino' : 'Saint Augustine on Sacred Song',
              headline: lang === 'sw' ? '“Mwenye kuimba vizuri husali mara mbili.”' : '“He who sings prays twice.”',
              author: lang === 'sw' ? '— Mtakatifu Augustino wa Hippo' : '— St. Augustine of Hippo',
              subhead: lang === 'sw' 
                ? 'Toa sauti yako kumtukuza Mungu katika Altare ya Parokia ya Mtakatifu Monika. Jiunge na familia ya kwaya leo (Ada ya mwaka: Kshs. 500).' 
                : 'Offer your vocal gifts to glorify God before the sacred altar at St. Monica Parish. Join our liturgical choral fellowship today (Annual fee: Kshs. 500).',
              type: 'quote-join' as const
            },
            // Slide 3 (index 2): Scripture Quote (Psalm 96:1) + Join Us
            {
              eyebrow: lang === 'sw' ? 'Neno la Zaburi 96:1' : 'Psalm 96:1 · Sacred Scripture',
              headline: lang === 'sw' ? '“Mwimbieni Bwana wimbo mpya, mwimbieni Bwana, nchi yote.”' : '“Sing to the Lord a new song; sing to the Lord, all the earth.”',
              author: '— Psalm 96:1 / Zaburi 96:1',
              subhead: lang === 'sw'
                ? 'Uimbaji wa sauti nne (Soprano, Alto, Tenor, Bass) uliojengwa kwa nidhamu, sala, na upatanisho mtakatifu.'
                : 'Four-part SATB polyphony grounded in liturgical discipline, unceasing prayer, and fraternal communion.',
              type: 'quote-join' as const
            },
            // Slide 4 (index 3): Choral Fellowship & Altar Service
            {
              eyebrow: lang === 'sw' ? 'Umoja wa Kwaya' : 'Sacred Polyphony & Altar Service',
              headline: lang === 'sw' ? '“Sauti Nne, Sala Moja Takatifu Mbele ya Altare.”' : '“Four Voices, One Sacred Harmony Before the Altar.”',
              author: 'St. Monica Third Mass Choir · Section 58 Nakuru',
              subhead: lang === 'sw'
                ? 'Kutoka waimbaji 14 mwaka 2012 hadi jumuiya ya walei 48 wanaotumikia Misa Kuu ya Jumapili kila juma.'
                : 'From 14 founding choristers in 2012 to a dedicated ensemble of 48 choristers serving Sunday High Mass.',
              type: 'quote-join' as const
            },
            // Slide 5 (index 4): Welcome to all voices
            {
              eyebrow: lang === 'sw' ? 'Wito wa Kwaya' : 'Choir Call to Service',
              headline: lang === 'sw' ? '“Kila sauti ni sadaka ya sifa kwa Mwenyezi Mungu.”' : '“Every vocal part is an offering of praise to the Almighty.”',
              author: 'Soprano · Alto · Tenor · Bass',
              subhead: lang === 'sw'
                ? 'Je, unaimba Soprano, Alto, Tenor au Bass? Milango yetu iko wazi. Usajili wa kila mwaka ni Kshs. 500.'
                : 'Do you sing Soprano, Alto, Tenor, or Bass? Our choir family warmly welcomes you. Annual registration is Kshs. 500.',
              type: 'quote-join' as const
            }
          ];

          const currentContent = heroSlideContents[currentSlideIndex % heroSlideContents.length];

          return (
            <div 
              key={currentSlideIndex} 
              className="relative z-20 w-full sm:max-w-[70%] lg:max-w-[62%] text-left space-y-3 sm:space-y-4 pb-8 sm:pb-12 min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out"
            >
              {currentContent.eyebrow && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/35 text-xs font-semibold uppercase tracking-wider font-source shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentContent.eyebrow}</span>
                </div>
              )}

              <h1 className="font-eb-garamond text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.08] drop-shadow-sm break-words">
                {currentContent.headline}
              </h1>

              {currentContent.author && (
                <span className="text-amber-200/95 font-eb-garamond text-base sm:text-xl font-medium block italic">
                  {currentContent.author}
                </span>
              )}

              <p className="font-source text-sm sm:text-base md:text-lg text-white/95 font-medium tracking-wide break-words max-w-2xl">
                {currentContent.subhead}
              </p>

              {/* Shuffling Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2 sm:pt-3">
                {currentContent.type === 'quote-join' ? (
                  <>
                    {/* Primary Join Us Button with Pop-up trigger */}
                    <button
                      onClick={() => openJoinModal()}
                      className="inline-flex items-center gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-full transition-all shadow-lg hover:shadow-amber-500/30 active:scale-95 cursor-pointer whitespace-nowrap uppercase tracking-wider font-source"
                    >
                      <UserPlus className="w-4 h-4 text-slate-950" />
                      <span>{lang === 'sw' ? 'Jiunge Nasi (Kshs. 500)' : 'Join Us (Kshs. 500)'}</span>
                    </button>

                    {/* Voice Sections */}
                    <button
                      onClick={() => onNavigate('about-sections')}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/60 rounded-full transition-all cursor-pointer whitespace-nowrap backdrop-blur-xs font-source"
                    >
                      <span>{lang === 'sw' ? 'Sauti za Kwaya' : 'Voice Sections'}</span>
                    </button>

                    {/* YouTube Channel */}
                    <a
                      href={YOUTUBE_CHANNEL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/95 hover:text-white underline-offset-4 hover:underline transition-colors py-1.5 px-1 cursor-pointer font-source"
                    >
                      <RealYouTubeIcon size={18} variant="badge" />
                      <span>YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white/70" />
                    </a>
                  </>
                ) : (
                  <>
                    {/* First Slide Default Buttons: Listen Now, Choir Gallery, YouTube */}
                    <button
                      onClick={() => {
                        if (currentSong.id === featuredSong.id) {
                          togglePlay();
                        } else {
                          playSong(featuredSong as Song);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#0C2340] bg-white hover:bg-[#EAF4FB] rounded-full transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
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

                    <button
                      onClick={() => onNavigate('about-gallery')}
                      className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/60 rounded-full transition-all cursor-pointer whitespace-nowrap backdrop-blur-xs"
                    >
                      <span>{lang === 'sw' ? 'Picha za Kwaya' : 'Choir Gallery'}</span>
                    </button>

                    <a
                      href={YOUTUBE_CHANNEL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/95 hover:text-white underline-offset-4 hover:underline transition-colors py-1.5 px-1 cursor-pointer"
                    >
                      <RealYouTubeIcon size={18} variant="badge" />
                      <span>{lang === 'sw' ? 'Tazama YouTube' : 'YouTube Channel'}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white/70" />
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {/* Small Tappable Dots at Bottom Left (5 dots on desktop, 3 on phones) */}
        <div 
          className="absolute bottom-4 sm:bottom-6 left-6 sm:left-12 lg:left-16 z-30 flex items-center gap-2"
          role="tablist"
          aria-label={lang === 'sw' ? 'Picha za mandhari ya kwaya' : 'Choir hero photo slides'}
        >
          {activeSlides.map((slide, idx) => {
            const isDotActive = idx === currentSlideIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                role="tab"
                aria-selected={isDotActive}
                className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7EC8F0] ${
                  isDotActive
                    ? 'w-7 h-2.5 bg-[#7EC8F0] shadow-md shadow-sky-950/40'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Photo ${idx + 1} of ${activeSlides.length}: ${slide.description}`}
                title={slide.description}
              />
            );
          })}
        </div>
      </section>

      {/* Site Announcement Notice (Controlled via Admin) */}
      {siteNotice?.enabled && (
        <aside 
          aria-label={lang === 'sw' ? 'Tangazo Rasmi la Kwaya' : 'Official Choir Announcement'}
          className="bg-[#0C2340] text-white border-b border-[#7EC8F0]/30 py-2.5 px-4 sm:px-6 relative z-10"
        >
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-source">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider shrink-0 ${
                siteNotice.type === 'urgent' ? 'bg-rose-500 text-white' : siteNotice.type === 'feast' ? 'bg-amber-400 text-slate-900' : 'bg-[#1058A8] text-white'
              }`}>
                {lang === 'sw' ? (siteNotice.badgeSw || 'Tangazo') : (siteNotice.badgeEn || 'Notice')}
              </span>
              <p className="font-medium text-white/95 truncate">
                {lang === 'sw' ? siteNotice.textSw : siteNotice.textEn}
              </p>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-[#7EC8F0] hover:text-white font-semibold text-xs flex items-center gap-1 cursor-pointer underline shrink-0"
            >
              <span>{lang === 'sw' ? 'Tazama Matukio' : 'View Events'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

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

              {/* Invitation to explore full About story and stats */}
              <div className="pt-3 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => onNavigate('about-story')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0C2340] hover:bg-[#1058A8] text-white text-sm font-semibold transition-all shadow-sm cursor-pointer group active:scale-95"
                >
                  <span>{lang === 'sw' ? 'Jifunze Zaidi Kuhusu Kwaya Yetu' : 'Learn More About Our Choir'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('about-leadership')}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-[#0C2340]/15 hover:bg-white text-sm font-semibold text-slate-800 transition-colors cursor-pointer"
                >
                  <span>{lang === 'sw' ? 'Walimu na Viongozi' : 'Trainers & Officials'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
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

      {/* 2b. OUR CORE VALUES */}
      <CoreValuesSection lang={lang} />

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

              <ul className="space-y-2.5 text-sm text-slate-800 font-source">
                <li className="flex items-center justify-between pb-1.5 border-b border-[#0C2340]/10">
                  <span>{massSchedule?.mass1Title || (lang === 'sw' ? 'Misa ya 1 (Asubuhi Mapema)' : '1st Mass (Dawn)')}</span>
                  <strong className="text-[#0C2340]">{massSchedule?.mass1Time || '7:00 AM'}</strong>
                </li>
                <li className="flex items-center justify-between pb-1.5 border-b border-[#0C2340]/10">
                  <span>{massSchedule?.mass2Title || (lang === 'sw' ? 'Misa ya 2 (Kiswahili)' : '2nd Mass')}</span>
                  <strong className="text-[#0C2340]">{massSchedule?.mass2Time || '8:30 AM'}</strong>
                </li>
                <li className="flex items-center justify-between pb-2 border-b border-[#0C2340]/10 bg-[#EAF4FB] p-2.5 rounded-xl border border-[#1058A8]/20">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1058A8]">
                      {massSchedule?.mass3Title || (lang === 'sw' ? 'Misa ya 3: Misa Kuu (Sunday High Mass)' : '3rd Mass: Sunday High Mass')}
                    </span>
                    <span className="text-[11px] text-[#0C2340] font-medium">
                      {lang === 'sw' 
                        ? (massSchedule?.mass3DescSw || '★ Kwaya ya Misa ya Tatu ya Mtakatifu Monika')
                        : (massSchedule?.mass3Desc || '★ St. Monica Third Mass Choir (Main Choir)')}
                    </span>
                  </div>
                  <strong className="text-base font-bold text-[#1058A8] ml-2">{massSchedule?.mass3Time || '10:00 AM'}</strong>
                </li>
                <li className="flex items-center justify-between pt-1">
                  <span>{massSchedule?.mass4Title || (lang === 'sw' ? 'Misa ya 4 (Vijana / Youth)' : '4th Mass (Youth)')}</span>
                  <strong className="text-[#0C2340]">{massSchedule?.mass4Time || '11:30 AM'}</strong>
                </li>
              </ul>

              <div className="pt-2 text-xs text-slate-700 font-source space-y-2.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#1058A8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">{choirStats?.parish || "St. Monica's Catholic Church"}</span>
                    <span className="text-slate-600 block mt-0.5">{choirStats?.churchAddress || CHOIR_STATS.churchAddress}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={choirStats?.mapsUrl || CHOIR_STATS.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1058A8] hover:underline"
                  >
                    <span>{lang === 'sw' ? 'Fungua kwenye Google Maps' : 'Open in Google Maps'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-300">·</span>
                  <a
                    href={choirStats?.mapsDirectionsUrl || CHOIR_STATS.mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#1058A8] hover:underline"
                  >
                    <span>{lang === 'sw' ? 'Maelekezo' : 'Directions'}</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

