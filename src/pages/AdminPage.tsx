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
  Heart,
  Loader2,
  Database,
  Copy,
  Award
} from 'lucide-react';
import { SUPABASE_DATABASE_SQL } from '../lib/supabaseChoirData';
import { RealYouTubeIcon } from '../components/RealYouTubeIcon';
import { ChoirLogo } from '../components/ChoirLogo';
import { AfricanGeometricBorder } from '../components/AfricanGeometricBorder';
import { LIBRARY_CATEGORIES, LibrarySong } from '../data/libraryData';
import { ImageUploadField } from '../components/ImageUploadField';
import { getAssetUrl, extractYouTubeVideoId, getSongYouTubeId } from '../utils/assetHelper';
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
import { supabase, optimizeImageForUpload, uploadImageToSupabase } from '../lib/supabase';

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
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

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
  const [libTitleSwahili, setLibTitleSwahili] = useState('');
  const [libComposer, setLibComposer] = useState('');
  const [libArranger, setLibArranger] = useState('');
  const [libLanguage, setLibLanguage] = useState<'Kiswahili' | 'English' | 'Latin' | 'Kikuyu' | 'Dholuo' | 'Kalenjin' | 'Other'>('Kiswahili');
  const [libCategories, setLibCategories] = useState<string[]>(['kuingia']);
  const [libSeason, setLibSeason] = useState('');
  const [libVoices, setLibVoices] = useState<'SATB' | 'Unison' | 'Solo' | 'SSAA' | 'TTBB'>('SATB');
  const [libTempo, setLibTempo] = useState('');
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

  const openAddLibSong = () => {
    setEditingLibSongId(null);
    setLibTitle('');
    setLibTitleSwahili('');
    setLibComposer('Traditional');
    setLibArranger('');
    setLibLanguage('Kiswahili');
    setLibCategories(['kuingia']);
    setLibSeason('Ordinary Time');
    setLibVoices('SATB');
    setLibTempo('Andante');
    setLibLyrics('');
    setLibPdfUrl('');
    setLibAudioUrl('');
    setLibNotesUrl('');
    setLibNotesFileName('');
    setLibMidiUrl('');
    setLibMidiFileName('');
    setLibSharingStatus('Public domain');
    setLibPermissionGivenBy('');
    setLibPermissionDate('');
    setLibExternalSourceUrl('');
    setShowLibModal(true);
  };

  const openEditLibSong = (song: LibrarySong) => {
    setEditingLibSongId(song.id);
    setLibTitle(song.title);
    setLibTitleSwahili(song.titleSwahili || '');
    setLibComposer(song.composer || 'Traditional');
    setLibArranger(song.arranger || '');
    setLibLanguage(song.language || 'Kiswahili');
    setLibCategories(song.categories && song.categories.length > 0 ? song.categories : ['kuingia']);
    setLibSeason(song.season || '');
    setLibVoices(song.voices || 'SATB');
    setLibTempo(song.tempo || '');
    setLibLyrics(song.lyrics || '');
    setLibPdfUrl(song.pdfUrl || '');
    setLibAudioUrl(song.audioUrl || '');
    setLibNotesUrl(song.notesUrl || '');
    setLibNotesFileName(song.notesFileName || '');
    setLibMidiUrl(song.midiUrl || '');
    setLibMidiFileName(song.midiFileName || '');
    setLibSharingStatus(song.sharingStatus || 'Public domain');
    setLibPermissionGivenBy(song.permissionGivenBy || '');
    setLibPermissionDate(song.permissionDate || '');
    setLibExternalSourceUrl(song.externalSourceUrl || '');
    setShowLibModal(true);
  };

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

  const handleSaveLibSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!libTitle.trim()) return;

    const payload = {
      title: libTitle.trim(),
      titleSwahili: libTitleSwahili.trim() || undefined,
      composer: libComposer.trim() || 'Traditional',
      arranger: libArranger.trim() || undefined,
      language: libLanguage,
      categories: libCategories.length > 0 ? libCategories : ['kuingia'],
      season: libSeason.trim() || undefined,
      voices: libVoices,
      tempo: libTempo.trim() || undefined,
      lyrics: libLyrics.trim() || undefined,
      pdfUrl: libPdfUrl.trim() || undefined,
      audioUrl: libAudioUrl.trim() || undefined,
      notesUrl: libNotesUrl.trim() || undefined,
      notesFileName: libNotesFileName.trim() || undefined,
      midiUrl: libMidiUrl.trim() || undefined,
      midiFileName: libMidiFileName.trim() || undefined,
      sharingStatus: libSharingStatus,
      permissionGivenBy: libPermissionGivenBy.trim() || undefined,
      permissionDate: libPermissionDate.trim() || undefined,
      externalSourceUrl: libExternalSourceUrl.trim() || undefined
    };

    if (editingLibSongId) {
      updateLibrarySong(editingLibSongId, payload);
      notify(`Library score "${payload.title}" updated!`);
    } else {
      addLibrarySong(payload);
      notify(`Library score "${payload.title}" added to Maktaba ya Noti!`);
    }
    setShowLibModal(false);
  };

  const handleImportCsv = () => {
    if (!csvSpreadsheetText.trim()) return;
    const lines = csvSpreadsheetText.trim().split('\n');
    const newItems: LibrarySong[] = [];
    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes('title')) return;
      const parts = line.split(',').map(p => p.trim());
      if (parts[0]) {
        newItems.push({
          id: `lib-csv-${Date.now()}-${idx}`,
          title: parts[0],
          composer: parts[1] || 'Traditional',
          language: (parts[2] as any) || 'Kiswahili',
          categories: parts[3] ? [parts[3].toLowerCase()] : ['kuingia'],
          voices: (parts[4] as any) || 'SATB',
          lyrics: '',
          sharingStatus: 'Public domain',
          downloadCount: 0,
          addedDate: new Date().toISOString().split('T')[0]
        });
      }
    });
    if (newItems.length > 0) {
      bulkImportLibrarySongs(newItems);
      notify(`Imported ${newItems.length} scores into Maktaba ya Noti!`);
      setCsvSpreadsheetText('');
      setShowBulkSpreadsheetModal(false);
    }
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
    membersCount: choirStats?.membersCount ?? 56,
    yearsServing: choirStats?.yearsServing ?? 14,
    repertoireCount: choirStats?.repertoireCount ?? 12,
    sundayMassesPerMonth: choirStats?.sundayMassesPerMonth ?? 4,
    foundedYear: choirStats?.foundedYear ?? 2012,
    parish: choirStats?.parish ?? "St. Monica's Catholic Church, Nakuru",
    churchAddress: choirStats?.churchAddress ?? "St. Monica Catholic Church, Section 58, Off Kanu Street, Nakuru, Kenya",
    mpesaTill: choirStats?.mpesaTill ?? "8421092"
  });

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    updateChoirStats({
      membersCount: Number(statsForm.membersCount) || 56,
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
    whyWeSingIt: '',
    whyWeSingItSw: '',
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
      whyWeSingIt: 'Sung in reverence during the Sacred Liturgy to lift prayerful devotion before the altar.',
      whyWeSingItSw: 'Huimbwa kwa heshima na uchaji katika Liturujia Takatifu kuelekeza sala altaroni.',
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
      album: song.album || 'Nyimbo za Kiliturujia za SEC 58',
      composer: song.composer,
      year: song.year,
      season: song.season || 'Ordinary Time',
      seasonSwahili: song.seasonSwahili || 'Wakati wa Kawaida',
      partOfMass: song.partOfMass || 'Entrance',
      partOfMassSwahili: song.partOfMassSwahili || 'Wimbo wa Kuingia',
      language: song.language || 'Kiswahili',
      voicing: song.voicing || 'SATB',
      musicalKey: song.musicalKey || 'G Major',
      duration: song.duration || '4:15',
      youtubeUrl: song.youtubeUrl || YOUTUBE_CHANNEL_URL,
      audioPreviewUrl: song.audioPreviewUrl || 'preview.mp3',
      thumbnailUrl: song.thumbnailUrl || '',
      sheetMusicAvailable: song.sheetMusicAvailable ?? true,
      scorePriceKes: song.scorePriceKes || 300,
      whyWeSingIt: song.whyWeSingIt || '',
      whyWeSingItSw: song.whyWeSingItSw || '',
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

    const cleanYtUrl = songForm.youtubeUrl.trim() || YOUTUBE_CHANNEL_URL;
    const extractedYtId = extractYouTubeVideoId(cleanYtUrl) || 'syOCKFbVS-8';

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
      youtubeUrl: cleanYtUrl,
      youtubeId: extractedYtId,
      audioPreviewUrl: songForm.audioPreviewUrl.trim() || 'preview.mp3',
      thumbnailUrl: songForm.thumbnailUrl.trim() || `https://i.ytimg.com/vi/${extractedYtId}/hqdefault.jpg`,
      sheetMusicAvailable: songForm.sheetMusicAvailable,
      scorePriceKes: Number(songForm.scorePriceKes) || 300,
      lyricsSwahili: lyricsSwahili.length ? lyricsSwahili : ['Wimbo wa kwaya ya Mtakatifu Monika SEC 58.'],
      lyricsEnglish: lyricsEnglish.length ? lyricsEnglish : ['Song of St. Monica Choir SEC 58.'],
      whyWeSingIt: songForm.whyWeSingIt.trim() || undefined,
      whyWeSingItSw: songForm.whyWeSingItSw.trim() || undefined,
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
    tenure: 'Since 2019',
    tenureSw: 'Tangu 2019',
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
      tenure: '',
      tenureSw: '',
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
      tenure: leader.tenure === 'Serving the Parish' ? '' : leader.tenure,
      tenureSw: leader.tenureSw || '',
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
      notify(`Leader "${payload.name}" updated!`);
    } else {
      addLeader(payload);
      notify(`New leader "${payload.name}" added!`);
    }
    setIsLeaderModalOpen(false);
  };

  // 7. Group Photos State & Direct Supabase Uploader
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [photoForm, setPhotoForm] = useState({
    title: '',
    titleSw: '',
    description: '',
    descriptionSw: '',
    year: '',
    imageKey: 'choir_singing_moment' as ChoirGroupPhoto['imageKey'],
    customUrl: '',
    occasion: 'Sunday Mass',
    occasionSw: 'Misa ya Jumapili'
  });

  const openAddPhotoModal = () => {
    setEditingPhotoId(null);
    setSelectedPhotoFile(null);
    setPhotoForm({
      title: '',
      titleSw: '',
      description: '',
      descriptionSw: '',
      year: '',
      imageKey: 'choir_singing_moment',
      customUrl: '',
      occasion: 'Sunday Mass',
      occasionSw: 'Misa ya Jumapili'
    });
    setIsPhotoModalOpen(true);
  };

  const openEditPhotoModal = (photo: ChoirGroupPhoto) => {
    setEditingPhotoId(photo.id);
    setSelectedPhotoFile(null);
    setPhotoForm({
      title: photo.title,
      titleSw: photo.titleSw || photo.title,
      description: photo.description,
      descriptionSw: photo.descriptionSw || photo.description,
      year: photo.year || '',
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
    if (!photoForm.title.trim()) {
      alert('Tafadhali weka jina la picha (Please enter a photo title)');
      return;
    }

    setIsPhotoUploadingToSupabase(true);

    try {
      let finalPublicUrl = photoForm.customUrl.trim();

      // Case 1: Physical File Selected from Device
      if (selectedPhotoFile) {
        notify('Inapakia picha kupitia automated pipeline...');
        const { url: uploadedUrl, error: uploadErr } = await uploadImageToSupabase(selectedPhotoFile, 'gallery');

        if (uploadErr || !uploadedUrl) {
          console.warn(`Storage upload notice: ${uploadErr}. Using resilient data URL.`);
          const reader = new FileReader();
          finalPublicUrl = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(selectedPhotoFile);
          });
        } else {
          finalPublicUrl = uploadedUrl;
        }
      }
      // Case 2: Base64 or Blob Data URL from ImageUploadField
      else if (finalPublicUrl.startsWith('data:image/') || finalPublicUrl.startsWith('blob:')) {
        notify('Inachakata picha...');
        const res = await fetch(finalPublicUrl);
        const blob = await res.blob();
        const { url: uploadedUrl } = await uploadImageToSupabase(blob, 'gallery');
        if (uploadedUrl) {
          finalPublicUrl = uploadedUrl;
        }
      }

      // Check if image link was resolved
      if (!finalPublicUrl) {
        alert('Tafadhali chagua picha (Please choose a photo).');
        setIsPhotoUploadingToSupabase(false);
        return;
      }

      // Always write to Supabase 'gallery' database table
      const { error: dbError } = await supabase
        .from('gallery')
        .insert([
          {
            title: photoForm.title.trim(),
            image_url: finalPublicUrl
          }
        ]);

      if (dbError) {
        throw new Error(`Database insert error: ${dbError.message}`);
      }

      // Sync with local context state
      const payload = {
        title: photoForm.title.trim(),
        titleSw: photoForm.titleSw.trim() || photoForm.title.trim(),
        description: photoForm.description.trim(),
        descriptionSw: photoForm.descriptionSw.trim() || photoForm.description.trim(),
        year: photoForm.year.trim() || '',
        imageKey: photoForm.imageKey,
        customUrl: finalPublicUrl,
        occasion: photoForm.occasion.trim(),
        occasionSw: photoForm.occasionSw.trim() || photoForm.occasion.trim()
      };

      if (editingPhotoId) {
        updateGroupPhoto(editingPhotoId, payload);
        notify(`Picha "${payload.title}" imesasishwa kikamilifu!`);
      } else {
        addGroupPhoto(payload);
        notify(`Picha "${payload.title}" imehifadhiwa kwenye Supabase na Galari!`);
      }

      setIsPhotoModalOpen(false);
      setSelectedPhotoFile(null);
    } catch (err: any) {
      console.error('Supabase upload failure:', err);
      alert(err.message || 'Hitilafu: Picha haikuweza kupakiwa kwenye Supabase.');
    } finally {
      setIsPhotoUploadingToSupabase(false);
    }
  };

  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);
  const [resetConfirmInput, setResetConfirmInput] = useState<string>('');
  const [lastBackupDate, setLastBackupDate] = useState<string>(() => {
    try {
      return localStorage.getItem('st_monica_last_backup') || '4 Nov 2026';
    } catch {
      return '4 Nov 2026';
    }
  });

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
    const now = new Date();
    const formatted = `${now.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][now.getMonth()]} ${now.getFullYear()}`;
    setLastBackupDate(formatted);
    try { localStorage.setItem('st_monica_last_backup', formatted); } catch {}
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

  const handleResetDefaults = () => {
    resetToDefaults();
    setShowResetConfirmModal(false);
    setResetConfirmInput('');
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
        <div className="flex items-center gap-2 text-xs font-source">
          <span className="text-slate-200">
            <span className="text-amber-400 font-bold mr-1 tabular-nums">{members.length}</span>
            <span>{lang === 'sw' ? 'Waimbaji' : 'Members'}</span>
          </span>
          <span className="text-white/40">/</span>
          <span className="text-slate-200">
            <span className="text-amber-400 font-bold mr-1 tabular-nums">{songs.length + librarySongs.length}</span>
            <span>{lang === 'sw' ? 'Nyimbo na Noti' : 'Hymns & Scores'}</span>
          </span>
          <span className="text-white/40 hidden sm:inline">/</span>
          <span className="text-slate-200 hidden sm:inline">
            <span className="text-emerald-400 font-bold mr-1 tabular-nums">{transactions.length}</span>
            <span>Contributions</span>
          </span>
        </div>

        {/* View public site & Log out */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNavigateHome}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Return to public website"
          >
            <Eye className="w-3.5 h-3.5 text-[#7EC8F0]" />
            <span>View Website</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1058A8] hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-400 text-emerald-800 px-4 py-2.5 rounded-lg flex items-center justify-between text-xs font-semibold shadow-xs animate-in slide-in-from-top-1">
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
        <aside className="lg:col-span-3 bg-white border border-[#0C2340]/15 rounded-lg p-3 space-y-3.5">
          <div className="px-2 pt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Sections
          </div>

          {/* Standalone Home */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'hero' ? 'bg-[#1058A8] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Home className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'hero' ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>Home page</span>
              </div>
            </button>
          </div>

          {/* Group: About */}
          <div className="space-y-0.5">
            <div className="px-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              About
            </div>
            {[
              { id: 'about', icon: BookOpen, label: 'Our story' },
              { id: 'leaders', icon: Award, label: 'Trainers & officials', badge: leadersList.length },
              { id: 'photos', icon: ImageIcon, label: 'Gallery', badge: groupPhotosList.length },
            ].map(item => {
              const Icon = item.icon;
              const isItemActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isItemActive ? 'bg-[#1058A8] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isItemActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold tabular-nums shrink-0 ml-1.5 ${
                      isItemActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Group: Music */}
          <div className="space-y-0.5">
            <div className="px-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Music
            </div>
            {[
              { id: 'songs', icon: Play, label: 'Songs', badge: songs.length },
              { id: 'library', icon: Music, label: 'Sheet music library', badge: librarySongs.length },
              { id: 'sheet', icon: FileText, label: 'Sheet music scores', badge: sheetMusicList.length },
              { id: 'albums', icon: Disc, label: 'Albums', badge: albums.length },
            ].map(item => {
              const Icon = item.icon;
              const isItemActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isItemActive ? 'bg-[#1058A8] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isItemActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold tabular-nums shrink-0 ml-1.5 ${
                      isItemActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Standalone Items */}
          <div className="space-y-0.5 pt-2 border-t border-slate-100">
            {[
              { id: 'values', icon: Heart, label: 'Core values', badge: coreValues.length },
              { id: 'members', icon: Users, label: 'Members', badge: members.length },
              { id: 'financials', icon: DollarSign, label: 'Contributions', badge: transactions.length },
              { id: 'footer', icon: Phone, label: 'Contact details' },
              { id: 'schedule', icon: Clock, label: 'Mass times' },
              { id: 'events', icon: Calendar, label: 'Parish events', badge: eventsList.length },
              { id: 'backup', icon: Settings, label: 'Backup' },
            ].map(item => {
              const Icon = item.icon;
              const isItemActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isItemActive ? 'bg-[#1058A8] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isItemActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold tabular-nums shrink-0 ml-1.5 ${
                      isItemActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="lg:col-span-9 space-y-5">

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
                          Sheet Music Scores in Catalog
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
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h2 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                    Songs
                  </h2>
                  <p className="text-xs text-slate-600 font-source mt-0.5">
                    Each song’s YouTube link plays as its preview on the Music page.
                  </p>
                </div>
                <button
                  onClick={openAddSongModal}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add song</span>
                </button>
              </div>

              <div className="bg-white border border-[#0C2340]/15 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-source">
                    <thead className="bg-[#FAF8F5] border-b border-[#0C2340]/10 text-[#0C2340] text-[11px] font-semibold">
                      <tr>
                        <th className="py-2.5 px-3.5">Title</th>
                        <th className="py-2.5 px-3.5">Composer</th>
                        <th className="py-2.5 px-3.5">Season</th>
                        <th className="py-2.5 px-3.5">Preview</th>
                        <th className="py-2.5 px-3.5">Score price</th>
                        <th className="py-2.5 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0C2340]/5">
                      {songs.map((song) => {
                        let displayTitle = song.title.trim();
                        if (displayTitle.toLowerCase().includes('machozi')) {
                          displayTitle = 'Machozi ya Imani';
                        } else if (displayTitle.toLowerCase().includes('mungu tu')) {
                          displayTitle = 'Ni Mungu Tu';
                        }

                        return (
                          <tr key={song.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                            <td className="py-2.5 px-3.5 font-medium">
                              <div className="font-bold text-[#0C2340] font-eb-garamond text-sm">{displayTitle}</div>
                            </td>
                            <td className="py-2.5 px-3.5 text-[#0C2340]/80">
                              {song.composer || 'Traditional'} {song.year ? `(${song.year})` : ''}
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-700">
                              {song.partOfMass || 'Ordinary Time'}
                            </td>
                            <td className="py-2.5 px-3.5">
                              <button
                                type="button"
                                onClick={() => playSong(song)}
                                className="text-[#1058A8] hover:text-[#0C2340] inline-flex items-center gap-1 font-semibold cursor-pointer"
                                title="Play preview"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Preview</span>
                              </button>
                            </td>
                            <td className="py-2.5 px-3.5">
                              {song.sheetMusicAvailable ? (
                                <span className="text-emerald-700 font-semibold">KES {song.scorePriceKes}</span>
                              ) : (
                                <span className="text-slate-400">Free</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => openEditSongModal(song)} 
                                  title="Edit song and preview"
                                  className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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
                                  title="Delete song"
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SHEET MUSIC */}
          {activeTab === 'sheet' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h2 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                    Sheet music scores
                  </h2>
                  <p className="text-xs text-slate-600 font-source mt-0.5">
                    Vocal scores available for choirmasters to purchase or download.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddSheetModal}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add sheet music score</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {sheetMusicList.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-[#0C2340]/15 rounded-lg space-y-2.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="bg-[#EAF4FB] text-[#1058A8] font-semibold text-[11px] px-2 py-0.5 rounded">
                          {item.notationType}
                        </span>
                        <span className="text-sm font-bold font-eb-garamond text-[#1058A8]">
                          KES {item.priceKes}
                        </span>
                      </div>
                      <h3 className="font-eb-garamond text-base font-bold text-[#0C2340] leading-snug">{item.title}</h3>
                      <p className="text-[11px] text-slate-500 font-source mt-0.5">Composer: {item.composer}</p>
                      <p className="text-xs text-slate-600 font-source line-clamp-2 mt-1.5">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditSheetModal(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] hover:bg-[#7EC8F0]/30 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#1058A8]" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete sheet music score "${item.title}"?`)) {
                            deleteSheetMusic(item.id);
                            notify(`Score "${item.title}" removed.`);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete score"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ALBUMS */}
          {activeTab === 'albums' && (
            <AdminAlbumsTab onNotify={notify} />
          )}

          {/* TAB: MAKTABA YA NOTI */}
          {activeTab === 'library' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h2 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                    Maktaba ya Noti
                  </h2>
                  <p className="text-xs text-slate-600 font-source mt-0.5">
                    Scores available for free download.
                  </p>
                </div>
                <button
                  onClick={openAddLibSong}
                  className="px-3.5 py-2 text-xs font-semibold bg-[#1058A8] hover:bg-[#0C2340] text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add song</span>
                </button>
              </div>

              <div className="bg-white border border-[#0C2340]/15 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs font-source">
                  <thead className="bg-[#FAF8F5] border-b border-[#0C2340]/10 text-[#0C2340] font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3.5">Title</th>
                      <th className="py-2.5 px-3.5">Voices</th>
                      <th className="py-2.5 px-3.5">Category</th>
                      <th className="py-2.5 px-3.5">Access</th>
                      <th className="py-2.5 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0C2340]/5 font-source">
                    {librarySongs.map((song) => {
                      const cleanTitle = song.title.replace(/\s+\.$/, '').trim();
                      const titleDisplay = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
                      let comp = song.composer || 'Traditional';
                      const compLower = comp.toLowerCase();
                      if (compLower.includes('atebe mark') || compLower.includes('mark t. atebe') || compLower.includes('mark atebe')) {
                        comp = 'Mark T. Atebe';
                      } else if (compLower.includes('kandie') || compLower.includes('l.k. kandie')) {
                        comp = 'L.K. Kandie';
                      } else if (compLower.includes('shengena') || compLower.includes('fr. g. shengena') || compLower.includes('fr g shengena')) {
                        comp = 'Fr. G. Shengena';
                      }

                      const hasDiffArranger = song.arranger && song.arranger.trim().toLowerCase() !== comp.toLowerCase();
                      const category = (song.categories && song.categories[0]) || song.season || 'Kuingia';

                      return (
                        <tr key={song.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="py-2.5 px-3.5">
                            <div className="font-bold font-eb-garamond text-sm text-[#0C2340] leading-snug">
                              {titleDisplay}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {comp}
                              {hasDiffArranger && <span className="text-slate-400"> · Arr: {song.arranger}</span>}
                            </div>
                          </td>
                          <td className="py-2.5 px-3.5 whitespace-nowrap text-slate-700">
                            {song.voices || 'SATB'} · {song.language || 'Kiswahili'}
                          </td>
                          <td className="py-2.5 px-3.5 whitespace-nowrap capitalize text-slate-700">
                            {category}
                          </td>
                          <td className="py-2.5 px-3.5 whitespace-nowrap text-slate-600 text-[11px]">
                            Public domain · PDF · Audio
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEditLibSong(song)}
                                title="Edit song"
                                className="p-1.5 text-[#1058A8] hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete song "${song.title}" from library?`)) {
                                    deleteLibrarySong(song.id);
                                    notify(`Removed "${song.title}" from library.`);
                                  }
                                }}
                                title="Delete song"
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TRAINERS & OFFICIALS */}
          {activeTab === 'leaders' && (() => {
            const trainers = leadersList.filter(l => l.category === 'trainer' || (l.role && (l.role.toLowerCase().includes('choirmaster') || l.role.toLowerCase().includes('director') || l.role.toLowerCase().includes('trainer') || l.role.toLowerCase().includes('organist'))));
            const officials = leadersList.filter(l => !trainers.some(t => t.id === l.id));

            const renderLeaderCard = (leader: typeof leadersList[0]) => {
              const isChoirmaster = leader.id === 'ldr-director' || 
                (leader.role && (leader.role.toLowerCase().includes('choirmaster') || leader.role.toLowerCase().includes('music director')));

              return (
                <div 
                  key={leader.id} 
                  className="p-3.5 bg-white border border-[#0C2340]/15 rounded-lg space-y-2.5 flex flex-col justify-between shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    {leader.photoUrl ? (
                      <img
                        src={getAssetUrl(leader.photoUrl)}
                        alt={leader.name}
                        className="w-20 h-25 aspect-[4/5] rounded-xl object-cover object-[center_18%] border border-[#1058A8]/30 shadow-xs shrink-0 bg-slate-100"
                      />
                    ) : (
                      <div className="w-20 h-25 aspect-[4/5] rounded-xl bg-[#EAF4FB] text-[#1058A8] border border-blue-200 flex items-center justify-center font-bold text-2xl shrink-0">
                        {leader.name.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      {isChoirmaster && (
                        <span className="text-[10px] font-semibold bg-[#1058A8] text-white px-2 py-0.5 rounded-md inline-block mb-1">
                          Shown on home page
                        </span>
                      )}

                      <h3 className="font-eb-garamond text-base font-bold text-[#0C2340] leading-tight truncate">
                        {leader.name}
                      </h3>
                      <span className="text-xs font-semibold text-[#1058A8] block font-source">
                        {leader.role}
                      </span>
                      {leader.contact && (
                        <span className="text-[11px] text-slate-500 font-source block mt-0.5">
                          {leader.contact}
                        </span>
                      )}
                    </div>
                  </div>

                  {leader.responsibility && (
                    <p className="text-xs text-slate-600 font-source line-clamp-2 pt-1 border-t border-slate-100">
                      {leader.responsibility}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditLeaderModal(leader)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] hover:bg-[#7EC8F0]/30 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#1058A8]" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete leader "${leader.name}"?`)) {
                          deleteLeader(leader.id);
                          notify(`Leader "${leader.name}" removed.`);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete leader"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                  <div>
                    <h2 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                      Trainers & Officials
                    </h2>
                    <p className="text-xs text-slate-600 font-source mt-0.5">
                      Choir music trainers and executive committee officials.
                    </p>
                    <p className="text-[11px] text-slate-500 font-source mt-0.5">
                      Only leaders have photos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openAddLeaderModal}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add leader</span>
                  </button>
                </div>

                {/* Sub-section 1: Trainers */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-amber-100 text-amber-800">
                      <Music className="w-4 h-4" />
                    </span>
                    <h3 className="font-eb-garamond text-lg font-bold text-[#0C2340]">
                      Trainers & Music Directors ({trainers.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {trainers.map(renderLeaderCard)}
                  </div>
                </div>

                {/* Sub-section 2: Executive Officials */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-blue-100 text-blue-800">
                      <Award className="w-4 h-4" />
                    </span>
                    <h3 className="font-eb-garamond text-lg font-bold text-[#0C2340]">
                      Executive Committee Officials ({officials.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {officials.map(renderLeaderCard)}
                  </div>
                </div>
              </div>
            );
          })()}

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
                  Choir Gallery ({groupPhotosList.filter(photo => !leadersList.some(l => l.photoUrl && l.photoUrl === photo.customUrl)).length})
                </button>
                <button
                  onClick={() => setPhotosSubView('supabase')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 ${
                    photosSubView === 'supabase'
                      ? 'bg-[#1058A8] text-white shadow-xs'
                      : 'bg-slate-100 text-[#0C2340] hover:bg-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Photos</span>
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
                        Add photos from your phone or computer.
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
                    {groupPhotosList
                      .filter(photo => !leadersList.some(l => l.photoUrl && l.photoUrl === photo.customUrl))
                      .map((photo) => (
                      <div key={photo.id} className="bg-white border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                        <div className="aspect-16/10 bg-[#EAF4FB] relative overflow-hidden flex items-center justify-center">
                          <img
                            src={getAssetUrl(photo.customUrl || '/assets/choir/choir_01.jpg')}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {photo.year && photo.year.trim() !== '' && photo.year.trim() !== '2024' && (
                            <span className="absolute top-2 left-2 bg-[#0C2340]/90 text-white text-xs px-2.5 py-0.5 rounded-lg shadow-xs">
                              {photo.year}
                            </span>
                          )}
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

          {/* TAB: BACKUP */}
          {activeTab === 'backup' && (
            <div className="bg-white border border-[#0C2340]/15 rounded-lg p-6 space-y-6">
              <div>
                <h2 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                  Backup
                </h2>
                <p className="text-xs text-slate-600 font-source mt-0.5">
                  Download a copy of your website content, or restore an earlier copy.
                </p>
                <p className="text-xs text-slate-500 font-source mt-2">
                  Last backup: {lastBackupDate}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-lg border border-[#0C2340]/10 space-y-2.5 bg-[#F8FAFC]">
                  <h3 className="font-eb-garamond font-bold text-[#0C2340] text-base">Export data</h3>
                  <button
                    onClick={handleExportJson}
                    className="w-full py-2 text-xs font-semibold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg cursor-pointer transition-colors"
                  >
                    Download backup
                  </button>
                </div>

                <div className="p-4 rounded-lg border border-[#0C2340]/10 space-y-2.5 bg-[#F8FAFC]">
                  <h3 className="font-eb-garamond font-bold text-[#0C2340] text-base">Restore data</h3>
                  <label className="w-full py-2 text-xs font-semibold text-slate-800 bg-slate-200 hover:bg-slate-300 rounded-lg cursor-pointer text-center block transition-colors">
                    <span>Choose backup file</span>
                    <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Separate section below called 'Delete everything' */}
              <div className="pt-6 border-t border-slate-200">
                <div className="p-4 rounded-lg border border-red-200 bg-red-50/50 space-y-2">
                  <h3 className="font-eb-garamond font-bold text-red-900 text-base">Delete everything</h3>
                  <p className="text-xs text-slate-600 font-source">
                    This will delete all custom changes and restore default catalog records.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setResetConfirmInput('');
                      setShowResetConfirmModal(true);
                    }}
                    className="py-2 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer transition-colors"
                  >
                    Delete all content
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT GROUP PHOTO (SUPABASE DIRECT STORAGE & DATABASE INTEGRATION) */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0C2340]/20">
            <div className="flex items-center justify-between pb-4 border-b border-[#0C2340]/10">
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                {editingPhotoId ? 'Edit Choir Group Photo' : 'Add Photo'}
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
                  placeholder="e.g. The choir after Sunday Mass"
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
                    placeholder="e.g. Sunday Mass or Thanksgiving"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Date or event (optional)</label>
                  <input
                    type="text"
                    value={photoForm.year}
                    onChange={e => setPhotoForm({ ...photoForm, year: e.target.value })}
                    placeholder="e.g. Easter 2026 or 15 Aug"
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
                  placeholder="The choir gathered after Mass..."
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              {/* Direct File Picker Input for Laptop Images */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                <label className="block font-bold text-[#0C2340] flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#1058A8]" />
                  <span>Choose photo from your phone or computer *</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setSelectedPhotoFile(file);
                    if (file) {
                      setPhotoForm(prev => ({ ...prev, customUrl: '' }));
                    }
                  }}
                  className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1058A8] file:text-white hover:file:bg-[#0C2340] cursor-pointer"
                />
                {selectedPhotoFile && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Selected: {selectedPhotoFile.name} ({(selectedPhotoFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {/* Or Existing Image URL / Preset */}
              <div>
                <ImageUploadField
                  label="Or Choose Authentic Preset / Paste External URL"
                  labelSw="Chagua Picha Halisi au Weka URL"
                  value={photoForm.customUrl}
                  onChange={val => {
                    setPhotoForm(prev => ({ ...prev, customUrl: val }));
                    if (val) setSelectedPhotoFile(null);
                  }}
                  helpText="Optional: If you did not choose a file above, select a preset photo here."
                  aspectRatio="aspect-video"
                  pipelineTarget="gallery"
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
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {isPhotoUploadingToSupabase ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingPhotoId ? 'Save Changes' : 'Upload & Save to Supabase'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: ADD / EDIT LEADER */}
      {isLeaderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
              <div>
                <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                  {editingLeaderId ? 'Edit leader' : 'Add leader'}
                </h3>
                <p className="text-[11px] text-slate-500 font-source mt-0.5">
                  Only leaders have photos.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsLeaderModalOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeader} className="space-y-3.5 text-xs font-source flex-1">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Full name</label>
                <input
                  type="text"
                  required
                  value={leaderForm.name}
                  onChange={e => setLeaderForm({ ...leaderForm, name: e.target.value })}
                  placeholder="e.g. Mwalimu Atebe Mark T."
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Role</label>
                  <input
                    type="text"
                    required
                    value={leaderForm.role}
                    onChange={e => setLeaderForm({ ...leaderForm, role: e.target.value })}
                    placeholder="e.g. Music Director & Choirmaster"
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Wadhifa (optional)</label>
                  <input
                    type="text"
                    value={leaderForm.roleSw}
                    onChange={e => setLeaderForm({ ...leaderForm, roleSw: e.target.value })}
                    placeholder="e.g. Mkurugenzi wa Muziki"
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Group</label>
                  <select
                    value={leaderForm.category}
                    onChange={e => setLeaderForm({ ...leaderForm, category: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none bg-white"
                  >
                    <option value="trainer">Trainer</option>
                    <option value="official">Executive committee</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Years of service (optional)</label>
                  <input
                    type="text"
                    value={leaderForm.tenure}
                    onChange={e => setLeaderForm({ ...leaderForm, tenure: e.target.value })}
                    placeholder="Since 2019"
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">What they do (optional)</label>
                <textarea
                  rows={2}
                  value={leaderForm.responsibility}
                  onChange={e => setLeaderForm({ ...leaderForm, responsibility: e.target.value })}
                  placeholder="Conducts weekly rehearsals, oversees liturgical singing..."
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Phone or email (optional)</label>
                <input
                  type="text"
                  value={leaderForm.contact}
                  onChange={e => setLeaderForm({ ...leaderForm, contact: e.target.value })}
                  placeholder="07XX XXX XXX"
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none"
                />
              </div>

              {/* Photo section */}
              <div className="pt-1">
                <ImageUploadField
                  label="Photo"
                  value={leaderForm.photoUrl}
                  onChange={val => setLeaderForm(prev => ({ ...prev, photoUrl: val }))}
                  defaultValue="/assets/choir/choirmaster_director.jpg"
                  aspectRatio="aspect-[4/5]"
                  className="p-0 border-0 shadow-none bg-transparent"
                />
              </div>

              {/* Pinned Sticky Bottom Buttons */}
              <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0 z-10">
                <button
                  type="button"
                  onClick={() => setIsLeaderModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md border border-slate-300 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1058A8] hover:bg-[#0C4685] rounded-md cursor-pointer shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT REPERTOIRE SONG */}
      {isSongModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0C2340]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#0C2340]/10">
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                {editingSongId ? 'Edit Repertoire Hymn' : 'Add New Recorded Hymn'}
              </h3>
              <button onClick={() => setIsSongModalOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-[#0C2340]/60" />
              </button>
            </div>

            <form onSubmit={handleSaveSong} className="space-y-4 text-xs font-source">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Song Title (English / Latin) *</label>
                  <input
                    type="text"
                    required
                    value={songForm.title}
                    onChange={e => setSongForm({ ...songForm, title: e.target.value })}
                    placeholder="Machozi ya Imani"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Swahili Title</label>
                  <input
                    type="text"
                    value={songForm.titleSwahili}
                    onChange={e => setSongForm({ ...songForm, titleSwahili: e.target.value })}
                    placeholder="Machozi ya Imani"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Composer</label>
                  <input
                    type="text"
                    value={songForm.composer}
                    onChange={e => setSongForm({ ...songForm, composer: e.target.value })}
                    placeholder="Bernard Mukasa"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Year</label>
                  <input
                    type="number"
                    value={songForm.year}
                    onChange={e => setSongForm({ ...songForm, year: Number(e.target.value) || 2024 })}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Part of Mass</label>
                  <select
                    value={songForm.partOfMass}
                    onChange={e => {
                      const p = e.target.value;
                      const swMap: Record<string, string> = {
                        'Entrance': 'Wimbo wa Kuingia',
                        'Kyrie': 'Bwana Utuhurumie',
                        'Gloria': 'Utukufu kwa Mungu',
                        'Meditation': 'Tafakari / Zaburi',
                        'Offertory': 'Sadaka na Matoleo',
                        'Sanctus': 'Mtakatifu',
                        'Agnus Dei': 'Mwana Kondoo wa Mungu',
                        'Communion': 'Komunyo na Ekaristi',
                        'Thanksgiving': 'Shukrani na Sifa',
                        'Recessional': 'Wimbo wa Kutoka'
                      };
                      setSongForm({
                        ...songForm,
                        partOfMass: p as any,
                        partOfMassSwahili: swMap[p] || p
                      });
                    }}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none bg-white"
                  >
                    <option value="Entrance">Entrance (Kuingia)</option>
                    <option value="Kyrie">Kyrie (Bwana Utuhurumie)</option>
                    <option value="Gloria">Gloria (Utukufu)</option>
                    <option value="Meditation">Meditation / Psalm (Tafakari)</option>
                    <option value="Offertory">Offertory (Sadaka / Matoleo)</option>
                    <option value="Sanctus">Sanctus (Mtakatifu)</option>
                    <option value="Agnus Dei">Agnus Dei (Mwana Kondoo)</option>
                    <option value="Communion">Communion (Komunyo / Ekaristi)</option>
                    <option value="Thanksgiving">Thanksgiving (Shukrani na Sifa)</option>
                    <option value="Recessional">Recessional (Kutoka)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Album (Albamu ya Wimbo)</label>
                  <div className="flex gap-2">
                    <select
                      value={albums.some(a => a.title === songForm.album) ? songForm.album : 'custom'}
                      onChange={e => {
                        if (e.target.value !== 'custom') {
                          setSongForm({ ...songForm, album: e.target.value });
                        }
                      }}
                      className="w-1/2 p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none bg-white text-xs truncate"
                    >
                      {albums.map(a => (
                        <option key={a.id} value={a.title}>{a.title}</option>
                      ))}
                      <option value="custom">Other / Custom</option>
                    </select>
                    <input
                      type="text"
                      value={songForm.album}
                      onChange={e => setSongForm({ ...songForm, album: e.target.value })}
                      placeholder="Album Title"
                      className="w-1/2 p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Liturgical Season (Kipindi cha Kiliturujia)</label>
                  <select
                    value={songForm.season}
                    onChange={e => {
                      const seasonVal = e.target.value as Song['season'];
                      const swMap: Record<string, string> = {
                        'Ordinary Time': 'Wakati wa Kawaida',
                        'Advent': 'Majilio',
                        'Lent': 'Kwaresima',
                        'Easter': 'Pasaka',
                        'Marian': 'Bikira Maria',
                        'Patronal': 'Sikukuu ya Somo'
                      };
                      setSongForm({
                        ...songForm,
                        season: seasonVal,
                        seasonSwahili: swMap[seasonVal] || seasonVal
                      });
                    }}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none bg-white text-xs"
                  >
                    <option value="Ordinary Time">Ordinary Time (Wakati wa Kawaida)</option>
                    <option value="Advent">Advent (Majilio)</option>
                    <option value="Lent">Lent (Kwaresima)</option>
                    <option value="Easter">Easter (Pasaka)</option>
                    <option value="Marian">Marian (Bikira Maria)</option>
                    <option value="Patronal">Patronal (Somo: Mt. Monika)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Voicing</label>
                  <input
                    type="text"
                    value={songForm.voicing}
                    onChange={e => setSongForm({ ...songForm, voicing: e.target.value })}
                    placeholder="SATB Polyphony"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Musical Key</label>
                  <input
                    type="text"
                    value={songForm.musicalKey}
                    onChange={e => setSongForm({ ...songForm, musicalKey: e.target.value })}
                    placeholder="G Major"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Duration</label>
                  <input
                    type="text"
                    value={songForm.duration}
                    onChange={e => setSongForm({ ...songForm, duration: e.target.value })}
                    placeholder="4:15"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              {/* Sheet Music Score Options */}
              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={songForm.sheetMusicAvailable}
                    onChange={e => setSongForm({ ...songForm, sheetMusicAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1058A8] focus:ring-[#1058A8]"
                  />
                  <div>
                    <span className="font-bold text-[#0C2340] block">Sheet Music for Sale</span>
                    <span className="text-[11px] text-slate-500 font-source block">Enable downloadable SATB score</span>
                  </div>
                </label>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Score Price (KES)</label>
                  <input
                    type="number"
                    value={songForm.scorePriceKes}
                    onChange={e => setSongForm({ ...songForm, scorePriceKes: Number(e.target.value) || 300 })}
                    placeholder="300"
                    disabled={!songForm.sheetMusicAvailable}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Song Cover / Thumbnail Photo (Uploaded directly to Supabase Storage) */}
              <div>
                <ImageUploadField
                  label="Song Cover / Thumbnail Photo (Stored on Supabase)"
                  labelSw="Picha ya Jalada ya Wimbo (Supabase)"
                  value={songForm.thumbnailUrl}
                  onChange={(url) => setSongForm({ ...songForm, thumbnailUrl: url })}
                  helpText="Upload an image to Supabase Storage bucket 'photos' or paste a direct image URL."
                  aspectRatio="aspect-video"
                  pipelineTarget="general"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">YouTube Video Link (Live Audio Preview)</label>
                  <input
                    type="url"
                    value={songForm.youtubeUrl}
                    onChange={e => setSongForm({ ...songForm, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none text-xs"
                  />
                  <div className="text-[11px] text-slate-500 mt-1 font-source flex items-center justify-between">
                    <span>This video link will sing as the live audio preview on the website.</span>
                    {extractYouTubeVideoId(songForm.youtubeUrl) && (
                      <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        ID: {extractYouTubeVideoId(songForm.youtubeUrl)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Audio Preview File / Link</label>
                  <input
                    type="text"
                    value={songForm.audioPreviewUrl}
                    onChange={e => setSongForm({ ...songForm, audioPreviewUrl: e.target.value })}
                    placeholder="preview.mp3 or Supabase audio URL"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              {/* Devotional Reason (Why We Sing It) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Why We Sing It (English Reflection)</label>
                  <textarea
                    rows={2}
                    value={songForm.whyWeSingIt}
                    onChange={e => setSongForm({ ...songForm, whyWeSingIt: e.target.value })}
                    placeholder="Devotional meaning and reflection during liturgical celebration..."
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Kwa Nini Tunaimba (Tafakari ya Kiswahili)</label>
                  <textarea
                    rows={2}
                    value={songForm.whyWeSingItSw}
                    onChange={e => setSongForm({ ...songForm, whyWeSingItSw: e.target.value })}
                    placeholder="Maana ya kiroho na tafakari ya wimbo huu altaroni..."
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none text-xs"
                  />
                </div>
              </div>

              {/* Lyrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Swahili Lyrics (Line by Line)</label>
                  <textarea
                    rows={3}
                    value={songForm.lyricsSwahiliText}
                    onChange={e => setSongForm({ ...songForm, lyricsSwahiliText: e.target.value })}
                    placeholder="1. Tazama ninakuja Ee Bwana..."
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">English Lyrics (Line by Line)</label>
                  <textarea
                    rows={3}
                    value={songForm.lyricsEnglishText}
                    onChange={e => setSongForm({ ...songForm, lyricsEnglishText: e.target.value })}
                    placeholder="1. Behold I come O Lord..."
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
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
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSongId ? 'Update Hymn' : 'Save Repertoire Hymn'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUPABASE DATABASE SQL SETUP */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#0C2340]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#0C2340]/10">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#1058A8]" />
                <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                  Supabase Database SQL Setup
                </h3>
              </div>
              <button onClick={() => setShowSqlModal(false)} className="cursor-pointer text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-source leading-relaxed">
              To enable direct relational SQL storage for all songs, albums, and gallery records in Supabase, run this script once in your Supabase Dashboard (<strong>SQL Editor → New Query → Run</strong>):
            </p>

            <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
              {SUPABASE_DATABASE_SQL}
            </pre>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-source">
                Songs & media are automatically saved to Supabase Storage (<code className="font-mono text-slate-700">photos/data/songs.json</code>).
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(SUPABASE_DATABASE_SQL);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2500);
                }}
                className="px-4 py-2 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SHEET MUSIC SCORE */}
      {isSheetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                {editingSheetId ? 'Edit sheet music score' : 'Add sheet music score'}
              </h3>
              <button 
                type="button"
                onClick={() => setIsSheetModalOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSheet} className="space-y-3.5 text-xs font-source flex-1">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Score title</label>
                <input
                  type="text"
                  required
                  value={sheetForm.title}
                  onChange={e => setSheetForm({ ...sheetForm, title: e.target.value })}
                  placeholder="Machozi ya Imani SATB"
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Composer (optional)</label>
                  <input
                    type="text"
                    value={sheetForm.composer}
                    onChange={e => setSheetForm({ ...sheetForm, composer: e.target.value })}
                    placeholder="Bernard Mukasa"
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Notation type</label>
                  <select
                    value={sheetForm.notationType}
                    onChange={e => setSheetForm({ ...sheetForm, notationType: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none bg-white"
                  >
                    <option value="Tonic Sol-fa & Staff">Tonic Sol-fa & Staff</option>
                    <option value="Tonic Sol-fa">Tonic Sol-fa Only</option>
                    <option value="Staff Notation">Staff Notation Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Price in KES</label>
                  <input
                    type="number"
                    value={sheetForm.priceKes}
                    onChange={e => setSheetForm({ ...sheetForm, priceKes: Number(e.target.value) || 300 })}
                    placeholder="300"
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Voicing (optional)</label>
                  <input
                    type="text"
                    value={sheetForm.voicing}
                    onChange={e => setSheetForm({ ...sheetForm, voicing: e.target.value })}
                    placeholder="SATB Choir & Organ"
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              {/* PDF Sheet Music File or Link */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                <label className="block font-semibold text-slate-800 flex items-center justify-between">
                  <span>Score PDF (for buyer download)</span>
                  <span className="text-[11px] text-slate-500 font-normal">PDF document</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          setSheetForm(prev => ({ ...prev, downloadUrl: reader.result as string }));
                          notify(`Attached PDF score: ${file.name}`);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="block w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border file:border-slate-300 file:text-xs file:font-medium file:bg-white file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={sheetForm.downloadUrl}
                  onChange={e => setSheetForm({ ...sheetForm, downloadUrl: e.target.value })}
                  placeholder="Or enter PDF URL (e.g. https://... or /scores/...)"
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Description (optional)</label>
                <textarea
                  rows={2}
                  value={sheetForm.description}
                  onChange={e => setSheetForm({ ...sheetForm, description: e.target.value })}
                  placeholder="Complete 4-part SATB vocal sheet music in PDF format..."
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0 z-10">
                <button
                  type="button"
                  onClick={() => setIsSheetModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md border border-slate-300 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1058A8] hover:bg-[#0C4685] rounded-md cursor-pointer shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingSheetId ? 'Save changes' : 'Add score'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT LITURGICAL EVENT */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0C2340]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#0C2340]/10">
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                {editingEventId ? 'Edit Parish Event' : 'Add New Liturgical Event'}
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-[#0C2340]/60" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs font-source">
              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Feast of St. Monica Solemn Liturgy"
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Date String</label>
                  <input
                    type="text"
                    value={eventForm.fullDate}
                    onChange={e => setEventForm({ ...eventForm, fullDate: e.target.value })}
                    placeholder="27th August 2026"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Time</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    placeholder="10:00 AM – 1:00 PM"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Venue</label>
                  <input
                    type="text"
                    value={eventForm.venue}
                    onChange={e => setEventForm({ ...eventForm, venue: e.target.value })}
                    placeholder="St. Monica's Catholic Church"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Category</label>
                  <input
                    type="text"
                    value={eventForm.category}
                    onChange={e => setEventForm({ ...eventForm, category: e.target.value })}
                    placeholder="Feast Day / Festival"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Solemn high mass led by St. Monica Third Mass Choir..."
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#0C2340] hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingEventId ? 'Update Event' : 'Save Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MAKTABA YA NOTI LIBRARY SCORE */}
      {showLibModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0C2340]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#0C2340]/10">
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                {editingLibSongId ? 'Edit Library Score' : 'Add Song to Maktaba ya Noti'}
              </h3>
              <button onClick={() => setShowLibModal(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-[#0C2340]/60" />
              </button>
            </div>

            <form onSubmit={handleSaveLibSong} className="space-y-4 text-xs font-source">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Song Title (Kichwa cha Wimbo) *</label>
                  <input
                    type="text"
                    required
                    value={libTitle}
                    onChange={e => setLibTitle(e.target.value)}
                    placeholder="e.g. Bwana Unibadili"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Swahili / Alternate Title</label>
                  <input
                    type="text"
                    value={libTitleSwahili}
                    onChange={e => setLibTitleSwahili(e.target.value)}
                    placeholder="e.g. Bwana Unibadili"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Composer (Mtunzi)</label>
                  <input
                    type="text"
                    value={libComposer}
                    onChange={e => setLibComposer(e.target.value)}
                    placeholder="e.g. Bernard Mukasa"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Arranger / Harmonizer (Mpangaji)</label>
                  <input
                    type="text"
                    value={libArranger}
                    onChange={e => setLibArranger(e.target.value)}
                    placeholder="e.g. Atebe Mark T."
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Language</label>
                  <select
                    value={libLanguage}
                    onChange={e => setLibLanguage(e.target.value as any)}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none bg-white"
                  >
                    <option value="Kiswahili">Kiswahili</option>
                    <option value="English">English</option>
                    <option value="Latin">Latin</option>
                    <option value="Kikuyu">Kikuyu</option>
                    <option value="Dholuo">Dholuo</option>
                    <option value="Kalenjin">Kalenjin</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Voices (Mpangilio wa Sauti)</label>
                  <select
                    value={libVoices}
                    onChange={e => setLibVoices(e.target.value as any)}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none bg-white"
                  >
                    <option value="SATB">SATB (Soprano, Alto, Tenor, Bass)</option>
                    <option value="Unison">Unison (Sauti Moja)</option>
                    <option value="Solo">Solo (Mwimbaji Pekee)</option>
                    <option value="SSAA">SSAA (Sauti za Kike)</option>
                    <option value="TTBB">TTBB (Sauti za Kiume)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Category (Sehemu ya Misa)</label>
                  <select
                    value={libCategories[0] || 'kuingia'}
                    onChange={e => setLibCategories([e.target.value])}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none bg-white"
                  >
                    {LIBRARY_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameSw} ({cat.nameEn})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Liturgical Season (Kipindi cha Kiliturujia)</label>
                  <input
                    type="text"
                    value={libSeason}
                    onChange={e => setLibSeason(e.target.value)}
                    placeholder="Ordinary Time / Wakati wa Kawaida"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Sharing / Copyright Status</label>
                  <select
                    value={libSharingStatus}
                    onChange={e => setLibSharingStatus(e.target.value as any)}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none bg-white"
                  >
                    <option value="Public domain">Public domain (Domini ya Umma)</option>
                    <option value="Shared with permission">Shared with permission (Kwa Idhini)</option>
                    <option value="Link only">Link only (Kiungo pekee)</option>
                  </select>
                </div>
              </div>

              {/* Upload Sheet Music Notes / MIDI */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="font-bold text-[#0C2340] block">Score & Audio Files</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Upload Score (PDF / Image)</label>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={e => handleUploadFile(e, 'notes')}
                      className="text-[11px] text-slate-600 block w-full"
                    />
                    {libNotesFileName && (
                      <span className="text-[10px] text-emerald-700 font-semibold block mt-1 truncate">
                        Attached: {libNotesFileName}
                      </span>
                    )}
                    <input
                      type="text"
                      value={libPdfUrl}
                      onChange={e => setLibPdfUrl(e.target.value)}
                      placeholder="Or paste direct PDF URL"
                      className="w-full p-2 mt-1.5 border border-slate-300 rounded-lg text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Upload MIDI / Audio Preview</label>
                    <input
                      type="file"
                      accept=".mid,.midi,audio/*"
                      onChange={e => handleUploadFile(e, 'midi')}
                      className="text-[11px] text-slate-600 block w-full"
                    />
                    {libMidiFileName && (
                      <span className="text-[10px] text-emerald-700 font-semibold block mt-1 truncate">
                        Attached: {libMidiFileName}
                      </span>
                    )}
                    <input
                      type="text"
                      value={libAudioUrl}
                      onChange={e => setLibAudioUrl(e.target.value)}
                      placeholder="Or paste direct Audio URL"
                      className="w-full p-2 mt-1.5 border border-slate-300 rounded-lg text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Lyrics / Maneno ya Wimbo</label>
                <textarea
                  rows={3}
                  value={libLyrics}
                  onChange={e => setLibLyrics(e.target.value)}
                  placeholder="1. Ee Bwana unibadili..."
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLibModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#0C2340] hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingLibSongId ? 'Update Library Score' : 'Save to Library'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BULK SPREADSHEET IMPORT */}
      {showBulkSpreadsheetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-[#0C2340]/20">
            <div className="flex items-center justify-between pb-3 border-b border-[#0C2340]/10">
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">Bulk Import Songs (CSV)</h3>
              <button onClick={() => setShowBulkSpreadsheetModal(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="text-xs text-slate-600 font-source">
              Paste comma-separated rows: <code>Title, Composer, Language, Category, Voices</code>
            </p>
            <textarea
              rows={6}
              value={csvSpreadsheetText}
              onChange={e => setCsvSpreadsheetText(e.target.value)}
              placeholder="Title, Composer, Language, Category, Voices&#10;Bwana Unibadili, Bernard Mukasa, Kiswahili, kuingia, SATB"
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkSpreadsheetModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportCsv}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer"
              >
                Import CSV Rows
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESET CONFIRMATION */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl border border-red-200">
            <h3 className="font-eb-garamond text-xl font-bold text-slate-900">
              Delete all content?
            </h3>
            <p className="text-xs text-slate-600 font-source">
              This action will reset all catalog records, members, and custom settings to original defaults.
            </p>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Type <strong className="text-red-700 font-mono">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={resetConfirmInput}
                onChange={e => setResetConfirmInput(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase focus:border-red-600 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetConfirmInput.trim() !== 'DELETE'}
                onClick={handleResetDefaults}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Delete all content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
