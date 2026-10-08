import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Song, SheetMusicItem, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../data/choirContent';
import { 
  Play, 
  Pause, 
  FileText, 
  ShoppingBag, 
  Search, 
  Music,
  ExternalLink,
  Download,
  Filter
} from 'lucide-react';
import { RealYouTubeIcon } from '../components/RealYouTubeIcon';

import scorePreviewMachozi from '../assets/images/score_preview_machozi_1791446357129.jpg';
import scorePreviewMaisha from '../assets/images/score_preview_maisha_1791446372899.jpg';
import scorePreviewNimzima from '../assets/images/score_preview_nimzima_1791446398645.jpg';
import scorePreviewJumuiya from '../assets/images/score_preview_jumuiya_1791446413261.jpg';

export const MusicPage: React.FC = () => {
  const { 
    songs,
    sheetMusicList,
    currentSong, 
    isPlaying, 
    playSong, 
    setIsLyricsOpen, 
    addToCart, 
    formatPrice, 
    lang 
  } = useChoir();

  const [activeTab, setActiveTab] = useState<'songs' | 'sheet_music'>('songs');
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('All');
  const [partFilter, setPartFilter] = useState('All');

  const seasons = ['All', 'Ordinary Time', 'Advent', 'Lent', 'Easter', 'Patronal'];
  const parts = ['All', 'Entrance', 'Kyrie & Gloria', 'Offertory', 'Communion', 'Meditation', 'Recessional'];

  const filteredSongs = songs.filter((song) => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          song.titleSwahili.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          song.composer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeason = seasonFilter === 'All' || song.season === seasonFilter;
    const matchesPart = partFilter === 'All' || song.partOfMass === partFilter;
    return matchesSearch && matchesSeason && matchesPart;
  });

  const filteredSheetMusic = sheetMusicList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.titleSw.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.composer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getScoreImage = (id: string) => {
    if (id.includes('machozi')) return scorePreviewMachozi;
    if (id.includes('maisha')) return scorePreviewMaisha;
    if (id.includes('nimzima')) return scorePreviewNimzima;
    if (id.includes('jumuiya')) return scorePreviewJumuiya;
    return scorePreviewMachozi;
  };

  return (
    <div className="space-y-12">
      
      {/* Header Banner */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-source">
          <Music className="w-4 h-4" />
          <span>{lang === 'sw' ? 'Hifadhi ya Nyimbo na Noti za Kwaya' : 'Choir Music Repertoire & Vocal Scores'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Nyimbo na Noti za Kwaya' : 'Sacred Music & Sheet Music'}
            </h1>
            <p className="text-base text-[#0C2340]/80 font-source mt-2 max-w-2xl">
              {lang === 'sw'
                ? `Nyimbo halisi za Kwaya ya Mtakatifu Monica Section 58 Nakuru kutoka YouTube (${YOUTUBE_CHANNEL_HANDLE}) na noti za sauti nne (SATB) zinazouzwa kwa walimu wa kwaya.`
                : `Authentic recordings by St. Monica Choir Section 58 Nakuru from YouTube (${YOUTUBE_CHANNEL_HANDLE}), alongside SATB vocal scores available for choirmasters.`}
            </p>
          </div>

          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-2"
          >
            <RealYouTubeIcon size={18} variant="badge" />
            <span>{lang === 'sw' ? 'Kituo cha YouTube' : 'Official YouTube'}</span>
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

      {/* View Switcher: Songs vs Sheet Music */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('songs')}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'songs'
              ? 'bg-[#1058A8] text-white shadow-xs'
              : 'bg-white border border-[#0C2340]/15 text-[#0C2340] hover:bg-[#EAF4FB]'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>{lang === 'sw' ? `Nyimbo za Kwaya (${songs.length})` : `Choir Songs (${songs.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('sheet_music')}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'sheet_music'
              ? 'bg-[#1058A8] text-white shadow-xs'
              : 'bg-white border border-[#0C2340]/15 text-[#0C2340] hover:bg-[#EAF4FB]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{lang === 'sw' ? `Noti Zinazouzwa (${sheetMusicList.length})` : `Sheet Music for Sale (${sheetMusicList.length})`}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#0C2340]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'sw' ? "Tafuta wimbo au mtunzi..." : "Search hymn title or composer..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
            />
          </div>

          {activeTab === 'songs' && (
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <span className="text-[11px] font-bold text-[#0C2340]/60 uppercase tracking-wider mr-1">
                {lang === 'sw' ? 'Msimu:' : 'Season:'}
              </span>
              {seasons.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeasonFilter(s)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    seasonFilter === s
                      ? 'bg-[#1058A8] text-white shadow-2xs'
                      : 'bg-[#EAF4FB] text-[#0C2340] hover:bg-[#7EC8F0]/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeTab === 'songs' && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#0C2340]/5">
            <span className="text-[11px] font-bold text-[#0C2340]/60 uppercase tracking-wider mr-1">
              {lang === 'sw' ? 'Sehemu ya Misa:' : 'Mass Part:'}
            </span>
            {parts.map((p) => (
              <button
                key={p}
                onClick={() => setPartFilter(p)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  partFilter === p
                    ? 'bg-[#0C2340] text-white shadow-2xs'
                    : 'bg-white border border-[#0C2340]/15 text-[#0C2340] hover:bg-[#EAF4FB]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* TAB 1: REPERTOIRE SONGS LIST */}
      {activeTab === 'songs' && (
        <section className="space-y-3">
          {filteredSongs.map((song) => {
            const isThisPlaying = currentSong.id === song.id && isPlaying;
            return (
              <div
                key={song.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  currentSong.id === song.id
                    ? 'bg-[#EAF4FB]/70 border-[#1058A8] shadow-xs'
                    : 'bg-white border-[#0C2340]/10 hover:border-[#1058A8]/40 shadow-2xs'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div 
                    onClick={() => playSong(song)}
                    className="relative w-24 sm:w-28 aspect-16/9 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-2xs cursor-pointer group"
                  >
                    <img
                      src={song.thumbnailUrl}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                        isThisPlaying ? 'bg-[#1058A8] text-white' : 'bg-white text-[#0C2340]'
                      }`}>
                        {isThisPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-[#1058A8] bg-[#EAF4FB] px-2 py-0.5 rounded uppercase font-source">
                        {lang === 'sw' ? song.seasonSwahili : song.season}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700">
                        {lang === 'sw' ? song.partOfMassSwahili : song.partOfMass}
                      </span>
                      <span className="text-[11px] text-slate-500 font-source">
                        Key: {song.musicalKey} · {song.duration}
                      </span>
                    </div>

                    <h3 className="font-fraunces text-lg font-bold text-[#0C2340] truncate">
                      {lang === 'sw' ? song.titleSwahili : song.title}
                    </h3>

                    <p className="text-xs text-slate-700 font-source">
                      {lang === 'sw' ? 'Mtunzi:' : 'Composer:'} <strong className="text-slate-900">{song.composer}</strong> · {song.voicing}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#0C2340]/5">
                  <a
                    href={song.youtubeUrl || YOUTUBE_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors group"
                  >
                    <RealYouTubeIcon size={16} variant="badge" />
                    <span>{lang === 'sw' ? 'Tazama YouTube' : 'YouTube'}</span>
                  </a>

                  <button
                    onClick={() => {
                      playSong(song);
                      setIsLyricsOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] hover:bg-[#7EC8F0]/30 rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#1058A8]" />
                    <span>{lang === 'sw' ? 'Maneno' : 'Lyrics'}</span>
                  </button>

                  {song.sheetMusicAvailable && (
                    <button
                      onClick={() => {
                        addToCart({
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
                        });
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{lang === 'sw' ? `Nunua Noti (${formatPrice(song.scorePriceKes)})` : `Buy Score (${formatPrice(song.scorePriceKes)})`}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* TAB 2: SHEET MUSIC & NOTES ON SALE */}
      {activeTab === 'sheet_music' && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSheetMusic.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white border border-[#0C2340]/10 rounded-2xl hover:border-[#1058A8] transition-all shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                {/* Score Preview Image: top half of page one with faint PREVIEW mark */}
                <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-[#0C2340]/10 relative group">
                  <img
                    src={getScoreImage(item.id)}
                    alt={`${item.title} Score Preview`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Song name ONLY as the title */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-fraunces text-base font-bold text-[#0C2340] leading-snug">
                    {lang === 'sw' ? item.titleSw : item.title}
                  </h3>
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

                <p className="text-xs text-slate-600 font-source leading-relaxed line-clamp-2">
                  {lang === 'sw' ? item.descriptionSw : item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#0C2340]/10 space-y-2.5">
                {/* Price with small M-Pesa logo beside it */}
                <div className="flex items-center gap-1.5">
                  <span className="font-fraunces font-bold text-base text-[#1058A8]">
                    KES {item.priceKes}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded tracking-wider shadow-2xs">
                    M-PESA
                  </span>
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
                  className="w-full py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
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
