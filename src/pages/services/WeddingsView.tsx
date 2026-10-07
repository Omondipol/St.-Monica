import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import { Heart, CheckCircle2, Calendar, Phone, ArrowRight } from 'lucide-react';
import choirHeroImg from '../../assets/images/choir_singing_moment_1791356740170.jpg';
import { ChoirLogo } from '../../components/ChoirLogo';

export const WeddingsView: React.FC = () => {
  const { lang, formatPrice, setIsBookingOpen } = useChoir();

  const weddingSteps = [
    {
      title: lang === 'sw' ? "1. Mashauriano ya Awali ya Nyimbo" : "1. Initial Liturgical Repertoire Consultation",
      desc: lang === 'sw'
        ? "Kukutana na Mkurugenzi wa Muziki kupanga nyimbo za kuingia, katikati, sadaka, kufunga ndoa, na kutoka."
        : "Meeting with the Choirmaster to select entrance, responsorial psalm, offertory, nuptial vows, and recessional hymns."
    },
    {
      title: lang === 'sw' ? "2. Waimbaji Kamili wa SATB Siku ya Harusi" : "2. Full SATB Choir on Wedding Day",
      desc: lang === 'sw'
        ? "Waimbaji 30 hadi 40 waliovalia mavazi rasmi ya kwaya, wakiambatana na kinanda na ala za asili."
        : "30 to 40 choristers in official St. Monica royal blue robes, accompanied by electric piano and traditional percussion."
    },
    {
      title: lang === 'sw' ? "3. Wimbo Maalum wa Maharusi" : "3. Signature Nuptial Anthem",
      desc: lang === 'sw'
        ? "Uimbaji wa wimbo wa kipekee unaopendwa na bibi na bwana harusi wakati wa kutia saini cheti cha ndoa."
        : "Dedicated choral performance of the couple's requested sacred song during the signing of the marriage register."
    }
  ];

  return (
    <div className="space-y-12">
      <section className="bg-white border border-[#0C2340]/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider font-mono">
          <Heart className="w-4 h-4" />
          <span>{lang === 'sw' ? 'SAKRAMENTI YA NDOA TAKATIFU · WEDDINGS' : 'SACRAMENT OF HOLY MATRIMONY · WEDDINGS'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-[#0C2340] leading-tight">
            {lang === 'sw' ? 'Misa za Harusi na Ndoa Takatifu' : 'Catholic Wedding & Nuptial Masses'}
          </h1>
          <ChoirLogo size={60} interactive={true} className="shrink-0 self-start sm:self-center" />
        </div>

        <p className="text-base sm:text-lg text-[#0C2340]/80 font-source leading-relaxed max-w-3xl">
          {lang === 'sw'
            ? 'Fanya siku yako ya harusi kuwa na kumbukumbu isiyosahaulika ya kiroho kupitia uimbaji wa sauti nne (SATB) wenye uchaji, heshima na furaha ya Kikristo.'
            : 'Make your wedding day an unforgettable sacred memory with reverent four-part SATB choral singing, joyful Catholic polyphony, and dignified ceremonial beauty.'}
        </p>

        {/* 5-line music-stave divider */}
        <div className="stave-divider my-4 max-w-md">
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#EAF4FB]/60 border border-[#7EC8F0]/30 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="lg:col-span-5 aspect-4/3 rounded-xl overflow-hidden border border-[#0C2340]/10">
          <img
            src={choirHeroImg}
            alt="Catholic Wedding Mass Choral Performance"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-fraunces text-2xl font-bold text-[#0C2340]">
            {lang === 'sw' ? 'Utaratibu wa Huduma ya Harusi' : 'Our Wedding Ministry Process'}
          </h2>
          <p className="text-xs sm:text-sm text-[#0C2340]/80 font-source leading-relaxed">
            {lang === 'sw'
              ? 'Kwaya ya Mtakatifu Monica ina uzoefu wa zaidi ya harusi mia moja za kikatoliki kote Kenya. Tunahakikisha kila sehemu ya liturujia ya arusi inafuata mafundisho ya Kanisa Katoliki huku ikileta hisia za juu za upendo na furaha.'
              : 'St. Monica Catholic Choir brings experience from over one hundred Catholic weddings across Kenya. We ensure every moment of the wedding liturgy strictly honors Catholic doctrine while creating an atmosphere of celestial joy and celebration.'}
          </p>

          <div className="space-y-2 pt-1">
            {weddingSteps.map((step, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-[#0C2340]/10 text-xs font-source">
                <strong className="text-[#1058A8] block font-bold">{step.title}</strong>
                <span className="text-[#0C2340]/75">{step.desc}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-[#0C2340]/70">
              {lang === 'sw' ? 'Kadirio la Mchango wa Kwaya: ' : 'Suggested Choir Honorarium: '}
              <strong className="text-[#1058A8] text-base">{formatPrice(25000)}</strong>
            </span>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs transition-colors"
            >
              {lang === 'sw' ? 'Weka Nafasi ya Tarehe' : 'Book Wedding Date'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
