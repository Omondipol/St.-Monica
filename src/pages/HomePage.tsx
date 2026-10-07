import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { SONGS_CATALOG, ALBUMS_CATALOG, CHOIR_STATS, PRODUCTS_CATALOG } from '../data/choirContent';
import { 
  Play, 
  Pause, 
  ArrowRight, 
  Music, 
  Heart, 
  BookOpen, 
  ShoppingBag, 
  Quote, 
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';

import choirHeroImg from '../assets/images/choir_singing_moment_1791356740170.jpg';
import hymnalImg from '../assets/images/sheet_music_hymnal_1791356751097.jpg';
import churchImg from '../assets/images/nakuru_parish_cathedral_1791356761479.jpg';
import { ChoirLogo } from '../components/ChoirLogo';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { currentSong, isPlaying, playSong, formatPrice, addToCart, setIsBookingOpen, lang } = useChoir();

  const latestAlbum = ALBUMS_CATALOG[0];

  return (
    <div className="space-y-16 sm:space-y-20">
      
      {/* 1. HERO BANNER (Bug 1, 2, 7 & Anti-template fixes) */}
      <section className="relative rounded-3xl overflow-hidden min-h-[calc(100vh-5rem-7rem)] lg:min-h-[calc(100dvh-5rem-7.5rem)] flex flex-col justify-end p-6 sm:p-12 border border-[#0C2340]/20 shadow-xl">
        <img
          src={choirHeroImg}
          alt="St. Monica Choir Nakuru in Concert"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Contrast scrim: dark left gradient + dark overall wash ensures absolute text legibility over choir member faces (Bug 7 fixed) */}
        <div className="absolute inset-0 bg-[#0C2340]/50" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0C2340] via-[#0C2340]/90 to-transparent/30" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0C2340] via-transparent to-black/30" />

        <div className="relative z-10 max-w-3xl space-y-4">
          {/* Official Choir Crest Badge with verified parish information */}
          <div className="flex items-center gap-3">
            <ChoirLogo 
              size={54} 
              className="ring-2 ring-[#7EC8F0]/80 shadow-md shrink-0 cursor-pointer hover:scale-105 transition-transform" 
              interactive={true} 
            />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#7EC8F0] font-source">
                {lang === 'sw' 
                  ? 'Parokia ya Mtakatifu Monica, Section 58 Nakuru · Jimbo Katoliki la Nakuru (Tangu 2012)'
                  : 'St. Monica Catholic Parish, Section 58 Nakuru · Diocese of Nakuru (Est. 2012)'}
              </span>
              <span className="text-[10px] text-[#7EC8F0]/90 font-mono tracking-wider">
                {lang === 'sw' ? 'NGAO RASMI YA KWAYA · BONYEZA KUTAZAMA KWA KINA' : 'OFFICIAL CHOIR SEAL · CLICK TO INSPECT HERALDRY'}
              </span>
            </div>
          </div>

          <h1 className="font-fraunces text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-[1.12] text-balance">
            {lang === 'sw' 
              ? 'Kwaya ya Mtakatifu Monica Nakuru'
              : 'St. Monica Catholic Choir Nakuru'}
          </h1>

          <p className="font-source text-xs sm:text-sm md:text-base text-white/90 max-w-xl leading-relaxed">
            {lang === 'sw'
              ? 'Tunahudumu katika Parokia ya Section 58, Jimbo Katoliki la Nakuru tangu 2012. Tukiwa na sauti nne (SATB) zenye nidhamu, tunainua sala ya Misa Takatifu na matukio ya kijimbo kupitia nyimbo za kiliturujia za Kiswahili na Kilatini, ikiwemo wimbo wetu maalum "Mtakatifu Monica Mama Mwema".'
              : 'Serving Section 58 Parish in the Catholic Diocese of Nakuru since 2012. With disciplined four-part SATB polyphony, we elevate Sunday Holy Mass and sacraments through reverent Kiswahili and Latin hymnody, including our signature anthem "Mtakatifu Monica Mama Mwema".'}
          </p>

          {/* Three clear buttons sitting completely above the audio player (Bug 2 & 7 fixed) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
            {/* Button 1: Listen now */}
            <button
              onClick={() => playSong(SONGS_CATALOG[0])}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-[#0C2340] bg-white hover:bg-[#EAF4FB] rounded-full transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {isPlaying && currentSong.id === SONGS_CATALOG[0].id ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>{lang === 'sw' ? 'Sitisha Wimbo' : 'Pause Preview'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>{lang === 'sw' ? 'Sikiliza Sasa' : 'Listen now'}</span>
                </>
              )}
            </button>

            {/* Button 2: Join the choir */}
            <button
              onClick={() => onNavigate('members')}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-white bg-white/15 hover:bg-white/25 backdrop-blur-xs rounded-full border border-white/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <Users className="w-4 h-4 text-[#7EC8F0]" />
              <span>{lang === 'sw' ? 'Jiunge Nasi' : 'Join the choir'}</span>
            </button>

            {/* Button 3: Mass schedule */}
            <button
              onClick={() => onNavigate('music-planner')}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-white bg-white/15 hover:bg-white/25 backdrop-blur-xs rounded-full border border-white/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 text-[#7EC8F0]" />
              <span>{lang === 'sw' ? 'Ratiba ya Misa' : 'Mass schedule'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. WELCOME & QUICK METRICS SUMMARY */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
              {lang === 'sw' ? 'PAROKIA YA SEC 58 NAKURU' : 'SECTION 58 PARISH NAKURU'}
            </span>
            <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Muziki Mtakatifu: Sala Yetu Hekaluni' : 'Sacred Music: Our Living Prayer'}
            </h2>
          </div>

          <p className="text-sm text-[#0C2340]/80 font-source leading-relaxed">
            {lang === 'sw'
              ? 'Kwaya ya Mtakatifu Monica iliasisiwa mwaka 2012 na waimbaji waanzilishi kumi na wanne. Leo hii, inajumuisha waimbaji zaidi ya hamsini wanaotumikia altare ya Mungu kila juma. Hatutazamii muziki kama biashara bali kama chombo cha kuinua sala na utakatifu wa waamini.'
              : 'Founded in 2012 with fourteen pioneer choristers, St. Monica Choir now comprises over fifty vocalists serving the altar of God every week. We approach music not merely as performance, but as a consecrated vehicle to elevate liturgical devotion and prayer.'}
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-[#EAF4FB] rounded-xl border border-[#7EC8F0]/30 text-center">
              <span className="tabular-numbers text-2xl font-bold font-fraunces text-[#1058A8]">{CHOIR_STATS.membersCount}</span>
              <span className="text-xs text-[#0C2340]/70 block mt-0.5">{lang === 'sw' ? 'Waimbaji (SATB)' : 'Active Choristers'}</span>
            </div>
            <div className="p-3 bg-[#EAF4FB] rounded-xl border border-[#7EC8F0]/30 text-center">
              <span className="tabular-numbers text-2xl font-bold font-fraunces text-[#0C2340]">{CHOIR_STATS.yearsServing}</span>
              <span className="text-xs text-[#0C2340]/70 block mt-0.5">{lang === 'sw' ? 'Miaka SEC 58' : 'Years Serving'}</span>
            </div>
            <div className="p-3 bg-[#EAF4FB] rounded-xl border border-[#7EC8F0]/30 text-center">
              <span className="tabular-numbers text-2xl font-bold font-fraunces text-[#1058A8]">{CHOIR_STATS.repertoireCount}+</span>
              <span className="text-xs text-[#0C2340]/70 block mt-0.5">{lang === 'sw' ? 'Nyimbo za Kwaya' : 'Hymns & Scores'}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('about-story')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1058A8] hover:underline cursor-pointer"
            >
              <span>{lang === 'sw' ? 'Soma historia yote ya kwaya na kuanzishwa kwake' : 'Read the complete history and milestones'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 aspect-4/3 rounded-xl overflow-hidden border border-[#0C2340]/10 shadow-sm">
          <img
            src={churchImg}
            alt="St. Monica Parish Church in Nakuru"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* 3. LATEST ALBUM SPOTLIGHT */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 aspect-square rounded-xl bg-[#EAF4FB] border border-[#7EC8F0]/30 flex items-center justify-center relative overflow-hidden">
            <img
              src={choirHeroImg}
              alt={latestAlbum.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-3 left-3 bg-[#1058A8] text-white font-bold text-[10px] px-2.5 py-1 rounded">
              {lang === 'sw' ? 'Albamu Mpya 2026' : 'New Release 2026'}
            </span>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#1058A8] uppercase font-mono">
                {lang === 'sw' ? 'TOLEO RASMI LA STUDIO (VOL. III)' : 'OFFICIAL STUDIO RELEASE (VOL. III)'}
              </span>
              <h3 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
                {latestAlbum.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#0C2340]/80 font-source leading-relaxed">
              {lang === 'sw' ? latestAlbum.descriptionSw : latestAlbum.description}
            </p>

            <div className="p-4 bg-[#EAF4FB] rounded-xl border border-[#7EC8F0]/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0C2340] block">{SONGS_CATALOG[0].title}</span>
                <span className="text-[11px] text-[#0C2340]/60">{SONGS_CATALOG[0].composer} · SATB</span>
              </div>
              <button
                onClick={() => playSong(SONGS_CATALOG[0])}
                className="w-9 h-9 rounded-full bg-[#1058A8] text-white flex items-center justify-center cursor-pointer hover:bg-[#0C2340]"
                aria-label="Play song preview"
              >
                {isPlaying && currentSong.id === SONGS_CATALOG[0].id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => addToCart(PRODUCTS_CATALOG[0])}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'sw' ? `Nunua Albamu (${formatPrice(latestAlbum.priceKes)})` : `Buy Album (${formatPrice(latestAlbum.priceKes)})`}</span>
              </button>
              <button
                onClick={() => onNavigate('music-albums')}
                className="px-4 py-2.5 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                {lang === 'sw' ? 'Tazama Albamu Zote' : 'View All Albums'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPLORE OUR PORTAL CARDS */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
            {lang === 'sw' ? 'GUNDUA KURASA ZA KWAYA (EXPLORE)' : 'EXPLORE OUR MINISTRY'}
          </span>
          <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340] mt-1">
            {lang === 'sw' ? 'Gundua Utume na Huduma Zetu' : 'Explore Choral Services & Music'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Repertoire Browser */}
          <button
            onClick={() => onNavigate('music-repertoire')}
            className="text-left p-5 bg-white border border-[#0C2340]/10 rounded-2xl hover:border-[#1058A8] transition-all space-y-3 shadow-2xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#1058A8] flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <h4 className="font-fraunces text-lg font-bold text-[#0C2340] group-hover:text-[#1058A8] transition-colors">
              {lang === 'sw' ? 'Hifadhi ya Nyimbo' : 'Repertoire Catalog'}
            </h4>
            <p className="text-xs text-[#0C2340]/70 font-source leading-relaxed">
              {lang === 'sw'
                ? 'Tafuta nyimbo kulingana na msimu wa kiliturujia, sehemu ya Misa, na noti za sauti nne (SATB).'
                : 'Filter hymns by liturgical season, Mass parts, vocal voicing, and download sheet music.'}
            </p>
            <div className="text-xs font-bold text-[#1058A8] flex items-center gap-1 pt-1">
              <span>{lang === 'sw' ? 'Fungua Nyimbo' : 'Browse Repertoire'}</span> <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Mass Planner */}
          <button
            onClick={() => onNavigate('music-planner')}
            className="text-left p-5 bg-white border border-[#0C2340]/10 rounded-2xl hover:border-[#1058A8] transition-all space-y-3 shadow-2xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#1058A8] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-fraunces text-lg font-bold text-[#0C2340] group-hover:text-[#1058A8] transition-colors">
              {lang === 'sw' ? 'Mpangaji wa Misa' : 'Sunday Mass Planner'}
            </h4>
            <p className="text-xs text-[#0C2340]/70 font-source leading-relaxed">
              {lang === 'sw'
                ? 'Zana ya bure kwa walimu wa kwaya kupanga nyimbo za Jumapili na kuchapisha kijitabu cha PDF.'
                : 'Free utility for parish choirmasters to organize Sunday hymns and export a one-page programme PDF.'}
            </p>
            <div className="text-xs font-bold text-[#1058A8] flex items-center gap-1 pt-1">
              <span>{lang === 'sw' ? 'Panga Misa' : 'Plan Sunday Mass'}</span> <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Weddings */}
          <button
            onClick={() => onNavigate('services-weddings')}
            className="text-left p-5 bg-white border border-[#0C2340]/10 rounded-2xl hover:border-[#1058A8] transition-all space-y-3 shadow-2xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#1058A8] flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <h4 className="font-fraunces text-lg font-bold text-[#0C2340] group-hover:text-[#1058A8] transition-colors">
              {lang === 'sw' ? 'Misa za Harusi' : 'Catholic Weddings'}
            </h4>
            <p className="text-xs text-[#0C2340]/70 font-source leading-relaxed">
              {lang === 'sw'
                ? 'Uimbaji maalum wa sauti nne (SATB) na mashauriano ya nyimbo kwa ajili ya Ndoa Takatifu.'
                : 'Elevate your holy matrimony with reverent SATB accompaniment and custom hymn consultations.'}
            </p>
            <div className="text-xs font-bold text-[#1058A8] flex items-center gap-1 pt-1">
              <span>{lang === 'sw' ? 'Tazama Harusi' : 'Explore Weddings'}</span> <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 4: SATB Vocal Sections */}
          <button
            onClick={() => onNavigate('about-sections')}
            className="text-left p-5 bg-white border border-[#0C2340]/10 rounded-2xl hover:border-[#1058A8] transition-all space-y-3 shadow-2xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#1058A8] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#1058A8]" />
            </div>
            <h4 className="font-fraunces text-lg font-bold text-[#0C2340] group-hover:text-[#1058A8] transition-colors">
              {lang === 'sw' ? 'Sauti Nne (SATB)' : 'SATB Voice Sections'}
            </h4>
            <p className="text-xs text-[#0C2340]/70 font-source leading-relaxed">
              {lang === 'sw'
                ? 'Sikiliza sampuli za sauti za Soprano, Alto, Tenor, na Bass zilizorekodiwa na makocha wetu.'
                : 'Audition isolated voice demos for Soprano, Alto, Tenor, and Bass recorded by section leaders.'}
            </p>
            <div className="text-xs font-bold text-[#1058A8] flex items-center gap-1 pt-1">
              <span>{lang === 'sw' ? 'Sikiliza Sauti' : 'Listen to Sections'}</span> <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* 5. CHOIRMASTER'S SIGNED GREETING (Human content requirement) */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0E56A6] uppercase tracking-wider font-mono">
              <Quote className="w-4 h-4" />
              <span>{lang === 'sw' ? 'UJUMBE KUTOKA KWA MWALIMU WA KWAYA' : 'NOTE FROM THE CHOIRMASTER'}</span>
            </div>

            <h3 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Nidhamu ya Sauti na Utakatifu wa Sala' : 'Vocal Discipline in Service of Sacred Prayer'}
            </h3>

            <p className="text-xs sm:text-sm text-[#0C2340]/80 font-source leading-relaxed">
              {lang === 'sw'
                ? '"Karibu sana kwenye jukwaa la Kwaya ya Mtakatifu Monica, Parokia ya Section 58 Nakuru. Tangu kuanzishwa kwetu mwaka 2012, kanuni yetu kuu imekuwa kwamba uimbaji wa kiliturujia si mashindano wala burudani ya kidunia, bali ni sala takatifu inayowekwa mbele ya Altare ya Mungu. Tunapofanya mazoezi ya sauti nne—Soprano, Alto, Tenor, na Bass—kila noti inalenga kuinua roho ya muumini kuelekea kwa Muumba. Tunawashukuru waamini wote kwa maombi na upendo wao."'
                : '"Welcome to the home of St. Monica Catholic Choir Nakuru. Since our inception in 2012, our guiding conviction has been that sacred music is not secular entertainment, but prayer elevated in holy reverence before the altar of God. When we rehearse our four vocal sections, every breath and cadence is crafted to draw the congregation into deeper contemplative communion. We are grateful for your prayers and continued fellowship."'}
            </p>

            {/* Choirmaster sign-off with calligraphic signature */}
            <div className="pt-2 flex items-center justify-between border-t border-[#0C2340]/10">
              <div>
                <strong className="text-sm font-bold text-[#0C2340] font-fraunces block">
                  Polycarp Ochieng
                </strong>
                <span className="text-xs text-[#0C2340]/60 font-source block">
                  {lang === 'sw' ? 'Mwalimu Mkuu wa Kwaya na Mtunzi, SEC 58 Nakuru' : 'Choirmaster & Resident Composer, SEC 58 Nakuru'}
                </span>
              </div>
              <div className="font-serif italic text-lg sm:text-xl text-[#0E56A6] font-bold select-none pr-4">
                ~ P. Ochieng ~
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#FAF8F5] rounded-xl p-6 border border-[#0C2340]/10 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1058A8] font-mono block">
              {lang === 'sw' ? 'KANUNI ZA KWAYA YETU' : 'OUR SACRED PILLARS'}
            </span>
            <ul className="text-xs text-[#0C2340]/80 space-y-2 font-source">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E56A6]" />
                <span>{lang === 'sw' ? 'Nidhamu ya solfa na wakati wa mazoezi' : 'Faithful tonic solfa & staff literacy'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E56A6]" />
                <span>{lang === 'sw' ? 'Unyenyekevu mbele ya Altare Takatifu' : 'Reverence before the Holy Altar'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E56A6]" />
                <span>{lang === 'sw' ? 'Upatanisho halisi wa sauti nne (SATB)' : 'Disciplined four-part SATB harmony'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E56A6]" />
                <span>{lang === 'sw' ? 'Kujitolea bila masharti katika Misa' : 'Voluntary selfless service in liturgy'}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. OCCASIONAL TESTIMONIALS (Weddings, Patronal Feast, Liturgy) */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#0E56A6] uppercase tracking-wider font-mono">
            {lang === 'sw' ? 'USHUHUDA WA MATUKIO (TESTIMONIALS)' : 'COMMUNITY TESTIMONIALS'}
          </span>
          <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340] mt-1">
            {lang === 'sw' ? 'Sauti Zao Katika Matukio ya Parokia' : 'Witness of Parishioners & Couples'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1: Parish Priest */}
          <div className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-[#0C2340]/80 italic font-source leading-relaxed">
              {lang === 'sw'
                ? '"Kwaya ya Mtakatifu Monica huinua mioyo yetu kila Jumapili hekaluni. Sauti zao za nidhamu na uchaji wa Mungu huweka anga halisi ya sala na utakatifu katika Parokia yetu ya SEC 58 Nakuru."'
                : '"St. Monica Choir elevates our hearts every single Sunday. Their vocal discipline and spiritual reverence create a sacred atmosphere that draws the whole congregation closer to God."'}
            </p>
            <div className="border-t border-[#0C2340]/10 pt-3">
              <strong className="text-sm font-bold text-[#0C2340] block font-fraunces">Fr. Anthony Mwangi</strong>
              <span className="text-[11px] text-[#0E56A6] font-medium block">
                {lang === 'sw' ? 'Padri Mkuu wa Parokia · Misa za Jumapili' : 'Parish Priest · Sunday High Mass'}
              </span>
            </div>
          </div>

          {/* Testimonial 2: Wedding Couple */}
          <div className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-[#0C2340]/80 italic font-source leading-relaxed">
              {lang === 'sw'
                ? '"Uimbaji wao wakati wa harusi yetu ya kikatoliki ulikuwa wa kimbinguni. Wageni wetu wote waliguswa na namna sauti nne zilivyopangwa kwa utaratibu na utulivu."'
                : '"Their singing during our Catholic wedding nuptial Mass was truly heavenly. Every hymn was rendered with perfect dignity that brought sacred tears of joy to our families."'}
            </p>
            <div className="border-t border-[#0C2340]/10 pt-3">
              <strong className="text-sm font-bold text-[#0C2340] block font-fraunces">Joseph & Christine Kamau</strong>
              <span className="text-[11px] text-rose-600 font-medium block">
                {lang === 'sw' ? 'Misa ya Ndoa Takatifu · Desemba 2025' : 'Holy Matrimony Nuptial Mass · Dec 2025'}
              </span>
            </div>
          </div>

          {/* Testimonial 3: CWA Leader */}
          <div className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-[#0C2340]/80 italic font-source leading-relaxed">
              {lang === 'sw'
                ? '"Wimbo wa Mtakatifu Monica Mama Mwema uliotungwa na Polycarp ni alama ya mama yetu mwenye sala. Tunajivunia kwaya yetu katika Jimbo lote la Nakuru."'
                : '"The patronal anthem composed by Polycarp resonates deeply in every Christian mother’s heart. We are immensely proud of our choir representing our parish with grace."'}
            </p>
            <div className="border-t border-[#0C2340]/10 pt-3">
              <strong className="text-sm font-bold text-[#0C2340] block font-fraunces">Mama Bernadette Nyambura</strong>
              <span className="text-[11px] text-[#0E56A6] font-medium block">
                {lang === 'sw' ? 'Mwenyekiti wa CWA · Sikukuu ya Somo (27 Agosti)' : 'CWA Leader · Patronal Feast Day (27 Aug)'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
