import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Initialize Supabase Server Client
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pzvpbixdefvztffjyrye.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qI6m1zfFhj0-PmK6aVp89w_pDGhrt33';
const supabaseServer: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Parse JSON bodies
app.use(express.json());

// ---------------------------------------------------------------------------
// Daraja M-Pesa Configuration
// ---------------------------------------------------------------------------
// Base URL and Shortcode derived dynamically from MPESA_ENV so switching to
// production requires no code changes.
const MPESA_ENV = (process.env.MPESA_ENV || 'sandbox').trim().toLowerCase();
const isProduction = MPESA_ENV === 'production';

const MPESA_BASE_URL = isProduction
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

const MPESA_SHORTCODE = (
  process.env.MPESA_SHORTCODE || (isProduction ? '678408' : '174379')
).trim();

const MPESA_ACCOUNT_REF = (
  process.env.MPESA_ACCOUNT_REF || '3RDMASSCHOIR'
).trim();

const MPESA_CONSUMER_KEY = (process.env.MPESA_CONSUMER_KEY || '').trim();
const MPESA_CONSUMER_SECRET = (process.env.MPESA_CONSUMER_SECRET || '').trim();

// Default public Safaricom sandbox passkey for shortcode 174379
const MPESA_PASSKEY = (
  process.env.MPESA_PASSKEY ||
  (isProduction ? '' : 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919')
).trim();

const MPESA_CALLBACK_URL = (process.env.MPESA_CALLBACK_URL || '').trim();

// ---------------------------------------------------------------------------
// Phone Normalization
// Accepts 07XX, 01XX, +254XX, or 254XX and converts to 2547XXXXXXXX or 2541XXXXXXXX
// ---------------------------------------------------------------------------
export function normalizePhone(input: string): { valid: boolean; phone: string; error?: string } {
  if (!input) {
    return { valid: false, phone: '', error: 'Phone number is required.' };
  }

  // Remove spaces, dashes, dots, parentheses, and leading plus sign
  const cleaned = input.replace(/[\s\-\(\)\.\+]/g, '');

  let formatted = cleaned;
  if (/^0[17]\d{8}$/.test(cleaned)) {
    // 07XXXXXXXX or 01XXXXXXXX (10 digits) -> replace leading 0 with 254
    formatted = '254' + cleaned.substring(1);
  } else if (/^[17]\d{8}$/.test(cleaned)) {
    // 7XXXXXXXX or 1XXXXXXXX (9 digits) -> prepend 254
    formatted = '254' + cleaned;
  } else if (/^254[17]\d{8}$/.test(cleaned)) {
    // Already in 254XXXXXXXXX format
    formatted = cleaned;
  }

  // Safaricom M-Pesa phone must be 12 digits starting with 2547 or 2541
  if (/^254[17]\d{8}$/.test(formatted)) {
    return { valid: true, phone: formatted };
  }

  return {
    valid: false,
    phone: formatted,
    error: 'Invalid M-Pesa number. Use 07XX XXX XXX or 01XX XXX XXX.'
  };
}

// ---------------------------------------------------------------------------
// Transaction Persistence (data/mpesa_transactions.json)
// ---------------------------------------------------------------------------
export interface MpesaTransaction {
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

const DATA_DIR = path.resolve(__dirname, 'data');
const TRANSACTIONS_FILE = path.resolve(DATA_DIR, 'mpesa_transactions.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(TRANSACTIONS_FILE)) {
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readTransactions(): MpesaTransaction[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(TRANSACTIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading transactions file:', err);
    return [];
  }
}

function writeTransactions(data: MpesaTransaction[]) {
  ensureDataFile();
  fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Supabase synchronization helpers
async function syncTransactionToSupabase(tx: MpesaTransaction) {
  try {
    const row = {
      id: tx.id,
      checkout_request_id: tx.checkoutRequestId,
      merchant_request_id: tx.merchantRequestId,
      supporter_name: tx.supporterName,
      phone: tx.phone,
      amount: tx.amount,
      purpose: tx.purpose,
      mpesa_reference: tx.mpesaReference,
      status: tx.status,
      result_desc: tx.resultDesc,
      date: tx.date,
      created_at: tx.createdAt,
      updated_at: tx.updatedAt
    };
    const { error } = await supabaseServer.from('contributions').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[Server Supabase Sync Notice]:', error.message);
    }
  } catch (err: any) {
    console.warn('[Server Supabase Sync Error]:', err.message);
  }
}

async function loadTransactionsFromSupabase(): Promise<MpesaTransaction[] | null> {
  try {
    const { data, error } = await supabaseServer
      .from('contributions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return null;
    }

    if (Array.isArray(data) && data.length > 0) {
      return data.map((row: any) => ({
        id: String(row.id),
        checkoutRequestId: row.checkout_request_id || '',
        merchantRequestId: row.merchant_request_id || '',
        supporterName: row.supporter_name || 'Supporter',
        phone: row.phone || '',
        amount: Number(row.amount) || 0,
        purpose: (row.purpose === 'Membership' ? 'Membership' : row.purpose === 'Sheet music' ? 'Sheet music' : 'Donations') as any,
        mpesaReference: row.mpesa_reference || '',
        status: (row.status || 'Pending') as any,
        resultDesc: row.result_desc || '',
        date: row.date || '',
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString()
      }));
    }
  } catch (err: any) {
    console.warn('[Server Supabase Query Error]:', err.message);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Safaricom Daraja Helpers
// ---------------------------------------------------------------------------
function getMpesaTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function getMpesaPassword(shortcode: string, passkey: string, timestamp: string): string {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

async function getDarajaToken(): Promise<string> {
  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    throw new Error('M-Pesa Consumer Key or Secret not configured in environment.');
  }

  const credentials = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const res = await fetch(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${credentials}`
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Daraja OAuth failed (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

// Format readable date e.g. "2026-11-06 14:30"
function getFormattedDateTime(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------

// 1. Config endpoint (safe for frontend inspection)
app.get('/api/mpesa/config', (_req: Request, res: Response) => {
  res.json({
    env: MPESA_ENV,
    isProduction,
    baseUrl: MPESA_BASE_URL,
    shortcode: MPESA_SHORTCODE,
    accountRef: MPESA_ACCOUNT_REF,
    callbackUrlConfigured: Boolean(MPESA_CALLBACK_URL),
    callbackUrl: MPESA_CALLBACK_URL || 'Not set (Required for Safaricom webhook)',
    hasCredentials: Boolean(MPESA_CONSUMER_KEY && MPESA_CONSUMER_SECRET)
  });
});

// 2. Initiate STK Push
app.post('/api/mpesa/stkpush', async (req: Request, res: Response) => {
  try {
    const { name, phone, amount, purpose } = req.body;

    // Validate inputs
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Supporter name is required.' });
    }

    const numericAmount = Math.round(Number(amount));
    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required (minimum KES 1).' });
    }

    const phoneCheck = normalizePhone(phone);
    if (!phoneCheck.valid) {
      return res.status(400).json({ error: phoneCheck.error });
    }

    // Standardize purpose to one of the 3 requested categories
    let normalizedPurpose: 'Donations' | 'Membership' | 'Sheet music' = 'Donations';
    const lowerPurpose = String(purpose || '').toLowerCase();
    if (lowerPurpose.includes('member')) {
      normalizedPurpose = 'Membership';
    } else if (lowerPurpose.includes('sheet') || lowerPurpose.includes('music') || lowerPurpose.includes('score')) {
      normalizedPurpose = 'Sheet music';
    } else {
      normalizedPurpose = 'Donations';
    }

    const timestamp = getMpesaTimestamp();
    const dateFormatted = getFormattedDateTime();
    const nowIso = new Date().toISOString();

    // Check if Daraja credentials are provided
    const hasLiveCredentials = Boolean(MPESA_CONSUMER_KEY && MPESA_CONSUMER_SECRET);

    if (hasLiveCredentials) {
      // Live Daraja STK Push call
      const token = await getDarajaToken();
      const password = getMpesaPassword(MPESA_SHORTCODE, MPESA_PASSKEY, timestamp);

      // Use specified callback URL or host callback URL
      const callbackUrl =
        MPESA_CALLBACK_URL ||
        `${req.protocol}://${req.get('host')}/api/mpesa/callback`;

      const stkBody = {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: numericAmount,
        PartyA: phoneCheck.phone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: phoneCheck.phone,
        CallBackURL: callbackUrl,
        AccountReference: MPESA_ACCOUNT_REF,
        TransactionDesc: `${normalizedPurpose} St Monica Choir`.substring(0, 30)
      };

      const darajaRes = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stkBody)
      });

      const darajaData = (await darajaRes.json()) as any;

      if (!darajaRes.ok || darajaData.ResponseCode !== '0') {
        return res.status(400).json({
          error: darajaData.errorMessage || darajaData.ResponseDescription || 'M-Pesa STK Push rejected by Safaricom',
          details: darajaData
        });
      }

      const checkoutRequestId = darajaData.CheckoutRequestID;
      const merchantRequestId = darajaData.MerchantRequestID;

      // Save Pending transaction
      const newTx: MpesaTransaction = {
        id: `tx-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        checkoutRequestId,
        merchantRequestId,
        supporterName: name.trim(),
        phone: phoneCheck.phone,
        amount: numericAmount,
        purpose: normalizedPurpose,
        mpesaReference: 'Pending',
        status: 'Pending',
        resultDesc: darajaData.CustomerMessage || 'STK Push sent to phone.',
        date: dateFormatted,
        createdAt: nowIso,
        updatedAt: nowIso
      };

      const txs = readTransactions();
      txs.unshift(newTx);
      writeTransactions(txs);
      syncTransactionToSupabase(newTx);

      return res.json({
        success: true,
        checkoutRequestId,
        merchantRequestId,
        message: darajaData.CustomerMessage || 'Check your phone and enter your M-Pesa PIN',
        phone: phoneCheck.phone,
        amount: numericAmount,
        purpose: normalizedPurpose,
        isSimulated: false
      });
    } else {
      // Sandbox development fallback when credentials are not yet set in environment.
      // Generates a mock checkoutRequestId so the user can test the prompt, polling, and simulation.
      const simulatedCheckoutId = `ws_CO_SANDBOX_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const simulatedMerchantId = `MR_SANDBOX_${Date.now()}`;

      const newTx: MpesaTransaction = {
        id: `tx-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        checkoutRequestId: simulatedCheckoutId,
        merchantRequestId: simulatedMerchantId,
        supporterName: name.trim(),
        phone: phoneCheck.phone,
        amount: numericAmount,
        purpose: normalizedPurpose,
        mpesaReference: 'Pending',
        status: 'Pending',
        resultDesc: 'Sandbox simulation: Check your phone and enter your PIN',
        date: dateFormatted,
        createdAt: nowIso,
        updatedAt: nowIso
      };

      const txs = readTransactions();
      txs.unshift(newTx);
      writeTransactions(txs);
      syncTransactionToSupabase(newTx);

      return res.json({
        success: true,
        checkoutRequestId: simulatedCheckoutId,
        merchantRequestId: simulatedMerchantId,
        message: 'Check your phone and enter your PIN',
        phone: phoneCheck.phone,
        amount: numericAmount,
        purpose: normalizedPurpose,
        isSimulated: true
      });
    }
  } catch (err: any) {
    console.error('Error in /api/mpesa/stkpush:', err);
    return res.status(500).json({
      error: err.message || 'Internal server error processing M-Pesa payment'
    });
  }
});

// 3. Safaricom Daraja Webhook Callback
// Safaricom posts the payment result here matching CheckoutRequestID
app.post('/api/mpesa/callback', (req: Request, res: Response) => {
  try {
    const callbackData = req.body?.Body?.stkCallback;

    if (!callbackData) {
      console.warn('Received invalid M-Pesa callback format');
      return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid payload' });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callbackData;

    console.log(`[M-Pesa Callback] CheckoutRequestID: ${CheckoutRequestID}, ResultCode: ${ResultCode}`);

    const txs = readTransactions();
    const txIndex = txs.findIndex(t => t.checkoutRequestId === CheckoutRequestID);

    if (txIndex === -1) {
      console.warn(`[M-Pesa Callback] No transaction found for CheckoutRequestID: ${CheckoutRequestID}`);
      // Safaricom still expects 200 OK
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const tx = txs[txIndex];
    tx.updatedAt = new Date().toISOString();
    tx.resultDesc = ResultDesc || '';

    if (ResultCode === 0) {
      // Success! Extract MpesaReceiptNumber and confirmed Amount from CallbackMetadata
      let receiptNumber = '';
      let confirmedAmount = tx.amount;

      if (CallbackMetadata?.Item && Array.isArray(CallbackMetadata.Item)) {
        for (const item of CallbackMetadata.Item) {
          if (item.Name === 'MpesaReceiptNumber' && item.Value) {
            receiptNumber = String(item.Value);
          }
          if (item.Name === 'Amount' && item.Value) {
            confirmedAmount = Number(item.Value);
          }
        }
      }

      tx.status = 'Success';
      tx.amount = confirmedAmount;
      tx.mpesaReference = receiptNumber || `RC${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    } else if (ResultCode === 1032) {
      // User cancelled on their phone
      tx.status = 'Cancelled';
      tx.resultDesc = 'Request cancelled by user on phone.';
    } else {
      // Any other failure (e.g. timeout, insufficient funds, incorrect PIN)
      tx.status = 'Failed';
      tx.resultDesc = ResultDesc || 'Payment failed or timed out.';
    }

    txs[txIndex] = tx;
    writeTransactions(txs);
    syncTransactionToSupabase(tx);

    // Safaricom Daraja expects a JSON acknowledgment
    return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    console.error('Error handling M-Pesa callback:', err);
    return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
});

// 4. Poll payment status by checkoutRequestId
app.get('/api/mpesa/status/:checkoutRequestId', (req: Request, res: Response) => {
  const { checkoutRequestId } = req.params;
  const txs = readTransactions();
  const tx = txs.find(t => t.checkoutRequestId === checkoutRequestId);

  if (!tx) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.json({
    status: tx.status,
    mpesaReference: tx.mpesaReference,
    amount: tx.amount,
    supporterName: tx.supporterName,
    phone: tx.phone,
    purpose: tx.purpose,
    date: tx.date,
    resultDesc: tx.resultDesc
  });
});

// 5. Get all transactions grouped and sorted newest first
app.get('/api/mpesa/transactions', async (_req: Request, res: Response) => {
  // Check Supabase first
  let txs = await loadTransactionsFromSupabase();
  if (!txs || txs.length === 0) {
    txs = readTransactions();
    // Background push initial local records to Supabase
    if (txs.length > 0) {
      txs.forEach(t => syncTransactionToSupabase(t));
    }
  } else {
    // Keep local cache fresh
    writeTransactions(txs);
  }

  // Sort newest first by createdAt / date
  const sorted = [...txs].sort((a, b) => {
    const timeA = new Date(a.createdAt || a.date).getTime();
    const timeB = new Date(b.createdAt || b.date).getTime();
    return timeB - timeA;
  });

  // Calculate confirmed totals for each of the 3 sections
  let donationsConfirmed = 0;
  let membershipConfirmed = 0;
  let sheetMusicConfirmed = 0;

  sorted.forEach(t => {
    if (t.status === 'Success') {
      if (t.purpose === 'Donations') donationsConfirmed += t.amount;
      else if (t.purpose === 'Membership') membershipConfirmed += t.amount;
      else if (t.purpose === 'Sheet music') sheetMusicConfirmed += t.amount;
    }
  });

  res.json({
    transactions: sorted,
    totals: {
      donations: donationsConfirmed,
      membership: membershipConfirmed,
      sheetMusic: sheetMusicConfirmed,
      grandTotal: donationsConfirmed + membershipConfirmed + sheetMusicConfirmed
    }
  });
});

// 6. Manual transaction recording by admin
app.post('/api/mpesa/transactions', (req: Request, res: Response) => {
  try {
    const { supporterName, phone, amount, purpose, mpesaReference, status } = req.body;

    if (!supporterName || !amount) {
      return res.status(400).json({ error: 'Supporter name and amount are required.' });
    }

    const now = new Date();
    const newTx: MpesaTransaction = {
      id: `tx-${Date.now()}`,
      checkoutRequestId: `manual_${Date.now()}`,
      supporterName: String(supporterName).trim(),
      phone: phone ? normalizePhone(phone).phone : '',
      amount: Math.round(Number(amount)),
      purpose: purpose === 'Membership' ? 'Membership' : purpose === 'Sheet music' ? 'Sheet music' : 'Donations',
      mpesaReference: mpesaReference ? String(mpesaReference).trim().toUpperCase() : `MPE${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: status || 'Success',
      date: getFormattedDateTime(now),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    const txs = readTransactions();
    txs.unshift(newTx);
    writeTransactions(txs);
    syncTransactionToSupabase(newTx);

    res.json({ success: true, transaction: newTx });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Delete transaction by ID
app.delete('/api/mpesa/transactions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const txs = readTransactions();
  const filtered = txs.filter(t => t.id !== id);
  writeTransactions(filtered);
  supabaseServer.from('contributions').delete().eq('id', id).then(() => {});
  res.json({ success: true });
});

// 8. Sandbox simulation helper
// Lets users test Success, Cancelled, and Failed states without waiting or needing ngrok
app.post('/api/mpesa/simulate-callback', (req: Request, res: Response) => {
  const { checkoutRequestId, outcome } = req.body;
  const txs = readTransactions();
  const txIndex = txs.findIndex(t => t.checkoutRequestId === checkoutRequestId);

  if (txIndex === -1) {
    return res.status(404).json({ error: 'Transaction not found for simulation' });
  }

  const tx = txs[txIndex];
  tx.updatedAt = new Date().toISOString();

  if (outcome === 'cancelled') {
    tx.status = 'Cancelled';
    tx.resultDesc = 'Request cancelled by user on phone.';
  } else if (outcome === 'failed') {
    tx.status = 'Failed';
    tx.resultDesc = 'Payment timed out or PIN entered incorrectly.';
  } else {
    // Default: Success
    tx.status = 'Success';
    tx.mpesaReference = `SH${Math.floor(10 + Math.random() * 89)}${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
    tx.resultDesc = 'The service request is processed successfully.';
  }

  txs[txIndex] = tx;
  writeTransactions(txs);
  syncTransactionToSupabase(tx);

  res.json({
    success: true,
    status: tx.status,
    mpesaReference: tx.mpesaReference,
    resultDesc: tx.resultDesc
  });
});

// ---------------------------------------------------------------------------
// Vite Middleware / Static Files Serving
// ---------------------------------------------------------------------------
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n=========================================================`);
    console.log(`St. Monica Choir Server running on http://0.0.0.0:${PORT}`);
    console.log(`Environment: ${MPESA_ENV.toUpperCase()}`);
    console.log(`Base URL:    ${MPESA_BASE_URL}`);
    console.log(`Shortcode:   ${MPESA_SHORTCODE}`);
    console.log(`Account Ref: ${MPESA_ACCOUNT_REF}`);
    console.log(`Callback:    ${MPESA_CALLBACK_URL || '/api/mpesa/callback'}`);
    console.log(`=========================================================\n`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
