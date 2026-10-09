import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles } from 'lucide-react';
import { useChoir } from '../context/ChoirContext';

type VoicePart = 'soprano' | 'alto' | 'tenor' | 'bass' | 'all';

interface VoiceConfig {
  id: VoicePart;
  name: string;
  nameSw: string;
  range: string;
  color: string;
  glowColor: string;
  borderColor: string;
  filterType?: BiquadFilterType;
  filterFreq?: number;
  description: string;
  descriptionSw: string;
}

const VOICES: VoiceConfig[] = [
  {
    id: 'soprano',
    name: 'Soprano',
    nameSw: 'Sauti ya Kwanza (Soprano)',
    range: 'C4 — A5',
    color: 'bg-[#7EC8F0]',
    glowColor: 'shadow-[0_0_15px_#7EC8F0]',
    borderColor: 'border-[#7EC8F0]',
    filterType: 'highpass',
    filterFreq: 1100,
    description: 'The highest voice leading the liturgical song melody with purity and clarity.',
    descriptionSw: 'Sauti inayoongoza melodi ya wimbo kwa usafi na mng\'ao wa kiliturujia.'
  },
  {
    id: 'alto',
    name: 'Alto',
    nameSw: 'Sauti ya Pili (Alto)',
    range: 'F3 — D5',
    color: 'bg-[#4EA2E8]',
    glowColor: 'shadow-[0_0_15px_#4EA2E8]',
    borderColor: 'border-[#4EA2E8]',
    filterType: 'bandpass',
    filterFreq: 650,
    description: 'The warm, rich interior harmony grounding the soprano melody in prayerful depth.',
    descriptionSw: 'Patanisho nyororo la ndani linaloongeza utulivu na uzito wa sala.'
  },
  {
    id: 'tenor',
    name: 'Tenor',
    nameSw: 'Sauti ya Tatu (Tenor)',
    range: 'C3 — G4',
    color: 'bg-[#1058A8]',
    glowColor: 'shadow-[0_0_15px_#1058A8]',
    borderColor: 'border-[#1058A8]',
    filterType: 'bandpass',
    filterFreq: 340,
    description: 'Bright counterpoint providing lyrical energy and harmonic resonance.',
    descriptionSw: 'Sauti ya kiume ya juu inayoleta nguvu na utajiri wa upatanisho.'
  },
  {
    id: 'bass',
    name: 'Bass',
    nameSw: 'Sauti ya Nne (Bass)',
    range: 'E2 — C4',
    color: 'bg-[#0C2340]',
    glowColor: 'shadow-[0_0_15px_#0C2340]',
    borderColor: 'border-[#0C2340]',
    filterType: 'lowpass',
    filterFreq: 220,
    description: 'The foundational acoustic pillar upon which the sacred four-part chords rest.',
    descriptionSw: 'Msingi thabiti wa sauti nzito unaoshikilia nguzo yote ya kwaya.'
  }
];

export const HearTheFourVoices: React.FC = () => {
  const { lang } = useChoir();
  const [activeVoice, setActiveVoice] = useState<VoicePart | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Setup audio element for demo excerpt (Machozi ya Imani liturgical choir recording)
    const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : './';
    const audioUrl = `${base.endsWith('/') ? base : base + '/'}audio/machozi_ya_imani.mp3`;
    const audio = new Audio(audioUrl);
    audio.preload = 'metadata';
    audio.loop = true;
    audioRef.current = audio;

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => {
      setIsPlaying(false);
      setActiveVoice(null);
    };

    return () => {
      audio.pause();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const ensureAudioGraph = () => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;

      const filter = ctx.createBiquadFilter();
      filterNodeRef.current = filter;

      const gain = ctx.createGain();
      gainNodeRef.current = gain;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const selectVoice = (voice: VoicePart) => {
    if (!audioRef.current) return;
    ensureAudioGraph();

    if (activeVoice === voice && isPlaying) {
      // Toggle pause
      audioRef.current.pause();
      setActiveVoice(null);
      return;
    }

    setActiveVoice(voice);

    // Apply voice part frequency shaping
    if (filterNodeRef.current && gainNodeRef.current) {
      if (voice === 'all') {
        filterNodeRef.current.type = 'allpass';
        gainNodeRef.current.gain.value = 1.0;
      } else {
        const config = VOICES.find(v => v.id === voice);
        if (config && config.filterType && config.filterFreq) {
          filterNodeRef.current.type = config.filterType;
          filterNodeRef.current.frequency.value = config.filterFreq;
          filterNodeRef.current.Q.value = 1.6;
          gainNodeRef.current.gain.value = 1.35;
        }
      }
    }

    audioRef.current.play().catch(() => {
      // Audio playback gesture catch
    });
  };

  return (
    <section className="bg-white py-16 sm:py-20 border-b border-[#0C2340]/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4FB] text-[#1058A8] text-xs font-bold uppercase tracking-wider font-source">
            <Music className="w-3.5 h-3.5" />
            <span>{lang === 'sw' ? 'Sauti za Kwaya' : 'Choral Polyphony'}</span>
          </div>

          <h2 className="font-fraunces text-2xl sm:text-4xl font-bold text-[#0C2340] leading-tight">
            {lang === 'sw' ? 'Sikia Sauti Nne za Kwaya' : 'Hear the Four Voices'}
          </h2>

          <p className="text-sm sm:text-base text-slate-700 font-source leading-relaxed">
            {lang === 'sw'
              ? 'Gusa sauti ya Soprano, Alto, Tenor, au Bass ili kuisikiliza peke yake, au gusa "Sauti Zote Pamoja" ili kuzisikia zikiungana katika upatanisho kamili wa altaroni.'
              : 'Tap Soprano, Alto, Tenor, or Bass to hear each vocal line individually, or tap "All Together" to hear them unite in complete sacred harmony.'}
          </p>
        </div>

        {/* Four Horizontal Voice Lines with shades of blue */}
        <div className="space-y-4 pt-2">
          {VOICES.map((voice) => {
            const isActive = activeVoice === voice.id && isPlaying;
            return (
              <div
                key={voice.id}
                onClick={() => selectVoice(voice.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isActive 
                    ? `border-[#1058A8] bg-[#EAF4FB] shadow-md ${voice.glowColor}` 
                    : 'border-[#0C2340]/15 hover:border-[#1058A8]/50 bg-white hover:bg-slate-50'
                }`}
              >
                {/* Horizontal progress/accent bar representing voice line in its unique shade of blue */}
                <div 
                  className={`absolute top-0 left-0 bottom-0 w-2.5 transition-all ${voice.color} ${
                    isActive ? 'w-3.5' : 'group-hover:w-3'
                  }`} 
                />

                <div className="flex items-center justify-between gap-4 pl-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${voice.color} shrink-0`} />
                      <h3 className="font-fraunces text-lg sm:text-xl font-bold text-[#0C2340]">
                        {lang === 'sw' ? voice.nameSw : voice.name}
                      </h3>
                      <span className="text-xs font-source font-semibold tabular-nums px-2 py-0.5 rounded-[12px] bg-slate-100 text-slate-600">
                        {voice.range}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 font-source pl-6">
                      {lang === 'sw' ? voice.descriptionSw : voice.description}
                    </p>
                  </div>

                  {/* Play / Playing Indicator */}
                  <div className="shrink-0 flex items-center gap-3">
                    {isActive ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1058A8] text-white text-xs font-bold shadow-xs">
                        {/* Animated waveform bars */}
                        <span className="w-1 h-3 bg-white animate-pulse" />
                        <span className="w-1 h-4 bg-white animate-pulse delay-75" />
                        <span className="w-1 h-2 bg-white animate-pulse delay-150" />
                        <span className="ml-1">{lang === 'sw' ? 'Inaimba' : 'Solo'}</span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full border border-[#0C2340]/20 flex items-center justify-center text-[#1058A8] group-hover:bg-[#1058A8] group-hover:text-white transition-all">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5th Button: All Together */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => selectVoice('all')}
            className={`px-8 py-4 rounded-full font-bold text-sm sm:text-base flex items-center gap-3 transition-all cursor-pointer shadow-md ${
              activeVoice === 'all' && isPlaying
                ? 'bg-[#0C2340] text-white ring-4 ring-[#7EC8F0]/50'
                : 'bg-[#1058A8] hover:bg-[#0E56A6] text-white hover:shadow-lg'
            }`}
          >
            {activeVoice === 'all' && isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current text-[#7EC8F0]" />
                <span>{lang === 'sw' ? 'Sitisha Sauti Zote' : 'Pause All Voices'}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current text-[#7EC8F0] ml-0.5" />
                <span>{lang === 'sw' ? 'Sauti Zote Pamoja (Full Choir SATB)' : 'All Together (Full SATB)'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </section>
  );
};
