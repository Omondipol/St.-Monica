import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Send, CheckCircle2, ExternalLink, MessageCircle } from 'lucide-react';
import { CHOIR_STATS } from '../data/choirContent';

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
      
      {/* 1. Header Banner */}
      <section className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-[14px] font-semibold text-[#1058A8] font-source block mb-1">
              {lang === 'sw' ? 'Wasiliana nasi' : 'Get in touch'}
            </span>
            <h1 className="font-fraunces text-[28px] sm:text-[40px] font-bold text-[#0C2340] leading-tight">
              {lang === 'sw' ? 'Wasiliana na Kwaya ya Mtakatifu Monika' : 'Contact St. Monica Catholic Choir'}
            </h1>
            <p className="text-[17px] text-slate-700 font-source mt-2 leading-relaxed">
              {lang === 'sw'
                ? 'Tuma ujumbe wako au wasiliana moja kwa moja kupitia WhatsApp au simu.'
                : 'Send a message or reach out directly via WhatsApp or phone call.'}
            </p>
          </div>

          <a
            href={CHOIR_STATS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-center px-5 py-3 rounded-[12px] bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[14px] shadow-xs flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{lang === 'sw' ? 'Wasiliana kwa WhatsApp' : 'Chat on WhatsApp'}</span>
          </a>
        </div>
      </section>

      {/* 2. Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Send a Message Form */}
        <div className="lg:col-span-7 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] p-6 sm:p-8">
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
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Direct Parish Contacts and Google Map */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Parish Information Card */}
          <div className="p-6 sm:p-7 bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] space-y-5">
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

          {/* Embedded Google Map */}
          <div className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] overflow-hidden">
            <div className="p-4 bg-[#FCFAF7] border-b border-[#0C2340]/10 flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#0C2340]">
                St. Monica Catholic Church, Section 58
              </span>
              <a
                href={CHOIR_STATS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-semibold text-[#1058A8] hover:underline flex items-center gap-1 font-source"
              >
                <span>{lang === 'sw' ? 'Fungua kwenye Ramani' : 'Open in Maps'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
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
