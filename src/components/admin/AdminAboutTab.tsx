import React, { useState, useEffect } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { ImageUploadField, PresetImageOption } from '../ImageUploadField';
import { Save, BookOpen, Heart } from 'lucide-react';

interface AdminAboutTabProps {
  onNotify: (msg: string) => void;
}

export const AdminAboutTab: React.FC<AdminAboutTabProps> = ({ onNotify }) => {
  const { lang, aboutPageConfig, updateAboutPageConfig } = useChoir();

  const [subSection, setSubSection] = useState<'story' | 'patron'>('story');

  const photoPresets: PresetImageOption[] = [
    { label: 'Choir in Vestments', url: '/assets/choir/choir_02.jpg' },
    { label: 'Sanctuary Prayer', url: '/assets/choir/choir_03.jpg' },
    { label: 'SATB Polyphony', url: '/assets/choir/choir_04.jpg' },
    { label: 'Sanctuary Praise', url: '/assets/choir/choir_05.jpg' },
    { label: 'Assembly Gathering', url: '/assets/choir/choir_06.jpg' },
    { label: 'Saint Monica Icon', url: '/assets/choir/choir_leader_01.jpg' }
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
    onNotify(lang === 'sw' ? 'Mabadiliko yamehifadhiwa!' : 'Changes appear on the website after you save.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-[#0C2340]/10 p-5 sm:p-6 space-y-6">
        
        {/* Header without description or extra pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0C2340]/10">
          <div>
            <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
              Our story and patron saint
            </h2>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-md border border-[#0C2340]/10 w-fit">
            <button
              type="button"
              onClick={() => setSubSection('story')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                subSection === 'story'
                  ? 'bg-[#1058A8] text-white font-bold'
                  : 'text-[#0C2340]/80 hover:bg-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Our story</span>
            </button>

            <button
              type="button"
              onClick={() => setSubSection('patron')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                subSection === 'patron'
                  ? 'bg-[#1058A8] text-white font-bold'
                  : 'text-[#0C2340]/80 hover:bg-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Patron saint</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SUB-SECTION 1: STORY */}
          {subSection === 'story' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-[#FAF8F5] rounded-lg border border-[#0C2340]/10">
                <ImageUploadField
                  label="Story banner"
                  value={form.storyBannerImg}
                  onChange={val => {
                    setForm(prev => ({ ...prev, storyBannerImg: val }));
                    updateAboutPageConfig({ storyBannerImg: val });
                    onNotify('Story banner updated.');
                  }}
                  defaultValue="/assets/choir/choir_02.jpg"
                  helpText="Shown at the top of the story page."
                  customRuleText="Use the original photo, not a WhatsApp copy. At least 1600 × 500 px."
                  presets={photoPresets}
                  aspectRatio="aspect-video"
                  pipelineTarget="banner"
                />

                <ImageUploadField
                  label="Group photo"
                  value={form.storyPhotoImg}
                  onChange={val => {
                    setForm(prev => ({ ...prev, storyPhotoImg: val }));
                    updateAboutPageConfig({ storyPhotoImg: val });
                    onNotify('Group photo updated.');
                  }}
                  defaultValue="/assets/choir/choir_04.jpg"
                  helpText="Photo shown next to the story narrative."
                  customRuleText="Use the original photo, not a WhatsApp copy. At least 1200 × 900 px."
                  presets={photoPresets}
                  aspectRatio="aspect-[4/3]"
                  pipelineTarget="gallery"
                />
              </div>

              {/* Texts: Equal Height Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                {/* English */}
                <div className="p-4 bg-white rounded-lg border border-[#1058A8]/30 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="pb-1 border-b border-slate-100">
                      <strong className="text-xs text-[#0C2340] uppercase tracking-wider">English</strong>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={form.storyTitleEn}
                        onChange={e => setForm(prev => ({ ...prev, storyTitleEn: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle</label>
                      <textarea
                        rows={2}
                        value={form.storySubtitleEn}
                        onChange={e => setForm(prev => ({ ...prev, storySubtitleEn: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Paragraph 1</label>
                      <textarea
                        rows={5}
                        value={form.storyParagraph1En}
                        onChange={e => setForm(prev => ({ ...prev, storyParagraph1En: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Paragraph 2</label>
                      <textarea
                        rows={5}
                        value={form.storyParagraph2En}
                        onChange={e => setForm(prev => ({ ...prev, storyParagraph2En: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                      />
                    </div>
                  </div>
                </div>

                {/* Kiswahili */}
                <div className="p-4 bg-white rounded-lg border border-amber-300/60 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="pb-1 border-b border-amber-100">
                      <strong className="text-xs text-[#0C2340] uppercase tracking-wider">Kiswahili</strong>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Kichwa</label>
                      <input
                        type="text"
                        value={form.storyTitleSw}
                        onChange={e => setForm(prev => ({ ...prev, storyTitleSw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Maelezo mafupi</label>
                      <textarea
                        rows={2}
                        value={form.storySubtitleSw}
                        onChange={e => setForm(prev => ({ ...prev, storySubtitleSw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Aya ya 1</label>
                      <textarea
                        rows={5}
                        value={form.storyParagraph1Sw}
                        onChange={e => setForm(prev => ({ ...prev, storyParagraph1Sw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Aya ya 2</label>
                      <textarea
                        rows={5}
                        value={form.storyParagraph2Sw}
                        onChange={e => setForm(prev => ({ ...prev, storyParagraph2Sw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-SECTION 2: PATRON SAINT */}
          {subSection === 'patron' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-[#FAF8F5] rounded-lg border border-[#0C2340]/10">
                <ImageUploadField
                  label="Patron banner"
                  value={form.patronBannerImg}
                  onChange={val => {
                    setForm(prev => ({ ...prev, patronBannerImg: val }));
                    updateAboutPageConfig({ patronBannerImg: val });
                    onNotify('Patron banner updated.');
                  }}
                  defaultValue="/assets/choir/choir_06.jpg"
                  helpText="Shown at the top of the patron saint page."
                  customRuleText="Use the original photo, not a WhatsApp copy. At least 1600 × 500 px."
                  presets={photoPresets}
                  aspectRatio="aspect-video"
                  pipelineTarget="banner"
                />

                <ImageUploadField
                  label="Patron portrait"
                  value={form.patronPortraitImg}
                  onChange={val => {
                    setForm(prev => ({ ...prev, patronPortraitImg: val }));
                    updateAboutPageConfig({ patronPortraitImg: val });
                    onNotify('Patron portrait updated.');
                  }}
                  defaultValue="/assets/choir/choir_leader_01.jpg"
                  helpText="Icon or portrait painting of Saint Monica."
                  customRuleText="Use the original photo, not a WhatsApp copy. At least 800 × 1000 px."
                  presets={photoPresets}
                  aspectRatio="aspect-[4/3]"
                  pipelineTarget="profile"
                />
              </div>

              {/* Texts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                {/* English */}
                <div className="p-4 bg-white rounded-lg border border-[#1058A8]/30 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="pb-1 border-b border-slate-100">
                      <strong className="text-xs text-[#0C2340] uppercase tracking-wider">English</strong>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={form.patronTitleEn}
                        onChange={e => setForm(prev => ({ ...prev, patronTitleEn: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle</label>
                      <textarea
                        rows={2}
                        value={form.patronSubtitleEn}
                        onChange={e => setForm(prev => ({ ...prev, patronSubtitleEn: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Paragraph 1</label>
                      <textarea
                        rows={4}
                        value={form.patronBio1En}
                        onChange={e => setForm(prev => ({ ...prev, patronBio1En: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Paragraph 2</label>
                      <textarea
                        rows={4}
                        value={form.patronBio2En}
                        onChange={e => setForm(prev => ({ ...prev, patronBio2En: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Prayer</label>
                      <textarea
                        rows={3}
                        value={form.patronPrayerEn}
                        onChange={e => setForm(prev => ({ ...prev, patronPrayerEn: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs font-serif italic"
                      />
                    </div>
                  </div>
                </div>

                {/* Kiswahili */}
                <div className="p-4 bg-white rounded-lg border border-amber-300/60 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="pb-1 border-b border-amber-100">
                      <strong className="text-xs text-[#0C2340] uppercase tracking-wider">Kiswahili</strong>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Kichwa</label>
                      <input
                        type="text"
                        value={form.patronTitleSw}
                        onChange={e => setForm(prev => ({ ...prev, patronTitleSw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Maelezo mafupi</label>
                      <textarea
                        rows={2}
                        value={form.patronSubtitleSw}
                        onChange={e => setForm(prev => ({ ...prev, patronSubtitleSw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Aya ya 1</label>
                      <textarea
                        rows={4}
                        value={form.patronBio1Sw}
                        onChange={e => setForm(prev => ({ ...prev, patronBio1Sw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Aya ya 2</label>
                      <textarea
                        rows={4}
                        value={form.patronBio2Sw}
                        onChange={e => setForm(prev => ({ ...prev, patronBio2Sw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Sala</label>
                      <textarea
                        rows={3}
                        value={form.patronPrayerSw}
                        onChange={e => setForm(prev => ({ ...prev, patronPrayerSw: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs font-serif italic"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-source">
              Changes appear on the website after you save.
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-md bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center gap-2 shadow-2xs cursor-pointer transition-all self-start sm:self-auto"
            >
              <Save className="w-4 h-4" />
              <span>Save changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
