import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, ExternalLink, MessageCircle, AlertCircle } from 'lucide-react';
import { YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_HANDLE, CHOIR_STATS } from '../data/choirContent';

export const ContactPage: React.FC = () => {
  const { lang } = useChoir();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('I want to join the choir');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Hidden spam protection field

  // Feedback states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedName, setSubmittedName] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhone = (num: string): boolean => {
    // Valid Kenyan phone patterns: 07XX, 01XX, +254..., or international minimum 9 digits
    const cleaned = num.replace(/[\s\-\(\)]/g, '');
    return /^(?:\+254|0)[17]\d{8}$/.test(cleaned) || cleaned.length >= 9;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Spam protection check: bots fill hidden fields
    if (honeypot) {
      console.warn('Spam submission suppressed.');
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

    // Save message locally into localStorage so admin area and choirmaster have permanent record
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
    } catch (e) {
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
    <div className="space-y-8">
      
      {/* 1. SLIM HEADER BANNER (Starts top of page without pushing form below the fold) */}
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-source mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Wasiliana Nasi · Section 58 Nakuru' : 'Get in Touch · Section 58 Nakuru'}</span>
            </div>
            <h1 className="font-fraunces text-2xl sm:text-4xl font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Wasiliana na Kwaya ya Mtakatifu Monica' : 'Contact St. Monica Catholic Choir'}
            </h1>
            <p className="text-sm text-slate-700 font-source mt-1">
              {lang === 'sw'
                ? 'Tuma ujumbe wako au wasiliana moja kwa moja kupitia WhatsApp au simu.'
                : 'Send a message or reach out directly via WhatsApp or phone call.'}
            </p>
          </div>

          <a
            href={CHOIR_STATS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-sm flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{lang === 'sw' ? 'Chat WhatsApp Haraka' : 'Quick WhatsApp Chat'}</span>
          </a>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN SECTION: SEND A MESSAGE AT TOP & DIRECT CONTACTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (lg:col-span-7): Send a Message Form directly above the fold */}
        <div className="lg:col-span-7 bg-white border border-[#0C2340]/10 rounded-3xl p-6 sm:p-8 shadow-xs">
          {sent ? (
            <div className="p-8 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
                {lang === 'sw' 
                  ? `Asante, ${submittedName}.` 
                  : `Thank you, ${submittedName}.`}
              </h3>
              <p className="text-sm text-slate-700 font-source max-w-md mx-auto leading-relaxed">
                {lang === 'sw'
                  ? 'Ujumbe wako umepokelewa salama. Viongozi wa kwaya na mwalimu watawasiliana nawe ndani ya siku mbili.'
                  : 'We have received your message. Our choir officials and choirmaster will reply within two days.'}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setSent(false)}
                  className="px-5 py-2.5 text-xs font-bold text-[#1058A8] bg-[#EAF4FB] hover:bg-[#7EC8F0]/30 rounded-xl cursor-pointer transition-colors"
                >
                  {lang === 'sw' ? 'Tuma Ujumbe Mwingine' : 'Send Another Message'}
                </button>

                <a
                  href={CHOIR_STATS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp: {CHOIR_STATS.whatsapp}</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-source" noValidate>
              <div className="border-b border-[#0C2340]/10 pb-3">
                <h2 className="font-fraunces text-xl sm:text-2xl font-bold text-[#0C2340]">
                  {lang === 'sw' ? 'Tuma Ujumbe au Swali' : 'Send a Message'}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  {lang === 'sw'
                    ? 'Jaza fomu hapa chini au piga simu moja kwa moja.'
                    : 'Fill in your details below or contact us directly.'}
                </p>
              </div>

              {/* Hidden honeypot spam protection field */}
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
                  <label className="font-bold text-[#0C2340] block mb-1">
                    {lang === 'sw' ? 'Jina Kamili *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Francis Mwangi"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none bg-[#FAF8F5] transition-colors ${
                      errors.name ? 'border-red-500 focus:border-red-600' : 'border-[#0C2340]/20 focus:border-[#1058A8]'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.name}</span>
                    </span>
                  )}
                </div>

                {/* Phone Number (REQUIRED in Kenya) */}
                <div>
                  <label className="font-bold text-[#0C2340] block mb-1">
                    {lang === 'sw' ? 'Nambari ya Simu *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none bg-[#FAF8F5] transition-colors ${
                      errors.phone ? 'border-red-500 focus:border-red-600' : 'border-[#0C2340]/20 focus:border-[#1058A8]'
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.phone}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Email (OPTIONAL) */}
              <div>
                <label className="font-bold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Barua Pepe / Email (Sio lazima)' : 'Email Address (Optional)'}
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#0C2340]/20 rounded-xl focus:outline-none focus:border-[#1058A8] bg-[#FAF8F5]"
                />
              </div>

              {/* Dropdown: Inquiry Purpose */}
              <div>
                <label className="font-bold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Kusudi la Ujumbe Wako *' : 'How can we help you? *'}
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#0C2340]/20 rounded-xl focus:outline-none focus:border-[#1058A8] bg-[#FAF8F5] cursor-pointer"
                >
                  <option value="I want to join the choir">
                    {lang === 'sw' ? 'Nataka kujiunga na kwaya (Waimbaji wapya)' : 'I want to join the choir'}
                  </option>
                  <option value="I want to buy sheet music">
                    {lang === 'sw' ? 'Nataka kununua noti za muziki (SATB Scores)' : 'I want to buy sheet music'}
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
                <label className="font-bold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Ujumbe Wako *' : 'Your Message *'}
                </label>
                <textarea
                  rows={4}
                  placeholder={lang === 'sw' ? "Andika ujumbe wako hapa..." : "Type your message or question..."}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none bg-[#FAF8F5] transition-colors ${
                    errors.message ? 'border-red-500 focus:border-red-600' : 'border-[#0C2340]/20 focus:border-[#1058A8]'
                  }`}
                />
                {errors.message && (
                  <span className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.message}</span>
                  </span>
                )}
              </div>

              {/* Action buttons & Delivery expectation line */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-[44px] px-7 py-3 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? (lang === 'sw' ? 'Inatuma...' : 'Sending...') : (lang === 'sw' ? 'Tuma Ujumbe' : 'Send Message')}</span>
                  </button>

                  <a
                    href={CHOIR_STATS.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-5 py-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-emerald-600" />
                    <span>{lang === 'sw' ? 'Unapendelea WhatsApp? Tuma ujumbe sasa' : 'Prefer WhatsApp? Message us directly'}</span>
                  </a>
                </div>

                {/* Clear expectation feedback line */}
                <p className="text-xs text-slate-500 text-center sm:text-left pt-1">
                  {lang === 'sw' ? 'Kwa kawaida tunajibu ndani ya siku mbili.' : 'We usually reply within two days.'}
                </p>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN (lg:col-span-5): Tap-to-call, Tap-to-WhatsApp, Shared Schedule, and Embedded Google Map */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Parish Information Card */}
          <div className="p-6 sm:p-7 bg-white border border-[#0C2340]/10 rounded-3xl shadow-xs space-y-5">
            <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Mawasiliano ya Moja kwa Moja' : 'Direct Parish Contacts'}
            </h3>

            <div className="space-y-4 text-xs font-source">
              {/* Tap to Call */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#1058A8] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-[#0C2340] font-bold">
                    {lang === 'sw' ? 'Piga Simu / Phone:' : 'Phone Call (Tap to dial):'}
                  </strong>
                  <a 
                    href={`tel:${CHOIR_STATS.phone.replace(/\s+/g, '')}`}
                    className="text-sm font-semibold text-[#1058A8] hover:underline block mt-0.5"
                    title="Tap to call"
                  >
                    {CHOIR_STATS.phone}
                  </a>
                </div>
              </div>

              {/* Tap to WhatsApp */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <strong className="block text-[#0C2340] font-bold">
                    {lang === 'sw' ? 'WhatsApp ya Kwaya:' : 'WhatsApp Chat:'}
                  </strong>
                  <a 
                    href={CHOIR_STATS.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-emerald-600 hover:underline block mt-0.5"
                    title="Tap to chat on WhatsApp"
                  >
                    {CHOIR_STATS.whatsapp}
                  </a>
                </div>
              </div>

              {/* Tap to Email */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0C2340] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-[#0C2340] font-bold">
                    {lang === 'sw' ? 'Barua Pepe (Email):' : 'Official Email (Tap to write):'}
                  </strong>
                  <a 
                    href={`mailto:${CHOIR_STATS.email}`}
                    className="text-sm font-semibold text-slate-800 hover:text-[#1058A8] hover:underline block mt-0.5"
                    title="Tap to email"
                  >
                    {CHOIR_STATS.email}
                  </a>
                </div>
              </div>

              {/* Location & Map Pin */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#1058A8] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-[#0C2340] font-bold">
                    {lang === 'sw' ? 'Mahali pa Kanisa:' : 'Church Location:'}
                  </strong>
                  <span className="text-slate-700 block mt-0.5">
                    {CHOIR_STATS.churchAddress}
                  </span>
                  <a 
                    href={CHOIR_STATS.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#1058A8] hover:underline font-bold mt-1"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Shared Rehearsal & Mass Times (Reads directly from CHOIR_STATS so they never drift) */}
              <div className="pt-3 border-t border-[#0C2340]/10 space-y-2 text-xs">
                <div>
                  <strong className="text-[#0C2340] block font-semibold">Sunday Masses:</strong>
                  <span className="text-slate-600">
                    {lang === 'sw' ? CHOIR_STATS.massTimesSundaySw : CHOIR_STATS.massTimesSunday}
                  </span>
                </div>
                <div>
                  <strong className="text-[#0C2340] block font-semibold">Choir Rehearsals:</strong>
                  <span className="text-slate-600">
                    {lang === 'sw' ? CHOIR_STATS.rehearsalScheduleSw : CHOIR_STATS.rehearsalSchedule}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. EMBEDDED GOOGLE MAP OF ST. MONICA CATHOLIC CHURCH NAKURU */}
          <div className="bg-white border border-[#0C2340]/10 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-3.5 bg-[#FAF8F5] border-b border-[#0C2340]/10 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0C2340] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#1058A8]" />
                <span>St. Monica Catholic Church, Section 58</span>
              </span>
              <a
                href={CHOIR_STATS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#1058A8] hover:underline flex items-center gap-1"
              >
                <span>Full Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="w-full h-56 sm:h-64 bg-slate-100">
              <iframe
                title="St. Monica Catholic Church Section 58 Nakuru Map"
                src="https://maps.google.com/maps?q=St.+Monica+Catholic+Church+Section+58+Nakuru&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
