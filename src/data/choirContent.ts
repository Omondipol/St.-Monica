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

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@KwayayaMtakatifuMonicaSection5";
export const YOUTUBE_CHANNEL_HANDLE = "@KwayayaMtakatifuMonicaSection5";
export const YOUTUBE_CHANNEL_DISPLAY_NAME = "Kwaya ya Mtakatifu Monica Section 58";

export const CHOIR_STATS = {
  membersCount: 48,
  yearsServing: 14,
  repertoireCount: 12,
  albumsReleased: 1,
  parish: "St. Monica Catholic Parish, Section 58 Nakuru",
  parishSw: "Parokia ya Mtakatifu Monica, Section 58 Nakuru",
  churchAddress: "Section 58, Nakuru (Off Old Nairobi Road, Near Catholic Diocese Headquarters)",
  churchAddressSw: "Section 58, Nakuru (Barabara ya Old Nairobi Rd, Karibu na Makao Makuu ya Jimbo)",
  mapsUrl: "https://maps.google.com/?q=St.+Monica+Catholic+Church+Section+58+Nakuru",
  email: "stmonicachoirsec58@gmail.com",
  phone: "+254 722 845 291",
  whatsapp: "+254 722 845 291",
  whatsappUrl: "https://wa.me/254722845291",
  diocese: "Catholic Diocese of Nakuru (CDDN)",
  dioceseSw: "Jimbo Katoliki la Nakuru",
  patronSaint: "Saint Monica (Mtakatifu Monika)",
  feastDay: "27 August",
  feastDaySw: "27 Agosti",
  youtubeHandle: "@KwayayaMtakatifuMonicaSection5",
  massTimesSunday: "7:00 AM (Dawn), 9:00 AM (Sunday High Mass) & 11:00 AM (Youth)",
  massTimesSundaySw: "Saa 1:00 Asubuhi, Saa 3:00 Asubuhi (Sunday High Mass) & Saa 5:00 Asubuhi",
  rehearsalSchedule: "Wednesdays & Fridays: 5:30 PM – 7:30 PM (Parish Hall)",
  rehearsalScheduleSw: "Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku (Ukumbi wa Parokia)"
};

// Verified ONLY authentic songs from St. Monica Choir Section 58 Nakuru
export const INITIAL_SONGS_CATALOG: Song[] = [
  {
    id: "song-machozi",
    title: "Machozi ya Imani",
    titleSwahili: "Machozi ya Imani",
    album: "Nyimbo za Kiliturujia",
    composer: "Atebe Mark T. · Recorded at Khakstudio",
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
    audioPreviewUrl: "/audio/machozi_ya_imani.mp3",
    sheetMusicAvailable: true,
    scorePriceKes: 300,
    lyricsSwahili: [
      "1. Machozi ya imani humwagika mbele ya Altare ya Bwana, kilio cha unyenyekevu na toba ya kweli.",
      "Mungu wetu hasahau sala ya mwenye huzuni, husikiliza na kuponya mioyo iliyovunjika.",
      "Kiitikio: Ee Bwana, tazama machozi ya imani ya waja wako, utukumbuke kwa rehema zako na kutupa amani.",
      "2. Kama mama Mtakatifu Monica alivyomlilia mwanaye Augustino kwa machozi mengi,",
      "Nasi tunaleta sala na vilio vyetu mbele yako, tukiwa na tumaini kuu ndani ya Kristo."
    ],
    lyricsEnglish: [
      "1. Tears of deep faith flow before the altar of the Lord, a humble plea of sincere repentance.",
      "Our God never forgets the prayer of the sorrowful; He listens and heals the brokenhearted.",
      "Refrain: O Lord, look upon the tears of faith of Your servants; remember us in Your mercy and grant us peace.",
      "2. Even as Saint Monica wept unceasingly for her son Augustine with motherly tears,",
      "So we bring our supplications and tears before You, anchored in steadfast hope in Christ."
    ],
    waveformPeaks: [45, 68, 82, 94, 98, 86, 92, 96, 78, 84, 88, 72, 91, 98, 74, 58, 83, 89, 93, 62, 74, 84, 52, 38],
    recordedAt: "Recorded at Khakstudio, Nakuru",
    whyWeSingIt: "We sing Machozi ya Imani after Holy Communion when the sanctuary is hushed, lifting the hidden sorrows and quiet tears of our parishioners before God with the maternal intercession of Saint Monica.",
    whyWeSingItSw: "Tunauimba Machozi ya Imani baada ya Komunyo Takatifu kanisa linaponyamaza, tukileta huzuni za siri na machozi ya waamini mbele ya Mungu kwa maombezi ya mama yetu Mtakatifu Monika."
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
    audioPreviewUrl: "/audio/maisha_ya_mwanadamu.mp3",
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
    waveformPeaks: [30, 55, 45, 75, 85, 65, 80, 90, 70, 50, 85, 65, 80, 90, 55, 40, 65, 80, 85, 45, 60, 75, 40, 25],
    recordedAt: "Recorded at Khakstudio, Nakuru",
    whyWeSingIt: "This gentle hymn centers our hearts in profound humility, reminding us that earthly trials wither like grass while God's loving counsel remains steadfast.",
    whyWeSingItSw: "Wimbo huu huleta unyenyekevu mioyoni mwetu, ukitukumbusha kwamba taabu za dunia hunyauka kama majani ilhali shauri na upendo wa Mungu hudumu daima."
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
    audioPreviewUrl: "/audio/ni_mzima.mp3",
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
    waveformPeaks: [50, 75, 70, 95, 100, 90, 95, 100, 85, 75, 95, 85, 90, 95, 75, 55, 85, 90, 95, 65, 80, 90, 55, 35],
    recordedAt: "Recorded at Khakstudio, Nakuru",
    whyWeSingIt: "We sing Ni Mzima to send the congregation forth into the week with the uncontainable joy of the Resurrection, celebrated with resonant SATB harmony and African percussion.",
    whyWeSingItSw: "Tunauimba Ni Mzima mwishoni mwa Misa ili kuwapa waamini furaha kuu ya Ufufuko wanapoondoka, tukiambatana na sauti nne na kayamba za kiliturujia."
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
    audioPreviewUrl: "/audio/jumuiya_ndogondogo.mp3",
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
    waveformPeaks: [45, 70, 85, 95, 100, 85, 90, 95, 80, 85, 90, 70, 90, 100, 75, 60, 85, 90, 95, 65, 75, 85, 55, 40],
    recordedAt: "Recorded at Khakstudio, Nakuru",
    whyWeSingIt: "A signature entrance hymn honoring our Small Christian Communities across Section 58, celebrating our shared fellowship in prayer, visitation, and neighborly charity.",
    whyWeSingItSw: "Wimbo maalum wa kuingia unaoenzi Jumuiya Ndogondogo zote za Parokia ya Section 58, ukiadhimisha umoja wetu katika sala, huduma na upendo wa dhati."
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
    description: "The official master recording collection from St. Monica Catholic Choir, recorded with Khakstudio Production and parish audio engineers.",
    descriptionSw: "Mkusanyiko rasmi wa nyimbo za kiliturujia kutoka Kwaya ya Mtakatifu Monica, zilizorekodiwa rasmi kwa ajili ya utukufu wa Mungu.",
    youtubePlaylistUrl: YOUTUBE_CHANNEL_URL,
    songs: ["Machozi ya Imani", "Maisha ya Mwanadamu", "Ni Mzima", "Jumuiya Ndogondogo"]
  }
];

export const INITIAL_LEADERS: ChoirLeader[] = [
  {
    id: "ldr-choirmaster",
    name: "The Choir Leadership",
    role: "Music Leadership & Directorship",
    roleSw: "Uongozi wa Muziki na Kwaya",
    category: "trainer",
    responsibility: "Conducts weekly liturgical rehearsals, oversees four-part vocal polyphony, and prepares Sunday High Masses.",
    responsibilitySw: "Huongoza mazoezi ya kila wiki, upangaji wa sauti nne na maandalizi ya Misa Kuu ya Jumapili.",
    tenure: "Serving the Parish",
    tenureSw: "Wanahudumu Parokiani"
  },
  {
    id: "ldr-asst-choirmaster",
    name: "Atebe Mark T.",
    role: "Composer & Sectional Solfa Trainer",
    roleSw: "Mtunzi na Mkufunzi wa Solfa (Khakstudio)",
    category: "trainer",
    responsibility: "Vocal coaching, sectional practice drills, and recording production director.",
    responsibilitySw: "Mafunzo ya sauti, kusoma noti za solfa na usimamizi wa kurekodi studio.",
    tenure: "Serving since 2018",
    tenureSw: "Anahudumu tangu 2018"
  },
  {
    id: "ldr-organist",
    name: "Francis Mwangi",
    role: "Parish Organist & Keyboardist",
    roleSw: "Mpiga Kinanda na Organi ya Parokia",
    category: "trainer",
    responsibility: "Accompanies liturgical High Masses and trains junior keyboard accompanists.",
    responsibilitySw: "Hupiga kinanda kwenye Misa Kuu na kuongoza ala za muziki.",
    tenure: "Serving since 2021",
    tenureSw: "Anahudumu tangu 2021"
  },
  {
    id: "ldr-chairperson",
    name: "John Baptist Kiprono",
    role: "Choir Chairperson",
    roleSw: "Mwenyekiti wa Kwaya",
    category: "official",
    responsibility: "Chairs executive meetings, represents choir to parish council, and oversees pastoral ministry.",
    responsibilitySw: "Huongoza mikutano ya kamati na kuwakilisha kwaya kwenye Baraza la Parokia.",
    tenure: "2023 – Present",
    tenureSw: "2023 – Hadi Sasa"
  },
  {
    id: "ldr-secretary",
    name: "Agnes Wanjiku",
    role: "Choir Secretary",
    roleSw: "Katibu wa Kwaya",
    category: "official",
    responsibility: "Maintains official choir registers, liturgical attendance logs, and diocesan correspondence.",
    responsibilitySw: "Huweka kumbukumbu rasmi za kwaya na mawasiliano ya kiliturujia.",
    tenure: "2023 – Present",
    tenureSw: "2023 – Hadi Sasa"
  },
  {
    id: "ldr-treasurer",
    name: "Grace Auma",
    role: "Choir Treasurer",
    roleSw: "Mhazini wa Kwaya",
    category: "official",
    responsibility: "Oversees sheet music score sales, vestment funds, and choir development accounts.",
    responsibilitySw: "Husimamia mauzo ya noti, mfuko wa sare na maendeleo ya kwaya.",
    tenure: "2022 – Present",
    tenureSw: "2022 – Hadi Sasa"
  }
];

export const INITIAL_GROUP_PHOTOS: ChoirGroupPhoto[] = [
  {
    id: "grp-vestment",
    title: "Kwaya Nzima ya Mtakatifu Monica",
    titleSw: "Kwaya Nzima ya Mtakatifu Monica",
    description: "The entire chorister ensemble of St. Monica Choir gathered at the altar of Section 58 Parish after Sunday High Mass.",
    descriptionSw: "Wanakwaya wote wa Mtakatifu Monica wakiwa altaroni Parokia ya Section 58 Nakuru baada ya Misa Kuu ya Jumapili.",
    year: "2024",
    imageKey: "choir_singing_moment",
    occasion: "Feast Day of St. Monica & Parish Dedication",
    occasionSw: "Sikukuu ya Mtakatifu Monika na Sherehe za Parokia"
  },
  {
    id: "grp-cathedral",
    title: "Kwaya Wakati wa Misa ya Ekaristi Takatifu",
    titleSw: "Kwaya Wakati wa Misa ya Ekaristi Takatifu",
    description: "Active liturgical singing during the solemn Holy Eucharist procession at Section 58 Catholic Church.",
    descriptionSw: "Uimbaji wa heshima wakati wa maandamano ya Ekaristi Takatifu katika Kanisa la Mtakatifu Monica.",
    year: "2023",
    imageKey: "nakuru_parish_cathedral",
    occasion: "Corpus Christi & Confirmation Mass",
    occasionSw: "Sikukuu ya Mwili na Damu ya Kristo"
  },
  {
    id: "grp-hymnal",
    title: "Noti na Miongozo ya Muziki wa Kikatoliki",
    titleSw: "Noti na Miongozo ya Muziki wa Kikatoliki",
    description: "Official tonic sol-fa vocal scores prepared by choir trainers for liturgy and rehearsal training.",
    descriptionSw: "Mkusanyiko wa vitabu vya noti za solfa na stafu zinazotumiwa na kwaya altaroni na mazoezini.",
    year: "2024",
    imageKey: "sheet_music_hymnal",
    occasion: "Liturgical Repertoire Archive",
    occasionSw: "Kumbukumbu ya Nyimbo za Kiliturujia"
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
    descriptionSw: "Albamu kamili ya dijitali yenye nyimbo zote nne za Kwaya ya Mtakatifu Monica pamoja na kijitabu cha maneno. Lipa kupitia M-Pesa.",
    image: "choir_singing_moment",
    badge: "Official Album",
    downloadable: true
  },
  {
    id: "prod-sheet-bundle",
    name: "Complete SATB Vocal Scores Bundle (All 4 Hymns)",
    nameSw: "Kifurushi cha Noti Zote 4 (SATB PDF)",
    type: "sheet_music",
    priceKes: 1000,
    priceUsd: 8.00,
    description: "Complete printable PDF booklet with Tonic Sol-fa and Staff Notation for all 4 hymns. Formatted for choir directors for parish use. Pay with M-Pesa.",
    descriptionSw: "Kitini kamili cha noti za PDF chenye solfa na stafu kwa nyimbo zote 4 kwa ajili ya walimu wa kwaya. Lipa kupitia M-Pesa.",
    image: "sheet_music_hymnal",
    badge: "Save KES 200",
    downloadable: true
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: "evt-sunday-mass",
    title: "Sunday High Mass",
    titleSw: "Misa Kuu ya Jumapili (Sunday High Mass)",
    dateDay: "Sun",
    dateMonth: "Every",
    fullDate: "Kila Jumapili / Every Sunday",
    time: "9:00 AM - 10:45 AM",
    venue: "St. Monica Catholic Church, Section 58",
    city: "Nakuru, Kenya",
    description: "Our principal liturgical assignment: solemn four-part SATB polyphony, Gregorian antiphons, and sacred praise songs for the Holy Eucharist.",
    descriptionSw: "Utume wetu mkuu wa kiliturujia: kuongoza Misa Kuu kwa sauti nne (SATB), nyimbo za tafakari na shukrani mbele ya Altare Takatifu.",
    category: "Liturgical Mass",
    entryType: "Sunday High Mass",
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
    title: "Feast of Saint Monica & Parish Anniversary (Past)",
    titleSw: "Sikukuu ya Mtakatifu Monika (Iliyopita)",
    dateDay: "27",
    dateMonth: "Aug 2026",
    fullDate: "27 August 2026",
    time: "9:30 AM",
    venue: "St. Monica Catholic Church, Section 58",
    city: "Nakuru, Kenya",
    description: "Past patronal solemn Mass and reception celebration with choir alumni and diocesan guests.",
    descriptionSw: "Misa Kuu ya sherehe ya Mtakatifu Monika iliyoadhimishwa mwezi wa Agosti.",
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
    range: "C4 — A5",
    membersCount: 16,
    description: "The primary melodic leadership carrying the sacred text clearly across the sanctuary with purity.",
    descriptionSw: "Wanaoongoza melodi ya wimbo kwa sauti nyororo na ya juu inayofika mbali altaroni.",
    sampleClip: "Soprano Melody (C4 - A5)"
  },
  {
    name: "Alto",
    nameEn: "Alto Section",
    range: "F3 — D5",
    membersCount: 14,
    description: "The rich harmonic warmth supporting the soprano melody with contemplative depth.",
    descriptionSw: "Sauti ya pili inayotoa utajiri wa upatanisho na joto la sala ya muziki mtakatifu.",
    sampleClip: "Alto Harmony (F3 - D5)"
  },
  {
    name: "Tenor",
    nameEn: "Tenor Section",
    range: "C3 — G4",
    membersCount: 10,
    description: "The bright vocal counterpoint providing energy and liturgical clarity to four-part harmony.",
    descriptionSw: "Sauti ya kiume ya juu inayoleta mng'ao na nguvu katika sala za Misa.",
    sampleClip: "Tenor Counterpoint (C3 - G4)"
  },
  {
    name: "Bass",
    nameEn: "Bass Section",
    range: "E2 — C4",
    membersCount: 8,
    description: "The foundational acoustic anchor upon which the sacred polyphonic chords are firmly grounded.",
    descriptionSw: "Sauti nzito ya msingi inayoshikilia na kuweka uthabiti wa kwaya nzima.",
    sampleClip: "Bass Foundation (E2 - C4)"
  }
];

export const EVENTS_CATALOG = INITIAL_EVENTS;
