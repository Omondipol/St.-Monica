export interface ChoirMember {
  id: string;
  name: string;
  voice: 'soprano' | 'alto' | 'tenor' | 'bass';
  phone?: string;
  email?: string;
  role?: string;
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
  // SOPRANO (16 initial members)
  {
    id: "mem-sop-01",
    name: "Mary Wambui",
    voice: "soprano",
    role: "Section Leader",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP01",
    status: "active"
  },
  {
    id: "mem-sop-02",
    name: "Scholastica Nekesa",
    voice: "soprano",
    role: "Founding Chorister",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP02",
    status: "active"
  },
  {
    id: "mem-sop-03",
    name: "Catherine Wanjiru",
    voice: "soprano",
    role: "Lead Soprano",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP03",
    status: "active"
  },
  {
    id: "mem-sop-04",
    name: "Perpetua Muthoni",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP04",
    status: "active"
  },
  {
    id: "mem-sop-05",
    name: "Agnes Chebet",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP05",
    status: "active"
  },
  {
    id: "mem-sop-06",
    name: "Immaculate Achieng",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(5),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(5)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP06",
    status: "active"
  },
  {
    id: "mem-sop-07",
    name: "Veronica Nyambura",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP07",
    status: "active"
  },
  {
    id: "mem-sop-08",
    name: "Grace Moraa",
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
    name: "Bernadette Wangari",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP09",
    status: "active"
  },
  {
    id: "mem-sop-10",
    name: "Lucy Atieno",
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
    name: "Teresa Nduta",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP11",
    status: "active"
  },
  {
    id: "mem-sop-12",
    name: "Jane Chemutai",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(7),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(7)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP12",
    status: "active"
  },
  {
    id: "mem-sop-13",
    name: "Esther Wairimu",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP13",
    status: "active"
  },
  {
    id: "mem-sop-14",
    name: "Faith Jepchirchir",
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
    name: "Alice Wanjiku",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP15",
    status: "active"
  },
  {
    id: "mem-sop-16",
    name: "Beatrice Aoko",
    voice: "soprano",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-SOP16",
    status: "active"
  },

  // ALTO (14 initial members)
  {
    id: "mem-alt-01",
    name: "Elizabeth Akinyi",
    voice: "alto",
    role: "Section Leader",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT01",
    status: "active"
  },
  {
    id: "mem-alt-02",
    name: "Monica Wangui",
    voice: "alto",
    role: "Lead Alto",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT02",
    status: "active"
  },
  {
    id: "mem-alt-03",
    name: "Rosemary Cherono",
    voice: "alto",
    role: "Founding Chorister",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT03",
    status: "active"
  },
  {
    id: "mem-alt-04",
    name: "Judith Ndunge",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT04",
    status: "active"
  },
  {
    id: "mem-alt-05",
    name: "Magdalene Awuor",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(5),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(5)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT05",
    status: "active"
  },
  {
    id: "mem-alt-06",
    name: "Christine Muthoni",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT06",
    status: "active"
  },
  {
    id: "mem-alt-07",
    name: "Damaris Chepkemoi",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(6),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(6)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT07",
    status: "active"
  },
  {
    id: "mem-alt-08",
    name: "Philomena Wanjira",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT08",
    status: "active"
  },
  {
    id: "mem-alt-09",
    name: "Mercy Kwamboka",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT09",
    status: "active"
  },
  {
    id: "mem-alt-10",
    name: "Jacinta Njeri",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT10",
    status: "active"
  },
  {
    id: "mem-alt-11",
    name: "Cecilia Adhiambo",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(7),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(7)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT11",
    status: "active"
  },
  {
    id: "mem-alt-12",
    name: "Annah Jepkoech",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT12",
    status: "active"
  },
  {
    id: "mem-alt-13",
    name: "Hellen Nyaboke",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(5),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(5)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT13",
    status: "active"
  },
  {
    id: "mem-alt-14",
    name: "Sarah Wangari",
    voice: "alto",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-ALT14",
    status: "active"
  },

  // TENOR (10 initial members)
  {
    id: "mem-ten-01",
    name: "Stephen Kiprono",
    voice: "tenor",
    role: "Section Leader",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN01",
    status: "active"
  },
  {
    id: "mem-ten-02",
    name: "Anthony Otieno",
    voice: "tenor",
    role: "Lead Tenor",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN02",
    status: "active"
  },
  {
    id: "mem-ten-03",
    name: "Francis Kariuki",
    voice: "tenor",
    role: "Founding Chorister",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN03",
    status: "active"
  },
  {
    id: "mem-ten-04",
    name: "Gabriel Maina",
    voice: "tenor",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN04",
    status: "active"
  },
  {
    id: "mem-ten-05",
    name: "Dominic Kipkorir",
    voice: "tenor",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(5),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(5)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN05",
    status: "active"
  },
  {
    id: "mem-ten-06",
    name: "Peter Omondi",
    voice: "tenor",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN06",
    status: "active"
  },
  {
    id: "mem-ten-07",
    name: "Michael Njoroge",
    voice: "tenor",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(6),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(6)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN07",
    status: "active"
  },
  {
    id: "mem-ten-08",
    name: "Vincent Barasa",
    voice: "tenor",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN08",
    status: "active"
  },
  {
    id: "mem-ten-09",
    name: "Kevin Mwangi",
    voice: "tenor",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN09",
    status: "active"
  },
  {
    id: "mem-ten-10",
    name: "Josephat Rotich",
    voice: "tenor",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-TEN10",
    status: "active"
  },

  // BASS (8 initial members)
  {
    id: "mem-bas-01",
    name: "John Mark Atebe",
    voice: "bass",
    role: "Section Leader",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS01",
    status: "active"
  },
  {
    id: "mem-bas-02",
    name: "Bernard Ochieng",
    voice: "bass",
    role: "Lead Bass",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS02",
    status: "active"
  },
  {
    id: "mem-bas-03",
    name: "Patrick Kiptoo",
    voice: "bass",
    role: "Founding Chorister",
    registeredAt: makeDateMonthsAgo(5),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(5)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS03",
    status: "active"
  },
  {
    id: "mem-bas-04",
    name: "David Macharia",
    voice: "bass",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(1),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(1)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS04",
    status: "active"
  },
  {
    id: "mem-bas-05",
    name: "Emmanuel Kipchumba",
    voice: "bass",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(4),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(4)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS05",
    status: "active"
  },
  {
    id: "mem-bas-06",
    name: "Paul Odhiambo",
    voice: "bass",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(2),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(2)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS06",
    status: "active"
  },
  {
    id: "mem-bas-07",
    name: "Samuel Githinji",
    voice: "bass",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(6),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(6)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS07",
    status: "active"
  },
  {
    id: "mem-bas-08",
    name: "Tobias Wanyama",
    voice: "bass",
    role: "Chorister",
    registeredAt: makeDateMonthsAgo(3),
    expiresAt: makeExpiryFrom(makeDateMonthsAgo(3)),
    renewalFeePaid: 500,
    paymentReference: "MPESA-SMTC-BAS08",
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
