// Client-side helper for Safaricom Daraja M-Pesa payments

export interface InitiateStkParams {
  name: string;
  phone: string;
  amount: number;
  purpose: 'Donations' | 'Membership' | 'Sheet music';
}

export interface StkInitiateResponse {
  success: boolean;
  checkoutRequestId: string;
  merchantRequestId?: string;
  message: string;
  phone: string;
  amount: number;
  purpose: string;
  isSimulated?: boolean;
}

export interface PaymentStatusResponse {
  status: 'Pending' | 'Success' | 'Failed' | 'Cancelled';
  mpesaReference: string;
  amount: number;
  supporterName: string;
  phone: string;
  purpose: 'Donations' | 'Membership' | 'Sheet music';
  date: string;
  resultDesc?: string;
}

export interface MpesaTransactionRecord {
  id: string;
  checkoutRequestId: string;
  merchantRequestId?: string;
  supporterName: string;
  phone: string;
  amount: number;
  purpose: 'Donations' | 'Membership' | 'Sheet music';
  mpesaReference: string;
  status: 'Pending' | 'Success' | 'Failed' | 'Cancelled';
  resultDesc?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsLedgerResponse {
  transactions: MpesaTransactionRecord[];
  totals: {
    donations: number;
    membership: number;
    sheetMusic: number;
    grandTotal: number;
  };
}

/**
 * Normalizes phone numbers entered as 07XX, 01XX, +254XX, or 254XX into 2547XXXXXXXX or 2541XXXXXXXX.
 */
export function normalizeMpesaPhone(input: string): { valid: boolean; normalized: string; error?: string } {
  if (!input) {
    return { valid: false, normalized: '', error: 'Phone number is required.' };
  }

  const cleaned = input.replace(/[\s\-\(\)\.\+]/g, '');

  let formatted = cleaned;
  if (/^0[17]\d{8}$/.test(cleaned)) {
    // 07XXXXXXXX or 01XXXXXXXX (10 digits) -> replace leading 0 with 254
    formatted = '254' + cleaned.substring(1);
  } else if (/^[17]\d{8}$/.test(cleaned)) {
    // 7XXXXXXXX or 1XXXXXXXX (9 digits) -> prepend 254
    formatted = '254' + cleaned;
  } else if (/^254[17]\d{8}$/.test(cleaned)) {
    formatted = cleaned;
  }

  if (/^254[17]\d{8}$/.test(formatted)) {
    return { valid: true, normalized: formatted };
  }

  return {
    valid: false,
    normalized: formatted,
    error: 'Enter a valid M-Pesa phone number (e.g. 07XX XXX XXX or 01XX XXX XXX).'
  };
}

/**
 * Initiates an STK push payment request.
 */
export async function initiateStkPush(params: InitiateStkParams): Promise<StkInitiateResponse> {
  const res = await fetch('/api/mpesa/stkpush', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to initiate M-Pesa STK Push');
  }

  return data;
}

/**
 * Polls the current status of a payment.
 */
export async function pollPaymentStatus(checkoutRequestId: string): Promise<PaymentStatusResponse> {
  const res = await fetch(`/api/mpesa/status/${encodeURIComponent(checkoutRequestId)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Could not fetch payment status');
  }
  return data;
}

/**
 * Fetches all transactions and category totals for the Admin Contributions page.
 */
export async function fetchMpesaTransactions(): Promise<TransactionsLedgerResponse> {
  const res = await fetch('/api/mpesa/transactions');
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch contributions');
  }
  return data;
}

/**
 * Manually records a transaction.
 */
export async function recordManualTransaction(record: Partial<MpesaTransactionRecord>): Promise<MpesaTransactionRecord> {
  const res = await fetch('/api/mpesa/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(record)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to record transaction');
  }
  return data.transaction;
}

/**
 * Deletes a transaction by ID.
 */
export async function deleteMpesaTransaction(id: string): Promise<void> {
  const res = await fetch(`/api/mpesa/transactions/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete transaction');
  }
}

/**
 * Sandbox helper to simulate callback result (success, cancelled, or failed).
 */
export async function simulatePaymentCallback(
  checkoutRequestId: string,
  outcome: 'success' | 'cancelled' | 'failed'
): Promise<any> {
  const res = await fetch('/api/mpesa/simulate-callback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ checkoutRequestId, outcome })
  });
  return res.json();
}

/**
 * Fetches safe configuration for UI displays.
 */
export async function getMpesaConfig(): Promise<{
  env: string;
  isProduction: boolean;
  shortcode: string;
  accountRef: string;
  callbackUrl: string;
  hasCredentials: boolean;
}> {
  const res = await fetch('/api/mpesa/config');
  return res.json();
}
