export interface Song {
  id: string;
  title: string;
  titleSwahili: string;
  album: string;
  composer: string;
  year: number;
  season: 'Ordinary Time' | 'Advent' | 'Lent' | 'Easter' | 'Marian' | 'Patronal';
  seasonSwahili: string;
  partOfMass: 'Entrance' | 'Kyrie & Gloria' | 'Offertory' | 'Communion' | 'Meditation' | 'Recessional' | 'Praise';
  partOfMassSwahili: string;
  language: string;
  voicing: string;
  musicalKey: string;
  duration: string;
  youtubeUrl: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  audioPreviewUrl: string;
  sheetMusicAvailable: boolean;
  scorePriceKes: number;
  lyricsSwahili: string[];
  lyricsEnglish: string[];
  waveformPeaks: number[];
  recordedAt?: string;
  whyWeSingIt?: string;
  whyWeSingItSw?: string;
  notesUrl?: string;
  notesFileName?: string;
  midiUrl?: string;
  midiFileName?: string;
}

export interface SheetMusicItem {
  id: string;
  title: string;
  titleSw: string;
  composer: string;
  arranger?: string;
  notationType: 'Tonic Sol-fa & Staff' | 'Tonic Sol-fa' | 'Staff Notation';
  voicing: string;
  voiceParts?: string; // "Soprano, Alto, Tenor, Bass (SATB)"
  partOfMass: string;
  season: string;
  priceKes: number;
  priceUsd: number;
  previewBars?: string;
  description: string;
  descriptionSw: string;
  downloadUrl?: string;
  previewImage?: string;
}

export interface Album {
  id: string;
  title: string;
  releaseYear: number;
  trackCount: number;
  coverImage: string;
  priceKes: number;
  description: string;
  descriptionSw: string;
  youtubePlaylistUrl?: string;
  songs: string[];
}

export interface ChoirLeader {
  id: string;
  name: string;
  role: string;
  roleSw: string;
  category: 'trainer' | 'official';
  responsibility: string;
  responsibilitySw: string;
  tenure: string;
  tenureSw: string;
  contact?: string;
  photoUrl?: string;
}

export interface ChoirGroupPhoto {
  id: string;
  title: string;
  titleSw: string;
  description: string;
  descriptionSw: string;
  year: string;
  imageKey: 'choir_singing_moment' | 'nakuru_parish_cathedral' | 'sheet_music_hymnal';
  customUrl?: string;
  occasion: string;
  occasionSw: string;
}

export interface ProductItem {
  id: string;
  name: string;
  nameSw: string;
  type: 'digital_album' | 'physical_cd' | 'usb' | 'sheet_music';
  priceKes: number;
  priceUsd: number;
  description: string;
  descriptionSw: string;
  image: string;
  badge?: string;
  downloadable?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  titleSw: string;
  dateDay: string;
  dateMonth: string;
  fullDate: string;
  time: string;
  venue: string;
  city: string;
  description: string;
  descriptionSw: string;
  category: string;
  entryType: string;
  isUpcoming?: boolean;
}

export interface SupporterTransaction {
  id: string;
  donorName: string;
  donorPhone?: string;
  amountKes: number;
  date: string;
  purpose: string;
  purposeSw?: string;
  paymentMethod: 'mpesa' | 'card' | 'cash';
  mpesaReference: string;
  status: 'completed' | 'verified' | 'pending';
  category: 'donation' | 'sheet_music' | 'membership' | 'album';
}

export const INITIAL_TRANSACTIONS: SupporterTransaction[] = [
  {
    id: "tx-01",
    donorName: "Bernard Kiprono",
    donorPhone: "0722 *** 410",
    amountKes: 3000,
    date: "2026-10-19 15:42",
    purpose: "Choir Sound & Microphones Fund",
    purposeSw: "Mchango wa Vipaza Sauti vya Kwaya",
    paymentMethod: "mpesa",
    mpesaReference: "SH81QW4019",
    status: "verified",
    category: "donation"
  },
  {
    id: "tx-02",
    donorName: "Regina Muthoni",
    donorPhone: "0714 *** 982",
    amountKes: 1500,
    date: "2026-10-18 11:20",
    purpose: "Gift for Hymn: Machozi ya Imani",
    purposeSw: "Sadaka ya Wimbo: Machozi ya Imani",
    paymentMethod: "mpesa",
    mpesaReference: "SH79LM1842",
    status: "completed",
    category: "donation"
  },
  {
    id: "tx-03",
    donorName: "Fr. Dominic Mwangi",
    donorPhone: "0720 *** 551",
    amountKes: 5000,
    date: "2026-10-16 09:15",
    purpose: "Parish Choir Patron Pastoral Offering",
    purposeSw: "Sadaka ya Mlezi wa Kwaya ya Parokia",
    paymentMethod: "mpesa",
    mpesaReference: "SH75PL8231",
    status: "verified",
    category: "donation"
  },
  {
    id: "tx-04",
    donorName: "John Bosco Otieno",
    donorPhone: "0733 *** 619",
    amountKes: 1000,
    date: "2026-10-15 17:04",
    purpose: "Complete SATB Vocal Scores Bundle",
    purposeSw: "Kifurushi cha Noti za Wimbo (SATB)",
    paymentMethod: "mpesa",
    mpesaReference: "SH72KK9024",
    status: "completed",
    category: "sheet_music"
  },
  {
    id: "tx-05",
    donorName: "Teresa Auma",
    donorPhone: "0798 *** 223",
    amountKes: 2500,
    date: "2026-10-12 14:10",
    purpose: "Choir Robes & Vestments Fund",
    purposeSw: "Mfuko wa Mavazi ya Kwaya",
    paymentMethod: "mpesa",
    mpesaReference: "SH69AA4910",
    status: "completed",
    category: "donation"
  },
  {
    id: "tx-06",
    donorName: "Anthony Wafula",
    donorPhone: "0701 *** 884",
    amountKes: 500,
    date: "2026-10-10 10:30",
    purpose: "Annual Chorister Membership Registration (Bass)",
    purposeSw: "Ada ya Uanachama ya Mwaka (Bass)",
    paymentMethod: "mpesa",
    mpesaReference: "SH64TY7122",
    status: "verified",
    category: "membership"
  },
  {
    id: "tx-07",
    donorName: "Jacinta Chepkemoi",
    donorPhone: "0725 *** 314",
    amountKes: 1200,
    date: "2026-10-08 16:45",
    purpose: "Support for Hymn Recording Project",
    purposeSw: "Ufadhili wa Kurekodi Nyimbo za Kwaya",
    paymentMethod: "mpesa",
    mpesaReference: "SH58RT3901",
    status: "completed",
    category: "donation"
  },
  {
    id: "tx-08",
    donorName: "Francis Njoroge",
    donorPhone: "0711 *** 092",
    amountKes: 600,
    date: "2026-10-04 12:18",
    purpose: "Sheet Music Score: Tutangaze Fumbo La Imani",
    purposeSw: "Noti za Wimbo: Tutangaze Fumbo La Imani",
    paymentMethod: "mpesa",
    mpesaReference: "SH51MB8819",
    status: "completed",
    category: "sheet_music"
  },
  {
    id: "tx-09",
    donorName: "Lucy Wandia",
    donorPhone: "0728 *** 771",
    amountKes: 2000,
    date: "2026-09-28 18:02",
    purpose: "Thanksgiving Offering - St. Monica Feast",
    purposeSw: "Sadaka ya Shukrani - Somo Mt. Monika",
    paymentMethod: "mpesa",
    mpesaReference: "SH48LL2015",
    status: "completed",
    category: "donation"
  },
  {
    id: "tx-10",
    donorName: "Stephen Omondi",
    donorPhone: "0705 *** 129",
    amountKes: 500,
    date: "2026-09-22 08:50",
    purpose: "Annual Chorister Membership Registration (Tenor)",
    purposeSw: "Ada ya Uanachama ya Mwaka (Tenor)",
    paymentMethod: "mpesa",
    mpesaReference: "SH42BB1094",
    status: "verified",
    category: "membership"
  }
];

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@KwayayaMtakatifuMonicaSection5";
export const YOUTUBE_CHANNEL_HANDLE = "@KwayayaMtakatifuMonicaSection5";
export const YOUTUBE_CHANNEL_DISPLAY_NAME = "Kwaya ya Mtakatifu Monika - Nakuru";

export const CHOIR_STATS = {
  choirName: "St. Monica Third Mass Choir",
  choirNameSw: "Kwaya ya Misa ya Tatu ya Mtakatifu Monika",
  membersCount: 56,
  yearsServing: 14,
  repertoireCount: 12,
  albumsReleased: 1,
  sundayMassesPerMonth: 4,
  foundedYear: 2012,
  mpesaTill: "8421092",
  parish: "St. Monica Catholic Parish, Section 58 Nakuru",
  parishSw: "Parokia ya Mtakatifu Monika, Section 58 Nakuru",
  churchAddress: "St. Monica Catholic Church, Section 58, Nakuru (Lanet Rd / Off Old Nairobi Rd)",
  churchAddressSw: "Kanisa Katoliki la Mtakatifu Monika, Section 58, Nakuru (Lanet Rd / Barabara ya Old Nairobi Rd)",
  mapsUrl: "https://maps.app.goo.gl/qd9c7QUumHUnUGXc6",
  mapsFullUrl: "https://www.google.com/maps/place/St.+Monica's+Catholic+Church/@-0.2845249,36.0940117,17z",
  mapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=-0.2845249,36.0940117",
  coordinates: {
    lat: -0.2845249,
    lng: 36.0940117,
  },
  coordinatesDisplay: "-0.284525, 36.094012",
  email: "stmonicachoirsec58@gmail.com",
  phone: "+254 722 845 291",
  whatsapp: "+254 722 845 291",
  whatsappUrl: "https://wa.me/254722845291",
  diocese: "Catholic Diocese of Nakuru",
  dioceseSw: "Jimbo Katoliki la Nakuru",
  patronSaint: "Saint Monica (Mtakatifu Monika)",
  feastDay: "27 August",
  massTimesSunday: "7:00 AM (Dawn), 8:30 AM (2nd Mass), 10:00 AM (3rd Mass: Sunday Sung Mass - St. Monica Third Mass Choir)",
  massTimesSundaySw: "Saa 1:00 Asubuhi (Alfajiri), Saa 2:30 Asubuhi (Kiswahili), Saa 4:00 Asubuhi (Misa ya 3: Misa ya Jumapili Inayoimbwa - Kwaya ya Misa ya Tatu)",
  rehearsalSchedule: "Wednesdays & Fridays: 5:30 PM – 7:30 PM (Parish Hall)",
  rehearsalScheduleSw: "Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku (Ukumbi wa Parokia)"
};

// Approved Catholic Scripture translation for Colossians 3:16
export const COLOSSIANS_3_16 = {
  textEn: "Let the word of Christ dwell in you richly, as in all wisdom you teach and admonish one another, singing psalms, hymns, and spiritual songs with gratitude in your hearts to God.",
  textSw: "Neno la Kristo na likae kwa wingi ndani yenu, mkifundishana na kuonyana kwa hekima yote, huku mkiimba zaburi, na nyimbo, na tenzi za rohoni kwa shukrani mioyoni mwenu kwa Mungu.",
  citationEn: "— Colossians 3:16 (NABRE)",
  citationSw: "— Wakolosai 3:16 (NABRE)",
};

// Helper to ensure audio works across GitHub Pages subpaths and custom domains
const getAudioUrl = (fileName: string): string => {
  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}audio/${fileName}`;
};

// Verified ONLY authentic songs from St. Monica Choir Nakuru
export const INITIAL_SONGS_CATALOG: Song[] = [
  {
    id: "song-machozi",
    title: "Machozi ya Imani",
    titleSwahili: "Machozi ya Imani",
    album: "Nyimbo za Kiliturujia",
    composer: "Atebe Mark T.",
    year: 2024,
    season: "Ordinary Time",
    seasonSwahili: "Wakati wa Kawaida / Tafakari",
    partOfMass: "Meditation",
    partOfMassSwahili: "Wimbo wa Tafakari na Sala",
    language: "Kiswahili",
    voicing: "SATB Choral Polyphony",
    musicalKey: "D Minor",
    duration: "4:36",
    youtubeUrl: "https://youtu.be/syOCKFbVS-8",
    youtubeId: "syOCKFbVS-8",
    thumbnailUrl: "https://i.ytimg.com/vi/syOCKFbVS-8/hqdefault.jpg",
    audioPreviewUrl: getAudioUrl("machozi-ya-imani-preview.mp3"),
    sheetMusicAvailable: true,
    scorePriceKes: 300,
    lyricsSwahili: [
      "1. Machozi ya imani humwagika mbele ya Altare ya Bwana, kilio cha unyenyekevu na toba ya kweli.",
      "Mungu wetu hasahau sala ya mwenye huzuni, husikiliza na kuponya mioyo iliyovunjika.",
      "Kiitikio: Ee Bwana, tazama machozi ya imani ya waja wako, utukumbuke kwa rehema zako na kutupa amani.",
      "2. Kama mama Mtakatifu Monika alivyomlilia mwanaye Augustino kwa machozi mengi,",
      "Nasi tunaleta sala na vilio vyetu mbele yako, tukiwa na tumaini kuu ndani ya Kristo."
    ],
    lyricsEnglish: [
      "1. Tears of deep faith flow before the altar of the Lord, a humble plea of sincere repentance.",
      "Our God never forgets the prayer of the sorrowful; He listens and heals the brokenhearted.",
      "Refrain: O Lord, look upon the tears of faith of Your servants; remember us in Your mercy and grant us peace.",
      "2. Even as Saint Monica wept unceasingly for her son Augustine with motherly tears,",
      "So we bring our supplications and tears before You, anchored in steadfast hope in Christ."
    ],
    waveformPeaks: [80,92,88,85,89,94,57,90,100,99,89,97,66,83,88,90,91,90,88,60,84,83,88,87,89,55,98,94,94,87,94,78,71,84,87,88,86,88,55,93,90,88,89,91,90,90,90,58,89,88,91,88,88,61,87,94,97,92,91,89,60,87,85,85,86,86,53,87,85,85,79,71,53,46,49,39,32,23,13,12],
    recordedAt: "Recorded at Khakstudio, Nakuru",
    whyWeSingIt: "Recorded at Khakstudio in 2024, our choir learned this song for the Nakuru Deanery Choral Festival and sings it during post-Communion prayer.",
    whyWeSingItSw: "Wimbo huu ulirekodiwa Khakstudio mwaka 2024; kwaya iliujifunza kwa ajili ya Tamasha la Dekania na tunauimba wakati wa tafakari baada ya Komunyo."
  },
  {
    id: "song-maisha",
    title: "Maisha ya Mwanadamu",
    titleSwahili: "Maisha ya Mwanadamu",
    album: "Nyimbo za Kiliturujia",
    composer: "Fr. Jude Waweru",
    year: 2024,
    season: "Ordinary Time",
    seasonSwahili: "Wakati wa Kawaida / Tafakari",
    partOfMass: "Meditation",
    partOfMassSwahili: "Wimbo wa Tafakari",
    language: "Kiswahili",
    voicing: "SATB Choral Polyphony",
    musicalKey: "E Minor",
    duration: "4:48",
    youtubeUrl: "https://youtu.be/o-Lzb_Sy_M8",
    youtubeId: "o-Lzb_Sy_M8",
    thumbnailUrl: "https://i.ytimg.com/vi/o-Lzb_Sy_M8/hqdefault.jpg",
    audioPreviewUrl: getAudioUrl("maisha-ya-mwanadamu-preview.mp3"),
    sheetMusicAvailable: true,
    scorePriceKes: 300,
    lyricsSwahili: [
      "1. Maisha ya mwanadamu hapa duniani ni kama ua linalochanua asubuhi,",
      "Jioni linanyauka na kutoweka, lakini neno la Bwana ladumu milele na milele.",
      "Kiitikio: Mtegemee Bwana kwa moyo wako wote, usitegemee akili zako mwenyewe, naye atanyoosha mapito yako.",
      "2. Weka tumaini lako kwa Mungu wetu, Yeye ndiye mwamba imara na ngao ya wokovu wetu."
    ],
    lyricsEnglish: [
      "1. The earthly life of man is like a flower blooming in the morning sun;",
      "In the evening it fades and withers away, but the word of our Lord endures forever.",
      "Refrain: Trust in the Lord with all your heart, and do not lean upon your own understanding; He shall direct your paths.",
      "2. Place all your hope in our heavenly God; He is our fortress rock and saving shield."
    ],
    waveformPeaks: [83,92,93,88,85,74,76,96,92,100,95,75,76,94,93,93,95,75,72,94,96,94,91,79,77,88,95,92,90,73,76,91,95,94,92,74,78,95,90,93,93,93,94,90,74,72,91,92,90,95,74,71,88,88,87,90,73,75,93,90,91,92,72,73,88,90,89,93,72,75,87,75,68,58,40,33,31,22,14,12],
    recordedAt: "Recorded at Khakstudio, Nakuru",
    whyWeSingIt: "A four-part meditation composed by Fr. Jude Waweru, sung during the offertory to remind the parish that earthly trials pass while God's mercy endures.",
    whyWeSingItSw: "Tafakari ya sauti nne ya Padri Jude Waweru, inayoimbwa wakati wa toleo kutukumbusha kwamba taabu za dunia hupita ilhali huruma ya Mungu hudumu."
  },
  {
    id: "song-nimzima",
    title: "Ni Mzima",
    titleSwahili: "Ni Mzima (Yesu Amefufuka)",
    album: "Nyimbo za Kiliturujia",
    composer: "Isaack Mwita",
    year: 2024,
    season: "Easter",
    seasonSwahili: "Pasaka na Ushindi wa Kristo",
    partOfMass: "Recessional",
    partOfMassSwahili: "Wimbo wa Kutoka na Kushangilia",
    language: "Kiswahili",
    voicing: "SATB Festive + Kayamba",
    musicalKey: "D Major",
    duration: "4:25",
    youtubeUrl: "https://youtu.be/Ds_tOgL_7pg",
    youtubeId: "Ds_tOgL_7pg",
    thumbnailUrl: "https://i.ytimg.com/vi/Ds_tOgL_7pg/hqdefault.jpg",
    audioPreviewUrl: getAudioUrl("ni-mzima-preview.mp3"),
    sheetMusicAvailable: true,
    scorePriceKes: 300,
    lyricsSwahili: [
      "1. Kaburi li wazi, jiwe limevingirishwa mbali! Kristo ameshinda kifo, yu hai milele.",
      "Kiitikio: Ni mzima, ni mzima hakika! Aleluya, Mwokozi wetu ametukuka juu mbinguni na duniani!",
      "2. Tushangilie kwa vinanda na kayamba, Mwokozi wetu amefufuka kwa uwezo mkuu.",
      "Ametuvua utumwa wa dhambi na kutuvika taji la uzima wa milele."
    ],
    lyricsEnglish: [
      "1. The tomb is empty and the heavy stone rolled away! Christ has conquered death and lives forever.",
      "Refrain: He is alive, He is truly risen! Alleluia, our Redeemer is exalted in heaven and earth!",
      "2. Let us rejoice with joyful instruments and song; our Savior has risen with sovereign triumph.",
      "He broke the chains of sin and crowned us with eternal life."
    ],
    waveformPeaks: [77,91,89,75,76,100,95,74,71,91,93,69,68,89,93,69,72,89,91,70,74,95,96,76,69,87,84,68,71,83,88,85,90,91,76,74,87,87,70,76,93,96,76,69,82,80,70,70,90,89,69,68,86,90,71,71,90,89,73,66,81,78,65,69,85,85,85,87,86,73,12,12,12,12,12,12,12,12,12,12],
    recordedAt: "Recorded at Khakstudio, Nakuru",
    whyWeSingIt: "A joyful Easter recessional by Isaack Mwita, sung with traditional kayamba as the procession leaves the sanctuary on Easter Sunday.",
    whyWeSingItSw: "Wimbo wa shangwe wa Pasaka wa Isaack Mwita, unaoimbwa na kayamba wakati maandamano yakitoka altaroni Dominika ya Pasaka."
  },
  {
    id: "song-jumuiya",
    title: "Jumuiya Ndogondogo",
    titleSwahili: "Jumuiya Ndogondogo",
    album: "Nyimbo za Kiliturujia",
    composer: "Bernard Mukasa",
    year: 2024,
    season: "Ordinary Time",
    seasonSwahili: "Wakati wa Kawaida / Utume",
    partOfMass: "Entrance",
    partOfMassSwahili: "Wimbo wa Kuingia na Utume",
    language: "Kiswahili",
    voicing: "SATB Polyphony & Organ",
    musicalKey: "G Major",
    duration: "4:30",
    youtubeUrl: "https://youtu.be/lpOfth1eyOg",
    youtubeId: "lpOfth1eyOg",
    thumbnailUrl: "https://i.ytimg.com/vi/lpOfth1eyOg/hqdefault.jpg",
    audioPreviewUrl: getAudioUrl("jumuiya-ndogondogo-preview.mp3"),
    sheetMusicAvailable: true,
    scorePriceKes: 300,
    lyricsSwahili: [
      "1. Jumuiya ndogondogo ni chemchemi ya umoja wetu katika Kristo Yesu.",
      "Tukusanyike kwa sala, upendo na mshikamano wa dhati ndani ya parokia yetu.",
      "Kiitikio: Ee waamini, tujiunge na kujenga jumuiya ndogondogo kwa moyo wa furaha na huduma ya dhati.",
      "2. Neno la Mungu lituongoze katika kila hatua na matendo yetu ya kila siku.",
      "Tuwasaidie wahitaji, wagonjwa na wanyonge kama mashahidi wa kweli wa Injili ya Kristo."
    ],
    lyricsEnglish: [
      "1. Small Christian Communities are the fountain of our fraternal unity in Christ Jesus.",
      "Let us gather in prayer, love, and sincere solidarity within our parish community.",
      "Refrain: O faithful people, let us unite and build up Small Christian Communities with joy and dedicated service.",
      "2. May the Holy Word of God guide our every step and our daily actions.",
      "Let us assist the needy, the sick, and the vulnerable as authentic witnesses of the Gospel."
    ],
    waveformPeaks: [80,100,89,92,61,87,84,88,85,60,98,93,87,62,84,89,90,87,57,87,90,86,71,74,90,90,83,54,88,88,93,85,61,88,89,93,93,90,84,62,91,94,91,65,81,84,86,85,56,91,88,89,72,72,93,91,92,57,82,83,82,80,58,85,86,84,59,84,89,91,84,46,68,58,49,38,31,23,12,12],
    recordedAt: "Recorded at Khakstudio, Nakuru",
    whyWeSingIt: "Composed by Bernard Mukasa, this entrance song was adopted by our parish in 2021 to open celebrations honoring Small Christian Communities.",
    whyWeSingItSw: "Ulitungwa na Bernard Mukasa na kupokelewa parokiani mwaka 2021 kama wimbo wa kuingia unaoenzi Jumuiya Ndogondogo."
  }
];

// Verified Sheet Music for the 4 songs on sale
export const INITIAL_SHEET_MUSIC: SheetMusicItem[] = [
  {
    id: "sheet-machozi",
    title: "Machozi ya Imani",
    titleSw: "Machozi ya Imani",
    composer: "Atebe Mark T.",
    notationType: "Tonic Sol-fa & Staff",
    voicing: "SATB Choral",
    voiceParts: "S, A, T, B",
    partOfMass: "Meditation / Contemplative Prayer",
    season: "Ordinary Time",
    priceKes: 300,
    priceUsd: 2.50,
    previewBars: "m:s:l | s:f:m | r:d:r | m:-:- || [D Minor Liturgical Setting]",
    description: "Complete 4-part vocal score (Soprano, Alto, Tenor, Bass) in Tonic Sol-fa and Staff Notation. Composed by Atebe Mark T. · Recorded at Khakstudio. Instant PDF download with M-Pesa.",
    descriptionSw: "Noti kamili za sauti nne (S, A, T, B) katika mfumo wa Sol-fa na Staff. Mtunzi: Atebe Mark T. Lipa kupitia M-Pesa.",
    downloadUrl: "#download-machozi"
  },
  {
    id: "sheet-maisha",
    title: "Maisha ya Mwanadamu",
    titleSw: "Maisha ya Mwanadamu",
    composer: "Fr. Jude Waweru",
    notationType: "Tonic Sol-fa & Staff",
    voicing: "SATB Polyphony",
    voiceParts: "S, A, T, B",
    partOfMass: "Meditation / Contemplative",
    season: "Ordinary Time",
    priceKes: 300,
    priceUsd: 2.50,
    previewBars: "l,:d:m | m:r:d | t,:l,:s, | l,:-:- || [E Minor Choral Setting]",
    description: "Meditation vocal arrangement for Soprano, Alto, Tenor, and Bass (SATB). Composed by Fr. Jude Waweru with dynamics and liturgical breath marks. Instant PDF download with M-Pesa.",
    descriptionSw: "Noti za wimbo wa tafakari uliotungwa na Fr. Jude Waweru kwa sauti nne (SATB). Lipa kupitia M-Pesa.",
    downloadUrl: "#download-maisha"
  },
  {
    id: "sheet-nimzima",
    title: "Ni Mzima",
    titleSw: "Ni Mzima",
    composer: "Isaack Mwita",
    notationType: "Tonic Sol-fa & Staff",
    voicing: "SATB + Kayamba",
    voiceParts: "S, A, T, B",
    partOfMass: "Recessional / Easter Triumph",
    season: "Easter",
    priceKes: 300,
    priceUsd: 2.50,
    previewBars: "s:d':m' | r':d':t | d':-:- | s:m:d || [Festive D Major]",
    description: "Easter anthem score composed by Isaack Mwita with traditional East African liturgical rhythm notations and full SATB choral polyphony. Instant PDF download with M-Pesa.",
    descriptionSw: "Noti kamili za wimbo wa Pasaka zenye mdundo wa kitamaduni na sauti nne (SATB). Mtunzi: Isaack Mwita. Lipa kupitia M-Pesa.",
    downloadUrl: "#download-nimzima"
  },
  {
    id: "sheet-jumuiya",
    title: "Jumuiya Ndogondogo",
    titleSw: "Jumuiya Ndogondogo",
    composer: "Bernard Mukasa",
    notationType: "Tonic Sol-fa & Staff",
    voicing: "SATB Choral",
    voiceParts: "S, A, T, B",
    partOfMass: "Entrance / Small Christian Communities",
    season: "Ordinary Time",
    priceKes: 300,
    priceUsd: 2.50,
    previewBars: "d:m:s | s:s:s | f:m:r | d:-:- || [Tonic Sol-fa & Staff Notation]",
    description: "Complete 4-part vocal score (Soprano, Alto, Tenor, Bass) in Tonic Sol-fa and Staff Notation. Composed by Bernard Mukasa for SATB choir. Instant PDF download with M-Pesa.",
    descriptionSw: "Noti kamili za sauti nne (S, A, T, B) katika mfumo wa Sol-fa na Staff. Mtunzi: Bernard Mukasa. Lipa kupitia M-Pesa.",
    downloadUrl: "#download-jumuiya"
  }
];

export const INITIAL_ALBUMS: Album[] = [
  {
    id: "album-sec58",
    title: "Nyimbo za Kiliturujia",
    releaseYear: 2024,
    trackCount: 4,
    coverImage: "choir_singing_moment",
    priceKes: 500,
    description: "The official master recording collection from St. Monica Third Mass Choir, recorded with Khakstudio Production and parish audio engineers.",
    descriptionSw: "Mkusanyiko rasmi wa nyimbo za kiliturujia kutoka Kwaya ya Mtakatifu Monika, zilizorekodiwa rasmi kwa ajili ya utukufu wa Mungu.",
    youtubePlaylistUrl: YOUTUBE_CHANNEL_URL,
    songs: ["Machozi ya Imani", "Maisha ya Mwanadamu", "Ni Mzima", "Jumuiya Ndogondogo"]
  }
];

export const INITIAL_LEADERS: ChoirLeader[] = [
  {
    id: "ldr-director",
    name: "Atebe Mark T.",
    role: "Music Director & Choirmaster",
    roleSw: "Mkurugenzi wa Muziki na Mwalimu Mkuu",
    category: "trainer",
    responsibility: "Conducts weekly liturgical rehearsals, oversees four-part vocal polyphony, and directs recording production.",
    responsibilitySw: "Huongoza mazoezi ya kila wiki, upangaji wa sauti nne na usimamizi wa kurekodi nyimbo studio.",
    tenure: "Serving the Parish",
    tenureSw: "Anahudumu Parokiani",
    photoUrl: "/assets/choir/choir_leader_02.jpg"
  },
  {
    id: "ldr-organist",
    name: "Mukomah Leshan",
    role: "Parish Organist & Keyboardist",
    roleSw: "Mpiga Kinanda na Organi ya Parokia",
    category: "trainer",
    responsibility: "Accompanies liturgical Sunday Masses and coordinates instrumental harmonies for the choir.",
    responsibilitySw: "Hupiga kinanda kwenye Misa za Jumapili na kuratibu ala za muziki.",
    tenure: "Serving the Parish",
    tenureSw: "Anahudumu Parokiani",
    photoUrl: "/assets/choir/choir_leader_03.jpg"
  },
  {
    id: "ldr-moderator",
    name: "Damaris Ndeto",
    role: "Moderator",
    roleSw: "Moderator wa Kwaya",
    category: "official",
    responsibility: "Oversees executive committee operations, guides spiritual welfare, and coordinates with parish leadership.",
    responsibilitySw: "Huongoza kamati ya utendaji, ustawi wa kiroho na kuratibu shughuli za kwaya na uongozi wa parokia.",
    tenure: "Serving the Parish",
    tenureSw: "Anahudumu Parokiani",
    photoUrl: "/assets/choir/choir_leader_05.jpg"
  },
  {
    id: "ldr-asst-moderator",
    name: "Peter Otieno",
    role: "Assistant Moderator",
    roleSw: "Msaidizi wa Moderator",
    category: "official",
    responsibility: "Assists the moderator in administrative coordination, rehearsal discipline, and chorister fellowship.",
    responsibilitySw: "Husaidia moderator katika utekelezaji wa majukumu ya kiutawala na usimamizi wa mazoezi.",
    tenure: "Serving the Parish",
    tenureSw: "Anahudumu Parokiani",
    photoUrl: "/assets/choir/choir_leader_04.jpg"
  },
  {
    id: "ldr-secretary",
    name: "Terry Odhiambo",
    role: "Secretary",
    roleSw: "Katibu wa Kwaya",
    category: "official",
    responsibility: "Maintains choir register, meeting minutes, liturgical schedules, and official notices.",
    responsibilitySw: "Huweka daftari la wanachama, kumbukumbu za mikutano, ratiba za kiliturujia na matangazo rasmi.",
    tenure: "Serving the Parish",
    tenureSw: "Anahudumu Parokiani",
    photoUrl: "/assets/choir/choir_leader_06.jpg"
  },
  {
    id: "ldr-asst-secretary",
    name: "Ignatius Kipruto Ngure",
    role: "Assistant Secretary",
    roleSw: "Msaidizi wa Katibu",
    category: "official",
    responsibility: "Supports secretarial correspondence, membership attendance, and notice distribution.",
    responsibilitySw: "Husaidia katibu katika mawasiliano, mahudhurio ya wanakwaya na usambazaji wa matangazo.",
    tenure: "Serving the Parish",
    tenureSw: "Anahudumu Parokiani",
    photoUrl: "/assets/choir/choir_leader_07.jpg"
  },
  {
    id: "ldr-treasurer",
    name: "Peris W. Njuguna",
    role: "Treasurer",
    roleSw: "Mhazini wa Kwaya",
    category: "official",
    responsibility: "Manages choir finances, membership contributions, sheet music funds, and financial reports.",
    responsibilitySw: "Hutunza hesabu za fedha, michango ya uanachama, mauzo ya noti na taarifa za fedha za kwaya.",
    tenure: "Serving the Parish",
    tenureSw: "Anahudumu Parokiani",
    photoUrl: "/assets/choir/choir_leader_08.jpg"
  }
];

export const INITIAL_GROUP_PHOTOS: ChoirGroupPhoto[] = [
  {
    id: "grp-vestment-01",
    title: "Full Choir Ensemble at the Altar of St. Monica",
    titleSw: "Kwaya Nzima ya Mtakatifu Monika Altaroni",
    description: "The complete chorister ensemble of St. Monica Third Mass Choir gathered in full vestments before the altar of St. Monica Catholic Church, Section 58 Nakuru, following the celebration of Sunday High Mass.",
    descriptionSw: "Wanakwaya wote wa Mtakatifu Monika wakiwa altaroni Parokia ya Section 58 Nakuru baada ya Misa ya Jumapili Inayoimbwa.",
    year: "2024",
    imageKey: "choir_singing_moment",
    customUrl: "/assets/choir/choir_01.jpg",
    occasion: "Sunday High Mass & Parish Feast Celebration",
    occasionSw: "Sikukuu ya Mtakatifu Monika na Sherehe za Parokia"
  },
  {
    id: "grp-vestment-02",
    title: "Choristers Unified in Liturgical Vestments",
    titleSw: "Wanakwaya na Sare za Kiliturujia",
    description: "Choristers standing unified in ceremonial blue and white choir robes before processing into the church sanctuary for holy Mass.",
    descriptionSw: "Waimbaji wakiwa katika sare rasmi za kwaya zenye staha kabla ya kuingia hekaluni kwa Misa Takatifu.",
    year: "2024",
    imageKey: "choir_singing_moment",
    customUrl: "/assets/choir/choir_02.jpg",
    occasion: "Sunday High Mass Procession",
    occasionSw: "Maandamano ya Misa Kuu ya Jumapili"
  },
  {
    id: "grp-vestment-03",
    title: "Reverent Liturgical Prayer and Choral Hymnody",
    titleSw: "Ibada na Maombi ya Waimbaji",
    description: "Choristers singing devoutly from their hymnals before the altar, lifting prayerful four-part vocal harmony during the Holy Eucharist celebration.",
    descriptionSw: "Sala ya heshima na uimbaji wa sauti nne wakati wa Maadhimisho ya Ekaristi Takatifu.",
    year: "2024",
    imageKey: "choir_singing_moment",
    customUrl: "/assets/choir/choir_03.jpg",
    occasion: "Holy Mass Eucharistic Thanksgiving",
    occasionSw: "Shukrani ya Misa Takatifu"
  },
  {
    id: "grp-vestment-04",
    title: "Four-Part Vocal Voicing (SATB Polyphony)",
    titleSw: "Upangaji wa Sauti za Kwaya (SATB)",
    description: "Soprano, Alto, Tenor, and Bass vocalists executing balanced acoustic counterpoint and sacred four-part choral polyphony during parish liturgy.",
    descriptionSw: "Waimbaji wa sauti zote nne wakitekeleza upatanisho safi wa nyimbo za kwaya altaroni.",
    year: "2024",
    imageKey: "choir_singing_moment",
    customUrl: "/assets/choir/choir_04.jpg",
    occasion: "Sunday Sung Mass Choral Ministry",
    occasionSw: "Utume wa Misa Inayoimbwa"
  },
  {
    id: "grp-vestment-05",
    title: "Festive Liturgical Praise in the Sanctuary",
    titleSw: "Waimbaji Altaroni Parokia ya Section 58",
    description: "The choristers filling the sanctuary of St. Monica Parish with festive hymns of joy and spiritual gratitude before the Blessed Sacrament.",
    descriptionSw: "Wanakwaya wakijaza hekalu kwa nyimbo za sifa na furaha ya kiroho mbele ya Ekaristi.",
    year: "2024",
    imageKey: "choir_singing_moment",
    customUrl: "/assets/choir/choir_05.jpg",
    occasion: "Solemn Parish Feast & Corpus Christi",
    occasionSw: "Sikukuu ya Mwili na Damu ya Kristo"
  },
  {
    id: "grp-vestment-06",
    title: "Grand Choir Gathering at St. Monica Parish",
    titleSw: "Kwaya Katika Kanisa la Section 58",
    description: "The choristers gathered in unity inside the church of St. Monica Catholic Parish in Section 58 Nakuru, celebrating parish fellowship and growth.",
    descriptionSw: "Kwaya ikihudumu mbele ya waamini na wageni wa Jimbo Katoliki la Nakuru.",
    year: "2024",
    imageKey: "nakuru_parish_cathedral",
    customUrl: "/assets/choir/choir_06.jpg",
    occasion: "Parish Anniversary Celebration",
    occasionSw: "Maadhimisho ya Parokia"
  },
  {
    id: "grp-vestment-07",
    title: "Choirmaster Directing Sacred Choral Counterpoint",
    titleSw: "Upatanisho wa Sauti na Mwalimu wa Kwaya",
    description: "Choirmaster Atebe Mark T. directing the four-part vocal polyphony with precision and solemnity at the parish altar.",
    descriptionSw: "Mwalimu wa kwaya akiongoza sauti nne kwa utulivu na weledi wa kiliturujia.",
    year: "2024",
    imageKey: "choir_singing_moment",
    customUrl: "/assets/choir/choir_07.jpg",
    occasion: "Solemn Pontifical High Mass",
    occasionSw: "Misa Maalum ya Kijimbo"
  },
  {
    id: "grp-vestment-08",
    title: "Choir Ministering at Sunday High Mass",
    titleSw: "Kwaya Wakati wa Misa ya Jumapili",
    description: "Choristers leading the 10:00 AM Sunday Third Mass liturgy with reverent vocal discipline and sacred choral hymns.",
    descriptionSw: "Hali ya utulivu na maombi wakati wa Misa ya Tatu ya saa nne asubuhi.",
    year: "2024",
    imageKey: "choir_singing_moment",
    customUrl: "/assets/choir/choir_08.jpg",
    occasion: "Sunday Third Mass Liturgical Service",
    occasionSw: "Misa ya Tatu ya Jumapili"
  },
  {
    id: "grp-vestment-09",
    title: "Hymns of Praise and Contemplative Psalmody",
    titleSw: "Sala ya Nyimbo Mbele ya Altare",
    description: "Lifting heartfelt hymns and psalms in gratitude to God before the altar during post-Communion reflection.",
    descriptionSw: "Kuinua sala za dhati na zaburi za shukrani kwa Mwenyezi Mungu.",
    year: "2024",
    imageKey: "choir_singing_moment",
    customUrl: "/assets/choir/choir_09.jpg",
    occasion: "Parish Thanksgiving Sunday",
    occasionSw: "Jumapili ya Shukrani ya Parokia"
  },
  {
    id: "grp-vestment-10",
    title: "Soprano and Alto Sections in Rehearsal",
    titleSw: "Sauti za Kike (Soprano na Alto) Mazoezini",
    description: "Dedicated female vocalists perfecting melodic lines, sol-fa phrasing, and warm harmonic support during weekly choir workshop.",
    descriptionSw: "Waimbaji wa kike wakifanya mazoezi ya melodi na patanisho la pili.",
    year: "2024",
    imageKey: "choir_singing_moment",
    customUrl: "/assets/choir/choir_10.jpg",
    occasion: "Weekly SATB Vocal Workshop",
    occasionSw: "Semina ya Sauti ya Kila Wiki"
  },
  {
    id: "grp-vestment-11",
    title: "Tenor and Bass Sections Anchoring Harmony",
    titleSw: "Sauti za Kiume (Tenor na Bass) Altaroni",
    description: "Tenors and basses providing steady acoustic resonance, foundational depth, and noble counterpoint during choral liturgy.",
    descriptionSw: "Sauti za kiume zikitoa msingi imara na sauti ya tatu kwa utulivu mkubwa.",
    year: "2024",
    imageKey: "choir_singing_moment",
    customUrl: "/assets/choir/choir_11.jpg",
    occasion: "Liturgical Polyphony Rehearsal",
    occasionSw: "Mazoezi ya Nyimbo za Polyfonia"
  },
  {
    id: "grp-vestment-12",
    title: "Fellowship and Joy in Choir Ministry",
    titleSw: "Furaha ya Utume wa Uimbaji Mtakatifu",
    description: "Radiant smiles, spiritual fraternity, and joyful fellowship shared by choir members following ministry at the altar of St. Monica.",
    descriptionSw: "Tabasamu na umoja wa kidugu baada ya kukamilisha utume mzuri altaroni.",
    year: "2024",
    imageKey: "choir_singing_moment",
    customUrl: "/assets/choir/choir_12.jpg",
    occasion: "St. Monica Chorister Fellowship & Feast Day",
    occasionSw: "Mshikamano wa Wanakwaya"
  }
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod-album-master",
    name: "Nyimbo za Kiliturujia (Full Album MP3)",
    nameSw: "Albamu ya Nyimbo za Kiliturujia (MP3)",
    type: "digital_album",
    priceKes: 500,
    priceUsd: 4.00,
    description: "High-definition master digital album containing all 4 authentic choral releases with full digital booklet and lyrics. Pay with M-Pesa.",
    descriptionSw: "Albamu kamili ya dijitali yenye nyimbo zote nne za Kwaya ya Mtakatifu Monika pamoja na kijitabu cha maneno. Lipa kupitia M-Pesa.",
    image: "choir_singing_moment",
    badge: "Official Album",
    downloadable: true
  },
  {
    id: "prod-sheet-bundle",
    name: "Complete SATB Vocal Scores Bundle (All 4 Songs)",
    nameSw: "Kifurushi cha Noti Zote 4 (SATB PDF)",
    type: "sheet_music",
    priceKes: 1000,
    priceUsd: 8.00,
    description: "Complete printable PDF booklet with Tonic Sol-fa and Staff Notation for all 4 songs. Formatted for choir directors for parish use. Pay with M-Pesa.",
    descriptionSw: "Kitini kamili cha noti za PDF chenye solfa na stafu kwa nyimbo zote 4 kwa ajili ya walimu wa kwaya. Lipa kupitia M-Pesa.",
    image: "sheet_music_hymnal",
    badge: "Save KES 200",
    downloadable: true
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: "evt-sunday-mass",
    title: "Third Mass (Sunday Sung Mass)",
    titleSw: "Misa ya Tatu (Misa ya Jumapili Inayoimbwa)",
    dateDay: "Sun",
    dateMonth: "Every",
    fullDate: "Kila Jumapili / Every Sunday",
    time: "10:00 AM - 11:45 AM",
    venue: "St. Monica Catholic Church, Section 58",
    city: "Nakuru, Kenya",
    description: "Our principal liturgical assignment: leading the 10:00 AM Third Mass in solemn four-part SATB polyphony, hymns, psalms, and sacred praise songs for the Holy Eucharist.",
    descriptionSw: "Utume wetu mkuu wa kiliturujia: kuongoza Misa ya Tatu (Saa 4:00 Asubuhi) kwa sauti nne (SATB), nyimbo za sifa na tafakari mbele ya Altare Takatifu.",
    category: "Liturgical Mass",
    entryType: "Sunday Liturgy",
    isUpcoming: true
  },
  {
    id: "evt-rehearsal",
    title: "Weekly Choir Rehearsal & Sol-fa Training",
    titleSw: "Mazoezi ya Kwaya ya Kila Wiki na Mafunzo ya Solfa",
    dateDay: "Wed/Fri",
    dateMonth: "Every",
    fullDate: "Jumatano & Ijumaa / Wed & Fri",
    time: "5:30 PM - 7:30 PM",
    venue: "St. Monica Parish Hall, Section 58",
    city: "Nakuru, Kenya",
    description: "Vocal warm-ups, sight-reading drills in tonic sol-fa, SATB sectionals, and preparing upcoming liturgical feasts under choirmaster guidance.",
    descriptionSw: "Mazoezi ya kuimarisha sauti, kusoma noti za solfa, na kupanga sauti nne kwa ajili ya Misa zijazo za Dominika.",
    category: "Rehearsal",
    entryType: "Open to new members",
    isUpcoming: true
  },
  {
    id: "evt-patron-feast",
    title: "Solemn Feast of Saint Monica",
    titleSw: "Sikukuu Kuu ya Somo: Mtakatifu Monika",
    dateDay: "27",
    dateMonth: "Aug 2027",
    fullDate: "27 August 2027",
    time: "9:30 AM",
    venue: "St. Monica Catholic Church, Section 58",
    city: "Nakuru, Kenya",
    description: "The annual patronal celebration of our parish and choir with diocesan clergy and chorister vestment blessings.",
    descriptionSw: "Sherehe kuu ya mwaka ya somo wa parokia na kwaya yetu, ikiambatana na kubariki sare za waimbaji.",
    category: "Patronal Feast",
    entryType: "Liturgical Mass",
    isUpcoming: true
  },
  {
    id: "evt-patron-feast-past",
    title: "Feast of Saint Monica (2026)",
    titleSw: "Sikukuu ya Mtakatifu Monika (2026)",
    dateDay: "27",
    dateMonth: "Aug 2026",
    fullDate: "27 August 2026",
    time: "9:30 AM",
    venue: "St. Monica Catholic Church, Section 58",
    city: "Nakuru, Kenya",
    description: "Past patronal solemn Mass celebration with choir and parish community.",
    descriptionSw: "Misa Kuu ya sikukuu ya Mtakatifu Monika iliyoadhimishwa mwezi wa Agosti 2026.",
    category: "Earlier Event",
    entryType: "Concluded",
    isUpcoming: false
  }
];

export const SONGS_CATALOG = INITIAL_SONGS_CATALOG;

export const VOICE_SECTIONS_DATA = [
  {
    name: "Soprano",
    nameEn: "Soprano Section",
    range: "Sauti ya Kwanza · First Voice",
    membersCount: 16,
    description: "The primary melodic leadership carrying the sacred text clearly across the sanctuary with purity.",
    descriptionSw: "Wanaoongoza melodi ya wimbo kwa sauti nyororo na ya juu inayofika mbali altaroni.",
    sampleClip: "Soprano Melody (Melodi Kuu)"
  },
  {
    name: "Alto",
    nameEn: "Alto Section",
    range: "Sauti ya Pili · Second Voice",
    membersCount: 14,
    description: "The rich harmonic warmth supporting the soprano melody with contemplative depth.",
    descriptionSw: "Sauti ya pili inayotoa utajiri wa upatanisho na joto la sala ya muziki mtakatifu.",
    sampleClip: "Alto Harmony (Patanisho la Kati)"
  },
  {
    name: "Tenor",
    nameEn: "Tenor Section",
    range: "Sauti ya Tatu · Third Voice",
    membersCount: 10,
    description: "The bright vocal counterpoint providing energy and liturgical clarity to four-part harmony.",
    descriptionSw: "Sauti ya kiume ya juu inayoleta mng'ao na nguvu katika sala za Misa.",
    sampleClip: "Tenor Counterpoint (Tenor ya Juu)"
  },
  {
    name: "Bass",
    nameEn: "Bass Section",
    range: "Sauti ya Nne · Fourth Voice",
    membersCount: 8,
    description: "The foundational acoustic anchor upon which the sacred polyphonic chords are firmly grounded.",
    descriptionSw: "Sauti nzito ya msingi inayoshikilia na kuweka uthabiti wa kwaya nzima.",
    sampleClip: "Bass Foundation (Sauti ya Msingi)"
  }
];

export const EVENTS_CATALOG = INITIAL_EVENTS;

export interface CoreValue {
  id: string;
  number: number;
  title: string;
  titleSw: string;
  description: string;
  descriptionSw: string;
  iconName: 'Cross' | 'Flame' | 'Users' | 'HandHeart' | 'HeartHandshake' | 'Award' | 'Globe' | 'Anchor';
}

export const CORE_VALUES: CoreValue[] = [
  {
    id: 'faith',
    number: 1,
    title: 'Faith',
    titleSw: 'Imani',
    description: 'Christ is the centre of all we sing. Our voices flow from lives rooted in prayer and the sacraments.',
    descriptionSw: 'Kristo ndiye kiini cha yote tunayoimba. Sauti zetu zinatiririka kutoka katika maisha yaliyojikita katika sala na sakramenti.',
    iconName: 'Cross'
  },
  {
    id: 'reverence',
    number: 2,
    title: 'Reverence',
    titleSw: 'Kicho na Heshima',
    description: 'We honour the Sacred Liturgy and bring to every Mass the dignity and recollection it deserves.',
    descriptionSw: 'Tunaheshimu Liturujia Takatifu na kuleta katika kila Misa adhama na utulivu wa sala unaostahili.',
    iconName: 'Flame'
  },
  {
    id: 'communion',
    number: 3,
    title: 'Communion',
    titleSw: 'Umoja na Ushirika',
    description: 'We are one in Christ and one with the Church, in harmony with one another, our Parish Priest and the parish family.',
    descriptionSw: 'Sisi tu mmoja katika Kristo na Kanisa, tukiwa katika upatanisho baina yetu, Padri wetu wa Parokia na familia nzima ya waamini.',
    iconName: 'Users'
  },
  {
    id: 'humility',
    number: 4,
    title: 'Humility',
    titleSw: 'Unyenyekevu',
    description: 'We serve so that Christ may be glorified, not ourselves. Obedience to the Church guides our choices.',
    descriptionSw: 'Tunatumikia ili Kristo atukuzwe, si sisi wenyewe. Utii kwa Kanisa huongoza maamuzi na maadili yetu yote.',
    iconName: 'HandHeart'
  },
  {
    id: 'service',
    number: 5,
    title: 'Service',
    titleSw: 'Huduma ya Kujitolea',
    description: 'We offer our gifts generously for the good of the assembly and the glory of God.',
    descriptionSw: 'Tunatoa karama zetu kwa ukarimu mkubwa kwa manufaa ya kusanyiko la waamini na kwa utukufu wa Mwenyezi Mungu.',
    iconName: 'HeartHandshake'
  },
  {
    id: 'excellence',
    number: 6,
    title: 'Excellence',
    titleSw: 'Ubora na Ubingwa',
    description: 'Through faithful rehearsal and growth in skill, we offer God our very best, a fitting sacrifice of praise.',
    descriptionSw: 'Kupitia mazoezi thabiti na kuendeleza ustadi wa sauti na solfa, tunamtolea Mungu kilicho bora kabisa kama dhabihu ya sifa.',
    iconName: 'Award'
  },
  {
    id: 'evangelisation',
    number: 7,
    title: 'Evangelisation',
    titleSw: 'Uinjilishaji',
    description: 'Every hymn is a chance to proclaim the Gospel and draw hearts to Jesus Christ.',
    descriptionSw: 'Kila wimbo na tenzi ni nafasi takatifu ya kutangaza Injili na kuvuta mioyo ya watu kwa Yesu Kristo.',
    iconName: 'Globe'
  },
  {
    id: 'perseverance',
    number: 8,
    title: 'Perseverance',
    titleSw: 'Ustahimilivu',
    description: 'Like St Monica, we remain steadfast in prayer and commitment, trusting in the grace of God.',
    descriptionSw: 'Kama Mtakatifu Monika, tunabaki imara katika sala bila kukata tamaa na kwa uthabiti, tukitumainia daima neema ya Mungu.',
    iconName: 'Anchor'
  }
];

export interface MassItem {
  id: string;
  title: string;
  titleSw?: string;
  time: string;
  desc: string;
  descSw?: string;
  isSungMass?: boolean;
}

export const DEFAULT_MASSES: MassItem[] = [
  {
    id: 'mass-dawn',
    title: '1st Mass (Dawn)',
    titleSw: 'Misa ya 1 (Asubuhi Mapema / Alfajiri)',
    time: '7:00 AM',
    desc: 'Solemn morning Eucharistic prayer for early parishioners.',
    descSw: 'Misa ya Asubuhi Mapema (Alfajiri) kwa sala na utulivu.',
    isSungMass: false
  },
  {
    id: 'mass-morning',
    title: '2nd Mass (Kiswahili)',
    titleSw: 'Misa ya 2 (Kiswahili)',
    time: '8:30 AM',
    desc: 'Morning parish Eucharistic liturgy with congregational hymns.',
    descSw: 'Misa ya pili ya asubuhi na nyimbo za kutaniko.',
    isSungMass: false
  },
  {
    id: 'mass-sung',
    title: '3rd Mass (Sunday Sung Mass)',
    titleSw: 'Misa ya 3 (Misa ya Jumapili Inayoimbwa)',
    time: '10:00 AM',
    desc: 'St. Monica Third Mass Choir leads solemn four-part SATB liturgy.',
    descSw: 'Misa ya Tatu (Misa ya Jumapili Inayoimbwa) - Kwaya ya Mtakatifu Monika huongoza liturujia ya sauti nne.',
    isSungMass: true
  }
];

export interface HeroSlideConfig {
  id: string;
  src: string;
  srcMobile?: string;
  alt: string;
  description: string;
  eyebrowEn: string;
  eyebrowSw: string;
  headlineEn: string;
  headlineSw: string;
  attributionEn: string;
  attributionSw: string;
  descEn?: string;
  descSw?: string;
  focus?: string;
  focusMobile?: string;
}

export interface ParishMessageConfig {
  titleEn: string;
  titleSw: string;
  body1En: string;
  body1Sw: string;
  body2En: string;
  body2Sw: string;
  churchImg: string;
  churchName: string;
  churchSubtitle: string;
  mapsUrl: string;
}

export const DEFAULT_PARISH_MESSAGE: ParishMessageConfig = {
  titleEn: "From the Parish Altar to the Deanery and Beyond",
  titleSw: "Kutoka Altare ya Parokia Hadi Dekania na Zaidi",
  body1En: 'St. Monica Third Mass Choir began in 2012 with a dedicated circle of choristers at St. Monica Parish in Nakuru. A defining moment in our journey took place in 2019 at the Nakuru Deanery Choral Festival, when our four-part offering of "Machozi ya Imani" held the congregation in prayerful silence before the final blessing.',
  body1Sw: 'Kwaya ya Misa ya Tatu ya Mtakatifu Monika ilianzishwa mwaka 2012 na kundi dogo la waimbaji waliojitolea katika Parokia ya Mtakatifu Monika, Nakuru. Tukio letu la kukumbukwa lilitokea mwaka 2019 kwenye Tamasha la Muziki wa Kikatoliki la Dekania ya Nakuru, ambapo toleo letu la sauti nne la "Machozi ya Imani" lilishikilia kusanyiko katika ukimya wa sala kabla ya baraka kuu.',
  body2En: 'Today, our choristers sing every Sunday in disciplined four-part harmony (SATB), training young parish voices in tonic sol-fa to keep liturgical tradition vibrant and alive.',
  body2Sw: 'Leo, tunaimba kila Dominika kwa sauti nne (Soprano, Alto, Tenor, Bass), tukihakikisha watoto na vijana wa parokia wanajifunza noti za solfa na kuendeleza utamaduni wa muziki mtakatifu.',
  churchImg: '/assets/choir/choir_08.jpg',
  churchName: "St. Monica Catholic Church",
  churchSubtitle: "Section 58, Nakuru · Catholic Diocese of Nakuru",
  mapsUrl: "https://maps.google.com/?q=St+Monica+Catholic+Church+Section+58+Nakuru"
};

export interface ScriptureQuoteConfig {
  categoryEn: string;
  categorySw: string;
  textEn: string;
  textSw: string;
  citationEn: string;
  citationSw: string;
  bgImage?: string;
}

export const DEFAULT_SCRIPTURE_QUOTE: ScriptureQuoteConfig = {
  categoryEn: "Sacred Scripture · Letter to the Colossians",
  categorySw: "Maandiko Matakatifu · Barua kwa Wakolosai",
  textEn: "Let the word of Christ dwell in you richly, as in all wisdom you teach and admonish one another, singing psalms, hymns, and spiritual songs with gratitude in your hearts to God.",
  textSw: "Neno la Kristo na likae kwa wingi ndani yenu, mkifundishana na kuonyana kwa hekima yote, huku mkiimba zaburi, na nyimbo, na tenzi za rohoni kwa shukrani mioyoni mwenu kwa Mungu.",
  citationEn: "— Colossians 3:16 (NABRE)",
  citationSw: "— Wakolosai 3:16 (NABRE)",
  bgImage: "/assets/choir/choir_03.jpg"
};

export interface ChoirmasterMessageConfig {
  titleEn: string;
  titleSw: string;
  messageEn: string;
  messageSw: string;
  name: string;
  roleEn: string;
  roleSw: string;
  image: string;
}

export const DEFAULT_CHOIRMASTER_MESSAGE: ChoirmasterMessageConfig = {
  titleEn: "A Word from the Choirmaster",
  titleSw: "Ujumbe Kutoka kwa Mwalimu wa Kwaya",
  messageEn: "“Welcome to the musical home of St. Monica Third Mass Choir, Nakuru. Our continuous focus is vocal discipline and deep reverential worship before the Holy Altar. We teach our choristers strict tonic sol-fa sight singing, ensuring every song offered is a sincere offering of praise to Almighty God.”",
  messageSw: "“Karibu sana kwenye jukwaa la muziki la Kwaya ya Misa ya Tatu ya Mtakatifu Monika, Nakuru. Lengo letu kuu ni nidhamu ya sauti na heshima mbele ya Altare Takatifu. Tunafundisha waimbaji wetu kusoma noti za solfa kwa ufasaha, ili kila wimbo unaoimbwa uwe toleo la dhati la sifa kwa Mwenyezi Mungu.”",
  name: "Mwalimu Atebe Mark T.",
  roleEn: "Director of Music & Choirmaster",
  roleSw: "Mkurugenzi wa Muziki na Mwalimu Mkuu wa Kwaya",
  image: "/assets/choir/choir_leader_02.jpg"
};

export interface FooterContactConfig {
  phone: string;
  whatsapp: string;
  email: string;
  churchAddress: string;
  mapsUrl: string;
  mpesaTill: string;
  rehearsalsEn: string;
  rehearsalsSw: string;
}

export const DEFAULT_FOOTER_CONTACT: FooterContactConfig = {
  phone: "+254 700 000 000",
  whatsapp: "https://wa.me/254700000000",
  email: "info@stmonicachoir.org",
  churchAddress: "Section 58, Off Kanu Street, Nakuru, Kenya",
  mapsUrl: "https://maps.google.com/?q=St+Monica+Catholic+Church+Section+58+Nakuru",
  mpesaTill: "8421092",
  rehearsalsEn: "Wednesdays & Fridays: 5:30 PM – 7:30 PM (Parish Hall)",
  rehearsalsSw: "Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku (Ukumbi wa Parokia)"
};

export interface AboutPageConfig {
  storyBannerImg: string;
  storyTitleEn: string;
  storyTitleSw: string;
  storySubtitleEn: string;
  storySubtitleSw: string;
  storyParagraph1En: string;
  storyParagraph1Sw: string;
  storyParagraph2En: string;
  storyParagraph2Sw: string;
  storyPhotoImg: string;
  patronBannerImg: string;
  patronPortraitImg: string;
  patronTitleEn: string;
  patronTitleSw: string;
  patronSubtitleEn: string;
  patronSubtitleSw: string;
  patronBio1En: string;
  patronBio1Sw: string;
  patronBio2En: string;
  patronBio2Sw: string;
  patronFeastDayEn: string;
  patronFeastDaySw: string;
  patronPrayerEn: string;
  patronPrayerSw: string;
}

export const DEFAULT_ABOUT_CONFIG: AboutPageConfig = {
  storyBannerImg: "/assets/choir/choir_02.jpg",
  storyTitleEn: "Our Roots in St. Monica Parish, Nakuru",
  storyTitleSw: "Mizizi Yetu Katika Parokia ya Mtakatifu Monika",
  storySubtitleEn: "Serving Sunday High Mass at Section 58 with sacred four-part choral liturgy since 2012.",
  storySubtitleSw: "Kutoka waimbaji kumi na wanne mwaka 2012 hadi jumuiya inayotumikia altare ya Mungu kila juma.",
  storyParagraph1En: "St. Monica Third Mass Choir was founded out of a shared desire to provide elevated liturgical singing for Sunday Mass (the parish 3rd Mass). Since day one, our ethos has remained steadfast: four-part vocal precision (Soprano, Alto, Tenor, Bass), fraternal unity, and reverent devotion before the altar.",
  storyParagraph1Sw: "Kwaya ya Misa ya Tatu ya Mtakatifu Monika ilizaliwa kutokana na kiu ya waamini walei kutaka kutoa muziki wa kiwango cha juu wa kiliturujia wakati wa Misa ya Tatu ya Jumapili. Tangu mwanzo, kanuni yetu imekuwa nidhamu ya sauti nne (Soprano, Alto, Tenor, Bass), upendo wa kidugu, na usafi wa kiroho.",
  storyParagraph2En: "Under the guidance of our dedicated music directors and the parish pastoral council, our choir has grown into an anchor ensemble across the Catholic Diocese of Nakuru, ministering at priestly ordinations, confirmations, nuptial weddings, and solemn requiem Masses.",
  storyParagraph2Sw: "Chini ya uongozi thabiti wa walimu wa muziki na kamati ya kwaya, kwaya imekua na kuwa nguzo muhimu katika Jimbo Katoliki la Nakuru, ikihudumu kwenye Misa za upadirisho, vipaimara, harusi takatifu, na mazishi ya kiheshima.",
  storyPhotoImg: "/assets/choir/choir_04.jpg",
  patronBannerImg: "/assets/choir/choir_06.jpg",
  patronPortraitImg: "/assets/choir/choir_leader_01.jpg",
  patronTitleEn: "Why St. Monica is Our Heavenly Patroness",
  patronTitleSw: "Kwanini Mtakatifu Monika ni Somo Wetu?",
  patronSubtitleEn: "Mother of tears & unceasing prayer · Feast Day: August 27.",
  patronSubtitleSw: "Mama wa machozi na sala isiyokoma · Sikukuu: 27 Agosti.",
  patronBio1En: "Saint Monica (c. 332–387 AD) was born in Tagaste, North Africa (modern-day Algeria). A woman of profound Catholic piety and unmatched perseverance, she is globally celebrated for praying persistently for seventeen years for the conversion of her wayward son, Augustine.",
  patronBio1Sw: "Mtakatifu Monika (takriban 332–387 BK) alizaliwa Tagaste, Afrika Kaskazini (nchini Algeria ya sasa). Alikuwa mwanamke wa sala na uvumilivu mkubwa ambaye alimlilia Mungu kwa miaka kumi na saba hadi mwanaye Augustino alipobatizwa na kuwa Askofu na Mwalimu Mkuu wa Kanisa.",
  patronBio2En: "For our choristers at Section 58 in Nakuru, Saint Monica embodies the heart of choir ministry: weeping with those who mourn, rejoicing with those who hope, and never ceasing to lift tears and hymns of faith to God.",
  patronBio2Sw: "Kwa waimbaji wetu wa Misa ya Tatu Parokiani Section 58 Nakuru, Mtakatifu Monika ni mfano wa upendo, sala ya machozi isiyokata tamaa na unyenyekevu mkuu mbele ya Altare ya Ekaristi Takatifu.",
  patronFeastDayEn: "27th August (Universal Feast Day of Saint Monica)",
  patronFeastDaySw: "Tarehe 27 Agosti (Sikukuu ya Mtakatifu Monika Duniani)",
  patronPrayerEn: "Lord, through the persistent prayers and tears of Saint Monica, You led Saint Augustine into the light of the true faith. Through her intercession, give our choir faithful devotion, vocal humility, and grace to draw all souls to Your Altar through sacred song. Amen.",
  patronPrayerSw: "Ee Mungu wetu, kupitia sala na machozi ya Mtakatifu Monika, ulimwongoza mwanaye Augustino kwenye ukweli wa Injili. Kupitia maombezi yake, ijalie kwaya yetu neema ya kuimba kwa unyenyekevu na nidhamu ya kicho altaroni ili mioyo ya wengi ivutwe kwako. Amina."
};

export const DEFAULT_HERO_SLIDES_CONFIG: HeroSlideConfig[] = [
  {
    id: "hero-slide-1",
    src: "/assets/choir/choir_01.jpg",
    srcMobile: "/assets/choir/choir_01.jpg",
    alt: "Full choir at Sunday Sung Mass altar in St. Monica Catholic Church, Section 58",
    description: "Full Choir at Sunday Sung Mass",
    eyebrowEn: "Four-part SATB polyphony at Section 58, Nakuru",
    eyebrowSw: "Muziki wa sauti nne (SATB) Section 58, Nakuru",
    headlineEn: "Uniting hearts through sacred music",
    headlineSw: "Kuunganisha mioyo kupitia muziki mtakatifu",
    attributionEn: "St. Monica Third Mass Choir · Nakuru",
    attributionSw: "Kwaya ya Misa ya Tatu, Mtakatifu Monika · Nakuru",
    descEn: "Four-part SATB polyphony sung every Sunday at 10:00 AM Mass. Preserving sacred liturgical music tradition in the Catholic Diocese of Nakuru.",
    descSw: "Muziki wa kiliturujia wa sauti nne (Soprano, Alto, Tenor, Bass) kila Dominika Misa ya Saa Nne Asubuhi Parokia ya Mtakatifu Monika.",
    focus: "50% 25%",
    focusMobile: "50% 20%"
  },
  {
    id: "hero-slide-2",
    src: "/assets/choir/choir_03.jpg",
    srcMobile: "/assets/choir/choir_03.jpg",
    alt: "St. Monica's Catholic Church sanctuary and altar, Section 58 Nakuru",
    description: "Parish Sanctuary & Church",
    eyebrowEn: "Saint Augustine on the Sacred Liturgy",
    eyebrowSw: "Mtakatifu Augustino Kuhusu Liturujia Takatifu",
    headlineEn: "“He who sings well prays twice.”",
    headlineSw: "“Aimbaye vizuri anasali mara mbili.”",
    attributionEn: "St. Augustine of Hippo (Bishop & Doctor of the Church)",
    attributionSw: "Mtakatifu Augustino wa Hippo (Askofu na Mwalimu wa Kanisa)",
    descEn: "Our voices are lifted before the parish altar in reverent service, offering prayer through solemn chant and four-part liturgical song.",
    descSw: "Sauti zetu zinainuliwa mbele ya Altare ya Parokia kwa heshima kuu, tukitoa sala kupitia nyimbo takatifu na kwaya ya sauti nne.",
    focus: "50% 30%",
    focusMobile: "50% 25%"
  },
  {
    id: "hero-slide-3",
    src: "/assets/choir/choir_09.jpg",
    srcMobile: "/assets/choir/choir_09.jpg",
    alt: "Choristers singing praise before the parish altar",
    description: "Singers in Sacred Song",
    eyebrowEn: "Liturgical Harmony Before the Altar",
    eyebrowSw: "Upatanisho wa Kiliturujia Mbele ya Altare",
    headlineEn: "“Sing to the Lord a new song; sing to the Lord, all the earth.”",
    headlineSw: "“Mwimbieni Bwana wimbo mpya, mwimbieni Bwana, nchi yote.”",
    attributionEn: "Psalm 96:1 / Zaburi 96:1",
    attributionSw: "Zaburi 96:1",
    descEn: "Leading the congregation into prayerful worship every Sunday through authentic Kenyan Catholic choral repertoire and solemn polyphony.",
    descSw: "Kuongoza kutaniko katika sala ya heshima kila Dominika kupitia nyimbo takatifu za Kikatoliki za Kenya na utajiri wa sauti nne.",
    focus: "50% 20%",
    focusMobile: "50% 15%"
  },
  {
    id: "hero-slide-4",
    src: "/assets/choir/choir_07.jpg",
    srcMobile: "/assets/choir/choir_07.jpg",
    alt: "The choirmaster directing four-part vocal polyphony",
    description: "Choirmaster Directing",
    eyebrowEn: "Vocal Ministry & Solfa Training",
    eyebrowSw: "Huduma ya Sauti na Mafunzo ya Solfa",
    headlineEn: "Four Voices, One Sacred Harmony Before the Altar.",
    headlineSw: "Sauti Nne, Upatanisho Mmoja Mtakatifu Mbele ya Altare.",
    attributionEn: "Section 58, Nakuru · Catholic Diocese of Nakuru",
    attributionSw: "Section 58, Nakuru · Jimbo Katoliki la Nakuru",
    descEn: "Rigorous tonic sol-fa and staff training nurturing parish vocalists for liturgical excellence and devoted Catholic worship.",
    descSw: "Mafunzo ya kina ya noti za solfa na stafu kwa vijana na waimbaji wa parokia kwa utukufu wa Mungu na liturujia takatifu.",
    focus: "60% 15%",
    focusMobile: "60% 15%"
  }
];

export interface CoreValueItem {
  id: string;
  badgeNumber: number; // 1, 2, 3...
  titleEn: string;
  titleSw: string;
  subtitleEn?: string;
  subtitleSw?: string;
  descriptionEn: string;
  descriptionSw: string;
  scriptureRef?: string;
  active: boolean;
}

// 8 Liturgical Virtues of Catholic Choirs (Derived from official choir constitution card)
export const ALL_EIGHT_VIRTUES_CATALOG: CoreValueItem[] = [
  {
    id: 'val-faith',
    badgeNumber: 1,
    titleEn: 'Faith',
    titleSw: 'Imani',
    subtitleEn: 'Rooted in Christ',
    subtitleSw: 'Imejengwa Juu ya Kristo',
    descriptionEn: 'Christ is the centre of all we sing. Our voices flow from lives rooted in prayer and the sacraments.',
    descriptionSw: 'Kristo ndiye kiini cha yote tunayoimba. Sauti zetu zinatiririka kutoka kwenye maisha yaliyojikita katika sala na sakramenti.',
    scriptureRef: 'Hebrews 11:1 / Waebrania 11:1',
    active: true
  },
  {
    id: 'val-reverence',
    badgeNumber: 2,
    titleEn: 'Reverence',
    titleSw: 'Heshima na Ibada',
    subtitleEn: 'Honouring the Sacred Liturgy',
    subtitleSw: 'Kutukuza Liturujia Takatifu',
    descriptionEn: 'We honour the Sacred Liturgy and bring to every Mass the dignity and recollection it deserves.',
    descriptionSw: 'Tunaheshimu Liturujia Takatifu na kuleta kwenye kila Misa hadhi, unyenyekevu na utulivu unaostahili.',
    scriptureRef: 'Psalm 95:6 / Zaburi 95:6',
    active: true
  },
  {
    id: 'val-communion',
    badgeNumber: 3,
    titleEn: 'Communion',
    titleSw: 'Ushirika',
    subtitleEn: 'One in Christ & Church',
    subtitleSw: 'Umoja Ndani ya Kristo na Kanisa',
    descriptionEn: 'We are one in Christ and one with the Church; our harmony reflects our communion with God and one another.',
    descriptionSw: 'Sisi ni wamoja katika Kristo na wamoja na Kanisa; upatano wetu unaakisi ushirika wetu na Mungu na sisi kwa sisi.',
    scriptureRef: '1 Corinthians 10:17 / 1 Wakorintho 10:17',
    active: false
  },
  {
    id: 'val-humility',
    badgeNumber: 4,
    titleEn: 'Humility',
    titleSw: 'Unyenyekevu',
    subtitleEn: 'Christ Glorified, Not Ourselves',
    subtitleSw: 'Kristo Atukuzwe, Si Sisi',
    descriptionEn: 'We serve so that Christ may be glorified, not ourselves. The music points beyond the singers to God.',
    descriptionSw: 'Tunatumikia ili Kristo atukuzwe, si sisi wenyewe. Muziki unaelekeza zaidi ya waimbaji hadi kwa Mungu.',
    scriptureRef: 'John 3:30 / Yohane 3:30',
    active: false
  },
  {
    id: 'val-service',
    badgeNumber: 5,
    titleEn: 'Service',
    titleSw: 'Huduma ya Utoaji',
    subtitleEn: 'Generous Offering of Gifts',
    subtitleSw: 'Kutoa Karama kwa Ukarimu',
    descriptionEn: 'We offer our gifts generously for the building up of the parish and the worship of God\'s people.',
    descriptionSw: 'Tunatoa vipawa vyetu kwa ukarimu kwa ajili ya kujenga parokia na ibada ya watu wa Mungu.',
    scriptureRef: '1 Peter 4:10 / 1 Petro 4:10',
    active: false
  },
  {
    id: 'val-excellence',
    badgeNumber: 3, // Displayed as 3 on default 3-item home layout
    titleEn: 'Excellence',
    titleSw: 'Ubora wa Utume',
    subtitleEn: 'A Fitting Sacrifice of Praise',
    subtitleSw: 'Dhabihu Inayostahili ya Sifa',
    descriptionEn: 'Through faithful rehearsal and growth in skill, we offer God our very best, a fitting sacrifice of praise.',
    descriptionSw: 'Kupitia mazoezi ya uaminifu na kukuza stadi zetu, tunamtolea Mungu kilicho bora zaidi, dhabihu inayostahili ya sifa.',
    scriptureRef: 'Colossians 3:23 / Wakolosai 3:23',
    active: true
  },
  {
    id: 'val-evangelisation',
    badgeNumber: 7,
    titleEn: 'Evangelisation',
    titleSw: 'Uinjilishaji',
    subtitleEn: 'Lifting Souls to God',
    subtitleSw: 'Kuinua Roho kwa Mungu',
    descriptionEn: 'Through sacred music we touch hearts, lift souls to God, and proclaim the Gospel in beauty and truth.',
    descriptionSw: 'Kupitia muziki mtakatifu tunagusa mioyo, kuinua roho kwa Mungu, na kutangaza Injili kwa uzuri na ukweli.',
    scriptureRef: 'Mark 16:15 / Marko 16:15',
    active: false
  },
  {
    id: 'val-perseverance',
    badgeNumber: 8,
    titleEn: 'Perseverance',
    titleSw: 'Uvumilivu na Uthabiti',
    subtitleEn: 'Steadfast in Mission',
    subtitleSw: 'Imara Katika Utume',
    descriptionEn: 'Committed in joy and in trial, we persevere in practice and prayer for the mission entrusted to us.',
    descriptionSw: 'Tukiwa tumejitolea katika furaha na majaribu, tunadumu katika mazoezi na sala kwa ajili ya utume tuliopewa.',
    scriptureRef: 'Galatians 6:9 / Wagalatia 6:9',
    active: false
  }
];

// Top 3 best core values selected by default for the home page (Faith, Reverence, Excellence)
export const DEFAULT_CORE_VALUES: CoreValueItem[] = [
  {
    id: 'val-faith',
    badgeNumber: 1,
    titleEn: 'Faith',
    titleSw: 'Imani',
    subtitleEn: 'Rooted in Christ',
    subtitleSw: 'Imejengwa Juu ya Kristo',
    descriptionEn: 'Christ is the centre of all we sing. Our voices flow from lives rooted in prayer and the sacraments.',
    descriptionSw: 'Kristo ndiye kiini cha yote tunayoimba. Sauti zetu zinatiririka kutoka kwenye maisha yaliyojikita katika sala na sakramenti.',
    scriptureRef: 'Hebrews 11:1 / Waebrania 11:1',
    active: true
  },
  {
    id: 'val-reverence',
    badgeNumber: 2,
    titleEn: 'Reverence',
    titleSw: 'Heshima na Ibada',
    subtitleEn: 'Honouring the Sacred Liturgy',
    subtitleSw: 'Kutukuza Liturujia Takatifu',
    descriptionEn: 'We honour the Sacred Liturgy and bring to every Mass the dignity and recollection it deserves.',
    descriptionSw: 'Tunaheshimu Liturujia Takatifu na kuleta kwenye kila Misa hadhi, unyenyekevu na utulivu unaostahili.',
    scriptureRef: 'Psalm 95:6 / Zaburi 95:6',
    active: true
  },
  {
    id: 'val-excellence',
    badgeNumber: 3,
    titleEn: 'Excellence',
    titleSw: 'Ubora wa Utume',
    subtitleEn: 'A Fitting Sacrifice of Praise',
    subtitleSw: 'Dhabihu Inayostahili ya Sifa',
    descriptionEn: 'Through faithful rehearsal and growth in skill, we offer God our very best, a fitting sacrifice of praise.',
    descriptionSw: 'Kupitia mazoezi ya uaminifu na kukuza stadi zetu, tunamtolea Mungu kilicho bora zaidi, dhabihu inayostahili ya sifa.',
    scriptureRef: 'Colossians 3:23 / Wakolosai 3:23',
    active: true
  }
];


