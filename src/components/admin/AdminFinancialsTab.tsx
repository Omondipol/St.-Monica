import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RefreshCw,
  Download,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Smartphone,
  Wallet,
  Receipt,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Trash2,
  Lock,
  Loader2,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useChoir } from '../../context/ChoirContext';

interface AdminFinancialsTabProps {
  onNotify: (msg: string) => void;
}

interface GivingPurposeRow {
  code: string;
  label: string;
  active: boolean;
  sort?: number;
}

interface SupabasePaymentRow {
  id: string;
  checkout_request_id?: string;
  payer_name?: string | null;
  phone: string;
  amount: number;
  account_ref: string;
  status: 'pending' | 'success' | 'failed' | string;
  result_desc?: string | null;
  mpesa_receipt?: string | null;
  paid_at?: string | null;
  created_at: string;
}

const GIVE_LEDGER_EDGE_CODE = `import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Delete ONLY pending or failed payments — completed (success) payments are strictly protected
    if (body?.action === "delete") {
      const id = body?.id ? String(body.id) : "";
      const checkoutId = body?.checkout_request_id ? String(body.checkout_request_id) : "";
      if (!id && !checkoutId) return json({ error: "Missing payment identifier" }, 400);

      let lookup = supabase.from("payments").select("id, status");
      lookup = id ? lookup.eq("id", id) : lookup.eq("checkout_request_id", checkoutId);
      const { data: existing, error: findErr } = await lookup.maybeSingle();

      if (findErr) return json({ error: findErr.message }, 500);
      if (!existing) return json({ error: "Payment not found" }, 404);
      if (existing.status === "success") {
        return json({ error: "Completed payments cannot be deleted." }, 403);
      }

      const { error: delErr } = await supabase
        .from("payments")
        .delete()
        .eq("id", existing.id)
        .neq("status", "success");

      if (delErr) return json({ error: delErr.message }, 500);
      return json({ ok: true, deletedId: existing.id }, 200);
    }

    const limit = Math.min(Math.max(Number(body?.limit) || 200, 1), 500);
    const { data, error } = await supabase
      .from("payments")
      .select("id, checkout_request_id, payer_name, phone, amount, account_ref, status, result_desc, mpesa_receipt, paid_at, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return json({ error: error.message }, 500);
    return json({ payments: data || [] }, 200);
  } catch (err) {
    return json({ error: String(err?.message || err) }, 500);
  }
});`;

function normalizeKePhone(input?: string | null): string {
  const digits = String(input || '').replace(/\D/g, '');
  if (digits.length >= 9) return digits.slice(-9);
  return digits;
}

function formatDateTime(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const AdminFinancialsTab: React.FC<AdminFinancialsTabProps> = ({ onNotify }) => {
  const { transactions, members } = useChoir();

  const [ledgerRows, setLedgerRows] = useState<SupabasePaymentRow[]>([]);
  const [purposes, setPurposes] = useState<GivingPurposeRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [ledgerEdgeMissing, setLedgerEdgeMissing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [purposeFilter, setPurposeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'success' | 'pending' | 'failed'>('ALL');
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [showSetupCode, setShowSetupCode] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const memberNameByPhone = useMemo(() => {
    const map: Record<string, string> = {};
    for (const m of members || []) {
      const key = normalizeKePhone(m.phone);
      if (key && m.name) {
        map[key] = m.name;
      }
    }
    return map;
  }, [members]);

  const loadFinancials = useCallback(
    async (showToast = false) => {
      setIsLoading(true);
      setErrorMsg('');

      if (!supabase || !isSupabaseConfigured()) {
        setIsLoading(false);
        setErrorMsg('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
        return;
      }

      try {
        const [purposesRes, ledgerRes] = await Promise.all([
          supabase
            .from('giving_purposes')
            .select('code,label,active,sort')
            .eq('active', true)
            .order('sort'),
          supabase.functions.invoke('give-ledger', {
            body: { limit: 250 },
          }),
        ]);

        if (purposesRes.error) {
          setErrorMsg(purposesRes.error.message || 'Could not load giving_purposes.');
        } else {
          setPurposes(Array.isArray(purposesRes.data) ? purposesRes.data : []);
        }

        if (ledgerRes.error) {
          setLedgerEdgeMissing(true);
        } else if (Array.isArray(ledgerRes.data?.payments)) {
          setLedgerEdgeMissing(false);
          setLedgerRows(ledgerRes.data.payments);
        }

        if (showToast) {
          onNotify('Refreshed financial ledger from Supabase.');
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Error refreshing financial data.');
      } finally {
        setIsLoading(false);
      }
    },
    [onNotify]
  );

  useEffect(() => {
    loadFinancials(false);
  }, [loadFinancials]);

  // Merge server ledger rows with any real confirmed session transactions without duplicates
  const allPayments = useMemo<SupabasePaymentRow[]>(() => {
    const byKey = new Map<string, SupabasePaymentRow>();

    for (const row of ledgerRows) {
      const key = row.mpesa_receipt || row.checkout_request_id || row.id;
      byKey.set(key, row);
    }

    for (const tx of transactions) {
      const key = tx.mpesaReference || tx.id;
      if (!byKey.has(key)) {
        byKey.set(key, {
          id: tx.id,
          payer_name: tx.donorName && tx.donorName !== 'M-Pesa Supporter' && tx.donorName !== 'Supporter' ? tx.donorName : null,
          phone: tx.donorPhone || '—',
          amount: Number(tx.amountKes) || 0,
          account_ref: tx.purpose || 'CHOIROFFER',
          status: tx.status === 'completed' || tx.status === 'verified' ? 'success' : 'pending',
          result_desc: 'Confirmed via M-Pesa STK Push',
          mpesa_receipt: tx.mpesaReference || null,
          paid_at: tx.date,
          created_at: tx.date,
        });
      }
    }

    return Array.from(byKey.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [ledgerRows, transactions]);

  const resolveDisplayName = useCallback(
    (row: SupabasePaymentRow): string => {
      if (row.payer_name && row.payer_name.trim()) return row.payer_name.trim();
      const phoneKey = normalizeKePhone(row.phone);
      if (phoneKey && memberNameByPhone[phoneKey]) return memberNameByPhone[phoneKey];
      return '—';
    },
    [memberNameByPhone]
  );

  const purposeLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of purposes) {
      map[p.code] = p.label;
    }
    return map;
  }, [purposes]);

  const filteredPayments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPayments.filter((row) => {
      if (purposeFilter !== 'ALL' && row.account_ref !== purposeFilter) return false;
      if (statusFilter !== 'ALL' && row.status !== statusFilter) return false;
      if (!q) return true;
      const displayName = resolveDisplayName(row).toLowerCase();
      return (
        displayName.includes(q) ||
        (row.mpesa_receipt || '').toLowerCase().includes(q) ||
        (row.phone || '').toLowerCase().includes(q) ||
        (row.account_ref || '').toLowerCase().includes(q) ||
        (purposeLabelMap[row.account_ref] || '').toLowerCase().includes(q)
      );
    });
  }, [allPayments, purposeFilter, statusFilter, searchQuery, purposeLabelMap, resolveDisplayName]);

  const stats = useMemo(() => {
    let totalConfirmedKes = 0;
    let confirmedCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    for (const row of allPayments) {
      if (row.status === 'success') {
        totalConfirmedKes += Number(row.amount) || 0;
        confirmedCount += 1;
      } else if (row.status === 'pending') {
        pendingCount += 1;
      } else {
        failedCount += 1;
      }
    }

    return { totalConfirmedKes, confirmedCount, pendingCount, failedCount };
  }, [allPayments]);

  const handleDeletePayment = async (row: SupabasePaymentRow) => {
    // Completed payments must never be deleted
    if (row.status === 'success') {
      onNotify('Completed payments cannot be deleted.');
      return;
    }
    if (!supabase) {
      onNotify('Supabase is not configured.');
      return;
    }

    const rowKey = row.id || row.checkout_request_id || '';
    setDeletingKey(rowKey);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.functions.invoke('give-ledger', {
        body: {
          action: 'delete',
          id: row.id,
          checkout_request_id: row.checkout_request_id,
        },
      });

      if (error || data?.error) {
        const errText = data?.error || error?.message || 'Could not delete payment from Supabase.';
        setErrorMsg(errText);
        onNotify(errText);
        return;
      }

      setLedgerRows((prev) =>
        prev.filter((r) => (r.id || r.checkout_request_id) !== rowKey)
      );
      setConfirmDeleteKey(null);
      onNotify(`Deleted ${row.status} payment record.`);
    } catch (err: any) {
      const errText = err?.message || 'Failed to delete payment record.';
      setErrorMsg(errText);
      onNotify(errText);
    } finally {
      setDeletingKey(null);
    }
  };

  const handleExportCsv = () => {
    if (filteredPayments.length === 0) {
      onNotify('No payment records to export.');
      return;
    }
    const headers = ['Date', 'Name', 'Phone', 'Purpose Code', 'Purpose Label', 'M-Pesa Receipt', 'Amount (KES)', 'Status', 'Description'];
    const lines = [
      headers.join(','),
      ...filteredPayments.map((r) =>
        [
          `"${formatDateTime(r.paid_at || r.created_at)}"`,
          `"${resolveDisplayName(r).replace(/"/g, '""')}"`,
          `"${r.phone || ''}"`,
          `"${r.account_ref || ''}"`,
          `"${purposeLabelMap[r.account_ref] || r.account_ref || ''}"`,
          `"${r.mpesa_receipt || ''}"`,
          String(r.amount || 0),
          `"${r.status}"`,
          `"${(r.result_desc || '').replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `st-monica-mpesa-contributions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onNotify('Exported M-Pesa contributions CSV.');
  };

  const handleCopyEdgeCode = async () => {
    try {
      await navigator.clipboard.writeText(GIVE_LEDGER_EDGE_CODE);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      onNotify('Copied give-ledger Edge Function code.');
    } catch {
      onNotify('Could not copy automatically — please select and copy the code.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#0C2340]/15 p-5 sm:p-6 space-y-6 shadow-xs">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0C2340]/10">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                M-Pesa Giving & Contributions
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1058A8]/10 text-[#1058A8] border border-[#1058A8]/20">
                Supabase Connected
              </span>
            </div>
            <p className="text-xs text-slate-600 font-source mt-0.5">
              All M-Pesa STK Push payments recorded in Supabase. Completed payments are locked; pending and failed entries can be cleaned up.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-lg bg-[#FAF8F5] hover:bg-slate-100 border border-[#0C2340]/15 text-[#0C2340] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#1058A8]" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => loadFinancials(true)}
              disabled={isLoading}
              className="px-3 py-2 rounded-lg bg-[#1058A8] hover:bg-[#0C2340] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Refreshing...' : 'Refresh Ledger'}</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-[#0C2340] text-white space-y-1">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-sky-200 font-semibold">
              <span>Total Confirmed</span>
              <Wallet className="w-4 h-4 text-amber-300" />
            </div>
            <p className="font-eb-garamond text-2xl font-bold tabular-nums">
              KES {stats.totalConfirmedKes.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-300">Verified M-Pesa receipts</p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#0C2340]/10 space-y-1">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <span>Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-eb-garamond text-2xl font-bold text-[#0C2340] tabular-nums">
              {stats.confirmedCount}
            </p>
            <p className="text-[11px] text-slate-500">Protected · cannot delete</p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#0C2340]/10 space-y-1">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <span>Pending / Failed</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-eb-garamond text-2xl font-bold text-[#0C2340] tabular-nums">
              {stats.pendingCount} / {stats.failedCount}
            </p>
            <p className="text-[11px] text-slate-500">Deletable if incomplete</p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#0C2340]/10 space-y-1">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <span>Active Funds</span>
              <Receipt className="w-4 h-4 text-[#1058A8]" />
            </div>
            <p className="font-eb-garamond text-2xl font-bold text-[#0C2340] tabular-nums">
              {purposes.length}
            </p>
            <p className="text-[11px] text-slate-500">Active Paybill purposes</p>
          </div>
        </div>

        {/* Optional Setup Hint if give-ledger Edge Function is not deployed yet */}
        {ledgerEdgeMissing && !isLoading && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-2 text-xs text-amber-950 font-source">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    Deploy Edge Function <code className="font-mono">give-ledger</code> to stream and manage Supabase <code className="font-mono">payments</code> rows here
                  </p>
                  <p className="text-amber-900 mt-0.5">
                    Because <code className="font-mono">payments</code> is private (RLS), this tab reads and cleans up pending/failed entries securely via <code className="font-mono">give-ledger</code>.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSetupCode((v) => !v)}
                className="px-3 py-1.5 rounded-lg bg-amber-200/70 hover:bg-amber-200 text-amber-950 font-bold flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-center"
              >
                <span>{showSetupCode ? 'Hide Code' : 'Show Edge Function Code'}</span>
                {showSetupCode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showSetupCode && (
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    Create Edge Function named <code className="font-mono">give-ledger</code> (turn OFF Verify JWT):
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyEdgeCode}
                    className="px-2.5 py-1 rounded bg-[#0C2340] text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-[#0C2340] text-slate-100 text-[11px] overflow-x-auto max-h-60 font-mono">
                  {GIVE_LEDGER_EDGE_CODE}
                </pre>
              </div>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, receipt code, phone, or fund..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#0C2340]/20 bg-[#FAF8F5] text-xs text-[#0C2340] focus:outline-none focus:border-[#1058A8]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#0C2340]/20 bg-[#FAF8F5] text-xs font-semibold text-[#0C2340] focus:outline-none focus:border-[#1058A8]"
            >
              <option value="ALL">All Purposes</option>
              {purposes.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.label} ({p.code})
                </option>
              ))}
            </select>

            <div className="inline-flex rounded-lg border border-[#0C2340]/15 bg-[#FAF8F5] p-0.5 text-xs">
              {(['ALL', 'success', 'pending', 'failed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md font-semibold capitalize cursor-pointer transition-colors ${
                    statusFilter === st
                      ? 'bg-[#1058A8] text-white'
                      : 'text-slate-600 hover:text-[#0C2340]'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st === 'success' ? 'Confirmed' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recorded Payments Table */}
        <div className="overflow-x-auto rounded-xl border border-[#0C2340]/10">
          <table className="w-full text-left border-collapse font-source text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#0C2340]/10 text-[11px] uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4 font-bold">Date & Time</th>
                <th className="py-3 px-4 font-bold">Name</th>
                <th className="py-3 px-4 font-bold">Phone</th>
                <th className="py-3 px-4 font-bold">Purpose / Account</th>
                <th className="py-3 px-4 font-bold">M-Pesa Receipt</th>
                <th className="py-3 px-4 font-bold text-right">Amount</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0C2340]/10 bg-white">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 px-4 text-center text-slate-500">
                    {isLoading
                      ? 'Loading M-Pesa payment records from Supabase...'
                      : 'No M-Pesa payments recorded yet matching the selected filter.'}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((row) => {
                  const rowKey = row.id || row.checkout_request_id || '';
                  const isSuccess = row.status === 'success';
                  const isPending = row.status === 'pending';
                  const isConfirming = confirmDeleteKey === rowKey;
                  const isDeleting = deletingKey === rowKey;

                  return (
                    <tr key={rowKey} className="hover:bg-[#FAF8F5]/70 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        {formatDateTime(row.paid_at || row.created_at)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#0C2340] whitespace-nowrap">
                        {resolveDisplayName(row)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-700">
                        {row.phone || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#0C2340] block">
                          {purposeLabelMap[row.account_ref] || row.account_ref}
                        </span>
                        <span className="font-mono text-[10px] text-[#1058A8]">
                          {row.account_ref}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {row.mpesa_receipt ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold">
                            {row.mpesa_receipt}
                          </span>
                        ) : (
                          <span className="text-slate-400" title={row.result_desc || ''}>
                            {row.result_desc ? row.result_desc.slice(0, 26) : '—'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right font-bold text-[#0C2340] tabular-nums">
                        KES {Number(row.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isSuccess
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPending
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isSuccess ? 'Confirmed' : isPending ? 'Pending' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        {isSuccess ? (
                          <span
                            title="Completed payments cannot be deleted"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-400 bg-slate-100 cursor-not-allowed"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </span>
                        ) : isConfirming ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => handleDeletePayment(row)}
                              className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              {isDeleting && <Loader2 className="w-3 h-3 animate-spin" />}
                              <span>Confirm</span>
                            </button>
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => setConfirmDeleteKey(null)}
                              className="px-2 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 text-[11px] font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteKey(rowKey)}
                            title={`Delete ${row.status} payment`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Active Giving Purposes (Public Read from giving_purposes) */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#1058A8]" />
            <h3 className="font-eb-garamond text-lg font-bold text-[#0C2340]">
              Active Giving Purposes (<code className="font-mono text-xs">giving_purposes</code>)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {purposes.map((item) => (
              <div
                key={item.code}
                className="p-3 rounded-xl bg-[#FAF8F5] border border-[#0C2340]/10 flex items-center justify-between gap-2"
              >
                <div>
                  <span className="font-source font-bold text-xs text-[#0C2340] block">
                    {item.label}
                  </span>
                  <span className="font-mono text-[11px] text-[#1058A8] font-semibold">
                    {item.code}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
