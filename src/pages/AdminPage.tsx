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
  DollarSign
} from 'lucide-react';
import { RealYouTubeIcon } from '../components/RealYouTubeIcon';
import { ChoirLogo } from '../components/ChoirLogo';
import { AfricanGeometricBorder } from '../components/AfricanGeometricBorder';
import { LIBRARY_CATEGORIES, LibrarySong } from '../data/libraryData';
import { ImageUploadField } from '../components/ImageUploadField';
import { AdminHomepageTab } from '../components/admin/AdminHomepageTab';
import { AdminMassesTab } from '../components/admin/AdminMassesTab';
import { AdminFooterTab } from '../components/admin/AdminFooterTab';
import { AdminAboutTab } from '../components/admin/AdminAboutTab';
import { AdminMembersTab } from '../components/admin/AdminMembersTab';
import { AdminAlbumsTab } from '../components/admin/AdminAlbumsTab';
import { AdminFinancialsTab } from '../components/admin/AdminFinancialsTab';

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
    transactions
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
  const [activeTab, setActiveTab] = useState<'members' | 'albums' | 'financials' | 'leaders' | 'library' | 'events' | 'photos' | 'songs' | 'sheet' | 'hero' | 'about' | 'schedule' | 'footer' | 'stats' | 'backup'>('hero');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSelectCategory = (cat: 'home' | 'about' | 'music' | 'events' | 'financials' | 'settings') => {
    setMainCategory(cat);
    if (cat === 'home') {
      if (!['hero', 'schedule'].includes(activeTab)) setActiveTab('hero');
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
    if (['hero', 'schedule'].includes(tab)) setMainCategory('home');
    else if (['about', 'members', 'leaders', 'photos', 'stats'].includes(tab)) setMainCategory('about');
    else if (['songs', 'albums', 'sheet', 'library'].includes(tab)) setMainCategory('music');
    else if (tab === 'events') setMainCategory('events');
    else if (tab === 'financials') setMainCategory('financials');
    else if (['footer', 'backup'].includes(tab)) setMainCategory('settings');
  };

  // Maktaba ya Noti Library Form State (Step 6)
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
  const [libSharingStatus, setLibSharingStatus] = useState<'Public domain' | 'Shared with permission' | 'Link only'>('Public domain');
  const [libPermissionGivenBy, setLibPermissionGivenBy] = useState('');
  const [libPermissionDate, setLibPermissionDate] = useState('');
  const [libExternalSourceUrl, setLibExternalSourceUrl] = useState('');
  const [showBulkSpreadsheetModal, setShowBulkSpreadsheetModal] = useState<boolean>(false);
  const [csvSpreadsheetText, setCsvSpreadsheetText] = useState('');

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
      setAuthError(lang === 'sw' ? 'Nenosiri si sahihi. Jaribu "sec58nakuru" au "admin".' : 'Invalid passcode. Access denied. Try "sec58nakuru" or "admin".');
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

  // 3. Sunday Mass Times & Rehearsal Schedule State
  const [scheduleForm, setScheduleForm] = useState({
    mass1Title: massSchedule?.mass1Title || '1st Mass (Dawn)',
    mass1Time: massSchedule?.mass1Time || '7:00 AM',
    mass1Desc: massSchedule?.mass1Desc || 'Solemn morning Eucharistic prayer for early parishioners.',
    mass1DescSw: massSchedule?.mass1DescSw || 'Misa ya Asubuhi Mapema (Alfajiri) kwa sala na utulivu.',
    mass2Title: massSchedule?.mass2Title || '2nd Mass (Kiswahili)',
    mass2Time: massSchedule?.mass2Time || '8:30 AM',
    mass2Desc: massSchedule?.mass2Desc || 'Morning parish Eucharistic liturgy with congregational hymns.',
    mass2DescSw: massSchedule?.mass2DescSw || 'Misa ya pili ya asubuhi na nyimbo za kutaniko.',
    mass3Title: massSchedule?.mass3Title || '3rd Mass (Sunday Sung Mass)',
    mass3Time: massSchedule?.mass3Time || '10:00 AM',
    mass3Desc: massSchedule?.mass3Desc || 'St. Monica Third Mass Choir leads solemn four-part SATB liturgy.',
    mass3DescSw: massSchedule?.mass3DescSw || 'Misa ya Tatu (Misa ya Jumapili Inayoimbwa) - Kwaya ya Mtakatifu Monika.',
    rehearsals: massSchedule?.rehearsals || 'Wednesdays & Fridays: 5:30 PM – 7:30 PM (Parish Hall)',
    rehearsalsSw: massSchedule?.rehearsalsSw || 'Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku (Ukumbi wa Parokia)'
  });

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    updateMassSchedule(scheduleForm);
    notify(lang === 'sw' ? 'Ratiba ya Misa na Mazoezi imehifadhiwa!' : 'Mass & rehearsal schedule updated!');
  };

  // 4. Liturgical Events & Calendar State
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
        notify('Invalid JSON file format. Please check the backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to restore original default songs, sheet music, and choir officials? Any custom edits will be reset.')) {
      resetToDefaults();
      notify('All data restored to verified default St. Monica Catholic Choir catalog.');
    }
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
              Dawati la Kamati ya Kwaya
            </h1>
            <span className="font-eb-garamond text-base text-[#1058A8] italic block font-medium">
              St. Monica Third Mass Choir · Leadership Desk
            </span>
          </div>

          <div className="bg-[#FAF8F5] border border-[#0C2340]/10 rounded-2xl p-4 text-left space-y-1">
            <p className="text-xs text-slate-700 font-source leading-relaxed">
              <strong>Karibu.</strong> Please enter your choir leadership passcode to manage the official register of singers, Sunday Mass schedules, music scores, and parish records.
            </p>
            <p className="text-[11px] text-slate-500 font-source italic">
              (Ukurasa huu ni maalum kwa ajili ya Choirmaster, Kamati ya Kwaya, na Walimu wa Sauti)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider font-source">
                  Committee Passcode (Nenosiri la Kamati)
                </label>
                <span className="text-[11px] text-[#1058A8] font-medium font-source">
                  Sec 58 Nakuru
                </span>
              </div>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Weka nenosiri la kamati hapa..."
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
                <span>Ingia Kwenye Dawati · Open Choir Desk</span>
              </button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer text-center font-source hover:underline"
              >
                ← Rudi kwenye Tovuti ya Kwaya · Return to Choir Website
              </button>
            </div>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center space-y-0.5">
            <p className="text-xs font-eb-garamond text-slate-700 italic">
              «Mwimbieni Bwana wimbo mpya; mwimbieni Bwana, nchi yote.» — Zaburi 96:1
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
      
      {/* Top Banner & Header */}
      <div className="bg-[#0C2340] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0">
          <AfricanGeometricBorder />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <ChoirLogo size={80} variant="simplified" className="shrink-0 w-20 h-20" />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1058A8] text-white text-[11px] font-source px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Choir Admin Portal · Usimamizi wa Kwaya
              </span>
              <span className="text-xs text-[#7EC8F0] font-source font-semibold">
                Section 58 · Nakuru
              </span>
            </div>
            <h1 className="font-eb-garamond text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1">
              Choir Management & Live Content Control
            </h1>
            <p className="text-xs sm:text-sm text-white/90 font-source mt-0.5 max-w-2xl">
              Manage homepage headlines, notices, chorister ministry metrics, Sunday Mass schedule, repertoire, sheet music catalog, and choir leadership. All changes update live immediately across the site.
            </p>
            <p className="text-[11px] text-[#7EC8F0] font-source mt-0.5 italic">
              Sehemu ya Kiswahili: Mabadiliko yote yanasasishwa mara moja kwenye mfumo na tovuti.
            </p>

            {/* Quick Live Metrics Counters */}
            <div className="flex flex-wrap items-center gap-2 pt-2.5 text-[11px] font-source">
              <span className="px-2.5 py-0.5 bg-white/10 rounded-lg text-white/90">
                <strong>{statsForm.membersCount}</strong> Choristers (Waimbaji)
              </span>
              <span className="px-2.5 py-0.5 bg-white/10 rounded-lg text-white/90">
                <strong>{statsForm.yearsServing}</strong> Years (Miaka)
              </span>
              <span className="px-2.5 py-0.5 bg-white/10 rounded-lg text-white/90">
                <strong>{songs.length}</strong> Hymns (Nyimbo)
              </span>
              <span className="px-2.5 py-0.5 bg-white/10 rounded-lg text-white/90">
                <strong>{librarySongs.length}</strong> Music Scores (Maktaba Noti)
              </span>
              <span className="px-2.5 py-0.5 bg-white/10 rounded-lg text-white/90">
                <strong>{eventsList.length}</strong> Events (Matukio)
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2">
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors cursor-pointer"
          >
            Log Out (Ondoka)
          </button>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <RealYouTubeIcon size={18} variant="badge" />
            <span>YouTube</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>

          <button
            onClick={onNavigateHome}
            className="px-4 py-2 text-xs font-bold text-[#0C2340] bg-white hover:bg-[#EAF4FB] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-[#1058A8]" />
            <span>View Live Website (Tazama Tovuti)</span>
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

      {/* SECTION NAVIGATOR (Grouped Strictly by Website Section) */}
      <div className="bg-white border border-[#0C2340]/10 p-4 sm:p-6 rounded-3xl shadow-sm space-y-5">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1058A8] text-white uppercase tracking-wider">
                Full Website Control Hub
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {lang === 'sw' ? 'Sehemu Zote Zimepangwa Kulingana na Kurasa' : 'All Functions Grouped by Section'}
              </span>
            </div>
            <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340] mt-1">
              {lang === 'sw' ? 'Usimamizi kwa Sehemu za Tovuti' : 'Website Sections & Functions Manager'}
            </h2>
            <p className="text-xs text-slate-500 font-source mt-0.5">
              {lang === 'sw' 
                ? 'Kila kipengele cha tovuti kimepangwa chini ya ukurasa wake: Mwanzo (Home), Kuhusu (About), Muziki (Music), Matukio (Events), Michango (Financials), na Mawasiliano (Footer).'
                : 'Every feature is organized strictly under its section: Home, About (Members, Trainers, Gallery), Music (Library, Albums), Events, Financials, and Footer.'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 bg-[#FAF8F5] px-3 py-2 rounded-2xl border border-[#0C2340]/10">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Section:</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1058A8] text-white shadow-xs capitalize">
              {mainCategory}
            </span>
          </div>
        </div>

        {/* MASTER FEATURE DIRECTORY (Instant 1-Click Map of ALL Admin Functions) */}
        <div className="bg-gradient-to-r from-[#FAF8F5] to-[#EAF4FB]/50 border border-[#0C2340]/10 rounded-2xl p-4 text-xs font-source space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#0C2340]/10 pb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#1058A8]" />
              <span className="font-bold text-[#0C2340] uppercase tracking-wider text-[11px]">
                {lang === 'sw' ? 'Maudhui na Kumbukumbu Zote za Kwaya' : 'Parish Choir Ministry Directory (All Records Grouped by Section)'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {lang === 'sw' ? 'Bofya kipengele chochote kwenda moja kwa moja' : 'Click any section to view and edit its records'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            
            {/* 1. HOME DIRECTORY */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0C2340] flex items-center gap-1.5 font-source">
                  <Home className="w-3.5 h-3.5 text-[#1058A8]" />
                  1. HOME (Mwanzo)
                </span>
                <span className="text-[10px] text-slate-400 font-semibold font-source">Home page</span>
              </div>
              <div className="flex flex-wrap gap-1 text-[10px]">
                <button
                  onClick={() => handleSelectTab('hero')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer"
                >
                  Choir Crest Logo
                </button>
                <button
                  onClick={() => handleSelectTab('hero')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer"
                >
                  4 Hero Slides
                </button>
                <button
                  onClick={() => handleSelectTab('hero')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer"
                >
                  Parish Msg & Church Img
                </button>
                <button
                  onClick={() => handleSelectTab('hero')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer"
                >
                  Scripture & Choirmaster
                </button>
                <button
                  onClick={() => handleSelectTab('schedule')}
                  className="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-[#1058A8] font-bold border border-blue-200 cursor-pointer flex items-center gap-1"
                >
                  <Clock className="w-2.5 h-2.5" />
                  Sunday Masses & Rehearsals
                </button>
              </div>
            </div>

            {/* 2. ABOUT DIRECTORY */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0C2340] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#1058A8]" />
                  2. ABOUT (Kuhusu)
                </span>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-bold">PDF Ready</span>
              </div>
              <div className="flex flex-wrap gap-1 text-[10px]">
                <button
                  onClick={() => handleSelectTab('members')}
                  className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-[#0C2340] font-bold border border-amber-300 cursor-pointer flex items-center gap-1"
                >
                  <Users className="w-2.5 h-2.5 text-[#1058A8]" />
                  Choir Members Register ({members.length})
                </button>
                <button
                  onClick={() => handleSelectTab('members')}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-2.5 h-2.5 text-emerald-600" />
                  Generate Members PDF
                </button>
                <button
                  onClick={() => handleSelectTab('leaders')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-2.5 h-2.5 text-[#1058A8]" />
                  Trainers & Officials ({leadersList.length})
                </button>
                <button
                  onClick={() => handleSelectTab('photos')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <ImageIcon className="w-2.5 h-2.5 text-[#1058A8]" />
                  Photo Gallery ({groupPhotosList.length})
                </button>
                <button
                  onClick={() => handleSelectTab('about')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer"
                >
                  Our Story & St. Monica
                </button>
                <button
                  onClick={() => handleSelectTab('stats')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer"
                >
                  Ministry Statistics
                </button>
              </div>
            </div>

            {/* 3. MUSIC DIRECTORY */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0C2340] flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#1058A8]" />
                  3. MUSIC (Muziki)
                </span>
                <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded font-bold">Scores & Audio</span>
              </div>
              <div className="flex flex-wrap gap-1 text-[10px]">
                <button
                  onClick={() => handleSelectTab('library')}
                  className="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-[#1058A8] font-bold border border-blue-200 cursor-pointer flex items-center gap-1"
                >
                  <BookOpen className="w-2.5 h-2.5" />
                  Maktaba ya Noti Library ({librarySongs.length})
                </button>
                <button
                  onClick={() => handleSelectTab('albums')}
                  className="px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold border border-purple-200 cursor-pointer flex items-center gap-1"
                >
                  <Disc className="w-2.5 h-2.5" />
                  Choir Albums & Content ({albums.length})
                </button>
                <button
                  onClick={() => handleSelectTab('songs')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <Music className="w-2.5 h-2.5" />
                  Recorded Songs & Lyrics ({songs.length})
                </button>
                <button
                  onClick={() => handleSelectTab('sheet')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <FileText className="w-2.5 h-2.5" />
                  Paid Sheet Music Scores ({sheetMusicList.length})
                </button>
              </div>
            </div>

            {/* 4. EVENTS DIRECTORY */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0C2340] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#1058A8]" />
                  4. EVENTS (Matukio)
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{eventsList.length} items</span>
              </div>
              <div className="flex flex-wrap gap-1 text-[10px]">
                <button
                  onClick={() => handleSelectTab('events')}
                  className="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-[#1058A8] font-bold border border-blue-200 cursor-pointer flex items-center gap-1"
                >
                  <Calendar className="w-2.5 h-2.5" />
                  Liturgical Events Calendar ({eventsList.length})
                </button>
                <button
                  onClick={() => handleSelectTab('events')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer"
                >
                  Parish Feast Days & Retreats
                </button>
              </div>
            </div>

            {/* 5. FINANCIALS DIRECTORY */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-800 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  5. FINANCIALS (Michango)
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">M-Pesa & PDF</span>
              </div>
              <div className="flex flex-wrap gap-1 text-[10px]">
                <button
                  onClick={() => handleSelectTab('financials')}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 cursor-pointer flex items-center gap-1"
                >
                  <DollarSign className="w-2.5 h-2.5 text-emerald-600" />
                  Latest Supporters ({transactions.length})
                </button>
                <button
                  onClick={() => handleSelectTab('financials')}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 cursor-pointer"
                >
                  Total Money Contributed / Paid
                </button>
                <button
                  onClick={() => handleSelectTab('financials')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-2.5 h-2.5 text-emerald-600" />
                  Generate Financial PDF Statement
                </button>
              </div>
            </div>

            {/* 6. FOOTER & SETTINGS DIRECTORY */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0C2340] flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-[#1058A8]" />
                  6. FOOTER & SETTINGS (Mawasiliano)
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Parish & System</span>
              </div>
              <div className="flex flex-wrap gap-1 text-[10px]">
                <button
                  onClick={() => handleSelectTab('footer')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <MapPin className="w-2.5 h-2.5 text-[#1058A8]" />
                  Church Contacts & Address
                </button>
                <button
                  onClick={() => handleSelectTab('footer')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer"
                >
                  M-Pesa Till & Service Times
                </button>
                <button
                  onClick={() => handleSelectTab('backup')}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#EAF4FB] text-[#0C2340] font-medium border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <Settings className="w-2.5 h-2.5 text-[#1058A8]" />
                  System Backup & Reset
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 6 Main Section Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* 1. HOME */}
          <button
            onClick={() => handleSelectCategory('home')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all border text-center ${
              mainCategory === 'home'
                ? 'bg-[#0C2340] text-white border-[#0C2340] shadow-md ring-2 ring-[#7EC8F0]/60'
                : 'bg-[#FAF8F5] text-[#0C2340] border-[#0C2340]/10 hover:bg-[#EAF4FB] hover:border-[#1058A8]'
            }`}
          >
            <Home className={`w-5 h-5 ${mainCategory === 'home' ? 'text-[#7EC8F0]' : 'text-[#1058A8]'}`} />
            <span className="font-bold text-xs">1. HOME</span>
            <span className={`text-[10px] ${mainCategory === 'home' ? 'text-sky-200' : 'text-slate-500'}`}>
              Logo, Slides, Masses
            </span>
          </button>

          {/* 2. ABOUT */}
          <button
            onClick={() => handleSelectCategory('about')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all border text-center ${
              mainCategory === 'about'
                ? 'bg-[#0C2340] text-white border-[#0C2340] shadow-md ring-2 ring-[#7EC8F0]/60'
                : 'bg-[#FAF8F5] text-[#0C2340] border-[#0C2340]/10 hover:bg-[#EAF4FB] hover:border-[#1058A8]'
            }`}
          >
            <BookOpen className={`w-5 h-5 ${mainCategory === 'about' ? 'text-[#7EC8F0]' : 'text-[#1058A8]'}`} />
            <span className="font-bold text-xs">2. ABOUT</span>
            <span className={`text-[10px] ${mainCategory === 'about' ? 'text-sky-200' : 'text-slate-500'}`}>
              Members ({members.length}) + PDF
            </span>
          </button>

          {/* 3. MUSIC */}
          <button
            onClick={() => handleSelectCategory('music')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all border text-center ${
              mainCategory === 'music'
                ? 'bg-[#0C2340] text-white border-[#0C2340] shadow-md ring-2 ring-[#7EC8F0]/60'
                : 'bg-[#FAF8F5] text-[#0C2340] border-[#0C2340]/10 hover:bg-[#EAF4FB] hover:border-[#1058A8]'
            }`}
          >
            <Music className={`w-5 h-5 ${mainCategory === 'music' ? 'text-[#7EC8F0]' : 'text-[#1058A8]'}`} />
            <span className="font-bold text-xs">3. MUSIC</span>
            <span className={`text-[10px] ${mainCategory === 'music' ? 'text-sky-200' : 'text-slate-500'}`}>
              Library, Albums, Songs
            </span>
          </button>

          {/* 4. EVENTS */}
          <button
            onClick={() => handleSelectCategory('events')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all border text-center ${
              mainCategory === 'events'
                ? 'bg-[#0C2340] text-white border-[#0C2340] shadow-md ring-2 ring-[#7EC8F0]/60'
                : 'bg-[#FAF8F5] text-[#0C2340] border-[#0C2340]/10 hover:bg-[#EAF4FB] hover:border-[#1058A8]'
            }`}
          >
            <Calendar className={`w-5 h-5 ${mainCategory === 'events' ? 'text-[#7EC8F0]' : 'text-[#1058A8]'}`} />
            <span className="font-bold text-xs">4. EVENTS</span>
            <span className={`text-[10px] ${mainCategory === 'events' ? 'text-sky-200' : 'text-slate-500'}`}>
              Liturgical Calendar ({eventsList.length})
            </span>
          </button>

          {/* 5. FINANCIALS */}
          <button
            onClick={() => handleSelectCategory('financials')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all border text-center ${
              mainCategory === 'financials'
                ? 'bg-[#0C2340] text-white border-[#0C2340] shadow-md ring-2 ring-emerald-400/60'
                : 'bg-[#FAF8F5] text-[#0C2340] border-[#0C2340]/10 hover:bg-[#EAF4FB] hover:border-[#1058A8]'
            }`}
          >
            <DollarSign className={`w-5 h-5 ${mainCategory === 'financials' ? 'text-emerald-300' : 'text-emerald-600'}`} />
            <span className="font-bold text-xs">5. FINANCIALS</span>
            <span className={`text-[10px] ${mainCategory === 'financials' ? 'text-emerald-200' : 'text-slate-500'}`}>
              Supporters & M-Pesa
            </span>
          </button>

          {/* 6. SETTINGS & FOOTER */}
          <button
            onClick={() => handleSelectCategory('settings')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all border text-center ${
              mainCategory === 'settings'
                ? 'bg-[#0C2340] text-white border-[#0C2340] shadow-md ring-2 ring-[#7EC8F0]/60'
                : 'bg-[#FAF8F5] text-[#0C2340] border-[#0C2340]/10 hover:bg-[#EAF4FB] hover:border-[#1058A8]'
            }`}
          >
            <Settings className={`w-5 h-5 ${mainCategory === 'settings' ? 'text-[#7EC8F0]' : 'text-[#1058A8]'}`} />
            <span className="font-bold text-xs">6. FOOTER</span>
            <span className={`text-[10px] ${mainCategory === 'settings' ? 'text-sky-200' : 'text-slate-500'}`}>
              Contacts & Backup
            </span>
          </button>
        </div>

        {/* Sub-Tabs Navigation Strip for Selected Main Section */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0C2340] uppercase tracking-wider flex items-center gap-1.5">
              <span>Current Section Functions:</span>
              <span className="text-[#1058A8] underline capitalize">{mainCategory}</span>
            </span>
            <span className="text-[11px] text-slate-400 italic hidden sm:inline">
              Select any sub-function below to view and edit its content
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* HOME SUB-TABS */}
            {mainCategory === 'home' && (
              <>
                <button
                  onClick={() => handleSelectTab('hero')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'hero'
                      ? 'bg-[#1058A8] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Home className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Logo, 4 Hero Slides, Parish Welcome & Church Photo, Scripture Quote & Choirmaster Word</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">Visuals</span>
                </button>
                <button
                  onClick={() => handleSelectTab('schedule')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'schedule'
                      ? 'bg-[#1058A8] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Clock className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Sunday Mass Schedules & Weekday Choir Rehearsals</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900">Mass Times</span>
                </button>
              </>
            )}

            {/* ABOUT SUB-TABS */}
            {mainCategory === 'about' && (
              <>
                <button
                  onClick={() => handleSelectTab('members')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'members'
                      ? 'bg-[#1058A8] text-white shadow-md ring-2 ring-amber-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Choir Members Directory & Voice Sections ({members.length})</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900 flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    PDF Export
                  </span>
                </button>

                <button
                  onClick={() => handleSelectTab('leaders')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'leaders'
                      ? 'bg-[#1058A8] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Trainers, Officials & Voice Selection Reps ({leadersList.length})</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">Officials</span>
                </button>

                <button
                  onClick={() => handleSelectTab('photos')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'photos'
                      ? 'bg-[#1058A8] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Choir Photo Gallery ({groupPhotosList.length})</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">Photos</span>
                </button>

                <button
                  onClick={() => handleSelectTab('about')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'about'
                      ? 'bg-[#1058A8] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Our Story & Patron Saint Monica</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">Story & Prayer</span>
                </button>

                <button
                  onClick={() => handleSelectTab('stats')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'stats'
                      ? 'bg-[#1058A8] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Ministry Statistics ({statsForm.membersCount} singers, {statsForm.yearsServing} yrs)</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">Metrics</span>
                </button>
              </>
            )}

            {/* MUSIC SUB-TABS */}
            {mainCategory === 'music' && (
              <>
                <button
                  onClick={() => handleSelectTab('library')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'library'
                      ? 'bg-[#1058A8] text-white shadow-md ring-2 ring-sky-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Music Library — Maktaba ya Noti ({librarySongs.length} Hymns)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-200 text-[#0C2340]">Scores & Sol-fa</span>
                </button>

                <button
                  onClick={() => handleSelectTab('albums')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'albums'
                      ? 'bg-[#1058A8] text-white shadow-md ring-2 ring-purple-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Disc className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Choir Albums & Content ({albums.length} Albums)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-900">Covers & Tracks</span>
                </button>

                <button
                  onClick={() => handleSelectTab('songs')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'songs'
                      ? 'bg-[#1058A8] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Music className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Recorded Songs & Audio Lyrics ({songs.length})</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">Audio & Lyrics</span>
                </button>

                <button
                  onClick={() => handleSelectTab('sheet')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'sheet'
                      ? 'bg-[#1058A8] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Paid Sheet Music Scores ({sheetMusicList.length})</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">Store (KES)</span>
                </button>
              </>
            )}

            {/* EVENTS SUB-TAB */}
            {mainCategory === 'events' && (
              <button
                onClick={() => handleSelectTab('events')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1058A8] text-white shadow-md flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#7EC8F0]" />
                <span>Liturgical Events Calendar & Feast Days ({eventsList.length} Events)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">Feasts & Masses</span>
              </button>
            )}

            {/* FINANCIALS SUB-TAB */}
            {mainCategory === 'financials' && (
              <button
                onClick={() => handleSelectTab('financials')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1058A8] text-white shadow-md ring-2 ring-emerald-400 flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4 text-emerald-300" />
                <span>Supporters Ledger & Total Money Contributed ({transactions.length})</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-400 text-slate-900 flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  PDF Statement & M-Pesa Till
                </span>
              </button>
            )}

            {/* SETTINGS SUB-TABS */}
            {mainCategory === 'settings' && (
              <>
                <button
                  onClick={() => handleSelectTab('footer')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'footer'
                      ? 'bg-[#1058A8] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Footer Contacts, Service Times & M-Pesa Till</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">Contacts</span>
                </button>
                <button
                  onClick={() => handleSelectTab('backup')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'backup'
                      ? 'bg-[#1058A8] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Settings className="w-4 h-4 text-[#7EC8F0]" />
                  <span>Data Backup, Export & Reset</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">Database</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>

      {/* ACTIVE SECTION BREADCRUMB & SIBLING SWITCHER */}
      <div className="bg-[#FAF8F5] border border-[#0C2340]/10 px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-source">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Editing:</span>
          <span className="font-bold text-[#0C2340] uppercase tracking-wide">
            {mainCategory === 'home' && 'Section 1: Home Page'}
            {mainCategory === 'about' && 'Section 2: About Choir'}
            {mainCategory === 'music' && 'Section 3: Music & Maktaba'}
            {mainCategory === 'events' && 'Section 4: Events Calendar'}
            {mainCategory === 'financials' && 'Section 5: Financials & Supporters'}
            {mainCategory === 'settings' && 'Section 6: Footer & Settings'}
          </span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-[#1058A8]">
            {activeTab === 'hero' && 'Logo & Carousel Slideshow'}
            {activeTab === 'schedule' && 'Sunday Masses & Rehearsals'}
            {activeTab === 'members' && `Choir Members Register (${members.length}) [PDF Export Ready]`}
            {activeTab === 'leaders' && `Trainers & Officials (${leadersList.length})`}
            {activeTab === 'photos' && `Photo Gallery (${groupPhotosList.length})`}
            {activeTab === 'about' && 'Our Story & St. Monica'}
            {activeTab === 'stats' && 'Ministry Statistics'}
            {activeTab === 'library' && `Maktaba ya Noti (${librarySongs.length} Scores)`}
            {activeTab === 'albums' && `Choir Albums (${albums.length})`}
            {activeTab === 'songs' && `Recorded Hymns (${songs.length})`}
            {activeTab === 'sheet' && `Paid Sheet Music (${sheetMusicList.length})`}
            {activeTab === 'events' && `Liturgical Calendar (${eventsList.length})`}
            {activeTab === 'financials' && `Supporters & Contributions (${transactions.length}) [PDF Statement Ready]`}
            {activeTab === 'footer' && 'Contacts & M-Pesa Till'}
            {activeTab === 'backup' && 'System Backup & Reset'}
          </span>
        </div>

        {/* Quick Sibling Switchers for About */}
        {mainCategory === 'about' && (
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400">Switch:</span>
            {activeTab !== 'members' && (
              <button onClick={() => handleSelectTab('members')} className="text-[#1058A8] hover:underline font-bold cursor-pointer">
                Members Register ({members.length})
              </button>
            )}
            {activeTab !== 'leaders' && (
              <button onClick={() => handleSelectTab('leaders')} className="text-[#1058A8] hover:underline font-bold cursor-pointer">
                Trainers ({leadersList.length})
              </button>
            )}
            {activeTab !== 'photos' && (
              <button onClick={() => handleSelectTab('photos')} className="text-[#1058A8] hover:underline font-bold cursor-pointer">
                Gallery ({groupPhotosList.length})
              </button>
            )}
            {activeTab !== 'about' && (
              <button onClick={() => handleSelectTab('about')} className="text-[#1058A8] hover:underline font-bold cursor-pointer">
                Our Story
              </button>
            )}
          </div>
        )}

        {/* Quick Sibling Switchers for Music */}
        {mainCategory === 'music' && (
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400">Switch:</span>
            {activeTab !== 'library' && (
              <button onClick={() => handleSelectTab('library')} className="text-[#1058A8] hover:underline font-bold cursor-pointer">
                Music Library ({librarySongs.length})
              </button>
            )}
            {activeTab !== 'albums' && (
              <button onClick={() => handleSelectTab('albums')} className="text-[#1058A8] hover:underline font-bold cursor-pointer">
                Albums ({albums.length})
              </button>
            )}
            {activeTab !== 'songs' && (
              <button onClick={() => handleSelectTab('songs')} className="text-[#1058A8] hover:underline font-bold cursor-pointer">
                Recorded Songs ({songs.length})
              </button>
            )}
            {activeTab !== 'sheet' && (
              <button onClick={() => handleSelectTab('sheet')} className="text-[#1058A8] hover:underline font-bold cursor-pointer">
                Scores Store
              </button>
            )}
          </div>
        )}

        {/* Quick Sibling Switchers for Home */}
        {mainCategory === 'home' && (
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400">Switch:</span>
            {activeTab !== 'hero' && (
              <button onClick={() => handleSelectTab('hero')} className="text-[#1058A8] hover:underline font-bold cursor-pointer">
                Logo & Slideshow
              </button>
            )}
            {activeTab !== 'schedule' && (
              <button onClick={() => handleSelectTab('schedule')} className="text-[#1058A8] hover:underline font-bold cursor-pointer">
                Sunday Masses & Rehearsals
              </button>
            )}
          </div>
        )}
      </div>

      {/* TAB: CHOIR MEMBERS & VOICE SECTIONS (with PDF Generator) */}
      {activeTab === 'members' && (
        <AdminMembersTab onNotify={notify} />
      )}

      {/* TAB: CHOIR ALBUMS & TRACKS */}
      {activeTab === 'albums' && (
        <AdminAlbumsTab onNotify={notify} />
      )}

      {/* TAB: FINANCIALS & SUPPORTERS */}
      {activeTab === 'financials' && (
        <AdminFinancialsTab onNotify={notify} />
      )}

      {/* TAB 0A: HOMEPAGE & VISUALS (Logo, 4 Hero Slides, Parish Msg & Church Img, Bible Quote, Choirmaster Word & Picture) */}
      {activeTab === 'hero' && (
        <AdminHomepageTab onNotify={notify} />
      )}

      {/* TAB 0B: ABOUT PAGE CONTENT & PHOTOS (Story banner & photo, Patron Saint banner & portrait, bio, prayer) */}
      {activeTab === 'about' && (
        <AdminAboutTab onNotify={notify} />
      )}

      {/* TAB 0B: CHOIR STATISTICS & MINISTRY METRICS */}
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
                  <p className="text-[11px] text-slate-400 font-source italic mt-0.5">
                    (Takwimu za Utume: Waimbaji, miaka ya utume, na noti za kwaya)
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-[#1058A8] border border-blue-200">
                    Live In About Story
                  </span>
                </div>
              </div>

              {/* Live Preview Cards */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#0C2340]/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Live Preview on "About Choir" Page (Muonekano Moja kwa Moja)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center pt-1">
                  <div className="p-3.5 bg-white rounded-xl border border-[#0C2340]/10 shadow-xs flex flex-col items-center">
                    <Users className="w-5 h-5 text-[#1058A8] mb-1" />
                    <span className="font-eb-garamond text-2xl font-bold text-[#1058A8] tabular-nums">
                      {statsForm.membersCount}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Active Choristers
                    </span>
                    <span className="text-[10px] text-slate-500">Waimbaji (SATB Polyphony)</span>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-[#0C2340]/10 shadow-xs flex flex-col items-center">
                    <Calendar className="w-5 h-5 text-[#0C2340] mb-1" />
                    <span className="font-eb-garamond text-2xl font-bold text-[#0C2340] tabular-nums">
                      {statsForm.yearsServing}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Years of Ministry
                    </span>
                    <span className="text-[10px] text-slate-500">Miaka (Founded {statsForm.foundedYear})</span>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-[#0C2340]/10 shadow-xs flex flex-col items-center">
                    <Music className="w-5 h-5 text-[#1058A8] mb-1" />
                    <span className="font-eb-garamond text-2xl font-bold text-[#1058A8] tabular-nums">
                      {statsForm.repertoireCount}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Choral Scores
                    </span>
                    <span className="text-[10px] text-slate-500">Noti za Kwaya</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveStats} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5">
                      Active Choristers Count <span className="text-slate-400 font-normal">(Idadi ya Waimbaji)</span>
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
                      Years of Ministry <span className="text-slate-400 font-normal">(Miaka ya Utume)</span>
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
                      Choral Scores in Catalog <span className="text-slate-400 font-normal">(Noti Zilizohifadhiwa)</span>
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
                      Year Founded <span className="text-slate-400 font-normal">(Mwaka wa Kuanzishwa)</span>
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

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-source italic">
                    Statistics update live in the About page and across the website.
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Choir Statistics (Hifadhi Takwimu)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 0C: SUNDAY MASS & REHEARSAL SCHEDULE (Add, Edit, Delete Masses) */}
      {activeTab === 'schedule' && (
        <AdminMassesTab onNotify={notify} />
      )}

      {/* TAB 0D: FOOTER & CONTACT INFORMATION */}
      {activeTab === 'footer' && (
        <AdminFooterTab onNotify={notify} />
      )}

      {/* TAB 0D: CHOIR EVENTS CALENDAR */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                Choir Liturgical Events Calendar
              </h2>
              <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
                Manage parish feast days, diocesan music festivals, and choir retreats displayed on the public events page.
              </p>
              <p className="text-[11px] text-slate-400 font-source italic mt-0.5">
                (Kalenda ya Matukio ya Kwaya: Sikukuu, Matamasha, na Misa za Sherehe)
              </p>
            </div>
            <button
              onClick={openAddEventModal}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Event (Ongeza Tukio)</span>
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
                  <div>
                    <h3 className="font-eb-garamond text-lg font-bold text-[#0C2340]">
                      {evt.title}
                    </h3>
                    {evt.titleSw && evt.titleSw !== evt.title && (
                      <span className="text-xs text-slate-500 italic block font-source mt-0.5">
                        {evt.titleSw}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs text-slate-600 font-source">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#1058A8]" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1058A8]" />
                      <span>{evt.venue}, {evt.city}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 font-source line-clamp-2">
                    {evt.description || evt.descriptionSw}
                  </p>
                  {evt.descriptionSw && evt.description && evt.descriptionSw !== evt.description && (
                    <p className="text-[11px] text-slate-500 font-source italic line-clamp-1 border-t border-slate-100 pt-1">
                      SW: {evt.descriptionSw}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#0C2340]/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {evt.entryType || 'Free Entry'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditEventModal(evt)}
                      className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="Edit Event"
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
                      title="Delete Event"
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

      {/* TAB 1: SONGS MANAGEMENT */}
      {activeTab === 'songs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
                Choir Repertoire & YouTube Releases
              </h2>
              <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
                Manage all songs shown on the music page, player, and linked to the official YouTube channel ({YOUTUBE_CHANNEL_HANDLE}).
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
                <thead className="bg-[#F8FAFC] border-b border-[#0C2340]/10 text-[#0C2340]/70 text-[12px] font-semibold font-source">
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
                        <div className="font-bold text-[#0C2340] font-eb-garamond text-sm">{song.title}</div>
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
                      <td className="py-3 px-4 text-[#0C2340]/70 font-source text-[11px]">
                        {song.voicing} · {song.musicalKey}
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={song.youtubeUrl || YOUTUBE_CHANNEL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1058A8] hover:text-[#0C2340] font-bold flex items-center gap-1.5 text-[11px]"
                        >
                          <RealYouTubeIcon size={16} variant="badge" />
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
              <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
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
                    <span className="bg-[#EAF4FB] text-[#1058A8] font-bold text-[11px] px-2 py-0.5 rounded font-source">
                      {item.notationType}
                    </span>
                    <span className="text-base font-bold font-eb-garamond text-[#1058A8]">
                      KES {item.priceKes}
                    </span>
                  </div>

                  <h3 className="font-eb-garamond text-base font-bold text-[#0C2340] leading-snug">
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

      {/* TAB: MAKTABA YA NOTI (FREE SHEET MUSIC LIBRARY) */}
      {activeTab === 'library' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
                Maktaba ya Noti (Free Sheet Music Library)
              </h2>
              <p className="text-xs text-[#0C2340]/70 font-source mt-0.5">
                Manage public domain & permission-cleared Catholic scores. Download counts visible to admin only.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setCsvSpreadsheetText(`Title,Composer,Language,Category,Voices,SharingStatus,PermissionBy,PermissionDate
Bwana Mchungaji Wangu,Fr. Kayetta,Kiswahili,zaburi|komunyo,SATB,Shared with permission,Fr. Kayetta Archive,2025-01-10
Adeste Fideles,Traditional Latin,Latin,noeli,SATB,Public domain,,`);
                  setShowBulkSpreadsheetModal(true);
                }}
                className="px-3.5 py-2 text-xs font-bold bg-white border border-[#0C2340]/20 hover:bg-[#EAF4FB] text-[#0C2340] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#1058A8]" />
                <span>Import from Spreadsheet</span>
              </button>

              <button
                onClick={() => {
                  setEditingLibSongId(null);
                  setLibTitle('');
                  setLibComposer('');
                  setLibLanguage('Kiswahili');
                  setLibCategories(['kuingia']);
                  setLibVoices('SATB');
                  setLibLyrics('');
                  setLibPdfUrl('');
                  setLibAudioUrl('');
                  setLibSharingStatus('Public domain');
                  setLibPermissionGivenBy('');
                  setLibPermissionDate('');
                  setLibExternalSourceUrl('');
                  setShowLibModal(true);
                }}
                className="px-4 py-2 text-xs font-bold bg-[#1058A8] hover:bg-[#0C2340] text-white rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Song to Library</span>
              </button>
            </div>
          </div>

          {/* Quick Stats: Admin-Only metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-source">
            <div className="bg-white p-4 rounded-xl border border-[#0C2340]/10 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-semibold block">Total Library Songs</span>
              <strong className="text-2xl font-bold text-[#0C2340] block">{librarySongs.length}</strong>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/20 space-y-1 shadow-2xs">
              <span className="text-emerald-700 font-semibold block">Total Downloads (Admin Only)</span>
              <strong className="text-2xl font-bold text-emerald-800 block">
                {librarySongs.reduce((sum, s) => sum + (s.downloadCount || 0), 0).toLocaleString()}
              </strong>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#0C2340]/10 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-semibold block">Public Domain Scores</span>
              <strong className="text-2xl font-bold text-[#0C2340] block">
                {librarySongs.filter(s => s.sharingStatus === 'Public domain').length}
              </strong>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#0C2340]/10 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-semibold block">Permission Cleared</span>
              <strong className="text-2xl font-bold text-[#1058A8] block">
                {librarySongs.filter(s => s.sharingStatus === 'Shared with permission').length}
              </strong>
            </div>
          </div>

          {/* Table of Songs */}
          <div className="bg-white border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#0C2340]/10 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Title & Composer</th>
                    <th className="p-3.5">Language / Voices</th>
                    <th className="p-3.5">Categories</th>
                    <th className="p-3.5">Sharing Status</th>
                    <th className="p-3.5 text-center">Downloads (Admin)</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0C2340]/5">
                  {librarySongs.map(song => (
                    <tr key={song.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="p-3.5">
                        <strong className="font-eb-garamond text-base font-bold text-[#0C2340] block">
                          {song.title}
                        </strong>
                        <span className="text-slate-500">{song.composer}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-slate-800 block">{song.language}</span>
                        <span className="text-slate-500 text-[11px]">{song.voices}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {song.categories.map(cId => {
                            const cat = LIBRARY_CATEGORIES.find(c => c.id === cId);
                            return (
                              <span key={cId} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                                {cat ? cat.nameSw : cId}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          song.sharingStatus === 'Public domain'
                            ? 'bg-emerald-100 text-emerald-800'
                            : song.sharingStatus === 'Shared with permission'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {song.sharingStatus}
                        </span>
                        {song.permissionGivenBy && (
                          <span className="block text-[11px] text-slate-500 mt-0.5 truncate max-w-[160px]" title={song.permissionGivenBy}>
                            By: {song.permissionGivenBy}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-[#0C2340] bg-slate-100 px-2.5 py-1 rounded-full text-xs">
                          <Download className="w-3 h-3 text-[#1058A8]" />
                          {song.downloadCount || 0}
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingLibSongId(song.id);
                              setLibTitle(song.title);
                              setLibComposer(song.composer);
                              setLibLanguage(song.language);
                              setLibCategories(song.categories);
                              setLibVoices(song.voices);
                              setLibLyrics(song.lyrics || '');
                              setLibPdfUrl(song.pdfUrl || '');
                              setLibAudioUrl(song.audioUrl || '');
                              setLibSharingStatus(song.sharingStatus);
                              setLibPermissionGivenBy(song.permissionGivenBy || '');
                              setLibPermissionDate(song.permissionDate || '');
                              setLibExternalSourceUrl(song.externalSourceUrl || '');
                              setShowLibModal(true);
                            }}
                            className="p-1.5 text-[#1058A8] hover:bg-[#EAF4FB] rounded-lg transition-colors cursor-pointer"
                            title="Edit Song"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete song "${song.title}" from library?`)) {
                                deleteLibrarySong(song.id);
                                setSuccessMessage(`Removed "${song.title}" from library.`);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Song"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* MODAL: ADD / EDIT LIBRARY SONG (Step 6 Form) */}
      {showLibModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C2340]/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#0C2340]/15 space-y-5 my-8 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#0C2340]/10">
              <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                {editingLibSongId ? 'Edit Library Song' : 'Add Song to Maktaba ya Noti'}
              </h3>
              <button 
                onClick={() => setShowLibModal(false)}
                className="text-slate-400 hover:text-[#0C2340] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!libTitle.trim() || !libComposer.trim()) return;

                if (editingLibSongId) {
                  updateLibrarySong(editingLibSongId, {
                    title: libTitle.trim(),
                    composer: libComposer.trim(),
                    language: libLanguage,
                    categories: libCategories,
                    voices: libVoices,
                    lyrics: libLyrics.trim() || undefined,
                    pdfUrl: libPdfUrl.trim() || undefined,
                    audioUrl: libAudioUrl.trim() || undefined,
                    hasAudio: !!libAudioUrl.trim(),
                    sharingStatus: libSharingStatus,
                    permissionGivenBy: libSharingStatus === 'Shared with permission' ? libPermissionGivenBy.trim() : undefined,
                    permissionDate: libSharingStatus === 'Shared with permission' ? libPermissionDate.trim() : undefined,
                    externalSourceUrl: libSharingStatus === 'Link only' ? libExternalSourceUrl.trim() : undefined,
                  });
                  setSuccessMessage(`Updated "${libTitle}" in Maktaba ya Noti.`);
                } else {
                  addLibrarySong({
                    title: libTitle.trim(),
                    composer: libComposer.trim(),
                    language: libLanguage,
                    categories: libCategories,
                    voices: libVoices,
                    lyrics: libLyrics.trim() || undefined,
                    pdfUrl: libPdfUrl.trim() || undefined,
                    audioUrl: libAudioUrl.trim() || undefined,
                    hasAudio: !!libAudioUrl.trim(),
                    sharingStatus: libSharingStatus,
                    permissionGivenBy: libSharingStatus === 'Shared with permission' ? libPermissionGivenBy.trim() : undefined,
                    permissionDate: libSharingStatus === 'Shared with permission' ? libPermissionDate.trim() : undefined,
                    externalSourceUrl: libSharingStatus === 'Link only' ? libExternalSourceUrl.trim() : undefined,
                  });
                  setSuccessMessage(`Added "${libTitle}" to Maktaba ya Noti.`);
                }
                setShowLibModal(false);
              }}
              className="space-y-4 text-xs font-source"
            >
              {/* Title & Composer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Song Title *</label>
                  <input
                    type="text"
                    required
                    value={libTitle}
                    onChange={(e) => setLibTitle(e.target.value)}
                    placeholder="e.g. Twende Wote Nyumbani Mwa Bwana"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Composer *</label>
                  <input
                    type="text"
                    required
                    value={libComposer}
                    onChange={(e) => setLibComposer(e.target.value)}
                    placeholder="e.g. Fr. G. Shengena / Traditional"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1058A8] outline-none"
                  />
                </div>
              </div>

              {/* Language & Voices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Language</label>
                  <select
                    value={libLanguage}
                    onChange={(e) => setLibLanguage(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
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
                  <label className="font-semibold text-slate-700 block mb-1">Voices</label>
                  <select
                    value={libVoices}
                    onChange={(e) => setLibVoices(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white outline-none"
                  >
                    <option value="SATB">SATB (Soprano, Alto, Tenor, Bass)</option>
                    <option value="Unison">Unison</option>
                    <option value="Solo">Solo</option>
                    <option value="SSAA">SSAA</option>
                    <option value="TTBB">TTBB</option>
                  </select>
                </div>
              </div>

              {/* Categories (Multi-select checkboxes - more than one allowed) */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Categories (Select one or more) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-40 overflow-y-auto">
                  {LIBRARY_CATEGORIES.map(cat => {
                    const isChecked = libCategories.includes(cat.id);
                    return (
                      <label key={cat.id} className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-800">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLibCategories(prev => [...prev, cat.id]);
                            } else {
                              if (libCategories.length > 1) {
                                setLibCategories(prev => prev.filter(c => c !== cat.id));
                              }
                            }
                          }}
                          className="rounded text-[#1058A8] focus:ring-0"
                        />
                        <span>{cat.nameSw}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Sharing Status */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sharing Status *</label>
                <select
                  value={libSharingStatus}
                  onChange={(e) => setLibSharingStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white outline-none font-semibold"
                >
                  <option value="Public domain">Public domain (Author rights expired / Traditional)</option>
                  <option value="Shared with permission">Shared with permission (Consent obtained)</option>
                  <option value="Link only">Link only (Copyrighted external score - no download)</option>
                </select>
              </div>

              {/* Conditional permission fields */}
              {libSharingStatus === 'Shared with permission' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                  <div>
                    <label className="font-semibold text-blue-900 block mb-1">Person who gave permission *</label>
                    <input
                      type="text"
                      required={libSharingStatus === 'Shared with permission'}
                      value={libPermissionGivenBy}
                      onChange={(e) => setLibPermissionGivenBy(e.target.value)}
                      placeholder="e.g. Fr. Kayetta (Author) via WhatsApp"
                      className="w-full p-2 rounded-lg border border-blue-300 bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-blue-900 block mb-1">Permission Date</label>
                    <input
                      type="date"
                      value={libPermissionDate}
                      onChange={(e) => setLibPermissionDate(e.target.value)}
                      className="w-full p-2 rounded-lg border border-blue-300 bg-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Conditional link only field */}
              {libSharingStatus === 'Link only' && (
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                  <label className="font-semibold text-amber-900 block mb-1">External Publisher / Source URL *</label>
                  <input
                    type="url"
                    required={libSharingStatus === 'Link only'}
                    value={libExternalSourceUrl}
                    onChange={(e) => setLibExternalSourceUrl(e.target.value)}
                    placeholder="https://example.com/scores/original-publisher"
                    className="w-full p-2 rounded-lg border border-amber-300 bg-white outline-none"
                  />
                </div>
              )}

              {/* PDF and Audio URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PDF File URL</label>
                  <input
                    type="text"
                    value={libPdfUrl}
                    onChange={(e) => setLibPdfUrl(e.target.value)}
                    placeholder="https://.../score.pdf"
                    className="w-full p-2.5 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Audio Recording URL (Optional)</label>
                  <input
                    type="text"
                    value={libAudioUrl}
                    onChange={(e) => setLibAudioUrl(e.target.value)}
                    placeholder="https://.../preview.mp3"
                    className="w-full p-2.5 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>

              {/* Lyrics */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Song Lyrics / Text</label>
                <textarea
                  rows={4}
                  value={libLyrics}
                  onChange={(e) => setLibLyrics(e.target.value)}
                  placeholder="Enter stanzas and refrain..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-serif text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowLibModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold cursor-pointer shadow-xs"
                >
                  {editingLibSongId ? 'Save Changes' : 'Add to Maktaba ya Noti'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SPREADSHEET BATCH IMPORT (Step 6) */}
      {showBulkSpreadsheetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C2340]/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#0C2340]/15 space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#0C2340]/10">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#1058A8]" />
                <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                  Import Many Songs from Spreadsheet (CSV)
                </h3>
              </div>
              <button 
                onClick={() => setShowBulkSpreadsheetModal(false)}
                className="text-slate-400 hover:text-[#0C2340] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Paste rows copied directly from Google Sheets or Excel. Format: 
              <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] block mt-1 font-mono">
                Title, Composer, Language, Categories, Voices, SharingStatus, PermissionBy, PermissionDate
              </code>
            </p>

            <textarea
              rows={8}
              value={csvSpreadsheetText}
              onChange={(e) => setCsvSpreadsheetText(e.target.value)}
              placeholder="Title,Composer,Language,Category,Voices,SharingStatus,PermissionBy,PermissionDate"
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1058A8]"
            />

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                {csvSpreadsheetText.trim() ? `${csvSpreadsheetText.trim().split('\n').length} row(s) entered` : '0 rows'}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkSpreadsheetModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!csvSpreadsheetText.trim()) return;
                    const lines = csvSpreadsheetText.trim().split('\n');
                    const newItems: LibrarySong[] = [];
                    const today = new Date().toISOString().split('T')[0];

                    lines.forEach((line, idx) => {
                      if (idx === 0 && line.toLowerCase().includes('title')) return;
                      const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
                      if (parts.length >= 2 && parts[0] && parts[1]) {
                        const title = parts[0];
                        const composer = parts[1];
                        const language = (parts[2] || 'Kiswahili') as any;
                        const catStr = parts[3] || 'kuingia';
                        const cats = catStr.split('|').map(c => c.trim().toLowerCase());
                        const voices = (parts[4] || 'SATB') as any;
                        const sharingStatus = (parts[5] || 'Public domain') as any;
                        const permissionBy = parts[6] || undefined;
                        const permissionDate = parts[7] || undefined;

                        newItems.push({
                          id: `lib-csv-${Date.now()}-${idx}`,
                          title,
                          composer,
                          language,
                          categories: cats.length > 0 ? cats : ['kuingia'],
                          voices,
                          sharingStatus: (['Public domain', 'Shared with permission', 'Link only'].includes(sharingStatus) ? sharingStatus : 'Public domain'),
                          permissionGivenBy: permissionBy,
                          permissionDate: permissionDate,
                          downloadCount: 0,
                          addedDate: today,
                          solfaNotes: true
                        });
                      }
                    });

                    if (newItems.length > 0) {
                      bulkImportLibrarySongs(newItems);
                      setSuccessMessage(`Successfully imported ${newItems.length} songs from spreadsheet!`);
                      setShowBulkSpreadsheetModal(false);
                      setCsvSpreadsheetText('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white text-xs font-bold cursor-pointer"
                >
                  Import All Songs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRAINERS & OFFICIALS (LEADERSHIP) */}
      {activeTab === 'leaders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
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
                    <div className="w-12 h-12 rounded-full bg-[#EAF4FB] border border-[#7EC8F0]/40 flex items-center justify-center font-eb-garamond font-bold text-lg text-[#1058A8]">
                      {leader.name.split(' ').slice(-1)[0][0]}
                    </div>
                    <div>
                      <h3 className="font-eb-garamond text-base font-bold text-[#0C2340]">{leader.name}</h3>
                      <span className="text-xs font-bold text-[#1058A8] block">{leader.role}</span>
                      <span className="text-[12px] text-[#0C2340]/50 font-source tabular-nums">{leader.tenure}</span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded font-source ${
                    leader.category === 'trainer' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {leader.category}
                  </span>
                </div>

                <p className="text-xs text-[#0C2340]/80 leading-relaxed pt-2 border-t border-[#0C2340]/5">
                  {leader.responsibility}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#0C2340]/60 font-source text-xs">{leader.contact || 'SEC 58 Parish'}</span>
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
              <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
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
                  <span className="absolute top-2 left-2 bg-[#0C2340] text-white font-source tabular-nums text-xs px-2 py-0.5 rounded-[12px]">
                    {photo.year}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-eb-garamond font-bold text-[#0C2340] text-sm">{photo.title}</h4>
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
            <h2 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
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
              <h3 className="font-eb-garamond font-bold text-[#0C2340] text-base">Export JSON Backup</h3>
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
              <h3 className="font-eb-garamond font-bold text-[#0C2340] text-base">Restore from JSON</h3>
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
              <h3 className="font-eb-garamond font-bold text-red-900 text-base">Reset to Verified Catalog</h3>
              <p className="text-xs text-red-700/80">
                Restore the default catalog of St. Monica Catholic Choir Nakuru with real YouTube releases.
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
                <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                  {editingSongId ? 'Edit Song Details' : 'Add New Song to Catalog'}
                </h3>
                <span className="text-xs text-[#1058A8] font-source">
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
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none font-source text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Lyrics (English Translation)</label>
                <textarea
                  rows={3}
                  value={songForm.lyricsEnglishText}
                  onChange={e => setSongForm({ ...songForm, lyricsEnglishText: e.target.value })}
                  placeholder="First verse line..."
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none font-source text-xs"
                />
              </div>

              <div>
                <ImageUploadField
                  label="Song Cover Art / Thumbnail (Optional)"
                  labelSw="Picha ya Jalada la Wimbo (Thumbnail)"
                  value={songForm.thumbnailUrl}
                  onChange={val => setSongForm({ ...songForm, thumbnailUrl: val })}
                  helpText="Upload album art or photo for this hymn."
                  aspectRatio="aspect-square"
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
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
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

              <div>
                <ImageUploadField
                  label="Sheet Music Score Preview Image (4:3)"
                  labelSw="Picha ya Noti (Preview)"
                  value={sheetForm.previewImage}
                  onChange={val => setSheetForm({ ...sheetForm, previewImage: val })}
                  helpText="Upload score page scan for card preview."
                  aspectRatio="aspect-[4/3]"
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
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
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
                    placeholder="Mwalimu Joseph Otieno"
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

              <div>
                <ImageUploadField
                  label="Leader / Choirmaster Portrait Photo (Optional)"
                  labelSw="Picha ya Kiongozi / Mwalimu"
                  value={leaderForm.photoUrl}
                  onChange={val => setLeaderForm({ ...leaderForm, photoUrl: val })}
                  helpText="Upload portrait photo of official or trainer."
                  aspectRatio="aspect-square"
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
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
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

              <div>
                <ImageUploadField
                  label="Upload Gallery Photo or Enter Image URL *"
                  labelSw="Pakia Picha ya Albamu / Weka Anwani"
                  value={photoForm.customUrl}
                  onChange={val => setPhotoForm({ ...photoForm, customUrl: val })}
                  helpText="Upload ensemble photo or choose from preset authentic photos."
                  aspectRatio="aspect-video"
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

      {/* EVENT FORM MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#0C2340]/20 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#0C2340]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF4FB] text-[#1058A8] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                    {editingEventId ? (lang === 'sw' ? 'Hariri Tukio la Kwaya' : 'Edit Choir Event') : (lang === 'sw' ? 'Ongeza Tukio Jipya' : 'Add New Choir Event')}
                  </h3>
                  <p className="text-xs text-slate-500 font-source">
                    Section 58 · Nakuru
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs font-source">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Event Title (English)</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="Feast of St. Monica"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Jina la Tukio (Kiswahili)</label>
                  <input
                    type="text"
                    required
                    value={eventForm.titleSw}
                    onChange={e => setEventForm({ ...eventForm, titleSw: e.target.value })}
                    placeholder="Sikukuu ya Mtakatifu Monika"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Day (e.g. 27)</label>
                  <input
                    type="text"
                    value={eventForm.dateDay}
                    onChange={e => setEventForm({ ...eventForm, dateDay: e.target.value })}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Month (e.g. AUG)</label>
                  <input
                    type="text"
                    value={eventForm.dateMonth}
                    onChange={e => setEventForm({ ...eventForm, dateMonth: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Full Date Label</label>
                  <input
                    type="text"
                    value={eventForm.fullDate}
                    onChange={e => setEventForm({ ...eventForm, fullDate: e.target.value })}
                    placeholder="27th August 2026"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={e => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  >
                    <option value="Patronal Feast">Patronal Feast (Sikukuu ya Msimamizi)</option>
                    <option value="Diocesan Festival">Diocesan Choral Festival</option>
                    <option value="Parish Liturgy">Parish High Mass Liturgy</option>
                    <option value="Choir Retreat">Choir Spiritual Retreat</option>
                    <option value="Easter & Christmas">Easter & Christmas Carol</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="block font-bold text-[#0C2340] mb-1">City / Location</label>
                  <input
                    type="text"
                    value={eventForm.city}
                    onChange={e => setEventForm({ ...eventForm, city: e.target.value })}
                    placeholder="Section 58, Nakuru"
                    className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Solemn Eucharistic celebration with St. Monica Third Mass Choir..."
                  className="w-full p-2.5 border border-[#0C2340]/20 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Maelezo (Kiswahili)</label>
                <textarea
                  rows={2}
                  value={eventForm.descriptionSw}
                  onChange={e => setEventForm({ ...eventForm, descriptionSw: e.target.value })}
                  placeholder="Misa Takatifu ya sherehe ikiongozwa na Kwaya ya Mtakatifu Monika..."
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
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingEventId ? 'Update Event' : 'Add Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
