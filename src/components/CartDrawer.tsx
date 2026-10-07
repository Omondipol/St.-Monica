import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  Download, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

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
  const [phoneNumber, setPhoneNumber] = useState('0722123456');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'digital' | 'pickup' | 'courier'>('digital');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [mpesaCountdown, setMpesaCountdown] = useState(4);
  const [transactionRef, setTransactionRef] = useState('');

  if (!isCartOpen) return null;

  const handleStartCheckout = () => {
    setCheckoutStep('checkout');
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'mpesa') {
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
    } else {
      setTransactionRef(`CARD-${Math.floor(100000 + Math.random() * 900000)}`);
      setCheckoutStep('confirmed');
    }
  };

  const handleFinishAndReset = () => {
    clearCart();
    setCheckoutStep('cart');
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0C2340]/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 bg-[#EAF4FB] border-b border-[#0C2340]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1058A8]" />
            <h3 className="font-fraunces text-lg font-bold text-[#0C2340]">
              {checkoutStep === 'confirmed' 
                ? (lang === 'sw' ? 'Malipo Yamethibitishwa' : 'Order Confirmed')
                : (lang === 'sw' ? 'Mfuko wa Manunuzi' : 'Your Shopping Cart')}
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-[#0C2340]/60 hover:text-[#0C2340] rounded-lg transition-colors cursor-pointer"
            aria-label="Funga Mfuko"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART REVIEW */}
        {checkoutStep === 'cart' && (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#0C2340]/20" />
                <p className="text-sm font-semibold text-[#0C2340]/80">
                  {lang === 'sw' ? 'Mfuko wako wa manunuzi hauna kitu.' : 'Your cart is currently empty.'}
                </p>
                <p className="text-xs text-[#0C2340]/50 max-w-xs font-source">
                  {lang === 'sw' 
                    ? 'Tazama albamu, noti za nyimbo na fulana rasmi za kwaya katika duka letu.'
                    : 'Explore our latest albums, SATB sheet music, and merchandise in the store.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-3 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-xl flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#EAF4FB] border border-[#7EC8F0]/30 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5 text-[#1058A8]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-fraunces text-sm font-bold text-[#0C2340] leading-snug truncate">
                        {lang === 'sw' ? item.product.nameSw : item.product.name}
                      </h4>
                      <span className="tabular-numbers text-xs font-semibold text-[#1058A8] block mt-0.5">
                        {formatPrice(item.product.priceKes)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded border border-[#0C2340]/20 text-xs font-bold hover:bg-slate-200 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="tabular-numbers text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded border border-[#0C2340]/20 text-xs font-bold hover:bg-slate-200 flex items-center justify-center"
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-auto text-xs text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                          aria-label="Ondoa bidhaa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom summary and start checkout */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#0C2340]/10 mt-auto space-y-3">
                <div className="flex items-center justify-between text-xs text-[#0C2340]/70">
                  <span>{lang === 'sw' ? 'Jumla Ndogo (Subtotal)' : 'Subtotal'}:</span>
                  <span className="tabular-numbers font-bold text-[#0C2340] text-base">
                    {formatPrice(cartTotalKes)}
                  </span>
                </div>
                
                <p className="text-[11px] text-[#0C2340]/50 italic">
                  {lang === 'sw' 
                    ? 'Mapato yote ya mauzo ya nyimbo yanasaidia maendeleo ya kwaya na ala za muziki za parokia.'
                    : '100% of proceeds support choir ministry, parish music instruments, and vocal training.'}
                </p>

                <button
                  onClick={handleStartCheckout}
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{lang === 'sw' ? 'Endelea na Malipo (M-Pesa)' : 'Proceed to Checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CHECKOUT FORM WITH M-PESA */}
        {checkoutStep === 'checkout' && (
          <form onSubmit={handleExecutePayment} className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#0C2340]/10">
              <span className="text-[#0C2340]/60">{lang === 'sw' ? 'Kiasi cha Kulipwa:' : 'Total Amount:'}</span>
              <span className="tabular-numbers font-bold text-base text-[#1058A8]">
                {formatPrice(cartTotalKes)}
              </span>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Jina Kamili:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Wanjiru"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Barua Pepe (Kwa ajili ya Noti/Nyimbo):' : 'Email Address (for download links):'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="wanjiru@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold text-[#0C2340] block">
                {lang === 'sw' ? 'Chagua Njia ya Malipo:' : 'Payment Method:'}
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    paymentMethod === 'mpesa'
                      ? 'bg-[#EAF4FB] border-[#1058A8] text-[#1058A8]'
                      : 'border-[#0C2340]/15 hover:bg-slate-50 text-[#0C2340]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>M-Pesa</span>
                  </div>
                  <span className="text-[10px] text-[#0C2340]/60 block mt-0.5">Safaricom STK Push</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#EAF4FB] border-[#1058A8] text-[#1058A8]'
                      : 'border-[#0C2340]/15 hover:bg-slate-50 text-[#0C2340]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <CreditCard className="w-4 h-4 text-[#1058A8]" />
                    <span>Cards (Visa/MC)</span>
                  </div>
                  <span className="text-[10px] text-[#0C2340]/60 block mt-0.5">Diaspora & Int'l</span>
                </button>
              </div>
            </div>

            {/* M-Pesa Phone Input */}
            {paymentMethod === 'mpesa' && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Nambari ya Simu ya Safaricom (M-Pesa)</span>
                </div>
                <input
                  type="tel"
                  required
                  placeholder="07XX XXX XXX au 2547..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold font-mono border border-emerald-400 rounded-lg bg-white focus:outline-none focus:border-emerald-600"
                />
                <p className="text-[10px] text-emerald-800 leading-tight">
                  Utapokea ujumbe kwenye simu yako ukikuomba uweke PIN yako ya M-Pesa kukamilisha ununuzi.
                </p>
              </div>
            )}

            {/* Security Notice */}
            <div className="flex items-start gap-2 p-3 bg-[#F8FAFC] border border-[#0C2340]/10 rounded-lg text-[11px] text-[#0C2340]/70 font-source">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {lang === 'sw' 
                  ? 'Malipo ni salama 100%. Hakuna nambari ya kadi inayohifadhiwa kwenye seva zetu.'
                  : 'Encrypted server-to-server webhook verification. Compliant with KDPA 2019.'}
              </span>
            </div>

            {/* Form Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="w-1/3 py-2.5 px-3 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Rudi
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 px-3 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs"
              >
                {paymentMethod === 'mpesa' ? 'Lipa kwa M-Pesa STK' : 'Lipa kwa Kadi'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PROCESSING M-PESA STK PUSH */}
        {checkoutStep === 'processing_mpesa' && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
              <Smartphone className="w-8 h-8 text-emerald-600" />
            </div>

            <h4 className="font-fraunces text-xl font-bold text-[#0C2340]">
              Ombi Limetumwa kwa M-Pesa!
            </h4>
            <p className="text-xs text-[#0C2340]/80 max-w-xs font-source">
              Tafadhali angalia simu yako <strong>{phoneNumber}</strong> na uweke PIN yako ya M-Pesa kulipa <strong>{formatPrice(cartTotalKes)}</strong> kwa <strong>Kwaya ya Mtakatifu Monica</strong>.
            </p>

            <div className="tabular-numbers text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Inathibitishwa na Safaricom... {mpesaCountdown}s
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED */}
        {checkoutStep === 'confirmed' && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Asante Sana! (Mungu Akubariki)
              </span>
              <h4 className="font-fraunces text-2xl font-bold text-[#0C2340]">
                Malipo Yamekamilika!
              </h4>
              <p className="text-xs font-mono text-[#0C2340]/60">
                Kumbukumbu: <strong>{transactionRef}</strong>
              </p>
            </div>

            <div className="w-full bg-[#EAF4FB] p-4 rounded-xl text-left text-xs font-source space-y-2 border border-[#7EC8F0]/30">
              <div className="flex items-center justify-between">
                <span className="text-[#0C2340]/70">Imetumwa kwa:</span>
                <strong className="text-[#0C2340]">{customerEmail || 'wanjiru@example.com'}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#0C2340]/70">Kiasi Kilicholipwa:</span>
                <strong className="text-[#1058A8]">{formatPrice(cartTotalKes)}</strong>
              </div>
            </div>

            {/* Instant Download Button */}
            <div className="w-full space-y-2 pt-2">
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Kiungo cha kupakua nyimbo na noti (PDF/MP3) chenye tokeni ya usalama kimefunguliwa!");
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Pakua Mara Moja (Instant Download)</span>
              </a>

              <button
                onClick={handleFinishAndReset}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#0C2340] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Kamilisha na Funga
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
