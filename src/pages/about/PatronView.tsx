import React from 'react';
import { useChoir } from '../../context/ChoirContext';
import hymnalImg from '../../assets/images/sheet_music_hymnal_1791356751097.jpg';
import { ChoirLogo } from '../../components/ChoirLogo';
import { AboutNavTabs } from '../../components/AboutNavTabs';
import { AfricanGeometricBorder } from '../../components/AfricanGeometricBorder';
import { getAssetUrl } from '../../utils/assetHelper';

interface PatronViewProps {
  onNavigate?: (route: string) => void;
}

export const PatronView: React.FC<PatronViewProps> = ({ onNavigate = () => {} }) => {
  const { lang, aboutPageConfig } = useChoir();

  const bannerImgSrc = getAssetUrl(aboutPageConfig?.patronBannerImg || '/assets/choir/choir_06.jpg');
  const portraitImgSrc = getAssetUrl(aboutPageConfig?.patronPortraitImg || '/assets/choir/choir_leader_01.jpg');

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title Banner (Matching Music Section Slim Banner) */}
      <section className="relative h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-[#0C2340]/15 shadow-md shadow-slate-900/5 select-none flex flex-col justify-between">
        <img 
          src={bannerImgSrc} 
          alt="Saint Monica Choral Hymnal" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/95 via-[#0C2340]/80 to-[#0C2340]/25" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white space-y-1 sm:space-y-1.5">
          <span className="text-[12px] sm:text-[13px] font-semibold text-[#7EC8F0] font-source block uppercase tracking-wider">
            {lang === 'sw' ? 'Msimamizi wa Kiroho' : 'Patron Saint'}
          </span>
          <h1 className="font-eb-garamond text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
            {lang === 'sw' 
              ? (aboutPageConfig?.patronTitleSw || 'Mtakatifu Monika') 
              : (aboutPageConfig?.patronTitleEn || 'Saint Monica')}
          </h1>
          <p className="font-source text-xs sm:text-sm text-slate-200 max-w-xl leading-snug">
            {lang === 'sw'
              ? (aboutPageConfig?.patronSubtitleSw || 'Mama wa machozi na sala isiyokoma · Sikukuu: 27 Agosti.')
              : (aboutPageConfig?.patronSubtitleEn || 'Mother of tears & unceasing prayer · Feast Day: August 27.')}
          </p>
        </div>
        <AfricanGeometricBorder className="relative z-10" />
      </section>

      {/* Unified Section Navigation Tabs */}
      <AboutNavTabs currentTab="about-patron" onNavigate={onNavigate} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/90 border border-[#0C2340]/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(12,35,64,0.08)]">
        <div className="lg:col-span-5 aspect-4/3 rounded-2xl overflow-hidden border border-[#0C2340]/10 shadow-sm bg-slate-900">
          <img
            src={portraitImgSrc}
            alt="Saint Monica"
            className="w-full h-full object-cover object-[center_20%]"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="lg:col-span-7 space-y-4 text-[16px] text-[#0C2340]/85 font-source leading-relaxed">
          <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
            {lang === 'sw' 
              ? (aboutPageConfig?.patronTitleSw || 'Kwanini Mtakatifu Monika ni Somo Wetu?') 
              : (aboutPageConfig?.patronTitleEn || 'Why St. Monica is Our Heavenly Patroness')}
          </h2>

          <p>
            {lang === 'sw'
              ? (aboutPageConfig?.patronBio1Sw || 'Mtakatifu Monika alizaliwa Tagaste (Algeria ya leo) mnamo mwaka 332 BK. Alikuwa mwanamke Mkristo mwenye uvumilivu wa kipekee, aliyevumilia tabia ngumu za mumewe Patricius na upotovu wa mwanawe wa kwanza, Augustino.')
              : (aboutPageConfig?.patronBio1En || 'Saint Monica was born in Tagaste (modern-day Algeria) in 332 AD. An extraordinary Catholic matriarch of enduring patience, she weathered difficult trials in her household and unceasingly prayed for the conversion of her brilliant son, Augustine.')}
          </p>
          <p>
            {lang === 'sw'
              ? (aboutPageConfig?.patronBio2Sw || 'Kwa zaidi ya miaka kumi na saba, Monica alimwaga machozi mbele ya Altare akisali bila kukoma kwa ajili ya wokovu wa mwanawe. Askofu Mtakatifu Ambrosi wa Milano alimwambia maneno yasiyosahaulika: "Haiwezekani mwana wa machozi mengi namna hii apotee." Hatimaye Augustino alibatizwa na kuwa mwalimu mkuu wa Kanisa.')
              : (aboutPageConfig?.patronBio2En || 'For over seventeen years, Monica wept before the Holy Altars, interceding without tiring for her family. Bishop Saint Ambrose of Milan comforted her with the immortal words: "It is impossible that the son of so many tears should perish." Augustine was ultimately baptized, becoming one of the greatest Doctors of the Universal Church.')}
          </p>

          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#0C2340]/10 font-eb-garamond text-[17px] italic text-[#1058A8] leading-relaxed shadow-xs">
            "{lang === 'sw'
              ? (aboutPageConfig?.patronPrayerSw || 'Ee Mtakatifu Monika, mama mwenye huruma na maombezi yasiyoshindwa, utuombee waimbaji wako wa SEC 58 ili kila wimbo tunaouimba uwe njia ya kuokoa roho na kuleta amani mioyoni mwa watu.')
              : (aboutPageConfig?.patronPrayerEn || 'O Saint Monica, merciful mother of steadfast intercession, pray for your choristers at St. Monica Parish, that every chord and cadence we offer may draw souls closer to Christ.')}"
          </div>
        </div>
      </div>
    </div>
  );
};
