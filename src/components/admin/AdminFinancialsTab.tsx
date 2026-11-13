import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ShieldCheck, ExternalLink, Smartphone, CheckCircle2 } from 'lucide-react';
import { supabase, resolveSupabaseUrl } from '../../lib/supabase';

interface AdminFinancialsTabProps {
  onNotify: (msg: string) => void;
}

interface GivingPurposeRow {
  code: string;
  label: string;
  active: boolean;
  sort?: number;
}

export const AdminFinancialsTab: React.FC<AdminFinancialsTabProps> = ({ onNotify }) => {
  const [purposes, setPurposes] = useState<GivingPurposeRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loadPurposes = useCallback(async (showToast = false) => {
    setIsLoading(true);
    setErrorMsg('');

    if (!supabase) {
      setIsLoading(false);
      setErrorMsg('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to view active giving funds.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('giving_purposes')
        .select('code,label,active,sort')
        .eq('active', true)
        .order('sort');

      if (error) {
        setErrorMsg(error.message || 'Could not load giving_purposes.');
      } else {
        setPurposes(Array.isArray(data) ? data : []);
        if (showToast) {
          onNotify('Refreshed active giving funds from Supabase.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error loading giving_purposes.');
    } finally {
      setIsLoading(false);
    }
  }, [onNotify]);

  useEffect(() => {
    loadPurposes(false);
  }, [loadPurposes]);

  const supabaseBaseUrl = resolveSupabaseUrl();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#0C2340]/15 p-5 sm:p-6 space-y-6 shadow-xs">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0C2340]/10">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                M-Pesa Giving & Contributions
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1058A8]/10 text-[#1058A8] border border-[#1058A8]/20">
                Supabase Edge Functions
              </span>
            </div>
            <p className="text-xs text-slate-600 font-source mt-0.5">
              Payments are processed server-side via Supabase Edge Functions (<code className="font-mono text-[11px]">give-pay</code>, <code className="font-mono text-[11px]">give-status</code>, and <code className="font-mono text-[11px]">stk-callback</code>).
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadPurposes(true)}
            disabled={isLoading}
            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#1058A8]' : ''}`} />
            <span>{isLoading ? 'Loading...' : 'Refresh Funds'}</span>
          </button>
        </div>

        {/* Private Table Security Notice */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#0C2340]/15 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#1058A8] shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs font-source text-[#0C2340]">
            <p className="font-bold">Private Payment Ledger Security</p>
            <p className="text-slate-600 leading-relaxed">
              The <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">payments</code> and{' '}
              <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">callback_log</code> tables are private and intentionally never queried from the browser. View confirmed receipts and M-Pesa settlement logs directly inside your Supabase Project Dashboard.
            </p>
            {supabaseBaseUrl && (
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1058A8] hover:underline pt-1"
              >
                <span>Open Supabase Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Active Giving Purposes (Public Read) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#1058A8]" />
            <h3 className="font-eb-garamond text-lg font-bold text-[#0C2340]">
              Active Giving Purposes (<code className="font-mono text-xs">giving_purposes</code>)
            </h3>
          </div>

          {errorMsg ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              {errorMsg}
            </div>
          ) : purposes.length === 0 && !isLoading ? (
            <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
              No active rows returned from <code className="font-mono">giving_purposes</code>.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {purposes.map((item) => (
                <div
                  key={item.code}
                  className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#0C2340]/10 flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-source font-bold text-sm text-[#0C2340] block">
                      {item.label}
                    </span>
                    <span className="font-mono text-[11px] text-[#1058A8] font-semibold">
                      {item.code}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
