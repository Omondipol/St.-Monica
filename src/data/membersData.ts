export interface ChoirMember {
  id: string;
  name: string;
  voice: 'soprano' | 'alto' | 'tenor' | 'bass';
  phone?: string;
  email?: string;
  role?: string;
  photoUrl?: string;
  registeredAt: string; // ISO date
  expiresAt: string; // ISO date (12 months from registeredAt)
  renewalFeePaid: number; // 500
  paymentReference?: string;
  status: 'active' | 'expired';
}

// Generate realistic dates within the last 1-10 months so they have valid 12-month memberships
const now = new Date();

const makeDateMonthsAgo = (monthsAgo: number) => {
  const d = new Date(now);
  d.setMonth(d.getMonth() - monthsAgo);
  return d.toISOString();
};

const makeExpiryFrom = (registeredIso: string) => {
  const d = new Date(registeredIso);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString();
};

export const INITIAL_MEMBERS: ChoirMember[] = [
  // ==================== SOPRANO (22 Members) ====================
  {
    id: "mem-sop-01",
    name: "Susan Adhiambo Onyango",
    voice: "soprano",
    role: "Section Leader",
    photoUrl: "/assets/choir/choir_leader_06.jpg",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP01",
    status: "active"
  },
  {
    id: "mem-sop-02",
    name: "Jecinta Njeri Mwangi",
    voice: "soprano",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_15.jpg",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP02",
    status: "active"
  },
  {
    id: "mem-sop-03",
    name: "Elizabeth Nyoko",
    voice: "soprano",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_16.jpg",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP03",
    status: "active"
  },
  {
    id: "mem-sop-04",
    name: "Rose Makaa Kyutha",
    voice: "soprano",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_17.jpg",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP04",
    status: "active"
  },
  {
    id: "mem-sop-05",
    name: "Peris W. Njuguna",
    voice: "soprano",
    role: "Chorister & Treasurer",
    photoUrl: "/assets/choir/choir_leader_08.jpg",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP05",
    status: "active"
  },
  {
    id: "mem-sop-06",
    name: "Ann Wangari",
    voice: "soprano",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_18.jpg",
    registeredAt: makeDateMonthsAgo(5),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(5)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP06",
    status: "active"
  },
  {
    id: "mem-sop-07",
    name: "Lilian Mbugua",
    voice: "soprano",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_19.jpg",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP07",
    status: "active"
  },
  {
    id: "mem-sop-08",
    name: "Lucy Karori",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(6),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(6)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP08",
    status: "active"
  },
  {
    id: "mem-sop-09",
    name: "Terry Odhiambo",
    voice: "soprano",
    role: "Chorister & Secretary",
    photoUrl: "/assets/choir/choir_leader_06.jpg",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP09",
    status: "active"
  },
  {
    id: "mem-sop-10",
    name: "Mary Chacha",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP10",
    status: "active"
  },
  {
    id: "mem-sop-11",
    name: "Mercy Mbugua",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP11",
    status: "active"
  },
  {
    id: "mem-sop-12",
    name: "Divinah Kemunto",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP12",
    status: "active"
  },
  {
    id: "mem-sop-13",
    name: "Abigael Wanja",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP13",
    status: "active"
  },
  {
    id: "mem-sop-14",
    name: "Serah W. Kagaru",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(5),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(5)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP14",
    status: "active"
  },
  {
    id: "mem-sop-15",
    name: "Rose Naomi Juma",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP15",
    status: "active"
  },
  {
    id: "mem-sop-16",
    name: "Ann Ngendo",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP16",
    status: "active"
  },
  {
    id: "mem-sop-17",
    name: "Edinah Mwango",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP17",
    status: "active"
  },
  {
    id: "mem-sop-18",
    name: "Everlyne N. Okanga",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP18",
    status: "active"
  },
  {
    id: "mem-sop-19",
    name: "Catherine Njenga",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP19",
    status: "active"
  },
  {
    id: "mem-sop-20",
    name: "Mary Kuria",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP20",
    status: "active"
  },
  {
    id: "mem-sop-21",
    name: "Ann Nasimiyu",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP21",
    status: "active"
  },
  {
    id: "mem-sop-22",
    name: "Avell Owino",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP22",
    status: "active"
  },

  // ==================== ALTO (18 Members) ====================
  {
    id: "mem-alt-01",
    name: "Lilian Kerubo Motoki",
    voice: "alto",
    role: "Section Leader",
    photoUrl: "/assets/choir/choir_leader_05.jpg",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT01",
    status: "active"
  },
  {
    id: "mem-alt-02",
    name: "Naomi Nderitu",
    voice: "alto",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_20.jpg",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT02",
    status: "active"
  },
  {
    id: "mem-alt-03",
    name: "Rachael Nderitu",
    voice: "alto",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_21.jpg",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT03",
    status: "active"
  },
  {
    id: "mem-alt-04",
    name: "Sara Muthoni",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT04",
    status: "active"
  },
  {
    id: "mem-alt-05",
    name: "Yvonne Arogo",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT05",
    status: "active"
  },
  {
    id: "mem-alt-06",
    name: "Damaris Ndeto",
    voice: "alto",
    role: "Chorister & Moderator",
    photoUrl: "/assets/choir/choir_leader_05.jpg",
    registeredAt: makeDateMonthsAgo(5),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(5)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT06",
    status: "active"
  },
  {
    id: "mem-alt-07",
    name: "Elizabeth Waweru",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT07",
    status: "active"
  },
  {
    id: "mem-alt-08",
    name: "Elizabeth Nyongesa",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT08",
    status: "active"
  },
  {
    id: "mem-alt-09",
    name: "Beatrice Mugane",
    voice: "alto",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_22.jpg",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT09",
    status: "active"
  },
  {
    id: "mem-alt-10",
    name: "Esther Njuguna",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT10",
    status: "active"
  },
  {
    id: "mem-alt-11",
    name: "Alice C. Gougos",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT11",
    status: "active"
  },
  {
    id: "mem-alt-12",
    name: "Eunice Moraa Omari",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(5),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(5)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT12",
    status: "active"
  },
  {
    id: "mem-alt-13",
    name: "Jackline Kemunto",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT13",
    status: "active"
  },
  {
    id: "mem-alt-14",
    name: "Keiwa Harriet",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT14",
    status: "active"
  },
  {
    id: "mem-alt-15",
    name: "Veronica Mbugua",
    voice: "alto",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_23.jpg",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT15",
    status: "active"
  },
  {
    id: "mem-alt-16",
    name: "Susan Waiyego",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT16",
    status: "active"
  },
  {
    id: "mem-alt-17",
    name: "Agatha Kioko",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT17",
    status: "active"
  },
  {
    id: "mem-alt-18",
    name: "Mrs. Winrose Irungu",
    voice: "alto",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_24.jpg",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT18",
    status: "active"
  },

  // ==================== TENOR (7 Members) ====================
  {
    id: "mem-ten-01",
    name: "Ignatius Kipruto Ngure",
    voice: "tenor",
    role: "Section Leader",
    photoUrl: "/assets/choir/choir_leader_07.jpg",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN01",
    status: "active"
  },
  {
    id: "mem-ten-02",
    name: "Mukomah Leshan",
    voice: "tenor",
    role: "Chorister & Organist",
    photoUrl: "/assets/choir/choir_leader_03.jpg",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN02",
    status: "active"
  },
  {
    id: "mem-ten-03",
    name: "Amos A. Aswa",
    voice: "tenor",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_10.jpg",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN03",
    status: "active"
  },
  {
    id: "mem-ten-04",
    name: "Anthony Ndirangu",
    voice: "tenor",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_11.jpg",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN04",
    status: "active"
  },
  {
    id: "mem-ten-05",
    name: "Kennedy Nyongesa",
    voice: "tenor",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN05",
    status: "active"
  },
  {
    id: "mem-ten-06",
    name: "Erastus Maina",
    voice: "tenor",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(5),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(5)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN06",
    status: "active"
  },
  {
    id: "mem-ten-07",
    name: "Trever Cleophas Wekesa",
    voice: "tenor",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_12.jpg",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN07",
    status: "active"
  },

  // ==================== BASS (9 Members) ====================
  {
    id: "mem-bas-01",
    name: "Mark T. Atebe",
    voice: "bass",
    role: "Section Leader & Choirmaster",
    photoUrl: "/assets/choir/choir_leader_02.jpg",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS01",
    status: "active"
  },
  {
    id: "mem-bas-02",
    name: "Shem Njoroge",
    voice: "bass",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_13.jpg",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS02",
    status: "active"
  },
  {
    id: "mem-bas-03",
    name: "Odayo Tobias",
    voice: "bass",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_14.jpg",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS03",
    status: "active"
  },
  {
    id: "mem-bas-04",
    name: "Peter Rodgers",
    voice: "bass",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_leader_04.jpg",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS04",
    status: "active"
  },
  {
    id: "mem-bas-05",
    name: "Simon Nzioka",
    voice: "bass",
    role: "Chorister",
    photoUrl: "/assets/choir/choir_07.jpg",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS05",
    status: "active"
  },
  {
    id: "mem-bas-06",
    name: "Eliud Cheruiyot",
    voice: "bass",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(5),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(5)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS06",
    status: "active"
  },
  {
    id: "mem-bas-07",
    name: "Byrone Rayola",
    voice: "bass",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS07",
    status: "active"
  },
  {
    id: "mem-bas-08",
    name: "Dominic Kanoti",
    voice: "bass",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS08",
    status: "active"
  },
  {
    id: "mem-bas-09",
    name: "Peter Otieno",
    voice: "bass",
    role: "Chorister & Asst Moderator",
    photoUrl: "/assets/choir/choir_leader_04.jpg",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS09",
    status: "active"
  }
];

export const isMemberActive = (member: ChoirMember): boolean => {
  if (!member.expiresAt) return true;
  const expiryTime = new Date(member.expiresAt).getTime();
  return expiryTime > Date.now();
};

export const getDaysUntilExpiry = (expiresAt: string): number => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
