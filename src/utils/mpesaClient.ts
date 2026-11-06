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
 * Robust JSON fetcher that gracefully handles non-JSON/HTML error pages without throwing SyntaxError.
 */
async function safeJsonFetch<T = any>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (netErr: any) {
    throw new Error('Could not reach payment server. Please check your connection.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.errorMessage || data?.message || `Payment request failed (${res.status})`);
      }
      return data as T;
    } catch (parseErr: any) {
      if (parseErr.message && !parseErr.message.includes('Unexpected token') && !parseErr.message.includes('valid JSON')) {
        throw parseErr;
      }
    }
  }

  // Handle HTML or text responses
  const text = await res.text();
  if (text.includes('<html') || text.includes('<!DOCTYPE') || text.includes('<head')) {
    throw new Error('Payment service is connecting. Please wait a moment and try again.');
  }

  try {
    const data = JSON.parse(text);
    if (!res.ok) {
      throw new Error(data?.error || data?.message || `Payment request failed (${res.status})`);
    }
    return data as T;
  } catch {
    if (!res.ok) {
      throw new Error(text || `Request failed with status ${res.status}`);
    }
    return text as any;
  }
}

/**
 * Initiates an STK push payment request.
 */
export async function initiateStkPush(params: InitiateStkParams): Promise<StkInitiateResponse> {
  return safeJsonFetch<StkInitiateResponse>('/api/mpesa/stkpush', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
}

/**
 * Polls the current status of a payment.
 */
export async function pollPaymentStatus(checkoutRequestId: string): Promise<PaymentStatusResponse> {
  return safeJsonFetch<PaymentStatusResponse>(`/api/mpesa/status/${encodeURIComponent(checkoutRequestId)}`);
}

/**
 * Fetches all transactions and category totals for the Admin Contributions page.
 */
export async function fetchMpesaTransactions(): Promise<TransactionsLedgerResponse> {
  return safeJsonFetch<TransactionsLedgerResponse>('/api/mpesa/transactions');
}

/**
 * Manually records a transaction.
 */
export async function recordManualTransaction(record: Partial<MpesaTransactionRecord>): Promise<MpesaTransactionRecord> {
  const data = await safeJsonFetch<{ transaction: MpesaTransactionRecord }>('/api/mpesa/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(record)
  });
  return data.transaction;
}

/**
 * Deletes a transaction by ID.
 */
export async function deleteMpesaTransaction(id: string): Promise<void> {
  await safeJsonFetch(`/api/mpesa/transactions/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
}

/**
 * Sandbox helper to simulate callback result (success, cancelled, or failed).
 */
export async function simulatePaymentCallback(
  checkoutRequestId: string,
  outcome: 'success' | 'cancelled' | 'failed'
): Promise<any> {
  return safeJsonFetch('/api/mpesa/simulate-callback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ checkoutRequestId, outcome })
  });
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
  return safeJsonFetch('/api/mpesa/config');
}

