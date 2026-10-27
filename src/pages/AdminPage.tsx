import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Song, SheetMusicItem, ChoirLeader, ChoirGroupPhoto, EventItem, CHOIR_STATS, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE } from '../data/choirContent';
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
  BookOpen,
  Table,
  FileSpreadsheet,
  Home,
  Church,
  Compass,
  KeyRound,
  Calendar,
  Clock,
  MapPin,
  Bell,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  Eye,
  Layers,
  Disc,
  DollarSign,
  Sparkles,
  Loader2
} from 'lucide-react';
import { RealYouTubeIcon } from '../components/RealYouTubeIcon';
import { ChoirLogo } from '../components/ChoirLogo';
import { AfricanGeometricBorder } from '../components/AfricanGeometricBorder';
import { LIBRARY_CATEGORIES, LibrarySong } from '../data/libraryData';
import { ImageUploadField } from '../components/ImageUploadField';
import { getAssetUrl } from '../utils/assetHelper';
import { AdminHomepageTab } from '../components/admin/AdminHomepageTab';
import { AdminMassesTab } from '../components/admin/AdminMassesTab';
import { AdminFooterTab } from '../components/admin/AdminFooterTab';
import { AdminAboutTab } from '../components/admin/AdminAboutTab';
import { AdminMembersTab } from '../components/admin/AdminMembersTab';
import { AdminAlbumsTab } from '../components/admin/AdminAlbumsTab';
import { AdminFinancialsTab } from '../components/admin/AdminFinancialsTab';
import { AdminCoreValuesTab } from '../components/admin/AdminCoreValuesTab';
import { MediaManager } from '../components/MediaManager';
import { triggerFileDownload } from '../utils/fileDownload';
import { supabase } from '../lib/supabase';

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
    updateGroupPhoto,
    deleteGroupPhoto,
    librarySongs,
    addLibrarySong,
    updateLibrarySong,
    deleteLibrarySong,
    bulkImportLibrarySongs,
    eventsList,
    addEvent,
    updateEvent,
    deleteEvent,
    choirStats,
    updateChoirStats,
    massSchedule,
    updateMassSchedule,
    siteNotice,
    updateSiteNotice,
    heroContent,
    updateHeroContent,
    resetToDefaults,
    exportDataJson,
    importDataJson,
    playSong,
    members,
    albums,
    transactions,
    coreValues
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

  const [mainCategory, setMainCategory] = useState<'home' | 'about' | 'music' | 'events' | 'financials' | 'settings'>('home');
  const [activeTab, setActiveTab] = useState<'members' | 'albums' | 'financials' | 'leaders' | 'library' | 'events' | 'photos' | 'songs' | 'sheet' | 'hero' | 'about' | 'schedule' | 'footer' | 'stats' | 'backup' | 'values'>('hero');
  const [photosSubView, setPhotosSubView] = useState<'gallery' | 'supabase'>('gallery');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isPhotoUploadingToSupabase, setIsPhotoUploadingToSupabase] = useState<boolean>(false);

  const handleSelectCategory = (cat: 'home' | 'about' | 'music' | 'events' | 'financials' | 'settings') => {
    setMainCategory(cat);
    if (cat === 'home') {
      if (!['hero', 'values', 'schedule'].includes(activeTab)) setActiveTab('hero');
    } else if (cat === 'about') {
      if (!['members', 'leaders', 'photos', 'about', 'stats'].includes(activeTab)) setActiveTab('members');
    } else if (cat === 'music') {
      if (!['library', 'albums', 'songs', 'sheet'].includes(activeTab)) setActiveTab('library');
    } else if (cat === 'events') {
      setActiveTab('events');
    } else if (cat === 'financials') {
      setActiveTab('financials');
    } else if (cat === 'settings') {
      if (!['footer', 'backup'].includes(activeTab)) setActiveTab('footer');
    }
  };

  const handleSelectTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (['hero', 'values', 'schedule'].includes(tab)) setMainCategory('home');
    else if (['about', 'members', 'leaders', 'photos', 'stats'].includes(tab)) setMainCategory('about');
    else if (['songs', 'albums', 'sheet', 'library'].includes(tab)) setMainCategory('music');
    else if (tab === 'events') setMainCategory('events');
    else if (tab === 'financials') setMainCategory('financials');
    else if (['footer', 'backup'].includes(tab)) setMainCategory('settings');
  };

  // Maktaba ya Noti Library Form State
  const [showLibModal, setShowLibModal] = useState<boolean>(false);
  const [editingLibSongId, setEditingLibSongId] = useState<string | null>(null);
  const [libTitle, setLibTitle] = useState('');
  const [libComposer, setLibComposer] = useState('');
  const [libLanguage, setLibLanguage] = useState<'Kiswahili' | 'English' | 'Latin' | 'Kikuyu' | 'Dholuo' | 'Kalenjin' | 'Other'>('Kiswahili');
  const [libCategories, setLibCategories] = useState<string[]>(['kuingia']);
  const [libVoices, setLibVoices] = useState<'SATB' | 'Unison' | 'Solo' | 'SSAA' | 'TTBB'>('SATB');
  const [libLyrics, setLibLyrics] = useState('');
  const [libPdfUrl, setLibPdfUrl] = useState('');
  const [libAudioUrl, setLibAudioUrl] = useState('');
  const [libNotesUrl, setLibNotesUrl] = useState('');
  const [libNotesFileName, setLibNotesFileName] = useState('');
  const [libMidiUrl, setLibMidiUrl] = useState('');
  const [libMidiFileName, setLibMidiFileName] = useState('');
  const [libSharingStatus, setLibSharingStatus] = useState<'Public domain' | 'Shared with permission' | 'Link only'>('Public domain');
  const [libPermissionGivenBy, setLibPermissionGivenBy] = useState('');
  const [libPermissionDate, setLibPermissionDate] = useState('');
  const [libExternalSourceUrl, setLibExternalSourceUrl] = useState('');
  const [showBulkSpreadsheetModal, setShowBulkSpreadsheetModal] = useState<boolean>(false);
  const [csvSpreadsheetText, setCsvSpreadsheetText] = useState('');

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'notes' | 'midi') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (type === 'notes') {
          setLibNotesUrl(reader.result);
          setLibNotesFileName(file.name);
          notify(`Uploaded sheet notes file: ${file.name}`);
        } else {
          setLibMidiUrl(reader.result);
          setLibMidiFileName(file.name);
          notify(`Uploaded MIDI file: ${file.name}`);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim().toLowerCase();
    if (clean === 'sec58nakuru' || clean === 'stmonica2026' || clean === 'admin' || clean === 'admin123') {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('st_monica_admin_auth', 'true');
      } catch (e) {
        // ignore
      }
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. Access denied. Please try "sec58nakuru" or "admin".');
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

  // 1. Hero Content & Announcements State
  const [heroForm, setHeroForm] = useState({
    headlineEn: heroContent?.headlineEn || 'Uniting hearts through sacred music',
    headlineSw: heroContent?.headlineSw || 'Kuunganisha mioyo kupitia muziki mtakatifu',
    subheadEn: heroContent?.subheadEn || 'St. Monica Third Mass Choir (Section 58, Nakuru)',
    subheadSw: heroContent?.subheadSw || 'Kwaya ya Misa ya Tatu, Mtakatifu Monika (Section 58 Nakuru)',
    scriptureEn: heroContent?.scriptureEn || heroContent?.verseEn || 'He who sings well prays twice.',
    scriptureSw: heroContent?.scriptureSw || heroContent?.verseSw || 'Aimbaye vizuri anasali mara mbili.',
    scriptureRef: heroContent?.scriptureRef || heroContent?.verseRef || 'St. Augustine of Hippo (Bishop & Doctor of the Church)',
    noticeEnabled: siteNotice?.enabled ?? true,
    noticeType: (siteNotice?.type || 'info') as 'info' | 'feast' | 'urgent',
    noticeBadgeEn: siteNotice?.badgeEn || 'Notice',
    noticeBadgeSw: siteNotice?.badgeSw || 'Tangazo',
    noticeTextEn: siteNotice?.textEn || 'Choir rehearsals every Wednesday & Friday at 5:30 PM.',
    noticeTextSw: siteNotice?.textSw || 'Mazoezi ya kwaya kila Jumatano na Ijumaa Saa 11:30 Jioni.'
  });

  const handleSaveHeroAndNotice = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroContent({
      headlineEn: heroForm.headlineEn.trim(),
      headlineSw: heroForm.headlineSw.trim(),
      subheadEn: heroForm.subheadEn.trim(),
      subheadSw: heroForm.subheadSw.trim(),
      verseEn: heroForm.scriptureEn.trim(),
      verseSw: heroForm.scriptureSw.trim(),
      verseRef: heroForm.scriptureRef.trim(),
      scriptureEn: heroForm.scriptureEn.trim(),
      scriptureSw: heroForm.scriptureSw.trim(),
      scriptureRef: heroForm.scriptureRef.trim()
    });
    updateSiteNotice({
      enabled: heroForm.noticeEnabled,
      type: heroForm.noticeType,
      badgeEn: heroForm.noticeBadgeEn.trim(),
      badgeSw: heroForm.noticeBadgeSw.trim(),
      textEn: heroForm.noticeTextEn.trim(),
      textSw: heroForm.noticeTextSw.trim()
    });
    notify(lang === 'sw' ? 'Mwanzo na Matangazo vimehifadhiwa!' : 'Hero headline & announcement notice updated!');
  };

  // 2. Choir Statistics & Ministry Numbers State
  const [statsForm, setStatsForm] = useState({
    membersCount: choirStats?.membersCount ?? 48,
    yearsServing: choirStats?.yearsServing ?? 14,
    repertoireCount: choirStats?.repertoireCount ?? 12,
    sundayMassesPerMonth: choirStats?.sundayMassesPerMonth ?? 4,
    foundedYear: choirStats?.foundedYear ?? 2012,
    parish: choirStats?.parish ?? "St. Monica's Catholic Church, Nakuru",
    churchAddress: choirStats?.churchAddress ?? "Section 58, Off Kanu Street, Nakuru, Kenya",
    mpesaTill: choirStats?.mpesaTill ?? "8421092"
  });

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    updateChoirStats({
      membersCount: Number(statsForm.membersCount) || 48,
      yearsServing: Number(statsForm.yearsServing) || 14,
      repertoireCount: Number(statsForm.repertoireCount) || 12,
      sundayMassesPerMonth: Number(statsForm.sundayMassesPerMonth) || 4,
      foundedYear: Number(statsForm.foundedYear) || 2012,
      parish: statsForm.parish.trim(),
      churchAddress: statsForm.churchAddress.trim(),
      mpesaTill: statsForm.mpesaTill.trim()
    });
    notify(lang === 'sw' ? 'Takwimu za Kwaya zimehifadhiwa kikamilifu!' : 'Choir statistics updated live!');
  };

  // 3. Liturgical Events Calendar State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    titleSw: '',
    dateDay: '27',
    dateMonth: 'AUG',
    fullDate: '27th August 2026',
    time: '10:00 AM – 1:00 PM',
    venue: "St. Monica's Catholic Church",
    city: 'Section 58, Nakuru',
    category: 'Feast Day',
    entryType: 'Free Entry',
    description: '',
    descriptionSw: '',
    isUpcoming: true
  });

  const openAddEventModal = () => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      titleSw: '',
      dateDay: '15',
      dateMonth: 'SEP',
      fullDate: 'Sunday, 10:00 AM',
      time: '10:00 AM – 1:00 PM',
      venue: "St. Monica's Catholic Church",
      city: 'Section 58, Nakuru',
      category: 'Solemn Mass',
      entryType: 'Free Entry',
      description: 'Solemn liturgy led by St. Monica Third Mass Choir.',
      descriptionSw: 'Misa ya sherehe ikiongozwa na Kwaya ya Mtakatifu Monika.',
      isUpcoming: true
    });
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (evt: EventItem) => {
    setEditingEventId(evt.id);
    setEventForm({
      title: evt.title,
      titleSw: evt.titleSw,
      dateDay: evt.dateDay,
      dateMonth: evt.dateMonth,
      fullDate: evt.fullDate,
      time: evt.time,
      venue: evt.venue,
      city: evt.city,
      category: evt.category,
      entryType: evt.entryType,
      description: evt.description,
      descriptionSw: evt.descriptionSw,
      isUpcoming: evt.isUpcoming ?? true
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;
    const payload = {
      title: eventForm.title.trim(),
      titleSw: eventForm.titleSw.trim() || eventForm.title.trim(),
      dateDay: eventForm.dateDay.trim(),
      dateMonth: eventForm.dateMonth.trim().toUpperCase(),
      fullDate: eventForm.fullDate.trim(),
      time: eventForm.time.trim(),
      venue: eventForm.venue.trim(),
      city: eventForm.city.trim(),
      category: eventForm.category.trim(),
      entryType: eventForm.entryType.trim(),
      description: eventForm.description.trim(),
      descriptionSw: eventForm.descriptionSw.trim() || eventForm.description.trim(),
      isUpcoming: eventForm.isUpcoming
    };
    if (editingEventId) {
      updateEvent(editingEventId, payload);
      notify(`Event "${payload.title}" updated!`);
    } else {
      addEvent(payload);
      notify(`New event "${payload.title}" added to calendar!`);
    }
    setIsEventModalOpen(false);
  };

  // 4. Song Repertoire State
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
    thumbnailUrl: '',
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
      thumbnailUrl: '',
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
      thumbnailUrl: song.thumbnailUrl || '',
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

    const lyricsSwahili = songForm.lyricsSwahiliText.split('\n').map(l => l.trim()).filter(Boolean);
    const lyricsEnglish = songForm.lyricsEnglishText.split('\n').map(l => l.trim()).filter(Boolean);

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
      thumbnailUrl: songForm.thumbnailUrl.trim() || undefined,
      sheetMusicAvailable: songForm.sheetMusicAvailable,
      scorePriceKes: Number(songForm.scorePriceKes) || 300,
      lyricsSwahili: lyricsSwahili.length ? lyricsSwahili : ['Wimbo wa kwaya ya Mtakatifu Monika SEC 58.'],
      lyricsEnglish: lyricsEnglish.length ? lyricsEnglish : ['Song of St. Monica Choir SEC 58.'],
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

  // 5. Sheet Music Form State
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
    downloadUrl: '#',
    previewImage: ''
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
      downloadUrl: '#',
      previewImage: ''
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
      downloadUrl: item.downloadUrl || '#',
      previewImage: item.previewImage || ''
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
      downloadUrl: sheetForm.downloadUrl.trim() || '#',
      previewImage: sheetForm.previewImage.trim() || undefined
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

  // 6. Leader Recognition State
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
    contact: '',
    photoUrl: ''
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
      contact: '',
      photoUrl: ''
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
      contact: leader.contact || '',
      photoUrl: leader.photoUrl || ''
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
      contact: leaderForm.contact.trim(),
      photoUrl: leaderForm.photoUrl.trim() || undefined
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

  // 7. Group Photos State & SUPABASE CLOUD UPLOADER
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
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

  const openAddPhotoModal = () => {
    setEditingPhotoId(null);
    setPhotoForm({
      title: '',
      titleSw: '',
      description: '',
      descriptionSw: '',
      year: '2024',
      imageKey: 'choir_singing_moment',
      customUrl: '',
      occasion: 'Sunday High Mass',
      occasionSw: 'Misa Kuu ya Jumapili'
    });
    setIsPhotoModalOpen(true);
  };

  const openEditPhotoModal = (photo: ChoirGroupPhoto) => {
    setEditingPhotoId(photo.id);
    setPhotoForm({
      title: photo.title,
      titleSw: photo.titleSw || photo.title,
      description: photo.description,
      descriptionSw: photo.descriptionSw || photo.description,
      year: photo.year,
      imageKey: photo.imageKey,
      customUrl: photo.customUrl || '',
      occasion: photo.occasion,
      occasionSw: photo.occasionSw || photo.occasion
    });
    setIsPhotoModalOpen(true);
  };

  // Direct Supabase Photo Uploader Handler
  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title.trim()) return;

    let finalImageUrl = photoForm.customUrl.trim();

    // If ImageUploadField provided a local base64/data URI, upload it to Supabase Storage
    if (finalImageUrl.startsWith('data:image/')) {
      try {
        setIsPhotoUploadingToSupabase(true);
        notify('Uploading image directly to Supabase Cloud...');

        // Convert data URL to Blob for Supabase binary upload
        const response = await fetch(finalImageUrl);
        const blob = await response.blob();

        const fileExt = blob.type.split('/')[1] || 'jpg';
        const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        // 1. Storage Upload to 'photos' bucket
        const { error: storageError } = await supabase.storage
          .from('photos')
          .upload(cleanFileName, blob, { contentType: blob.type, upsert: false });

        if (storageError) throw storageError;

        // 2. Obtain Public URL
        const { data: urlData } = supabase.storage
          .from('photos')
          .getPublicUrl(cleanFileName);

        finalImageUrl = urlData.publicUrl;

        // 3. Write row to Supabase 'gallery' table
        const { error: dbError } = await supabase
          .from('gallery')
          .insert([{ title: photoForm.title.trim(), image_url: finalImageUrl }]);

        if (dbError) throw dbError;

        notify('Photo saved in Supabase Storage & Database table!');
      } catch (err: any) {
        console.error('Supabase upload error:', err);
        alert(`Supabase upload failed: ${err.message}`);
        setIsPhotoUploadingToSupabase(false);
        return;
      } finally {
        setIsPhotoUploadingToSupabase(false);
      }
    }

    const payload = {
      title: photoForm.title.trim(),
      titleSw: photoForm.titleSw.trim() || photoForm.title.trim(),
      description: photoForm.description.trim(),
      descriptionSw: photoForm.descriptionSw.trim() || photoForm.description.trim(),
      year: photoForm.year.trim() || '2024',
      imageKey: photoForm.imageKey,
      customUrl: finalImageUrl,
      occasion: photoForm.occasion.trim(),
      occasionSw: photoForm.occasionSw.trim() || photoForm.occasion.trim()
    };

    if (editingPhotoId) {
      updateGroupPhoto(editingPhotoId, payload);
      notify(`Group photo "${payload.title}" updated in choir gallery!`);
    } else {
      addGroupPhoto(payload);
      notify(`Group photo "${payload.title}" added to choir gallery!`);
    }
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
        notify('Invalid JSON file format. Please check the backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  const handleResetDefaults = () => {
    resetToDefaults();
    setShowResetConfirmModal(false);
    notify(lang === 'sw' ? 'Maudhui yote yamerejeshwa kwenye rekodi asili za kwaya.' : 'All data restored to default choir catalog.');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto my-12 bg-white border border-[#0C2340]/15 rounded-3xl shadow-xl overflow-hidden animate-in fade-in duration-200">
        <AfricanGeometricBorder />

        <div className="p-8 sm:p-10 space-y-6 text-center">
          <div className="flex flex-col items-center">
            <ChoirLogo size={76} variant="simplified" className="mb-2 drop-shadow-xs" />
            <span className="text-[11px] font-bold text-[#1058A8] uppercase tracking-widest font-source">
              Catholic Diocese of Nakuru · Section 58 Parish
            </span>
            <h1 className="font-eb-garamond text-3xl font-bold text-[#0C2340] mt-1">
              Choir Administration Portal
            </h1>
            <span className="font-eb-garamond text-base text-[#1058A8] italic block font-medium">
              St. Monica Third Mass Choir · Leadership Desk
            </span>
          </div>

          <div className="bg-[#FAF8F5] border border-[#0C2340]/10 rounded-2xl p-4 text-left space-y-1">
            <p className="text-xs text-slate-700 font-source leading-relaxed">
              <strong>Welcome.</strong> Please enter your choir leadership passcode to manage the official register of singers, Sunday Mass schedules, music scores, core values, and parish records.
            </p>
            <p className="text-[11px] text-slate-500 font-source italic">
              (Authorized parish choirmasters, executive committee members, and voice directors only)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider font-source">
                  Committee Passcode
                </label>
                <span className="text-[11px] text-[#1058A8] font-medium font-source">
                  Sec 58 Nakuru
                </span>
              </div>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Enter committee passcode..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] focus:ring-2 focus:ring-[#1058A8]/20 bg-[#F8FAFC] font-source"
                autoFocus
              />
              <p className="text-[11px] text-slate-500 mt-1.5 font-source">
                Authorized parish choirmasters and executive committee members only.
              </p>
            </div>

            {authError && (
              <p className="text-xs font-bold text-red-700 bg-red-50 p-3 rounded-xl border border-red-200 font-source flex items-center gap-2">
                <X className="w-4 h-4 text-red-600 shrink-0" />
                <span>{authError}</span>
              </p>
            )}

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="submit"
                className="w-full py-3.5 text-sm font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 font-source active:scale-[0.99]"
              >
                <ShieldCheck className="w-4 h-4 text-[#7EC8F0]" />
                <span>Sign In to Admin Portal</span>
              </button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer text-center font-source hover:underline"
              >
                ← Return to Choir Website
              </button>
            </div>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center space-y-0.5">
            <p className="text-xs font-eb-garamond text-slate-700 italic">
              «Sing to the Lord a new song; sing to the Lord, all the earth.» — Psalm 96:1
            </p>
            <p className="text-[11px] text-slate-400 font-source">
              St. Monica Catholic Parish · Section 58 Nakuru · CDDN
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Clean Admin Top Bar */}
      <header className="bg-[#0C2340] text-white rounded-2xl px-5 py-3.5 border border-white/10 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ChoirLogo size={44} variant="simplified" className="shrink-0 w-11 h-11" />
          <div>
            <h1 className="font-eb-garamond text-xl sm:text-2xl font-bold text-white leading-tight">
              {lang === 'sw' ? 'Usimamizi wa Kwaya ya Mt. Monika' : 'St. Monica Choir Admin'}
            </h1>
            <span className="text-xs text-[#7EC8F0] font-source font-medium">
              Section 58 · Nakuru
            </span>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2.5 text-xs font-source">
          <div className="bg-white/10 px-3 py-1.5 rounded-xl text-slate-200">
            <span className="text-amber-400 font-bold mr-1.5 tabular-nums">{members.length}</span>
            <span>{lang === 'sw' ? 'Waimbaji' : 'Members'}</span>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-xl text-slate-200">
            <span className="text-amber-400 font-bold mr-1.5 tabular-nums">{songs.length + librarySongs.length}</span>
            <span>{lang === 'sw' ? 'Nyimbo na Noti' : 'Hymns & Scores'}</span>
          </div>
          <div className="hidden sm:block bg-white/10 px-3 py-1.5 rounded-xl text-slate-200">
            <span className="text-emerald-400 font-bold mr-1.5 tabular-nums">{transactions.length}</span>
            <span>Contributions</span>
          </div>
        </div>

        {/* View public site & Log out */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNavigateHome}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            title="Return to public website"
          >
            <Eye className="w-3.5 h-3.5 text-[#7EC8F0]" />
            <span>View Website</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </header>

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

      {/* Main Single-Navigation Layout: Left Sidebar + One Section on Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDEBAR */}
        <aside className="lg:col-span-3 bg-white border border-[#0C2340]/10 rounded-2xl p-3 shadow-xs space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Admin Sections
          </div>

          {[
            { id: "hero", icon: Home, label: "Home Page" },
            { id: "values", icon: Sparkles, label: "Core Values", badge: coreValues.length },
            { id: "members", icon: Users, label: "Members Register", badge: members.length },
            { id: "schedule", icon: Clock, label: "Mass Times" },
            { id: "music", icon: Music, label: "Music Library & Scores", badge: songs.length + librarySongs.length },
            { id: "events", icon: Calendar, label: "Parish Events", badge: eventsList.length },
            { id: "financials", icon: DollarSign, label: "Contributions", badge: transactions.length },
            { id: "footer", icon: Phone, label: "Contacts & Footer" },
            { id: "backup", icon: Settings, label: "Backup & Reset" }
          ].map(item => {
            const Icon = item.icon;
            const isItemActive = item.id === "music"
              ? ["library", "albums", "songs", "sheet"].includes(activeTab)
              : item.id === "members"
              ? ["members", "leaders", "photos", "about", "stats"].includes(activeTab)
              : activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === "music") {
                    if (!["library", "albums", "songs", "sheet"].includes(activeTab)) {
                      setActiveTab("library");
                    }
                  } else if (item.id === "members") {
                    if (!["members", "leaders", "photos", "about", "stats"].includes(activeTab)) {
                      setActiveTab("members");
                    }
                  } else {
                    setActiveTab(item.id as any);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isItemActive
                    ? "bg-[#1058A8] text-white shadow-sm font-bold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isItemActive ? "text-amber-300" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                    isItemActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="lg:col-span-9 space-y-5">
          
          {/* Sub-tabs within Music */}
          {["library", "albums", "songs", "sheet"].includes(activeTab) && (
            <div className="bg-white border border-[#0C2340]/10 p-2 rounded-2xl flex flex-wrap items-center gap-2 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "library" ? "bg-[#1058A8] text-white font-bold shadow-xs" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Music Library ({librarySongs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("albums")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "albums" ? "bg-[#1058A8] text-white font-bold shadow-xs" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Albums ({albums.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("songs")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "songs" ? "bg-[#1058A8] text-white font-bold shadow-xs" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Recorded Hymns ({songs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sheet")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "sheet" ? "bg-[#1058A8] text-white font-bold shadow-xs" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Sheet Music Store ({sheetMusicList.length})
              </button>
            </div>
          )}

          {/* Sub-tabs within Members */}
          {["members", "leaders", "photos", "about", "stats"].includes(activeTab) && (
            <div className="bg-white border border-[#0C2340]/10 p-2 rounded-2xl flex flex-wrap items-center gap-2 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("members")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "members" ? "bg-[#1058A8] text-white font-bold shadow-xs" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Members Register ({members.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("leaders")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "leaders" ? "bg-[#1058A8] text-white font-bold shadow-xs" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Trainers & Officials ({leadersList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("photos")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "photos" ? "bg-[#1058A8] text-white font-bold shadow-xs" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Photo Gallery ({groupPhotosList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("about")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "about" ? "bg-[#1058A8] text-white font-bold shadow-xs" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Our Story & Patron
              </button>
            </div>
          )}

          {/* TAB: CORE VALUES */}
          {activeTab === 'values' && <AdminCoreValuesTab onNotify={notify} />}
          
          {/* TAB: CHOIR MEMBERS */}
          {activeTab === 'members' && <AdminMembersTab onNotify={notify} />}

          {/* TAB: CHOIR ALBUMS */}
          {activeTab === 'albums' && <AdminAlbumsTab onNotify={notify} />}

          {/* TAB: FINANCIALS */}
          {activeTab === 'financials' && <AdminFinancialsTab onNotify={notify} />}

          {/* TAB: HOMEPAGE */}
          {activeTab === 'hero' && <AdminHomepageTab onNotify={notify} />}

          {/* TAB: ABOUT PAGE CONTENT */}
          {activeTab === 'about' && <AdminAboutTab onNotify={notify} />}

          {/* TAB: CHOIR STATISTICS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-[#0C2340]/10 shadow-sm overflow-hidden">
                <AfricanGeometricBorder />
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0C2340]/10">
                    <div>
                      <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                        Choir Ministry Metrics & Figures
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-source mt-1">
                        These core figures appear on the "About Choir" page, homepage counters, and official documentation.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveStats} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5">
                          Active Choristers Count
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={statsForm.membersCount}
                          onChange={e => setStatsForm(prev => ({ ...prev, membersCount: Number(e.target.value) || 0 }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5">
                          Years of Ministry
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={statsForm.yearsServing}
                          onChange={e => setStatsForm(prev => ({ ...prev, yearsServing: Number(e.target.value) || 0 }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5">
                          Choral Scores in Catalog
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={statsForm.repertoireCount}
                          onChange={e => setStatsForm(prev => ({ ...prev, repertoireCount: Number(e.target.value) || 0 }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5">
                          Year Founded
                        </label>
                        <input
                          type="number"
                          value={statsForm.foundedYear}
                          onChange={e => setStatsForm(prev => ({ ...prev, foundedYear: Number(e.target.value) || 2012 }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5">
                          M-Pesa Buy Goods Till Number
                        </label>
                        <input
                          type="text"
                          value={statsForm.mpesaTill}
                          onChange={e => setStatsForm(prev => ({ ...prev, mpesaTill: e.target.value }))}
                          placeholder="8421092"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Choir Statistics</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SUNDAY MASS SCHEDULE */}
          {activeTab === 'schedule' && <AdminMassesTab onNotify={notify} />}

          {/* TAB: FOOTER & CONTACT */}
          {activeTab === 'footer' && <AdminFooterTab onNotify={notify} />}

          {/* TAB: CHOIR EVENTS CALENDAR */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                    Choir Liturgical Events Calendar
                  </h2>
                  <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
                    Manage parish feast days, diocesan music festivals, and choir retreats.
                  </p>
                </div>
                <button
                  onClick={openAddEventModal}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Event</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eventsList.map((evt) => (
                  <div key={evt.id} className="p-5 bg-white border border-[#0C2340]/10 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-[#EAF4FB] text-[#1058A8] font-bold text-[11px] px-2.5 py-0.5 rounded-full font-source">
                          {evt.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 font-source">
                          {evt.fullDate}
                        </span>
                      </div>
                      <h3 className="font-eb-garamond text-lg font-bold text-[#0C2340]">{evt.title}</h3>
                      <p className="text-xs text-slate-600 font-source line-clamp-2">{evt.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#0C2340]/10 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {evt.entryType || 'Free Entry'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditEventModal(evt)}
                          className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete event "${evt.title}"?`)) {
                              deleteEvent(evt.id);
                              notify(`Event "${evt.title}" removed.`);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SONGS MANAGEMENT */}
          {activeTab === 'songs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
                    Choir Repertoire & YouTube Releases
                  </h2>
                  <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
                    Manage songs shown on the music page and linked to {YOUTUBE_CHANNEL_HANDLE}.
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
                    <thead className="bg-[#F8FAFC] border-b border-[#0C2340]/10 text-[#0C2340]/70 text-[12px] font-semibold">
                      <tr>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Composer</th>
                        <th className="py-3 px-4">Part / Season</th>
                        <th className="py-3 px-4">Score Sale</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0C2340]/5">
                      {songs.map((song) => (
                        <tr key={song.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                          <td className="py-3 px-4 font-medium">
                            <div className="font-bold text-[#0C2340] font-eb-garamond text-sm">{song.title}</div>
                          </td>
                          <td className="py-3 px-4 text-[#0C2340]/80">{song.composer} ({song.year})</td>
                          <td className="py-3 px-4">
                            <span className="bg-[#EAF4FB] text-[#1058A8] px-2 py-0.5 rounded text-[10px] font-bold">
                              {song.partOfMass}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {song.sheetMusicAvailable ? (
                              <span className="text-emerald-700 font-bold text-[11px]">KES {song.scorePriceKes}</span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">No score</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => playSong(song)} className="p-1.5 text-[#1058A8] hover:bg-[#EAF4FB] rounded-lg">
                                <Play className="w-3.5 h-3.5 fill-current" />
                              </button>
                              <button onClick={() => openEditSongModal(song)} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg">
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete song "${song.title}"?`)) {
                                    deleteSong(song.id);
                                    notify(`Song "${song.title}" removed.`);
                                  }
                                }}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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

          {/* TAB: SHEET MUSIC */}
          {activeTab === 'sheet' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
                    Sheet Music & Noti za Nyimbo on Sale
                  </h2>
                  <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
                    Vocal scores available for choirmasters to purchase via M-Pesa.
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
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-[#EAF4FB] text-[#1058A8] font-bold text-[11px] px-2 py-0.5 rounded">
                          {item.notationType}
                        </span>
                        <span className="text-base font-bold font-eb-garamond text-[#1058A8]">
                          KES {item.priceKes}
                        </span>
                      </div>
                      <h3 className="font-eb-garamond text-base font-bold text-[#0C2340] leading-snug">{item.title}</h3>
                      <p className="text-xs text-[#0C2340]/75 line-clamp-2 mt-1">{item.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#0C2340]/10 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditSheetModal(item)}
                        className="px-3 py-1 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] hover:bg-[#7EC8F0]/30 rounded-lg flex items-center gap-1"
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
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MAKTABA YA NOTI */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
                    Maktaba ya Noti (Free Sheet Music Library)
                  </h2>
                  <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
                    Manage public domain and permission-cleared Catholic choral scores.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingLibSongId(null);
                    setLibTitle('');
                    setLibComposer('');
                    setShowLibModal(true);
                  }}
                  className="px-4 py-2 text-xs font-bold bg-[#1058A8] hover:bg-[#0C2340] text-white rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Song to Library</span>
                </button>
              </div>

              <div className="bg-white border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#0C2340]/10 text-slate-600 font-semibold uppercase">
                    <tr>
                      <th className="p-3.5">Title & Composer</th>
                      <th className="p-3.5">Language</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0C2340]/5">
                    {librarySongs.map((song) => (
                      <tr key={song.id} className="hover:bg-[#FAF8F5]/80">
                        <td className="p-3.5 font-bold font-eb-garamond text-sm text-[#0C2340]">{song.title}</td>
                        <td className="p-3.5">{song.language}</td>
                        <td className="p-3.5">{song.sharingStatus}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete song "${song.title}" from library?`)) {
                                deleteLibrarySong(song.id);
                                notify(`Removed "${song.title}" from library.`);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TRAINERS & OFFICIALS */}
          {activeTab === 'leaders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
                    Trainers & Officials Recognition
                  </h2>
                </div>
                <button
                  onClick={openAddLeaderModal}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Trainer / Official</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leadersList.map((leader) => (
                  <div key={leader.id} className="p-5 bg-white border border-[#0C2340]/10 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#EAF4FB] flex items-center justify-center font-bold text-lg text-[#1058A8]">
                        {leader.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-eb-garamond text-base font-bold text-[#0C2340]">{leader.name}</h3>
                        <span className="text-xs font-bold text-[#1058A8]">{leader.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GROUP PHOTOS & SUPABASE STORAGE */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 border-b border-[#0C2340]/10 pb-3">
                <button
                  onClick={() => setPhotosSubView('gallery')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-colors ${
                    photosSubView === 'gallery'
                      ? 'bg-[#1058A8] text-white shadow-xs'
                      : 'bg-slate-100 text-[#0C2340] hover:bg-slate-200'
                  }`}
                >
                  Choir Gallery ({groupPhotosList.length})
                </button>
                <button
                  onClick={() => setPhotosSubView('supabase')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 ${
                    photosSubView === 'supabase'
                      ? 'bg-[#1058A8] text-white shadow-xs'
                      : 'bg-slate-100 text-[#0C2340] hover:bg-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Supabase Cloud Media (Realtime)</span>
                </button>
              </div>

              {photosSubView === 'supabase' ? (
                <MediaManager />
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
                        Choir Group Gallery & Ministry Photos
                      </h2>
                      <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
                        Upload direct files to Supabase Cloud or link existing asset photographs.
                      </p>
                    </div>
                    <button
                      onClick={openAddPhotoModal}
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
                          <img
                            src={getAssetUrl(photo.customUrl || '/assets/choir/choir_01.jpg')}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-[#0C2340]/90 text-white text-xs px-2.5 py-0.5 rounded-lg shadow-xs">
                            {photo.year}
                          </span>
                        </div>
                        <div className="p-4 space-y-1">
                          <h4 className="font-eb-garamond font-bold text-[#0C2340] text-sm">{photo.title}</h4>
                          <span className="text-[11px] text-[#1058A8] font-bold block">{photo.occasion}</span>
                        </div>
                        <div className="p-3 border-t border-[#0C2340]/5 flex items-center justify-between">
                          <button
                            onClick={() => openEditPhotoModal(photo)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] hover:bg-[#7EC8F0]/30 rounded-lg flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#1058A8]" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete photo "${photo.title}"?`)) {
                                deleteGroupPhoto(photo.id);
                                notify(`Photo removed from gallery.`);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: BACKUP & DATA RESET */}
          {activeTab === 'backup' && (
            <div className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
              <div>
                <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
                  Data Backup & Storage Control
                </h2>
                <p className="text-xs sm:text-sm text-[#0C2340]/70 font-source mt-1">
                  Export your complete catalog as a JSON document or restore previous backups.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-5 rounded-2xl border border-[#0C2340]/10 space-y-3 bg-[#F8FAFC]">
                  <Download className="w-6 h-6 text-[#1058A8]" />
                  <h3 className="font-eb-garamond font-bold text-[#0C2340] text-base">Export Backup</h3>
                  <button
                    onClick={handleExportJson}
                    className="w-full py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer"
                  >
                    Download JSON File
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-[#0C2340]/10 space-y-3 bg-[#F8FAFC]">
                  <Upload className="w-6 h-6 text-emerald-700" />
                  <h3 className="font-eb-garamond font-bold text-[#0C2340] text-base">Restore Backup</h3>
                  <label className="w-full py-2.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl cursor-pointer text-center block">
                    <span>Select JSON File</span>
                    <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                  </label>
                </div>

                <div className="p-5 rounded-2xl border border-red-200 space-y-3 bg-red-50/50">
                  <RotateCcw className="w-6 h-6 text-red-600" />
                  <h3 className="font-eb-garamond font-bold text-red-900 text-base">Factory Reset</h3>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirmModal(true)}
                    className="w-full py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
                  >
                    Reset Catalog
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT GROUP PHOTO (SUPABASE INTEGRATED) */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0C2340]/20">
            <div className="flex items-center justify-between pb-4 border-b border-[#0C2340]/10">
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                {editingPhotoId ? 'Edit Choir Group Photo' : 'Add Choir Group Photo'}
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
                  placeholder="The whole choir gathered at the sanctuary steps..."
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div>
                <ImageUploadField
                  label="Upload Gallery Photo or Choose Authentic Preset *"
                  labelSw="Pakia Picha ya Albamu / Chagua Picha Halisi"
                  value={photoForm.customUrl}
                  onChange={val => setPhotoForm({ ...photoForm, customUrl: val })}
                  helpText="Upload an image file from your computer (auto-saved to Supabase) or choose a preset."
                  aspectRatio="aspect-video"
                  presetOptions={[
                    { label: 'Full Ensemble Vestments', value: '/assets/choir/choir_01.jpg' },
                    { label: 'Singing in Sanctuary', value: '/assets/choir/choir_02.jpg' },
                    { label: 'Choir Procession', value: '/assets/choir/choir_03.jpg' },
                    { label: 'Altar & Choristers', value: '/assets/choir/choir_04.jpg' },
                    { label: 'Hymnal & Scores', value: '/assets/choir/choir_05.jpg' },
                    { label: 'Parish Cathedral Exterior', value: '/assets/choir/choir_06.jpg' },
                    { label: 'Director Conducting', value: '/assets/choir/choir_07.jpg' },
                    { label: 'Sanctuary Liturgy', value: '/assets/choir/choir_08.jpg' },
                    { label: 'Youth Choristers', value: '/assets/choir/choir_09.jpg' },
                    { label: 'Festive High Mass', value: '/assets/choir/choir_10.jpg' },
                    { label: 'Diocesan Festival', value: '/assets/choir/choir_11.jpg' },
                    { label: 'Director Portrait', value: '/assets/choir/choir_leader_02.jpg' },
                  ]}
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
                  disabled={isPhotoUploadingToSupabase}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isPhotoUploadingToSupabase ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingPhotoId ? 'Save Changes' : 'Upload & Add Photo'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET CONFIRMATION */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-red-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-eb-garamond text-2xl font-bold text-slate-900">
                {lang === 'sw' ? 'Je, unataka kurejesha rekodi?' : 'Restore default catalog?'}
              </h3>
              <p className="text-xs text-slate-600 font-source">
                This will restore default choir catalog records.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
