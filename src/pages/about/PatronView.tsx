import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import hymnalImg from '../../assets/images/sheet_music_hymnal_1791356751097.jpg';
import { ChoirLogo } from '../../components/ChoirLogo';

export const PatronView: React.FC = () => {
  const { lang } = useChoir();

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <section className="bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] p-6 sm:p-8 space-y-4">
        <span className="text-[14px] font-semibold text-[#1058A8] font-source block">
          {lang === 'sw' ? 'Somo wetu wa kiroho · Mtakatifu Monika' : 'Our spiritual patroness · Saint Monica'}
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-fraunces text-[28px] sm:text-[40px] font-bold text-[#0C2340] leading-tight">
            {lang === 'sw' 
              ? 'Mtakatifu Monika: Kielelezo cha Sala Isiyokoma' 
              : 'Saint Monica: Exemplar of Unceasing Prayer'}
          </h1>
          <ChoirLogo size={64} className="ring-2 ring-[#7EC8F0] shrink-0 self-start sm:self-center" interactive={true} />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[14px] font-semibold text-[#1058A8] font-source">
          <span>{lang === 'sw' ? 'Sikukuu ya Somo: Tarehe 27 Agosti' : 'Feast Day: August 27'}</span>
          <span aria-hidden="true">·</span>
          <span>{lang === 'sw' ? 'Mama wa Mtakatifu Augustino' : 'Mother of St. Augustine of Hippo'}</span>
        </div>

        {/* 5-line music-stave divider */}
        <div className="stave-divider my-4 max-w-md">
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
          <div className="stave-line" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FCFAF7] border border-[#0C2340]/10 rounded-[12px] p-6 sm:p-8">
        <div className="lg:col-span-5 aspect-4/3 rounded-[12px] overflow-hidden border border-[#0C2340]/10">
          <img
            src={hymnalImg}
            alt="Saint Monica Choral Song Scores"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="lg:col-span-7 space-y-4 text-[17px] text-[#0C2340]/85 font-source leading-relaxed">
          <h2 className="font-fraunces text-[28px] font-bold text-[#0C2340]">
            {lang === 'sw' 
              ? 'Kwanini Mtakatifu Monika ni Somo Wetu?' 
              : 'Why St. Monica is Our Heavenly Patroness'}
          </h2>

          {lang === 'sw' ? (
            <>
              <p>
                Mtakatifu Monika alizaliwa Tagaste (Algeria ya leo) mnamo mwaka 332 BK. Alikuwa mwanamke Mkristo mwenye uvumilivu wa kipekee, aliyevumilia tabia ngumu za mumewe Patricius na upotovu wa mwanawe wa kwanza, Augustino.
              </p>
              <p>
                Kwa zaidi ya miaka kumi na saba, Monica alimwaga machozi mbele ya Altare akisali bila kukoma kwa ajili ya wokovu wa mwanawe. Askofu Mtakatifu Ambrosi wa Milano alimwambia maneno yasiyosahaulika: <em>"Haiwezekani mwana wa machozi mengi namna hii apotee."</em> Hatimaye Augustino alibatizwa na kuwa mwalimu mkuu wa Kanisa.
              </p>
              <p>
                Kwa kwaya yetu, Mtakatifu Monika anatufundisha kwamba <strong>uimbaji ni sala ya machozi, imani, na matumaini</strong>. Tunapopanda madhabahuni kuimba, tunaleta maombi ya familia zetu, wagonjwa, na waamini wote mbele ya Mungu.
              </p>
              <div className="p-4 bg-[#FAF8F5] rounded-[12px] border border-[#0C2340]/10 font-fraunces text-[15px] italic text-[#1058A8]">
                "Ee Mtakatifu Monika, mama mwenye huruma na maombezi yasiyoshindwa, utuombee waimbaji wako wa SEC 58 ili kila wimbo tunaouimba uwe njia ya kuokoa roho na kuleta amani mioyoni mwa watu."
              </div>
            </>
          ) : (
            <>
              <p>
                Saint Monica was born in Tagaste (modern-day Algeria) in 332 AD. An extraordinary Catholic matriarch of enduring patience, she weathered difficult trials in her household and unceasingly prayed for the conversion of her brilliant son, Augustine.
              </p>
              <p>
                For over seventeen years, Monica wept before the Holy Altars, interceding without tiring for her family. Bishop Saint Ambrose of Milan comforted her with the immortal words: <em>"It is impossible that the son of so many tears should perish."</em> Augustine was ultimately baptized, becoming one of the greatest Doctors of the Universal Church.
              </p>
              <p>
                For our choir, Saint Monica embodies our foundational belief that <strong>sacred singing is prayer transmuted into sound</strong>. As Saint Augustine famously wrote, <em>"Qui cantat, bis orat"</em> (He who sings, prays twice). Whenever we minister before the altar, we carry the petitions of our parish and diocese.
              </p>
              <div className="p-4 bg-[#FAF8F5] rounded-[12px] border border-[#0C2340]/10 font-fraunces text-[15px] italic text-[#1058A8]">
                "O Saint Monica, merciful mother of steadfast intercession, pray for your choristers at St. Monica Parish, that every chord and cadence we offer may draw souls closer to Christ."
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
