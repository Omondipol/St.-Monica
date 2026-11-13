import React, { useMemo, useState, useEffect } from 'react';
import { useChoir } from '../context/ChoirContext';
import {
  X,
  Trash2,
  CheckCircle2,
  Download,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Loader2,
  AlertCircle,
  FlaskConical,
} from 'lucide-react';
import { AfricanGeometricBorder } from './AfricanGeometricBorder';

import scorePreviewMachozi from '../assets/images/score_preview_machozi_1791446357129.jpg';
import scorePreviewMaisha from '../assets/images/score_preview_maisha_1791446372899.jpg';
import scorePreviewNimzima from '../assets/images/score_preview_nimzima_1791446398645.jpg';
import scorePreviewJumuiya from '../assets/images/score_preview_jumuiya_1791446413261.jpg';
import sheetMusicHymnalImg from '../assets/images/sheet_music_hymnal_1791356751097.jpg';
import { getAssetUrl } from '../utils/assetHelper';
import { generateSongScorePdf } from '../utils/fileDownload';
import { useSupabaseMpesaPayment } from '../hooks/useSupabaseMpesaPayment';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    cartTotalKes,
    formatPrice,
    lang,
  } = useChoir();

  // Checkout flow state: 'cart' | 'checkout' | 'confirmed'
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [payerName, setPayerName] = useState('');
  const [phone, setPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const {
    purposes,
    purposesLoading,
    purposesError,
    status,
    message,
    isBusy,
    isSandbox,
    isConfigured,
    submitPayment,
    reset,
    stopPolling,
  } = useSupabaseMpesaPayment({
    onSuccess: (payment: any) => {
      setTransactionRef(payment?.mpesa_receipt || '');
      setCheckoutStep('confirmed');
    },
  });

  useEffect(() => {
    if (!isCartOpen) {
      stopPolling();
    }
  }, [isCartOpen, stopPolling]);

  const sheetMusicAccount = useMemo(() => {
    if (purposes.length === 0) return 'CHOIROFFER';
    const match = purposes.find((p: { code: string; label: string }) =>
      /sheet|music|noti|score/i.test(`${p.code} ${p.label}`)
    );
    return match ? match.code : purposes[0].code;
  }, [purposes]);

  if (!isCartOpen) return null;

  const getItemImage = (id: string, image?: string) => {
    const lower = id.toLowerCase();
    if (lower.includes('machozi')) return scorePreviewMachozi;
    if (lower.includes('maisha')) return scorePreviewMaisha;
    if (lower.includes('nimzima')) return scorePreviewNimzima;
    if (lower.includes('jumuiya')) return scorePreviewJumuiya;
    if (lower.includes('bundle') || image === 'sheet_music_hymnal') return sheetMusicHymnalImg;
    return getAssetUrl('/assets/choir/choir_02.jpg');
  };

  const handleFinishAndReset = () => {
    clearCart();
    setCheckoutStep('cart');
    setPayerName('');
    setPhone('');
    setTransactionRef('');
    setHasDownloaded(false);
    reset();
    setIsCartOpen(false);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPayment({
      phone,
      amount: cartTotalKes,
      account: sheetMusicAccount,
      payerName,
    });
  };

  const displayError =
    status === 'error'
      ? message
      : status === 'idle' && purposesError
        ? purposesError
        : '';

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-[#0C2340]/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#FAF8F5] text-[#0C2340] border-l border-[#0C2340]/15 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <AfricanGeometricBorder />

        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#0C2340]/10 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
              {checkoutStep === 'confirmed'
                ? (lang === 'sw' ? 'Agizo Limethibitishwa' : 'Order Confirmed')
                : checkoutStep === 'checkout'
                  ? (lang === 'sw' ? 'Lipa Agizo Lako' : 'Complete Your Order')
                  : (lang === 'sw' ? 'Mfuko wa Manunuzi' : 'Your Shopping Cart')}
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#0C2340] hover:bg-[#0C2340]/5 rounded-[12px] transition-colors cursor-pointer"
            aria-label={lang === 'sw' ? 'Funga mfuko' : 'Close cart'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART REVIEW */}
        {checkoutStep === 'cart' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col font-source">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#0C2340]/5 flex items-center justify-center text-slate-400">
                  <X className="w-6 h-6" />
                </div>
                <p className="text-[17px] font-semibold text-[#0C2340]">
                  {lang === 'sw' ? 'Mfuko wako wa manunuzi hauna kitu.' : 'Your cart is currently empty.'}
                </p>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  {lang === 'sw'
                    ? 'Tazama noti za nyimbo zetu katika duka ili kuongeza kwenye agizo lako.'
                    : 'Explore our sheet music scores in the store to add to your order.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#0C2340]/10 flex-1">
                {cart.map((item) => {
                  const isDigital =
                    item.product.downloadable ||
                    item.product.type === 'sheet_music' ||
                    item.product.type === 'digital_album';
                  const itemImg = getItemImage(item.product.id, item.product.image);

                  return (
                    <div key={item.product.id} className="py-3.5 flex items-start gap-3">
                      <div className="w-14 h-14 rounded-[12px] bg-[#FCFAF7] border border-[#0C2340]/15 overflow-hidden shrink-0 shadow-2xs">
                        <img
                          src={itemImg}
                          alt={lang === 'sw' ? item.product.nameSw : item.product.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-eb-garamond text-[17px] font-bold text-[#0C2340] leading-snug truncate">
                          {lang === 'sw' ? item.product.nameSw : item.product.name}
                        </h4>

                        <span className="tabular-nums text-xs font-semibold text-[#1058A8] block mt-0.5">
                          {formatPrice(item.product.priceKes)}
                        </span>

                        {isDigital ? (
                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#0C2340]/5">
                            <span className="text-[11px] text-slate-500">
                              {lang === 'sw' ? 'PDF, pakua papo hapo' : 'PDF, instant download'}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-xs text-slate-500 hover:text-[#0C2340] p-1 cursor-pointer flex items-center gap-1 transition-colors"
                              aria-label={lang === 'sw' ? 'Ondoa' : 'Remove'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-[11px]">{lang === 'sw' ? 'Ondoa' : 'Remove'}</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-[12px] border border-[#0C2340]/20 text-xs font-bold hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                            >
                              -
                            </button>
                            <span className="tabular-nums text-xs font-bold px-1.5">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-[12px] border border-[#0C2340]/20 text-xs font-bold hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="ml-auto text-xs text-slate-500 hover:text-[#0C2340] p-1 cursor-pointer"
                              aria-label={lang === 'sw' ? 'Ondoa' : 'Remove'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#0C2340]/10 mt-auto space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{lang === 'sw' ? 'Jumla ndogo:' : 'Subtotal:'}</span>
                  <span className="tabular-nums font-bold text-[#0C2340] font-eb-garamond text-[22px]">
                    {formatPrice(cartTotalKes)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 italic">
                  {lang === 'sw'
                    ? 'Kila mchango unatusaidia kupata noti na kurekodi Misa ya Jumapili.'
                    : 'Every gift helps us buy sheet music and record Sunday Mass.'}
                </p>

                <button
                  onClick={() => {
                    reset();
                    setCheckoutStep('checkout');
                  }}
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0E56A6] rounded-[12px] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{lang === 'sw' ? 'Endelea na agizo' : 'Proceed to checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: BESPOKE CART SHEET-MUSIC CHECKOUT (IN ORIGINAL DRAWER LAYOUT) */}
        {checkoutStep === 'checkout' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-source">
            <div className="p-3.5 rounded-[12px] bg-[#FCFAF7] border border-[#0C2340]/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  {lang === 'sw' ? `Bidhaa (${cart.length}):` : `Items (${cart.length}):`}
                </span>
                <span className="font-semibold text-[#0C2340] truncate max-w-[210px]">
                  {cart.map((c) => (lang === 'sw' ? c.product.nameSw : c.product.name)).join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#0C2340]/10">
                <span className="text-slate-600 font-semibold">{lang === 'sw' ? 'Jumla ya agizo:' : 'Order total:'}</span>
                <span className="tabular-nums font-bold text-[22px] text-[#1058A8] font-eb-garamond">
                  {formatPrice(cartTotalKes)}
                </span>
              </div>
            </div>

            {isSandbox && (
              <div
                role="status"
                className="rounded-lg bg-amber-100 border border-amber-300 px-3 py-1.5 flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-amber-950"
              >
                <FlaskConical className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>TEST MODE — Sandbox (No real money charged)</span>
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="cart-mpesa-name"
                  className="block text-xs font-bold uppercase tracking-wider text-[#0C2340]"
                >
                  {lang === 'sw' ? 'Jina Lako (Si lazima)' : 'Your Name (Optional)'}
                </label>
                <input
                  id="cart-mpesa-name"
                  type="text"
                  disabled={isBusy}
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder={lang === 'sw' ? 'Mfano: Mary Wambui' : 'e.g. Mary Wambui'}
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#0C2340]/20 bg-white text-sm text-[#0C2340] focus:outline-none focus:border-[#1058A8] disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="cart-mpesa-phone"
                  className="block text-xs font-bold uppercase tracking-wider text-[#0C2340]"
                >
                  {lang === 'sw' ? 'Namba ya Simu ya M-Pesa' : 'M-Pesa Phone Number'}
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="cart-mpesa-phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    disabled={isBusy}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-[12px] border border-[#0C2340]/20 bg-white text-sm text-[#0C2340] focus:outline-none focus:border-[#1058A8] disabled:opacity-60"
                  />
                </div>
              </div>

              {status === 'pending' && (
                <div className="p-3.5 rounded-[12px] bg-sky-50 border border-sky-200 text-sky-950 flex items-start gap-2.5 text-xs">
                  <Loader2 className="w-4 h-4 text-[#1058A8] animate-spin shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Check your phone and enter your M-Pesa PIN</p>
                    <p className="text-sky-900 mt-0.5">
                      {lang === 'sw'
                        ? 'Tunasubiri uthibitisho wa M-Pesa...'
                        : 'Waiting for M-Pesa confirmation...'}
                    </p>
                  </div>
                </div>
              )}

              {status === 'failed' && (
                <div className="p-3.5 rounded-[12px] bg-rose-50 border border-rose-200 text-rose-950 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{lang === 'sw' ? 'Malipo Hayakukamilika' : 'Payment Failed'}</span>
                  </div>
                  <p>{message}</p>
                </div>
              )}

              {displayError && (
                <div className="p-3 rounded-[12px] bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{displayError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isBusy || purposesLoading || !isConfigured}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0E56A6] rounded-[12px] transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {status === 'submitting'
                        ? (lang === 'sw' ? 'Inatuma ombi...' : 'Sending prompt...')
                        : (lang === 'sw' ? 'Inasubiri PIN...' : 'Waiting for PIN...')}
                    </span>
                  </>
                ) : (
                  <span>
                    {lang === 'sw'
                      ? `Lipa ${formatPrice(cartTotalKes)} kwa M-Pesa`
                      : `Pay ${formatPrice(cartTotalKes)} with M-Pesa`}
                  </span>
                )}
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={() => {
                  reset();
                  setCheckoutStep('cart');
                }}
                className="w-full py-2.5 px-3 text-xs font-semibold text-[#1058A8] border border-[#1058A8]/30 rounded-[12px] hover:bg-[#1058A8]/5 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === 'sw' ? 'Rudi kikapuni' : 'Back to cart'}</span>
              </button>
            </form>

            <p className="text-[11px] text-slate-500 font-source leading-relaxed pt-2 border-t border-[#0C2340]/10">
              {lang === 'sw'
                ? 'Tunatumia maelezo yako kwa mawasiliano ya kwaya pekee na yanalindwa chini ya Sheria ya Kulinda Data ya Kenya, 2019.'
                : "We use your details only for choir communication and are protected under Kenya's Data Protection Act, 2019."}
            </p>
          </div>
        )}

        {/* STEP 3: ORDER CONFIRMED AFTER REAL GIVE-STATUS SUCCESS */}
        {checkoutStep === 'confirmed' && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 font-source">
            <div className="w-14 h-14 rounded-full bg-[#1058A8]/10 text-[#1058A8] border border-[#1058A8] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#1058A8] block">
                {lang === 'sw' ? 'Asante sana na Mungu akubariki' : 'Thank you and God bless you'}
              </span>
              <h4 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Malipo yamekamilika' : 'Order complete'}
              </h4>
              {transactionRef && (
                <p className="text-xs text-slate-500">
                  {lang === 'sw' ? 'Risiti ya M-Pesa:' : 'M-Pesa Receipt:'}{' '}
                  <strong className="text-[#0C2340] font-mono tabular-nums">{transactionRef}</strong>
                </p>
              )}
            </div>

            <div className="w-full bg-[#FCFAF7] p-3.5 rounded-[12px] text-left text-xs space-y-2 border border-[#0C2340]/10">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{lang === 'sw' ? 'Kiasi kilicholipwa:' : 'Amount paid:'}</span>
                <strong className="text-[#1058A8] tabular-nums">{formatPrice(cartTotalKes)}</strong>
              </div>
            </div>

            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setHasDownloaded(true);
                  const digitalItems = cart.filter(
                    (item) => item.product.downloadable || item.product.type === 'sheet_music'
                  );
                  if (digitalItems.length > 0) {
                    digitalItems.forEach((item) => {
                      generateSongScorePdf({
                        title: item.product.name,
                        composer: 'St. Monica Catholic Choir',
                        voices: 'SATB',
                        language: 'Kiswahili',
                        sharingStatus: 'Licensed Score',
                      });
                    });
                  } else {
                    generateSongScorePdf({
                      title: 'Noti za Kwaya ya Mtakatifu Monika',
                      composer: 'St. Monica Catholic Choir',
                      voices: 'SATB',
                      language: 'Kiswahili',
                    });
                  }
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0E56A6] rounded-[12px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'sw' ? 'Pakua noti sasa (PDF)' : 'Download scores now (PDF)'}</span>
              </button>

              {hasDownloaded && (
                <p className="text-[11px] text-[#1058A8] text-center animate-in fade-in">
                  {lang === 'sw'
                    ? 'Faili ya noti za PDF inapakuliwa kwenye kifaa chako.'
                    : 'Your PDF sheet music file is downloading to your device.'}
                </p>
              )}

              <button
                type="button"
                onClick={handleFinishAndReset}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#0C2340] border border-[#0C2340]/20 hover:bg-[#0C2340]/5 rounded-[12px] transition-colors cursor-pointer"
              >
                {lang === 'sw' ? 'Kamilisha na funga' : 'Finish and close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
