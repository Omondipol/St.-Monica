export interface DocumentMetadata {
  title: string;
  subtitle: string;
  version: string;
  date: string;
  author: string;
  authorRole: string;
  organization: string;
  location: string;
  patronSaint: string;
  feastDay: string;
  functionalReference: string;
  totalPages: number;
  totalSections: number;
}

export const DOCUMENT_METADATA: DocumentMetadata = {
  title: "St. Monica Choir Nakuru — Website Development Plan",
  subtitle: "Brand and design direction | Front end | Back end | Features | Delivery",
  version: "3.0",
  date: "October 2026",
  author: "David Kiprop",
  authorRole: "Full-Stack Web Developer",
  organization: "St. Monica Choir (Kwaya ya Mtakatifu Monica)",
  location: "SEC 58, Nakuru, Kenya",
  patronSaint: "St. Monica",
  feastDay: "27 August",
  functionalReference: "KMK Makuburi (Dar es Salaam)",
  totalPages: 16,
  totalSections: 13,
};

export const COLOR_PALETTE = [
  {
    name: "Night Navy",
    hex: "#0C2340",
    role: "Body text & dark mode background; primary typographic contrast",
    usage: "Editorial headings, deep typography, high-contrast borders",
    wcagTarget: "Passes AAA against white and Sky Mist",
  },
  {
    name: "Sky Mist",
    hex: "#EAF4FB",
    role: "Page background canvas; printed paper texture base",
    usage: "Quiet foundation canvas, container surfaces, subtle dividers",
    wcagTarget: "Light background (60% neutral canvas)",
  },
  {
    name: "Logo Blue",
    hex: "#1058A8",
    role: "Buttons, links, and high-contrast headings",
    usage: "Sampled directly from choir logo; primary interactive action color",
    wcagTarget: "Passes AA for interactive touch targets",
  },
  {
    name: "Sky Blue",
    hex: "#7EC8F0",
    role: "Signature brand colour for large bands, illustrations, highlights",
    usage: "Structural bands, stave accents, audio player highlights",
    wcagTarget: "Always paired with deep navy text, never pure white text",
  },
  {
    name: "Star Gold",
    hex: "#E0A526",
    role: "Accent touch, echoes stars on the choir crest",
    usage: "Shop badges, active audio states, award callouts, rare accents",
    wcagTarget: "High-intent accent (10% color budget)",
  },
];

export const TYPOGRAPHY_ROLES = [
  {
    role: "Headlines & Hero",
    font: "Fraunces (variable serif)",
    purpose: "Warm, characterful, editorial printed-programme feel; used large with tight optical letter-spacing",
    sample: "Kwaya ya Mtakatifu Monica — SEC 58 Nakuru",
  },
  {
    role: "Body & UI Elements",
    font: "Source Sans 3",
    purpose: "Exceptional legibility across low-end mobile devices in Kenya; full multilingual diacritic support",
    sample: "Music is our ministry. Liturgy, weddings, recordings, and concerts.",
  },
  {
    role: "Labels, Prices & Timestamps",
    font: "Tabular Figures / Small Caps",
    purpose: "Ensures precise vertical alignment in concert schedules, sheet music prices (KES), and dates",
    sample: "KES 450 · 27 AUG · 10:30 AM EAT",
  },
  {
    role: "Lyrics & Musical Scores",
    font: "Serif Body at 18px+",
    purpose: "Comfortable eye-tracking during live church rehearsals, choral reading, and worship",
    sample: "Bwana Utuhurumie · Sanctus · Agnus Dei",
  },
];

export interface SprintDetail {
  id: string;
  phase: string;
  weeks: string;
  effortMin: number;
  effortMax: number;
  deliverables: string[];
  focus: string;
}

export const SPRINT_TIMELINE: SprintDetail[] = [
  {
    id: "discovery",
    phase: "Discovery & Audit",
    weeks: "Weeks 1–2",
    effortMin: 6,
    effortMax: 8,
    deliverables: [
      "Choir goals & stakeholder alignment",
      "Content audit & existing media inventory",
      "Music rights & licensing verification",
      "Sitemap architecture & user journeys",
      "Brand workshop & visual mood boards",
      "Domain acquisition & server account setup",
    ],
    focus: "Governance, rights clearance, and content roadmap",
  },
  {
    id: "design",
    phase: "Design System & Wireframes",
    weeks: "Weeks 2–4",
    effortMin: 10,
    effortMax: 14,
    deliverables: [
      "Complete style guide & CSS design tokens",
      "Desktop (1440px) & mobile (360px) wireframes",
      "High-fidelity responsive mockups for all key pages",
      "Clickable prototype for committee review",
      "Choir Executive Committee formal sign-off",
    ],
    focus: "Concert Programme aesthetic validation & anti-template testing",
  },
  {
    id: "sprint-1",
    phase: "Sprint 1: Core Foundation & About",
    weeks: "Weeks 5–6",
    effortMin: 12,
    effortMax: 15,
    deliverables: [
      "Repository, CI/CD pipelines & Docker setup",
      "Next.js App Router + TypeScript skeleton",
      "Django REST Framework & Wagtail CMS API setup",
      "Design system component library",
      "Core layout: Navigation, Footer, Stave dividers",
      "About section: Story, Patron, Values, Leadership",
    ],
    focus: "Architecture, brand deployment, and editorial storytelling",
  },
  {
    id: "sprint-2",
    phase: "Sprint 2: Music Engine & Events",
    weeks: "Weeks 7–8",
    effortMin: 14,
    effortMax: 18,
    deliverables: [
      "Albums and individual track catalog",
      "Persistent global audio player with waveform scrubber",
      "Repertoire browser with liturgical season & voicing filters",
      "Synchronized lyrics & credits display",
      "Events calendar with ICS export & map embed",
      "Photo and video media gallery",
    ],
    focus: "Audio performance, Media Session API, waveform peaks JSON",
  },
  {
    id: "sprint-3",
    phase: "Sprint 3: E-Commerce & M-Pesa",
    weeks: "Weeks 9–10",
    effortMin: 14,
    effortMax: 18,
    deliverables: [
      "Product catalog (digital music, scores, CDs, merchandise)",
      "Mobile-first cart drawer & guest checkout",
      "M-Pesa STK Push & card payment integration (sandbox)",
      "Automated server webhook idempotency & reconciliation",
      "Expiring signed download grants for digital music/PDFs",
      "Orders back-office management for Shop Manager",
    ],
    focus: "Financial reliability, Daraja API integration, Kenyan checkout flow",
  },
  {
    id: "sprint-4",
    phase: "Sprint 4: Sheet Music, Bookings & Community",
    weeks: "Weeks 11–12",
    effortMin: 12,
    effortMax: 15,
    deliverables: [
      "Searchable sheet music library (free, paid, member access)",
      "Liturgical Mass planner for visiting choir directors",
      "Wedding & funeral booking pipeline with date check",
      "Automated quotation emails & booking status tracker",
      "Donations & fundraising campaigns module",
      "Bilingual newsletter subscription & site-wide search",
    ],
    focus: "Ministry utility, parish collaboration, automated booking flow",
  },
  {
    id: "sprint-5",
    phase: "Sprint 5: Member Portal & PWA",
    weeks: "Weeks 13–14",
    effortMin: 10,
    effortMax: 14,
    deliverables: [
      "Admin-approved member portal & role-based dashboard",
      "Rehearsal attendance tracking & voice part practice tracks",
      "Email & WhatsApp rehearsal notification triggers",
      "PWA offline caching for saved lyrics & sheet music scores",
      "Admin analytics dashboard (plays, sales, booking enquiries)",
      "Micro-animations & reduced-motion compliance pass",
    ],
    focus: "Internal choir choir operations, offline mobile reliability",
  },
  {
    id: "launch",
    phase: "Testing, Hardening & Go-Live",
    weeks: "Weeks 15–16",
    effortMin: 8,
    effortMax: 10,
    deliverables: [
      "Cross-device testing on low-end 360px Android devices",
      "Lighthouse CI performance verification (LCP < 2.5s)",
      "Axe accessibility & WCAG 2.2 AA audit",
      "Live payment test (real 1 KES transactions with M-Pesa)",
      "Content population & proofreading in Swahili & English",
      "Choir leadership training & video guides handover",
      "Production DNS switch, Cloudflare SSL & live monitoring",
    ],
    focus: "Security, compliance, performance budget enforcement",
  },
  {
    id: "support",
    phase: "Post-Launch Support & Handover",
    weeks: "Weeks 17–20",
    effortMin: 5,
    effortMax: 8,
    deliverables: [
      "Initial 30-day bug resolution & warranty support",
      "First monthly financial sales reconciliation with Treasurer",
      "User feedback review & minor polish",
      "Formal documentation handover & repository transfer",
    ],
    focus: "Long-term choir self-sufficiency and financial stability",
  },
];

export const TECHNICAL_TARGETS = [
  {
    metric: "Largest Contentful Paint (LCP)",
    target: "< 2.5 seconds",
    condition: "On mid-range Android phone over Kenyan 4G cellular network",
    rationale: "Ensures visitors don't bounce due to heavy assets",
  },
  {
    metric: "Interaction to Next Paint (INP)",
    target: "< 200 milliseconds",
    condition: "All interactive controls, audio player controls, and forms",
    rationale: "Smooth, responsive feel even during complex DOM state updates",
  },
  {
    metric: "Cumulative Layout Shift (CLS)",
    target: "< 0.1",
    condition: "Strict visual stability during dynamic image & font loads",
    rationale: "Zero annoying jumps while reading hymnal lyrics or clicking buy",
  },
  {
    metric: "Initial JavaScript Bundle",
    target: "< 170 KB (compressed)",
    condition: "Initial critical HTML/JS payload",
    rationale: "Audio libraries and heavy modules lazy-loaded only when triggered",
  },
  {
    metric: "Accessibility Standard",
    target: "WCAG 2.2 AA",
    condition: "Full keyboard navigation, contrast ratios, and screen readers",
    rationale: "Ensures senior parishioners & visually impaired choir members can participate",
  },
  {
    metric: "Mobile Baseline Viewport",
    target: "360 px minimum width",
    condition: "One-handed operation on low-end budget smartphones",
    rationale: "Reflects the actual device demographics of local congregation",
  },
  {
    metric: "Touch Target Size",
    target: ">= 44 px",
    condition: "All buttons, navigation tabs, and audio scrubbers",
    rationale: "Prevents misclicks on mobile devices",
  },
  {
    metric: "Regulatory Compliance",
    target: "Kenya Data Protection Act 2019",
    condition: "Explicit consent, privacy policy, ODPC registration check",
    rationale: "Legal compliance for member data & donor records in Kenya",
  },
];

export const API_MODULES = [
  {
    module: "Content",
    endpoints: "GET /pages/{slug}, /team, /values, /timeline, /journal",
    description: "Serves rich Wagtail CMS blocks as structured JSON in English and Kiswahili.",
  },
  {
    module: "Music & Catalog",
    endpoints: "GET /albums, /albums/{id}, /songs, /songs/{id}, /repertoire?season=&part=&lang=",
    description: "Delivers song metadata, 30-60s previews, waveform peaks JSON, and liturgical tags.",
  },
  {
    module: "Events",
    endpoints: "GET /events, /events/{id}, POST /events/{id}/rsvp",
    description: "Calendar management, venue maps, and .ics calendar sync for liturgical celebrations.",
  },
  {
    module: "Media",
    endpoints: "GET /gallery, /videos",
    description: "Optimized responsive AVIF/WebP image collections with blur-hash placeholders.",
  },
  {
    module: "Shop",
    endpoints: "GET /products, POST /cart, POST /checkout, GET /orders/{id}",
    description: "Guest and account checkout for physical CDs/USB, apparel, and digital files.",
  },
  {
    module: "Payments",
    endpoints: "POST /payments/mpesa/stk, POST /payments/webhook, GET /payments/{id}/status",
    description: "Idempotent M-Pesa STK Push execution with cryptographic webhook validation.",
  },
  {
    module: "Downloads",
    endpoints: "GET /downloads/{token}",
    description: "Expiring, signed URLs with rate limiting and download attempt thresholds.",
  },
  {
    module: "Library",
    endpoints: "GET /scores, /scores/{id}",
    description: "Access-controlled sheet music repository for public, paid, and verified choir members.",
  },
  {
    module: "Bookings",
    endpoints: "POST /bookings, GET/PATCH /bookings (admin)",
    description: "Event booking workflow with status pipeline (new -> quoted -> confirmed -> done).",
  },
  {
    module: "Members",
    endpoints: "POST /auth/login, /auth/register, GET /me, /me/schedule, /me/tracks",
    description: "Secure choir portal with admin approvals and voice-part practice audio isolation.",
  },
  {
    module: "Engagement",
    endpoints: "POST /newsletter, POST /contact, POST /donations",
    description: "Spam-protected forms with explicit data protection consent capturing.",
  },
  {
    module: "Search",
    endpoints: "GET /search?q=",
    description: "Cross-entity search spanning songs, liturgical repertoire, journal posts, and products.",
  },
];

export const USER_ROLES = [
  {
    role: "Super Admin",
    access: "All settings, users, integrations, backups, database maintenance",
    assignedTo: "Lead Developer / Choir Tech Lead",
  },
  {
    role: "Content Editor",
    access: "Pages, journal posts, events, photo gallery (publishes with workflow approval)",
    assignedTo: "Choir Secretary / Communications Lead",
  },
  {
    role: "Music Director",
    access: "Albums, songs, scores, rehearsal tracks, repertoire tags",
    assignedTo: "Choir Master / Organist",
  },
  {
    role: "Shop Manager",
    access: "Products, stock management, order fulfillment, delivery tracking",
    assignedTo: "Choir Merchandise Committee",
  },
  {
    role: "Treasurer",
    access: "Read-only orders, financial logs, refund records, one-click CSV/Excel exports",
    assignedTo: "Choir Treasurer",
  },
  {
    role: "Booking Officer",
    access: "Wedding/funeral booking requests, calendar availability, quotation status",
    assignedTo: "Choir Patron / Bookings Representative",
  },
  {
    role: "Choir Member",
    access: "Personal profile, rehearsal schedule, voice-part practice tracks, internal notices",
    assignedTo: "Active Choir Singers (Soprano, Alto, Tenor, Bass)",
  },
  {
    role: "Visitor / Customer",
    access: "Public site, streaming previews, guest checkout, personal order downloads",
    assignedTo: "General Public & Parishioners",
  },
];

export const CHOIR_PREREQUISITES = [
  {
    id: "story",
    title: "Real Choir History & Foundation Facts",
    description: "Year founded, parish history, founding members, diocesan milestones, and archival photos.",
    impact: "Section 4.1 & 5.1",
    urgency: "High",
    responsibleParty: "Choir Chairperson & Elders",
    status: "Pending from Choir",
  },
  {
    id: "values",
    title: "Mission, Vision & Core Values in Native Voice",
    description: "Concrete practices behind each value in the choir's own words, not generic corporate text.",
    impact: "Section 4.2",
    urgency: "High",
    responsibleParty: "Choir Executive Committee",
    status: "Pending from Choir",
  },
  {
    id: "media",
    title: "Documentary Photography & Consent Logs",
    description: "High-resolution rehearsal, Mass, and concert photos, including signed parental consent for children.",
    impact: "Section 3.4 & 10",
    urgency: "High",
    responsibleParty: "Choir Media Team / Photographer",
    status: "Pending from Choir",
  },
  {
    id: "rights",
    title: "Music Copyrights, Composer Shares & Masters",
    description: "List of original songs, written royalty agreements with composers, audio masters, and clear scores.",
    impact: "Section 9 & 12.2",
    urgency: "Critical",
    responsibleParty: "Music Director & Composers",
    status: "Pending from Choir",
  },
  {
    id: "commerce",
    title: "Product Pricing & Bank / M-Pesa Signatories",
    description: "Prices for digital albums, USBs, scores; delivery rates; verified business Till or Paybill credentials.",
    impact: "Section 9",
    urgency: "Critical",
    responsibleParty: "Choir Treasurer & Parish Priest",
    status: "Pending from Choir",
  },
  {
    id: "logo",
    title: "High-Resolution Vector Logo (SVG / AI)",
    description: "Current file is only 160x160 px low-res; vector artwork required for retina displays and print.",
    impact: "Section 3.6",
    urgency: "Medium",
    responsibleParty: "Graphic Designer / Choir Secretary",
    status: "Pending from Choir",
  },
  {
    id: "sec58",
    title: "Clarification of 'SEC 58' Nomenclature",
    description: "Exact branding convention for 'SEC 58 Nakuru' across the website header, footer, and legal copy.",
    impact: "Section 3.6",
    urgency: "Medium",
    responsibleParty: "Choir Executive Committee",
    status: "Pending from Choir",
  },
  {
    id: "services",
    title: "Booking Services & Standard Operating Procedures",
    description: "Pricing and requirements for Sunday Masses, weddings, funerals, and out-of-town festival bookings.",
    impact: "Section 4.3",
    urgency: "High",
    responsibleParty: "Music Director & Bookings Officer",
    status: "Pending from Choir",
  },
  {
    id: "budget",
    title: "Budget Range & Launch Target Date",
    description: "Confirmed budget for developer days, hosting, domains, SMS gateway credits, and target go-live date.",
    impact: "Section 11 & 12",
    urgency: "Critical",
    responsibleParty: "Choir Treasurer & Executive",
    status: "Pending from Choir",
  },
];

export const ANTI_TEMPLATE_RULES = [
  {
    id: 1,
    rule: "Contains Real Photo / Audio Proof",
    description: "Does the page contain at least one real photo or recording of the choir, not a stock image?",
    failureRisk: "Reads as machine-made or generic organization template",
  },
  {
    id: 2,
    rule: "Non-Interchangeable Content",
    description: "Could this section be pasted onto any other organisation's website? If yes, rewrite with specifics.",
    failureRisk: "Loss of distinct Catholic choir identity and authentic voice",
  },
  {
    id: 3,
    rule: "Zero Placeholder / Lorem Text",
    description: "Is there any placeholder or instruction text ('use this area to feature...')? Must be removed entirely.",
    failureRisk: "Page cannot go live until genuine content exists",
  },
  {
    id: 4,
    rule: "Layout Asymmetry & Variety",
    description: "Are three or more identical cards in a row used without reason? Layout must vary rhythm.",
    failureRisk: "Repetitive card fatigue common in cheap template builders",
  },
  {
    id: 5,
    rule: "Restrained Aesthetic (No Slop)",
    description: "Are gradients, glass blur, glowing shadows, or emoji used for decoration? Must be stripped out.",
    failureRisk: "Violates the printed concert programme and hymn book aesthetic",
  },
  {
    id: 6,
    rule: "Headline Specificity",
    description: "Is the headline specific (a fact, a name, a feeling) rather than a vague corporate slogan?",
    failureRisk: "Generic marketing fluff like 'Award-winning passion in music'",
  },
  {
    id: 7,
    rule: "Claim-to-Proof Adjacency",
    description: "Does every claim have verifiable evidence nearby (date, recording, testimonial, photo)?",
    failureRisk: "Unsubstantiated marketing statements undermine ministry credibility",
  },
  {
    id: 8,
    rule: "360px Mobile Usability",
    description: "Does the page work on a 360 px phone with one hand, on a slow 3G/4G cellular connection?",
    failureRisk: "Excludes everyday Kenyan mobile parishioners and choir members",
  },
  {
    id: 9,
    rule: "Accessibility & Zoom Compliance",
    description: "Does motion respect reduced-motion settings, and is text readable at 200 percent zoom?",
    failureRisk: "Excludes older readers during evening church rehearsals",
  },
  {
    id: 10,
    rule: "Parishioner Recognition Test",
    description: "Would an ordinary parishioner immediately recognise their own choir in this page?",
    failureRisk: "The ultimate litmus test of cultural authenticity and local belonging",
  },
];

export const SECTION_ANALYSIS = [
  {
    number: "01",
    title: "Project Brief and What Changed",
    page: 2,
    summary: "Establishes St. Monica Choir Nakuru as a unique brand rather than a replica of the KMK Makuburi site. Defines 5 core jobs for the website and introduces the Version 3 sky-blue design language derived from the choir's emblem.",
    keyQuotes: [
      "The KMK Makuburi site was a reference for what a choir site can do, not for how it should look.",
      "The site has five jobs: Introduce the choir properly, Show professional values and skills, Let people hear us, Sell the choir's own music and merchandise, Be easy to run by choir officials.",
    ],
    developerInsights: "Smart architectural decoupling: The lead engineer clearly separates functional benchmarking from visual mimicry. Moving from a monolithic template to a headless Next.js + Django stack provides enterprise-grade performance while preserving editorial dignity.",
  },
  {
    number: "02",
    title: "Why Many Choir Sites Feel Generic, and How We Avoid It",
    page: 2,
    summary: "Systematic critique of common AI-generated and commercial WordPress habits (slogan heroes, identical value card grids, lorem ipsum placeholders, vague boasts) and provides concrete counter-measures.",
    keyQuotes: [
      "Open with a real moment: full-bleed photo or video of the choir singing, a short line in our own voice, and a play button for a real recording.",
      "Values written as short statements with a concrete practice behind each, set in an editorial layout.",
    ],
    developerInsights: "This section serves as an anti-slop design manifesto. It enforces an editorial rigor where no component exists without proof and context.",
  },
  {
    number: "03",
    title: "Brand and Visual Direction (The New Theme)",
    page: 3,
    summary: "Defines the core design concept: 'The Concert Programme'. Details the 5-color palette, Fraunces and Source Sans typography, 5-line music-stave dividers, Roman numerals, and SVG vectorization requirements for the 160x160 logo.",
    keyQuotes: [
      "The look borrows from a printed concert programme and a hymn book, set in an open sky-blue palette: light paper, deep navy ink, serif headlines, music-stave lines as dividers.",
      "Night Navy #0C2340, Sky Mist #EAF4FB, Logo Blue #1058A8, Sky Blue #7EC8F0, Star Gold #E0A526.",
    ],
    developerInsights: "A thoughtful, tactile domain design system that feels authentic to liturgical traditions. The reliance on WCAG-compliant color contrast guarantees readability.",
  },
  {
    number: "04",
    title: "Telling the Choir's Story: About, Values and Skills",
    page: 5,
    summary: "Structural breakdown of narrative content. Divides the About page into 8 distinct blocks, defines 6 operational values backed by real evidence, and structures 7 specialized choral service lines with proof blocks.",
    keyQuotes: [
      "This is the heart of the site. Content below is a structure; the choir must supply real facts, and I will not invent them.",
      "Supporting proof blocks: numbers, testimonials from priests and parish leaders, and a downloadable press kit for organisers.",
    ],
    developerInsights: "Essential boundary setting: the developer refuses to hallucinate facts, demanding that the choir supply real dates, milestones, and testimonies.",
  },
  {
    number: "05",
    title: "Site Map and Page Designs",
    page: 6,
    summary: "Complete 10-section architectural sitemap and 10-block chronological homepage hierarchy, balancing emotional storytelling, instant audio discovery, service commercialization, and member utility.",
    keyQuotes: [
      "Home page layout: 1. Opening, 2. Who we are, 3. Latest release, 4. What we do, 5. Our values, 6. Next events, 7. In the choir's words, 8. Shop highlights, 9. Join or book, 10. Footer.",
    ],
    developerInsights: "High conversion logic: users hear music in Block 1 & 3, discover parish capabilities in Block 4, and encounter clear conversion paths in Block 9.",
  },
  {
    number: "06",
    title: "Features: Core and Added",
    page: 7,
    summary: "MoSCoW-style feature prioritization matrix categorizing must-haves (persistent audio player, repertoire browser, booking system, M-Pesa payments) versus secondary enhancements (Mass planner, QR concert ticketing, PWA).",
    keyQuotes: [
      "Persistent audio player: Keeps playing while visitors browse; lock-screen controls on phones [Must].",
      "Mass planner for parish choirs: Visitors pick songs for a Sunday or feast and export a one-page programme PDF [Should].",
    ],
    developerInsights: "Prioritizing the persistent audio player and M-Pesa is critical for East African adoption. The Mass Planner is a genius viral retention tool for church choirmasters across Kenya.",
  },
  {
    number: "07",
    title: "Front-End Plan",
    page: 9,
    summary: "Modern frontend stack specification: Next.js App Router, Tailwind CSS design tokens, Radix UI primitives, Zustand for global audio/cart state, Media Session API, next-intl for English & Swahili, and strict performance budgets.",
    keyQuotes: [
      "Largest Contentful Paint under 2.5 s on mid-range Android over 4G; Interaction to Next Paint under 200 ms; layout shift under 0.1.",
      "Initial JavaScript under about 170 KB compressed; audio and heavy images loaded only when needed.",
    ],
    developerInsights: "Technical choices reflect real Kenyan mobile constraints (data costs, low-end Androids, variable 4G networks) rather than desktop-heavy luxury engineering.",
  },
  {
    number: "08",
    title: "Back-End Plan",
    page: 10,
    summary: "Headless backend architecture pairing Django REST Framework with Wagtail CMS, PostgreSQL, Celery, Redis, and Cloudflare CDN. Outlines 12 REST API modules, comprehensive entity models, and 8 role-based access levels.",
    keyQuotes: [
      "Why Django and Wagtail: secure by default, a proven admin, strong support for multilingual content, and a clean API for the Next.js front end.",
      "8 distinct roles from Super Admin to Choir Member and Visitor.",
    ],
    developerInsights: "Wagtail CMS solves the common problem where non-technical choir secretaries break page layouts, while Django provides bulletproof financial transactions and RBAC.",
  },
  {
    number: "09",
    title: "Music Store, Payments and Delivery",
    page: 13,
    summary: "Detailed commercial infrastructure: mobile-first M-Pesa STK Push and card checkout, server-verified webhooks, signed expiring download links, physical delivery logistics across Nakuru and Kenya, and copyright licensing.",
    keyQuotes: [
      "Payments: launch with a Kenya-ready aggregator offering M-Pesa and cards; add direct Daraja STK Push if fees justify.",
      "Sell only music the choir owns or is licensed to sell; agree royalty shares with composers in writing; consider MCSK registration.",
    ],
    developerInsights: "Crucial legal and operational safeguard: addressing composer royalties and tax status early prevents costly copyright disputes common in Kenyan gospel and choral circles.",
  },
  {
    number: "10",
    title: "Quality Standards: Speed, Accessibility, SEO, Security",
    page: 13,
    summary: "Establishment of rigorous non-functional requirements across 7 pillars: Lighthouse CI performance, WCAG 2.2 AA accessibility, JSON-LD Schema.org SEO, OWASP Top 10 security, KDPA 2019 compliance, and parental photo consent logs.",
    keyQuotes: [
      "Kenya Data Protection Act 2019: consent, privacy policy, deletion, data minimisation; check ODPC registration needs.",
      "Consent for photos, especially of children.",
    ],
    developerInsights: "Exemplary professional standard: incorporating child photo consent logs and ODPC registration demonstrates legal maturity rare in religious non-profit web projects.",
  },
  {
    number: "11",
    title: "Delivery Plan, Sprints and Effort",
    page: 14,
    summary: "Comprehensive delivery roadmap detailing 6 two-week build sprints preceded by 2 weeks of Discovery and concluded with 2 weeks of Launch Testing (16-20 weeks total). Estimates 74-100 developer days with a 10-week fast-track option.",
    keyQuotes: [
      "Six two-week sprints (about 12 weeks of build) plus 2 weeks of discovery and 2 of testing and launch. Effort: 74-100 developer days.",
      "A faster path: launch the public site, audio player and digital store by about week 10, and release the member portal and ticketing after launch.",
    ],
    developerInsights: "Realistic agile estimation. The fast-path option provides an executive risk valve to secure early revenue before investing in complex member portal features.",
  },
  {
    number: "12",
    title: "Team, Risks and What I Need from the Choir",
    page: 15,
    summary: "Maps out the 7-person team RACI matrix, outlines 6 critical project risks with concrete mitigations, and presents a 9-item checklist of non-negotiable assets required from the choir leadership before kickoff.",
    keyQuotes: [
      "Key risks: Real content arrives late, Rights to songs unclear, Payment account approvals take time, Over-ambitious scope, Maintenance falls on one person, Heavy media slows the site.",
    ],
    developerInsights: "The development lead protects both parties by making dependencies explicit. The primary risk in church web projects is content bottlenecks from unpaid volunteer committees.",
  },
  {
    number: "13",
    title: "Design Review Checklist (Anti-Template Test)",
    page: 16,
    summary: "A 10-point qualitative and quantitative design evaluation rubric. Imposes a strict rule: if more than 2 criteria fail on any page design, the section must be scrapped and redesigned.",
    keyQuotes: [
      "Before each design is approved, check every item. If more than two fail, redesign the section.",
      "Would a parishioner recognise their own choir in this page?",
    ],
    developerInsights: "An objective gating mechanism that stops subjective stakeholder committee arguments and protects the distinct visual identity of St. Monica Choir.",
  },
];

export const SAMPLE_REPERTOIRE = [
  {
    id: "rep-1",
    title: "Mtakatifu Monica Mama Mwema",
    composer: "Bernard Mukasa",
    season: "Patronal Feast (Ordinary Time)",
    partOfMass: "Entrance / Communion",
    language: "Kiswahili",
    voicing: "SATB + Percussion",
    key: "F Major",
    audioSampleUrl: "preview_sample_monica.mp3",
    duration: "4:12",
    hasScore: true,
    scorePriceKes: 300,
  },
  {
    id: "rep-2",
    title: "Misa ya Mtakatifu Fransisko (Kyrie & Gloria)",
    composer: "Fr. John Fernandes",
    season: "Lent / Ordinary Time",
    partOfMass: "Kyrie & Gloria",
    language: "Kiswahili",
    voicing: "SATB + Organ",
    key: "D Minor",
    audioSampleUrl: "preview_kyrie.mp3",
    duration: "3:45",
    hasScore: true,
    scorePriceKes: 450,
  },
  {
    id: "rep-3",
    title: "Tazameni Mungu Wetu Yuaja",
    composer: "B. Mukasa",
    season: "Advent",
    partOfMass: "Entrance",
    language: "Kiswahili",
    voicing: "SATB + Kayamba",
    key: "G Major",
    audioSampleUrl: "preview_advent.mp3",
    duration: "3:20",
    hasScore: true,
    scorePriceKes: 250,
  },
  {
    id: "rep-4",
    title: "Ave Maria (Choral Meditation)",
    composer: "Traditional arr. Nakuru",
    season: "Marian Feasts / Weddings",
    partOfMass: "Offertory / Meditation",
    language: "Latin & Kiswahili",
    voicing: "SATB a cappella",
    key: "E-flat Major",
    audioSampleUrl: "preview_ave_maria.mp3",
    duration: "4:50",
    hasScore: true,
    scorePriceKes: 500,
  },
  {
    id: "rep-5",
    title: "Kristo Amefufuka Aleluya",
    composer: "C. Opondo",
    season: "Easter",
    partOfMass: "Responsorial / Recessional",
    language: "Kiswahili",
    voicing: "SATB + Brass",
    key: "C Major",
    audioSampleUrl: "preview_easter.mp3",
    duration: "5:10",
    hasScore: true,
    scorePriceKes: 350,
  },
];
