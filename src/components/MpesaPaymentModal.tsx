import React, { useEffect } from 'react';
import { X, Smartphone } from 'lucide-react';
import { AfricanGeometricBorder } from './AfricanGeometricBorder';
import { GiveForm } from './GiveForm';

export interface MpesaPaymentResult {
  status: string;
  result_desc?: string | null;
  mpesa_receipt?: string | null;
  amount?: number;
  account_ref?: string;
}

export interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPurpose?: 'Donations' | 'Membership' | 'Sheet music';
  defaultAmount?: number;
  defaultName?: string;
  defaultPhone?: string;
  onPaymentSuccess?: (receipt: MpesaPaymentResult) => void;
}

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  isOpen,
  onClose,
  defaultPurpose = 'Donations',
  defaultAmount = 500,
  onPaymentSuccess,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initialAccount =
    defaultPurpose === 'Membership'
      ? 'MEMBERSHIP'
      : 'CHOIROFFER';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0C2340]/65 backdrop-blur-xs select-none overflow-y-auto cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-[#FAF8F5] text-[#0C2340] rounded-2xl border border-[#0C2340]/20 shadow-2xl overflow-hidden cursor-default transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <AfricanGeometricBorder />

        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-[#0C2340] hover:bg-[#0C2340]/10 transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-5 pt-4 pb-3 border-b border-[#0C2340]/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1058A8]/10 text-[#1058A8] flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340] leading-tight">
              Pay with M-Pesa
            </h3>
            <p className="text-xs text-slate-600 font-source">
              Safaricom STK Push · Verified via Supabase
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <GiveForm
            compact
            initialAccount={initialAccount}
            initialAmount={defaultAmount}
            onSuccess={(row: MpesaPaymentResult) => {
              if (onPaymentSuccess) onPaymentSuccess(row);
            }}
          />
        </div>
      </div>
    </div>
  );
};
