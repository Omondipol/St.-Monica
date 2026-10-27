import React, { useState, useEffect } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { ImageUploadField, PresetImageOption } from '../ImageUploadField';
import { ChoirLogo } from '../ChoirLogo';
import { AfricanGeometricBorder } from '../AfricanGeometricBorder';
import { Save, Image as ImageIcon, BookOpen, User, Church, Layers, Check, RotateCcw, Sparkles, Eye } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';

interface AdminHomepageTabProps {
  onNotify: (msg: string) => void;
}

export const AdminHomepageTab: React.FC<AdminHomepageTabProps> = ({ onNotify }) => {
  const {
    lang,
    customLogoUrl,
    updateCustomLogoUrl,
    heroSlides,
    updateHeroSlides,
    updateSingleHeroSlide,
    parishMessage,
    updateParishMessage,
    scriptureQuote,
    updateScriptureQuote,
    choirmasterMessage,
    updateChoirmasterMessage,
    leadersList,
    updateLeader
  } = useChoir();

  // Active sub-section
  const [subSection, setSubSection] = useState<'logo' | 'slideshow' | 'parish' | 'scripture' | 'choirmaster'>('logo');
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);

  // Logo preset options
  const logoPresets: PresetImageOption[] = [
    { label: 'Transparent Gold Seal (Official)', url: './logo/st_monica_seal_final_transparent.png' },
    { label: 'High-Res Circular Seal (PNG)', url: './logo/st_monica_choir_seal.png' },
    { label: 'Vector Heraldic Seal (SVG)', url: './logo/st_monica_choir_seal.svg' }
  ];

  // Authentic Choir photo presets for hero & backgrounds
  const photoPresets: PresetImageOption[] = [
    { label: 'Full Choir Ensemble (Choir 01)', url: '/assets/choir/choir_01.jpg' },
    { label: 'Liturgical Vestments (Choir 02)', url: '/assets/choir/choir_02.jpg' },
    { label: 'Reverent Prayer Sanctuary (Choir 03)', url: '/assets/choir/choir_03.jpg' },
    { label: 'SATB Voicing in Robes (Choir 04)', url: '/assets/choir/choir_04.jpg' },
    { label: 'Festive Singing Praise (Choir 05)', url: '/assets/choir/choir_05.jpg' },
    { label: 'Choir Assembly (Choir 06)', url: '/assets/choir/choir_06.jpg' },
    { label: 'Choirmaster Directing (Choir 07)', url: '/assets/choir/choir_07.jpg' },
    { label: 'Sunday High Mass (Choir 08)', url: '/assets/choir/choir_08.jpg' },
    { label: 'Thanksgiving Praise (Choir 09)', url: '/assets/choir/choir_09.jpg' },
    { label: 'Soprano & Alto (Choir 10)', url: '/assets/choir/choir_10.jpg' },
    { label: 'Tenor & Bass (Choir 11)', url: '/assets/choir/choir_11.jpg' },
    { label: 'Mwalimu Atebe Mark T.', url: '/assets/choir/choir_leader_02.jpg' }
  ];

  // Local draft states
  const [logoInput, setLogoInput] = useState<string>(customLogoUrl || '');

  const [parishForm, setParishForm] = useState({
    titleEn: parishMessage?.titleEn || '',
    titleSw: parishMessage?.titleSw || '',
    body1En: parishMessage?.body1En || '',
    body1Sw: parishMessage?.body1Sw || '',
    body2En: parishMessage?.body2En || '',
    body2Sw: parishMessage?.body2Sw || '',
    churchImg: parishMessage?.churchImg || '',
    churchName: parishMessage?.churchName || '',
    churchSubtitle: parishMessage?.churchSubtitle || '',
    mapsUrl: parishMessage?.mapsUrl || ''
  });

  const [scriptureForm, setScriptureForm] = useState({
    categoryEn: scriptureQuote?.categoryEn || '',
    categorySw: scriptureQuote?.categorySw || '',
    textEn: scriptureQuote?.textEn || '',
    textSw: scriptureQuote?.textSw || '',
    citationEn: scriptureQuote?.citationEn || '',
    citationSw: scriptureQuote?.citationSw || '',
    bgImage: scriptureQuote?.bgImage || ''
  });

  const [choirmasterForm, setChoirmasterForm] = useState({
    titleEn: choirmasterMessage?.titleEn || '',
    titleSw: choirmasterMessage?.titleSw || '',
    messageEn: choirmasterMessage?.messageEn || '',
    messageSw: choirmasterMessage?.messageSw || '',
    name: choirmasterMessage?.name || '',
    roleEn: choirmasterMessage?.roleEn || '',
    roleSw: choirmasterMessage?.roleSw || '',
    image: choirmasterMessage?.image || ''
  });

  // Keep local draft states in sync if context values update
  useEffect(() => {
    if (parishMessage) {
      setParishForm({
        titleEn: parishMessage.titleEn || '',
        titleSw: parishMessage.titleSw || '',
        body1En: parishMessage.body1En || '',
        body1Sw: parishMessage.body1Sw || '',
        body2En: parishMessage.body2En || '',
        body2Sw: parishMessage.body2Sw || '',
        churchImg: parishMessage.churchImg || '',
        churchName: parishMessage.churchName || '',
        churchSubtitle: parishMessage.churchSubtitle || '',
        mapsUrl: parishMessage.mapsUrl || ''
      });
    }
  }, [parishMessage]);

  useEffect(() => {
    if (scriptureQuote) {
      setScriptureForm({
        categoryEn: scriptureQuote.categoryEn || '',
        categorySw: scriptureQuote.categorySw || '',
        textEn: scriptureQuote.textEn || '',
        textSw: scriptureQuote.textSw || '',
        citationEn: scriptureQuote.citationEn || '',
        citationSw: scriptureQuote.citationSw || '',
        bgImage: scriptureQuote.bgImage || ''
      });
    }
  }, [scriptureQuote]);

  useEffect(() => {
    if (choirmasterMessage) {
      setChoirmasterForm({
        titleEn: choirmasterMessage.titleEn || '',
        titleSw: choirmasterMessage.titleSw || '',
        messageEn: choirmasterMessage.messageEn || '',
        messageSw: choirmasterMessage.messageSw || '',
        name: choirmasterMessage.name || '',
        roleEn: choirmasterMessage.roleEn || '',
        roleSw: choirmasterMessage.roleSw || '',
        image: choirmasterMessage.image || ''
      });
    }
  }, [choirmasterMessage]);

  // Handle Logo Save
  const handleSaveLogo = () => {
    updateCustomLogoUrl(logoInput.trim());
    onNotify(lang === 'sw' ? 'Nembo ya kwaya imehifadhiwa kikamilifu!' : 'Choir logo updated and saved live!');
  };

  // Handle Logo Reset
  const handleResetLogo = () => {
    setLogoInput('');
    updateCustomLogoUrl('');
    onNotify(lang === 'sw' ? 'Nembo imerejeshwa kwenye nembo rasmi!' : 'Logo reset to official default seal!');
  };

  // Handle Parish Message Save
  const handleSaveParishMessage = (e: React.FormEvent) => {
    e.preventDefault();
    updateParishMessage(parishForm);
    onNotify(lang === 'sw' ? 'Ujumbe wa Parokia na picha ya kanisa zimehifadhiwa!' : 'Parish message and church photo saved live!');
  };

  // Handle Scripture Quote Save
  const handleSaveScripture = (e: React.FormEvent) => {
    e.preventDefault();
    updateScriptureQuote(scriptureForm);
    onNotify(lang === 'sw' ? 'Nukuu ya Biblia na picha ya mandhari zimehifadhiwa!' : 'Bible scripture quote and background saved live!');
  };

  // Handle Choirmaster Message Save
  const handleSaveChoirmaster = (e: React.FormEvent) => {
    e.preventDefault();
    updateChoirmasterMessage(choirmasterForm);

    // Also sync the director/choirmaster leader in Trainers & Officials roster
    const directorLeader = leadersList?.find(l => 
      l.id === 'ldr-director' || 
      (l.role && (l.role.toLowerCase().includes('choirmaster') || l.role.toLowerCase().includes('music director')))
    );
    if (directorLeader) {
      updateLeader(directorLeader.id, {
        photoUrl: choirmasterForm.image,
        name: choirmasterForm.name || directorLeader.name,
        role: choirmasterForm.roleEn || directorLeader.role,
        roleSw: choirmasterForm.roleSw || directorLeader.roleSw
      });
    }

    onNotify(lang === 'sw' ? 'Ujumbe na picha ya Mwalimu wa Kwaya zimehifadhiwa na kuunganishwa!' : 'Choirmaster message and photo saved and synchronized across website!');
  };

  const currentSlide = heroSlides?.[selectedSlideIndex] || {
    id: `hero-slide-${selectedSlideIndex + 1}`,
    src: '',
    srcMobile: '',
    alt: '',
    description: '',
    eyebrowEn: '',
    eyebrowSw: '',
    headlineEn: '',
    headlineSw: '',
    attributionEn: '',
    attributionSw: '',
    descEn: '',
    descSw: ''
  };

  const handleUpdateCurrentSlideField = (field: string, val: string) => {
    if (field === 'src') {
      updateSingleHeroSlide(selectedSlideIndex, { src: val, srcMobile: val });
    } else {
      updateSingleHeroSlide(selectedSlideIndex, { [field]: val });
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar inside Homepage Visuals */}
      <div className="bg-white rounded-2xl border border-[#0C2340]/10 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setSubSection('logo')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            subSection === 'logo'
              ? 'bg-[#1058A8] text-white shadow-xs'
              : 'text-[#0C2340]/80 hover:bg-[#EAF4FB]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>1. Choir Logo (Nembo)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection('slideshow')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            subSection === 'slideshow'
              ? 'bg-[#1058A8] text-white shadow-xs'
              : 'text-[#0C2340]/80 hover:bg-[#EAF4FB]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Hero Slideshow (Picha 4 za Mwanzo)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection('parish')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            subSection === 'parish'
              ? 'bg-[#1058A8] text-white shadow-xs'
              : 'text-[#0C2340]/80 hover:bg-[#EAF4FB]'
          }`}
        >
          <Church className="w-3.5 h-3.5" />
          <span>3. Parish Message & Church Photo</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection('scripture')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            subSection === 'scripture'
              ? 'bg-[#1058A8] text-white shadow-xs'
              : 'text-[#0C2340]/80 hover:bg-[#EAF4FB]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>4. Bible Scripture Quote</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection('choirmaster')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            subSection === 'choirmaster'
              ? 'bg-[#1058A8] text-white shadow-xs'
              : 'text-[#0C2340]/80 hover:bg-[#EAF4FB]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>5. Choirmaster Word & Picture</span>
        </button>
      </div>

      {/* SUB-SECTION 1: CHOIR LOGO */}
      {subSection === 'logo' && (
        <div className="bg-white rounded-3xl border border-[#0C2340]/10 shadow-sm overflow-hidden">
          <AfricanGeometricBorder />
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0C2340]/10">
              <div>
                <h3 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                  Official Choir Logo & Seal
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-source mt-1">
                  Change the choir logo displayed in the header, footer, modal inspection, and documents. Upload a new image or pick from official heraldic seals.
                </p>
                <p className="text-[11px] text-slate-400 font-source italic mt-0.5">
                  (Badilisha Nembo ya Kwaya: Pakia picha mpya au chagua nembo rasmi)
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                Live On Entire Website
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#FAF8F5] p-6 rounded-2xl border border-[#0C2340]/10">
              {/* Live Preview Display */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-[#0C2340]/15 shadow-xs text-center space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-source">
                  {lang === 'sw' ? 'Muonekano wa Sasa' : 'Logo Preview'}
                </span>
                <div className="p-3 bg-[#0C1420] rounded-2xl border border-amber-400/20 shadow-md w-28 h-28 flex items-center justify-center">
                  {logoInput ? (
                    <img
                      src={logoInput}
                      alt="Selected Choir Logo"
                      className="w-20 h-20 object-contain drop-shadow"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <ChoirLogo size={96} showText={false} />
                  )}
                </div>
                <div className="pt-1">
                  <strong className="text-sm font-bold text-[#0C2340] font-eb-garamond block">
                    St. Monica Catholic Choir
                  </strong>
                  <span className="text-xs text-[#1058A8] font-semibold font-source">
                    Section 58 · Nakuru
                  </span>
                </div>
              </div>

              {/* Upload & Configuration Form */}
              <div className="md:col-span-8 space-y-5">
                <ImageUploadField
                  label={lang === 'sw' ? 'Nembo ya Kwaya' : 'Choir Logo'}
                  labelSw={lang === 'sw' ? 'Pakia nembo mpya au chagua hapa chini' : undefined}
                  value={logoInput}
                  onChange={setLogoInput}
                  defaultValue="./logo/st_monica_seal_final_transparent.png"
                  helpText={lang === 'sw' ? 'Badilisha nembo inayoonekana kwenye tovuti na nyaraka zote.' : 'Change the logo shown on the website and printed documents.'}
                  presets={logoPresets}
                  aspectRatio="aspect-square"
                />

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveLogo}
                    className="px-6 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>{lang === 'sw' ? 'Hifadhi mabadiliko' : 'Save changes'}</span>
                  </button>

                  {customLogoUrl && (
                    <button
                      type="button"
                      onClick={handleResetLogo}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lang === 'sw' ? 'Rejesha nembo rasmi' : 'Reset to default seal'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: HERO SLIDESHOW (4 SLIDES) */}
      {subSection === 'slideshow' && (
        <div className="bg-white rounded-3xl border border-[#0C2340]/10 shadow-sm overflow-hidden">
          <AfricanGeometricBorder />
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0C2340]/10">
              <div>
                <h3 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                  Homepage Main Slideshow (4 Rotating Slides)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-source mt-1">
                  Customize photography, alt text, bilingual headline, attribution, and description for each of the four homepage carousel slides.
                </p>
                <p className="text-[11px] text-slate-400 font-source italic mt-0.5">
                  (Picha 4 za slaidi ya kwanza: Badilisha picha, vichwa vya habari, na maneno)
                </p>
              </div>
              <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 shrink-0">
                Autoplay 7s Crossfade
              </span>
            </div>

            {/* Slide Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[0, 1, 2, 3].map((idx) => {
                const s = heroSlides?.[idx];
                const isSelected = selectedSlideIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSlideIndex(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#1058A8] ring-2 ring-[#7EC8F0]/40 bg-[#EAF4FB]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0C2340]">
                        Slide {idx + 1}
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#1058A8]" />}
                    </div>
                    <span className="text-[11px] text-slate-500 font-source truncate mt-1">
                      {s?.description || `Hero Slide ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Slide Editor */}
            <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#0C2340]/10 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-[#1058A8] uppercase tracking-wider font-source flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Editing Slide {selectedSlideIndex + 1}: {currentSlide.description || `Slide ${selectedSlideIndex + 1}`}</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold font-source flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Updates homepage immediately</span>
                </span>
              </div>

              {/* Visual Live Preview of Slide in Admin */}
              <div className="rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-sm relative aspect-21/9 sm:aspect-16/7 bg-[#0C2340] flex items-center">
                <img
                  src={getAssetUrl(currentSlide.src || photoPresets[selectedSlideIndex]?.url || '/assets/choir/choir_01.jpg')}
                  alt={currentSlide.alt || 'Slide preview'}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-70"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/65 to-transparent" />
                <div className="relative z-10 p-5 sm:p-7 max-w-lg text-white space-y-1.5">
                  <span className="text-[10px] sm:text-xs font-bold text-[#7EC8F0] uppercase tracking-wider block font-source">
                    {lang === 'sw' ? currentSlide.eyebrowSw || currentSlide.eyebrowEn : currentSlide.eyebrowEn || currentSlide.eyebrowSw}
                  </span>
                  <h4 className="font-eb-garamond text-lg sm:text-2xl font-bold leading-tight">
                    {lang === 'sw' ? currentSlide.headlineSw || currentSlide.headlineEn : currentSlide.headlineEn || currentSlide.headlineSw}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-2 font-source">
                    {lang === 'sw' ? currentSlide.descSw || currentSlide.descEn : currentSlide.descEn || currentSlide.descSw}
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="bg-[#1058A8] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg font-source">
                      Slide {selectedSlideIndex + 1} Live View
                    </span>
                  </div>
                </div>
              </div>

              {/* Slide Image Upload */}
              <div className="space-y-4">
                <ImageUploadField
                  label={`Slide ${selectedSlideIndex + 1} Main Photo (Desktop & Tablet)`}
                  labelSw={`Picha Kuu ya Slaidi ya ${selectedSlideIndex + 1} (Kompyuta na Vishikwambi)`}
                  value={currentSlide.src || ''}
                  onChange={(val) => {
                    handleUpdateCurrentSlideField('src', val);
                    onNotify(`Slide ${selectedSlideIndex + 1} image updated!`);
                  }}
                  defaultValue={photoPresets[selectedSlideIndex]?.url || '/assets/choir/choir_01.jpg'}
                  helpText="High-resolution landscape photo (1920x1080 or 16:9 ratio recommended)."
                  presets={photoPresets}
                  aspectRatio="aspect-video"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1">
                      Slide Label / Internal Name
                    </label>
                    <input
                      type="text"
                      value={currentSlide.description || ''}
                      onChange={(e) => handleUpdateCurrentSlideField('description', e.target.value)}
                      placeholder="e.g. Sunday Sung Mass Altar"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1">
                      Accessibility Image Alt Text
                    </label>
                    <input
                      type="text"
                      value={currentSlide.alt || ''}
                      onChange={(e) => handleUpdateCurrentSlideField('alt', e.target.value)}
                      placeholder="e.g. Full choir singing at Sunday Sung Mass altar"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bilingual Texts for Slide */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <span className="text-xs font-bold text-[#0C2340] uppercase tracking-wider block">
                  Bilingual Slide Typography & Text
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* English Section */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <span className="w-2 h-2 rounded-full bg-[#1058A8]" />
                      <strong className="text-xs text-[#0C2340] uppercase tracking-wider">English (Primary)</strong>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Eyebrow Header</label>
                      <input
                        type="text"
                        value={currentSlide.eyebrowEn || ''}
                        onChange={(e) => handleUpdateCurrentSlideField('eyebrowEn', e.target.value)}
                        placeholder="Four-part SATB polyphony at Section 58"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Headline Text</label>
                      <input
                        type="text"
                        value={currentSlide.headlineEn || ''}
                        onChange={(e) => handleUpdateCurrentSlideField('headlineEn', e.target.value)}
                        placeholder="Uniting hearts through sacred music"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Attribution / Sub-credit</label>
                      <input
                        type="text"
                        value={currentSlide.attributionEn || ''}
                        onChange={(e) => handleUpdateCurrentSlideField('attributionEn', e.target.value)}
                        placeholder="St. Monica Third Mass Choir · Nakuru"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description Paragraph</label>
                      <textarea
                        rows={2}
                        value={currentSlide.descEn || ''}
                        onChange={(e) => handleUpdateCurrentSlideField('descEn', e.target.value)}
                        placeholder="Four-part SATB polyphony sung every Sunday at 10:00 AM Mass..."
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  {/* Kiswahili Section */}
                  <div className="p-4 bg-white rounded-xl border border-amber-200/80 space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-amber-100">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <strong className="text-xs text-[#0C2340] uppercase tracking-wider">Kiswahili (Sehemu ya Pili)</strong>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kichwa cha Juu (Eyebrow)</label>
                      <input
                        type="text"
                        value={currentSlide.eyebrowSw || ''}
                        onChange={(e) => handleUpdateCurrentSlideField('eyebrowSw', e.target.value)}
                        placeholder="Muziki wa sauti nne (SATB) Section 58"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kichwa Kikuu (Headline)</label>
                      <input
                        type="text"
                        value={currentSlide.headlineSw || ''}
                        onChange={(e) => handleUpdateCurrentSlideField('headlineSw', e.target.value)}
                        placeholder="Kuunganisha mioyo kupitia muziki mtakatifu"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mwandishi / Chanzo (Attribution)</label>
                      <input
                        type="text"
                        value={currentSlide.attributionSw || ''}
                        onChange={(e) => handleUpdateCurrentSlideField('attributionSw', e.target.value)}
                        placeholder="Kwaya ya Misa ya Tatu, Mtakatifu Monika · Nakuru"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Maelezo (Description)</label>
                      <textarea
                        rows={2}
                        value={currentSlide.descSw || ''}
                        onChange={(e) => handleUpdateCurrentSlideField('descSw', e.target.value)}
                        placeholder="Muziki wa kiliturujia wa sauti nne kila Dominika Misa ya Saa Nne Asubuhi..."
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-source italic">
                  Changes to this slide save instantly in local storage.
                </span>
                <button
                  type="button"
                  onClick={() => onNotify(`Slide ${selectedSlideIndex + 1} saved successfully!`)}
                  className="px-5 py-2 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Slide {selectedSlideIndex + 1}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: PARISH MESSAGE & CHURCH PHOTO */}
      {subSection === 'parish' && (
        <div className="bg-white rounded-3xl border border-[#0C2340]/10 shadow-sm overflow-hidden">
          <AfricanGeometricBorder />
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0C2340]/10">
              <div>
                <h3 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                  Parish Message & St. Monica Church Photo
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-source mt-1">
                  Manage the parish greeting, history summary, St. Monica Catholic Church photo, and Google Maps location displayed on the homepage.
                </p>
                <p className="text-[11px] text-slate-400 font-source italic mt-0.5">
                  (Ujumbe wa Parokia na Picha ya Kanisa la Mtakatifu Monika)
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shrink-0">
                Homepage Section 2
              </span>
            </div>

            <form onSubmit={handleSaveParishMessage} className="space-y-6">
              {/* Church Image Upload */}
              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#0C2340]/10 space-y-4">
                <span className="text-xs font-bold text-[#0C2340] uppercase tracking-wider block">
                  St. Monica Catholic Church Sanctuary Photo
                </span>

                <ImageUploadField
                  label="Upload Church Image or Enter URL"
                  labelSw="Pakia Picha ya Kanisa au Weka Anwani ya Picha"
                  value={parishForm.churchImg}
                  onChange={(val) => {
                    setParishForm(prev => ({ ...prev, churchImg: val }));
                    updateParishMessage({ churchImg: val });
                    onNotify(lang === 'sw' ? 'Picha ya kanisa imesasishwa na kuonekana moja kwa moja!' : 'Church photo updated live on homepage!');
                  }}
                  defaultValue="/assets/choir/choir_08.jpg"
                  helpText="High-quality photo of St. Monica Catholic Church exterior or sanctuary, Section 58 Nakuru."
                  presets={photoPresets}
                  aspectRatio="aspect-[4/3]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Church Name</label>
                    <input
                      type="text"
                      value={parishForm.churchName}
                      onChange={e => setParishForm(prev => ({ ...prev, churchName: e.target.value }))}
                      placeholder="St. Monica Catholic Church"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Location Subtitle</label>
                    <input
                      type="text"
                      value={parishForm.churchSubtitle}
                      onChange={e => setParishForm(prev => ({ ...prev, churchSubtitle: e.target.value }))}
                      placeholder="Section 58, Nakuru · Catholic Diocese of Nakuru"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Google Maps Link</label>
                    <input
                      type="url"
                      value={parishForm.mapsUrl}
                      onChange={e => setParishForm(prev => ({ ...prev, mapsUrl: e.target.value }))}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Parish Message Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* English Section */}
                <div className="p-5 bg-white rounded-2xl border-2 border-[#1058A8]/30 space-y-3">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1058A8]" />
                    <strong className="text-xs text-[#0C2340] uppercase tracking-wider">English (Primary Display)</strong>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Section Heading (English)</label>
                    <input
                      type="text"
                      value={parishForm.titleEn}
                      onChange={e => setParishForm(prev => ({ ...prev, titleEn: e.target.value }))}
                      placeholder="From the Parish Altar to the Deanery and Beyond"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Paragraph 1 (English)</label>
                    <textarea
                      rows={3}
                      value={parishForm.body1En}
                      onChange={e => setParishForm(prev => ({ ...prev, body1En: e.target.value }))}
                      placeholder="St. Monica Third Mass Choir began in 2012 with a dedicated circle of choristers..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Paragraph 2 (English)</label>
                    <textarea
                      rows={3}
                      value={parishForm.body2En}
                      onChange={e => setParishForm(prev => ({ ...prev, body2En: e.target.value }))}
                      placeholder="Today, our choristers sing every Sunday in disciplined four-part harmony (SATB)..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                {/* Kiswahili Section */}
                <div className="p-5 bg-white rounded-2xl border-2 border-amber-300/60 space-y-3">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-amber-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <strong className="text-xs text-[#0C2340] uppercase tracking-wider">Kiswahili (Sehemu ya Pili)</strong>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kichwa cha Sehemu (Kiswahili)</label>
                    <input
                      type="text"
                      value={parishForm.titleSw}
                      onChange={e => setParishForm(prev => ({ ...prev, titleSw: e.target.value }))}
                      placeholder="Kutoka Altare ya Parokia Hadi Dekania na Zaidi"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Aya ya 1 (Kiswahili)</label>
                    <textarea
                      rows={3}
                      value={parishForm.body1Sw}
                      onChange={e => setParishForm(prev => ({ ...prev, body1Sw: e.target.value }))}
                      placeholder="Kwaya ya Misa ya Tatu ya Mtakatifu Monika ilianzishwa mwaka 2012..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Aya ya 2 (Kiswahili)</label>
                    <textarea
                      rows={3}
                      value={parishForm.body2Sw}
                      onChange={e => setParishForm(prev => ({ ...prev, body2Sw: e.target.value }))}
                      placeholder="Leo, tunaimba kila Dominika kwa sauti nne (Soprano, Alto, Tenor, Bass)..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-source italic">
                  Saves immediately and synchronizes the homepage parish section.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Parish Message & Church Photo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-SECTION 4: BIBLE SCRIPTURE QUOTE */}
      {subSection === 'scripture' && (
        <div className="bg-white rounded-3xl border border-[#0C2340]/10 shadow-sm overflow-hidden">
          <AfricanGeometricBorder />
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0C2340]/10">
              <div>
                <h3 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                  Homepage Scripture Quote Banner
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-source mt-1">
                  Edit the full-width sacred scripture banner, verse quotation, citation, and background photo displayed on the homepage.
                </p>
                <p className="text-[11px] text-slate-400 font-source italic mt-0.5">
                  (Nukuu ya Maandiko Matakatifu ya Biblia na Picha ya Mandhari)
                </p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 shrink-0">
                Homepage Section 4
              </span>
            </div>

            <form onSubmit={handleSaveScripture} className="space-y-6">
              {/* Background Photo */}
              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#0C2340]/10 space-y-4">
                <span className="text-xs font-bold text-[#0C2340] uppercase tracking-wider block">
                  Scripture Banner Background Photography
                </span>

                <ImageUploadField
                  label="Upload Banner Background Image or Enter URL"
                  labelSw="Pakia Picha ya Mandhari ya Nukuu ya Biblia"
                  value={scriptureForm.bgImage}
                  onChange={(val) => {
                    setScriptureForm(prev => ({ ...prev, bgImage: val }));
                    updateScriptureQuote({ bgImage: val });
                    onNotify(lang === 'sw' ? 'Picha ya mandhari ya Biblia imesasishwa moja kwa moja!' : 'Scripture background photo updated live on homepage!');
                  }}
                  defaultValue="/assets/choir/choir_03.jpg"
                  helpText="Atmospheric, reverent image of choristers singing or church sanctuary."
                  presets={photoPresets}
                  aspectRatio="aspect-video"
                />
              </div>

              {/* Bilingual Scripture Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-white rounded-2xl border-2 border-[#1058A8]/30 space-y-3">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1058A8]" />
                    <strong className="text-xs text-[#0C2340] uppercase tracking-wider">English (Primary Display)</strong>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category / Topic Title (English)</label>
                    <input
                      type="text"
                      value={scriptureForm.categoryEn}
                      onChange={e => setScriptureForm(prev => ({ ...prev, categoryEn: e.target.value }))}
                      placeholder="Sacred Scripture · Letter to the Colossians"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bible Verse Text (English)</label>
                    <textarea
                      rows={4}
                      value={scriptureForm.textEn}
                      onChange={e => setScriptureForm(prev => ({ ...prev, textEn: e.target.value }))}
                      placeholder="Let the word of Christ dwell in you richly..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Citation Reference (English)</label>
                    <input
                      type="text"
                      value={scriptureForm.citationEn}
                      onChange={e => setScriptureForm(prev => ({ ...prev, citationEn: e.target.value }))}
                      placeholder="— Colossians 3:16 (NABRE)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border-2 border-amber-300/60 space-y-3">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-amber-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <strong className="text-xs text-[#0C2340] uppercase tracking-wider">Kiswahili (Sehemu ya Pili)</strong>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kichwa cha Mada (Kiswahili)</label>
                    <input
                      type="text"
                      value={scriptureForm.categorySw}
                      onChange={e => setScriptureForm(prev => ({ ...prev, categorySw: e.target.value }))}
                      placeholder="Maandiko Matakatifu · Barua kwa Wakolosai"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Maneno ya Aya ya Biblia (Kiswahili)</label>
                    <textarea
                      rows={4}
                      value={scriptureForm.textSw}
                      onChange={e => setScriptureForm(prev => ({ ...prev, textSw: e.target.value }))}
                      placeholder="Neno la Kristo na likae kwa wingi ndani yenu..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Rejea ya Aya (Kiswahili)</label>
                    <input
                      type="text"
                      value={scriptureForm.citationSw}
                      onChange={e => setScriptureForm(prev => ({ ...prev, citationSw: e.target.value }))}
                      placeholder="— Wakolosai 3:16 (NABRE)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-source italic">
                  Updates the full-width Scripture section on the live homepage.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Scripture Quote & Photo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-SECTION 5: CHOIRMASTER WORD & PICTURE */}
      {subSection === 'choirmaster' && (
        <div className="bg-white rounded-3xl border border-[#0C2340]/10 shadow-sm overflow-hidden">
          <AfricanGeometricBorder />
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0C2340]/10">
              <div>
                <h3 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                  A Word from the Choirmaster & Director's Picture
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-source mt-1">
                  Edit the music director's welcome message, name, title, and portrait photo displayed alongside the Sunday Mass schedule on the homepage.
                </p>
                <p className="text-[11px] text-slate-400 font-source italic mt-0.5">
                  (Ujumbe na Picha ya Mwalimu Mkuu wa Kwaya)
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                Homepage Section 6
              </span>
            </div>

            <form onSubmit={handleSaveChoirmaster} className="space-y-6">
              {/* Choirmaster Photo Upload & Dynamic Leader Link */}
              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#0C2340]/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#0C2340] uppercase tracking-wider block">
                    Choirmaster / Music Director Portrait Photo
                  </span>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1">
                    <span>🔗 Linked to Trainers & Officials Profile</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-source">
                  Uploading or updating the Choirmaster's photo here or in the <strong>Trainers & Officials</strong> section automatically updates both the "Word from the Choirmaster" on the homepage and the parish leadership registry.
                </p>

                <ImageUploadField
                  label="Upload Choirmaster Photo or Enter URL"
                  labelSw="Pakia Picha ya Mwalimu au Weka Anwani ya Picha"
                  value={choirmasterForm.image}
                  onChange={(val) => {
                    setChoirmasterForm(prev => ({ ...prev, image: val }));
                    updateChoirmasterMessage({ image: val });
                    onNotify(lang === 'sw' ? 'Picha ya Mwalimu wa Kwaya imesasishwa moja kwa moja!' : 'Choirmaster photo updated live on homepage!');
                  }}
                  defaultValue="/assets/choir/choir_leader_02.jpg"
                  helpText="Clear portrait photo of Mwalimu Atebe Mark T. or presiding choirmaster."
                  presets={photoPresets}
                  aspectRatio="aspect-square"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Choirmaster Full Name</label>
                    <input
                      type="text"
                      value={choirmasterForm.name}
                      onChange={e => setChoirmasterForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Mwalimu Joseph Otieno"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Role (English)</label>
                    <input
                      type="text"
                      value={choirmasterForm.roleEn}
                      onChange={e => setChoirmasterForm(prev => ({ ...prev, roleEn: e.target.value }))}
                      placeholder="Director of Music & Choirmaster"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Wadhifa Rasmi (Kiswahili)</label>
                    <input
                      type="text"
                      value={choirmasterForm.roleSw}
                      onChange={e => setChoirmasterForm(prev => ({ ...prev, roleSw: e.target.value }))}
                      placeholder="Mkurugenzi wa Muziki na Mwalimu Mkuu"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Choirmaster Message */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-white rounded-2xl border-2 border-[#1058A8]/30 space-y-3">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1058A8]" />
                    <strong className="text-xs text-[#0C2340] uppercase tracking-wider">English (Primary Display)</strong>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Section Title (English)</label>
                    <input
                      type="text"
                      value={choirmasterForm.titleEn}
                      onChange={e => setChoirmasterForm(prev => ({ ...prev, titleEn: e.target.value }))}
                      placeholder="A Word from the Choirmaster"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Director's Message (English)</label>
                    <textarea
                      rows={5}
                      value={choirmasterForm.messageEn}
                      onChange={e => setChoirmasterForm(prev => ({ ...prev, messageEn: e.target.value }))}
                      placeholder="Welcome to the musical home of St. Monica Third Mass Choir, Nakuru..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border-2 border-amber-300/60 space-y-3">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-amber-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <strong className="text-xs text-[#0C2340] uppercase tracking-wider">Kiswahili (Sehemu ya Pili)</strong>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kichwa cha Sehemu (Kiswahili)</label>
                    <input
                      type="text"
                      value={choirmasterForm.titleSw}
                      onChange={e => setChoirmasterForm(prev => ({ ...prev, titleSw: e.target.value }))}
                      placeholder="Ujumbe Kutoka kwa Mwalimu wa Kwaya"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ujumbe wa Mwalimu (Kiswahili)</label>
                    <textarea
                      rows={5}
                      value={choirmasterForm.messageSw}
                      onChange={e => setChoirmasterForm(prev => ({ ...prev, messageSw: e.target.value }))}
                      placeholder="Karibu sana kwenye jukwaa la muziki la Kwaya ya Misa ya Tatu ya Mtakatifu Monika..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-source italic">
                  Saves immediately and synchronizes the homepage choirmaster section.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Choirmaster Word & Picture</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
