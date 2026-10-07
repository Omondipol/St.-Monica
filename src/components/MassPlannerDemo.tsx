import React, { useState } from 'react';
import { SAMPLE_REPERTOIRE } from '../data/planData';
import { Music, Play, Pause, Download, Plus, Check, Filter, Calendar, Volume2 } from 'lucide-react';

export const MassPlannerDemo: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [selectedPart, setSelectedPart] = useState<string>('All');
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>('rep-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Program builder state: Sunday Mass parts mapped to selected songs
  const [programme, setProgramme] = useState<{
    entrance?: typeof SAMPLE_REPERTOIRE[0];
    kyrieGloria?: typeof SAMPLE_REPERTOIRE[0];
    offertory?: typeof SAMPLE_REPERTOIRE[0];
    communion?: typeof SAMPLE_REPERTOIRE[0];
    recessional?: typeof SAMPLE_REPERTOIRE[0];
  }>({
    entrance: SAMPLE_REPERTOIRE[0],
    kyrieGloria: SAMPLE_REPERTOIRE[1],
    communion: SAMPLE_REPERTOIRE[3],
  });

  const seasons = ['All', 'Patronal Feast (Ordinary Time)', 'Lent / Ordinary Time', 'Advent', 'Marian Feasts / Weddings', 'Easter'];
  const parts = ['All', 'Entrance', 'Kyrie & Gloria', 'Offertory', 'Communion', 'Recessional'];

  const filteredRepertoire = SAMPLE_REPERTOIRE.filter((song) => {
    const matchSeason = selectedSeason === 'All' || song.season.includes(selectedSeason) || song.season === selectedSeason;
    const matchPart = selectedPart === 'All' || song.partOfMass.toLowerCase().includes(selectedPart.toLowerCase());
    return matchSeason && matchPart;
  });

  const togglePlay = (id: string) => {
    if (currentPlayingId === id && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentPlayingId(id);
      setIsPlaying(true);
    }
  };

  const assignToSlot = (slot: 'entrance' | 'kyrieGloria' | 'offertory' | 'communion' | 'recessional', song: typeof SAMPLE_REPERTOIRE[0]) => {
    setProgramme(prev => ({
      ...prev,
      [slot]: song
    }));
  };

  const currentPlayingSong = SAMPLE_REPERTOIRE.find(s => s.id === currentPlayingId) || SAMPLE_REPERTOIRE[0];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-[#0C2340]/10 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1058A8] mb-2">
          <Music className="w-4 h-4" />
          <span>Interactive Feature Simulation (Section 4.3 & 6.2)</span>
        </div>
        <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#0C2340]">
          Parish Mass Planner & Repertoire Explorer
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#0C2340]/80 font-source max-w-3xl">
          An interactive prototype of Polycarp Ochieng's recommended viral feature: enabling visiting choir masters 
          and parish directors across Kenya to audition choral works, filter by liturgical season, and compose an exportable 
          one-page Sunday Mass music programme.
        </p>
      </div>

      {/* Persistent Audio Player Mockup (Section 3.4 & 6.2) */}
      <div className="bg-[#0C2340] text-white rounded-xl p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-[#7EC8F0]/30">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => togglePlay(currentPlayingSong.id)}
            className="w-12 h-12 rounded-full bg-[#7EC8F0] text-[#0C2340] hover:bg-white flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          
          <div className="truncate">
            <span className="text-[10px] uppercase font-bold text-[#7EC8F0] tracking-wider block">
              Now Auditioning · Persistent Audio Player
            </span>
            <div className="font-fraunces text-lg font-bold text-white truncate">
              {currentPlayingSong.title}
            </div>
            <span className="text-xs text-white/70 font-source">
              Composed by {currentPlayingSong.composer} · {currentPlayingSong.voicing} ({currentPlayingSong.key})
            </span>
          </div>
        </div>

        {/* Waveform Visualization Mock */}
        <div className="w-full md:w-72 lg:w-96 flex flex-col items-center gap-1.5">
          <div className="w-full h-8 flex items-end justify-between gap-1 px-1">
            {[40, 65, 30, 85, 95, 45, 60, 75, 100, 80, 50, 70, 90, 60, 40, 85, 70, 95, 55, 35, 65, 80, 50, 45].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-200 ${
                  i < (isPlaying ? 14 : 6) ? 'bg-[#7EC8F0]' : 'bg-white/30'
                }`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-white/60">
            <span>{isPlaying ? '01:42' : '00:00'}</span>
            <span>30s Preview / {currentPlayingSong.duration} Master</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-[#1058A8] bg-[#EAF4FB] px-2.5 py-1 rounded border border-[#7EC8F0]/40">
            KES {currentPlayingSong.scorePriceKes} Sheet Music
          </span>
        </div>
      </div>

      {/* Main Grid: Repertoire Browser (Left) & Mass Programme Builder (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Repertoire Filter & Song Rows */}
        <div className="lg:col-span-7 bg-white border border-[#0C2340]/10 rounded-xl p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
              Liturgical Repertoire Catalog
            </h3>
            <p className="text-xs text-[#0C2340]/60 font-source mt-0.5">
              Filtered by liturgical season, Mass part, key, and voicing.
            </p>
          </div>

          {/* Season Filter Pills */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#0C2340]/60 uppercase tracking-wider block">
              Filter by Liturgical Season:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {seasons.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSeason(s)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedSeason === s 
                      ? 'bg-[#1058A8] text-white shadow-2xs' 
                      : 'bg-[#EAF4FB] text-[#0C2340] hover:bg-[#7EC8F0]/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Song Rows */}
          <div className="space-y-3 pt-2">
            {filteredRepertoire.map((song) => {
              const isThisPlaying = currentPlayingId === song.id && isPlaying;
              return (
                <div
                  key={song.id}
                  className={`p-4 rounded-xl border transition-all ${
                    currentPlayingId === song.id
                      ? 'bg-[#EAF4FB]/50 border-[#1058A8]'
                      : 'bg-[#F8FAFC] border-[#0C2340]/10 hover:border-[#1058A8]/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => togglePlay(song.id)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors ${
                          isThisPlaying
                            ? 'bg-[#1058A8] text-white'
                            : 'bg-white border border-[#0C2340]/20 text-[#0C2340] hover:bg-[#1058A8] hover:text-white'
                        }`}
                      >
                        {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      <div>
                        <h4 className="font-fraunces text-base font-bold text-[#0C2340]">
                          {song.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#0C2340]/70 font-source mt-0.5">
                          <span>{song.composer}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#1058A8] font-medium">{song.partOfMass}</span>
                          <span aria-hidden="true">·</span>
                          <span>{song.voicing}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{song.key}</span>
                        </div>
                      </div>
                    </div>

                    <span className="tabular-numbers text-xs font-bold text-[#0C2340]/70 shrink-0">
                      {song.duration}
                    </span>
                  </div>

                  {/* Add to Sunday Mass buttons */}
                  <div className="mt-3 pt-3 border-t border-[#0C2340]/10 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-[#0C2340]/60 font-source">Assign to Mass part:</span>
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => assignToSlot('entrance', song)}
                        className="px-2 py-0.5 text-[10px] font-semibold bg-white border border-[#0C2340]/20 rounded hover:bg-[#1058A8] hover:text-white cursor-pointer"
                      >
                        Entrance
                      </button>
                      <button
                        onClick={() => assignToSlot('offertory', song)}
                        className="px-2 py-0.5 text-[10px] font-semibold bg-white border border-[#0C2340]/20 rounded hover:bg-[#1058A8] hover:text-white cursor-pointer"
                      >
                        Offertory
                      </button>
                      <button
                        onClick={() => assignToSlot('communion', song)}
                        className="px-2 py-0.5 text-[10px] font-semibold bg-white border border-[#0C2340]/20 rounded hover:bg-[#1058A8] hover:text-white cursor-pointer"
                      >
                        Communion
                      </button>
                      <button
                        onClick={() => assignToSlot('recessional', song)}
                        className="px-2 py-0.5 text-[10px] font-semibold bg-white border border-[#0C2340]/20 rounded hover:bg-[#1058A8] hover:text-white cursor-pointer"
                      >
                        Exit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: One-Page Sunday Mass Programme Preview */}
        <div className="lg:col-span-5 bg-white border border-[#0C2340]/10 rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b border-[#0C2340]/10 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1058A8]">
                One-Page Exportable PDF
              </span>
              <span className="text-xs font-mono text-[#0C2340]/60">Sunday Liturgy</span>
            </div>
            <h3 className="font-fraunces text-xl font-bold text-[#0C2340] mt-1">
              Choir Mass Programme Card
            </h3>
            <p className="text-xs text-[#0C2340]/60 font-source mt-0.5">
              St. Monica Catholic Church, Section 58 Nakuru
            </p>
          </div>

          {/* Stave Divider */}
          <div className="stave-divider my-2">
            <div className="stave-line" />
            <div className="stave-line" />
            <div className="stave-line" />
            <div className="stave-line" />
            <div className="stave-line" />
          </div>

          {/* Slots list */}
          <div className="space-y-4 text-xs font-source">
            {/* Entrance */}
            <div className="p-3 bg-[#EAF4FB]/40 rounded-lg border border-[#7EC8F0]/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1058A8] uppercase tracking-wider text-[11px]">I. Wimbo wa Mwanzo (Entrance)</span>
              </div>
              {programme.entrance ? (
                <div>
                  <p className="font-fraunces text-sm font-bold text-[#0C2340]">{programme.entrance.title}</p>
                  <p className="text-[11px] text-[#0C2340]/70">{programme.entrance.composer} · {programme.entrance.key}</p>
                </div>
              ) : (
                <span className="text-slate-400 italic">No song chosen</span>
              )}
            </div>

            {/* Kyrie & Gloria */}
            <div className="p-3 bg-[#EAF4FB]/40 rounded-lg border border-[#7EC8F0]/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1058A8] uppercase tracking-wider text-[11px]">II. Kyrie & Gloria (Misa)</span>
              </div>
              {programme.kyrieGloria ? (
                <div>
                  <p className="font-fraunces text-sm font-bold text-[#0C2340]">{programme.kyrieGloria.title}</p>
                  <p className="text-[11px] text-[#0C2340]/70">{programme.kyrieGloria.composer} · {programme.kyrieGloria.key}</p>
                </div>
              ) : (
                <span className="text-slate-400 italic">No song chosen</span>
              )}
            </div>

            {/* Offertory */}
            <div className="p-3 bg-[#EAF4FB]/40 rounded-lg border border-[#7EC8F0]/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1058A8] uppercase tracking-wider text-[11px]">III. Wimbo wa Sadaka (Offertory)</span>
              </div>
              {programme.offertory ? (
                <div>
                  <p className="font-fraunces text-sm font-bold text-[#0C2340]">{programme.offertory.title}</p>
                  <p className="text-[11px] text-[#0C2340]/70">{programme.offertory.composer} · {programme.offertory.key}</p>
                </div>
              ) : (
                <span className="text-slate-400 italic">No song chosen</span>
              )}
            </div>

            {/* Communion */}
            <div className="p-3 bg-[#EAF4FB]/40 rounded-lg border border-[#7EC8F0]/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1058A8] uppercase tracking-wider text-[11px]">IV. Wimbo wa Komunyo (Communion)</span>
              </div>
              {programme.communion ? (
                <div>
                  <p className="font-fraunces text-sm font-bold text-[#0C2340]">{programme.communion.title}</p>
                  <p className="text-[11px] text-[#0C2340]/70">{programme.communion.composer} · {programme.communion.key}</p>
                </div>
              ) : (
                <span className="text-slate-400 italic">No song chosen</span>
              )}
            </div>

            {/* Recessional */}
            <div className="p-3 bg-[#EAF4FB]/40 rounded-lg border border-[#7EC8F0]/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1058A8] uppercase tracking-wider text-[11px]">V. Wimbo wa Kutoka (Recessional)</span>
              </div>
              {programme.recessional ? (
                <div>
                  <p className="font-fraunces text-sm font-bold text-[#0C2340]">{programme.recessional.title}</p>
                  <p className="text-[11px] text-[#0C2340]/70">{programme.recessional.composer} · {programme.recessional.key}</p>
                </div>
              ) : (
                <span className="text-slate-400 italic">No song chosen</span>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => window.print()}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#0C2340] hover:bg-[#1058A8] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Sunday Mass Programme (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
