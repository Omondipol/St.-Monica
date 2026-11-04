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
    phone: footerContact?.phone || choirStats?.phone || '+254 722 845 291',
    whatsapp: footerContact?.whatsapp || choirStats?.whatsappUrl || 'https://wa.me/254722845291',
    email: footerContact?.email || choirStats?.email || 'info@stmonicachoir.org',
    churchAddress: footerContact?.churchAddress || choirStats?.churchAddress || 'Section 58, Off Kanu Street, Nakuru, Kenya',
    mapsUrl: footerContact?.mapsUrl || choirStats?.mapsUrl || 'https://maps.google.com/?q=St+Monica+Catholic+Church+Section+58+Nakuru',
    mpesaTill: footerContact?.mpesaTill || choirStats?.mpesaTill || '8421092',
    rehearsalsEn: footerContact?.rehearsalsEn || massSchedule?.rehearsals || 'Mondays, Wednesdays & Fridays: 5:30 PM – 7:30 PM (Parish Hall)',
    rehearsalsSw: footerContact?.rehearsalsSw || massSchedule?.rehearsalsSw || 'Jumatatu, Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku (Ukumbi wa Parokia)'
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

    onNotify('Footer contact details saved live!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-[#0C2340]/15 p-6 space-y-6">
        <div className="pb-4 border-b border-[#0C2340]/10">
          <h2 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
            Contact details
          </h2>
          <p className="text-xs text-slate-600 font-source mt-0.5">
            Shown in the website footer.
          </p>
        </div>

        {/* Live Preview Card */}
        <div className="p-4 bg-[#0A1D37] text-white rounded-lg border border-white/10 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7EC8F0] block font-source">
            Footer preview
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 font-source">
            <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-white/10 pb-3 md:pb-0 md:pr-4">
              <strong className="text-white block font-semibold text-xs">Service & Rehearsal Times</strong>
              <div>
                <span className="text-[#7EC8F0] block font-medium">Weekly Practice:</span>
                <span>{form.rehearsalsEn}</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-0.5">
                <span className="text-amber-300 font-medium mr-1">Kiswahili:</span>
                <span>{form.rehearsalsSw}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <strong className="text-white block font-semibold text-xs">Parish Office & Location</strong>
              <div>
                <span className="block text-white font-medium">{form.churchAddress}</span>
                <a href={form.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-[#7EC8F0] hover:underline inline-flex items-center gap-1 text-[11px] mt-0.5">
                  <span>Google Maps link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span>Phone: <strong className="text-white">{form.phone}</strong></span>
                <span>·</span>
                <span>Till: <strong className="text-emerald-400 font-mono font-medium">{form.mpesaTill}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-source">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                WhatsApp number
              </label>
              <input
                type="text"
                required
                value={form.whatsapp}
                onChange={e => setForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="https://wa.me/254722845291"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                Phone
              </label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+254 722 845 291"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="info@stmonicachoir.org"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                Buy Goods till number
              </label>
              <input
                type="text"
                required
                value={form.mpesaTill}
                onChange={e => setForm(prev => ({ ...prev, mpesaTill: e.target.value }))}
                placeholder="8421092"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC] font-normal text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                Physical address
              </label>
              <input
                type="text"
                required
                value={form.churchAddress}
                onChange={e => setForm(prev => ({ ...prev, churchAddress: e.target.value }))}
                placeholder="Section 58, Off Kanu Street, Nakuru, Kenya"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                Google Maps URL
              </label>
              <input
                type="url"
                value={form.mapsUrl}
                onChange={e => setForm(prev => ({ ...prev, mapsUrl: e.target.value }))}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                Rehearsal times (English)
              </label>
              <input
                type="text"
                required
                value={form.rehearsalsEn}
                onChange={e => setForm(prev => ({ ...prev, rehearsalsEn: e.target.value }))}
                placeholder="Mondays, Wednesdays & Fridays: 5:30 PM – 7:30 PM"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ratiba ya Mazoezi (Kiswahili)
              </label>
              <input
                type="text"
                required
                value={form.rehearsalsSw}
                onChange={e => setForm(prev => ({ ...prev, rehearsalsSw: e.target.value }))}
                placeholder="Jumatatu, Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#1058A8] hover:bg-[#0C2340] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
