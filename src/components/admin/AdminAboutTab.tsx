import React, { useState, useEffect } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { supabase } from '../../lib/supabase';
import { ImageUploadField, PresetImageOption } from '../ImageUploadField';
import { AfricanGeometricBorder } from '../AfricanGeometricBorder';
import { Save, BookOpen, Heart, Image as ImageIcon } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';

interface AdminAboutTabProps {
  onNotify: (msg: string) => void;
}

export const AdminAboutTab: React.FC<AdminAboutTabProps> = ({ onNotify }) => {
  const { lang, aboutPageConfig, updateAboutPageConfig } = useChoir();

  const [subSection, setSubSection] = useState<'story' | 'patron'>('story');

  const photoPresets: PresetImageOption[] = [
    { label: 'Choir in Vestments (Choir 02)', url: '/assets/choir/choir_02.jpg' },
    { label: 'Reverent Prayer Sanctuary (Choir 03)', url: '/assets/choir/choir_03.jpg' },
    { label: 'SATB Polyphony (Choir 04)', url: '/assets/choir/choir_04.jpg' },
    { label: 'Sanctuary Singing Praise (Choir 05)', url: '/assets/choir/choir_05.jpg' },
    { label: 'Grand Choir Assembly (Choir 06)', url: '/assets/choir/choir_06.jpg' },
    { label: 'Saint Monica Icon Portrait', url: '/assets/choir/choir_leader_01.jpg' }
  ];

  const [form, setForm] = useState({
    storyBannerImg: aboutPageConfig?.storyBannerImg || '',
    storyTitleEn: aboutPageConfig?.storyTitleEn || 'Our Roots in St. Monica Parish, Nakuru',
    storyTitleSw: aboutPageConfig?.storyTitleSw || 'Mizizi Yetu Katika Parokia ya Mtakatifu Monika',
    storySubtitleEn: aboutPageConfig?.storySubtitleEn || 'Serving Sunday High Mass at Section 58 with sacred four-part choral liturgy since 2012.',
    storySubtitleSw: aboutPageConfig?.storySubtitleSw || 'Kutoka waimbaji kumi na wanne mwaka 2012 hadi jumuiya inayotumikia altare ya Mungu kila juma.',
    storyParagraph1En: aboutPageConfig?.storyParagraph1En || 'St. Monica Third Mass Choir was founded out of a shared desire to provide elevated liturgical singing for Sunday Mass (the parish 3rd Mass). Since day one, our ethos has remained steadfast: four-part vocal precision (Soprano, Alto, Tenor, Bass), fraternal unity, and reverent devotion before the altar.',
    storyParagraph1Sw: aboutPageConfig?.storyParagraph1Sw || 'Kwaya ya Misa ya Tatu ya Mtakatifu Monika ilizaliwa kutokana na kiu ya waamini walei kutaka kutoa muziki wa kiwango cha juu wa kiliturujia wakati wa Misa ya Tatu ya Jumapili. Tangu mwanzo, kanuni yetu imekuwa nidhamu ya sauti nne (Soprano, Alto, Tenor, Bass), upendo wa kidugu, na usafi wa kiroho.',
    storyParagraph2En: aboutPageConfig?.storyParagraph2En || 'Under the guidance of our dedicated music directors and the parish pastoral council, our choir has grown into an anchor ensemble across the Catholic Diocese of Nakuru, ministering at priestly ordinations, confirmations, nuptial weddings, and solemn requiem Masses.',
    storyParagraph2Sw: aboutPageConfig?.storyParagraph2Sw || 'Chini ya uongozi thabiti wa walimu wa muziki na kamati ya kwaya, kwaya imekua na kuwa nguzo muhimu katika Jimbo Katoliki la Nakuru, ikihudumu kwenye Misa za upadirisho, vipaimara, harusi takatifu, na mazishi ya kiheshima.',
    storyPhotoImg: aboutPageConfig?.storyPhotoImg || '',

    patronBannerImg: aboutPageConfig?.patronBannerImg || '',
    patronPortraitImg: aboutPageConfig?.patronPortraitImg || '',
    patronTitleEn: aboutPageConfig?.patronTitleEn || 'Why St. Monica is Our Heavenly Patroness',
    patronTitleSw: aboutPageConfig?.patronTitleSw || 'Kwanini Mtakatifu Monika ni Somo Wetu?',
    patronSubtitleEn: aboutPageConfig?.patronSubtitleEn || 'Mother of tears & unceasing prayer · Feast Day: August 27.',
    patronSubtitleSw: aboutPageConfig?.patronSubtitleSw || 'Mama wa machozi na sala isiyokoma · Sikukuu: 27 Agosti.',
    patronBio1En: aboutPageConfig?.patronBio1En || 'Saint Monica (c. 332–387 AD) was born in Tagaste, North Africa (modern-day Algeria). A woman of profound Catholic piety and unmatched perseverance, she is globally celebrated for praying persistently for seventeen years for the conversion of her wayward son, Augustine.',
    patronBio1Sw: aboutPageConfig?.patronBio1Sw || 'Mtakatifu Monika (takriban 332–387 BK) alizaliwa Tagaste, Afrika Kaskazini (nchini Algeria ya sasa). Alikuwa mwanamke wa sala na uvumilivu mkubwa ambaye alimlilia Mungu kwa miaka kumi na saba hadi mwanaye Augustino alipobatizwa na kuwa Askofu na Mwalimu Mkuu wa Kanisa.',
    patronBio2En: aboutPageConfig?.patronBio2En || 'For our choristers at Section 58 in Nakuru, Saint Monica embodies the heart of choir ministry: weeping with those who mourn, rejoicing with those who hope, and never ceasing to lift tears and hymns of faith to God.',
    patronBio2Sw: aboutPageConfig?.patronBio2Sw || 'Kwa waimbaji wetu wa Misa ya Tatu Parokiani Section 58 Nakuru, Mtakatifu Monika ni mfano wa upendo, sala ya machozi isiyokata tamaa na unyenyekevu mkuu mbele ya Altare ya Ekaristi Takatifu.',
    patronFeastDayEn: aboutPageConfig?.patronFeastDayEn || '27th August (Universal Feast Day of Saint Monica)',
    patronFeastDaySw: aboutPageConfig?.patronFeastDaySw || 'Tarehe 27 Agosti (Sikukuu ya Mtakatifu Monika Duniani)',
    patronPrayerEn: aboutPageConfig?.patronPrayerEn || 'Lord, through the persistent prayers and tears of Saint Monica, You led Saint Augustine into the light of the true faith. Through her intercession, give our choir faithful devotion, vocal humility, and grace to draw all souls to Your Altar through sacred song. Amen.',
    patronPrayerSw: aboutPageConfig?.patronPrayerSw || 'Ee Mungu wetu, kupitia sala na machozi ya Mtakatifu Monika, ulimwongoza mwanaye Augustino kwenye ukweli wa Injili. Kupitia maombezi yake, ijalie kwaya yetu neema ya kuimba kwa unyenyekevu na nidhamu ya kicho altaroni ili mioyo ya wengi ivutwe kwako. Amina.'
  });

  useEffect(() => {
    if (aboutPageConfig) {
      setForm({
        storyBannerImg: aboutPageConfig.storyBannerImg || '',
        storyTitleEn: aboutPageConfig.storyTitleEn || 'Our Roots in St. Monica Parish, Nakuru',
        storyTitleSw: aboutPageConfig.storyTitleSw || 'Mizizi Yetu Katika Parokia ya Mtakatifu Monika',
        storySubtitleEn: aboutPageConfig.storySubtitleEn || 'Serving Sunday High Mass at Section 58 with sacred four-part choral liturgy since 2012.',
        storySubtitleSw: aboutPageConfig.storySubtitleSw || 'Kutoka waimbaji kumi na wanne mwaka 2012 hadi jumuiya inayotumikia altare ya Mungu kila juma.',
        storyParagraph1En: aboutPageConfig.storyParagraph1En || 'St. Monica Third Mass Choir was founded out of a shared desire to provide elevated liturgical singing for Sunday Mass (the parish 3rd Mass). Since day one, our ethos has remained steadfast: four-part vocal precision (Soprano, Alto, Tenor, Bass), fraternal unity, and reverent devotion before the altar.',
        storyParagraph1Sw: aboutPageConfig.storyParagraph1Sw || 'Kwaya ya Misa ya Tatu ya Mtakatifu Monika ilizaliwa kutokana na kiu ya waamini walei kutaka kutoa muziki wa kiwango cha juu wa kiliturujia wakati wa Misa ya Tatu ya Jumapili. Tangu mwanzo, kanuni yetu imekuwa nidhamu ya sauti nne (Soprano, Alto, Tenor, Bass), upendo wa kidugu, na usafi wa kiroho.',
        storyParagraph2En: aboutPageConfig.storyParagraph2En || 'Under the guidance of our dedicated music directors and the parish pastoral council, our choir has grown into an anchor ensemble across the Catholic Diocese of Nakuru, ministering at priestly ordinations, confirmations, nuptial weddings, and solemn requiem Masses.',
        storyParagraph2Sw: aboutPageConfig.storyParagraph2Sw || 'Chini ya uongozi thabiti wa walimu wa muziki na kamati ya kwaya, kwaya imekua na kuwa nguzo muhimu katika Jimbo Katoliki la Nakuru, ikihudumu kwenye Misa za upadirisho, vipaimara, harusi takatifu, na mazishi ya kiheshima.',
        storyPhotoImg: aboutPageConfig.storyPhotoImg || '',

        patronBannerImg: aboutPageConfig.patronBannerImg || '',
        patronPortraitImg: aboutPageConfig.patronPortraitImg || '',
        patronTitleEn: aboutPageConfig.patronTitleEn || 'Why St. Monica is Our Heavenly Patroness',
        patronTitleSw: aboutPageConfig.patronTitleSw || 'Kwanini Mtakatifu Monika ni Somo Wetu?',
        patronSubtitleEn: aboutPageConfig.patronSubtitleEn || 'Mother of tears & unceasing prayer · Feast Day: August 27.',
        patronSubtitleSw: aboutPageConfig.patronSubtitleSw || 'Mama wa machozi na sala isiyokoma · Sikukuu: 27 Agosti.',
        patronBio1En: aboutPageConfig.patronBio1En || 'Saint Monica (c. 332–387 AD) was born in Tagaste, North Africa (modern-day Algeria). A woman of profound Catholic piety and unmatched perseverance, she is globally celebrated for praying persistently for seventeen years for the conversion of her wayward son, Augustine.',
        patronBio1Sw: aboutPageConfig.patronBio1Sw || 'Mtakatifu Monika (takriban 332–387 BK) alizaliwa Tagaste, Afrika Kaskazini (nchini Algeria ya sasa). Alikuwa mwanamke wa sala na uvumilivu mkubwa ambaye alimlilia Mungu kwa miaka kumi na saba hadi mwanaye Augustino alipobatizwa na kuwa Askofu na Mwalimu Mkuu wa Kanisa.',
        patronBio2En: aboutPageConfig.patronBio2En || 'For our choristers at Section 58 in Nakuru, Saint Monica embodies the heart of choir ministry: weeping with those who mourn, rejoicing with those who hope, and never ceasing to lift tears and hymns of faith to God.',
        patronBio2Sw: aboutPageConfig.patronBio2Sw || 'Kwa waimbaji wetu wa Misa ya Tatu Parokiani Section 58 Nakuru, Mtakatifu Monika ni mfano wa upendo, sala ya machozi isiyokata tamaa na unyenyekevu mkuu mbele ya Altare ya Ekaristi Takatifu.',
        patronFeastDayEn: aboutPageConfig.patronFeastDayEn || '27th August (Universal Feast Day of Saint Monica)',
        patronFeastDaySw: aboutPageConfig.patronFeastDaySw || 'Tarehe 27 Agosti (Sikukuu ya Mtakatifu Monika Duniani)',
        patronPrayerEn: aboutPageConfig.patronPrayerEn || 'Lord, through the persistent prayers and tears of Saint Monica, You led Saint Augustine into the light of the true faith. Through her intercession, give our choir faithful devotion, vocal humility, and grace to draw all souls to Your Altar through sacred song. Amen.',
        patronPrayerSw: aboutPageConfig.patronPrayerSw || 'Ee Mungu wetu, kupitia sala na machozi ya Mtakatifu Monika, ulimwongoza mwanaye Augustino kwenye ukweli wa Injili. Kupitia maombezi yake, ijalie kwaya yetu neema ya kuimba kwa unyenyekevu na nidhamu ya kicho altaroni ili mioyo ya wengi ivutwe kwako. Amina.'
      });
    }
  }, [aboutPageConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutPageConfig(form);
    onNotify(lang === 'sw' ? 'Maudhui na picha za ukurasa wa historia zimehifadhiwa!' : 'About Page story, patron saint, and photos saved live!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-[#0C2340]/10 shadow-sm overflow-hidden">
        <AfricanGeometricBorder />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0C2340]/10">
            <div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                About Choir Page: Story, Patron Saint & Photography
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-source mt-1">
                Customize all photography, banners, historical narratives, Saint Monica biographies, and prayers on the About Choir views.
              </p>
              <p className="text-[11px] text-slate-400 font-source italic mt-0.5">
                (Hariri picha zote za ukurasa wa historia, somo mtakatifu Monika, na maelezo)
              </p>
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 shrink-0">
              About Views: Story & Patron
            </span>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#0C2340]/10 w-fit">
            <button
              type="button"
              onClick={() => setSubSection('story')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                subSection === 'story'
                  ? 'bg-[#1058A8] text-white shadow-xs'
                  : 'text-[#0C2340]/80 hover:bg-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. Our Story & Heritage (Historia Yetu)</span>
            </button>

            <button
              type="button"
              onClick={() => setSubSection('patron')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                subSection === 'patron'
                  ? 'bg-[#1058A8] text-white shadow-xs'
                  : 'text-[#0C2340]/80 hover:bg-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>2. Saint Monica Patroness (Msimamizi Wetu)</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SUB-SECTION 1: STORY */}
            {subSection === 'story' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#FAF8F5] rounded-2xl border border-[#0C2340]/10">
                  <ImageUploadField
                    label="Story Slim Banner Image"
                    labelSw="Picha ya Bango la Juu la Historia"
                    value={form.storyBannerImg}
                    onChange={val => {
                      setForm(prev => ({ ...prev, storyBannerImg: val }));
                      updateAboutPageConfig({ storyBannerImg: val });
                      onNotify(lang === 'sw' ? 'Bango la historia limesasishwa moja kwa moja!' : 'Story banner photo updated live on Our Story page!');
                    }}
                    defaultValue="/assets/choir/choir_02.jpg"
                    helpText="Wide slim banner photo for top of Our Story page."
                    presets={photoPresets}
                    aspectRatio="aspect-video"
                  />

                  <ImageUploadField
                    label="Story Main Church / Group Photo"
                    labelSw="Picha Kuu ya Kanisa / Wanakwaya"
                    value={form.storyPhotoImg}
                    onChange={val => {
                      setForm(prev => ({ ...prev, storyPhotoImg: val }));
                      updateAboutPageConfig({ storyPhotoImg: val });
                      onNotify(lang === 'sw' ? 'Picha ya historia imesasishwa moja kwa moja!' : 'Story photo updated live on Our Story page!');
                    }}
                    defaultValue="/assets/choir/choir_04.jpg"
                    helpText="Photo shown next to the story narrative."
                    presets={photoPresets}
                    aspectRatio="aspect-[4/3]"
                  />
                </div>

                {/* Texts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* English */}
                  <div className="p-5 bg-white rounded-2xl border-2 border-[#1058A8]/30 space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1058A8]" />
                      <strong className="text-xs text-[#0C2340] uppercase tracking-wider">English (Primary Display)</strong>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Story Title (English)</label>
                      <input
                        type="text"
                        value={form.storyTitleEn}
                        onChange={e => setForm(prev => ({ ...prev, storyTitleEn: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Story Subtitle (English)</label>
                      <input
                        type="text"
                        value={form.storySubtitleEn}
                        onChange={e => setForm(prev => ({ ...prev, storySubtitleEn: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Paragraph 1 (English)</label>
                      <textarea
                        rows={4}
                        value={form.storyParagraph1En}
                        onChange={e => setForm(prev => ({ ...prev, storyParagraph1En: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Paragraph 2 (English)</label>
                      <textarea
                        rows={4}
                        value={form.storyParagraph2En}
                        onChange={e => setForm(prev => ({ ...prev, storyParagraph2En: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  {/* Kiswahili */}
                  <div className="p-5 bg-white rounded-2xl border-2 border-amber-300/60 space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-amber-100">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <strong className="text-xs text-[#0C2340] uppercase tracking-wider">Kiswahili (Sehemu ya Pili)</strong>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Kichwa cha Historia (Kiswahili)</label>
                      <input
                        type="text"
                        value={form.storyTitleSw}
                        onChange={e => setForm(prev => ({ ...prev, storyTitleSw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Maelezo Mafupi (Kiswahili)</label>
                      <input
                        type="text"
                        value={form.storySubtitleSw}
                        onChange={e => setForm(prev => ({ ...prev, storySubtitleSw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Aya ya 1 (Kiswahili)</label>
                      <textarea
                        rows={4}
                        value={form.storyParagraph1Sw}
                        onChange={e => setForm(prev => ({ ...prev, storyParagraph1Sw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Aya ya 2 (Kiswahili)</label>
                      <textarea
                        rows={4}
                        value={form.storyParagraph2Sw}
                        onChange={e => setForm(prev => ({ ...prev, storyParagraph2Sw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-SECTION 2: PATRON SAINT */}
            {subSection === 'patron' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#FAF8F5] rounded-2xl border border-[#0C2340]/10">
                  <ImageUploadField
                    label="Saint Monica Banner Image"
                    labelSw="Picha ya Bango la Juu la Somo Monika"
                    value={form.patronBannerImg}
                    onChange={val => {
                      setForm(prev => ({ ...prev, patronBannerImg: val }));
                      updateAboutPageConfig({ patronBannerImg: val });
                      onNotify(lang === 'sw' ? 'Bango la Mtakatifu Monika limesasishwa moja kwa moja!' : 'Patron Saint banner updated live on Patron page!');
                    }}
                    defaultValue="/assets/choir/choir_06.jpg"
                    helpText="Wide banner image for Patron Saint page."
                    presets={photoPresets}
                    aspectRatio="aspect-video"
                  />

                  <ImageUploadField
                    label="Saint Monica Icon / Portrait Image"
                    labelSw="Picha ya Picha Takatifu / Picha ya Monika"
                    value={form.patronPortraitImg}
                    onChange={val => {
                      setForm(prev => ({ ...prev, patronPortraitImg: val }));
                      updateAboutPageConfig({ patronPortraitImg: val });
                      onNotify(lang === 'sw' ? 'Picha ya Mtakatifu Monika imesasishwa moja kwa moja!' : 'Patron Saint portrait updated live on Patron page!');
                    }}
                    defaultValue="/assets/choir/choir_leader_01.jpg"
                    helpText="Holy icon, portrait painting, or statue of Saint Monica."
                    presets={photoPresets}
                    aspectRatio="aspect-[4/3]"
                  />
                </div>

                {/* Texts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* English */}
                  <div className="p-5 bg-white rounded-2xl border-2 border-[#1058A8]/30 space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1058A8]" />
                      <strong className="text-xs text-[#0C2340] uppercase tracking-wider">English (Primary Display)</strong>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Title (English)</label>
                      <input
                        type="text"
                        value={form.patronTitleEn}
                        onChange={e => setForm(prev => ({ ...prev, patronTitleEn: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle & Feast Day (English)</label>
                      <input
                        type="text"
                        value={form.patronSubtitleEn}
                        onChange={e => setForm(prev => ({ ...prev, patronSubtitleEn: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Biography Part 1 (English)</label>
                      <textarea
                        rows={3}
                        value={form.patronBio1En}
                        onChange={e => setForm(prev => ({ ...prev, patronBio1En: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Biography Part 2 (English)</label>
                      <textarea
                        rows={3}
                        value={form.patronBio2En}
                        onChange={e => setForm(prev => ({ ...prev, patronBio2En: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Choir Novena / Prayer (English)</label>
                      <textarea
                        rows={3}
                        value={form.patronPrayerEn}
                        onChange={e => setForm(prev => ({ ...prev, patronPrayerEn: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-serif italic"
                      />
                    </div>
                  </div>

                  {/* Kiswahili */}
                  <div className="p-5 bg-white rounded-2xl border-2 border-amber-300/60 space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-amber-100">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <strong className="text-xs text-[#0C2340] uppercase tracking-wider">Kiswahili (Sehemu ya Pili)</strong>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Kichwa cha Mada (Kiswahili)</label>
                      <input
                        type="text"
                        value={form.patronTitleSw}
                        onChange={e => setForm(prev => ({ ...prev, patronTitleSw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Maelezo Mafupi na Sikukuu (Kiswahili)</label>
                      <input
                        type="text"
                        value={form.patronSubtitleSw}
                        onChange={e => setForm(prev => ({ ...prev, patronSubtitleSw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Historia ya Mtakatifu Monika Sehemu ya 1 (Kiswahili)</label>
                      <textarea
                        rows={3}
                        value={form.patronBio1Sw}
                        onChange={e => setForm(prev => ({ ...prev, patronBio1Sw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Historia Sehemu ya 2 (Kiswahili)</label>
                      <textarea
                        rows={3}
                        value={form.patronBio2Sw}
                        onChange={e => setForm(prev => ({ ...prev, patronBio2Sw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Sala ya Kwaya kwa Mt. Monika (Kiswahili)</label>
                      <textarea
                        rows={3}
                        value={form.patronPrayerSw}
                        onChange={e => setForm(prev => ({ ...prev, patronPrayerSw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-serif italic"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
              <span className="text-xs text-slate-500 font-source italic">
                Saves and updates the Our Story and Patron Saint pages live across the entire website.
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save About Page Content & Photos</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
