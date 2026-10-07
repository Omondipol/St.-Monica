import React, { useState } from 'react';
import { useChoir } from '../context/ChoirContext';
import { SERVICES_CATALOG } from '../data/choirContent';
import { X, Calendar, CheckCircle2, Music, Phone, Mail, MapPin } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { isBookingOpen, setIsBookingOpen, formatPrice, lang } = useChoir();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES_CATALOG[1].id); // default weddings
  const [eventDate, setEventDate] = useState('2026-11-14');
  const [eventVenue, setEventVenue] = useState('St. Monica Church, SEC 58 Nakuru');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isBookingOpen) return null;

  const selectedService = SERVICES_CATALOG.find(s => s.id === selectedServiceId) || SERVICES_CATALOG[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setIsBookingOpen(false);
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0C2340]/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl border border-[#0C2340]/10 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#EAF4FB] border-b border-[#0C2340]/10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1058A8] uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>{lang === 'sw' ? 'Ombi Rasmi la Kuagiza Kwaya' : 'Choir Booking & Quotation Request'}</span>
            </div>
            <h3 className="font-fraunces text-2xl font-bold text-[#0C2340]">
              {lang === 'sw' ? 'Agiza Kwaya ya Mtakatifu Monica' : 'Book St. Monica Choir Nakuru'}
            </h3>
            <p className="text-xs text-[#0C2340]/70 font-source mt-1">
              {lang === 'sw'
                ? 'Misa za harusi, mazishi, sikukuu za kiliturujia na matamasha ya kijimbo.'
                : 'Sacred choral accompaniment for Catholic weddings, requiem Masses, and concerts.'}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-[#0C2340]/60 hover:text-[#0C2340] hover:bg-white rounded-lg transition-colors cursor-pointer"
            aria-label="Funga"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="font-fraunces text-2xl font-bold text-[#0C2340]">
                {lang === 'sw' ? 'Ombi Lako Limepokelewa!' : 'Booking Request Received!'}
              </h4>
              <p className="text-xs text-[#0C2340]/80 font-source max-w-sm mx-auto">
                {lang === 'sw'
                  ? `Mwalimu Polycarp Ochieng na Afisa wa Maandalizi watawasiliana nawe kupitia simu yako (${contactPhone || '07XX'}) ndani ya saa 24 kuthibitisha tarehe ya ${eventDate}.`
                  : `Music Director Polycarp Ochieng and our Booking Officer will review the choir schedule and contact you at ${contactPhone || 'your phone'} within 24 hours.`}
              </p>
            </div>

            <div className="p-4 bg-[#EAF4FB] rounded-xl text-left text-xs font-source space-y-1.5 border border-[#7EC8F0]/30 max-w-sm mx-auto">
              <div><strong>Huduma:</strong> {lang === 'sw' ? selectedService.titleSw : selectedService.title}</div>
              <div><strong>Tarehe:</strong> {eventDate}</div>
              <div><strong>Mahali:</strong> {eventVenue}</div>
              <div><strong>Kadirio la Mchango:</strong> <span className="text-[#1058A8] font-bold">{formatPrice(selectedService.startingPriceKes)}</span></div>
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl transition-colors cursor-pointer"
            >
              Sawa, Asante
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Service Select */}
            <div>
              <label className="text-xs font-bold text-[#0C2340] block mb-1">
                {lang === 'sw' ? 'Chagua Huduma Inayohitajika:' : 'Select Service Required:'}
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8] bg-[#F8FAFC]"
              >
                {SERVICES_CATALOG.map((serv) => (
                  <option key={serv.id} value={serv.id}>
                    {lang === 'sw' ? serv.titleSw : serv.title} — (Kuanzia {formatPrice(serv.startingPriceKes)})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Tarehe ya Tukio:' : 'Date of Event:'}
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Kanisa / Mahali (Venue):' : 'Venue / Church Parish:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Monica SEC 58"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
                />
              </div>
            </div>

            {/* Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Jina Lako:' : 'Your Name / Contact Person:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John & Grace"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0C2340] block mb-1">
                  {lang === 'sw' ? 'Nambari ya Simu (WhatsApp):' : 'Phone / WhatsApp Number:'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="07XX XXX XXX"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
                />
              </div>
            </div>

            {/* Additional notes */}
            <div>
              <label className="text-[11px] font-bold text-[#0C2340] block mb-1">
                {lang === 'sw' ? 'Maelezo ya Ziada (Nyimbo unazopendelea, saa za misa n.k):' : 'Special Notes or Preferred Hymns:'}
              </label>
              <textarea
                rows={2}
                placeholder="Tungependa nyimbo za kwaya na wimbo maalum wa Ave Maria..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#0C2340]/20 rounded-lg focus:outline-none focus:border-[#1058A8]"
              />
            </div>

            {/* Estimated Quote Card */}
            <div className="p-3 bg-[#EAF4FB] border border-[#7EC8F0]/30 rounded-xl flex items-center justify-between text-xs">
              <span className="text-[#0C2340]/80">
                {lang === 'sw' ? 'Mchango wa Awali Unaokadiriwa:' : 'Estimated Base Honorarium:'}
              </span>
              <span className="font-bold font-mono text-sm text-[#1058A8]">
                {formatPrice(selectedService.startingPriceKes)}
              </span>
            </div>

            {/* Submit buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 text-xs font-semibold text-[#0C2340] bg-[#EAF4FB] rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Ghairi
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl transition-all shadow-xs cursor-pointer"
              >
                {lang === 'sw' ? 'Tuma Ombi la Kuagiza' : 'Submit Booking Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
