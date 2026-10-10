import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { 
  X, 
  Trash2, 
  Smartphone, 
  CheckCircle2, 
  Download, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { AfricanGeometricBorder } from './AfricanGeometricBorder';

import scorePreviewMachozi from '../assets/images/score_preview_machozi_1791446357129.jpg';
import scorePreviewMaisha from '../assets/images/score_preview_maisha_1791446372899.jpg';
import scorePreviewNimzima from '../assets/images/score_preview_nimzima_1791446398645.jpg';
import scorePreviewJumuiya from '../assets/images/score_preview_jumuiya_1791446413261.jpg';
import sheetMusicHymnalImg from '../assets/images/sheet_music_hymnal_1791356751097.jpg';
import choirHeroImg from '../assets/images/choir_singing_moment_1791356740170.jpg';

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
    lang 
  } = useChoir();

  // Checkout flow state: 'cart' | 'checkout' | 'processing_mpesa' | 'confirmed'
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'processing_mpesa' | 'confirmed'>('cart');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [mpesaCountdown, setMpesaCountdown] = useState(3);
  const [transactionRef, setTransactionRef] = useState('');
  const [hasDownloaded, setHasDownloaded] = useState(false);

  if (!isCartOpen) return null;

  const getItemImage = (id: string, image?: string) => {
    const lower = id.toLowerCase();
    if (lower.includes('machozi')) return scorePreviewMachozi;
    if (lower.includes('maisha')) return scorePreviewMaisha;
    if (lower.includes('nimzima')) return scorePreviewNimzima;
    if (lower.includes('jumuiya')) return scorePreviewJumuiya;
    if (lower.includes('bundle') || image === 'sheet_music_hymnal') return sheetMusicHymnalImg;
    return choirHeroImg;
  };

  const handleStartCheckout = () => {
    setCheckoutStep('checkout');
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    const isValid = /^(?:\+254|0)[17]\d{8}$/.test(cleaned) || cleaned.length >= 9;

    if (!phoneNumber.trim()) {
      setPhoneError(lang === 'sw' ? 'Tafadhali weka nambari ya simu ya M-Pesa' : 'Please enter your M-Pesa phone number');
      return;
    }
    if (!isValid) {
      setPhoneError(lang === 'sw' ? 'Weka nambari sahihi ya Safaricom (mfano: 07XX XXX XXX)' : 'Please enter a valid Safaricom number (e.g. 07XX XXX XXX)');
      return;
    }

    setPhoneError('');
    setCheckoutStep('processing_mpesa');
    setMpesaCountdown(3);
    
    // Simulate Safaricom STK Push confirmation
    const timer = setInterval(() => {
      setMpesaCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTransactionRef(`SMCN-${Math.floor(100000 + Math.random() * 900000)}`);
          setCheckoutStep('confirmed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleFinishAndReset = () => {
    clearCart();
    setCheckoutStep('cart');
    setPhoneNumber('');
    setHasDownloaded(false);
    setIsCartOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-[#0C2340]/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartOpen(false)}
    >
      {/* Paper Slip Drawer in warm cream and navy */}
      <div 
        className="w-full max-w-md bg-[#FAF8F5] text-[#0C2340] border-l border-[#0C2340]/15 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle geometric strip along top edge */}
        <AfricanGeometricBorder />

        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#0C2340]/10 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
              {checkoutStep === 'confirmed' 
                ? (lang === 'sw' ? 'Agizo Limethibitishwa' : 'Order Confirmed')
                : (checkoutStep === 'checkout' || checkoutStep === 'processing_mpesa')
                  ? (lang === 'sw' ? 'Agizo Lako' : 'Your Order')
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
                  const isDigital = item.product.downloadable || item.product.type === 'sheet_music' || item.product.type === 'digital_album';
                  const itemImg = getItemImage(item.product.id, item.product.image);

                  return (
                    <div key={item.product.id} className="py-3.5 flex items-start gap-3">
                      {/* Score Preview Image instead of generic bag icon */}
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

                        {/* Digital items: Remove quantity buttons, show PDF, instant download */}
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
                          /* Non-digital items: quantity controls */
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

            {/* Bottom summary and start checkout */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#0C2340]/10 mt-auto space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{lang === 'sw' ? 'Jumla ndogo:' : 'Subtotal:'}</span>
                  <span className="tabular-nums font-bold text-[#0C2340] text-base font-eb-garamond text-[22px]">
                    {formatPrice(cartTotalKes)}
                  </span>
                </div>
                
                {/* One unified sentence from treasurer */}
                <p className="text-[11px] text-slate-600 italic">
                  {lang === 'sw' 
                    ? 'Kila mchango unatusaidia kupata noti na kurekodi Misa ya Jumapili.'
                    : 'Every gift helps us buy sheet music and record Sunday Mass.'}
                </p>

                <button
                  onClick={handleStartCheckout}
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0E56A6] rounded-[12px] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{lang === 'sw' ? 'Endelea na agizo' : 'Proceed to checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CHECKOUT FORM WITH M-PESA */}
        {checkoutStep === 'checkout' && (
          <form onSubmit={handleExecutePayment} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-source">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-[#0C2340]/10">
              <span className="text-slate-600">{lang === 'sw' ? 'Jumla ya agizo:' : 'Order total:'}</span>
              <span className="tabular-nums font-bold text-[22px] text-[#1058A8] font-eb-garamond">
                {formatPrice(cartTotalKes)}
              </span>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Jina kamili:' : 'Full name:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'sw' ? 'mfano: Maria Wanjiru' : 'e.g. Mary Wanjiru'}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#0C2340]/20 rounded-[12px] focus:outline-none focus:border-[#1058A8] bg-white text-[#0C2340]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Barua pepe (kwa ajili ya kiungo cha noti):' : 'Email address (for download links):'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#0C2340]/20 rounded-[12px] focus:outline-none focus:border-[#1058A8] bg-white text-[#0C2340]"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-2 border-t border-[#0C2340]/10 space-y-2">
              <label className="text-xs font-semibold text-[#0C2340] block">
                {lang === 'sw' ? 'Njia ya malipo:' : 'Payment method:'}
              </label>

              <div className="flex items-center justify-between text-xs font-semibold text-[#1058A8] py-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 shrink-0 text-[#1058A8]" />
                  <span>{lang === 'sw' ? 'Lipa kwa M-Pesa' : 'Pay with M-Pesa'}</span>
                </div>
                <span className="text-[10px] font-bold bg-[#1058A8]/10 text-[#1058A8] px-2 py-0.5 rounded">
                  Safaricom STK Push
                </span>
              </div>
            </div>

            {/* Normal M-Pesa Phone Input Field (Clean field, NO green panel, empty by default) */}
            <div className="pt-2 border-t border-[#0C2340]/10 space-y-1.5">
              <label className="block text-xs font-semibold text-[#0C2340]">
                {lang === 'sw' ? 'Nambari ya simu ya M-Pesa *' : 'M-Pesa mobile number *'}
              </label>
              <input
                type="tel"
                required
                inputMode="numeric"
                placeholder="07XX XXX XXX"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (phoneError) setPhoneError('');
                }}
                className={`w-full px-3.5 py-2.5 text-sm font-semibold border rounded-[12px] bg-white text-[#0C2340] focus:outline-none ${
                  phoneError ? 'border-[#0C2340]/60 ring-1 ring-[#0C2340]/30' : 'border-[#0C2340]/20 focus:border-[#1058A8]'
                }`}
              />
              {phoneError && (
                <p className="text-[#0C2340] text-xs flex items-center gap-1 font-semibold pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#1058A8]" />
                  <span>{phoneError}</span>
                </p>
              )}
              <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">
                {lang === 'sw'
                  ? 'Utapokea ombi la M-Pesa kwenye simu hii. Weka PIN yako kukamilisha.'
                  : 'You will receive an M-Pesa prompt on this phone. Enter your PIN to complete.'}
              </p>
            </div>

            {/* Treasurer note */}
            <p className="text-[11px] text-slate-500 italic text-center px-2 pt-2 border-t border-[#0C2340]/10">
              {lang === 'sw' 
                ? 'Kila mchango unatusaidia kupata noti na kurekodi Misa ya Jumapili.'
                : 'Every gift helps us buy sheet music and record Sunday Mass.'}
            </p>

            {/* Form Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="w-1/3 py-2.5 px-3 text-xs font-semibold text-[#1058A8] border border-[#1058A8] rounded-[12px] hover:bg-[#1058A8]/5 cursor-pointer text-center transition-colors"
              >
                {lang === 'sw' ? 'Rudi' : 'Back'}
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 px-3 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0E56A6] rounded-[12px] cursor-pointer shadow-xs text-center transition-colors"
              >
                {lang === 'sw' ? 'Lipa kwa M-Pesa' : 'Pay with M-Pesa'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PROCESSING M-PESA STK PUSH */}
        {checkoutStep === 'processing_mpesa' && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 font-source">
            <div className="w-14 h-14 rounded-full border-3 border-[#1058A8] border-t-transparent animate-spin mx-auto" />

            <h4 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Ombi limetumwa kwa M-Pesa' : 'M-Pesa prompt sent'}
            </h4>
            <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
              {lang === 'sw'
                ? `Tafadhali angalia simu yako ${phoneNumber} na uweke PIN yako ya M-Pesa kulipa ${formatPrice(cartTotalKes)} kwa Kwaya ya Mtakatifu Monika.`
                : `Please check your phone ${phoneNumber} and enter your M-Pesa PIN to complete payment of ${formatPrice(cartTotalKes)} to St. Monica Choir.`}
            </p>

            <div className="tabular-nums text-xs font-semibold text-[#1058A8] bg-[#1058A8]/10 px-3 py-1 rounded-full border border-[#1058A8]/20">
              {lang === 'sw' ? `Inathibitishwa na Safaricom... ${mpesaCountdown}s` : `Confirming with Safaricom... ${mpesaCountdown}s`}
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED */}
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
              <p className="text-xs text-slate-500">
                {lang === 'sw' ? 'Kumbukumbu:' : 'Reference:'} <strong className="text-[#0C2340] tabular-nums">{transactionRef}</strong>
              </p>
            </div>

            <div className="w-full bg-[#FCFAF7] p-3.5 rounded-[12px] text-left text-xs space-y-2 border border-[#0C2340]/10">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{lang === 'sw' ? 'Imetumwa kwa:' : 'Sent to:'}</span>
                <strong className="text-[#0C2340]">{customerEmail || 'email@example.com'}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{lang === 'sw' ? 'Kiasi kilicholipwa:' : 'Amount paid:'}</span>
                <strong className="text-[#1058A8] tabular-nums">{formatPrice(cartTotalKes)}</strong>
              </div>
            </div>

            {/* Instant Download Button: Filled Blue Button */}
            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setHasDownloaded(true)}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0E56A6] rounded-[12px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'sw' ? 'Pakua noti sasa (PDF)' : 'Download scores now (PDF)'}</span>
              </button>

              {hasDownloaded && (
                <p className="text-[11px] text-[#1058A8] text-center animate-in fade-in">
                  {lang === 'sw' ? 'Faili ya noti za PDF inapakuliwa kwenye kifaa chako.' : 'Your PDF sheet music file is downloading to your device.'}
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
