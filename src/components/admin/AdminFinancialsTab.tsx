import React, { useState, useMemo } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { SupporterTransaction } from '../../data/choirContent';
import { AfricanGeometricBorder } from '../AfricanGeometricBorder';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  Phone, 
  CreditCard, 
  Sparkles, 
  Heart, 
  Music, 
  Users, 
  Trash2, 
  X, 
  Save, 
  ArrowUpRight 
} from 'lucide-react';
import jsPDF from 'jspdf';

interface AdminFinancialsTabProps {
  onNotify: (msg: string) => void;
}

export const AdminFinancialsTab: React.FC<AdminFinancialsTabProps> = ({ onNotify }) => {
  const { lang, transactions, addTransaction, deleteTransaction, footerContact, formatPrice } = useChoir();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'donation' | 'sheet_music' | 'membership'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAmount, setFormAmount] = useState<number>(1000);
  const [formPurpose, setFormPurpose] = useState('Choir Ministry & Music Support');
  const [formPurposeSw, setFormPurposeSw] = useState('Mchango wa Utume wa Kwaya');
  const [formCategory, setFormCategory] = useState<'donation' | 'sheet_music' | 'membership'>('donation');
  const [formMethod, setFormMethod] = useState<'mpesa' | 'card' | 'cash'>('mpesa');
  const [formReference, setFormReference] = useState('');

  // Financial totals calculation
  const stats = useMemo(() => {
    let total = 0;
    let donations = 0;
    let sheetMusic = 0;
    let membership = 0;

    transactions.forEach(t => {
      const amt = Number(t.amountKes) || 0;
      total += amt;
      if (t.category === 'donation') donations += amt;
      else if (t.category === 'sheet_music') sheetMusic += amt;
      else if (t.category === 'membership') membership += amt;
    });

    return {
      total,
      donations,
      sheetMusic,
      membership,
      count: transactions.length
    };
  }, [transactions]);

  // Filtered list
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        t.donorName.toLowerCase().includes(q) ||
        (t.donorPhone && t.donorPhone.toLowerCase().includes(q)) ||
        t.mpesaReference.toLowerCase().includes(q) ||
        t.purpose.toLowerCase().includes(q);

      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchQuery, categoryFilter]);

  const handleOpenAdd = () => {
    setFormName('');
    setFormPhone('');
    setFormAmount(1000);
    setFormPurpose('Choir Ministry & Support');
    setFormPurposeSw('Mchango wa Utume wa Kwaya');
    setFormCategory('donation');
    setFormMethod('mpesa');
    setFormReference(`SH${Math.floor(10 + Math.random() * 89)}${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formAmount <= 0) {
      alert(lang === 'sw' ? 'Tafadhali weka jina na kiasi halali' : 'Please provide donor name and valid amount');
      return;
    }

    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    addTransaction({
      donorName: formName.trim(),
      donorPhone: formPhone.trim() || undefined,
      amountKes: Number(formAmount),
      date: dateFormatted,
      purpose: formPurpose.trim(),
      purposeSw: formPurposeSw.trim() || formPurpose.trim(),
      paymentMethod: formMethod,
      mpesaReference: formReference.trim().toUpperCase() || `MPESA-${Date.now()}`,
      status: 'verified',
      category: formCategory
    });

    onNotify(lang === 'sw' ? `Mchango wa KES ${formAmount.toLocaleString()} umerekodiwa!` : `Recorded contribution of KES ${formAmount.toLocaleString()}!`);
    setIsModalOpen(false);
  };

  const handleDelete = (tx: SupporterTransaction) => {
    if (confirm(lang === 'sw' ? `Futa rekodi ya ${tx.donorName}?` : `Delete transaction record for ${tx.donorName}?`)) {
      deleteTransaction(tx.id);
      onNotify(lang === 'sw' ? 'Rekodi imefutwa.' : 'Transaction record deleted.');
    }
  };

  // Export Financial PDF using jsPDF
  const exportFinancialPdf = () => {
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

      // Top Header Banner
      doc.setFillColor(12, 35, 64);
      doc.rect(0, 0, 210, 34, 'F');
      doc.setFillColor(16, 88, 168);
      doc.rect(0, 34, 210, 3, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('CATHOLIC DIOCESE OF NAKURU', 105, 12, { align: 'center' });

      doc.setFontSize(12);
      doc.text('ST. MONICA CATHOLIC PARISH — SECTION 58', 105, 20, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(126, 200, 240);
      doc.text('THIRD MASS CHOIR · OFFICIAL FINANCIAL & CONTRIBUTIONS STATEMENT', 105, 27, { align: 'center' });

      // Financial Summary Box
      let y = 46;
      doc.setTextColor(12, 35, 64);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('FINANCIAL STATEMENT & CONTRIBUTIONS SUMMARY', 14, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);
      doc.text(`Official M-Pesa Buy Goods Till: ${footerContact?.mpesaTill || '8421092'}  |  Statement Date: ${today}`, 14, y + 5);

      y += 12;

      // Metric Boxes
      const metrics = [
        { label: 'Total Funds Received', val: `KES ${stats.total.toLocaleString()}`, x: 14, w: 46 },
        { label: 'Choir Donations & Gifts', val: `KES ${stats.donations.toLocaleString()}`, x: 63, w: 43 },
        { label: 'Sheet Music Sales', val: `KES ${stats.sheetMusic.toLocaleString()}`, x: 109, w: 43 },
        { label: 'Membership Dues', val: `KES ${stats.membership.toLocaleString()}`, x: 155, w: 41 }
      ];

      metrics.forEach(m => {
        doc.setFillColor(245, 248, 252);
        doc.setDrawColor(200, 220, 240);
        doc.roundedRect(m.x, y, m.w, 16, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(16, 88, 168);
        doc.text(m.val, m.x + (m.w / 2), y + 7, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(90, 90, 90);
        doc.text(m.label, m.x + (m.w / 2), y + 12, { align: 'center' });
      });

      y += 24;

      // Table Header
      doc.setFillColor(12, 35, 64);
      doc.rect(14, y, 182, 7.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);

      doc.text('#', 17, y + 5);
      doc.text('SUPPORTER / DONOR', 26, y + 5);
      doc.text('DATE', 75, y + 5);
      doc.text('AMOUNT (KES)', 102, y + 5);
      doc.text('PURPOSE / DESTINATION', 130, y + 5);
      doc.text('M-PESA REF', 170, y + 5);

      y += 7.5;

      const listToPrint = filteredTransactions.length > 0 ? filteredTransactions : transactions;

      listToPrint.forEach((tx, idx) => {
        if (y > 270) {
          doc.addPage();
          y = 20;

          // Header
          doc.setFillColor(12, 35, 64);
          doc.rect(14, y, 182, 7.5, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text('#', 17, y + 5);
          doc.text('SUPPORTER / DONOR', 26, y + 5);
          doc.text('DATE', 75, y + 5);
          doc.text('AMOUNT (KES)', 102, y + 5);
          doc.text('PURPOSE / DESTINATION', 130, y + 5);
          doc.text('M-PESA REF', 170, y + 5);
          y += 7.5;
        }

        const bg = idx % 2 === 0 ? 255 : 248;
        doc.setFillColor(bg, bg, bg);
        doc.rect(14, y, 182, 6.5, 'F');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(60, 60, 60);

        doc.text(String(idx + 1), 17, y + 4.5);
        doc.setFont('helvetica', 'bold');
        doc.text(tx.donorName.slice(0, 24), 26, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.text(tx.date.slice(0, 10), 75, y + 4.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 88, 168);
        doc.text(Number(tx.amountKes).toLocaleString(), 102, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(70, 70, 70);
        doc.text(tx.purpose.slice(0, 24), 130, y + 4.5);

        doc.setFont('courier', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(40, 40, 40);
        doc.text(tx.mpesaReference, 170, y + 4.5);

        y += 6.5;
      });

      // Signature Block
      if (y > 240) {
        doc.addPage();
        y = 30;
      } else {
        y += 14;
      }

      doc.setDrawColor(200, 200, 200);
      doc.line(14, y, 196, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(12, 35, 64);
      doc.text('OFFICIAL PARISH FINANCIAL VERIFICATION', 14, y);

      y += 14;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);

      doc.text('_____________________________________', 20, y);
      doc.text('Choir Treasurer & Finance Committee', 20, y + 5);
      doc.text('St. Monica Third Mass Choir', 20, y + 9);

      doc.text('_____________________________________', 120, y);
      doc.text('Parish Priest / Administrator', 120, y + 5);
      doc.text('St. Monica Catholic Church Nakuru', 120, y + 9);

      doc.save(`St_Monica_Choir_Financial_Report_${new Date().getFullYear()}.pdf`);
      onNotify(lang === 'sw' ? 'Ripoti ya Fedha imepakuliwa kama PDF!' : 'Official Financial Statement PDF downloaded!');
    } catch (e) {
      console.error('PDF error', e);
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-[#0C2340]/10 shadow-sm overflow-hidden">
        <AfricanGeometricBorder />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#0C2340]/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF4FB] text-[#1058A8] border border-[#7EC8F0]/40">
                  {lang === 'sw' ? 'Daftari la Michango na Mauzo' : 'Contributions & Financial Ledger'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Till: <strong className="text-slate-800">{footerContact?.mpesaTill || '8421092'}</strong>
                </span>
              </div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340] mt-1">
                {lang === 'sw' ? 'Fedha Zote Zilizopokelewa Kupitia Tovuti' : 'Funds Received & Supporter Records'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-source mt-1 max-w-2xl">
                {lang === 'sw'
                  ? 'Fuatilia michango yote ya kwaya, ununuzi wa noti za muziki, ada za waimbaji, na utoe ripoti rasmi ya fedha (PDF).'
                  : 'Track all incoming choir donations, hymn sponsorships, sheet music purchases, and annual membership dues with full M-Pesa verification.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={exportFinancialPdf}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4 text-[#7EC8F0]" />
                <span>{lang === 'sw' ? 'Pakua Taarifa (PDF)' : 'Export Financial PDF'}</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="px-4 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'sw' ? 'Rekodi Mchango' : 'Record Contribution'}</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Received</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2">
                <span className="font-eb-garamond text-2xl sm:text-3xl font-bold text-emerald-950 tabular-nums">
                  KES {stats.total.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-700 block mt-0.5">
                  Across {stats.count} transactions
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#0C2340]/10 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0C2340] uppercase tracking-wider">Choir Support / Gifts</span>
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-2">
                <span className="font-eb-garamond text-2xl font-bold text-[#0C2340] tabular-nums">
                  KES {stats.donations.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Sound, vestments, hymn gifts
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#0C2340]/10 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0C2340] uppercase tracking-wider">Sheet Music Sales</span>
                <Music className="w-4 h-4 text-[#1058A8]" />
              </div>
              <div className="mt-2">
                <span className="font-eb-garamond text-2xl font-bold text-[#0C2340] tabular-nums">
                  KES {stats.sheetMusic.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  SATB scores & bundles
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#0C2340]/10 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0C2340] uppercase tracking-wider">Chorister Dues</span>
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2">
                <span className="font-eb-garamond text-2xl font-bold text-[#0C2340] tabular-nums">
                  KES {stats.membership.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Annual 500 KES registrations
                </span>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'sw' ? 'Tafuta kwa jina la mchangiaji, simu, au namba ya M-Pesa...' : 'Search supporter, phone, or M-Pesa code...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
              <span className="text-slate-400 text-[11px] mr-1">Category:</span>
              {(['all', 'donation', 'sheet_music', 'membership'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                    categoryFilter === c
                      ? 'bg-[#0C2340] text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c === 'all' ? (lang === 'sw' ? 'Zote' : 'All') :
                   c === 'donation' ? (lang === 'sw' ? 'Michango' : 'Donations') :
                   c === 'sheet_music' ? (lang === 'sw' ? 'Noti za Wimbo' : 'Sheet Music') :
                   (lang === 'sw' ? 'Uanachama' : 'Membership')}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Ledger Table */}
          <div className="border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-source divide-y divide-[#0C2340]/10">
                <thead className="bg-[#FAF8F5] text-[#0C2340] font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Supporter / Donor</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Purpose / Purpose Sw</th>
                    <th className="py-3 px-4">M-Pesa Reference</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0C2340]/5 bg-white">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <DollarSign className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold">{lang === 'sw' ? 'Hakuna rekodi zilizopatikana.' : 'No transactions match your search.'}</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx, idx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-400 tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 text-sm">
                            {tx.donorName}
                          </div>
                          {tx.donorPhone && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{tx.donorPhone}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {tx.date}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-emerald-800 text-sm tabular-nums">
                            KES {Number(tx.amountKes).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-medium text-slate-800">
                            {tx.purpose}
                          </div>
                          {tx.purposeSw && (
                            <div className="text-[10px] text-slate-500 italic">
                              {tx.purposeSw}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] font-bold text-[#1058A8]">
                          {tx.mpesaReference}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDelete(tx)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Contribution Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0C2340]/20">
            <div className="flex items-center justify-between pb-4 border-b border-[#0C2340]/10">
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                Record Contribution / Payment
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-source">
              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Donor / Supporter Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Regina Muthoni"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Amount (KES) *</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={formAmount}
                    onChange={e => setFormAmount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="0722 123 456"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                  >
                    <option value="donation">Choir Support / Donation</option>
                    <option value="sheet_music">Sheet Music Purchase</option>
                    <option value="membership">Annual Membership Dues</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">M-Pesa Reference *</label>
                  <input
                    type="text"
                    required
                    value={formReference}
                    onChange={e => setFormReference(e.target.value)}
                    placeholder="SH81QW4019"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Purpose / Note</label>
                <input
                  type="text"
                  value={formPurpose}
                  onChange={e => setFormPurpose(e.target.value)}
                  placeholder="e.g. Sound equipment fund / Wimbo Machozi"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                />
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
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
