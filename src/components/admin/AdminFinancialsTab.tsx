import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { 
  Plus, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  XCircle, 
  Trash2, 
  X, 
  Save, 
  RefreshCw,
  Smartphone,
  Check
} from 'lucide-react';
import jsPDF from 'jspdf';
import { 
  fetchMpesaTransactions, 
  recordManualTransaction, 
  deleteMpesaTransaction,
  MpesaTransactionRecord,
  normalizeMpesaPhone
} from '../../utils/mpesaClient';
import { supabase } from '../../lib/supabase';

interface AdminFinancialsTabProps {
  onNotify: (msg: string) => void;
}

type SectionKey = 'all' | 'Donations' | 'Membership' | 'Sheet music';

export const AdminFinancialsTab: React.FC<AdminFinancialsTabProps> = ({ onNotify }) => {
  const { lang, footerContact } = useChoir();

  const [transactions, setTransactions] = useState<MpesaTransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<SectionKey>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Manual modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAmount, setFormAmount] = useState<number>(1000);
  const [formPurpose, setFormPurpose] = useState<'Donations' | 'Membership' | 'Sheet music'>('Donations');
  const [formReference, setFormReference] = useState('');
  const [formStatus, setFormStatus] = useState<'Success' | 'Pending' | 'Failed' | 'Cancelled'>('Success');

  // Load transactions from server
  const loadData = useCallback(async (quiet = false) => {
    if (!quiet) setIsRefreshing(true);
    try {
      const res = await fetchMpesaTransactions();
      setTransactions(res.transactions || []);
    } catch (err) {
      console.error('Failed to load contributions ledger:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh fallback every 12 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 12000);

    // Live Realtime updates from Supabase
    let channel: any = null;
    try {
      channel = supabase
        .channel('realtime:contributions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contributions' }, () => {
          loadData(true);
        })
        .subscribe();
    } catch (_) {}

    return () => {
      clearInterval(interval);
      if (channel) {
        try { supabase.removeChannel(channel); } catch (_) {}
      }
    };
  }, [loadData]);

  // Grouped payments and confirmed totals calculation
  // Total confirmed sum for each section (only Success count towards confirmed sums)
  const stats = useMemo(() => {
    let donationsTotal = 0;
    let membershipTotal = 0;
    let sheetMusicTotal = 0;
    let pendingCount = 0;

    transactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.status === 'Success') {
        if (t.purpose === 'Donations') donationsTotal += amt;
        else if (t.purpose === 'Membership') membershipTotal += amt;
        else if (t.purpose === 'Sheet music') sheetMusicTotal += amt;
      } else if (t.status === 'Pending') {
        pendingCount += 1;
      }
    });

    return {
      donations: donationsTotal,
      membership: membershipTotal,
      sheetMusic: sheetMusicTotal,
      grandTotal: donationsTotal + membershipTotal + sheetMusicTotal,
      pendingCount
    };
  }, [transactions]);

  // Split into three sections, sorted newest first
  const sectionsData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch = (t: MpesaTransactionRecord) => {
      if (!q) return true;
      return (
        t.supporterName.toLowerCase().includes(q) ||
        (t.phone && t.phone.toLowerCase().includes(q)) ||
        t.mpesaReference.toLowerCase().includes(q) ||
        t.purpose.toLowerCase().includes(q) ||
        (t.resultDesc && t.resultDesc.toLowerCase().includes(q))
      );
    };

    const sortByNewest = (a: MpesaTransactionRecord, b: MpesaTransactionRecord) => {
      const timeA = new Date(a.createdAt || a.date).getTime();
      const timeB = new Date(b.createdAt || b.date).getTime();
      return timeB - timeA;
    };

    const donations = transactions
      .filter(t => t.purpose === 'Donations' && matchesSearch(t))
      .sort(sortByNewest);

    const membership = transactions
      .filter(t => t.purpose === 'Membership' && matchesSearch(t))
      .sort(sortByNewest);

    const sheetMusic = transactions
      .filter(t => t.purpose === 'Sheet music' && matchesSearch(t))
      .sort(sortByNewest);

    return { donations, membership, sheetMusic };
  }, [transactions, searchQuery]);

  const handleOpenAdd = () => {
    setFormName('');
    setFormPhone('');
    setFormAmount(1000);
    setFormPurpose('Donations');
    setFormReference(`SH${Math.floor(10 + Math.random() * 89)}${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`);
    setFormStatus('Success');
    setIsModalOpen(true);
  };

  const handleSaveManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formAmount <= 0) {
      alert('Please provide a valid supporter name and amount');
      return;
    }

    try {
      await recordManualTransaction({
        supporterName: formName.trim(),
        phone: formPhone.trim(),
        amount: Number(formAmount),
        purpose: formPurpose,
        mpesaReference: formReference.trim().toUpperCase(),
        status: formStatus
      });

      onNotify(`Contribution of KES ${Number(formAmount).toLocaleString()} recorded!`);
      setIsModalOpen(false);
      loadData(false);
    } catch (err: any) {
      alert(err.message || 'Failed to record contribution');
    }
  };

  const handleDelete = async (tx: MpesaTransactionRecord) => {
    if (confirm(`Delete transaction record for ${tx.supporterName} (${tx.mpesaReference})?`)) {
      try {
        await deleteMpesaTransaction(tx.id);
        onNotify('Transaction record deleted.');
        setTransactions(prev => prev.filter(t => t.id !== tx.id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete transaction');
      }
    }
  };

  // Status badge styling per requirement:
  // "Status colours: green for Success, orange for Pending, red for Failed or Cancelled."
  const renderStatusBadge = (status: MpesaTransactionRecord['status']) => {
    switch (status) {
      case 'Success':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Success</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Pending</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
            <span>Cancelled</span>
          </span>
        );
      case 'Failed':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
            <span>Failed</span>
          </span>
        );
    }
  };

  const formatDisplayDate = (dStr: string) => {
    if (!dStr) return '';
    try {
      const parsed = new Date(dStr.includes('T') ? dStr : dStr.replace(' ', 'T'));
      if (isNaN(parsed.getTime())) return dStr;
      const day = parsed.getDate();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[parsed.getMonth()];
      const year = parsed.getFullYear();
      let hours = parsed.getHours();
      const minutes = parsed.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12 || 12;
      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    } catch {
      return dStr;
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
      doc.text('THIRD MASS CHOIR · M-PESA CONTRIBUTIONS STATEMENT', 105, 27, { align: 'center' });

      // Summary
      let y = 46;
      doc.setTextColor(12, 35, 64);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('CONFIRMED CONTRIBUTIONS BY SECTION', 14, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);
      doc.text(`Official M-Pesa Shortcode: 174379 / 678408  |  Statement Date: ${today}`, 14, y + 5);

      y += 12;

      // Metric Boxes
      const metrics = [
        { label: '1. Donations (Confirmed)', val: `KES ${stats.donations.toLocaleString()}`, x: 14, w: 58 },
        { label: '2. Membership (Confirmed)', val: `KES ${stats.membership.toLocaleString()}`, x: 76, w: 58 },
        { label: '3. Sheet Music (Confirmed)', val: `KES ${stats.sheetMusic.toLocaleString()}`, x: 138, w: 58 }
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
      doc.text('SUPPORTER', 26, y + 5);
      doc.text('DATE & TIME', 72, y + 5);
      doc.text('AMOUNT', 104, y + 5);
      doc.text('PURPOSE', 128, y + 5);
      doc.text('M-PESA REF', 156, y + 5);
      doc.text('STATUS', 182, y + 5);

      y += 7.5;

      transactions.forEach((tx, idx) => {
        if (y > 270) {
          doc.addPage();
          y = 20;

          doc.setFillColor(12, 35, 64);
          doc.rect(14, y, 182, 7.5, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text('#', 17, y + 5);
          doc.text('SUPPORTER', 26, y + 5);
          doc.text('DATE & TIME', 72, y + 5);
          doc.text('AMOUNT', 104, y + 5);
          doc.text('PURPOSE', 128, y + 5);
          doc.text('M-PESA REF', 156, y + 5);
          doc.text('STATUS', 182, y + 5);
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
        doc.text(tx.supporterName.slice(0, 22), 26, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.text(tx.date.slice(0, 16), 72, y + 4.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 88, 168);
        doc.text(Number(tx.amount).toLocaleString(), 104, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(70, 70, 70);
        doc.text(tx.purpose, 128, y + 4.5);

        doc.setFont('courier', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(40, 40, 40);
        doc.text(tx.mpesaReference, 156, y + 4.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        if (tx.status === 'Success') {
          doc.setTextColor(22, 101, 52);
        } else if (tx.status === 'Pending') {
          doc.setTextColor(180, 83, 9);
        } else {
          doc.setTextColor(190, 18, 60);
        }
        doc.text(tx.status, 182, y + 4.5);

        y += 6.5;
      });

      doc.save(`St_Monica_Contributions_${new Date().getFullYear()}.pdf`);
      onNotify('Contributions statement PDF downloaded!');
    } catch (e) {
      console.error('PDF error', e);
      window.print();
    }
  };

  // Reusable Section Table Component
  const renderSectionTable = (
    title: string,
    items: MpesaTransactionRecord[],
    confirmedSum: number,
    sectionType: 'Donations' | 'Membership' | 'Sheet music'
  ) => {
    return (
      <div className="space-y-3 pt-2">
        {/* Section Header with Total Confirmed Sum */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#0C2340]/10">
          <div>
            <h3 className="font-eb-garamond text-lg font-bold text-[#0C2340] flex items-center gap-2">
              <span>{title}</span>
              <span className="text-xs font-source font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {items.length} {items.length === 1 ? 'payment' : 'payments'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-source mt-0.5">
              Newest payments first · Safaricom STK Push & Daraja verified
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Confirmed Sum
            </span>
            <span className="font-eb-garamond text-xl sm:text-2xl font-bold text-emerald-800 tabular-nums block">
              KES {confirmedSum.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Mobile-Responsive Table */}
        <div className="border border-[#0C2340]/10 rounded-xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-source divide-y divide-[#0C2340]/10">
              <thead className="bg-[#F8FAFC] text-[#0C2340] font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5 whitespace-nowrap">Supporter</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Date & Time</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Amount</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Purpose</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">M-Pesa reference</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Status</th>
                  <th className="py-3 px-3.5 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0C2340]/5">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      <p className="font-medium text-xs">
                        No {title.toLowerCase()} recorded yet.
                      </p>
                    </td>
                  </tr>
                ) : (
                  items.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. Supporter */}
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900 text-xs">
                          {tx.supporterName}
                        </div>
                        {tx.phone && (
                          <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                            {tx.phone}
                          </div>
                        )}
                      </td>

                      {/* 2. Date & Time */}
                      <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                        {formatDisplayDate(tx.date || tx.createdAt)}
                      </td>

                      {/* 3. Amount */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-xs tabular-nums">
                          KES {Number(tx.amount).toLocaleString()}
                        </span>
                      </td>

                      {/* 4. Purpose */}
                      <td className="py-3 px-3.5">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                          {tx.purpose}
                        </span>
                      </td>

                      {/* 5. M-Pesa reference */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-[#1058A8]">
                          {tx.mpesaReference}
                        </span>
                        {tx.resultDesc && tx.status !== 'Success' && (
                          <p className="text-[10px] text-slate-500 max-w-xs truncate" title={tx.resultDesc}>
                            {tx.resultDesc}
                          </p>
                        )}
                      </td>

                      {/* 6. Status: green for Success, orange for Pending, red for Failed or Cancelled */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        {renderStatusBadge(tx.status)}
                      </td>

                      {/* 7. Action */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(tx)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Main Container Card */}
      <div className="bg-white rounded-xl border border-[#0C2340]/15 p-5 sm:p-6 space-y-6 shadow-xs">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0C2340]/10">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                Contributions
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1058A8]/10 text-[#1058A8] border border-[#1058A8]/20">
                M-Pesa STK Push
              </span>
            </div>
            <p className="text-xs text-slate-600 font-source mt-0.5">
              Payments grouped into Donations, Membership, and Sheet music.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Refresh Button */}
            <button
              onClick={() => loadData(false)}
              disabled={isRefreshing}
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Fetch latest M-Pesa payments"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#1058A8]' : ''}`} />
              <span>{isRefreshing ? 'Checking...' : 'Refresh'}</span>
            </button>

            {/* Export PDF */}
            <button
              onClick={exportFinancialPdf}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-[#7EC8F0]" />
              <span>Export PDF</span>
            </button>

            {/* Add Manual Contribution */}
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 rounded-lg bg-[#1058A8] hover:bg-[#0C2340] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add contribution</span>
            </button>
          </div>
        </div>

        {/* Total Confirmed Sum Metric Tiles (for each of the 3 sections) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Section 1: Donations */}
          <div 
            onClick={() => setActiveSection('Donations')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeSection === 'Donations'
                ? 'bg-[#E8F1FC] border-[#1058A8] shadow-xs'
                : 'bg-[#FAF8F5] border-[#0C2340]/10 hover:border-[#1058A8]/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>1. Donations</span>
              <span className="text-[11px] text-emerald-700 font-bold">Confirmed</span>
            </div>
            <span className="font-eb-garamond text-2xl font-bold text-[#0C2340] tabular-nums block mt-1">
              KES {stats.donations.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-source block mt-0.5">
              {sectionsData.donations.length} records
            </span>
          </div>

          {/* Section 2: Membership */}
          <div 
            onClick={() => setActiveSection('Membership')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeSection === 'Membership'
                ? 'bg-[#E8F1FC] border-[#1058A8] shadow-xs'
                : 'bg-[#FAF8F5] border-[#0C2340]/10 hover:border-[#1058A8]/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>2. Membership</span>
              <span className="text-[11px] text-emerald-700 font-bold">Confirmed</span>
            </div>
            <span className="font-eb-garamond text-2xl font-bold text-[#0C2340] tabular-nums block mt-1">
              KES {stats.membership.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-source block mt-0.5">
              {sectionsData.membership.length} records · KES 500 each
            </span>
          </div>

          {/* Section 3: Sheet Music */}
          <div 
            onClick={() => setActiveSection('Sheet music')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeSection === 'Sheet music'
                ? 'bg-[#E8F1FC] border-[#1058A8] shadow-xs'
                : 'bg-[#FAF8F5] border-[#0C2340]/10 hover:border-[#1058A8]/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>3. Sheet Music</span>
              <span className="text-[11px] text-emerald-700 font-bold">Confirmed</span>
            </div>
            <span className="font-eb-garamond text-2xl font-bold text-[#0C2340] tabular-nums block mt-1">
              KES {stats.sheetMusic.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-source block mt-0.5">
              {sectionsData.sheetMusic.length} records
            </span>
          </div>
        </div>

        {/* Search & Section Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search supporter name, phone, or M-Pesa reference..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-400 text-[11px] mr-1">Section view:</span>
            {(['all', 'Donations', 'Membership', 'Sheet music'] as const).map(sec => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeSection === sec
                    ? 'bg-[#0C2340] text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sec === 'all' ? 'All 3 Sections' : sec}
              </button>
            ))}
          </div>
        </div>

        {/* THREE SECTIONS TABLES */}
        <div className="space-y-8 pt-2">
          {/* SECTION 1: DONATIONS */}
          {(activeSection === 'all' || activeSection === 'Donations') && (
            renderSectionTable(
              'Donations',
              sectionsData.donations,
              stats.donations,
              'Donations'
            )
          )}

          {/* SECTION 2: MEMBERSHIP */}
          {(activeSection === 'all' || activeSection === 'Membership') && (
            renderSectionTable(
              'Membership',
              sectionsData.membership,
              stats.membership,
              'Membership'
            )
          )}

          {/* SECTION 3: SHEET MUSIC */}
          {(activeSection === 'all' || activeSection === 'Sheet music') && (
            renderSectionTable(
              'Sheet Music',
              sectionsData.sheetMusic,
              stats.sheetMusic,
              'Sheet music'
            )
          )}
        </div>

      </div>

      {/* Manual Contribution Entry Modal */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-[#0C2340]/20 cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                Record Contribution
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveManual} className="space-y-4 text-xs font-source">
              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Supporter full name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Regina Muthoni"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Amount (KES) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formAmount}
                    onChange={e => setFormAmount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:border-[#1058A8] outline-none font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">M-Pesa phone number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Section / Purpose *</label>
                  <select
                    value={formPurpose}
                    onChange={e => setFormPurpose(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:border-[#1058A8] outline-none font-semibold text-[#0C2340]"
                  >
                    <option value="Donations">Donations</option>
                    <option value="Membership">Membership</option>
                    <option value="Sheet music">Sheet music</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:border-[#1058A8] outline-none font-semibold"
                  >
                    <option value="Success">Success (Confirmed)</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">M-Pesa Reference *</label>
                <input
                  type="text"
                  required
                  value={formReference}
                  onChange={e => setFormReference(e.target.value)}
                  placeholder="SH81QW4019"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:border-[#1058A8] outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-lg cursor-pointer shadow-xs flex items-center gap-1.5"
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
