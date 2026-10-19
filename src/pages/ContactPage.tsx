import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Send, CheckCircle2, ExternalLink, MessageCircle, MapPin, Navigation, Copy, Check } from 'lucide-react';
import { CHOIR_STATS } from '../data/choirContent';
import churchImg from '../assets/images/st_monica_parish_church_nakuru_1791446429035.jpg';
import { AfricanGeometricBorder } from '../components/AfricanGeometricBorder';

export const ContactPage: React.FC = () => {
  const { lang } = useChoir();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('I want to join the choir');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // Feedback states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedName, setSubmittedName] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCoord, setCopiedCoord] = useState(false);

  const handleCopyCoord = () => {
    navigator.clipboard?.writeText(CHOIR_STATS.coordinatesDisplay || '-0.284525, 36.094012');
    setCopiedCoord(true);
    setTimeout(() => setCopiedCoord(false), 2200);
  };

  const validatePhone = (num: string): boolean => {
    const cleaned = num.replace(/[\s\-\(\)]/g, '');
    return /^(?:\+254|0)[17]\d{8}$/.test(cleaned) || cleaned.length >= 9;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) {
      return;
    }

    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = lang === 'sw' ? 'Tafadhali ingiza jina lako kamili.' : 'Please enter your full name.';
    }

    if (!phone.trim()) {
      newErrors.phone = lang === 'sw' ? 'Nambari ya simu inahitajika.' : 'Phone number is required.';
    } else if (!validatePhone(phone)) {
      newErrors.phone = lang === 'sw' 
        ? 'Tafadhali weka nambari sahihi ya simu (mfano 0712 345 678).' 
        : 'Please provide a valid phone number (e.g. 0712 345 678).';
    }

    if (!message.trim()) {
      newErrors.message = lang === 'sw' ? 'Tafadhali andika ujumbe wako.' : 'Please enter your message.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const existing = JSON.parse(localStorage.getItem('st_monica_contact_messages_v1') || '[]');
      const newEntry = {
        id: `msg-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        inquiryType,
        message: message.trim(),
        date: new Date().toISOString()
      };
      localStorage.setItem('st_monica_contact_messages_v1', JSON.stringify([newEntry, ...existing]));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedName(name.trim());
      setSent(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* 1. Header Banner (Matching Music & About Sections) */}
      <section className="relative h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        <img 
          src={churchImg} 
          alt="St. Monica Catholic Church, Nakuru" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/80 to-[#0C2340]/25" />
        <div className="relative z-10 h-full flex items-center justify-between px-6 sm:px-10 text-white gap-4">
          <div className="space-y-1 sm:space-y-1.5 max-w-xl">
            <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
              {lang === 'sw' ? 'Wasiliana Nasi' : 'Get in Touch'}
            </span>
            <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
              {lang === 'sw' ? 'Wasiliana na Kwaya' : 'Contact St. Monica Choir'}
            </h1>
            <p className="font-source text-xs sm:text-sm text-slate-200 leading-snug">
              {lang === 'sw'
                ? 'Tuma ujumbe wako au wasiliana moja kwa moja kupitia WhatsApp au simu.'
                : 'Send a message or reach out directly via WhatsApp or phone call.'}
            </p>
          </div>

          <a
            href={CHOIR_STATS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95 shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* 2. Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Send a Message Form */}
        <div className="lg:col-span-7 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]">
          {sent ? (
            <div className="p-8 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-fraunces text-[28px] font-bold text-[#0C2340]">
                {lang === 'sw' 
                  ? `Asante, ${submittedName}.` 
                  : `Thank you, ${submittedName}.`}
              </h3>
              <p className="text-[17px] text-slate-700 font-source max-w-md mx-auto leading-relaxed">
                {lang === 'sw'
                  ? 'Ujumbe wako umepokelewa salama. Viongozi wa kwaya na mwalimu watawasiliana nawe ndani ya siku mbili.'
                  : 'We have received your message. Our choir officials and choirmaster will reply within two days.'}
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setSent(false)}
                  className="px-5 py-2.5 text-[14px] font-bold text-[#1058A8] bg-[#EAF4FB] hover:bg-[#7EC8F0]/30 rounded-[12px] cursor-pointer transition-colors"
                >
                  {lang === 'sw' ? 'Tuma ujumbe mwingine' : 'Send another message'}
                </button>

                <a
                  href={CHOIR_STATS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 text-[14px] font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-[12px] cursor-pointer transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp: {CHOIR_STATS.whatsapp}</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-[14px] font-source" noValidate>
              <div className="border-b border-[#0C2340]/10 pb-4">
                <h2 className="font-fraunces text-[28px] font-bold text-[#0C2340]">
                  {lang === 'sw' ? 'Tuma ujumbe au swali' : 'Send a message'}
                </h2>
                <p className="text-[14px] text-slate-600 mt-1">
                  {lang === 'sw'
                    ? 'Jaza maelezo yako hapa chini au wasiliana nasi moja kwa moja.'
                    : 'Fill in your details below or contact us directly.'}
                </p>
              </div>

              {/* Hidden honeypot field */}
              <input 
                type="text" 
                name="user_confirm_token_hp" 
                value={honeypot} 
                onChange={e => setHoneypot(e.target.value)} 
                tabIndex={-1} 
                autoComplete="off" 
                className="hidden" 
                aria-hidden="true" 
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="font-semibold text-[#0C2340] block mb-1.5">
                    {lang === 'sw' ? 'Jina kamili *' : 'Full name *'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Francis Mwangi"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 text-[14px] border rounded-[12px] focus:outline-none bg-[#FCFAF7] transition-colors ${
                      errors.name ? 'border-[#0C2340]/60 ring-1 ring-[#0C2340]/40' : 'border-[#0C2340]/20 focus:border-[#1058A8]'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-[#0C2340] text-[14px] mt-1 block">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="font-semibold text-[#0C2340] block mb-1.5">
                    {lang === 'sw' ? 'Nambari ya simu *' : 'Phone number *'}
                  </label>
                  <input
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 text-[14px] border rounded-[12px] focus:outline-none bg-[#FCFAF7] transition-colors tabular-nums ${
                      errors.phone ? 'border-[#0C2340]/60 ring-1 ring-[#0C2340]/40' : 'border-[#0C2340]/20 focus:border-[#1058A8]'
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-[#0C2340] text-[14px] mt-1 block">
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="font-semibold text-[#0C2340] block mb-1.5">
                  {lang === 'sw' ? 'Barua pepe (Sio lazima)' : 'Email address (Optional)'}
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[14px] border border-[#0C2340]/20 rounded-[12px] focus:outline-none focus:border-[#1058A8] bg-[#FCFAF7]"
                />
              </div>

              {/* Inquiry Purpose */}
              <div>
                <label className="font-semibold text-[#0C2340] block mb-1.5">
                  {lang === 'sw' ? 'Kusudi la ujumbe wako *' : 'How can we help you? *'}
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[14px] border border-[#0C2340]/20 rounded-[12px] focus:outline-none focus:border-[#1058A8] bg-[#FCFAF7] cursor-pointer"
                >
                  <option value="I want to join the choir">
                    {lang === 'sw' ? 'Nataka kujiunga na kwaya (Waimbaji wapya)' : 'I want to join the choir'}
                  </option>
                  <option value="I want to buy sheet music">
                    {lang === 'sw' ? 'Nataka kununua noti za muziki (SATB)' : 'I want to buy sheet music'}
                  </option>
                  <option value="I want to invite the choir to sing">
                    {lang === 'sw' ? 'Kualika kwaya kuimba katika Misa au tukio' : 'I want to invite the choir to sing'}
                  </option>
                  <option value="General question">
                    {lang === 'sw' ? 'Swali lingine la jumla' : 'General question'}
                  </option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="font-semibold text-[#0C2340] block mb-1.5">
                  {lang === 'sw' ? 'Ujumbe wako *' : 'Your message *'}
                </label>
                <textarea
                  rows={4}
                  placeholder={lang === 'sw' ? 'Andika ujumbe wako hapa...' : 'Type your message or question...'}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 text-[14px] border rounded-[12px] focus:outline-none bg-[#FCFAF7] transition-colors ${
                    errors.message ? 'border-[#0C2340]/60 ring-1 ring-[#0C2340]/40' : 'border-[#0C2340]/20 focus:border-[#1058A8]'
                  }`}
                />
                {errors.message && (
                  <span className="text-[#0C2340] text-[14px] mt-1 block">
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-[44px] px-7 py-3 text-[14px] font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-[12px] cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? (lang === 'sw' ? 'Inatuma...' : 'Sending...') : (lang === 'sw' ? 'Tuma Ujumbe' : 'Send Message')}</span>
                  </button>

                  <a
                    href={CHOIR_STATS.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-5 py-3 text-[14px] font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-[12px] cursor-pointer flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{lang === 'sw' ? 'Wasiliana kwa WhatsApp' : 'Message on WhatsApp'}</span>
                  </a>
                </div>

                <p className="text-[14px] text-slate-500 pt-1">
                  {lang === 'sw' ? 'Kwa kawaida tunajibu ndani ya siku mbili.' : 'We usually reply within two days.'}
                </p>

                {/* Privacy Notice under Contact Form */}
                <p className="text-xs text-slate-500 font-source leading-relaxed pt-2 border-t border-[#0C2340]/10">
                  {lang === 'sw'
                    ? "Tunatumia maelezo yako kwa mawasiliano ya kwaya pekee na yanalindwa chini ya Sheria ya Kulinda Data ya Kenya, 2019. Picha za watoto wachanga na vijana huchapishwa tu kwa idhini ya wazazi."
                    : "We use your details only for choir communication and are protected under Kenya's Data Protection Act, 2019. Photos of minors are published only with parental consent."}
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Direct Parish Contacts and Google Map */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Parish Information Card */}
          <div className="p-6 sm:p-7 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-2xl shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)] space-y-5">
            <h3 className="font-fraunces text-[22px] font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Mawasiliano ya moja kwa moja' : 'Direct parish contacts'}
            </h3>

            <div className="space-y-4 text-[14px] font-source">
              {/* Phone */}
              <div>
                <span className="block text-slate-600">
                  {lang === 'sw' ? 'Simu' : 'Phone'}
                </span>
                <a 
                  href={`tel:${CHOIR_STATS.phone.replace(/\s+/g, '')}`}
                  className="text-[17px] font-semibold text-[#1058A8] hover:underline block mt-0.5 tabular-nums"
                >
                  {CHOIR_STATS.phone}
                </a>
              </div>

              {/* WhatsApp */}
              <div>
                <span className="block text-slate-600">
                  {lang === 'sw' ? 'WhatsApp ya kwaya' : 'Choir WhatsApp'}
                </span>
                <a 
                  href={CHOIR_STATS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[17px] font-semibold text-[#1058A8] hover:underline block mt-0.5 tabular-nums"
                >
                  {CHOIR_STATS.whatsapp}
                </a>
              </div>

              {/* Email */}
              <div>
                <span className="block text-slate-600">
                  {lang === 'sw' ? 'Barua pepe' : 'Email'}
                </span>
                <a 
                  href={`mailto:${CHOIR_STATS.email}`}
                  className="text-[17px] font-semibold text-[#0C2340] hover:text-[#1058A8] hover:underline block mt-0.5"
                >
                  {CHOIR_STATS.email}
                </a>
              </div>

              {/* Location matching exact map pin */}
              <div>
                <span className="block text-slate-600">
                  {lang === 'sw' ? 'Mahali pa kanisa' : 'Church address'}
                </span>
                <span className="text-slate-800 font-medium block mt-0.5 leading-relaxed">
                  St. Monica Catholic Church, Section 58, Nakuru (Lanet Rd / Off Old Nairobi Rd)
                </span>
              </div>

              {/* Mass and Rehearsal Times */}
              <div className="pt-3 border-t border-[#0C2340]/10 space-y-3">
                <div>
                  <span className="text-slate-600 block">
                    {lang === 'sw' ? 'Misa za Jumapili' : 'Sunday Masses'}
                  </span>
                  <span className="text-slate-800 font-medium block mt-0.5 tabular-nums">
                    {lang === 'sw' ? CHOIR_STATS.massTimesSundaySw : CHOIR_STATS.massTimesSunday}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 block">
                    {lang === 'sw' ? 'Mazoezi ya kwaya' : 'Choir rehearsals'}
                  </span>
                  <span className="text-slate-800 font-medium block mt-0.5 tabular-nums">
                    {lang === 'sw' ? CHOIR_STATS.rehearsalScheduleSw : CHOIR_STATS.rehearsalSchedule}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Parish Map & Direct Google Maps Navigation */}
          <div className="bg-[#FCFAF7] border border-[#0C2340]/15 rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]">
            <div className="p-4 bg-white border-b border-[#0C2340]/10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#1058A8] shrink-0" />
                  <span className="text-[15px] font-bold text-[#0C2340]">
                    St. Monica's Catholic Church, Section 58
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-source block mt-0.5 ml-5.5">
                  Nakuru, Kenya · Catholic Diocese of Nakuru
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={CHOIR_STATS.mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#0C2340]/15 text-[#0C2340] hover:bg-slate-50 transition-colors flex items-center gap-1 font-source"
                  title="Get Driving / Walking Directions"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#1058A8]" />
                  <span>{lang === 'sw' ? 'Maelekezo' : 'Directions'}</span>
                </a>
                <a
                  href={CHOIR_STATS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1058A8] text-white hover:bg-[#0C2340] transition-colors flex items-center gap-1 font-source shadow-xs"
                  title="Open Location in Google Maps app or web"
                >
                  <span>{lang === 'sw' ? 'Fungua Google Maps' : 'Open in Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Live Interactive Google Map with Pin at exact church coordinates */}
            <div className="w-full h-64 sm:h-72 bg-slate-100 relative group">
              <iframe
                title="Google Maps - St. Monica Catholic Church Section 58 Nakuru"
                src="https://maps.google.com/maps?q=-0.2845249,36.0940117&hl=en&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={CHOIR_STATS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-[#0C2340] hover:text-[#1058A8] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md border border-[#0C2340]/15 flex items-center gap-1.5 transition-all z-10"
                title="Open St. Monica's Catholic Church on Google Maps"
              >
                <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            {/* Parish Coordinates & Quick Link Footnote */}
            <div className="p-3.5 bg-[#FAF8F5] border-t border-[#0C2340]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-700 font-source">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">GPS:</span>
                <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                  {CHOIR_STATS.coordinatesDisplay}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCoord}
                  className="text-slate-600 hover:text-[#1058A8] flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
                  title="Copy GPS coordinates"
                >
                  {copiedCoord ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">{lang === 'sw' ? 'Imenakiliwa!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{lang === 'sw' ? 'Nakili' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={CHOIR_STATS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1058A8] hover:text-[#0C2340] font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>maps.app.goo.gl/qd9c7QUumHUnUGXc6</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
