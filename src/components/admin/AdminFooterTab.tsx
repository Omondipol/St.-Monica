import React, { useState } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { AfricanGeometricBorder } from '../AfricanGeometricBorder';
import { Save, Phone, Mail, MapPin, ExternalLink, Check, Clock } from 'lucide-react';

interface AdminFooterTabProps {
  onNotify: (msg: string) => void;
}

export const AdminFooterTab: React.FC<AdminFooterTabProps> = ({ onNotify }) => {
  const {
    lang,
    footerContact,
    updateFooterContact,
    choirStats,
    updateChoirStats,
    massSchedule,
    updateMassSchedule
  } = useChoir();

  const [form, setForm] = useState({
    phone: footerContact?.phone || choirStats?.phone || '+254 700 000 000',
    whatsapp: footerContact?.whatsapp || choirStats?.whatsappUrl || 'https://wa.me/254700000000',
    email: footerContact?.email || choirStats?.email || 'info@stmonicachoir.org',
    churchAddress: footerContact?.churchAddress || choirStats?.churchAddress || 'Section 58, Off Kanu Street, Nakuru, Kenya',
    mapsUrl: footerContact?.mapsUrl || choirStats?.mapsUrl || 'https://maps.google.com/?q=St+Monica+Catholic+Church+Section+58+Nakuru',
    mpesaTill: footerContact?.mpesaTill || choirStats?.mpesaTill || '8421092',
    rehearsalsEn: footerContact?.rehearsalsEn || massSchedule?.rehearsals || 'Wednesdays & Fridays: 5:30 PM – 7:30 PM (Parish Hall)',
    rehearsalsSw: footerContact?.rehearsalsSw || massSchedule?.rehearsalsSw || 'Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku (Ukumbi wa Parokia)'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFooterContact({
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim(),
      churchAddress: form.churchAddress.trim(),
      mapsUrl: form.mapsUrl.trim(),
      mpesaTill: form.mpesaTill.trim(),
      rehearsalsEn: form.rehearsalsEn.trim(),
      rehearsalsSw: form.rehearsalsSw.trim()
    });

    updateChoirStats({
      phone: form.phone.trim(),
      email: form.email.trim(),
      churchAddress: form.churchAddress.trim(),
      mapsUrl: form.mapsUrl.trim(),
      whatsappUrl: form.whatsapp.trim(),
      mpesaTill: form.mpesaTill.trim()
    });

    updateMassSchedule({
      rehearsals: form.rehearsalsEn.trim(),
      rehearsalsSw: form.rehearsalsSw.trim()
    });

    onNotify(lang === 'sw' ? 'Mawasiliano na taarifa za chini ya ukurasa zimehifadhiwa!' : 'Footer service times & contact information saved live!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-[#0C2340]/10 shadow-sm overflow-hidden">
        <AfricanGeometricBorder />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0C2340]/10">
            <div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                Website Footer & Official Contact Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-source mt-1">
                Edit parish address, official phone number, WhatsApp link, email, Google Maps coordinates, M-Pesa Till, and weekly rehearsal times.
              </p>
              <p className="text-[11px] text-slate-400 font-source italic mt-0.5">
                (Hariri mawasiliano ya chini ya ukurasa, anwani, nambari za simu na M-Pesa Till)
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
              Synchronized Across All Pages
            </span>
          </div>

          {/* Live Preview Card */}
          <div className="p-5 bg-[#0A1D37] text-white rounded-2xl border border-white/10 space-y-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7EC8F0] block font-source">
              Live Footer Preview (Column 3 & Column 4)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 font-source">
              <div className="space-y-2 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                <strong className="text-white block font-medium">Service & Rehearsal Times</strong>
                <div>
                  <span className="text-[#7EC8F0] block font-semibold">Weekly Practice:</span>
                  <span>{form.rehearsalsEn}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  <span className="text-amber-300 block font-semibold">SW:</span>
                  <span>{form.rehearsalsSw}</span>
                </div>
              </div>

              <div className="space-y-2">
                <strong className="text-white block font-medium">Parish Office & Location</strong>
                <div>
                  <span className="block text-white font-semibold">{form.churchAddress}</span>
                  <a href={form.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-[#7EC8F0] underline inline-flex items-center gap-1 text-[11px] mt-0.5">
                    <span>Google Maps Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span>Tel: <strong className="text-white">{form.phone}</strong></span>
                  <span>·</span>
                  <span>M-Pesa Till: <strong className="text-emerald-400 font-mono font-bold">{form.mpesaTill}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#1058A8]" />
                  <span>Official Choir / Parish Phone Number *</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+254 700 000 000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span>WhatsApp Link / Phone *</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.whatsapp}
                  onChange={e => setForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="https://wa.me/254700000000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#1058A8]" />
                  <span>Official Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="info@stmonicachoir.org"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span>M-Pesa Buy Goods Till Number *</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.mpesaTill}
                  onChange={e => setForm(prev => ({ ...prev, mpesaTill: e.target.value }))}
                  placeholder="8421092"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC] font-bold text-emerald-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1058A8]" />
                  <span>St. Monica Catholic Church Physical Address *</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.churchAddress}
                  onChange={e => setForm(prev => ({ ...prev, churchAddress: e.target.value }))}
                  placeholder="Section 58, Off Kanu Street, Nakuru, Kenya"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span>Google Maps Location URL</span>
                </label>
                <input
                  type="url"
                  value={form.mapsUrl}
                  onChange={e => setForm(prev => ({ ...prev, mapsUrl: e.target.value }))}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1.5">
                  Rehearsal Times in Footer (English) *
                </label>
                <input
                  type="text"
                  required
                  value={form.rehearsalsEn}
                  onChange={e => setForm(prev => ({ ...prev, rehearsalsEn: e.target.value }))}
                  placeholder="Wed & Fri: 5:30 PM – 7:30 PM"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ratiba ya Mazoezi Chini ya Ukurasa (Kiswahili) *
                </label>
                <input
                  type="text"
                  required
                  value={form.rehearsalsSw}
                  onChange={e => setForm(prev => ({ ...prev, rehearsalsSw: e.target.value }))}
                  placeholder="Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-source italic">
                Saves and updates the footer columns, contact details, and maps coordinates live.
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Footer & Contact Info</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
