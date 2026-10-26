/**
 * Utility for downloading sheet music notes and MIDI files in the browser.
 */

// Generate a valid Type 0 Standard MIDI file for 4-part SATB choral cadences
export function createStandardChoralMidiDataUrl(songTitle: string): string {
  // Standard MIDI header (Format 0, 1 track, 480 ticks/beat)
  const header = [
    0x4D, 0x54, 0x68, 0x64, // 'MThd'
    0x00, 0x00, 0x00, 0x06, // length 6
    0x00, 0x00,             // format 0
    0x00, 0x01,             // 1 track
    0x01, 0xE0              // 480 ticks per beat
  ];

  // Track Name event
  const safeName = (songTitle || 'St. Monica Choir Hymn').slice(0, 32);
  const nameBytes = Array.from(new TextEncoder().encode(safeName));
  const trackNameMeta = [0x00, 0xFF, 0x03, nameBytes.length, ...nameBytes];

  // Tempo: 84 BPM
  const tempoMeta = [0x00, 0xFF, 0x51, 0x03, 0x0A, 0xDA, 0x74];

  // Program Change: 52 = Choir Aahs (GM)
  const programChange = [0x00, 0xC0, 0x34];

  // Cadence 1: C major SATB (C3, G3, E4, C5)
  const chord1On = [
    0x00, 0x90, 0x30, 0x55, // C3 bass
    0x00, 0x90, 0x37, 0x55, // G3 tenor
    0x00, 0x90, 0x40, 0x60, // E4 alto
    0x00, 0x90, 0x48, 0x65  // C5 soprano
  ];
  const chord1Off = [
    0x87, 0x40, 0x80, 0x30, 0x00,
    0x00, 0x80, 0x37, 0x00,
    0x00, 0x80, 0x40, 0x00,
    0x00, 0x80, 0x48, 0x00
  ];

  // Cadence 2: F major (F3, A3, C4, F4)
  const chord2On = [
    0x00, 0x90, 0x35, 0x55,
    0x00, 0x90, 0x39, 0x55,
    0x00, 0x90, 0x41, 0x60,
    0x00, 0x90, 0x45, 0x65
  ];
  const chord2Off = [
    0x87, 0x40, 0x80, 0x35, 0x00,
    0x00, 0x80, 0x39, 0x00,
    0x00, 0x80, 0x41, 0x00,
    0x00, 0x80, 0x45, 0x00
  ];

  // Cadence 3: G7 (G3, B3, D4, F4)
  const chord3On = [
    0x00, 0x90, 0x37, 0x58,
    0x00, 0x90, 0x3B, 0x58,
    0x00, 0x90, 0x43, 0x60,
    0x00, 0x90, 0x45, 0x65
  ];
  const chord3Off = [
    0x87, 0x40, 0x80, 0x37, 0x00,
    0x00, 0x80, 0x3B, 0x00,
    0x00, 0x80, 0x43, 0x00,
    0x00, 0x80, 0x45, 0x00
  ];

  // Cadence 4: C major final resolution (C3, G3, C4, E4)
  const chord4On = [
    0x00, 0x90, 0x30, 0x60,
    0x00, 0x90, 0x37, 0x60,
    0x00, 0x90, 0x3C, 0x65,
    0x00, 0x90, 0x48, 0x70
  ];
  const chord4Off = [
    0x8F, 0x00, 0x80, 0x30, 0x00,
    0x00, 0x80, 0x37, 0x00,
    0x00, 0x80, 0x3C, 0x00,
    0x00, 0x80, 0x48, 0x00
  ];

  // End of track meta event
  const endOfTrack = [0x00, 0xFF, 0x2F, 0x00];

  const trackEvents = [
    ...trackNameMeta,
    ...tempoMeta,
    ...programChange,
    ...chord1On,
    ...chord1Off,
    ...chord2On,
    ...chord2Off,
    ...chord3On,
    ...chord3Off,
    ...chord4On,
    ...chord4Off,
    ...endOfTrack
  ];

  const trackLength = trackEvents.length;
  const trackHeader = [
    0x4D, 0x54, 0x72, 0x6B, // 'MTrk'
    (trackLength >> 24) & 0xFF,
    (trackLength >> 16) & 0xFF,
    (trackLength >> 8) & 0xFF,
    trackLength & 0xFF
  ];

  const fullMidi = new Uint8Array([...header, ...trackHeader, ...trackEvents]);
  let binary = '';
  for (let i = 0; i < fullMidi.length; i++) {
    binary += String.fromCharCode(fullMidi[i]);
  }
  return 'data:audio/midi;base64,' + btoa(binary);
}

/**
 * Trigger download of any file in browser (Data URL or regular HTTP URL).
 */
export function triggerFileDownload(url: string, filename: string): void {
  if (!url) return;

  // If HTTP/HTTPS URL and not a data URL, we can attempt direct download or fallback to open in new tab
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // For data URLs (e.g. data:audio/midi, data:application/pdf)
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
