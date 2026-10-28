import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { 
  CHOIR_STATS, 
  YOUTUBE_CHANNEL_URL, 
  YOUTUBE_CHANNEL_HANDLE 
} from '../data/choirContent';
import { ChoirLogo } from './ChoirLogo';
import { 
  Mail, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  ArrowUp,
  Clock,
  Compass
} from 'lucide-react';

interface ChoirFooterProps {
  onNavigate: (route: string) => void;
}

export const ChoirFooter: React.FC<ChoirFooterProps> = ({ onNavigate }) => {
  const { lang, footerContact, choirStats, massesList, massSchedule } = useChoir();

  // Collapsible accordion sections for phone screens (closed by default)
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const [mobileContactOpen, setMobileContactOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentRehearsalEn = (
    footerContact?.rehearsalsEn || 
    massSchedule?.rehearsals || 
    choirStats?.rehearsalSchedule || 
    'Wednesdays & Fridays: 5:30 PM – 7:30 PM (Parish Hall)'
  ).trim();

  const currentRehearsalSw = (
    footerContact?.rehearsalsSw || 
    massSchedule?.rehearsalsSw || 
    choirStats?.rehearsalScheduleSw || 
    'Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku (Ukumbi wa Parokia)'
  ).trim();

  // If text already begins with "Rehearsals" or "Mazoezi", use directly; otherwise format cleanly
  const rehearsalInvitationTextEn = currentRehearsalEn.toLowerCase().startsWith('rehearsal')
    ? currentRehearsalEn
    : `Rehearsals: ${currentRehearsalEn}`;

  const rehearsalInvitationTextSw = currentRehearsalSw.toLowerCase().startsWith('mazoezi')
    ? currentRehearsalSw
    : `Mazoezi ya kwaya: ${currentRehearsalSw}`;

  const whatsappUrl = footerContact?.whatsapp || choirStats?.whatsappUrl || CHOIR_STATS.whatsappUrl;

  return (
    <footer 
      aria-label="Choir Page Footer"
      className="w-full bg-[#0C2340] text-slate-200 border-t border-sky-400/20 pt-16 pb-2"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* STEP 2: TOP INVITATION BAND */}
        <section 
          aria-label="Rehearsal Invitation"
          className="rounded-3xl bg-gradient-to-r from-[#1058A8]/30 via-sky-900/20 to-[#1058A8]/30 border border-sky-400/25 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
        >
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-fraunces text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              {lang === 'sw' ? 'Imba Nasi Mtakatifu Monika' : 'Sing with us at St. Monica'}
            </h3>
            <p className="text-sm sm:text-base text-slate-200 font-source max-w-2xl leading-relaxed">
              {lang === 'sw' ? rehearsalInvitationTextSw : rehearsalInvitationTextEn}
            </p>
            <p className="text-xs sm:text-sm text-[#7EC8F0] font-source font-medium">
              {lang === 'sw' ? 'Sauti zote zinakaribishwa kwenye majaribio ya kujiunga.' : 'All voices are welcome to audition.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            {/* Green Chat on WhatsApp button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with choir on WhatsApp"
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              {/* Official WhatsApp SVG Logo */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.031 2C6.516 2 2.029 6.486 2.029 12c0 1.942.553 3.754 1.517 5.289L2 22l4.869-1.503A9.927 9.927 0 0012.031 22c5.515 0 10.002-4.486 10.002-10s-4.487-10-10.002-10zm0 18.286c-1.684 0-3.26-.466-4.609-1.272l-.33-.198-2.887.892.906-2.812-.218-.344a8.232 8.232 0 01-1.218-4.552c0-4.57 3.717-8.286 8.356-8.286 4.638 0 8.355 3.716 8.355 8.286 0 4.57-3.717 8.286-8.355 8.286zm4.582-6.197c-.251-.126-1.488-.734-1.719-.818-.231-.084-.399-.126-.567.126-.168.251-.65 1-.797 1.168-.147.168-.294.189-.545.063-.251-.126-1.061-.391-2.021-1.247-.747-.666-1.251-1.49-1.398-1.741-.147-.251-.016-.387.11-.512.113-.113.251-.294.377-.44.126-.147.168-.251.251-.419.084-.168.042-.314-.021-.44-.063-.126-.567-1.365-.777-1.87-.204-.492-.412-.425-.567-.433-.147-.008-.314-.01-.482-.01s-.44.063-.671.314c-.231.251-.881.861-.881 2.1 0 1.239.902 2.436 1.028 2.604.126.168 1.774 2.709 4.298 3.799.601.259 1.07.414 1.436.53.604.192 1.153.165 1.587.1.484-.072 1.488-.608 1.698-1.196.21-.588.21-1.092.147-1.196-.063-.105-.231-.168-.482-.294z" />
              </svg>
              <span>{lang === 'sw' ? 'Tuma Ujumbe WhatsApp' : 'Chat on WhatsApp'}</span>
            </a>

            {/* Outlined Contact Us button */}
            <button
              onClick={() => {
                onNavigate('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-2xl border border-sky-300/40 hover:bg-white/10 text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#7EC8F0]" />
              <span>{lang === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}</span>
            </button>
          </div>
        </section>

        {/* STEP 3: FOUR EVENLY SPACED COLUMNS (Desktop: Brand column has generous width to wrap onto two lines without overlapping Explore) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 text-sm font-source pt-2">
          
          {/* COLUMN 1: The Choir Identity (Takes 4 of 12 columns for generous room) */}
          <div className="lg:col-span-4 space-y-3.5 pr-2 sm:pr-4">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <ChoirLogo size={96} variant="simplified" interactive={true} className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md mt-0.5" />
              <div className="min-w-0 flex-1">
                <h4 className="font-eb-garamond text-xl sm:text-2xl font-bold text-white leading-snug break-words">
                  {lang === 'sw' ? 'Kwaya ya Misa ya Tatu · Mt. Monika' : 'St. Monica Third Mass Choir'}
                </h4>
                <span className="text-xs text-[#7EC8F0] block mt-1 font-source font-medium">
                  Section 58 Parish · Nakuru
                </span>
              </div>
            </div>

            <p className="text-[#B8C7D9] text-sm leading-relaxed font-source">
              {lang === 'sw'
                ? 'Kuongoza liturjia na sala ya parokia kupitia uimbaji mtakatifu wa sauti nne kila Dominika.'
                : 'Leading liturgical worship and parish prayer through sacred four-part choral singing.'}
            </p>
          </div>

          {/* COLUMN 2: Explore (Takes 2 of 12 columns on desktop) */}
          <div className="lg:col-span-2 border-t border-white/10 sm:border-t-0 pt-4 sm:pt-0">
            {/* Mobile Header Accordion Trigger */}
            <button
              onClick={() => setMobileExploreOpen(!mobileExploreOpen)}
              className="w-full min-h-[44px] flex sm:hidden items-center justify-between text-left cursor-pointer"
            >
              <span className="text-[14px] font-semibold text-[#7EC8F0] font-source">
                {lang === 'sw' ? 'Gundua kurasa' : 'Explore'}
              </span>
              {mobileExploreOpen ? <ChevronUp className="w-4 h-4 text-[#7EC8F0]" /> : <ChevronDown className="w-4 h-4 text-[#7EC8F0]" />}
            </button>

            {/* Desktop Section Heading */}
            <span className="hidden sm:block text-[14px] font-semibold text-[#7EC8F0] font-source mb-3">
              {lang === 'sw' ? 'Gundua kurasa' : 'Explore'}
            </span>

            {/* Links list: Directory, Songs, Our Album, Music Library, Choir Sheet Music, Gallery, Events */}
            <ul className={`space-y-2.5 text-slate-300 text-sm ${mobileExploreOpen ? 'block pt-2' : 'hidden sm:block'}`}>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('about-sections');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="min-h-[44px] sm:min-h-0 flex items-center text-slate-300 hover:text-white transition-colors cursor-pointer text-sm"
                >
                  {lang === 'sw' ? 'Orodha ya Waimbaji' : 'Directory'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('music-repertoire');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="min-h-[44px] sm:min-h-0 flex items-center text-slate-300 hover:text-white transition-colors cursor-pointer text-sm"
                >
                  {lang === 'sw' ? 'Nyimbo Zetu' : 'Songs'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('music-albums');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="min-h-[44px] sm:min-h-0 flex items-center text-slate-300 hover:text-white transition-colors cursor-pointer text-sm"
                >
                  {lang === 'sw' ? 'Albamu Yetu' : 'Our Album'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('music-library');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="min-h-[44px] sm:min-h-0 flex items-center text-slate-300 hover:text-white transition-colors cursor-pointer text-sm"
                >
                  {lang === 'sw' ? 'Maktaba ya Noti' : 'Music Library'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="min-h-[44px] sm:min-h-0 flex items-center text-slate-300 hover:text-white transition-colors cursor-pointer text-sm"
                >
                  {lang === 'sw' ? 'Noti za Kwaya' : 'Choir Sheet Music'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('about-gallery');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="min-h-[44px] sm:min-h-0 flex items-center text-slate-300 hover:text-white transition-colors cursor-pointer text-sm"
                >
                  {lang === 'sw' ? 'Picha za Kwaya' : 'Gallery'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('events');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="min-h-[44px] sm:min-h-0 flex items-center text-slate-300 hover:text-white transition-colors cursor-pointer text-sm"
                >
                  {lang === 'sw' ? 'Matukio na Kalenda' : 'Events'}
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Service Times (Takes 3 of 12 columns) */}
          <div className="lg:col-span-3 border-t border-white/10 sm:border-t-0 pt-4 sm:pt-0">
            {/* Mobile Header Accordion Trigger */}
            <button
              onClick={() => setMobileServiceOpen(!mobileServiceOpen)}
              className="w-full min-h-[44px] flex sm:hidden items-center justify-between text-left cursor-pointer"
            >
              <span className="text-[14px] font-semibold text-[#7EC8F0] font-source">
                {lang === 'sw' ? 'Ratiba ya ibada' : 'Service times'}
              </span>
              {mobileServiceOpen ? <ChevronUp className="w-4 h-4 text-[#7EC8F0]" /> : <ChevronDown className="w-4 h-4 text-[#7EC8F0]" />}
            </button>

            {/* Desktop Section Heading */}
            <span className="hidden sm:block text-[14px] font-semibold text-[#7EC8F0] font-source mb-3">
              {lang === 'sw' ? 'Ratiba ya ibada' : 'Service times'}
            </span>

            <div className={`space-y-3 text-sm text-[#B8C7D9] ${mobileServiceOpen ? 'block pt-2' : 'hidden sm:block'}`}>
              {massesList && massesList.length > 0 ? (
                massesList.slice(0, 3).map((m) => (
                  <div key={m.id}>
                    <strong className="text-white block font-medium">
                      {lang === 'sw' ? (m.titleSw || m.title) : m.title}
                    </strong>
                    <span className="text-[#B8C7D9] text-xs tabular-nums">
                      {m.time} {m.isSungMass ? (lang === 'sw' ? '(Misa Inayoimbwa)' : '(Sung Mass)') : ''}
                    </span>
                  </div>
                ))
              ) : (
                <div>
                  <strong className="text-white block font-medium">3rd Mass (Sunday Sung Mass)</strong>
                  <span className="text-[#B8C7D9] text-xs tabular-nums">10:00 AM (Section 58 Sanctuary)</span>
                </div>
              )}
              <div>
                <strong className="text-white block font-medium">{lang === 'sw' ? 'Mazoezi ya Kwaya' : 'Choir Rehearsals'}</strong>
                <span className="text-[#B8C7D9] text-xs tabular-nums">
                  {lang === 'sw' 
                    ? (footerContact?.rehearsalsSw || massSchedule?.rehearsalsSw || "Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku") 
                    : (footerContact?.rehearsalsEn || massSchedule?.rehearsals || "Wed & Fri: 5:30 PM – 7:30 PM")}
                </span>
              </div>
              <div>
                <strong className="text-white block font-medium">Patronal Feast of St. Monica, 27 August</strong>
                <span className="text-[#B8C7D9] text-xs">{lang === 'sw' ? 'Sikukuu ya Patron ya Mtakatifu Monika' : 'Parish Patronal Mass'}</span>
              </div>
            </div>
          </div>

          {/* COLUMN 4: Contact & Location (Takes 3 of 12 columns) */}
          <div className="lg:col-span-3 border-t border-white/10 sm:border-t-0 pt-4 sm:pt-0">
            {/* Mobile Header Accordion Trigger */}
            <button
              onClick={() => setMobileContactOpen(!mobileContactOpen)}
              className="w-full min-h-[44px] flex sm:hidden items-center justify-between text-left cursor-pointer"
            >
              <span className="text-[14px] font-semibold text-[#7EC8F0] font-source">
                {lang === 'sw' ? 'Mawasiliano' : 'Contact'}
              </span>
              {mobileContactOpen ? <ChevronUp className="w-4 h-4 text-[#7EC8F0]" /> : <ChevronDown className="w-4 h-4 text-[#7EC8F0]" />}
            </button>

            {/* Desktop Section Heading */}
            <span className="hidden sm:block text-[14px] font-semibold text-[#7EC8F0] font-source mb-3">
              {lang === 'sw' ? 'Mawasiliano' : 'Contact'}
            </span>

            <div className={`space-y-3 text-sm text-slate-300 ${mobileContactOpen ? 'block pt-2' : 'hidden sm:block'}`}>
              <div>
                <span className="block text-white font-medium">{choirStats?.parish || "St. Monica's Catholic Church"}</span>
                <span className="text-slate-300 text-xs block">{footerContact?.churchAddress || choirStats?.churchAddress || CHOIR_STATS.churchAddress}</span>
                <a 
                  href={footerContact?.mapsUrl || choirStats?.mapsUrl || CHOIR_STATS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#7EC8F0] hover:text-white font-semibold transition-colors mt-1"
                >
                  <span>{lang === 'sw' ? 'Fungua kwenye Google Maps' : 'View on Google Maps'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Email Address</span>
                <a 
                  href={`mailto:${footerContact?.email || choirStats?.email || CHOIR_STATS.email}`}
                  className="text-slate-200 hover:text-white transition-colors text-xs font-medium"
                >
                  {footerContact?.email || choirStats?.email || CHOIR_STATS.email}
                </a>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Phone & WhatsApp</span>
                <div className="flex items-center gap-2 pt-0.5">
                  <a 
                    href={`tel:${(footerContact?.phone || choirStats?.phone || CHOIR_STATS.phone).replace(/\s+/g, '')}`}
                    className="text-sky-300 hover:text-white transition-colors text-xs font-semibold"
                    title="Call Parish Office / Choirmaster"
                  >
                    {footerContact?.phone || choirStats?.phone || CHOIR_STATS.phone}
                  </a>
                  <span className="text-slate-500">·</span>
                  <a 
                    href={footerContact?.whatsapp || choirStats?.whatsappUrl || CHOIR_STATS.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:text-emerald-300 transition-colors text-xs font-bold"
                    title="Chat on WhatsApp"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* STEP 4: SAINT MONICA PRAYER WITH CURLY QUOTATION MARKS & CLEAR 44PX SOCIAL ICONS */}
        <div className="pt-10 pb-2 border-t border-white/10 flex flex-col items-center space-y-6">
          <p className="font-fraunces italic text-center text-sm sm:text-base text-sky-200/95 max-w-2xl px-4 leading-relaxed">
            {lang === 'sw' 
              ? '“Ee Mtakatifu Monika, mama mwenye machozi na sala isiyokoma, utuombee kwa Mungu.”'
              : '“O Saint Monica, mother of tears and unceasing prayer, intercede for us before God.”'}
          </p>

          {/* Large 44px real brand social icons with explicit tooltips */}
          <div className="flex items-center justify-center gap-4">
            
            {/* Real YouTube Icon & Link - Site Blue */}
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Official YouTube Channel: ${YOUTUBE_CHANNEL_HANDLE}`}
              title={`Watch on YouTube (${YOUTUBE_CHANNEL_HANDLE})`}
              className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-[#1058A8]/20 hover:bg-[#1058A8] border border-[#1058A8]/40 hover:border-[#7EC8F0] flex items-center justify-center text-[#7EC8F0] hover:text-white transition-all shadow-md group cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* Real WhatsApp Icon & Link */}
            <a
              href={CHOIR_STATS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Direct WhatsApp Message"
              title="Chat with Choir on WhatsApp (+254 722 845 291)"
              className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-[#25D366]/15 hover:bg-[#25D366] border border-emerald-500/30 hover:border-emerald-500 flex items-center justify-center text-[#25D366] hover:text-white transition-all shadow-md group cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.031 2C6.516 2 2.029 6.486 2.029 12c0 1.942.553 3.754 1.517 5.289L2 22l4.869-1.503A9.927 9.927 0 0012.031 22c5.515 0 10.002-4.486 10.002-10s-4.487-10-10.002-10zm0 18.286c-1.684 0-3.26-.466-4.609-1.272l-.33-.198-2.887.892.906-2.812-.218-.344a8.232 8.232 0 01-1.218-4.552c0-4.57 3.717-8.286 8.356-8.286 4.638 0 8.355 3.716 8.355 8.286 0 4.57-3.717 8.286-8.355 8.286zm4.582-6.197c-.251-.126-1.488-.734-1.719-.818-.231-.084-.399-.126-.567.126-.168.251-.65 1-.797 1.168-.147.168-.294.189-.545.063-.251-.126-1.061-.391-2.021-1.247-.747-.666-1.251-1.49-1.398-1.741-.147-.251-.016-.387.11-.512.113-.113.251-.294.377-.44.126-.147.168-.251.251-.419.084-.168.042-.314-.021-.44-.063-.126-.567-1.365-.777-1.87-.204-.492-.412-.425-.567-.433-.147-.008-.314-.01-.482-.01s-.44.063-.671.314c-.231.251-.881.861-.881 2.1 0 1.239.902 2.436 1.028 2.604.126.168 1.774 2.709 4.298 3.799.601.259 1.07.414 1.436.53.604.192 1.153.165 1.587.1.484-.072 1.488-.608 1.698-1.196.21-.588.21-1.092.147-1.196-.063-.105-.231-.168-.482-.294z" />
              </svg>
            </a>

            {/* Real Google Maps Parish Pin & Link */}
            <a
              href={CHOIR_STATS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Maps Location"
              title="Open St. Monica Church in Google Maps"
              className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-sky-500/15 hover:bg-[#1058A8] border border-sky-400/30 hover:border-sky-400 flex items-center justify-center text-sky-400 hover:text-white transition-all shadow-md group cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* STEP 5: BOTTOM BAR WITH COPYRIGHT & BACK TO TOP ARROW */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8C7D9] font-source pb-24 sm:pb-28">
          <div className="text-center sm:text-left flex flex-col sm:flex-row sm:items-center gap-2">
            <span>
              {lang === 'sw'
                ? '© 2026 Kwaya ya Misa ya Tatu ya Mtakatifu Monika, Nakuru. Haki zote zimehifadhiwa.'
                : '© 2026 St. Monica Third Mass Choir, Nakuru. All rights reserved.'}
            </span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <button
              onClick={() => onNavigate('privacy')}
              className="text-[#7EC8F0] hover:text-white transition-colors cursor-pointer text-xs underline-offset-2 hover:underline"
            >
              {lang === 'sw' ? 'Sera ya Faragha' : 'Privacy Policy'}
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold"
            aria-label="Back to top"
          >
            <span>{lang === 'sw' ? 'Rudi Juu' : 'Back to top'}</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#7EC8F0]" />
          </button>
        </div>

      </div>
    </footer>
  );
};
