import React, { useState, useEffect } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Song, SheetMusicItem, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../data/choirContent';
import { 
  Play, 
  Pause, 
  ShoppingBag, 
  Search, 
  MoreVertical,
  FileText,
  Share2,
  ExternalLink
} from 'lucide-react';
import { RealYouTubeIcon } from '../components/RealYouTubeIcon';
import { AfricanGeometricBorder } from '../components/AfricanGeometricBorder';

import choirBannerImg from '../assets/images/st_monica_choir_cover_1791450290430.jpg';
import choirSingingMomentImg from '../assets/images/choir_singing_moment_1791356740170.jpg';
import scorePreviewMachozi from '../assets/images/score_preview_machozi_1791446357129.jpg';
import scorePreviewMaisha from '../assets/images/score_preview_maisha_1791446372899.jpg';
import scorePreviewNimzima from '../assets/images/score_preview_nimzima_1791446398645.jpg';
import scorePreviewJumuiya from '../assets/images/score_preview_jumuiya_1791446413261.jpg';

interface MassGroup {
  id: string;
  nameSw: string;
  nameEn: string;
  matchParts: string[];
}

const MASS_GROUPS: MassGroup[] = [
  {
    id: 'entrance',
    nameSw: 'Wimbo wa Kuingia',
    nameEn: 'Entrance',
    matchParts: ['Entrance']
  },
  {
    id: 'offertory',
    nameSw: 'Wimbo wa Matoleo',
    nameEn: 'Offertory',
    matchParts: ['Offertory']
  },
  {
    id: 'communion',
    nameSw: 'Komunyo',
    nameEn: 'Communion',
    matchParts: ['Communion']
  },
  {
    id: 'meditation',
    nameSw: 'Tafakari',
    nameEn: 'Meditation',
    matchParts: ['Meditation', 'Contemplative Prayer']
  },
  {
    id: 'recessional',
    nameSw: 'Wimbo wa Kutoka',
    nameEn: 'Recessional',
    matchParts: ['Recessional']
  }
];

export const MusicPage: React.FC = () => {
  const { 
    songs,
    sheetMusicList,
    currentSong, 
    isPlaying, 
    playSong, 
    togglePlay,
    setIsLyricsOpen, 
    addToCart, 
    formatPrice, 
    lang 
  } = useChoir();

  const [activeTab, setActiveTab] = useState<'songs' | 'sheet_music'>('songs');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSelection, setFilterSelection] = useState('all');
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);

  // Close 3-dot row menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.row-menu-container')) {
        setOpenRowMenuId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Filter songs by search and single Filter dropdown
  const filteredSongs = songs.filter((song) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      song.title.toLowerCase().includes(q) ||
      song.titleSwahili.toLowerCase().includes(q) ||
      song.composer.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterSelection === 'all') return true;

    // Mass parts
    if (filterSelection === 'entrance') return song.partOfMass.toLowerCase().includes('entrance');
    if (filterSelection === 'offertory') return song.partOfMass.toLowerCase().includes('offertory');
    if (filterSelection === 'communion') return song.partOfMass.toLowerCase().includes('communion');
    if (filterSelection === 'meditation') return song.partOfMass.toLowerCase().includes('meditation');
    if (filterSelection === 'recessional') return song.partOfMass.toLowerCase().includes('recessional');

    // Seasons
    if (filterSelection === 'ordinary') return song.season.toLowerCase().includes('ordinary');
    if (filterSelection === 'advent') return song.season.toLowerCase().includes('advent');
    if (filterSelection === 'lent') return song.season.toLowerCase().includes('lent');
    if (filterSelection === 'easter') return song.season.toLowerCase().includes('easter');
    if (filterSelection === 'christmas') return song.season.toLowerCase().includes('christmas');

    return true;
  });

  const filteredSheetMusic = sheetMusicList.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || 
      item.title.toLowerCase().includes(q) ||
      item.titleSw.toLowerCase().includes(q) ||
      item.composer.toLowerCase().includes(q);
  });

  // Featured "Song of the week" (Wimbo wa Wiki)
  const songOfTheWeek = songs[0];
  const songOfTheWeekNote = lang === 'sw' ? songOfTheWeek?.whyWeSingItSw : songOfTheWeek?.whyWeSingIt;
  const isSongOfTheWeekPlaying = currentSong.id === songOfTheWeek?.id && isPlaying;

  const getScoreImage = (id: string) => {
    if (id.includes('machozi')) return scorePreviewMachozi;
    if (id.includes('maisha')) return scorePreviewMaisha;
    if (id.includes('nimzima')) return scorePreviewNimzima;
    if (id.includes('jumuiya')) return scorePreviewJumuiya;
    return scorePreviewMachozi;
  };

  const getCleanSongCover = (song: Song) => {
    if (song.id === 'song-nimzima' || song.id === 'song-jumuiya') {
      return choirSingingMomentImg;
    }
    return choirBannerImg;
  };

  return (
    <div className="space-y-8 sm:space-y-10 max-w-5xl mx-auto">
      
      {/* ================= STEP 1 & 2: SLIM BANNER (160px) WITH QUIET YOUTUBE LINK ================= */}
      <section className="relative h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-sm select-none">
        {/* Real choir cover photo background */}
        <img 
          src={choirBannerImg} 
          alt="St. Monica Catholic Choir, Nakuru" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Soft dark gradient on the left so white text is crisp and legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/80 to-[#0C2340]/25" />

        {/* Text content inside slim banner */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' ? (
              <span>Nyimbo Zetu <span className="font-normal text-white/80 text-xl sm:text-2xl">· Our Songs</span></span>
            ) : (
              <span>Our Songs <span className="font-normal text-white/80 text-xl sm:text-2xl">· Nyimbo Zetu</span></span>
            )}
          </h1>

          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-xl leading-snug">
            {lang === 'sw'
              ? 'Nyimbo tunazoimba katika Misa ya Jumapili, zilizorekodiwa katika parokia yetu.'
              : 'Songs we sing at Sunday Mass, recorded in our parish.'}
          </p>

          {/* Quiet YouTube text link: Watch us on YouTube with channel handle (no red anywhere!) */}
          <div className="pt-1">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#7EC8F0] hover:text-white transition-colors group font-source"
              title={`Visit ${YOUTUBE_CHANNEL_HANDLE} on YouTube`}
            >
              <RealYouTubeIcon size={16} variant="monochrome" className="text-[#7EC8F0] group-hover:text-white transition-colors shrink-0" />
              <span>
                {lang === 'sw' ? 'Tazama nyimbo zetu YouTube' : 'Watch us on YouTube'}
              </span>
              <span className="text-white/60 font-normal">({YOUTUBE_CHANNEL_HANDLE})</span>
              <ExternalLink className="w-3 h-3 text-white/60 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* ================= STEP 3: "WIMBO WA WIKI" (SONG OF THE WEEK) FEATURE ================= */}
      {songOfTheWeek && songOfTheWeekNote && (
        <section className="bg-[#FAF8F5] border border-[#0C2340]/15 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#0C2340]/10 pb-2.5">
            <div>
              <span className="font-eb-garamond text-lg sm:text-xl font-bold text-[#0C2340] block leading-tight">
                {lang === 'sw' ? 'Wimbo wa Wiki' : 'Wimbo wa Wiki (Song of the Week)'}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-source block">
                {lang === 'sw' ? 'Uteuzi wa wimbo kwa ajili ya Misa' : 'Song of the Week'}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#1058A8] bg-[#1058A8]/10 px-2.5 py-0.5 rounded-full font-source">
              {lang === 'sw' ? songOfTheWeek.partOfMassSwahili : songOfTheWeek.partOfMass}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Song cover photo without burned-in text */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#0C2340]/15 bg-[#0C2340] shadow-2xs">
              <img
                src={getCleanSongCover(songOfTheWeek)}
                alt={songOfTheWeek.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Song details & choir's note */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div>
                <h3 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340] leading-tight">
                  {lang === 'sw' ? songOfTheWeek.titleSwahili : songOfTheWeek.title}
                </h3>
                <p className="text-xs text-slate-600 font-source">
                  {lang === 'sw' ? 'Mtunzi:' : 'Composer:'} <span className="font-semibold text-[#0C2340]">{songOfTheWeek.composer}</span> · {songOfTheWeek.duration}
                </p>
              </div>

              {/* Two sentences from choir about why we sing it */}
              <p className="font-eb-garamond italic text-[14px] sm:text-[15px] text-[#0C2340]/90 leading-relaxed pt-0.5">
                "{songOfTheWeekNote}"
              </p>

              {/* Actions: filled Play button and Read the lyrics text link */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    if (currentSong.id === songOfTheWeek.id) {
                      togglePlay();
                    } else {
                      playSong(songOfTheWeek);
                    }
                  }}
                  className="px-4 py-2 bg-[#1058A8] hover:bg-[#0E56A6] active:scale-95 text-white rounded-xl text-xs font-bold font-source flex items-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  {isSongOfTheWeekPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'sw' ? 'Simamisha' : 'Pause'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      <span>{lang === 'sw' ? 'Sikiliza Wimbo' : 'Play song'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    playSong(songOfTheWeek);
                    setIsLyricsOpen(true);
                  }}
                  className="text-xs font-semibold text-[#1058A8] hover:text-[#0C2340] hover:underline cursor-pointer font-source flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Soma maneno' : 'Read the lyrics'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= STEP 7: PLAIN TEXT TABS (Sentence case with thin blue underline) ================= */}
      <div className="flex items-center gap-8 border-b border-[#0C2340]/15 pb-px">
        <button
          onClick={() => setActiveTab('songs')}
          className={`pb-2.5 text-sm sm:text-base font-source cursor-pointer transition-all ${
            activeTab === 'songs'
              ? 'border-b-2 border-[#1058A8] text-[#1058A8] font-bold'
              : 'border-b-2 border-transparent text-slate-600 hover:text-[#0C2340] font-medium'
          }`}
        >
          {lang === 'sw' ? `Nyimbo (${songs.length})` : `Choir songs (${songs.length})`}
        </button>

        <button
          onClick={() => setActiveTab('sheet_music')}
          className={`pb-2.5 text-sm sm:text-base font-source cursor-pointer transition-all ${
            activeTab === 'sheet_music'
              ? 'border-b-2 border-[#1058A8] text-[#1058A8] font-bold'
              : 'border-b-2 border-transparent text-slate-600 hover:text-[#0C2340] font-medium'
          }`}
        >
          {lang === 'sw' ? `Noti (${sheetMusicList.length})` : `Sheet music for sale (${sheetMusicList.length})`}
        </button>
      </div>

      {/* ================= STEP 6: ONE SIMPLE FILTER (Search box + Filter dropdown) ================= */}
      <section className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={lang === 'sw' ? "Tafuta wimbo au mtunzi..." : "Search song title or composer..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#0C2340]/20 rounded-xl focus:outline-none focus:border-[#1058A8] bg-white text-[#0C2340] placeholder:text-slate-400 font-source shadow-2xs transition-colors"
          />
        </div>

        {/* Small dropdown called Filter + results count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-source">
            <span className="text-slate-500 font-medium">
              {lang === 'sw' ? 'Chuja:' : 'Filter:'}
            </span>
            <select
              value={filterSelection}
              onChange={(e) => setFilterSelection(e.target.value)}
              className="px-3 py-2 bg-white text-[#0C2340] border border-[#0C2340]/20 rounded-xl text-xs sm:text-sm font-source focus:outline-none focus:border-[#1058A8] cursor-pointer shadow-2xs"
            >
              <option value="all">{lang === 'sw' ? 'Nyimbo zote' : 'All songs'}</option>
              <optgroup label={lang === 'sw' ? 'Sehemu ya Misa' : 'Mass parts'}>
                <option value="entrance">Entrance</option>
                <option value="offertory">Offertory</option>
                <option value="communion">Communion</option>
                <option value="meditation">Meditation</option>
                <option value="recessional">Recessional</option>
              </optgroup>
              <optgroup label={lang === 'sw' ? 'Majira ya Kiliturujia' : 'Liturgical seasons'}>
                <option value="ordinary">Ordinary time</option>
                <option value="advent">Advent</option>
                <option value="lent">Lent</option>
                <option value="easter">Easter</option>
                <option value="christmas">Christmas</option>
              </optgroup>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-source whitespace-nowrap">
            {lang === 'sw' 
              ? `${activeTab === 'songs' ? filteredSongs.length : filteredSheetMusic.length} zimepatikana` 
              : `${activeTab === 'songs' ? filteredSongs.length : filteredSheetMusic.length} found`}
          </span>
        </div>
      </section>

      {/* ================= STEP 4, 5 & 10: PRINTED SONG INDEX ON CREAM PAPER ================= */}
      {activeTab === 'songs' && (
        <div className="space-y-8">
          {filteredSongs.length === 0 ? (
            <div className="p-10 text-center bg-[#FAF8F5] rounded-2xl border border-[#0C2340]/10 space-y-1">
              <p className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Hakuna nyimbo hapa bado. Jaribu nyingine.' : 'No songs here yet. Try another.'}
              </p>
              <p className="text-xs text-slate-500 font-source">
                {lang === 'sw' ? 'Jaribu kubadilisha neno la kutafuta au chujio.' : 'Try adjusting your search terms or filter selection.'}
              </p>
            </div>
          ) : (
            // Render groups in order: Wimbo wa Kuingia, Wimbo wa Matoleo, Komunyo, Tafakari, Wimbo wa Kutoka
            MASS_GROUPS.map((group) => {
              const groupSongs = filteredSongs.filter((song) =>
                group.matchParts.some((p) => song.partOfMass.toLowerCase().includes(p.toLowerCase()))
              );

              // Step 5: Hide any group with no songs
              if (groupSongs.length === 0) return null;

              return (
                <section 
                  key={group.id} 
                  className="bg-[#FAF8F5] border border-[#0C2340]/15 rounded-2xl overflow-hidden shadow-2xs"
                >
                  {/* Group Heading: Swahili in serif font, English beneath, thin woven border strip */}
                  <div className="px-5 pt-4 pb-2.5 bg-[#FAF8F5]">
                    <div className="flex items-baseline justify-between">
                      <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340] leading-tight">
                        {group.nameSw}
                      </h2>
                      <span className="font-source text-xs text-slate-500">
                        {group.nameEn}
                      </span>
                    </div>
                    {/* Thin woven border strip under each heading */}
                    <div className="mt-2 -mx-5">
                      <AfricanGeometricBorder />
                    </div>
                  </div>

                  {/* Songs Rows inside the printed songbook contents page */}
                  <div className="divide-y divide-[#0C2340]/10">
                    {groupSongs.map((song, songIdx) => {
                      const isThisPlaying = currentSong.id === song.id && isPlaying;
                      const globalIndex = songs.findIndex((s) => s.id === song.id) + 1;

                      return (
                        <div
                          key={song.id}
                          className="group relative p-3 sm:p-4 hover:bg-[#F4EFE6]/80 transition-colors duration-150 flex items-center justify-between gap-3 sm:gap-4 select-none"
                          style={{
                            animationDelay: `${songIdx * 50}ms`
                          }}
                        >
                          {/* Left: Number (or Animated Wave when playing) + Cover photo */}
                          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
                            {/* Large serif number (1, 2, 3...) or small animated wave when playing */}
                            <div className="w-7 sm:w-9 text-right shrink-0 flex items-center justify-end">
                              {isThisPlaying ? (
                                <div className="flex items-end justify-end gap-0.5 h-4 w-5 text-[#1058A8] shrink-0">
                                  <span className="w-1 bg-[#1058A8] rounded-full animate-bounce h-2.5 motion-reduce:animate-none" />
                                  <span className="w-1 bg-[#1058A8] rounded-full animate-bounce h-4 motion-reduce:animate-none [animation-delay:150ms]" />
                                  <span className="w-1 bg-[#1058A8] rounded-full animate-bounce h-3 motion-reduce:animate-none [animation-delay:300ms]" />
                                </div>
                              ) : (
                                <span className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]/40 group-hover:text-[#0C2340]/70 transition-colors">
                                  {globalIndex}
                                </span>
                              )}
                            </div>

                            {/* Small square cover photo */}
                            <div 
                              onClick={() => {
                                if (currentSong.id === song.id) {
                                  togglePlay();
                                } else {
                                  playSong(song);
                                }
                              }}
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 border border-[#0C2340]/15 bg-[#0C2340] cursor-pointer shadow-2xs relative"
                            >
                              <img
                                src={getCleanSongCover(song)}
                                alt={song.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          </div>

                          {/* Song Title & Composer */}
                          <div className="min-w-0 max-w-xs sm:max-w-md shrink-0">
                            <h3 
                              onClick={() => {
                                if (currentSong.id === song.id) {
                                  togglePlay();
                                } else {
                                  playSong(song);
                                }
                              }}
                              className="font-eb-garamond text-base sm:text-lg font-bold text-[#0C2340] truncate leading-tight cursor-pointer hover:text-[#1058A8] transition-colors"
                            >
                              {lang === 'sw' ? song.titleSwahili : song.title}
                            </h3>
                            <p className="font-source text-xs text-slate-600 truncate mt-0.5">
                              {song.composer}
                            </p>
                          </div>

                          {/* Thin dotted line like a book contents page */}
                          <div className="border-b border-dotted border-[#0C2340]/30 flex-1 mx-1 sm:mx-3 my-auto min-w-[12px] hidden sm:block" />

                          {/* Mass placement & duration: e.g. Meditation · 4:36 */}
                          <div className="font-source text-xs text-slate-600 shrink-0 hidden md:block whitespace-nowrap">
                            <span>{lang === 'sw' ? song.partOfMassSwahili : song.partOfMass}</span>
                            <span className="mx-1.5 text-slate-400">·</span>
                            <span className="tabular-nums font-medium text-[#0C2340]">{song.duration}</span>
                          </div>

                          {/* Right Controls: Buy Score text link + Play button + 3-dot menu */}
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            
                            {/* Buy Score as small text link with price (no large button!) */}
                            {song.sheetMusicAvailable && (
                              <button
                                onClick={() => addToCart({
                                  id: `sheet-${song.id}`,
                                  name: `Noti za ${song.title} (SATB PDF)`,
                                  nameSw: `Noti za ${song.title} (SATB PDF)`,
                                  type: 'sheet_music',
                                  priceKes: song.scorePriceKes,
                                  priceUsd: 2.50,
                                  description: `Official SATB 4-part sheet music score for ${song.title}`,
                                  descriptionSw: `Noti rasmi za sauti nne (SATB) za ${song.title}`,
                                  image: 'sheet_music_hymnal',
                                  downloadable: true
                                })}
                                className="text-xs font-semibold text-[#1058A8] hover:text-[#0C2340] hover:underline cursor-pointer font-source shrink-0"
                              >
                                {lang === 'sw' 
                                  ? `Nunua Noti (${formatPrice(song.scorePriceKes)})` 
                                  : `Buy Score (${formatPrice(song.scorePriceKes)})`}
                              </button>
                            )}

                            {/* One circular play button: slides 4px on hover */}
                            <button
                              onClick={() => {
                                if (currentSong.id === song.id) {
                                  togglePlay();
                                } else {
                                  playSong(song);
                                }
                              }}
                              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-[#1058A8] hover:bg-[#0E56A6] active:scale-90 text-white flex items-center justify-center shadow-2xs transition-all cursor-pointer group-hover:translate-x-1 motion-reduce:transform-none"
                              aria-label={isThisPlaying ? 'Pause song' : 'Play song'}
                            >
                              {isThisPlaying ? (
                                <Pause className="w-3.5 h-3.5 fill-current" />
                              ) : (
                                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                              )}
                            </button>

                            {/* Small 3-dot menu at end of row: contains YouTube, Lyrics, Share */}
                            <div className="relative row-menu-container">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenRowMenuId(openRowMenuId === song.id ? null : song.id);
                                }}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0C2340] hover:bg-[#0C2340]/10 transition-colors cursor-pointer"
                                aria-label="More options"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {openRowMenuId === song.id && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-[#0C2340]/15 py-1 z-30 text-xs font-source animate-in fade-in zoom-in-95 duration-150">
                                  {/* YouTube link */}
                                  <a
                                    href={song.youtubeUrl || YOUTUBE_CHANNEL_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setOpenRowMenuId(null)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[#0C2340] hover:bg-[#FAF8F5] transition-colors"
                                  >
                                    <RealYouTubeIcon size={14} variant="monochrome" className="text-[#1058A8]" />
                                    <span>{lang === 'sw' ? 'Tazama YouTube' : 'Watch on YouTube'}</span>
                                  </a>

                                  {/* Lyrics button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      playSong(song);
                                      setIsLyricsOpen(true);
                                      setOpenRowMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[#0C2340] hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#1058A8]" />
                                    <span>{lang === 'sw' ? 'Soma Maneno' : 'Read Lyrics'}</span>
                                  </button>

                                  {/* Share link */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard?.writeText(song.youtubeUrl || window.location.href);
                                      setOpenRowMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[#0C2340] hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer border-t border-[#0C2340]/10"
                                  >
                                    <Share2 className="w-3.5 h-3.5 text-[#1058A8]" />
                                    <span>{lang === 'sw' ? 'Nakili Kiungo' : 'Copy Link'}</span>
                                  </button>
                                </div>
                              )}
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}
        </div>
      )}

      {/* ================= TAB 2: SHEET MUSIC FOR SALE (NOTI) ================= */}
      {activeTab === 'sheet_music' && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSheetMusic.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-[#FAF8F5] border border-[#0C2340]/15 rounded-2xl hover:border-[#1058A8] transition-all shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                {/* Score Preview Image */}
                <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-[#0C2340]/10 relative group">
                  <img
                    src={getScoreImage(item.id)}
                    alt={`${item.title} Score Preview`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-white tracking-widest bg-[#0C2340]/60 px-2 py-0.5 rounded font-source">
                      PREVIEW
                    </span>
                  </div>
                </div>

                {/* Song name ONLY as title */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-eb-garamond text-base font-bold text-[#0C2340] leading-snug">
                    {lang === 'sw' ? item.titleSw : item.title}
                  </h3>
                  <span className="text-[10px] font-bold bg-[#1058A8]/10 text-[#1058A8] px-1.5 py-0.5 rounded shrink-0 font-source">
                    SATB
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-source">
                  {lang === 'sw' ? 'Mtunzi:' : 'Composer:'} <strong className="text-slate-900">{item.composer}</strong>
                </p>

                <p className="text-[11px] text-slate-500 font-source">
                  Soprano · Alto · Tenor · Bass
                </p>

                <p className="text-xs text-slate-600 font-source leading-relaxed line-clamp-2">
                  {lang === 'sw' ? item.descriptionSw : item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#0C2340]/10 space-y-2.5">
                {/* Price with small M-Pesa logo */}
                <div className="flex items-center gap-1.5">
                  <span className="font-eb-garamond font-bold text-base text-[#1058A8]">
                    KES {item.priceKes}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded tracking-wider shadow-2xs font-source">
                    M-PESA
                  </span>
                </div>

                {/* Buy Score button */}
                <button
                  onClick={() => addToCart({
                    id: `prod-${item.id}`,
                    name: item.title,
                    nameSw: item.titleSw,
                    type: 'sheet_music',
                    priceKes: item.priceKes,
                    priceUsd: 2.50,
                    description: item.description,
                    descriptionSw: item.descriptionSw,
                    image: 'sheet_music_hymnal',
                    downloadable: true
                  })}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-2xs font-source"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Nunua Noti' : 'Buy Score'}</span>
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

    </div>
  );
};
