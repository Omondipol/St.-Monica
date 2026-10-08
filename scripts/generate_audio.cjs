const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const sampleRate = 44100;

// Chord progressions and melodic lines for the 4 sacred choir songs
const songs = [
  {
    name: 'jumuiya_ndogondogo',
    key: 'G',
    tempo: 104,
    // G major: G, C, D, Em, Am
    chords: [
      { name: 'G', s: 392.00, a: 329.63, t: 246.94, b: 98.00, dur: 2.3 },
      { name: 'C', s: 440.00, a: 349.23, t: 261.63, b: 130.81, dur: 2.3 },
      { name: 'D', s: 493.88, a: 369.99, t: 293.66, b: 146.83, dur: 2.3 },
      { name: 'G', s: 392.00, a: 313.59, t: 246.94, b: 98.00, dur: 2.3 },
      { name: 'Em', s: 440.00, a: 329.63, t: 246.94, b: 82.41, dur: 2.3 },
      { name: 'Am', s: 440.00, a: 349.23, t: 220.00, b: 110.00, dur: 2.3 },
      { name: 'D7', s: 493.88, a: 349.23, t: 293.66, b: 146.83, dur: 2.3 },
      { name: 'G', s: 392.00, a: 313.59, t: 246.94, b: 98.00, dur: 3.5 },
    ]
  },
  {
    name: 'maisha_ya_mwanadamu',
    key: 'Em',
    tempo: 88,
    // E minor meditative prayer
    chords: [
      { name: 'Em', s: 329.63, a: 261.63, t: 196.00, b: 82.41, dur: 3.0 },
      { name: 'Am', s: 349.23, a: 293.66, t: 220.00, b: 110.00, dur: 3.0 },
      { name: 'B7', s: 369.99, a: 293.66, t: 246.94, b: 123.47, dur: 3.0 },
      { name: 'Em', s: 329.63, a: 246.94, t: 196.00, b: 82.41, dur: 3.0 },
      { name: 'C', s: 349.23, a: 261.63, t: 220.00, b: 130.81, dur: 3.0 },
      { name: 'D', s: 369.99, a: 293.66, t: 246.94, b: 146.83, dur: 3.0 },
      { name: 'Em', s: 329.63, a: 246.94, t: 196.00, b: 82.41, dur: 4.5 },
    ]
  },
  {
    name: 'ni_mzima',
    key: 'D',
    tempo: 112,
    // Festive Easter D Major
    chords: [
      { name: 'D', s: 440.00, a: 369.99, t: 293.66, b: 146.83, dur: 2.0 },
      { name: 'G', s: 493.88, a: 392.00, t: 293.66, b: 98.00, dur: 2.0 },
      { name: 'A', s: 554.37, a: 440.00, t: 329.63, b: 110.00, dur: 2.0 },
      { name: 'D', s: 440.00, a: 369.99, t: 293.66, b: 146.83, dur: 2.0 },
      { name: 'Bm', s: 493.88, a: 369.99, t: 293.66, b: 123.47, dur: 2.0 },
      { name: 'G', s: 440.00, a: 392.00, t: 293.66, b: 98.00, dur: 2.0 },
      { name: 'A7', s: 554.37, a: 440.00, t: 329.63, b: 110.00, dur: 2.0 },
      { name: 'D', s: 440.00, a: 369.99, t: 293.66, b: 146.83, dur: 3.5 },
    ]
  },
  {
    name: 'mungu_tuzungumze_faragha',
    key: 'F',
    tempo: 82,
    // F Major contemplative prayer
    chords: [
      { name: 'F', s: 349.23, a: 261.63, t: 220.00, b: 87.31, dur: 3.2 },
      { name: 'Bb', s: 392.00, a: 293.66, t: 233.08, b: 116.54, dur: 3.2 },
      { name: 'C', s: 440.00, a: 329.63, t: 261.63, b: 130.81, dur: 3.2 },
      { name: 'Dm', s: 392.00, a: 293.66, t: 220.00, b: 146.83, dur: 3.2 },
      { name: 'Gm', s: 392.00, a: 293.66, t: 233.08, b: 98.00, dur: 3.2 },
      { name: 'C7', s: 440.00, a: 329.63, t: 261.63, b: 130.81, dur: 3.2 },
      { name: 'F', s: 349.23, a: 261.63, t: 220.00, b: 87.31, dur: 4.5 },
    ]
  }
];

function generateVocalHarmonic(f, t, vibratoRate = 5.2, vibratoDepth = 0.006) {
  const vib = 1 + Math.sin(2 * Math.PI * vibratoRate * t) * vibratoDepth;
  const freq = f * vib;
  // Vocal formant synthesis (rich fundamental + warm odd/even choir harmonics)
  let val = 0.6 * Math.sin(2 * Math.PI * freq * t);
  val += 0.3 * Math.sin(2 * Math.PI * 2 * freq * t);
  val += 0.2 * Math.sin(2 * Math.PI * 3 * freq * t);
  val += 0.1 * Math.sin(2 * Math.PI * 4 * freq * t);
  val += 0.05 * Math.sin(2 * Math.PI * 5 * freq * t);
  return val;
}

function generateOrganHarmonic(f, t) {
  // Pipe organ flute & diapason stops
  let val = 0.5 * Math.sin(2 * Math.PI * f * t);
  val += 0.35 * Math.sin(2 * Math.PI * 2 * f * t);
  val += 0.15 * Math.sin(2 * Math.PI * 3 * f * t);
  val += 0.08 * Math.sin(2 * Math.PI * 4 * f * t);
  return val;
}

const outDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

songs.forEach(song => {
  // Calculate total seconds (loop twice for full length ~35-45s preview)
  const loopCount = 2;
  const loopSec = song.chords.reduce((acc, c) => acc + c.dur, 0);
  const totalSec = loopSec * loopCount + 1.5;
  const totalSamples = Math.floor(totalSec * sampleRate);

  const leftChannel = new Float32Array(totalSamples);
  const rightChannel = new Float32Array(totalSamples);

  let currentTime = 0;
  for (let loop = 0; loop < loopCount; loop++) {
    for (const chord of song.chords) {
      const chordStart = currentTime;
      const chordDur = chord.dur;
      const startSample = Math.floor(chordStart * sampleRate);
      const chordSamples = Math.floor(chordDur * sampleRate);

      for (let i = 0; i < chordSamples && (startSample + i) < totalSamples; i++) {
        const t = (startSample + i) / sampleRate;
        const noteT = i / sampleRate;

        // Envelope: smooth soft choral attack and gentle release
        const attack = Math.min(1, noteT / 0.18);
        const release = Math.min(1, (chordDur - noteT) / 0.22);
        const env = Math.max(0, attack * release);

        // SATB Voices with distinct spatial pan
        const soprano = generateVocalHarmonic(chord.s, t, 5.4, 0.007) * env * 0.26;
        const alto = generateVocalHarmonic(chord.a, t, 5.1, 0.005) * env * 0.23;
        const tenor = generateVocalHarmonic(chord.t, t, 4.9, 0.006) * env * 0.23;
        const bass = generateVocalHarmonic(chord.b, t, 4.6, 0.004) * env * 0.32;

        // Pipe organ pedal & accompaniment
        const organBass = generateOrganHarmonic(chord.b / 2, t) * env * 0.15;
        const organChords = (generateOrganHarmonic(chord.t, t) + generateOrganHarmonic(chord.s, t)) * env * 0.08;

        // Stereo pan: Soprano (right 60%), Alto (right 25%), Tenor (left 30%), Bass (center-left 15%)
        const left = (soprano * 0.35) + (alto * 0.45) + (tenor * 0.65) + (bass * 0.55) + organBass + organChords;
        const right = (soprano * 0.65) + (alto * 0.55) + (tenor * 0.35) + (bass * 0.45) + organBass + organChords;

        leftChannel[startSample + i] += left;
        rightChannel[startSample + i] += right;
      }
      currentTime += chordDur;
    }
  }

  // Simple cathedral reverberation comb filter
  const delaySamples1 = Math.floor(0.085 * sampleRate);
  const delaySamples2 = Math.floor(0.140 * sampleRate);
  const reverbDecay = 0.38;

  for (let i = 0; i < totalSamples; i++) {
    if (i >= delaySamples1) {
      leftChannel[i] += rightChannel[i - delaySamples1] * reverbDecay;
    }
    if (i >= delaySamples2) {
      rightChannel[i] += leftChannel[i - delaySamples2] * reverbDecay;
    }
  }

  // Convert to 16-bit PCM WAV
  const numChannels = 2;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = totalSamples * blockAlign;

  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    // Soft limiter clipping protection
    let l = Math.max(-0.95, Math.min(0.95, leftChannel[i]));
    let r = Math.max(-0.95, Math.min(0.95, rightChannel[i]));

    const intL = Math.floor(l * 32767);
    const intR = Math.floor(r * 32767);

    buffer.writeInt16LE(intL, offset);
    buffer.writeInt16LE(intR, offset + 2);
    offset += 4;
  }

  const wavPath = path.join(outDir, `${song.name}.wav`);
  const mp3Path = path.join(outDir, `${song.name}.mp3`);
  fs.writeFileSync(wavPath, buffer);

  try {
    // Convert to mp3 using ffmpeg
    execSync(`ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -qscale:a 2 "${mp3Path}" 2>/dev/null`);
    fs.unlinkSync(wavPath);
    console.log(`Generated MP3: ${mp3Path}`);
  } catch (err) {
    console.error(`FFmpeg failed for ${song.name}`, err);
  }
});
