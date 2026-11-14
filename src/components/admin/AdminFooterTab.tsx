import React, { useState, useEffect } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { DEFAULT_FOOTER_CONTACT } from '../../data/choirContent';
import { normalizeWhatsAppUrl } from '../../utils/assetHelper';
import { Save, Phone, Mail, ExternalLink, Trash2, MessageSquare, Clock } from 'lucide-react';

interface AdminFooterTabProps {
  onNotify: (msg: string) => void;
}

export const AdminFooterTab: React.FC<AdminFooterTabProps> = ({ onNotify }) => {
  const {
    footerContact,
    updateFooterContact,
    choirStats,
    massSchedule,
    contactMessages,
    updateContactMessageStatus,
    deleteContactMessage
  } = useChoir();

  const [form, setForm] = useState({
    phone: footerContact?.phone || choirStats?.phone || DEFAULT_FOOTER_CONTACT.phone,
    whatsapp: footerContact?.whatsapp || choirStats?.whatsappUrl || DEFAULT_FOOTER_CONTACT.whatsapp,
    email: footerContact?.email || choirStats?.email || DEFAULT_FOOTER_CONTACT.email,
    churchAddress: footerContact?.churchAddress || choirStats?.churchAddress || DEFAULT_FOOTER_CONTACT.churchAddress,
    mapsUrl: footerContact?.mapsUrl || choirStats?.mapsUrl || DEFAULT_FOOTER_CONTACT.mapsUrl,
    mpesaTill: footerContact?.mpesaTill || choirStats?.mpesaTill || '',
    rehearsalsEn: footerContact?.rehearsalsEn || massSchedule?.rehearsals || DEFAULT_FOOTER_CONTACT.rehearsalsEn,
    rehearsalsSw: footerContact?.rehearsalsSw || massSchedule?.rehearsalsSw || DEFAULT_FOOTER_CONTACT.rehearsalsSw
  });

  useEffect(() => {
    setForm({
      phone: footerContact?.phone || choirStats?.phone || DEFAULT_FOOTER_CONTACT.phone,
      whatsapp: footerContact?.whatsapp || choirStats?.whatsappUrl || DEFAULT_FOOTER_CONTACT.whatsapp,
      email: footerContact?.email || choirStats?.email || DEFAULT_FOOTER_CONTACT.email,
      churchAddress: footerContact?.churchAddress || choirStats?.churchAddress || DEFAULT_FOOTER_CONTACT.churchAddress,
      mapsUrl: footerContact?.mapsUrl || choirStats?.mapsUrl || DEFAULT_FOOTER_CONTACT.mapsUrl,
      mpesaTill: footerContact?.mpesaTill || choirStats?.mpesaTill || '',
      rehearsalsEn: footerContact?.rehearsalsEn || massSchedule?.rehearsals || DEFAULT_FOOTER_CONTACT.rehearsalsEn,
      rehearsalsSw: footerContact?.rehearsalsSw || massSchedule?.rehearsalsSw || DEFAULT_FOOTER_CONTACT.rehearsalsSw
    });
  }, [footerContact, choirStats, massSchedule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedWhatsapp = normalizeWhatsAppUrl(form.whatsapp, DEFAULT_FOOTER_CONTACT.whatsapp);
    setForm(prev => ({ ...prev, whatsapp: normalizedWhatsapp }));

    updateFooterContact({
      phone: form.phone.trim(),
      whatsapp: normalizedWhatsapp,
      email: form.email.trim(),
      churchAddress: form.churchAddress.trim(),
      mapsUrl: form.mapsUrl.trim(),
      mpesaTill: form.mpesaTill.trim(),
      rehearsalsEn: form.rehearsalsEn.trim(),
      rehearsalsSw: form.rehearsalsSw.trim()
    });

    onNotify('Contact details and choir practice schedule saved to Supabase & synced website-wide!');
  };

  const unreadCount = contactMessages.filter(m => m.status === 'new').length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-[#0C2340]/15 p-6 space-y-6">
        <div className="pb-4 border-b border-[#0C2340]/10">
          <h2 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
            Contact details
          </h2>
          <p className="text-xs text-slate-600 font-source mt-0.5">
            Synced automatically across the Contact Us page, Footer, Mobile Menu, Events, and Supabase database.
          </p>
        </div>

        {/* Live Preview Card */}
        <div className="p-4 bg-[#0A1D37] text-white rounded-lg border border-white/10 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7EC8F0] block font-source">
            Footer & Contact Us preview
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
                <span>Email: <strong className="text-white">{form.email}</strong></span>
                {form.mpesaTill && (
                  <>
                    <span>·</span>
                    <span>Till: <strong className="text-emerald-400 font-mono font-medium">{form.mpesaTill}</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-source">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                WhatsApp number or wa.me link
              </label>
              <input
                type="text"
                required
                value={form.whatsapp}
                onChange={e => setForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="https://wa.me/254722845291 or +254 722 845 291"
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
                placeholder="stmonicachoirsec58@gmail.com"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                Paybill / Till number (optional)
              </label>
              <input
                type="text"
                value={form.mpesaTill}
                onChange={e => setForm(prev => ({ ...prev, mpesaTill: e.target.value }))}
                placeholder="678408"
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
                placeholder="St. Monica Catholic Church, Section 58, Off Kanu Street, Nakuru, Kenya"
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
                placeholder="https://maps.app.goo.gl/qd9c7QUumHUnUGXc6"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0C2340] mb-1">
                Choir practice / rehearsal times (English)
              </label>
              <input
                type="text"
                required
                value={form.rehearsalsEn}
                onChange={e => setForm(prev => ({ ...prev, rehearsalsEn: e.target.value }))}
                placeholder="Wednesdays & Fridays: 5:30 PM – 7:30 PM (Parish Hall)"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ratiba ya Mazoezi ya Kwaya (Kiswahili)
              </label>
              <input
                type="text"
                required
                value={form.rehearsalsSw}
                onChange={e => setForm(prev => ({ ...prev, rehearsalsSw: e.target.value }))}
                placeholder="Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku (Ukumbi wa Parokia)"
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

      {/* Contact Us Visitor Inquiries Inbox (Synced with Supabase) */}
      <div className="bg-white rounded-lg border border-[#0C2340]/15 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#0C2340]/10">
          <div>
            <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#1058A8]" />
              <span>Contact Us Messages Inbox</span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-bold bg-[#1058A8] text-white px-2 py-0.5 rounded-full font-source">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-600 font-source mt-0.5">
              Messages submitted from the Contact Us page are saved automatically to Supabase.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 font-source">
            Total: {contactMessages.length}
          </span>
        </div>

        {contactMessages.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-source bg-[#FAF8F5] rounded-lg border border-[#0C2340]/10">
            No visitor messages yet. Submissions from the Contact Us page will appear here automatically.
          </div>
        ) : (
          <div className="space-y-3">
            {contactMessages.map(msg => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border transition-colors ${
                  msg.status === 'new'
                    ? 'bg-[#EAF4FB]/50 border-[#1058A8]/30'
                    : 'bg-[#FAF8F5] border-[#0C2340]/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2 border-b border-[#0C2340]/10">
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-sm font-bold text-[#0C2340] font-source">{msg.name}</strong>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white border border-[#0C2340]/15 text-[#1058A8]">
                        {msg.inquiryType}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          msg.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : msg.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-source">
                      <a href={`tel:${msg.phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-1 hover:text-[#1058A8]">
                        <Phone className="w-3 h-3" />
                        <span>{msg.phone}</span>
                      </a>
                      {msg.email && (
                        <a href={`mailto:${msg.email}`} className="inline-flex items-center gap-1 hover:text-[#1058A8]">
                          <Mail className="w-3 h-3" />
                          <span>{msg.email}</span>
                        </a>
                      )}
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <select
                      value={msg.status}
                      onChange={(e) => {
                        const nextStatus = e.target.value as 'new' | 'read' | 'replied';
                        updateContactMessageStatus(msg.id, nextStatus);
                        onNotify(`Message from ${msg.name} marked as ${nextStatus}.`);
                      }}
                      className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-slate-300 bg-white text-[#0C2340] cursor-pointer"
                      aria-label={`Status for message from ${msg.name}`}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete message from ${msg.name}?`)) {
                          deleteContactMessage(msg.id);
                          onNotify(`Message from ${msg.name} deleted.`);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-800 font-source leading-relaxed pt-2 whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
