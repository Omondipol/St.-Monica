import React, { useState, useMemo } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { supabase } from '../../lib/supabase';
import { ChoirMember, isMemberActive } from '../../data/membersData';
import { AfricanGeometricBorder } from '../AfricanGeometricBorder';
import { 
  Users, 
  Plus, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw, 
  Phone, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  X, 
  Save, 
  FileText
} from 'lucide-react';
import jsPDF from 'jspdf';

interface AdminMembersTabProps {
  onNotify: (msg: string) => void;
}

export const AdminMembersTab: React.FC<AdminMembersTabProps> = ({ onNotify }) => {
  const { 
    lang, 
    members, 
    addMember, 
    updateMember, 
    renewMember, 
    deleteMember,
    footerContact
  } = useChoir();

  const [searchQuery, setSearchQuery] = useState('');
  const [voiceFilter, setVoiceFilter] = useState<'all' | 'soprano' | 'alto' | 'tenor' | 'bass'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ChoirMember | null>(null);

  const [formName, setFormName] = useState('');
  const [formVoice, setFormVoice] = useState<'soprano' | 'alto' | 'tenor' | 'bass'>('soprano');
  const [formRole, setFormRole] = useState('Chorister');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'expired'>('active');
  const [formPaymentRef, setFormPaymentRef] = useState('');

  // Voice Section Counts
  const counts = useMemo(() => {
    return {
      total: members.length,
      active: members.filter(isMemberActive).length,
      soprano: members.filter(m => m.voice === 'soprano').length,
      alto: members.filter(m => m.voice === 'alto').length,
      tenor: members.filter(m => m.voice === 'tenor').length,
      bass: members.filter(m => m.voice === 'bass').length
    };
  }, [members]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        m.name.toLowerCase().includes(q) || 
        (m.phone && m.phone.toLowerCase().includes(q)) || 
        (m.role && m.role.toLowerCase().includes(q)) ||
        (m.paymentReference && m.paymentReference.toLowerCase().includes(q));

      const matchesVoice = voiceFilter === 'all' || m.voice === voiceFilter;
      const isActive = isMemberActive(m);
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && isActive) || 
        (statusFilter === 'expired' && !isActive);

      return matchesSearch && matchesVoice && matchesStatus;
    });
  }, [members, searchQuery, voiceFilter, statusFilter]);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormName('');
    setFormVoice(voiceFilter !== 'all' ? voiceFilter : 'soprano');
    setFormRole('Chorister');
    setFormPhone('');
    setFormEmail('');
    setFormStatus('active');
    setFormPaymentRef(`MPESA-SMTC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: ChoirMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormVoice(member.voice);
    setFormRole(member.role || 'Chorister');
    setFormPhone(member.phone || '');
    setFormEmail(member.email || '');
    setFormStatus(member.status);
    setFormPaymentRef(member.paymentReference || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert(lang === 'sw' ? 'Tafadhali weka jina la mwimbaji' : 'Please provide chorister full name');
      return;
    }

    if (editingMember) {
      updateMember(editingMember.id, {
        name: formName.trim(),
        voice: formVoice,
        role: formRole.trim(),
        phone: formPhone.trim() || undefined,
        email: formEmail.trim() || undefined,
        status: formStatus,
        paymentReference: formPaymentRef.trim() || undefined
      });
      onNotify(lang === 'sw' ? `Taarifa za ${formName} zimesasishwa!` : `Updated ${formName}'s member profile!`);
    } else {
      const now = new Date();
      const expiry = new Date(now);
      expiry.setFullYear(expiry.getFullYear() + 1);

      addMember({
        name: formName.trim(),
        voice: formVoice,
        role: formRole.trim() || 'Chorister',
        phone: formPhone.trim() || undefined,
        email: formEmail.trim() || undefined,
        status: formStatus,
        registeredAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
        renewalFeePaid: 500,
        paymentReference: formPaymentRef.trim() || `MPESA-SMTC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      });
      onNotify(lang === 'sw' ? `Mwimbaji mpya ${formName} ameongezwa!` : `Added new chorister ${formName}!`);
    }

    setIsModalOpen(false);
  };

  const handleRenew = (m: ChoirMember) => {
    const ref = prompt(
      lang === 'sw' ? `Weka kumbukumbu ya malipo ya M-Pesa kwa ${m.name} (KSh 500):` : `Enter M-Pesa confirmation code for ${m.name} (KSh 500 yearly):`,
      `MPESA-RNW-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    );
    if (ref !== null) {
      renewMember(m.id, ref);
      onNotify(lang === 'sw' ? `Uanachama wa ${m.name} umeongezwa kwa miezi 12!` : `Renewed ${m.name}'s membership for 12 months!`);
    }
  };

  const handleDelete = (m: ChoirMember) => {
    if (confirm(lang === 'sw' ? `Je, una uhakika wa kumfuta ${m.name}?` : `Are you sure you want to remove ${m.name} from the choir register?`)) {
      deleteMember(m.id);
      onNotify(lang === 'sw' ? `Mwimbaji ${m.name} amefutwa.` : `Chorister ${m.name} removed from roster.`);
    }
  };

  // Generate Official PDF Document using jsPDF
  const generateOfficialPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Header Banner
      doc.setFillColor(12, 35, 64); // Midnight Navy #0C2340
      doc.rect(0, 0, 210, 36, 'F');

      doc.setFillColor(16, 88, 168); // Marian Blue #1058A8
      doc.rect(0, 36, 210, 3, 'F');

      // Title & Diocese
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('CATHOLIC DIOCESE OF NAKURU', 105, 12, { align: 'center' });

      doc.setFontSize(13);
      doc.text('ST. MONICA CATHOLIC PARISH — SECTION 58', 105, 20, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(126, 200, 240); // Sky Blue #7EC8F0
      doc.text('THIRD MASS CHOIR · OFFICIAL ACTIVE CHORISTERS REGISTER', 105, 28, { align: 'center' });

      // Summary Statistics Row
      doc.setTextColor(12, 35, 64);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('SUMMARY OF CHORAL MEMBERSHIP', 14, 48);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      doc.text(`Generated on: ${today}  |  Active Registrations: ${counts.active} / ${counts.total}`, 14, 53);

      // Stat boxes
      const stats = [
        { label: 'Soprano', val: counts.soprano, x: 14 },
        { label: 'Alto', val: counts.alto, x: 52 },
        { label: 'Tenor', val: counts.tenor, x: 90 },
        { label: 'Bass', val: counts.bass, x: 128 },
        { label: 'Total Singers', val: counts.total, x: 166 }
      ];

      stats.forEach(s => {
        doc.setFillColor(245, 248, 252);
        doc.setDrawColor(200, 220, 240);
        doc.roundedRect(s.x, 57, 34, 16, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(16, 88, 168);
        doc.text(String(s.val), s.x + 17, 65, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(s.label, s.x + 17, 70, { align: 'center' });
      });

      // Table Header
      let y = 82;
      doc.setFillColor(12, 35, 64);
      doc.rect(14, y, 182, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);

      doc.text('#', 17, y + 5.5);
      doc.text('MEMBER NAME', 28, y + 5.5);
      doc.text('VOICE PART', 85, y + 5.5);
      doc.text('ROLE / OFFICE', 115, y + 5.5);
      doc.text('STATUS', 152, y + 5.5);
      doc.text('VALID UNTIL', 172, y + 5.5);

      y += 8;

      // Table Rows
      const listToPrint = filteredMembers.length > 0 ? filteredMembers : members;

      listToPrint.forEach((m, idx) => {
        if (y > 270) {
          doc.addPage();
          y = 20;

          // Repeat Header on new page
          doc.setFillColor(12, 35, 64);
          doc.rect(14, y, 182, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.text('#', 17, y + 5.5);
          doc.text('MEMBER NAME', 28, y + 5.5);
          doc.text('VOICE PART', 85, y + 5.5);
          doc.text('ROLE / OFFICE', 115, y + 5.5);
          doc.text('STATUS', 152, y + 5.5);
          doc.text('VALID UNTIL', 172, y + 5.5);
          y += 8;
        }

        const isActive = isMemberActive(m);
        const bg = idx % 2 === 0 ? 255 : 248;
        doc.setFillColor(bg, bg, bg);
        doc.rect(14, y, 182, 6.5, 'F');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(50, 50, 50);

        doc.text(String(idx + 1), 17, y + 4.5);
        doc.setFont('helvetica', 'bold');
        doc.text(m.name.slice(0, 28), 28, y + 4.5);

        // Voice part with capitalized styling
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(16, 88, 168);
        doc.text(m.voice.toUpperCase(), 85, y + 4.5);

        doc.setTextColor(60, 60, 60);
        doc.text((m.role || 'Chorister').slice(0, 18), 115, y + 4.5);

        if (isActive) {
          doc.setTextColor(16, 128, 64); // Green
          doc.text('ACTIVE', 152, y + 4.5);
        } else {
          doc.setTextColor(180, 50, 50); // Red
          doc.text('EXPIRED', 152, y + 4.5);
        }

        doc.setTextColor(80, 80, 80);
        const expDate = m.expiresAt ? new Date(m.expiresAt).toLocaleDateString('en-GB') : '-';
        doc.text(expDate, 172, y + 4.5);

        y += 6.5;
      });

      // Signature & Attestation Block
      if (y > 240) {
        doc.addPage();
        y = 30;
      } else {
        y += 12;
      }

      doc.setDrawColor(200, 200, 200);
      doc.line(14, y, 196, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(12, 35, 64);
      doc.text('OFFICIAL PARISH VERIFICATION & ATTESTATION', 14, y);

      y += 14;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);

      // Signature lines
      doc.text('_____________________________________', 20, y);
      doc.text('Choirmaster & Music Director', 20, y + 5);
      doc.text('St. Monica Third Mass Choir', 20, y + 9);

      doc.text('_____________________________________', 120, y);
      doc.text('Parish Priest / Patron', 120, y + 5);
      doc.text('St. Monica Parish Section 58 Nakuru', 120, y + 9);

      // Save PDF to user's device
      doc.save(`St_Monica_Choir_Register_${new Date().getFullYear()}.pdf`);
      onNotify(lang === 'sw' ? 'Orodha ya kwaya imepakuliwa kama PDF!' : 'Official Choir Register PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF error', err);
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#0C2340]/10 shadow-sm overflow-hidden">
        <AfricanGeometricBorder />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#0C2340]/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF4FB] text-[#1058A8] border border-[#7EC8F0]/40">
                  {lang === 'sw' ? 'Orodha ya Waimbaji' : 'Official Choristers Register'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'sw' ? 'Ada ya Uanachama: KES 500 / Mwaka' : 'KES 500 / 12-Month Renewal'}
                </span>
              </div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340] mt-1">
                {lang === 'sw' ? 'Usimamizi wa Waimbaji na Sauti za Kwaya' : 'Choir Members & Voice Sections'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-source mt-1 max-w-2xl">
                {lang === 'sw'
                  ? 'Dhibiti waimbaji wote wanaoshiriki Misa ya Tatu, sauti zao (Soprano, Alto, Tenor, Bass), tarehe za uanachama, na pakua orodha rasmi ya PDF kwa kumbukumbu ya parokia.'
                  : 'Manage all choristers in St. Monica Third Mass Choir, classify their voice sections (SATB), renew annual memberships, and generate official printable PDF rosters.'}
              </p>
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-[11px] font-semibold text-amber-900 font-source">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>
                  {lang === 'sw' 
                    ? 'Kumbuka: Upakiaji wa picha umeruhusiwa kwa Walimu na Viongozi pekee (sehemu ya Walimu na Viongozi).'
                    : 'Photo Policy: Member photos restricted. Only Trainers, Choirmasters & Officials have photo uploads.'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={generateOfficialPdf}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
                title="Download official PDF register"
              >
                <Download className="w-4 h-4 text-[#7EC8F0]" />
                <span>{lang === 'sw' ? 'Pakua PDF' : 'Export PDF Register'}</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="px-4 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'sw' ? 'Ongeza Mwimbaji' : 'Add New Chorister'}</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 bg-[#FAF8F5] border border-[#0C2340]/10 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Members</span>
              <span className="font-eb-garamond text-2xl font-bold text-[#0C2340] tabular-nums">{counts.total}</span>
              <span className="text-[10px] text-slate-500 block">Registered</span>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Active</span>
              <span className="font-eb-garamond text-2xl font-bold text-emerald-800 tabular-nums">{counts.active}</span>
              <span className="text-[10px] text-emerald-600 block">Valid 12-Mo</span>
            </div>

            <div 
              onClick={() => setVoiceFilter('soprano')}
              className={`p-3.5 border rounded-2xl text-center cursor-pointer transition-all ${
                voiceFilter === 'soprano' ? 'bg-[#1058A8] text-white border-[#1058A8] shadow-sm' : 'bg-white border-[#0C2340]/10 hover:border-[#1058A8]'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${voiceFilter === 'soprano' ? 'text-sky-200' : 'text-slate-500'}`}>
                Soprano
              </span>
              <span className="font-eb-garamond text-2xl font-bold tabular-nums">{counts.soprano}</span>
              <span className={`text-[10px] block ${voiceFilter === 'soprano' ? 'text-sky-200' : 'text-slate-400'}`}>Section 1</span>
            </div>

            <div 
              onClick={() => setVoiceFilter('alto')}
              className={`p-3.5 border rounded-2xl text-center cursor-pointer transition-all ${
                voiceFilter === 'alto' ? 'bg-[#1058A8] text-white border-[#1058A8] shadow-sm' : 'bg-white border-[#0C2340]/10 hover:border-[#1058A8]'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${voiceFilter === 'alto' ? 'text-sky-200' : 'text-slate-500'}`}>
                Alto
              </span>
              <span className="font-eb-garamond text-2xl font-bold tabular-nums">{counts.alto}</span>
              <span className={`text-[10px] block ${voiceFilter === 'alto' ? 'text-sky-200' : 'text-slate-400'}`}>Section 2</span>
            </div>

            <div 
              onClick={() => setVoiceFilter('tenor')}
              className={`p-3.5 border rounded-2xl text-center cursor-pointer transition-all ${
                voiceFilter === 'tenor' ? 'bg-[#1058A8] text-white border-[#1058A8] shadow-sm' : 'bg-white border-[#0C2340]/10 hover:border-[#1058A8]'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${voiceFilter === 'tenor' ? 'text-sky-200' : 'text-slate-500'}`}>
                Tenor
              </span>
              <span className="font-eb-garamond text-2xl font-bold tabular-nums">{counts.tenor}</span>
              <span className={`text-[10px] block ${voiceFilter === 'tenor' ? 'text-sky-200' : 'text-slate-400'}`}>Section 3</span>
            </div>

            <div 
              onClick={() => setVoiceFilter('bass')}
              className={`p-3.5 border rounded-2xl text-center cursor-pointer transition-all ${
                voiceFilter === 'bass' ? 'bg-[#1058A8] text-white border-[#1058A8] shadow-sm' : 'bg-white border-[#0C2340]/10 hover:border-[#1058A8]'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${voiceFilter === 'bass' ? 'text-sky-200' : 'text-slate-500'}`}>
                Bass
              </span>
              <span className="font-eb-garamond text-2xl font-bold tabular-nums">{counts.bass}</span>
              <span className={`text-[10px] block ${voiceFilter === 'bass' ? 'text-sky-200' : 'text-slate-400'}`}>Section 4</span>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'sw' ? 'Tafuta mwimbaji kwa jina, simu, au namba...' : 'Search chorister by name, phone, or role...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Voice & Status Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
              <span className="text-slate-400 text-[11px] mr-1">Voice:</span>
              {(['all', 'soprano', 'alto', 'tenor', 'bass'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setVoiceFilter(v)}
                  className={`px-2.5 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                    voiceFilter === v
                      ? 'bg-[#0C2340] text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {v === 'all' ? (lang === 'sw' ? 'Zote' : 'All') : v}
                </button>
              ))}

              <span className="text-slate-400 text-[11px] ml-2 mr-1">Status:</span>
              {(['all', 'active', 'expired'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                    statusFilter === s
                      ? 'bg-[#1058A8] text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {s === 'all' ? (lang === 'sw' ? 'Zote' : 'All') : s}
                </button>
              ))}
            </div>
          </div>

          {/* Members Table */}
          <div className="border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-source divide-y divide-[#0C2340]/10">
                <thead className="bg-[#FAF8F5] text-[#0C2340] font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Chorister Full Name</th>
                    <th className="py-3 px-4">Voice Section</th>
                    <th className="py-3 px-4">Role / Assignment</th>
                    <th className="py-3 px-4">Status & Validity</th>
                    <th className="py-3 px-4">M-Pesa Reference</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0C2340]/5 bg-white">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold">{lang === 'sw' ? 'Hakuna mwimbaji aliyepatikana.' : 'No choristers match your search or filter.'}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Try resetting the filters or adding a new member.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m, idx) => {
                      const isActive = isMemberActive(m);
                      const expiryFormatted = m.expiresAt ? new Date(m.expiresAt).toLocaleDateString('en-GB') : '-';

                      return (
                        <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-400 tabular-nums">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 text-sm">
                              {m.name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              {m.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{m.phone}</span>
                                </span>
                              )}
                              {m.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span>{m.email}</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                              m.voice === 'soprano' ? 'bg-pink-100 text-pink-800 border border-pink-200' :
                              m.voice === 'alto' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                              m.voice === 'tenor' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              'bg-amber-100 text-amber-900 border border-amber-200'
                            }`}>
                              {m.voice}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            <span className="font-medium">{m.role || 'Chorister'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              {isActive ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Active</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                                  <AlertCircle className="w-3 h-3 text-rose-600" />
                                  <span>Expired</span>
                                </span>
                              )}
                              <span className="text-[11px] text-slate-500">Exp: {expiryFormatted}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                            {m.paymentReference || 'KES 500 Paid'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => handleRenew(m)}
                                className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                                title="Renew 12-Month Membership"
                              >
                                <RotateCw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(m)}
                                className="p-1.5 rounded-lg text-[#1058A8] hover:bg-blue-50 cursor-pointer"
                                title="Edit Member Profile"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(m)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Delete Member"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Chorister Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0C2340]/20">
            <div className="flex items-center justify-between pb-4 border-b border-[#0C2340]/10">
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                {editingMember ? 'Edit Chorister Details' : 'Register New Chorister'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-source">
              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Chorister Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Scholastica Nekesa"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Voice Section *</label>
                  <select
                    value={formVoice}
                    onChange={e => setFormVoice(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                  >
                    <option value="soprano">Soprano</option>
                    <option value="alto">Alto</option>
                    <option value="tenor">Tenor</option>
                    <option value="bass">Bass</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Role / Responsibility</label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    placeholder="Chorister / Section Leader"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="0712 345 678"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="chorister@gmail.com"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Membership Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                  >
                    <option value="active">Active (Fully Paid)</option>
                    <option value="expired">Expired / Needs Renewal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">M-Pesa Reference (KES 500)</label>
                  <input
                    type="text"
                    value={formPaymentRef}
                    onChange={e => setFormPaymentRef(e.target.value)}
                    placeholder="SH81QW4019"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingMember ? 'Update Member' : 'Save Chorister'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
