export interface Song {
  id: string;
  title: string;
  titleSwahili: string;
  album: string;
  composer: string;
  year: number;
  season: 'Ordinary Time' | 'Advent' | 'Lent' | 'Easter' | 'Marian' | 'Patronal';
  seasonSwahili: string;
  partOfMass: 'Entrance' | 'Kyrie & Gloria' | 'Offertory' | 'Communion' | 'Meditation' | 'Recessional';
  partOfMassSwahili: string;
  language: string;
  voicing: string;
  musicalKey: string;
  duration: string;
  audioPreviewUrl: string;
  sheetMusicAvailable: boolean;
  scorePriceKes: number;
  lyricsSwahili: string[];
  lyricsEnglish: string[];
  waveformPeaks: number[];
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
  songs: Song[];
}

export interface ServiceItem {
  id: string;
  title: string;
  titleSw: string;
  category: string;
  tagline: string;
  taglineSw: string;
  description: string;
  descriptionSw: string;
  whatsIncluded: string[];
  sampleSongs: string[];
  startingPriceKes: number;
}

export interface ProductItem {
  id: string;
  name: string;
  nameSw: string;
  type: 'digital_album' | 'physical_cd' | 'usb' | 'sheet_music' | 'merchandise';
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
  category: string;
  entryType: 'Free Entry' | 'Tickets' | 'Liturgical Mass';
}

export const CHOIR_STATS = {
  membersCount: 52,
  yearsServing: 14,
  repertoireCount: 140,
  albumsReleased: 3,
  parish: "St. Monica Catholic Church, SEC 58 Nakuru",
  diocese: "Catholic Diocese of Nakuru",
  patronSaint: "St. Monica",
  feastDay: "27 August",
};

export const SONGS_CATALOG: Song[] = [
  {
    id: "song-1",
    title: "Mtakatifu Monica Mama Mwema",
    titleSwahili: "Mtakatifu Monica Mama Mwema",
    album: "Mtakatifu Monica Mama Mwema (Vol. III)",
    composer: "Polycarp Ochieng",
    year: 2026,
    season: "Patronal",
    seasonSwahili: "Sikukuu ya Somo (St. Monica)",
    partOfMass: "Entrance",
    partOfMassSwahili: "Wimbo wa Mwanzo",
    language: "Kiswahili",
    voicing: "SATB + Kayamba na Kinanda",
    musicalKey: "F Major",
    duration: "4:18",
    audioPreviewUrl: "preview_monica.mp3",
    sheetMusicAvailable: true,
    scorePriceKes: 300,
    lyricsSwahili: [
      "1. Mtakatifu Monica mama yetu mwema, uliyelia kwa machozi ya imani,",
      "Ukamwombea mwanao Augustino, hadi akamrudia Mungu wetu.",
      "Kiitikio: Ee Mtakatifu Monica, utuombee kwa Mungu Baba,",
      "Tupate subira na upendo thabiti, tuimbe sifa zake milele yote.",
      "2. Wewe ni kielelezo cha sala isiyokoma, uliyenawiri katika matumaini,",
      "Tufundishe kulea kwa njia ya unyenyekevu, na kutumikia Kanisa la Kristo."
    ],
    lyricsEnglish: [
      "1. Saint Monica, our gracious mother, who wept with faithful tears,",
      "You interceded for your son Augustine until he returned to our God.",
      "Refrain: O Saint Monica, pray for us to God the Father,",
      "That we may receive patience and steadfast love, to sing His praises forevermore.",
      "2. You are an exemplar of unceasing prayer, flourishing in holy hope,",
      "Teach us to nurture with humility and to serve Christ's Church with joyful song."
    ],
    waveformPeaks: [35, 60, 45, 80, 95, 65, 85, 100, 75, 55, 90, 70, 85, 95, 60, 40, 70, 85, 90, 50, 65, 80, 45, 30]
  },
  {
    id: "song-2",
    title: "Misa ya Mtakatifu Fransisko (Kyrie na Gloria)",
    titleSwahili: "Misa ya Mtakatifu Fransisko",
    album: "Misa ya Ekaristi Takatifu",
    composer: "Fr. John Fernandes (Arr. P. Ochieng)",
    year: 2025,
    season: "Ordinary Time",
    seasonSwahili: "Wakati wa Kawaida",
    partOfMass: "Kyrie & Gloria",
    partOfMassSwahili: "Bwana Utuhurumie na Utukufu",
    language: "Kiswahili",
    voicing: "SATB a cappella",
    musicalKey: "D Minor",
    duration: "3:52",
    audioPreviewUrl: "preview_kyrie.mp3",
    sheetMusicAvailable: true,
    scorePriceKes: 350,
    lyricsSwahili: [
      "Bwana utuhurumie (Bwana utuhurumie), Kristo utuhurumie,",
      "Bwana utuhurumie, utusamehe makosa yetu.",
      "Utukufu kwa Mungu juu mbinguni, na amani duniani kwa watu wa mapenzi mema."
    ],
    lyricsEnglish: [
      "Lord have mercy, Christ have mercy, Lord have mercy upon us,",
      "Forgive us our sins and purify our hearts.",
      "Glory to God in the highest, and on earth peace to people of good will."
    ],
    waveformPeaks: [25, 45, 70, 85, 60, 40, 75, 90, 80, 60, 45, 65, 80, 90, 70, 50, 40, 65, 85, 70, 50, 35, 20, 15]
  },
  {
    id: "song-3",
    title: "Tazameni Mungu Wetu Yuaja",
    titleSwahili: "Tazameni Mungu Wetu Yuaja",
    album: "Sauti za SEC 58",
    composer: "Bernard Mukasa",
    year: 2024,
    season: "Advent",
    seasonSwahili: "Majilio",
    partOfMass: "Entrance",
    partOfMassSwahili: "Wimbo wa Mwanzo",
    language: "Kiswahili",
    voicing: "SATB + Kayamba na Filimbi",
    musicalKey: "G Major",
    duration: "4:05",
    audioPreviewUrl: "preview_advent.mp3",
    sheetMusicAvailable: true,
    scorePriceKes: 250,
    lyricsSwahili: [
      "Tazameni Mungu wetu yuaja kuwakomboa watu wake,",
      "Furahini enyi mataifa, farijikeni maana wokovu u karibu.",
      "Andeni njia ya Bwana, nyoosheni mapito yake nyikani."
    ],
    lyricsEnglish: [
      "Behold our God comes to redeem His people,",
      "Rejoice O nations, be comforted for salvation is near at hand.",
      "Prepare the way of the Lord, make straight His paths in the desert."
    ],
    waveformPeaks: [40, 60, 75, 90, 85, 65, 50, 80, 95, 85, 70, 90, 100, 80, 60, 45, 65, 80, 95, 70, 50, 40, 30, 25]
  },
  {
    id: "song-4",
    title: "Sadaka Yangu Hii Bwana",
    titleSwahili: "Sadaka Yangu Hii Bwana",
    album: "Mtakatifu Monica Mama Mwema (Vol. III)",
    composer: "Stephen M. Mwangi",
    year: 2026,
    season: "Ordinary Time",
    seasonSwahili: "Wakati wa Kawaida",
    partOfMass: "Offertory",
    partOfMassSwahili: "Wimbo wa Sadaka",
    language: "Kiswahili",
    voicing: "SATB + Kinanda na Ngoma",
    musicalKey: "E-flat Major",
    duration: "4:32",
    audioPreviewUrl: "preview_sadaka.mp3",
    sheetMusicAvailable: true,
    scorePriceKes: 300,
    lyricsSwahili: [
      "Sadaka yangu hii Bwana, naileta kwako kwa unyenyekevu,",
      "Mkate na divai mazao ya mashamba yetu,",
      "Pamoja na maisha yetu, pokea Baba utubariki."
    ],
    lyricsEnglish: [
      "This offering of mine, Lord, I bring before You in humility,",
      "Bread and wine, the fruits of our fields and labors,",
      "Together with our lives, receive them, Father, and bless us."
    ],
    waveformPeaks: [30, 50, 65, 80, 90, 75, 60, 85, 95, 80, 65, 75, 90, 85, 70, 55, 65, 80, 75, 60, 45, 35, 25, 20]
  },
  {
    id: "song-5",
    title: "Ee Mkate wa Mbingu (Eucharistic Hymn)",
    titleSwahili: "Ee Mkate wa Mbingu",
    album: "Misa ya Ekaristi Takatifu",
    composer: "Polycarp Ochieng",
    year: 2025,
    season: "Ordinary Time",
    seasonSwahili: "Wakati wa Kawaida",
    partOfMass: "Communion",
    partOfMassSwahili: "Wimbo wa Komunyo",
    language: "Kiswahili na Kilatini",
    voicing: "SATB + Solo Tenor",
    musicalKey: "A-flat Major",
    duration: "5:12",
    audioPreviewUrl: "preview_communion.mp3",
    sheetMusicAvailable: true,
    scorePriceKes: 400,
    lyricsSwahili: [
      "Ee Mkate wa Mbingu, chakula cha uzima wa milele,",
      "Uliyeshuka toka mbinguni ili kila anayekula asife kamwe.",
      "Panis angelicus fit panis hominum; dat panis coelicus figuris terminum."
    ],
    lyricsEnglish: [
      "O Bread of Heaven, nourishment of everlasting life,",
      "Who descended from on high so that whoever eats shall never die.",
      "The angelic bread becomes the bread of mankind; the heavenly bread puts an end to prefigurations."
    ],
    waveformPeaks: [20, 35, 50, 65, 75, 85, 95, 90, 80, 70, 60, 75, 90, 85, 70, 55, 40, 60, 75, 65, 50, 35, 25, 15]
  },
  {
    id: "song-6",
    title: "Kristo Amefufuka Aleluya (Easter Anthem)",
    titleSwahili: "Kristo Amefufuka Aleluya",
    album: "Mtakatifu Monica Mama Mwema (Vol. III)",
    composer: "Charles Opondo",
    year: 2026,
    season: "Easter",
    seasonSwahili: "Pasaka",
    partOfMass: "Recessional",
    partOfMassSwahili: "Wimbo wa Kutoka",
    language: "Kiswahili",
    voicing: "SATB + Baragumu na Matari",
    musicalKey: "C Major",
    duration: "4:48",
    audioPreviewUrl: "preview_easter.mp3",
    sheetMusicAvailable: true,
    scorePriceKes: 350,
    lyricsSwahili: [
      "Kristo amefufuka kutoka kwa wafu, aleluya! Kifo kimeshindwa kwa ushindi wake!",
      "Shangilieni enyi mbingu, imbeni enyi nchi yote, Mwokozi wetu anatawala milele!"
    ],
    lyricsEnglish: [
      "Christ is risen from the dead, alleluia! Death has been swallowed up in His holy victory!",
      "Rejoice O heavens, sing O whole earth, our Savior reigns forever and ever!"
    ],
    waveformPeaks: [50, 70, 85, 100, 95, 85, 75, 90, 100, 95, 85, 90, 100, 90, 80, 65, 80, 95, 90, 75, 60, 45, 35, 25]
  }
];

export const ALBUMS_CATALOG: Album[] = [
  {
    id: "alb-3",
    title: "Mtakatifu Monica Mama Mwema (Vol. III)",
    releaseYear: 2026,
    trackCount: 12,
    coverImage: "choir_singing_moment",
    priceKes: 500,
    description: "The hallmark 2026 release celebrating 14 years of choral ministry at Section 58 Nakuru. Features original liturgical compositions by Polycarp Ochieng and choral arrangements dedicated to St. Monica.",
    descriptionSw: "Toleo letu la tatu la mwaka 2026 likiadhimisha miaka 14 ya utume wa kwaya hapa SEC 58 Nakuru. Lina nyimbo asilia za kiliturujia na tungo maalum kwa heshima ya Mtakatifu Monica.",
    songs: [SONGS_CATALOG[0], SONGS_CATALOG[3], SONGS_CATALOG[5]]
  },
  {
    id: "alb-2",
    title: "Misa ya Ekaristi Takatifu (Vol. II)",
    releaseYear: 2024,
    trackCount: 10,
    coverImage: "sheet_music_hymnal",
    priceKes: 450,
    description: "A complete Sunday Mass choral setting including Kyrie, Gloria, Credo, Sanctus, and Agnus Dei, blended with revered Kenyan Eucharistic hymns.",
    descriptionSw: "Mpangilio kamili wa nyimbo za Misa Takatifu ya Jumapili ikiwemo Bwana Utuhurumie, Utukufu, Nasadiki, Mtakatifu, na Mwanakondoo wa Mungu.",
    songs: [SONGS_CATALOG[1], SONGS_CATALOG[4]]
  },
  {
    id: "alb-1",
    title: "Sauti za SEC 58 (Vol. I)",
    releaseYear: 2021,
    trackCount: 14,
    coverImage: "nakuru_parish_cathedral",
    priceKes: 400,
    description: "The debut studio album featuring classical Kiswahili choral hymns by Bernard Mukasa, Fr. Fernandes, and regional sacred melodies.",
    descriptionSw: "Albamu ya kwanza iliyorekodiwa studio ikijumuisha tungo maarufu za kwaya ya Kiswahili na nyimbo za kitamaduni za kusifu.",
    songs: [SONGS_CATALOG[2]]
  }
];

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: "serv-mass",
    title: "Liturgical Sunday & Feast Masses",
    titleSw: "Misa za Jumapili na Sikukuu",
    category: "Liturgy",
    tagline: "Reverent, disciplined sacred choral worship for the Holy Sacrifice of the Mass.",
    taglineSw: "Ibada takatifu ya Misa kwa unyenyekevu, nidhamu na utulivu wa kiroho.",
    description: "Full four-part SATB choral accompaniment for Sunday parish liturgies, patronal feast days, priestly ordinations, confirmations, and diocesan celebrations across the Nakuru diocese and beyond.",
    descriptionSw: "Huduma kamili ya uimbaji wa sauti nne (SATB) kwa Misa za kawaida, sikukuu za vigango, daraja takatifu ya upadre, kipaimara, na sherehe za kijimbo.",
    whatsIncluded: [
      "Full SATB choir (25–40 choristers)",
      "Repertoire tailored to liturgical season and lectionary readings",
      "Organ, kayamba, and percussion accompaniment",
      "Consultation on entrance, offertory, and communion hymns"
    ],
    sampleSongs: ["Mtakatifu Monica Mama Mwema", "Sadaka Yangu Hii Bwana"],
    startingPriceKes: 15000
  },
  {
    id: "serv-wedding",
    title: "Catholic Nuptial Masses & Weddings",
    titleSw: "Misa za Harusi na Ndoa Takatifu",
    category: "Sacrament",
    tagline: "Dignified, uplifting music for Holy Matrimony in the Catholic tradition.",
    taglineSw: "Muziki wa heshima na furaha ya kiroho kwa ajili ya Sakramenti ya Ndoa Takatifu.",
    description: "Personalized music consultation for Catholic couples. We guide you in selecting reverent entrance hymns, vows accompaniment, Psalm responses, offertory processions, signing of the registry, and joyful recessional anthems.",
    descriptionSw: "Ushauri maalum wa nyimbo za kiliturujia kwa maharusi Wakatoliki. Tunakusaidia kuteua nyimbo za kuingia, viapo, sadaka, kutia saini cheti cha ndoa, na kutoka.",
    whatsIncluded: [
      "Pre-wedding musical planning session with the Music Director",
      "Full SATB choir on wedding day",
      "Processional, registry signing, and recessional repertoire",
      "Optional bridal entry solo vocal arrangement"
    ],
    sampleSongs: ["Ave Maria (Arr. Nakuru)", "Upendo wa Mungu Wetu", "Mtakatifu Monica Mama Mwema"],
    startingPriceKes: 25000
  },
  {
    id: "serv-funeral",
    title: "Requiem Masses & Memorials",
    titleSw: "Misa za Mazishi na Kumbukumbu",
    category: "Memorial",
    tagline: "Comforting, prayerful sacred hymns honoring faithful departed in Christ.",
    taglineSw: "Nyimbo za faraja na matumaini ya ufufuko kumuombea mpendwa wetu aliyetutangulia.",
    description: "Reverent and comforting Catholic funeral liturgy. Songs of Christian hope, resurrection, and prayerful intercession to console grieving families and commend souls to God's eternal mercy.",
    descriptionSw: "Nyimbo za matumaini ya Kikristo na maombezi ya kumuaga mpendwa wetu kwa staha na sala za kikatoliki.",
    whatsIncluded: [
      "Choir ensemble in formal liturgical vestments",
      "Responsorial psalm and communion meditation anthems",
      "Graveside prayer hymns (Matawi, Sala za Mwisho)",
      "Punctual and reverent conduct"
    ],
    sampleSongs: ["Mikononi Mwako Bwana", "Nalifurahi Waliponiambia", "Mimi Ndimi Ufufuo na Uzima"],
    startingPriceKes: 18000
  },
  {
    id: "serv-concerts",
    title: "Sacred Choral Concerts & Festivals",
    titleSw: "Tamasha za Kwaya na Matamasha",
    category: "Performance",
    tagline: "Choral excellence, East African Catholic polyphony, and festival guest performances.",
    taglineSw: "Maonyesho ya ustadi wa sauti, nyimbo za kitamaduni za Kikristo na tamasha.",
    description: "St. Monica Choir Nakuru performs at national sacred music festivals, inter-parish choral competitions, and cultural celebrations, presenting rich Kiswahili compositions, Latin classics, and vibrant indigenous instrumentation.",
    descriptionSw: "Kushiriki katika matamasha ya kijimbo, kitaifa, na sherehe za kidini kote nchini Kenya na Afrika Mashariki.",
    whatsIncluded: [
      "Full concert repertoire set (45 to 90 minutes)",
      "Professional vocalists and instrumental rhythm section",
      "Printed concert programme inserts",
      "Sound coordination with parish audio technicians"
    ],
    sampleSongs: ["Kristo Amefufuka Aleluya", "Sauti za SEC 58 Anthem"],
    startingPriceKes: 30000
  },
  {
    id: "serv-training",
    title: "Voice Training & Conducting Workshops",
    titleSw: "Mafunzo ya Sauti na Uongozi wa Kwaya",
    category: "Education",
    tagline: "Empowering rural and parish choirs with sight-reading, vocal health, and conducting skills.",
    taglineSw: "Kujenga uwezo wa kwaya nyingine katika kusoma noti, usafi wa sauti na uelekezi.",
    description: "Tailored weekend training workshops delivered by Mwalimu Polycarp Ochieng and senior section coaches. Covering Solfa notation, staff notation, diaphragm breathing, choral diction, and liturgical selection guidelines.",
    descriptionSw: "Warsha za wikendi kwa waimbaji na walimu wa kwaya za vigango: usomaji wa maneno, kufuata noti za solfa, kupumua, na kuchagua nyimbo za liturujia.",
    whatsIncluded: [
      "2-day hands-on workshop at your parish",
      "Sheet music handouts and solfa notation primers",
      "Voice classification audit for all registered choristers",
      "Certificate of participation"
    ],
    sampleSongs: ["Sight-reading studies", "SATB polyphony exercises"],
    startingPriceKes: 20000
  }
];

export const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: "prod-digital-alb3",
    name: "Mtakatifu Monica Mama Mwema (Digital Album)",
    nameSw: "Albamu ya Kidijitali (Vol. III)",
    type: "digital_album",
    priceKes: 500,
    priceUsd: 4.00,
    description: "Instant high-bitrate MP3 & WAV audio download (12 full tracks) with printable digital liner notes and Kiswahili lyrics booklet.",
    descriptionSw: "Pakua albamu kamili yenye nyimbo 12 za ubora wa juu pamoja na kitabu cha maneno ya nyimbo (PDF).",
    image: "choir_singing_moment",
    badge: "Latest Release",
    downloadable: true
  },
  {
    id: "prod-usb-drive",
    name: "Deluxe Choral USB Card (Vol. I, II & III Complete)",
    nameSw: "Kadi ya USB yenye Albamu Zote 3",
    type: "usb",
    priceKes: 1000,
    priceUsd: 8.00,
    description: "Sleek wallet-sized USB card containing all 36 recorded choir tracks in studio master quality, rehearsal videos, and digital hymn sheet music.",
    descriptionSw: "Kadi ya USB inayotoshea pochi ikiwa na nyimbo zote 36 za albamu tatu, video za maandalizi, na noti za nyimbo.",
    image: "sheet_music_hymnal",
    badge: "Best Value",
    downloadable: false
  },
  {
    id: "prod-sheet-bundle",
    name: "St. Monica Sacred Score Bundle (10 Hymns PDF)",
    nameSw: "Kifurushi cha Noti za Kiliturujia (Noti 10)",
    type: "sheet_music",
    priceKes: 400,
    priceUsd: 3.20,
    description: "Complete SATB four-part vocal sheet music scores in PDF format, watermarked with buyer email, including solfa and staff notation.",
    descriptionSw: "Noti kamili za sauti nne (SATB) zenye solfa na stafu za nyimbo 10 za kiliturujia kwa ajili ya walimu wa kwaya.",
    image: "sheet_music_hymnal",
    badge: "For Choirmasters",
    downloadable: true
  },
  {
    id: "prod-choir-polo",
    name: "Official St. Monica Choir Embroidered Polo Shirt",
    nameSw: "Fulana Rasmi ya Kwaya ya Mtakatifu Monica",
    type: "merchandise",
    priceKes: 1200,
    priceUsd: 9.50,
    description: "Premium breathable pique cotton polo shirt in Sky Mist blue with navy collar and the embroidered choir crest on the left chest.",
    descriptionSw: "Fulana ya pamba ya ubora wa juu yenye nembo ya kwaya iliyoshonwa kifuani, rangi ya buluu safi na kola ya giza.",
    image: "nakuru_parish_cathedral",
    downloadable: false
  },
  {
    id: "prod-physical-cd",
    name: "Mtakatifu Monica Mama Mwema (Audio CD)",
    nameSw: "Santuri ya CD (Vol. III)",
    type: "physical_cd",
    priceKes: 600,
    priceUsd: 4.80,
    description: "Original pressed audio compact disc in jewel case with full color photo booklet. Collectible parish release.",
    descriptionSw: "Santuri halisi ya CD ikiwa na kijitabu cha picha za waimbaji wa SEC 58 Nakuru.",
    image: "choir_singing_moment",
    downloadable: false
  }
];

export const EVENTS_CATALOG: EventItem[] = [
  {
    id: "evt-1",
    title: "Feast of Saint Monica: Patronal High Mass & Choir Day",
    titleSw: "Sikukuu ya Mtakatifu Monica: Misa Kuu ya Somo",
    dateDay: "27",
    dateMonth: "AUG",
    fullDate: "Thursday, 27 August 2026",
    time: "10:00 AM – 1:30 PM EAT",
    venue: "St. Monica Catholic Church, Section 58",
    city: "Nakuru, Kenya",
    description: "Annual patronal festival celebration honoring St. Monica. Grand liturgical High Mass featuring our full SATB choir, blessing of families and mothers, followed by a fellowship sacred concert.",
    category: "Patronal Feast",
    entryType: "Liturgical Mass"
  },
  {
    id: "evt-2",
    title: "Nakuru Diocesan Sacred Music Festival",
    titleSw: "Tamasha la Kijimbo la Muziki Mtakatifu",
    dateDay: "19",
    dateMonth: "SEP",
    fullDate: "Saturday, 19 September 2026",
    time: "8:30 AM – 5:00 PM EAT",
    venue: "Cathedral of Christ the King",
    city: "Nakuru, Kenya",
    description: "Over 40 parish choirs congregate for liturgical choral competition and sacred polyphonic showcase organized by the Catholic Diocese of Nakuru Liturgical Commission.",
    category: "Festival",
    entryType: "Tickets"
  },
  {
    id: "evt-3",
    title: "Annual Advent Hymnody & Carols Evening",
    titleSw: "Mkesha wa Nyimbo za Majilio na Krismasi",
    dateDay: "12",
    dateMonth: "DEC",
    fullDate: "Saturday, 12 December 2026",
    time: "5:30 PM – 8:30 PM EAT",
    venue: "St. Monica Parish Sanctuary, Section 58",
    city: "Nakuru, Kenya",
    description: "An evening of candlelit sacred music, classical Swahili advent meditations, and solemn lessons & carols preparing our hearts for the Nativity of Christ.",
    category: "Concert",
    entryType: "Free Entry"
  }
];

export const VOICE_SECTIONS_DATA = [
  {
    name: "Soprano (Kinara cha Juu)",
    leader: "Grace Muthoni",
    membersCount: 16,
    range: "C4 – A5",
    description: "Leading the melodic line with clarity, purity, and prayerful expression. High polyphonic entrances and descants.",
    descriptionSw: "Sauti ya kwanza inayoongoza melodi ya wimbo kwa sauti nyororo, safi, na yenye kusikika vizuri hekaluni.",
    sampleClip: "Soprano excerpt: Mtakatifu Monica Mama Mwema"
  },
  {
    name: "Alto (Sauti ya Pili)",
    leader: "Mary Otieno",
    membersCount: 14,
    range: "F3 – D5",
    description: "Warm, rich harmonic foundation that knits the upper and lower voices together with depth and soulful resonance.",
    descriptionSw: "Sauti ya pili inayojaza wimbo kwa utulivu na kutoa upatanisho mzuri wa sauti za juu na za chini.",
    sampleClip: "Alto excerpt: Kyrie wa Misa ya Fransisko"
  },
  {
    name: "Tenor (Sauti ya Tatu)",
    leader: "David Mwangi",
    membersCount: 11,
    range: "C3 – G4",
    description: "Bright, lyrical male voice carrying the inner counter-melodies and prominent harmonic transitions.",
    descriptionSw: "Sauti ya tatu ya wanaume inayopamba wimbo kwa uimbaji wa ndani na sauti ya juu ya kiume yenye nguvu.",
    sampleClip: "Tenor solo: Ee Mkate wa Mbingu"
  },
  {
    name: "Bass (Sauti ya Chini)",
    leader: "Peter Omondi",
    membersCount: 11,
    range: "E2 – C4",
    description: "Resonant, grounding acoustic anchor providing the foundational root notes and rhythmic drive for the ensemble.",
    descriptionSw: "Sauti ya nne ya chini kabisa inayoweka msingi imara wa noti zote na kuimarisha mdundo wa sala.",
    sampleClip: "Bass foundation: Kristo Amefufuka"
  }
];
