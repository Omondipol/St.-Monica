import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { lang, setIsBookingOpen } = useChoir();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="space-y-12">
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider font-mono">
          <Mail className="w-4 h-4" />
          <span>WASILIANA NASI · CONTACT & INQUIRIES</span>
        </div>

        <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
          {lang === 'sw' ? 'Wasiliana na Kwaya ya Mtakatifu Monica' : 'Contact St. Monica Choir Nakuru'}
        </h1>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          Tupo hapa kujibu maswali yako kuhusu kujiunga na kwaya, kuagiza uimbaji kwa ajili ya Misa au arusi, na manunuzi ya santuri na noti.
        </p>

        {/* 5-line music-stave divider */}
        <div className="stave-divider my-4 max-w-md">
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Direct Contacts & Church Location */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 bg-white border border-[#0C2340]/10 rounded-2xl shadow-xs space-y-5">
            <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
              Ofisi na Mawasiliano
            </h3>

            <div className="space-y-4 text-xs font-source">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#1058A8] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#0C2340] font-bold">Mahali pa Hekalu:</strong>
                  <span className="text-[#0C2340]/75">Parokia ya Mtakatifu Monica, Section 58</span>
                  <span className="text-[#0C2340]/60 block">Nakuru Town, Bonde la Ufa, Kenya</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#0C2340] font-bold">Simu na WhatsApp:</strong>
                  <span className="text-[#0C2340]/75">+254 700 000 000 (Mwalimu Polycarp Ochieng)</span>
                  <span className="text-[#0C2340]/60 block">+254 722 000 000 (Mzee Joseph Kamau - Chair)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#1058A8] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#0C2340] font-bold">Barua Pepe Rasmi:</strong>
                  <span className="text-[#0C2340]/75">info@stmonicachoirnakuru.org</span>
                  <span className="text-[#0C2340]/60 block">bookings@stmonicachoirnakuru.org</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#1058A8] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#0C2340] font-bold">Saa za Mazoezi Hekaluni:</strong>
                  <span className="text-[#0C2340]/75">Jumatano: 6:00 PM – 8:00 PM</span>
                  <span className="text-[#0C2340]/75 block">Jumamosi: 3:00 PM – 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA Button */}
            <div className="pt-2">
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Wasiliana Nasi Papo Hapo kwa WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Message Form */}
        <div className="lg:col-span-7 bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
          {sent ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-fraunces text-2xl font-bold text-[#0C2340]">
                Ujumbe Wako Umepokelewa!
              </h4>
              <p className="text-xs text-[#0C2340]/80 font-source max-w-sm mx-auto">
                Asante sana kwa kuwasiliana na Kwaya ya Mtakatifu Monica SEC 58. Tutakujibu haraka iwezekanavyo.
              </p>
              <button
                onClick={() => setSent(false)}
                className="px-4 py-2 text-xs font-bold text-[#1058A8] bg-[#EAF4FB] rounded-lg"
              >
                Tuma Ujumbe Mwingine
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-source">
              <h3 className="font-fraunces text-xl font-bold text-[#0C2340]">
                Tuma Ujumbe au Swali Lako
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#0C2340] block mb-1">Jina Kamili:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Francis Mwangi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0C2340] block mb-1">Nambari ya Simu:</label>
                  <input
                    type="tel"
                    required
                    placeholder="07XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0C2340] block mb-1">Barua Pepe (Email):</label>
                <input
                  type="email"
                  required
                  placeholder="jina@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0C2340] block mb-1">Ujumbe Wako:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Andika swali lako au maelezo ya ombi lako hapa..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="text-xs font-bold text-[#1058A8] hover:underline"
                >
                  Unahitaji kuagiza kwaya kwa ajili ya Misa/Harusi? Bonyeza hapa →
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Tuma Ujumbe</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
