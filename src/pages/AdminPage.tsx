import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Song, SheetMusicItem, ChoirLeader, ChoirGroupPhoto, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../data/choirContent';
import { 
  ShieldCheck, 
  Music, 
  FileText, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  ExternalLink,
  Play,
  Save,
  Youtube
} from 'lucide-react';
import { ChoirLogo } from '../components/ChoirLogo';

interface AdminPageProps {
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateHome }) => {
  const {
    lang,
    songs,
    addSong,
    updateSong,
    deleteSong,
    sheetMusicList,
    addSheetMusic,
    updateSheetMusic,
    deleteSheetMusic,
    leadersList,
    addLeader,
    updateLeader,
    deleteLeader,
    groupPhotosList,
    addGroupPhoto,
    deleteGroupPhoto,
    resetToDefaults,
    exportDataJson,
    importDataJson,
    playSong
  } = useChoir();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('st_monica_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'songs' | 'sheet' | 'leaders' | 'photos' | 'backup'>('songs');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'sec58nakuru' || passcode.trim() === 'stmonica2026') {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('st_monica_admin_auth', 'true');
      } catch (e) {
        // ignore
      }
      setAuthError('');
    } else {
      setAuthError(lang === 'sw' ? 'Nenosiri si sahihi. Jaribu tena.' : 'Invalid passcode. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('st_monica_admin_auth');
    } catch (e) {
      // ignore
    }
    onNavigateHome();
  };

  const notify = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  // Song Form Modal State
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [songForm, setSongForm] = useState({
    title: '',
    titleSwahili: '',
    album: 'Nyimbo za Kiliturujia za SEC 58',
    composer: '',
    year: 2024,
    season: 'Ordinary Time' as Song['season'],
    seasonSwahili: 'Wakati wa Kawaida',
    partOfMass: 'Communion' as Song['partOfMass'],
    partOfMassSwahili: 'Wimbo wa Ekaristi',
    language: 'Kiswahili',
    voicing: 'SATB Polyphony',
    musicalKey: 'F Major',
    duration: '4:20',
    youtubeUrl: YOUTUBE_CHANNEL_URL,
    audioPreviewUrl: 'preview.mp3',
    sheetMusicAvailable: true,
    scorePriceKes: 300,
    lyricsSwahiliText: '',
    lyricsEnglishText: ''
  });

  const openAddSongModal = () => {
    setEditingSongId(null);
    setSongForm({
      title: '',
      titleSwahili: '',
      album: 'Nyimbo za Kiliturujia za SEC 58',
      composer: 'St. Monica Choir',
      year: 2024,
      season: 'Ordinary Time',
      seasonSwahili: 'Wakati wa Kawaida',
      partOfMass: 'Entrance',
      partOfMassSwahili: 'Wimbo wa Kuingia',
      language: 'Kiswahili',
      voicing: 'SATB',
      musicalKey: 'G Major',
      duration: '4:15',
      youtubeUrl: YOUTUBE_CHANNEL_URL,
      audioPreviewUrl: 'preview.mp3',
      sheetMusicAvailable: true,
      scorePriceKes: 300,
      lyricsSwahiliText: '1. Maneno ya Kiswahili...\nKiitikio: Sala yetu hekaluni...',
      lyricsEnglishText: '1. English translation...\nRefrain: Our holy prayer...'
    });
    setIsSongModalOpen(true);
  };

  const openEditSongModal = (song: Song) => {
    setEditingSongId(song.id);
    setSongForm({
      title: song.title,
      titleSwahili: song.titleSwahili,
      album: song.album,
      composer: song.composer,
      year: song.year,
      season: song.season,
      seasonSwahili: song.seasonSwahili,
      partOfMass: song.partOfMass,
      partOfMassSwahili: song.partOfMassSwahili,
      language: song.language,
      voicing: song.voicing,
      musicalKey: song.musicalKey,
      duration: song.duration,
      youtubeUrl: song.youtubeUrl,
      audioPreviewUrl: song.audioPreviewUrl,
      sheetMusicAvailable: song.sheetMusicAvailable,
      scorePriceKes: song.scorePriceKes,
      lyricsSwahiliText: song.lyricsSwahili?.join('\n') || '',
      lyricsEnglishText: song.lyricsEnglish?.join('\n') || ''
    });
    setIsSongModalOpen(true);
  };

  const handleSaveSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songForm.title.trim()) return;

    const lyricsSwahili = songForm.lyricsSwahiliText
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    const lyricsEnglish = songForm.lyricsEnglishText
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    const songPayload = {
      title: songForm.title.trim(),
      titleSwahili: songForm.titleSwahili.trim() || songForm.title.trim(),
      album: songForm.album.trim(),
      composer: songForm.composer.trim() || 'Traditional',
      year: Number(songForm.year) || 2024,
      season: songForm.season,
      seasonSwahili: songForm.seasonSwahili.trim(),
      partOfMass: songForm.partOfMass,
      partOfMassSwahili: songForm.partOfMassSwahili.trim(),
      language: songForm.language.trim(),
      voicing: songForm.voicing.trim(),
      musicalKey: songForm.musicalKey.trim(),
      duration: songForm.duration.trim() || '4:00',
      youtubeUrl: songForm.youtubeUrl.trim() || YOUTUBE_CHANNEL_URL,
      audioPreviewUrl: songForm.audioPreviewUrl.trim() || 'preview.mp3',
      sheetMusicAvailable: songForm.sheetMusicAvailable,
      scorePriceKes: Number(songForm.scorePriceKes) || 300,
      lyricsSwahili: lyricsSwahili.length ? lyricsSwahili : ['Wimbo wa kwaya ya Mtakatifu Monica SEC 58.'],
      lyricsEnglish: lyricsEnglish.length ? lyricsEnglish : ['Hymn of St. Monica Choir SEC 58.'],
      waveformPeaks: [40, 60, 50, 80, 95, 70, 85, 90, 75, 60, 85, 70, 80, 90, 60, 40, 70, 85, 90, 50, 65, 80, 45, 30]
    };

    if (editingSongId) {
      updateSong(editingSongId, songPayload);
      notify(`Song "${songPayload.title}" updated successfully!`);
    } else {
      addSong(songPayload);
      notify(`New song "${songPayload.title}" added to repertoire!`);
    }
    setIsSongModalOpen(false);
  };

  // Sheet Music Form Modal State
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [sheetForm, setSheetForm] = useState({
    title: '',
    titleSw: '',
    composer: '',
    notationType: 'Tonic Sol-fa & Staff' as SheetMusicItem['notationType'],
    voicing: 'SATB Choir & Organ',
    partOfMass: 'Communion',
    season: 'Ordinary Time',
    priceKes: 300,
    priceUsd: 2.50,
    description: '',
    descriptionSw: '',
    downloadUrl: '#'
  });

  const openAddSheetModal = () => {
    setEditingSheetId(null);
    setSheetForm({
      title: '',
      titleSw: '',
      composer: 'St. Monica Choir',
      notationType: 'Tonic Sol-fa & Staff',
      voicing: 'SATB Choir',
      partOfMass: 'Entrance',
      season: 'Ordinary Time',
      priceKes: 300,
      priceUsd: 2.50,
      description: 'Complete 4-part SATB vocal sheet music in PDF format with tonic sol-fa and staff notation.',
      descriptionSw: 'Noti kamili za sauti nne (SATB) zenye solfa na stafu kwa muundo wa PDF kwa walimu wa kwaya.',
      downloadUrl: '#'
    });
    setIsSheetModalOpen(true);
  };

  const openEditSheetModal = (item: SheetMusicItem) => {
    setEditingSheetId(item.id);
    setSheetForm({
      title: item.title,
      titleSw: item.titleSw,
      composer: item.composer,
      notationType: item.notationType,
      voicing: item.voicing,
      partOfMass: item.partOfMass,
      season: item.season,
      priceKes: item.priceKes,
      priceUsd: item.priceUsd,
      description: item.description,
      descriptionSw: item.descriptionSw,
      downloadUrl: item.downloadUrl || '#'
    });
    setIsSheetModalOpen(true);
  };

  const handleSaveSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetForm.title.trim()) return;

    const payload = {
      title: sheetForm.title.trim(),
      titleSw: sheetForm.titleSw.trim() || sheetForm.title.trim(),
      composer: sheetForm.composer.trim() || 'St. Monica Choir',
      notationType: sheetForm.notationType,
      voicing: sheetForm.voicing.trim(),
      partOfMass: sheetForm.partOfMass.trim(),
      season: sheetForm.season.trim(),
      priceKes: Number(sheetForm.priceKes) || 300,
      priceUsd: Number(sheetForm.priceUsd) || 2.50,
      description: sheetForm.description.trim(),
      descriptionSw: sheetForm.descriptionSw.trim() || sheetForm.description.trim(),
      downloadUrl: sheetForm.downloadUrl.trim() || '#'
    };

    if (editingSheetId) {
      updateSheetMusic(editingSheetId, payload);
      notify(`Sheet music "${payload.title}" updated!`);
    } else {
      addSheetMusic(payload);
      notify(`New score "${payload.title}" added for sale!`);
    }
    setIsSheetModalOpen(false);
  };

  // Leader Form State
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [leaderForm, setLeaderForm] = useState({
    name: '',
    role: '',
    roleSw: '',
    category: 'trainer' as 'trainer' | 'official',
    responsibility: '',
    responsibilitySw: '',
    tenure: 'Serving since 2020',
    tenureSw: 'Anahudumu tangu 2020',
    contact: ''
  });

  const openAddLeaderModal = () => {
    setEditingLeaderId(null);
    setLeaderForm({
      name: '',
      role: '',
      roleSw: '',
      category: 'trainer',
      responsibility: '',
      responsibilitySw: '',
      tenure: 'Serving since 2024',
      tenureSw: 'Anahudumu tangu 2024',
      contact: ''
    });
    setIsLeaderModalOpen(true);
  };

  const openEditLeaderModal = (leader: ChoirLeader) => {
    setEditingLeaderId(leader.id);
    setLeaderForm({
      name: leader.name,
      role: leader.role,
      roleSw: leader.roleSw,
      category: leader.category,
      responsibility: leader.responsibility,
      responsibilitySw: leader.responsibilitySw,
      tenure: leader.tenure,
      tenureSw: leader.tenureSw,
      contact: leader.contact || ''
    });
    setIsLeaderModalOpen(true);
  };

  const handleSaveLeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderForm.name.trim()) return;

    const payload = {
      name: leaderForm.name.trim(),
      role: leaderForm.role.trim(),
      roleSw: leaderForm.roleSw.trim() || leaderForm.role.trim(),
      category: leaderForm.category,
      responsibility: leaderForm.responsibility.trim(),
      responsibilitySw: leaderForm.responsibilitySw.trim() || leaderForm.responsibility.trim(),
      tenure: leaderForm.tenure.trim(),
      tenureSw: leaderForm.tenureSw.trim() || leaderForm.tenure.trim(),
      contact: leaderForm.contact.trim()
    };

    if (editingLeaderId) {
      updateLeader(editingLeaderId, payload);
      notify(`Official/Trainer "${payload.name}" updated!`);
    } else {
      addLeader(payload);
      notify(`New Official/Trainer "${payload.name}" recognized!`);
    }
    setIsLeaderModalOpen(false);
  };

  // Group Photo Form State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    title: '',
    titleSw: '',
    description: '',
    descriptionSw: '',
    year: '2024',
    imageKey: 'choir_singing_moment' as ChoirGroupPhoto['imageKey'],
    customUrl: '',
    occasion: 'Sunday High Mass',
    occasionSw: 'Misa Kuu ya Jumapili'
  });

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title.trim()) return;

    addGroupPhoto({
      title: photoForm.title.trim(),
      titleSw: photoForm.titleSw.trim() || photoForm.title.trim(),
      description: photoForm.description.trim(),
      descriptionSw: photoForm.descriptionSw.trim() || photoForm.description.trim(),
      year: photoForm.year.trim() || '2024',
      imageKey: photoForm.imageKey,
      customUrl: photoForm.customUrl.trim(),
      occasion: photoForm.occasion.trim(),
      occasionSw: photoForm.occasionSw.trim() || photoForm.occasion.trim()
    });
    notify(`Group photo "${photoForm.title}" added to choir gallery!`);
    setIsPhotoModalOpen(false);
  };

  // Backup / JSON Export & Import
  const handleExportJson = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `st_monica_choir_data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Choir data backup exported successfully!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const ok = importDataJson(content);
      if (ok) {
        notify('Choir data restored successfully from backup!');
      } else {
        alert('Invalid JSON file format. Please check the backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to restore original default songs, sheet music, and choir officials? Any custom edits will be reset.')) {
      resetToDefaults();
      notify('All data restored to verified default St. Monica Section 58 choir catalog.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-[#0C2340]/15 rounded-3xl shadow-xl space-y-6 text-center animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-[#0C2340] text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-8 h-8 text-[#7EC8F0]" />
        </div>

        <div>
          <h2 className="font-fraunces text-2xl font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Tovuti ya Msimamizi' : 'Choir Admin Access'}
          </h2>
          <p className="text-sm text-slate-600 font-source mt-1">
            {lang === 'sw' 
              ? 'Weka nenosiri la kamati ya kwaya ili kuendelea (Trainer & Official Portal)' 
              : 'Enter authorized choirmaster/official passcode to manage repertoire and website content.'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1">
              {lang === 'sw' ? 'Nenosiri la Msimamizi' : 'Admin Passcode'}
            </label>
            <input
              type="password"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
              autoFocus
            />
          </div>

          {authError && (
            <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
              {authError}
            </p>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3 text-sm font-bold text-white bg-[#1058A8] hover:bg-[#0C4685] rounded-xl transition-all shadow-md cursor-pointer"
            >
              {lang === 'sw' ? 'Ingia Mfumo' : 'Unlock Admin Portal'}
            </button>
            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              {lang === 'sw' ? 'Rudi Nyumbani' : 'Return to Website'}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-slate-400 font-source border-t border-slate-100 pt-3">
          St. Monica Catholic Choir · Section 58 Nakuru · CDDN
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner & Header */}
      <div className="bg-[#0C2340] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <ChoirLogo size={58} className="ring-2 ring-[#7EC8F0] shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1058A8] text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold tracking-wider">
                ADMIN PORTAL · MSIMAMIZI
              </span>
              <span className="text-xs text-[#7EC8F0] font-mono">
                SEC 58 NAKURU
              </span>
            </div>
            <h1 className="font-fraunces text-2xl sm:text-3xl font-bold text-white mt-1">
              Choir Management & Content Control
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-source mt-0.5">
              Add, edit, and update choir songs, sheet music prices, trainers, officials, and group photos. Changes update live immediately!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors cursor-pointer"
          >
            {lang === 'sw' ? 'Ondoka' : 'Log Out'}
          </button>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Youtube className="w-4 h-4 fill-current" />
            <span>YouTube Channel</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>

          <button
            onClick={onNavigateHome}
            className="px-4 py-2 text-xs font-bold text-[#0C2340] bg-white hover:bg-[#EAF4FB] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            View Live Website
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-400 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-[#0C2340]/10 p-1.5 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab('songs')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'songs'
              ? 'bg-[#1058A8] text-white shadow-2xs'
              : 'text-[#0C2340]/80 hover:bg-[#EAF4FB]'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Songs & YouTube ({songs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sheet')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'sheet'
              ? 'bg-[#1058A8] text-white shadow-2xs'
              : 'text-[#0C2340]/80 hover:bg-[#EAF4FB]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Sheet Music & Noti on Sale ({sheetMusicList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leaders')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'leaders'
              ? 'bg-[#1058A8] text-white shadow-2xs'
              : 'text-[#0C2340]/80 hover:bg-[#EAF4FB]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Trainers & Officials ({leadersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'photos'
              ? 'bg-[#1058A8] text-white shadow-2xs'
              : 'text-[#0C2340]/80 hover:bg-[#EAF4FB]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Group Photos & Gallery ({groupPhotosList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'backup'
              ? 'bg-[#1058A8] text-white shadow-2xs'
              : 'text-[#0C2340]/80 hover:bg-[#EAF4FB]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Backup & Reset</span>
        </button>
      </div>

      {/* TAB 1: SONGS MANAGEMENT */}
      {activeTab === 'songs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-fraunces text-xl sm:text-2xl font-bold text-[#0C2340]">
                Choir Repertoire & YouTube Releases
              </h2>
              <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
                Manage all hymns shown on the music page, player, and linked to the official YouTube channel ({YOUTUBE_CHANNEL_HANDLE}).
              </p>
            </div>
            <button
              onClick={openAddSongModal}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Song</span>
            </button>
          </div>

          <div className="bg-white border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-source">
                <thead className="bg-[#F8FAFC] border-b border-[#0C2340]/10 text-[#0C2340]/70 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Title & Swahili</th>
                    <th className="py-3 px-4">Composer</th>
                    <th className="py-3 px-4">Part / Season</th>
                    <th className="py-3 px-4">Voicing & Key</th>
                    <th className="py-3 px-4">YouTube</th>
                    <th className="py-3 px-4">Score Sale</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0C2340]/5">
                  {songs.map((song) => (
                    <tr key={song.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                      <td className="py-3 px-4 font-medium">
                        <div className="font-bold text-[#0C2340] font-fraunces text-sm">{song.title}</div>
                        {song.titleSwahili !== song.title && (
                          <div className="text-[11px] text-[#0C2340]/60 italic">{song.titleSwahili}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#0C2340]/80">
                        {song.composer} ({song.year})
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-[#EAF4FB] text-[#1058A8] px-2 py-0.5 rounded text-[10px] font-bold">
                          {song.partOfMass}
                        </span>
                        <div className="text-[10px] text-[#0C2340]/60 mt-0.5">{song.season}</div>
                      </td>
                      <td className="py-3 px-4 text-[#0C2340]/70 font-mono text-[11px]">
                        {song.voicing} · {song.musicalKey}
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={song.youtubeUrl || YOUTUBE_CHANNEL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 text-[11px]"
                        >
                          <Youtube className="w-3.5 h-3.5" />
                          <span>Watch</span>
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        {song.sheetMusicAvailable ? (
                          <span className="text-emerald-700 font-bold text-[11px]">
                            KES {song.scorePriceKes}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No score</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => playSong(song)}
                            title="Preview Song"
                            className="p-1.5 text-[#1058A8] hover:bg-[#EAF4FB] rounded-lg cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button
                            onClick={() => openEditSongModal(song)}
                            title="Edit Song"
                            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete song "${song.title}"?`)) {
                                deleteSong(song.id);
                                notify(`Song "${song.title}" removed.`);
                              }
                            }}
                            title="Delete Song"
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHEET MUSIC & NOTI ON SALE */}
      {activeTab === 'sheet' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-fraunces text-xl sm:text-2xl font-bold text-[#0C2340]">
                Sheet Music & Noti za Nyimbo on Sale
              </h2>
              <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
                Vocal scores (Tonic Sol-fa and Staff notation) available for choirmasters to purchase via M-Pesa.
              </p>
            </div>
            <button
              onClick={openAddSheetModal}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sheet Music Score</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sheetMusicList.map((item) => (
              <div key={item.id} className="p-5 bg-white border border-[#0C2340]/10 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#EAF4FB] text-[#1058A8] font-bold text-[10px] px-2 py-0.5 rounded font-mono uppercase">
                      {item.notationType}
                    </span>
                    <span className="text-base font-bold font-fraunces text-[#1058A8]">
                      KES {item.priceKes}
                    </span>
                  </div>

                  <h3 className="font-fraunces text-base font-bold text-[#0C2340] leading-snug">
                    {item.title}
                  </h3>
                  <div className="text-xs text-[#0C2340]/70 font-source">
                    Mtunzi: <strong>{item.composer}</strong> · {item.voicing}
                  </div>
                  <p className="text-xs text-[#0C2340]/75 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0C2340]/10 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditSheetModal(item)}
                    className="px-3 py-1 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] hover:bg-[#7EC8F0]/30 rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3 text-[#1058A8]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete sheet music "${item.title}"?`)) {
                        deleteSheetMusic(item.id);
                        notify(`Score "${item.title}" removed.`);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TRAINERS & OFFICIALS (LEADERSHIP) */}
      {activeTab === 'leaders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-fraunces text-xl sm:text-2xl font-bold text-[#0C2340]">
                Trainers & Officials Recognition
              </h2>
              <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
                Only trainers and executive officials are recognized here (per choir leadership constitution).
              </p>
            </div>
            <button
              onClick={openAddLeaderModal}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Trainer / Official</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leadersList.map((leader) => (
              <div key={leader.id} className="p-5 bg-white border border-[#0C2340]/10 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#EAF4FB] border border-[#7EC8F0]/40 flex items-center justify-center font-fraunces font-bold text-lg text-[#1058A8]">
                      {leader.name.split(' ').slice(-1)[0][0]}
                    </div>
                    <div>
                      <h3 className="font-fraunces text-base font-bold text-[#0C2340]">{leader.name}</h3>
                      <span className="text-xs font-bold text-[#1058A8] block">{leader.role}</span>
                      <span className="text-[11px] text-[#0C2340]/50 font-mono">{leader.tenure}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                    leader.category === 'trainer' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {leader.category}
                  </span>
                </div>

                <p className="text-xs text-[#0C2340]/80 leading-relaxed pt-2 border-t border-[#0C2340]/5">
                  {leader.responsibility}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#0C2340]/60 font-mono text-[11px]">{leader.contact || 'SEC 58 Parish'}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditLeaderModal(leader)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] hover:bg-[#7EC8F0]/30 rounded-lg cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete leader "${leader.name}"?`)) {
                          deleteLeader(leader.id);
                          notify(`Leader "${leader.name}" removed.`);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GROUP PHOTOS & GALLERY */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-fraunces text-xl sm:text-2xl font-bold text-[#0C2340]">
                Choir Group Gallery & Ministry Photos
              </h2>
              <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
                Group photos of the whole choir ensemble in vestments and parish ministry.
              </p>
            </div>
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Group Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groupPhotosList.map((photo) => (
              <div key={photo.id} className="bg-white border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                <div className="aspect-16/10 bg-[#EAF4FB] relative overflow-hidden flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-[#1058A8]/40" />
                  <span className="absolute top-2 left-2 bg-[#0C2340] text-white font-mono text-[10px] px-2 py-0.5 rounded">
                    {photo.year}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-fraunces font-bold text-[#0C2340] text-sm">{photo.title}</h4>
                  <span className="text-[11px] text-[#1058A8] font-bold block">{photo.occasion}</span>
                  <p className="text-xs text-[#0C2340]/70 font-source leading-relaxed">
                    {photo.description}
                  </p>
                </div>
                <div className="p-3 border-t border-[#0C2340]/5 flex justify-end">
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete photo "${photo.title}"?`)) {
                        deleteGroupPhoto(photo.id);
                        notify(`Photo removed from gallery.`);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP & DATA RESET */}
      {activeTab === 'backup' && (
        <div className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
          <div>
            <h2 className="font-fraunces text-xl sm:text-2xl font-bold text-[#0C2340]">
              Data Backup & Storage Control
            </h2>
            <p className="text-xs sm:text-sm text-[#0C2340]/70 font-source mt-1">
              All songs, sheet music items, trainers, and group photos are stored securely in browser storage. You can export a JSON backup file to keep on your computer or import to sync across devices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Export */}
            <div className="p-5 rounded-2xl border border-[#0C2340]/10 space-y-3 bg-[#F8FAFC]">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1058A8] flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-fraunces font-bold text-[#0C2340] text-base">Export JSON Backup</h3>
              <p className="text-xs text-[#0C2340]/70">
                Download a complete JSON file containing all customized songs, sheet music, officials, and photos.
              </p>
              <button
                onClick={handleExportJson}
                className="w-full py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Download Backup File
              </button>
            </div>

            {/* Import */}
            <div className="p-5 rounded-2xl border border-[#0C2340]/10 space-y-3 bg-[#F8FAFC]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="font-fraunces font-bold text-[#0C2340] text-base">Restore from JSON</h3>
              <p className="text-xs text-[#0C2340]/70">
                Upload a previously saved JSON backup file to restore all choir data instantly.
              </p>
              <label className="w-full py-2.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl cursor-pointer text-center block transition-colors">
                <span>Select JSON File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset */}
            <div className="p-5 rounded-2xl border border-red-200 space-y-3 bg-red-50/50">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-fraunces font-bold text-red-900 text-base">Reset to Verified Catalog</h3>
              <p className="text-xs text-red-700/80">
                Restore the default catalog of St. Monica Choir Section 58 Nakuru with real YouTube releases.
              </p>
              <button
                onClick={handleResetDefaults}
                className="w-full py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SONG */}
      {isSongModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0C2340]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#0C2340]/10">
              <div>
                <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
                  {editingSongId ? 'Edit Song Details' : 'Add New Song to Catalog'}
                </h3>
                <span className="text-xs text-[#1058A8] font-mono">
                  {editingSongId ? `Editing ID: ${editingSongId}` : 'St. Monica Choir Repertoire'}
                </span>
              </div>
              <button
                onClick={() => setIsSongModalOpen(false)}
                className="p-2 text-[#0C2340]/60 hover:text-[#0C2340] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSong} className="space-y-4 text-xs font-source">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Song Title (English / Standard) *</label>
                  <input
                    type="text"
                    required
                    value={songForm.title}
                    onChange={e => setSongForm({ ...songForm, title: e.target.value })}
                    placeholder="e.g. Tutangaze Fumbo La Imani"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Swahili Title (Jina la Kiswahili)</label>
                  <input
                    type="text"
                    value={songForm.titleSwahili}
                    onChange={e => setSongForm({ ...songForm, titleSwahili: e.target.value })}
                    placeholder="e.g. Tutangaze Fumbo La Imani"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Composer (Mtunzi) *</label>
                  <input
                    type="text"
                    required
                    value={songForm.composer}
                    onChange={e => setSongForm({ ...songForm, composer: e.target.value })}
                    placeholder="e.g. Sylvester Otieno"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Year</label>
                  <input
                    type="number"
                    value={songForm.year}
                    onChange={e => setSongForm({ ...songForm, year: Number(e.target.value) })}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Duration (m:ss)</label>
                  <input
                    type="text"
                    value={songForm.duration}
                    onChange={e => setSongForm({ ...songForm, duration: e.target.value })}
                    placeholder="4:30"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Part of Mass (Sehemu ya Misa)</label>
                  <select
                    value={songForm.partOfMass}
                    onChange={e => setSongForm({ 
                      ...songForm, 
                      partOfMass: e.target.value as any,
                      partOfMassSwahili: e.target.value === 'Entrance' ? 'Wimbo wa Kuingia' :
                                         e.target.value === 'Offertory' ? 'Wimbo wa Sadaka' :
                                         e.target.value === 'Communion' ? 'Wimbo wa Ekaristi' :
                                         e.target.value === 'Recessional' ? 'Wimbo wa Kutoka' : 'Wimbo wa Misa'
                    })}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  >
                    <option value="Entrance">Entrance (Kuingia)</option>
                    <option value="Kyrie & Gloria">Kyrie & Gloria (Utukufu)</option>
                    <option value="Offertory">Offertory (Sadaka)</option>
                    <option value="Communion">Communion (Ekaristi)</option>
                    <option value="Meditation">Meditation (Tafakari)</option>
                    <option value="Recessional">Recessional (Kutoka)</option>
                    <option value="Praise">Praise & Festival</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Liturgical Season</label>
                  <select
                    value={songForm.season}
                    onChange={e => setSongForm({ 
                      ...songForm, 
                      season: e.target.value as any,
                      seasonSwahili: e.target.value === 'Ordinary Time' ? 'Wakati wa Kawaida' :
                                     e.target.value === 'Advent' ? 'Majilio' :
                                     e.target.value === 'Lent' ? 'Kwaresima' :
                                     e.target.value === 'Easter' ? 'Pasaka' :
                                     e.target.value === 'Patronal' ? 'Sikukuu ya Somo (27 Agosti)' : 'Kipindi cha Liturujia'
                    })}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  >
                    <option value="Ordinary Time">Ordinary Time (Wakati wa Kawaida)</option>
                    <option value="Advent">Advent (Majilio)</option>
                    <option value="Lent">Lent (Kwaresima)</option>
                    <option value="Easter">Easter (Pasaka)</option>
                    <option value="Patronal">Patronal (Mtakatifu Monika - 27 Agosti)</option>
                    <option value="Marian">Marian (Bikira Maria)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">YouTube URL or Channel Link</label>
                <input
                  type="url"
                  value={songForm.youtubeUrl}
                  onChange={e => setSongForm({ ...songForm, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/@KwayayaMtakatifuMonicaSection5"
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="sheetAvail"
                    checked={songForm.sheetMusicAvailable}
                    onChange={e => setSongForm({ ...songForm, sheetMusicAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1058A8]"
                  />
                  <label htmlFor="sheetAvail" className="font-bold text-[#0C2340]">
                    Sheet Music Available for Purchase (KES)
                  </label>
                </div>
                {songForm.sheetMusicAvailable && (
                  <div>
                    <label className="block font-bold text-[#0C2340] mb-1">Score Price (KES)</label>
                    <input
                      type="number"
                      value={songForm.scorePriceKes}
                      onChange={e => setSongForm({ ...songForm, scorePriceKes: Number(e.target.value) })}
                      className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Lyrics (Kiswahili - 1 line per verse)</label>
                <textarea
                  rows={3}
                  value={songForm.lyricsSwahiliText}
                  onChange={e => setSongForm({ ...songForm, lyricsSwahiliText: e.target.value })}
                  placeholder="Mstari wa kwanza..."
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Lyrics (English Translation)</label>
                <textarea
                  rows={3}
                  value={songForm.lyricsEnglishText}
                  onChange={e => setSongForm({ ...songForm, lyricsEnglishText: e.target.value })}
                  placeholder="First verse line..."
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSongModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#0C2340] hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSongId ? 'Update Song' : 'Save Song'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SHEET MUSIC */}
      {isSheetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0C2340]/20">
            <div className="flex items-center justify-between pb-4 border-b border-[#0C2340]/10">
              <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
                {editingSheetId ? 'Edit Sheet Music Score' : 'Add Sheet Music on Sale'}
              </h3>
              <button onClick={() => setIsSheetModalOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-[#0C2340]/60" />
              </button>
            </div>

            <form onSubmit={handleSaveSheet} className="space-y-4 text-xs font-source">
              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Score Title *</label>
                <input
                  type="text"
                  required
                  value={sheetForm.title}
                  onChange={e => setSheetForm({ ...sheetForm, title: e.target.value })}
                  placeholder="e.g. Tutangaze Fumbo La Imani (SATB)"
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Composer *</label>
                  <input
                    type="text"
                    required
                    value={sheetForm.composer}
                    onChange={e => setSheetForm({ ...sheetForm, composer: e.target.value })}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Notation Format</label>
                  <select
                    value={sheetForm.notationType}
                    onChange={e => setSheetForm({ ...sheetForm, notationType: e.target.value as any })}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  >
                    <option value="Tonic Sol-fa & Staff">Tonic Sol-fa & Staff</option>
                    <option value="Tonic Sol-fa">Tonic Sol-fa Only</option>
                    <option value="Staff Notation">Staff Notation Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Price in KES *</label>
                  <input
                    type="number"
                    required
                    value={sheetForm.priceKes}
                    onChange={e => setSheetForm({ ...sheetForm, priceKes: Number(e.target.value) })}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Price in USD ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sheetForm.priceUsd}
                    onChange={e => setSheetForm({ ...sheetForm, priceUsd: Number(e.target.value) })}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={sheetForm.description}
                  onChange={e => setSheetForm({ ...sheetForm, description: e.target.value })}
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSheetModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#0C2340] hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Score</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT LEADER */}
      {isLeaderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0C2340]/20">
            <div className="flex items-center justify-between pb-4 border-b border-[#0C2340]/10">
              <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
                {editingLeaderId ? 'Edit Official / Trainer' : 'Recognize Trainer / Official'}
              </h3>
              <button onClick={() => setIsLeaderModalOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-[#0C2340]/60" />
              </button>
            </div>

            <form onSubmit={handleSaveLeader} className="space-y-4 text-xs font-source">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={leaderForm.name}
                    onChange={e => setLeaderForm({ ...leaderForm, name: e.target.value })}
                    placeholder="Mwalimu Polycarp Ochieng"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Classification</label>
                  <select
                    value={leaderForm.category}
                    onChange={e => setLeaderForm({ ...leaderForm, category: e.target.value as any })}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  >
                    <option value="trainer">Trainer / Choirmaster</option>
                    <option value="official">Choir Official</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Role Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={leaderForm.role}
                    onChange={e => setLeaderForm({ ...leaderForm, role: e.target.value })}
                    placeholder="Choirmaster & Trainer"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Role Title (Kiswahili)</label>
                  <input
                    type="text"
                    value={leaderForm.roleSw}
                    onChange={e => setLeaderForm({ ...leaderForm, roleSw: e.target.value })}
                    placeholder="Mwalimu wa Kwaya"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Responsibilities / Description</label>
                <textarea
                  rows={2}
                  value={leaderForm.responsibility}
                  onChange={e => setLeaderForm({ ...leaderForm, responsibility: e.target.value })}
                  placeholder="Oversees SATB rehearsals and Sunday High Mass..."
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Contact Email / Phone</label>
                <input
                  type="text"
                  value={leaderForm.contact}
                  onChange={e => setLeaderForm({ ...leaderForm, contact: e.target.value })}
                  placeholder="contact@stmonicachoirnakuru.org"
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLeaderModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#0C2340] hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Official</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GROUP PHOTO */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0C2340]/20">
            <div className="flex items-center justify-between pb-4 border-b border-[#0C2340]/10">
              <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
                Add Choir Group Photo
              </h3>
              <button onClick={() => setIsPhotoModalOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-[#0C2340]/60" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4 text-xs font-source">
              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={photoForm.title}
                  onChange={e => setPhotoForm({ ...photoForm, title: e.target.value })}
                  placeholder="St. Monica Choir in Full Vestments"
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Occasion / Event</label>
                  <input
                    type="text"
                    value={photoForm.occasion}
                    onChange={e => setPhotoForm({ ...photoForm, occasion: e.target.value })}
                    placeholder="Patronal Feast 27 August"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Year</label>
                  <input
                    type="text"
                    value={photoForm.year}
                    onChange={e => setPhotoForm({ ...photoForm, year: e.target.value })}
                    placeholder="2024"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Description / Caption</label>
                <textarea
                  rows={2}
                  value={photoForm.description}
                  onChange={e => setPhotoForm({ ...photoForm, description: e.target.value })}
                  placeholder="The whole 52-member choir gathered at the sanctuary steps..."
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#0C2340] hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
