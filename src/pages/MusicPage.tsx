import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { SONGS_CATALOG, ALBUMS_CATALOG, Song } from '../data/choirContent';
import { 
  Play, 
  Pause, 
  FileText, 
  ShoppingBag, 
  Filter, 
  Download, 
  Search, 
  Music,
  Plus,
  Check
} from 'lucide-react';

export const MusicPage: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    togglePlay, 
    setIsLyricsOpen, 
    addToCart, 
    formatPrice, 
    lang 
  } = useChoir();

  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('All');
  const [partFilter, setPartFilter] = useState('All');

  // Liturgical Mass Planner state
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [sundayProgramme, setSundayProgramme] = useState<{
    entrance?: Song;
    kyrieGloria?: Song;
    offertory?: Song;
    communion?: Song;
    recessional?: Song;
  }>({
    entrance: SONGS_CATALOG[0],
    kyrieGloria: SONGS_CATALOG[1],
    offertory: SONGS_CATALOG[3],
    communion: SONGS_CATALOG[4],
  });

  const seasons = ['All', 'Ordinary Time', 'Advent', 'Lent', 'Easter', 'Marian', 'Patronal'];
  const parts = ['All', 'Entrance', 'Kyrie & Gloria', 'Offertory', 'Communion', 'Recessional'];

  const filteredSongs = SONGS_CATALOG.filter((song) => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          song.composer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          song.lyricsSwahili.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSeason = seasonFilter === 'All' || song.season === seasonFilter;
    const matchesPart = partFilter === 'All' || song.partOfMass === partFilter;
    return matchesSearch && matchesSeason && matchesPart;
  });

  const assignSongToMass = (slot: 'entrance' | 'kyrieGloria' | 'offertory' | 'communion' | 'recessional', song: Song) => {
    setSundayProgramme(prev => ({ ...prev, [slot]: song }));
    setPlannerOpen(true);
  };

  return (
    <div className="space-y-16">
      
      {/* Editorial Header */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
          <Music className="w-4 h-4" />
          <span>MUZIKI, ALBAMU NA NOTI (SECTION 6.2 & 7.3)</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Hifadhi ya Muziki na Nyimbo za Kwaya' : 'Sacred Music Catalog & Scores'}
            </h1>
            <p className="text-base text-[#0C2340]/80 font-source mt-2 max-w-2xl">
              {lang === 'sw'
                ? 'Sikiliza albamu zote, tafuta nyimbo kulingana na msimu wa kiliturujia, na pakua noti rasmi za sauti nne (SATB).'
                : 'Audition original recordings, filter repertoire by liturgical season, and plan Sunday music programs.'}
            </p>
          </div>

          <button
            onClick={() => setPlannerOpen(!plannerOpen)}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#0C2340] hover:bg-[#1058A8] rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            {plannerOpen 
              ? (lang === 'sw' ? 'Ficha Mpangaji wa Misa' : 'Hide Mass Planner') 
              : (lang === 'sw' ? 'Fungua Mpangaji wa Misa' : 'Open Sunday Mass Planner')}
          </button>
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

      {/* Mass Planner Floating Banner / Section when opened */}
      {plannerOpen && (
        <section className="bg-[#EAF4FB] border border-[#7EC8F0]/50 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#1058A8] uppercase tracking-wider font-mono">
                {lang === 'sw' ? 'ZANA YA WALIMU WA KWAYA (SECTION 6.2)' : 'CHOIRMASTER LITURGICAL TOOL (SECTION 6.2)'}
              </span>
              <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
                {lang === 'sw' 
                  ? 'Mpangilio wa Nyimbo za Misa ya Jumapili (1-Page Programme)' 
                  : 'Sunday Mass Music Order of Service (1-Page Programme)'}
              </h3>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Chapisha / PDF' : 'Print / Export PDF'}</span>
            </button>
          </div>

          <p className="text-xs text-[#0C2340]/70 font-source">
            {lang === 'sw'
              ? 'Teua wimbo kutoka orodha iliyo hapa chini ili uwekwe katika nafasi husika ya Misa:'
              : 'Select a song from the repertoire catalog below to assign it to each liturgical Mass part:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-source">
            <div className="p-3 bg-white rounded-lg border border-[#0C2340]/10">
              <span className="font-bold text-[#1058A8] block">
                {lang === 'sw' ? 'I. Mwanzo (Entrance):' : 'I. Entrance Hymn:'}
              </span>
              <span className="font-fraunces font-bold text-[#0C2340] text-sm block mt-0.5">
                {sundayProgramme.entrance ? sundayProgramme.entrance.title : (lang === 'sw' ? 'Haujachaguliwa' : 'Not selected')}
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#0C2340]/10">
              <span className="font-bold text-[#1058A8] block">
                {lang === 'sw' ? 'II. Sadaka (Offertory):' : 'II. Offertory Hymn:'}
              </span>
              <span className="font-fraunces font-bold text-[#0C2340] text-sm block mt-0.5">
                {sundayProgramme.offertory ? sundayProgramme.offertory.title : (lang === 'sw' ? 'Haujachaguliwa' : 'Not selected')}
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#0C2340]/10">
              <span className="font-bold text-[#1058A8] block">
                {lang === 'sw' ? 'III. Komunyo (Communion):' : 'III. Communion Hymn:'}
              </span>
              <span className="font-fraunces font-bold text-[#0C2340] text-sm block mt-0.5">
                {sundayProgramme.communion ? sundayProgramme.communion.title : (lang === 'sw' ? 'Haujachaguliwa' : 'Not selected')}
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#0C2340]/10">
              <span className="font-bold text-[#1058A8] block">
                {lang === 'sw' ? 'IV. Kutoka (Recessional):' : 'IV. Recessional Hymn:'}
              </span>
              <span className="font-fraunces font-bold text-[#0C2340] text-sm block mt-0.5">
                {sundayProgramme.recessional ? sundayProgramme.recessional.title : (lang === 'sw' ? 'Haujachaguliwa' : 'Not selected')}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Search Bar */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-[#0C2340]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'sw' ? "Tafuta wimbo, mtunzi au maneno..." : "Search hymn, composer or lyrics..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
            />
          </div>

          {/* Liturgical Season pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-[11px] font-bold text-[#0C2340]/60 uppercase tracking-wider mr-1">
              Msimu:
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
        </div>

        {/* Part of Mass filter pills */}
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
      </section>

      {/* Song List Results */}
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
              <div className="flex items-start sm:items-center gap-4">
                <button
                  onClick={() => playSong(song)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 cursor-pointer shadow-xs transition-colors ${
                    isThisPlaying
                      ? 'bg-[#1058A8] text-white'
                      : 'bg-[#EAF4FB] text-[#0C2340] hover:bg-[#1058A8] hover:text-white'
                  }`}
                  aria-label={isThisPlaying ? "Pause song" : "Play song preview"}
                >
                  {isThisPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-[#1058A8] bg-[#EAF4FB] px-2 py-0.5 rounded uppercase">
                      {lang === 'sw' ? song.seasonSwahili : song.season}
                    </span>
                    <span className="text-[10px] font-semibold text-[#0C2340]/60">
                      {lang === 'sw' ? song.partOfMassSwahili : song.partOfMass}
                    </span>
                    <span className="text-[10px] font-mono text-[#0C2340]/50">
                      Key: {song.musicalKey}
                    </span>
                  </div>

                  <h3 className="font-fraunces text-lg font-bold text-[#0C2340]">
                    {song.title}
                  </h3>

                  <p className="text-xs text-[#0C2340]/70 font-source">
                    {lang === 'sw' ? 'Mtunzi:' : 'Composer:'} <strong>{song.composer}</strong> · {song.voicing} ({song.album})
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#0C2340]/5">
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
                        priceUsd: Math.round(song.scorePriceKes / 128 * 10) / 10,
                        description: `SATB sheet music score for ${song.title}.`,
                        descriptionSw: `Noti za ${song.title}.`,
                        image: 'sheet_music_hymnal',
                        downloadable: true
                      });
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'sw' ? `Noti (${formatPrice(song.scorePriceKes)})` : `Score (${formatPrice(song.scorePriceKes)})`}</span>
                  </button>
                )}

                {/* Assign to Mass button */}
                <button
                  onClick={() => assignSongToMass('entrance', song)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-[#0C2340]/70 hover:text-[#0C2340] border border-[#0C2340]/15 rounded-lg cursor-pointer"
                  title={lang === 'sw' ? 'Weka kwenye Mpangaji wa Misa ya Jumapili' : 'Assign to Sunday Mass Planner'}
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1 text-[#1058A8]" />
                  <span>{lang === 'sw' ? 'Weka kwenye Misa' : 'Add to Mass'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Albums Catalog Overview */}
      <section className="space-y-6 pt-8 border-t border-[#0C2340]/10">
        <div>
          <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
            SANTURI ZA STUDIO (DISCOGRAPHY)
          </span>
          <h2 className="font-fraunces text-3xl font-bold text-[#0C2340] mt-1">
            {lang === 'sw' ? 'Albamu Rasmi za Kwaya' : 'Official Studio Album Catalog'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ALBUMS_CATALOG.map((alb) => (
            <div key={alb.id} className="p-5 bg-white border border-[#0C2340]/10 rounded-2xl space-y-4 shadow-xs">
              <div className="aspect-square rounded-xl bg-[#EAF4FB] border border-[#7EC8F0]/30 flex items-center justify-center relative overflow-hidden">
                <Music className="w-16 h-16 text-[#1058A8]" />
                <span className="absolute bottom-2 right-2 font-mono text-xs font-bold bg-[#0C2340] text-white px-2 py-0.5 rounded">
                  {alb.releaseYear}
                </span>
              </div>

              <div>
                <h4 className="font-fraunces text-lg font-bold text-[#0C2340]">
                  {alb.title}
                </h4>
                <p className="text-xs text-[#0C2340]/60 font-source">
                  {alb.trackCount} Nyimbo za Kwaya
                </p>
                <p className="text-xs text-[#0C2340]/80 font-source mt-2 leading-relaxed">
                  {lang === 'sw' ? alb.descriptionSw : alb.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#0C2340]/10 flex items-center justify-between">
                <span className="tabular-numbers text-sm font-bold text-[#1058A8]">
                  {formatPrice(alb.priceKes)}
                </span>
                <button
                  onClick={() => {
                    addToCart({
                      id: `alb-${alb.id}`,
                      name: alb.title,
                      nameSw: alb.title,
                      type: 'digital_album',
                      priceKes: alb.priceKes,
                      priceUsd: Math.round(alb.priceKes / 128 * 10) / 10,
                      description: alb.description,
                      descriptionSw: alb.descriptionSw,
                      image: 'choir_singing_moment',
                      downloadable: true
                    });
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg cursor-pointer"
                >
                  Nunua Albamu
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
