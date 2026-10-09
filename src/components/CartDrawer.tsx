import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { ProductItem } from '../data/choirContent';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Smartphone, 
  CheckCircle2, 
  Download, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

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
    if (!phoneNumber.trim()) {
      setPhoneError(lang === 'sw' ? 'Tafadhali weka nambari ya simu ya M-Pesa' : 'Please enter your M-Pesa phone number');
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0C2340]/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header: "Your Order" during checkout */}
        <div className="p-4 sm:p-5 bg-[#EAF4FB] border-b border-[#0C2340]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1058A8]" />
            <h3 className="font-fraunces text-lg font-bold text-[#0C2340]">
              {checkoutStep === 'confirmed' 
                ? (lang === 'sw' ? 'Agizo Limethibitishwa' : 'Order Confirmed')
                : (checkoutStep === 'checkout' || checkoutStep === 'processing_mpesa')
                  ? (lang === 'sw' ? 'Agizo Lako' : 'Your Order')
                  : (lang === 'sw' ? 'Mfuko wa Manunuzi' : 'Your Shopping Cart')}
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-[#0C2340]/60 hover:text-[#0C2340] rounded-lg transition-colors cursor-pointer"
            aria-label={lang === 'sw' ? 'Funga Mfuko' : 'Close Cart'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART REVIEW */}
        {checkoutStep === 'cart' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#0C2340]/20" />
                <p className="text-sm font-semibold text-[#0C2340]/80 font-source">
                  {lang === 'sw' ? 'Mfuko wako wa manunuzi hauna kitu.' : 'Your cart is currently empty.'}
                </p>
                <p className="text-xs text-[#0C2340]/50 max-w-xs font-source">
                  {lang === 'sw' 
                    ? 'Tazama noti za nyimbo zetu katika duka ili kuongeza kwenye agizo lako.'
                    : 'Explore our sheet music scores in the store to add to your order.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 flex-1">
                {cart.map((item) => {
                  const isDigital = item.product.downloadable || item.product.type === 'sheet_music' || item.product.type === 'digital_album';
                  const itemImg = getItemImage(item.product.id, item.product.image);

                  return (
                    <div key={item.product.id} className="p-3 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-xl flex items-start gap-3">
                      {/* Score Preview Image instead of generic bag icon */}
                      <div className="w-14 h-14 rounded-lg bg-slate-100 border border-[#0C2340]/15 overflow-hidden shrink-0 shadow-2xs">
                        <img 
                          src={itemImg} 
                          alt={lang === 'sw' ? item.product.nameSw : item.product.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-fraunces text-sm font-bold text-[#0C2340] leading-snug truncate">
                          {lang === 'sw' ? item.product.nameSw : item.product.name}
                        </h4>
                        
                        <span className="tabular-numbers text-xs font-semibold text-[#1058A8] block mt-0.5 font-source">
                          {formatPrice(item.product.priceKes)}
                        </span>

                        {/* Digital items: Remove quantity buttons, show PDF, instant download */}
                        {isDigital ? (
                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#0C2340]/5">
                            <span className="text-[11px] text-slate-500 font-source">
                              {lang === 'sw' ? 'PDF, pakua papo hapo' : 'PDF, instant download'}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-xs text-rose-600 hover:text-rose-800 p-1 cursor-pointer flex items-center gap-1"
                              aria-label={lang === 'sw' ? 'Ondoa' : 'Remove'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-[11px] font-source">{lang === 'sw' ? 'Ondoa' : 'Remove'}</span>
                            </button>
                          </div>
                        ) : (
                          /* Non-digital items: quantity controls */
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 rounded border border-[#0C2340]/20 text-xs font-bold hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                            >
                              -
                            </button>
                            <span className="tabular-numbers text-xs font-bold px-1.5 font-source">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 rounded border border-[#0C2340]/20 text-xs font-bold hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="ml-auto text-xs text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
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
                <div className="flex items-center justify-between text-xs text-[#0C2340]/70 font-source">
                  <span>{lang === 'sw' ? 'Jumla Ndogo (Subtotal):' : 'Subtotal:'}</span>
                  <span className="tabular-numbers font-bold text-[#0C2340] text-base font-fraunces">
                    {formatPrice(cartTotalKes)}
                  </span>
                </div>
                
                {/* One unified sentence from treasurer */}
                <p className="text-[11px] text-[#0C2340]/70 italic font-source">
                  {lang === 'sw' 
                    ? 'Kila mchango unatusaidia kupata noti na kurekodi Misa ya Jumapili.'
                    : 'Every gift helps us buy sheet music and record Sunday Mass.'}
                </p>

                <button
                  onClick={handleStartCheckout}
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 font-source"
                >
                  <span>{lang === 'sw' ? 'Endelea na Agizo' : 'Proceed to Checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CHECKOUT FORM WITH M-PESA */}
        {checkoutStep === 'checkout' && (
          <form onSubmit={handleExecutePayment} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#0C2340]/10 font-source">
              <span className="text-[#0C2340]/70">{lang === 'sw' ? 'Jumla ya Agizo:' : 'Order Total:'}</span>
              <span className="tabular-numbers font-bold text-base text-[#1058A8] font-fraunces">
                {formatPrice(cartTotalKes)}
              </span>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 font-source">
              <div>
                <label className="text-[11px] font-bold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Jina Kamili:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'sw' ? 'mfano: Maria Wanjiru' : 'e.g. Mary Wanjiru'}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8] bg-white text-[#0C2340]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Barua Pepe (kwa ajili ya kiungo cha noti):' : 'Email Address (for download links):'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8] bg-white text-[#0C2340]"
                />
              </div>
            </div>

            {/* Payment Method: Pay with M-Pesa is the only method until card payments are connected */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-[#0C2340] block font-source">
                {lang === 'sw' ? 'Njia ya Malipo:' : 'Payment Method:'}
              </label>

              <div className="p-3 bg-[#EAF4FB] border border-[#1058A8] rounded-xl flex items-center justify-between text-xs font-bold text-[#1058A8] font-source">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{lang === 'sw' ? 'Lipa kwa M-Pesa' : 'Pay with M-Pesa'}</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Safaricom STK Push
                </span>
              </div>
            </div>

            {/* M-Pesa Phone Input: empty by default with 07XX XXX XXX placeholder */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-2 font-source">
              <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'sw' ? 'Nambari ya Simu ya M-Pesa *' : 'M-Pesa Mobile Number *'}</span>
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
                className="w-full px-3 py-2 text-sm font-bold font-source border border-emerald-400 rounded-lg bg-white text-[#0C2340] focus:outline-none focus:border-emerald-600"
              />
              {phoneError && (
                <p className="text-[#0C2340] text-xs flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#1058A8]" />
                  <span>{phoneError}</span>
                </p>
              )}
              <p className="text-[11px] text-emerald-800 leading-tight">
                {lang === 'sw'
                  ? 'Utapokea ombi la M-Pesa kwenye simu hii. Weka PIN yako kukamilisha.'
                  : 'You will receive an M-Pesa prompt on this phone. Enter your PIN to complete.'}
              </p>
            </div>

            {/* One unified sentence from treasurer */}
            <p className="text-[11px] text-[#0C2340]/70 italic text-center font-source px-2">
              {lang === 'sw' 
                ? 'Kila mchango unatusaidia kupata noti na kurekodi Misa ya Jumapili.'
                : 'Every gift helps us buy sheet music and record Sunday Mass.'}
            </p>

            {/* Form Actions: English and Swahili buttons matching toggle */}
            <div className="pt-2 flex items-center gap-2 font-source">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="w-1/3 py-2.5 px-3 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] rounded-xl hover:bg-slate-200 cursor-pointer text-center"
              >
                {lang === 'sw' ? 'Rudi' : 'Back'}
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 px-3 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs text-center"
              >
                {lang === 'sw' ? 'Lipa kwa M-Pesa' : 'Pay with M-Pesa'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PROCESSING M-PESA STK PUSH */}
        {checkoutStep === 'processing_mpesa' && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 font-source">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
              <Smartphone className="w-8 h-8 text-emerald-600" />
            </div>

            <h4 className="font-fraunces text-xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Ombi Limetumwa kwa M-Pesa!' : 'M-Pesa Prompt Sent!'}
            </h4>
            <p className="text-xs text-[#0C2340]/80 max-w-xs leading-relaxed">
              {lang === 'sw'
                ? `Tafadhali angalia simu yako ${phoneNumber} na uweke PIN yako ya M-Pesa kulipa ${formatPrice(cartTotalKes)} kwa Kwaya ya Mtakatifu Monika.`
                : `Please check your phone ${phoneNumber} and enter your M-Pesa PIN to complete payment of ${formatPrice(cartTotalKes)} to St. Monica Choir.`}
            </p>

            <div className="tabular-numbers text-xs font-source text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {lang === 'sw' ? `Inathibitishwa na Safaricom... ${mpesaCountdown}s` : `Confirming with Safaricom... ${mpesaCountdown}s`}
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED */}
        {checkoutStep === 'confirmed' && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 font-source">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block font-source">
                {lang === 'sw' ? 'Asante Sana! (Mungu Akubariki)' : 'Thank You! (God Bless You)'}
              </span>
              <h4 className="font-fraunces text-2xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Malipo Yamekamilika!' : 'Order Complete!'}
              </h4>
              <p className="text-xs text-[#0C2340]/60 font-source">
                {lang === 'sw' ? 'Kumbukumbu:' : 'Reference:'} <strong className="text-[#0C2340]">{transactionRef}</strong>
              </p>
            </div>

            <div className="w-full bg-[#EAF4FB] p-4 rounded-xl text-left text-xs font-source space-y-2 border border-[#7EC8F0]/30">
              <div className="flex items-center justify-between">
                <span className="text-[#0C2340]/70">{lang === 'sw' ? 'Imetumwa kwa:' : 'Sent to:'}</span>
                <strong className="text-[#0C2340]">{customerEmail || 'email@example.com'}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#0C2340]/70">{lang === 'sw' ? 'Kiasi Kilicholipwa:' : 'Amount Paid:'}</span>
                <strong className="text-[#1058A8]">{formatPrice(cartTotalKes)}</strong>
              </div>
            </div>

            {/* Instant Download Button */}
            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setHasDownloaded(true)}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs font-source"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'sw' ? 'Pakua Noti Sasa (PDF)' : 'Download Scores Now (PDF)'}</span>
              </button>

              {hasDownloaded && (
                <p className="text-[11px] text-emerald-700 text-center font-source animate-in fade-in">
                  {lang === 'sw' ? 'Faili ya noti za PDF inapakuliwa kwenye kifaa chako.' : 'Your PDF sheet music file is downloading to your device.'}
                </p>
              )}

              <button
                type="button"
                onClick={handleFinishAndReset}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#0C2340] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer font-source"
              >
                {lang === 'sw' ? 'Kamilisha na Funga' : 'Finish and Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
