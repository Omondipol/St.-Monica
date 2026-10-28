import { createStandardChoralMidiDataUrl } from '../utils/fileDownload';

export interface LibraryCategory {
  id: string;
  nameSw: string;
  nameEn: string;
  descriptionSw: string;
  descriptionEn: string;
  themeColor: string;
  motif: 'cross' | 'bread' | 'cup' | 'dove' | 'candle' | 'water' | 'ring' | 'crown' | 'harp' | 'book' | 'incense';
}

export interface LibrarySong {
  id: string;
  title: string;
  titleSwahili?: string;
  composer: string;
  arranger?: string;
  language: 'Kiswahili' | 'English' | 'Latin' | 'Kikuyu' | 'Dholuo' | 'Kalenjin' | 'Other';
  categories: string[]; // Category IDs
  season?: string;
  voices: 'SATB' | 'Unison' | 'Solo' | 'SSAA' | 'TTBB';
  lyrics?: string;
  previewImage?: string;
  pdfUrl?: string;
  audioUrl?: string;
  hasAudio?: boolean;
  sharingStatus: 'Public domain' | 'Shared with permission' | 'Link only';
  permissionGivenBy?: string;
  permissionDate?: string;
  externalSourceUrl?: string;
  downloadCount: number;
  addedDate: string;
  solfaNotes?: boolean;
  tempo?: string;
  // Actual sheet music score (PDF/image) and MIDI downloads
  notesUrl?: string;
  notesFileName?: string;
  midiUrl?: string;
  midiFileName?: string;
}

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  {
    id: 'kuingia',
    nameSw: 'Wimbo wa Kuingia',
    nameEn: 'Entrance',
    descriptionSw: 'Nyimbo za maandamano ya kuanza Misa Takatifu.',
    descriptionEn: 'Hymns and chants for the opening liturgical procession.',
    themeColor: '#1058A8',
    motif: 'cross'
  },
  {
    id: 'matoleo',
    nameSw: 'Matoleo',
    nameEn: 'Offertory',
    descriptionSw: 'Nyimbo za utoaji wa sadaka, mkate na divai altaroni.',
    descriptionEn: 'Hymns sung during the presentation of gifts and altar preparation.',
    themeColor: '#1058A8',
    motif: 'bread'
  },
  {
    id: 'komunyo',
    nameSw: 'Komunyo',
    nameEn: 'Communion',
    descriptionSw: 'Nyimbo za kuungana na Kristo katika Ekaristi Takatifu.',
    descriptionEn: 'Sacred hymns sung while receiving the Holy Eucharist.',
    themeColor: '#1058A8',
    motif: 'cup'
  },
  {
    id: 'tafakari',
    nameSw: 'Tafakari',
    nameEn: 'Meditation',
    descriptionSw: 'Nyimbo za shukurani na tafakari baada ya Komunyo.',
    descriptionEn: 'Reflective and prayerful hymns of post-communion thanksgiving.',
    themeColor: '#1058A8',
    motif: 'harp'
  },
  {
    id: 'kutoka',
    nameSw: 'Wimbo wa Kutoka',
    nameEn: 'Recessional',
    descriptionSw: 'Nyimbo za kuhitimisha Misa na kutumwa duniani kwa amani.',
    descriptionEn: 'Closing liturgical dismissal hymns as the congregation goes forth.',
    themeColor: '#1058A8',
    motif: 'incense'
  },
  {
    id: 'majilio',
    nameSw: 'Majilio',
    nameEn: 'Advent',
    descriptionSw: 'Kipindi cha kutarajia na kujiandaa kwa ujio wa Mwokozi.',
    descriptionEn: 'Solemn anticipation and spiritual preparation for the coming of Christ.',
    themeColor: '#1058A8',
    motif: 'candle'
  },
  {
    id: 'noeli',
    nameSw: 'Noeli',
    nameEn: 'Christmas',
    descriptionSw: 'Nyimbo za shangwe ya kuzaliwa kwa Bwana wetu Yesu Kristo.',
    descriptionEn: 'Joyous hymns celebrating the Nativity and Incarnation.',
    themeColor: '#1058A8',
    motif: 'cross'
  },
  {
    id: 'kwaresima',
    nameSw: 'Kwaresima',
    nameEn: 'Lent',
    descriptionSw: 'Nyimbo za toba, mfungo, njia ya msalaba na huruma ya Mungu.',
    descriptionEn: 'Penitential hymns of fasting, the cross, and divine mercy.',
    themeColor: '#1058A8',
    motif: 'cross'
  },
  {
    id: 'pasaka',
    nameSw: 'Pasaka',
    nameEn: 'Easter',
    descriptionSw: 'Kushangilia ushindi wa ufufuko wa Kristo, Aleluya.',
    descriptionEn: 'Triumphant hymns celebrating the Resurrection of the Lord.',
    themeColor: '#1058A8',
    motif: 'crown'
  },
  {
    id: 'bikira-maria',
    nameSw: 'Bikira Maria',
    nameEn: 'Mary',
    descriptionSw: 'Nyimbo za heshima kwa Mama wa Mungu na Mwombezi wetu.',
    descriptionEn: 'Marian hymns honoring the Blessed Mother and our intercessor.',
    themeColor: '#1058A8',
    motif: 'crown'
  },
  {
    id: 'zaburi',
    nameSw: 'Zaburi',
    nameEn: 'Psalms',
    descriptionSw: 'Zaburi za mwitikio na nyimbo za sifa za kimaandiko.',
    descriptionEn: 'Responsorial psalms and scriptural canticles.',
    themeColor: '#1058A8',
    motif: 'book'
  },
  {
    id: 'shukrani',
    nameSw: 'Shukrani',
    nameEn: 'Thanksgiving',
    descriptionSw: 'Kumsifu Bwana kwa matendo yake makuu na fadhili zake.',
    descriptionEn: 'Hymns of gratitude and joy for God’s steadfast love.',
    themeColor: '#1058A8',
    motif: 'harp'
  },
  {
    id: 'ndoa',
    nameSw: 'Ndoa',
    nameEn: 'Weddings',
    descriptionSw: 'Nyimbo za baraka ya Sakramenti ya Ndoa Takatifu.',
    descriptionEn: 'Nuptial hymns celebrating the Sacrament of Holy Matrimony.',
    themeColor: '#1058A8',
    motif: 'ring'
  },
  {
    id: 'ubatizo',
    nameSw: 'Ubatizo',
    nameEn: 'Baptism',
    descriptionSw: 'Nyimbo za kuzaliwa upya kwa maji na Roho Mtakatifu.',
    descriptionEn: 'Gentle hymns for the celebration of Holy Baptism and new life.',
    themeColor: '#1058A8',
    motif: 'water'
  },
  {
    id: 'mazishi',
    nameSw: 'Mazishi',
    nameEn: 'Funeral',
    descriptionSw: 'Sala ya raha ya milele na matumaini ya ufufuko.',
    descriptionEn: 'Solemn requiem hymns of Christian hope and eternal rest.',
    themeColor: '#1058A8',
    motif: 'candle'
  },
  {
    id: 'roho-mtakatifu',
    nameSw: 'Roho Mtakatifu',
    nameEn: 'Holy Spirit',
    descriptionSw: 'Nyimbo za kumwomba Roho Mtakatifu na karama zake (Pentekoste).',
    descriptionEn: 'Invocations to the Holy Spirit for guidance and Pentecost grace.',
    themeColor: '#1058A8',
    motif: 'dove'
  }
];

export const INITIAL_LIBRARY_SONGS: LibrarySong[] = [
  // 1. KUINGIA (Entrance)
  {
    id: 'lib-01',
    title: 'Twende Wote Nyumbani Mwa Bwana',
    composer: 'Fr. G. Shengena',
    language: 'Kiswahili',
    categories: ['kuingia'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Twende wote nyumbani mwa Bwana,
Kwa furaha na vigelegele;
Bwana Mungu wetu ametuita,
Tuingie hekaluni mwake.

Kiitikio:
Njooni tumwabudu Mungu,
Mwenyezi mfalme mkuu;
Kwa nyimbo na vinanda,
Tusifu jina lake.

2. Ni siku ya Bwana ya shangwe,
Wateule wote tusimame;
Tupokee neno la uzima,
Tufurahi mbele za altare.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Fr. G. Shengena (Archdiocese of Nairobi / Kwaya ya Mt. Kizito)',
    permissionDate: '2025-04-12',
    downloadCount: 142,
    addedDate: '2025-05-01',
    solfaNotes: true,
    hasAudio: true,
    pdfUrl: 'https://example.com/scores/twende-wote-nyumbani.pdf',
    notesUrl: 'https://example.com/scores/twende-wote-nyumbani.pdf',
    notesFileName: 'Twende_Wote_Nyumbani_SATB_Score.pdf',
    midiUrl: createStandardChoralMidiDataUrl('Twende Wote Nyumbani Mwa Bwana'),
    midiFileName: 'Twende_Wote_Nyumbani_SATB.mid',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3'
  },
  {
    id: 'lib-02',
    title: 'Tuingie Nyumbani Mwa Bwana',
    composer: 'Fr. Kayetta',
    language: 'Kiswahili',
    categories: ['kuingia'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Tuingie nyumbani mwa Bwana kwa furaha,
Tushangilie mbele zake Mwokozi wetu;
Yeye ndiye mwamba wa wokovu wetu,
Njooni tufanye shangwe mbele zake.

Kiitikio:
Tuingie kwa shukrani malangoni mwake,
Na viwanjani mwake kwa sifa;
Mshukuruni, lihimidini jina lake,
Kwa kuwa Bwana ni mwema milele.`,
    sharingStatus: 'Link only',
    externalSourceUrl: 'https://swahilimusicnotes.com/song/tuingie-nyumbani-mwa-bwana',
    downloadCount: 98,
    addedDate: '2025-01-15',
    solfaNotes: true,
    hasAudio: true
    // Note: lib-02 intentionally has no notesUrl and no midiUrl (both buttons greyed out)
  },
  {
    id: 'lib-03',
    title: 'Introitus: Puer Natus Est Nobis',
    composer: 'Traditional Gregorian Chant',
    language: 'Latin',
    categories: ['kuingia', 'noeli'],
    season: 'Noeli / Christmas',
    voices: 'Unison',
    lyrics: `Puer natus est nobis,
et filius datus est nobis:
cuius imperium super humerum eius:
et vocabitur nomen eius,
magni consilii Angelus.

Cantate Domino canticum novum:
quia mirabilia fecit.
Gloria Patri, et Filio, et Spiritui Sancto.`,
    sharingStatus: 'Public domain',
    downloadCount: 312,
    addedDate: '2024-12-01',
    hasAudio: true,
    pdfUrl: 'https://example.com/scores/puer-natus-est.pdf',
    notesUrl: 'https://example.com/scores/puer-natus-est.pdf',
    notesFileName: 'Puer_Natus_Est_Nobis_Score.pdf'
    // Has notesUrl, no midiUrl (MIDI button greyed out)
  },

  // 2. MATOLEO (Offertory)
  {
    id: 'lib-04',
    title: 'Twaja na Matoleo',
    composer: 'Fr. C. Temba',
    language: 'Kiswahili',
    categories: ['matoleo'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Twaja na matoleo, Bwana upokee,
Mkate na divai, mazao ya mashamba;
Twakutolea wewe, Mungu Muumba wetu,
Utubariki sote tunaokulilia.

Kiitikio:
Pokea Baba, pokea sadaka yetu,
Tunayokutolea kwa moyo wa unyenyekevu;
Iwe dhabihu safi inayokupendeza,
Utuletee neema na uzima tele.

2. Fedha na mali zetu, jasho la mikono,
Twakukabidhi Bwana kwa uaminifu wote;
Wajane na yatima, maskini uwajaze,
Kila hitaji lao ulitimize vema.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Fr. C. Temba (Diocese of Moshi)',
    permissionDate: '2025-02-14',
    downloadCount: 220,
    addedDate: '2025-03-01',
    solfaNotes: true,
    hasAudio: true,
    midiUrl: createStandardChoralMidiDataUrl('Twaja na Matoleo - Fr. C. Temba'),
    midiFileName: 'Twaja_Na_Matoleo_SATB.mid'
    // Has midiUrl, no notesUrl (Notes button greyed out)
  },
  {
    id: 'lib-05',
    title: 'Bwana Pokea Sadaka Yetu',
    composer: 'Traditional Catholic Hymn',
    language: 'Kiswahili',
    categories: ['matoleo'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Bwana pokea sadaka yetu,
Tunayokutolea leo altaroni;
Mkate huu uwe mwili wa Kristo,
Divai hii iwe damu azizi.`,
    sharingStatus: 'Public domain',
    downloadCount: 175,
    addedDate: '2024-09-10',
    solfaNotes: true,
    hasAudio: false
  },
  {
    id: 'lib-06',
    title: 'Twende Mbele za Bwana na Zawadi',
    composer: 'E. Bwire',
    language: 'Kiswahili',
    categories: ['matoleo'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Twende mbele za Bwana na zawadi zetu,
Tusimame kwa heshima tukitabasamu;
Mungu ametupa uhai na afya,
Tusijinyime kumpa sehemu yake.`,
    sharingStatus: 'Link only',
    externalSourceUrl: 'https://catholicsongs.com/scores/bwire-zawadi',
    downloadCount: 45,
    addedDate: '2025-06-02',
    solfaNotes: true,
    hasAudio: false
  },

  // 3. KOMUNYO (Communion)
  {
    id: 'lib-07',
    title: 'Mimi Ndimi Njia',
    composer: 'Fr. Kayetta',
    language: 'Kiswahili',
    categories: ['komunyo'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Mimi ndimi njia, na kweli, na uzima,
Mtu haji kwa Baba ila kwa njia yangu;
Yeyote anilaye ana uzima tele,
Nami nitamfufua siku ya mwisho.

Kiitikio:
Karibuni mezani mwa Bwana,
Kuleni mkate wa malaika;
Mnywe kikombe cha agano jipya,
Mkae ndani yake daima.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Fr. Kayetta Music Foundation',
    permissionDate: '2024-08-19',
    downloadCount: 289,
    addedDate: '2024-10-01',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-08',
    title: 'Anima Christi',
    composer: 'Traditional Sancta Mater',
    language: 'Latin',
    categories: ['komunyo', 'tafakari'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `Anima Christi, sanctifica me.
Corpus Christi, salva me.
Sanguis Christi, inebria me.
Aqua lateris Christi, lava me.
Passio Christi, conforta me.
O bone Iesu, exaudi me.
Intra tua vulnera absconde me.
Ne permittas me separari a te.
Ab hoste maligno defende me.
In hora mortis meae voca me.
Et iube me venire ad te,
Ut cum Sanctis tuis laudem te
In saecula saeculorum. Amen.`,
    sharingStatus: 'Public domain',
    downloadCount: 410,
    addedDate: '2024-07-22',
    hasAudio: true
  },
  {
    id: 'lib-09',
    title: 'Panis Angelicus',
    composer: 'César Franck (1822–1890)',
    language: 'Latin',
    categories: ['komunyo'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `Panis angelicus
Fit panis hominum;
Dat panis coelicus
Figuris terminum:
O res mirabilis!
Manducat Dominum
Pauper, servus et humilis.`,
    sharingStatus: 'Public domain',
    downloadCount: 388,
    addedDate: '2024-05-18',
    hasAudio: true
  },
  {
    id: 'lib-10',
    title: 'Kaa Nami (Abide With Me)',
    composer: 'Henry Francis Lyte / Arr. St. Monica',
    language: 'Kiswahili',
    categories: ['komunyo', 'tafakari', 'mazishi'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Kaa nami, usiku wakaribia,
Giza latanda, Bwana unisaidie;
Wasaidizi wengine wakikosa,
Wewe kimbilio, ukae nami.`,
    sharingStatus: 'Public domain',
    downloadCount: 265,
    addedDate: '2024-11-05',
    solfaNotes: true,
    hasAudio: true
  },

  // 4. TAFAKARI (Meditation)
  {
    id: 'lib-11',
    title: 'Mtegemee Bwana',
    composer: 'Atebe Mark T. / Kwaya ya Mt. Monika',
    language: 'Kiswahili',
    categories: ['tafakari', 'shukrani'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Mtegemee Bwana kwa moyo wako wote,
Usitegemee akili zako mwenyewe;
Katika njia zako zote mkiri yeye,
Naye atayanyoosha mapito yako.

Kiitikio:
Bwana ni kimbilio na nguvu yetu,
Msaada utakaopatikana tele wakati wa mateso;
Kwa hiyo hatutaogopa hata dunia ikitikisika,
Maana Bwana wa majeshi yu pamoja nasi.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Atebe Mark T. (Choir Director)',
    permissionDate: '2024-06-15',
    downloadCount: 520,
    addedDate: '2024-07-01',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-12',
    title: 'Adoro Te Devote',
    composer: 'St. Thomas Aquinas (1225–1274)',
    language: 'Latin',
    categories: ['tafakari', 'komunyo'],
    season: 'Kawaida / Ordinary',
    voices: 'Unison',
    lyrics: `Adoro te devote, latens Deitas,
Quae sub his figuris vere latitas:
Tibi se cor meum totum subiicit,
Quia te contemplans totum deficit.

Visus, tactus, gustus in te fallitur,
Sed auditu solo tuto creditur:
Credo quidquid dixit Dei Filius:
Nil hoc verbo Veritatis verius.`,
    sharingStatus: 'Public domain',
    downloadCount: 340,
    addedDate: '2024-04-10',
    hasAudio: true
  },
  {
    id: 'lib-13',
    title: 'Nearer, My God, to Thee',
    composer: 'Lowell Mason (1792–1872)',
    language: 'English',
    categories: ['tafakari'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Nearer, my God, to Thee, nearer to Thee!
E'en though it be a cross that raiseth me,
Still all my song shall be,
Nearer, my God, to Thee;
Nearer, my God, to Thee, nearer to Thee!`,
    sharingStatus: 'Public domain',
    downloadCount: 215,
    addedDate: '2024-08-30',
    hasAudio: false
  },

  // 5. WIMBO WA KUTOKA (Recessional)
  {
    id: 'lib-14',
    title: 'Twendeni kwa Amani',
    composer: 'Fr. G. Shengena',
    language: 'Kiswahili',
    categories: ['kutoka'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Twendeni kwa amani tukiwa na furaha,
Misa imekwisha, neno tumelisikia;
Tukahubiri injili kwa matendo yetu,
Mungu wetu atukuzwe daima na milele.

Kiitikio:
Twendeni sasa tukapendane,
Kama Kristo alivyotupenda;
Nuru yetu iangaze mbele ya watu,
Wamwone Baba aliye mbinguni.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Fr. G. Shengena',
    permissionDate: '2025-01-08',
    downloadCount: 194,
    addedDate: '2025-02-01',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-15',
    title: 'Te Deum Laudamus',
    composer: 'Traditional 4th Century Latin Hymn',
    language: 'Latin',
    categories: ['kutoka', 'shukrani'],
    season: 'Pasaka / Easter',
    voices: 'SATB',
    lyrics: `Te Deum laudamus: te Dominum confitemur.
Te aeternum Patrem omnis terra veneratur.
Tibi omnes Angeli; tibi caeli et universae Potestates;
Tibi Cherubim et Seraphim incessabili voce proclamant:
Sanctus, Sanctus, Sanctus, Dominus Deus Sabaoth.`,
    sharingStatus: 'Public domain',
    downloadCount: 280,
    addedDate: '2024-03-12',
    hasAudio: true
  },

  // 6. MAJILIO (Advent)
  {
    id: 'lib-16',
    title: 'Malaika Gabrieli',
    composer: 'Traditional Advent Hymn',
    language: 'Kiswahili',
    categories: ['majilio', 'bikira-maria'],
    season: 'Majilio / Advent',
    voices: 'SATB',
    lyrics: `1. Malaika Gabrieli alitumwa na Mungu,
Mjini Nazareti kwa Bikira Maria;
Akamtolea salamu akisema:
Salamu uliyejaa neema, Bwana yu nawe.`,
    sharingStatus: 'Public domain',
    downloadCount: 310,
    addedDate: '2024-11-28',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-17',
    title: 'O Come, O Come, Emmanuel',
    composer: '15th Century Franciscan Hymn',
    language: 'English',
    categories: ['majilio'],
    season: 'Majilio / Advent',
    voices: 'SATB',
    lyrics: `1. O come, O come, Emmanuel,
And ransom captive Israel,
That mourns in lonely exile here,
Until the Son of God appear.

Refrain:
Rejoice! Rejoice! Emmanuel
Shall come to thee, O Israel.`,
    sharingStatus: 'Public domain',
    downloadCount: 450,
    addedDate: '2024-11-15',
    hasAudio: true
  },
  {
    id: 'lib-18',
    title: 'Rorate Caeli Desuper',
    composer: 'Gregorian Chant',
    language: 'Latin',
    categories: ['majilio'],
    season: 'Majilio / Advent',
    voices: 'Unison',
    lyrics: `Rorate caeli desuper, et nubes pluant iustum.
Ne irascaris Domine, ne ultra memineris iniquitatis:
ecce civitas Sancti facta est deserta:
Sion deserta facta est: Ierusalem desolata est.`,
    sharingStatus: 'Public domain',
    downloadCount: 195,
    addedDate: '2024-12-05',
    hasAudio: true
  },

  // 7. NOELI (Christmas)
  {
    id: 'lib-19',
    title: 'Usiku Mtakatifu (Silent Night)',
    composer: 'Franz Xaver Gruber (1787–1863)',
    language: 'Kiswahili',
    categories: ['noeli'],
    season: 'Noeli / Christmas',
    voices: 'SATB',
    lyrics: `1. Usiku mtakatifu, usiku wa heri!
Kimya kikuu kimetanda kote,
Bikira mama anakesha peke,
Mtoto mchanga amelala vema,
Lala salama mbinguni,
Lala salama mwema.`,
    sharingStatus: 'Public domain',
    downloadCount: 620,
    addedDate: '2024-12-10',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-20',
    title: 'Hark! The Herald Angels Sing',
    composer: 'Felix Mendelssohn (1809–1847)',
    language: 'English',
    categories: ['noeli'],
    season: 'Noeli / Christmas',
    voices: 'SATB',
    lyrics: `1. Hark! the herald angels sing,
"Glory to the newborn King;
Peace on earth, and mercy mild,
God and sinners reconciled!"
Joyful, all ye nations rise,
Join the triumph of the skies;
With the angelic host proclaim,
"Christ is born in Bethlehem!"`,
    sharingStatus: 'Public domain',
    downloadCount: 512,
    addedDate: '2024-12-08',
    hasAudio: true
  },
  {
    id: 'lib-21',
    title: 'Mtoto Yesu Kazaliwa',
    composer: 'Fr. G. Shengena',
    language: 'Kiswahili',
    categories: ['noeli'],
    season: 'Noeli / Christmas',
    voices: 'SATB',
    lyrics: `1. Mtoto Yesu kazaliwa leo mjini Bethlehemu,
Wachungaji wanakimbia kumwona mkombozi;
Malaika mbinguni wanaimba: Utukufu kwa Mungu juu,
Na amani duniani kwa watu wenye mapenzi mema.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Fr. G. Shengena',
    permissionDate: '2024-12-01',
    downloadCount: 340,
    addedDate: '2024-12-12',
    solfaNotes: true,
    hasAudio: true
  },

  // 8. KWARESIMA (Lent)
  {
    id: 'lib-22',
    title: 'Bwana Unirehemu',
    composer: 'St. Monica Choir Repertoire',
    language: 'Kiswahili',
    categories: ['kwaresima'],
    season: 'Kwaresima / Lent',
    voices: 'SATB',
    lyrics: `1. Bwana unirehemu, sawasawa na fadhili zako;
Kiasi cha wingi wa rehema zako,
Uyafute makosa yangu yote;
Unioshe kabisa na uovu wangu,
Unitakase na dhambi zangu.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'St. Monica Parish Liturgy Committee',
    permissionDate: '2024-02-10',
    downloadCount: 430,
    addedDate: '2024-02-14',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-23',
    title: 'Stabat Mater Dolorosa',
    composer: 'Traditional 13th Century Hymn',
    language: 'Latin',
    categories: ['kwaresima', 'bikira-maria'],
    season: 'Kwaresima / Lent',
    voices: 'SATB',
    lyrics: `Stabat mater dolorosa
Iuxta crucem lacrimosa,
Dum pendebat Filius.

Cuius animam gementem,
Contristatam et dolentem
Pertransivit gladius.`,
    sharingStatus: 'Public domain',
    downloadCount: 298,
    addedDate: '2024-03-01',
    hasAudio: true
  },
  {
    id: 'lib-24',
    title: 'Msalaba wa Yesu',
    composer: 'Traditional Lenten Hymn',
    language: 'Kiswahili',
    categories: ['kwaresima'],
    season: 'Kwaresima / Lent',
    voices: 'SATB',
    lyrics: `1. Msalaba wa Yesu, utukufu wangu,
Juu yake alikufa Mwokozi wa ulimwengu;
Damu yake azizi ilitiririka,
Kutuokoa sisi kutoka katika utumwa.`,
    sharingStatus: 'Public domain',
    downloadCount: 275,
    addedDate: '2024-02-20',
    solfaNotes: true,
    hasAudio: false
  },

  // 9. PASAKA (Easter)
  {
    id: 'lib-25',
    title: 'Kristo Amefufuka Aleluya',
    composer: 'Fr. C. Temba',
    language: 'Kiswahili',
    categories: ['pasaka'],
    season: 'Pasaka / Easter',
    voices: 'SATB',
    lyrics: `1. Kristo amefufuka, kaburi li wazi,
Mauti imeshindwa, uzima umeshinda;
Aleluya, aleluya, pigeni makofi,
Mwokozi wetu yu hai milele na milele!

Kiitikio:
Huu ndio siku aliyoifanya Bwana,
Tushangilie na kuifurahia;
Aleluya, aleluya,
Kristo amefufuka kweli kweli!`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Fr. C. Temba',
    permissionDate: '2025-03-25',
    downloadCount: 480,
    addedDate: '2025-04-01',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-26',
    title: 'Victimae Paschali Laudes',
    composer: 'Wipo of Burgundy (c. 995–1048)',
    language: 'Latin',
    categories: ['pasaka'],
    season: 'Pasaka / Easter',
    voices: 'SATB',
    lyrics: `Victimae paschali laudes
immolent Christiani.
Agnus redemit oves:
Christus innocens Patri
reconciliavit peccatores.

Mors et vita duello
conflixere mirando:
dux vitae mortuus,
regnat vivus.`,
    sharingStatus: 'Public domain',
    downloadCount: 330,
    addedDate: '2024-03-30',
    hasAudio: true
  },

  // 10. BIKIRA MARIA (Mary)
  {
    id: 'lib-27',
    title: 'Ave Maria',
    composer: 'Jacques Arcadelt (1507–1568)',
    language: 'Latin',
    categories: ['bikira-maria'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `Ave Maria, gratia plena,
Dominus tecum;
benedicta tu in mulieribus,
et benedictus fructus ventris tui, Iesus.

Sancta Maria, Mater Dei,
ora pro nobis peccatoribus,
nunc et in hora mortis nostrae. Amen.`,
    sharingStatus: 'Public domain',
    downloadCount: 670,
    addedDate: '2024-05-01',
    hasAudio: true
  },
  {
    id: 'lib-28',
    title: 'Salamu Maria Uliyejaa Neema',
    composer: 'Fr. G. Shengena',
    language: 'Kiswahili',
    categories: ['bikira-maria'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Salamu Maria, uliyejaa neema,
Bwana yu nawe katika wanawake wote;
Umebarikiwa kuliko wote duniani,
Na mzao wa tumbo lako Yesu amebarikiwa.

Kiitikio:
Mtakatifu Maria, Mama wa Mungu wetu,
Utuombee sisi wenye dhambi;
Sasa na saa ya kufa kwetu,
Amina, amina, aleluya.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Fr. G. Shengena',
    permissionDate: '2024-08-14',
    downloadCount: 520,
    addedDate: '2024-08-15',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-29',
    title: 'Bikira Mama Mwema',
    composer: 'Traditional Swahili Marian Hymn',
    language: 'Kiswahili',
    categories: ['bikira-maria'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Bikira Mama mwema, usikilize sala,
Tunayokulilia hapa bondeni pa machozi;
Tazama watoto wako tunaotaabika,
Utuombee kwa mwanao atuhurumie.`,
    sharingStatus: 'Public domain',
    downloadCount: 390,
    addedDate: '2024-06-20',
    solfaNotes: true,
    hasAudio: false
  },

  // 11. ZABURI (Psalms)
  {
    id: 'lib-30',
    title: 'Ee Bwana Fadhili Zako',
    composer: 'Zaburi 89 / St. Monica Liturgy',
    language: 'Kiswahili',
    categories: ['zaburi'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `Mwitikio:
Fadhili za Bwana nitaziimba milele,
Kwa kinywa changu nitaijulisha uaminifu wako kizazi hata kizazi.

1. Nilisema: Fadhili zitajengwa milele,
Katika mbingu utauthibitisha uaminifu wako;
Nimefanya agano na mteule wangu,
Nimemwapia Daudi mtumishi wangu.`,
    sharingStatus: 'Public domain',
    downloadCount: 240,
    addedDate: '2024-09-02',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-31',
    title: 'Bwana Ndiye Mchungaji Wangu (Zaburi 23)',
    composer: 'Fr. Kayetta',
    language: 'Kiswahili',
    categories: ['zaburi', 'komunyo'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `Mwitikio:
Bwana ndiye mchungaji wangu, sitapungukiwa na kitu.

1. Katika malisho ya majani mabichi hunilaza,
Kando ya maji ya utulivu huniongoza;
Hunihuisha nafsi yangu,
Huniongoza katika njia za haki kwa ajili ya jina lake.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Fr. Kayetta Heritage Archive',
    permissionDate: '2024-10-18',
    downloadCount: 460,
    addedDate: '2024-11-01',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-32',
    title: 'Heri Taifa Linalomcha Mungu (Zaburi 33)',
    composer: 'Liturgical Choir Nakuru',
    language: 'Kiswahili',
    categories: ['zaburi', 'shukrani'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `Mwitikio:
Heri taifa ambalo Bwana ni Mungu wao,
Watu aliowachagua kuwa urithi wake.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Nakuru Deanery Liturgical Music Board',
    permissionDate: '2025-01-20',
    downloadCount: 180,
    addedDate: '2025-02-10',
    solfaNotes: true,
    hasAudio: false
  },

  // 12. SHUKRANI (Thanksgiving)
  {
    id: 'lib-33',
    title: 'Asante Bwana kwa Neema Yako',
    composer: 'Traditional Swahili Choir Hymn',
    language: 'Kiswahili',
    categories: ['shukrani'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Asante Bwana kwa neema yako,
Uliyotujalia maishani mwetu;
Umetupa uzima, umetupa amani,
Tunakushukuru kwa moyo wote.`,
    sharingStatus: 'Public domain',
    downloadCount: 310,
    addedDate: '2024-08-12',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-34',
    title: 'Now Thank We All Our God',
    composer: 'Johann Crüger (1598–1662)',
    language: 'English',
    categories: ['shukrani'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Now thank we all our God,
With heart and hands and voices,
Who wondrous things hath done,
In Whom this world rejoices;
Who from our mother's arms
Hath blessed us on our way
With countless gifts of love,
And still is ours to-day.`,
    sharingStatus: 'Public domain',
    downloadCount: 290,
    addedDate: '2024-05-14',
    hasAudio: true
  },

  // 13. NDOA (Weddings)
  {
    id: 'lib-35',
    title: 'Kwenye Harusi ya Kana',
    composer: 'Fr. G. Shengena',
    language: 'Kiswahili',
    categories: ['ndoa'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Kwenye harusi ya Kana kule Galilaya,
Yesu na mama yake walialikwa;
Divai ilipokwisha mama akamwambia:
Hawana divai, wafanyie muujiza.

Kiitikio:
Wabariki Bwana maharusi hawa,
Wape upendo, amani na furaha;
Wakamilishe agano lao takatifu,
Maisha yao yote yawe ya sifa.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Fr. G. Shengena',
    permissionDate: '2024-07-29',
    downloadCount: 420,
    addedDate: '2024-08-10',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-36',
    title: 'Upendo wa Kweli',
    composer: 'Traditional Wedding Anthem',
    language: 'Kiswahili',
    categories: ['ndoa'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Upendo huvumilia, upendo hufadhili,
Hautii wivu wala haujivuni;
Haukoheri mbele ya uovu,
Bali hufurahia kweli daima.`,
    sharingStatus: 'Public domain',
    downloadCount: 235,
    addedDate: '2024-09-18',
    solfaNotes: true,
    hasAudio: false
  },

  // 14. UBATIZO (Baptism) - Gentle motif
  {
    id: 'lib-37',
    title: 'Maji ya Uzima',
    composer: 'Traditional Catholic Liturgy',
    language: 'Kiswahili',
    categories: ['ubatizo'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Maji ya uzima yamebana leo,
Kutoka hekaluni mwa Mungu Mkuu;
Wote watakaoguswa na maji haya,
Watapata wokovu na amani tele.

Kiitikio:
Nimekuosha kwa jina la Baba,
Na la Mwana na la Roho Mtakatifu;
Uwe mwana wa nuru, mwana wa Mungu,
Utembee katika kweli milele.`,
    sharingStatus: 'Public domain',
    downloadCount: 195,
    addedDate: '2024-06-08',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-38',
    title: 'Sisi Ni Wana wa Mungu',
    composer: 'St. Monica Parish Choir',
    language: 'Kiswahili',
    categories: ['ubatizo'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Kwa ubatizo tumefanywa wana wa Mungu,
Tumeingizwa katika mwili wa Kristo;
Tuishi kama watoto wa nuru,
Tukikataa uovu na giza lote.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'St. Monica Choir Executive',
    permissionDate: '2024-05-30',
    downloadCount: 140,
    addedDate: '2024-06-15',
    solfaNotes: true,
    hasAudio: false
  },

  // 15. MAZISHI (Funeral) - Gentle memorial light motif
  {
    id: 'lib-39',
    title: 'Raha ya Milele Uwape Ee Bwana (Requiem Aeternam)',
    composer: 'Gregorian Chant / Swahili Translation',
    language: 'Kiswahili',
    categories: ['mazishi'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `Mwitikio:
Raha ya milele uwape Ee Bwana,
Na mwanga wa milele uwaangazie.

1. Wewe wastahili sifa, Ee Mungu katika Sayuni,
Kwako wewe nadhiri zitatimizwa kule Yerusalemu;
Wewe usikiaye sala zetu,
Watu wote wenye mwili watakujia.`,
    sharingStatus: 'Public domain',
    downloadCount: 380,
    addedDate: '2024-04-18',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-40',
    title: 'Requiem Aeternam (Latin Choral)',
    composer: 'Traditional Gregorian Requiem',
    language: 'Latin',
    categories: ['mazishi'],
    season: 'Kawaida / Ordinary',
    voices: 'Unison',
    lyrics: `Requiem aeternam dona eis, Domine:
et lux perpetua luceat eis.
Te decet hymnus Deus, in Sion,
et tibi reddetur votum in Ierusalem:
exaudi orationem meam,
ad te omnis caro veniet.`,
    sharingStatus: 'Public domain',
    downloadCount: 260,
    addedDate: '2024-05-02',
    hasAudio: true
  },
  {
    id: 'lib-41',
    title: 'Nuru ya Milele Iwaangazie',
    composer: 'Traditional Liturgical Choir',
    language: 'Kiswahili',
    categories: ['mazishi'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Nuru ya milele iwaangazie watumishi wako,
Pamoja na watakatifu wako milele;
Kwa kuwa wewe ni mwenye huruma,
Uwasamehe makosa yao yote.`,
    sharingStatus: 'Public domain',
    downloadCount: 170,
    addedDate: '2024-07-11',
    solfaNotes: true,
    hasAudio: false
  },

  // 16. ROHO MTAKATIFU (Holy Spirit)
  {
    id: 'lib-42',
    title: 'Veni Creator Spiritus',
    composer: 'Rabanus Maurus (776–856)',
    language: 'Latin',
    categories: ['roho-mtakatifu'],
    season: 'Pentekoste / Pentecost',
    voices: 'SATB',
    lyrics: `Veni, Creator Spiritus,
mentes tuorum visita,
imple superna gratia
quae tu creasti pectora.

Qui diceris Paraclitus,
altissimi donum Dei,
fons vivus, ignis, caritas,
et spiritalis unctio.`,
    sharingStatus: 'Public domain',
    downloadCount: 420,
    addedDate: '2024-05-20',
    hasAudio: true
  },
  {
    id: 'lib-43',
    title: 'Roho Mtakatifu Shuka',
    composer: 'Fr. Kayetta',
    language: 'Kiswahili',
    categories: ['roho-mtakatifu'],
    season: 'Pentekoste / Pentecost',
    voices: 'SATB',
    lyrics: `1. Roho Mtakatifu shuka, ujaze mioyo yetu,
Uwashe ndani yetu moto wa upendo wako;
Tuma Roho wako nazo zitafanyika upya,
Nawe utaufanya upya uso wa nchi yote.

Kiitikio:
Shuka Ee Roho, shuka Mfariji,
Utujaze na karama zako saba;
Utupe hekima, utupe akili,
Utuongoze katika safari ya uzima.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Fr. Kayetta Heritage Archive',
    permissionDate: '2024-05-10',
    downloadCount: 510,
    addedDate: '2024-05-18',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-44',
    title: 'Njoo Roho Mfariji',
    composer: 'Traditional Pentecost Hymn',
    language: 'Kiswahili',
    categories: ['roho-mtakatifu'],
    season: 'Pentekoste / Pentecost',
    voices: 'SATB',
    lyrics: `1. Njoo Roho Mfariji, Roho wa ukweli,
Toka mbinguni mwanga wako tuangazie;
Njoo Baba wa maskini, njoo mtoa vipaji,
Njoo mwanga wa mioyo, mgeni mwema wa roho.`,
    sharingStatus: 'Public domain',
    downloadCount: 305,
    addedDate: '2024-05-25',
    solfaNotes: true,
    hasAudio: false
  },

  // Extra Vernacular Hymns for Kenya Choirs
  {
    id: 'lib-45',
    title: 'Ngai Witũ Mũtheru (God Our Father)',
    composer: 'Traditional Kikuyu Catholic Hymn',
    language: 'Kikuyu',
    categories: ['kuingia', 'shukrani'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Ngai witũ mũtheru, twagũkenera rĩu,
Gĩkĩ nĩ kĩhĩĩro gĩaku kĩtheru;
Tũgakũinĩra nyĩmbo cia ngatho,
Wĩ Mwathani witũ wa tene na tene.`,
    sharingStatus: 'Public domain',
    downloadCount: 220,
    addedDate: '2024-09-24',
    solfaNotes: true,
    hasAudio: false
  },
  {
    id: 'lib-46',
    title: 'Ruoth Nyasaye Maler (Holy Lord God)',
    composer: 'Traditional Luo Catholic Hymn',
    language: 'Dholuo',
    categories: ['komunyo', 'tafakari'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Ruoth Nyasaye maler, bi e chunywa,
Makate mar ngima ma oa e polo;
Walamo nyingi maler pile ka pile,
Konywa watim gigo mamiyo imor.`,
    sharingStatus: 'Public domain',
    downloadCount: 190,
    addedDate: '2024-10-12',
    solfaNotes: true,
    hasAudio: false
  },
  {
    id: 'lib-47',
    title: 'Toror Kamuktaindet (High is God)',
    composer: 'Traditional Kalenjin Catholic Hymn',
    language: 'Kalenjin',
    categories: ['shukrani', 'kutoka'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Toror Kamuktaindet ne bo kipsoiywet,
Kitorori kainyet nyin ne tilil;
Kagoyo amutik ak sobon ne bo koigen,
Icheget tugul che kosai kokany.`,
    sharingStatus: 'Public domain',
    downloadCount: 165,
    addedDate: '2024-11-04',
    solfaNotes: true,
    hasAudio: false
  },
  {
    id: 'lib-48',
    title: 'Machozi ya Imani (Full SATB Master)',
    composer: 'Atebe Mark T. (Recorded at Khakstudio)',
    language: 'Kiswahili',
    categories: ['tafakari', 'komunyo'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Machozi yangu ya imani ninayaleta kwako,
Bwana wangu unifariji wakati wa dhiki;
Moyo wangu unakutamani kama ayala atamanivyo maji,
Nisikilize unijibu sala yangu.`,
    sharingStatus: 'Shared with permission',
    permissionGivenBy: 'Atebe Mark T. & St. Monica Choir',
    permissionDate: '2024-06-01',
    downloadCount: 840,
    addedDate: '2024-06-15',
    solfaNotes: true,
    hasAudio: true
  },
  {
    id: 'lib-49',
    title: 'Tantum Ergo Sacramentum',
    composer: 'St. Thomas Aquinas / Gregorian Chant',
    language: 'Latin',
    categories: ['komunyo', 'tafakari'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Tantum ergo Sacramentum
Veneremur cernui:
Et antiquum documentum
Novo cedat ritui:
Praestet fides supplementum
Sensuum defectui.

2. Genitori, Genitoque
Laus et iubilatio,
Salus, honor, virtus quoque
Sit et benedictio:
Procedenti ab utroque
Compar sit laudatio. Amen.`,
    sharingStatus: 'Public domain',
    downloadCount: 310,
    addedDate: '2024-11-10',
    solfaNotes: true,
    hasAudio: false
  },
  {
    id: 'lib-50',
    title: 'Ave Verum Corpus',
    composer: 'Wolfgang Amadeus Mozart (K. 618)',
    language: 'Latin',
    categories: ['komunyo', 'tafakari'],
    season: 'Kwaresima / Lent',
    voices: 'SATB',
    lyrics: `Ave verum Corpus natum
De Maria Virgine:
Vere passum, immolatum
In cruce pro homine:
Cujus latus perforatum
Unda fluxit et sanguine:
Esto nobis praegustatum
In mortis examine.`,
    sharingStatus: 'Public domain',
    downloadCount: 420,
    addedDate: '2024-11-15',
    solfaNotes: true,
    hasAudio: false
  },
  {
    id: 'lib-51',
    title: 'Msalaba wa Bwana Wangu',
    composer: 'Traditional Swahili Catholic Lenten Hymn',
    language: 'Kiswahili',
    categories: ['tafakari'],
    season: 'Kwaresima / Lent',
    voices: 'SATB',
    lyrics: `1. Msalaba wa Bwana wangu, ndio wokovu wangu,
Pale Yesu aliponifia kwa upendo mkuu;
Ee Bwana unihurumie, ninatubu dhambi zangu,
Nijalie neema ya kusimama imara katika imani.`,
    sharingStatus: 'Public domain',
    downloadCount: 260,
    addedDate: '2024-11-20',
    solfaNotes: true,
    hasAudio: false
  },
  {
    id: 'lib-52',
    title: 'Kaa Nami Bwana (Abide with Me)',
    composer: 'William H. Monk / Henry F. Lyte (Swahili)',
    language: 'Kiswahili',
    categories: ['kutoka', 'tafakari'],
    season: 'Kawaida / Ordinary',
    voices: 'SATB',
    lyrics: `1. Kaa nami, ni usiku tena,
Giza linaingia, Bwana kaa nami;
Msaada mwingine sina,
Nakuomba mwokozi, ukae nami.

2. Maisha yanapita haraka sana,
Mambo ya dunia hii yatatoweka;
Wewe usiyebadilika kamwe,
Kaa nami Bwana katika maisha yangu yote.`,
    sharingStatus: 'Public domain',
    downloadCount: 385,
    addedDate: '2024-11-28',
    solfaNotes: true,
    hasAudio: false
  }
];
