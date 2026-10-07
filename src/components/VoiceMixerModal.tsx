import React from 'react';
import { useChoir } from '../context/ChoirContext';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Play, 
  Pause, 
  Music, 
  Check, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const VoiceMixerModal: React.FC = () => {
  const { 
    isVoiceMixerOpen, 
    setIsVoiceMixerOpen, 
    currentSong, 
    isPlaying, 
    togglePlay, 
    voiceMixer, 
    toggleVoice, 
    setVoiceVolume, 
    lang 
  } = useChoir();

  if (!isVoiceMixerOpen) return null;

  const parts = [
    {
      id: 'soprano' as const,
      name: 'Soprano (Kinara cha Juu)',
      descEn: 'High melody & descant line',
      descSw: 'Sauti ya kwanza inayoongoza melodi ya wimbo',
      color: '#0E56A6',
      active: voiceMixer.soprano,
      volume: voiceMixer.sopranoVolume,
    },
    {
      id: 'alto' as const,
      name: 'Alto (Sauti ya Pili)',
      descEn: 'Warm harmonic interior voice',
      descSw: 'Sauti ya pili inayojaza upatanisho wa wimbo',
      color: '#059669',
      active: voiceMixer.alto,
      volume: voiceMixer.altoVolume,
    },
    {
      id: 'tenor' as const,
      name: 'Tenor (Sauti ya Tatu)',
      descEn: 'Lyrical counter-melody & male lead',
      descSw: 'Sauti ya tatu ya juu ya kiume yenye nguvu',
      color: '#0284C7',
      active: voiceMixer.tenor,
      volume: voiceMixer.tenorVolume,
    },
    {
      id: 'bass' as const,
      name: 'Bass (Sauti ya Chini)',
      descEn: 'Harmonic root & acoustic foundation',
      descSw: 'Sauti ya nne ya chini inayoweka msingi wa noti zote',
      color: '#7C3AED',
      active: voiceMixer.bass,
      volume: voiceMixer.bassVolume,
    },
  ];

  const handleSolo = (targetPart: 'soprano' | 'alto' | 'tenor' | 'bass') => {
    // Turn on target, turn off others
    parts.forEach(p => {
      if (p.id === targetPart) {
        if (!p.active) toggleVoice(p.id);
        setVoiceVolume(p.id, 100);
      } else {
        if (p.active) toggleVoice(p.id);
        setVoiceVolume(p.id, 0);
      }
    });
  };

  const handleUnmuteAll = () => {
    parts.forEach(p => {
      if (!p.active) toggleVoice(p.id);
      setVoiceVolume(p.id, 100);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0C2340]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-[#0C2340]/15 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#1C1E24] text-white border-b border-black/30 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#7EC8F0] uppercase tracking-wider font-mono">
              <Sliders className="w-4 h-4" />
              <span>{lang === 'sw' ? 'ZANA YA MAZOEZI YA SAUTI (SATB)' : 'CHORAL VOICE MIXER (SATB)'}</span>
            </div>
            <h3 className="font-fraunces text-2xl font-bold text-white">
              {currentSong.title}
            </h3>
            <p className="text-xs text-white/70 font-source">
              {lang === 'sw'
                ? 'Tenga sauti ya Soprano, Alto, Tenor au Bass kwa ajili ya kujifunzia nyumbani.'
                : 'Turn individual vocal parts on or off to rehearse your voice part in isolation.'}
            </p>
          </div>

          <button
            onClick={() => setIsVoiceMixerOpen(false)}
            className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Funga Mixer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Controls Bar */}
        <div className="p-4 bg-[#FAF8F5] border-b border-[#0C2340]/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="px-4 py-2 bg-[#0E56A6] hover:bg-[#0C2340] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? (lang === 'sw' ? 'Simamisha' : 'Pause') : (lang === 'sw' ? 'Cheza Zote' : 'Play All')}</span>
            </button>
            <span className="text-xs text-[#0C2340]/60 font-source font-medium">
              Mtunzi: <strong>{currentSong.composer}</strong> ({currentSong.musicalKey})
            </span>
          </div>

          <button
            onClick={handleUnmuteAll}
            className="px-3 py-1.5 text-xs font-semibold text-[#0E56A6] hover:bg-[#EAF4FB] rounded-lg border border-[#0E56A6]/20 cursor-pointer"
          >
            {lang === 'sw' ? 'Washa Sauti Zote (Reset All)' : 'Unmute All Voices'}
          </button>
        </div>

        {/* 4 Voice Channels (Soprano, Alto, Tenor, Bass) */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {parts.map((part) => (
            <div
              key={part.id}
              className={`p-4 rounded-xl border transition-all ${
                part.active
                  ? 'bg-white border-[#0C2340]/15 shadow-xs'
                  : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Voice info & Mute toggle */}
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => toggleVoice(part.id)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                      part.active
                        ? 'bg-[#EAF4FB] text-[#0E56A6] border border-[#0E56A6]/30'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                    title={part.active ? "Mute voice part" : "Unmute voice part"}
                  >
                    {part.active ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-fraunces font-bold text-base text-[#0C2340]">
                        {part.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        part.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {part.active ? 'LIVE' : 'MUTED'}
                      </span>
                    </div>
                    <p className="text-xs text-[#0C2340]/60 font-source truncate">
                      {lang === 'sw' ? part.descSw : part.descEn}
                    </p>
                  </div>
                </div>

                {/* Solo button & volume slider */}
                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleSolo(part.id)}
                    className="px-2.5 py-1 text-xs font-bold text-[#0C2340] bg-[#FAF8F5] hover:bg-[#EAF4FB] border border-[#0C2340]/20 rounded-md cursor-pointer transition-colors"
                    title="Isolate only this voice part (Solo)"
                  >
                    SOLO
                  </button>

                  <div className="flex items-center gap-2 w-32">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={part.active ? part.volume : 0}
                      onChange={(e) => setVoiceVolume(part.id, Number(e.target.value))}
                      className="w-full accent-[#0E56A6] cursor-pointer"
                    />
                    <span className="font-mono text-[11px] font-bold text-[#0C2340]/70 w-8 text-right">
                      {part.active ? `${part.volume}%` : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#0C2340]/10 flex items-center justify-between text-xs text-[#0C2340]/70 font-source">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#0E56A6]" />
            <span>
              {lang === 'sw'
                ? 'Waimbaji wa kwaya hutumia zana hii kufanya mazoezi ya sauti kabla ya ibada.'
                : 'Choir members use this interactive tool to learn their voice parts for Sunday Mass.'}
            </span>
          </div>

          <button
            onClick={() => setIsVoiceMixerOpen(false)}
            className="px-4 py-1.5 text-xs font-bold text-[#0C2340] bg-white border border-[#0C2340]/20 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            {lang === 'sw' ? 'Funga' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
