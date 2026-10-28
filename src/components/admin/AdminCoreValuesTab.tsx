import React, { useState } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { CoreValueItem, ALL_EIGHT_VIRTUES_CATALOG, DEFAULT_CORE_VALUES } from '../../data/choirContent';
import { AfricanGeometricBorder } from '../AfricanGeometricBorder';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  RotateCcw, 
  BookOpen, 
  Eye, 
  EyeOff, 
  Save, 
  ShieldCheck,
  Heart,
  Shield,
  Award
} from 'lucide-react';

interface AdminCoreValuesTabProps {
  onNotify: (msg: string) => void;
}

export const AdminCoreValuesTab: React.FC<AdminCoreValuesTabProps> = ({ onNotify }) => {
  const { coreValues, addCoreValue, updateCoreValue, deleteCoreValue, resetCoreValues } = useChoir();

  // Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formBadgeNumber, setFormBadgeNumber] = useState<number>(1);
  const [formTitleEn, setFormTitleEn] = useState<string>('');
  const [formTitleSw, setFormTitleSw] = useState<string>('');
  const [formSubtitleEn, setFormSubtitleEn] = useState<string>('');
  const [formSubtitleSw, setFormSubtitleSw] = useState<string>('');
  const [formDescEn, setFormDescEn] = useState<string>('');
  const [formDescSw, setFormDescSw] = useState<string>('');
  const [formScriptureRef, setFormScriptureRef] = useState<string>('');
  const [formActive, setFormActive] = useState<boolean>(true);

  const openAddModal = () => {
    setEditingId(null);
    setFormBadgeNumber(coreValues.length + 1);
    setFormTitleEn('');
    setFormTitleSw('');
    setFormSubtitleEn('');
    setFormSubtitleSw('');
    setFormDescEn('');
    setFormDescSw('');
    setFormScriptureRef('');
    setFormActive(true);
    setShowModal(true);
  };

  const openEditModal = (item: CoreValueItem) => {
    setEditingId(item.id);
    setFormBadgeNumber(item.badgeNumber || 1);
    setFormTitleEn(item.titleEn);
    setFormTitleSw(item.titleSw);
    setFormSubtitleEn(item.subtitleEn || '');
    setFormSubtitleSw(item.subtitleSw || '');
    setFormDescEn(item.descriptionEn);
    setFormDescSw(item.descriptionSw);
    setFormScriptureRef(item.scriptureRef || '');
    setFormActive(item.active !== false);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn.trim() || !formDescEn.trim()) {
      alert('Please fill in at least the English title and description.');
      return;
    }

    if (editingId) {
      updateCoreValue(editingId, {
        badgeNumber: Number(formBadgeNumber) || 1,
        titleEn: formTitleEn.trim(),
        titleSw: formTitleSw.trim() || formTitleEn.trim(),
        subtitleEn: formSubtitleEn.trim() || undefined,
        subtitleSw: formSubtitleSw.trim() || undefined,
        descriptionEn: formDescEn.trim(),
        descriptionSw: formDescSw.trim() || formDescEn.trim(),
        scriptureRef: formScriptureRef.trim() || undefined,
        active: formActive
      });
      onNotify(`Core value "${formTitleEn}" updated successfully.`);
    } else {
      addCoreValue({
        badgeNumber: Number(formBadgeNumber) || (coreValues.length + 1),
        titleEn: formTitleEn.trim(),
        titleSw: formTitleSw.trim() || formTitleEn.trim(),
        subtitleEn: formSubtitleEn.trim() || undefined,
        subtitleSw: formSubtitleSw.trim() || undefined,
        descriptionEn: formDescEn.trim(),
        descriptionSw: formDescSw.trim() || formDescEn.trim(),
        scriptureRef: formScriptureRef.trim() || undefined,
        active: formActive
      });
      onNotify(`Added new core value "${formTitleEn}".`);
    }

    setShowModal(false);
  };

  const handleAddFromCatalog = (preset: CoreValueItem) => {
    // Check if already in list
    const existing = coreValues.find(v => v.titleEn.toLowerCase() === preset.titleEn.toLowerCase());
    if (existing) {
      updateCoreValue(existing.id, { active: true });
      onNotify(`Activated "${preset.titleEn}" in core values.`);
      return;
    }

    addCoreValue({
      badgeNumber: coreValues.length + 1,
      titleEn: preset.titleEn,
      titleSw: preset.titleSw,
      subtitleEn: preset.subtitleEn,
      subtitleSw: preset.subtitleSw,
      descriptionEn: preset.descriptionEn,
      descriptionSw: preset.descriptionSw,
      scriptureRef: preset.scriptureRef,
      active: true
    });
    onNotify(`Added "${preset.titleEn}" from the 8 Virtues Catalog.`);
  };

  const handleToggleActive = (id: string, current: boolean) => {
    updateCoreValue(id, { active: !current });
    onNotify(`Toggled visibility for core value.`);
  };

  const activeCount = coreValues.filter(v => v.active !== false).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#0C2340]/10 p-6 shadow-xs space-y-4">
        <AfricanGeometricBorder />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-source">
                Homepage Feature
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {activeCount} of 3 virtues featured on homepage
              </span>
            </div>
            <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340] mt-1">
              Our Core Values (Catholic Liturgical Virtues)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-source mt-1 max-w-2xl">
              These values appear in the "Our Core Values" section of the homepage. By default, the top three virtues (Faith, Reverence, Excellence) are highlighted. You can edit titles, descriptions, add custom values, or swap from the official 8 Catholic choir virtues catalog below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (window.confirm('Reset core values to the 3 default virtues (Faith, Reverence, Excellence)?')) {
                  resetCoreValues();
                  onNotify('Reset core values to defaults.');
                }
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset to Defaults</span>
            </button>

            <button
              onClick={openAddModal}
              className="px-4 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Value</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Virtues Quick-Add Shelf (From attached image_254811b4.png) */}
      <div className="bg-[#FAF8F5] border border-[#0C2340]/10 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1058A8]" />
            <h3 className="font-eb-garamond text-base sm:text-lg font-bold text-[#0C2340]">
              Official 8 Catholic Virtues Reference Catalog
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-source italic">
            Quickly add any virtue to your list
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ALL_EIGHT_VIRTUES_CATALOG.map(preset => {
            const isAlreadyActive = coreValues.some(v => v.titleEn.toLowerCase() === preset.titleEn.toLowerCase() && v.active !== false);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleAddFromCatalog(preset)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between text-xs ${
                  isAlreadyActive
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 ring-1 ring-emerald-400/40'
                    : 'bg-white border-slate-200 hover:border-[#1058A8] text-[#0C2340] hover:bg-[#EAF4FB]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold font-eb-garamond text-sm uppercase">
                      {preset.badgeNumber}. {preset.titleEn}
                    </span>
                    {isAlreadyActive ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                        Active
                      </span>
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1058A8]" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 line-clamp-1">
                    {preset.titleSw}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block font-source truncate">
                  {preset.subtitleEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active & Configured Core Values List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-eb-garamond text-lg font-bold text-[#0C2340]">
            Configured Values ({coreValues.length})
          </h3>
          <span className="text-xs text-slate-500 font-source">
            Note: The first 3 active values will appear on the homepage.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coreValues.map((val, idx) => {
            const isActive = val.active !== false;
            return (
              <div
                key={val.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isActive
                    ? 'bg-white border-[#0C2340]/15 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0C2340] text-amber-400 font-bold font-eb-garamond flex items-center justify-center text-sm border border-amber-400">
                        {val.badgeNumber || idx + 1}
                      </div>
                      <div>
                        <strong className="font-eb-garamond text-lg font-bold text-[#0C2340] block leading-tight">
                          {val.titleEn}
                        </strong>
                        <span className="text-xs text-[#1058A8] font-source italic">
                          SW: {val.titleSw}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(val.id, isActive)}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                      title={isActive ? 'Deactivate (hide from homepage)' : 'Activate (show on homepage)'}
                    >
                      {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {val.subtitleEn && (
                    <div className="text-xs font-semibold text-slate-600 font-source">
                      {val.subtitleEn} {val.subtitleSw && <span className="text-slate-400">({val.subtitleSw})</span>}
                    </div>
                  )}

                  {/* English Description */}
                  <div className="text-xs text-slate-700 font-source bg-[#FAF8F5] p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">English text:</span>
                    <p className="italic">“{val.descriptionEn}”</p>
                  </div>

                  {/* Kiswahili Description (For Swahili site visitors) */}
                  <div className="text-xs text-slate-700 font-source bg-[#FAF8F5] p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-[#1058A8] uppercase tracking-wider block">Kiswahili translation (for Swahili site):</span>
                    <p className="italic">“{val.descriptionSw}”</p>
                  </div>

                  {val.scriptureRef && (
                    <div className="text-[11px] text-slate-500 font-source">
                      Scripture: <strong>{val.scriptureRef}</strong>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    isActive ? 'bg-blue-50 text-[#1058A8]' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isActive ? 'Active on Home' : 'Hidden'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(val)}
                      className="p-1.5 text-[#1058A8] hover:bg-[#EAF4FB] rounded-lg transition-colors cursor-pointer"
                      title="Edit Value"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete core value "${val.titleEn}"?`)) {
                          deleteCoreValue(val.id);
                          onNotify(`Deleted core value "${val.titleEn}".`);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Value"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: ADD / EDIT CORE VALUE */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C2340]/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#0C2340]/15 space-y-5 my-8 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#0C2340]/10">
              <div>
                <h3 className="font-eb-garamond text-2xl font-bold text-[#0C2340]">
                  {editingId ? 'Edit Core Value' : 'Add New Core Value'}
                </h3>
                <p className="text-xs text-slate-500 font-source mt-0.5">
                  English is the primary language. Fill in Kiswahili fields to provide translations for Swahili site visitors.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-[#0C2340] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-source">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Badge Number (Order)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formBadgeNumber}
                    onChange={e => setFormBadgeNumber(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                    required
                  />
                </div>

                <div className="sm:col-span-2 flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formActive}
                      onChange={e => setFormActive(e.target.checked)}
                      className="w-4 h-4 text-[#1058A8] rounded focus:ring-0"
                    />
                    <span>Active (Display on Homepage)</span>
                  </label>
                </div>
              </div>

              {/* Title: English & Kiswahili */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Title (English) *</label>
                  <input
                    type="text"
                    value={formTitleEn}
                    onChange={e => setFormTitleEn(e.target.value)}
                    placeholder="e.g. Faith"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Title (Kiswahili) <span className="text-[#1058A8] font-normal">— For Swahili site</span>
                  </label>
                  <input
                    type="text"
                    value={formTitleSw}
                    onChange={e => setFormTitleSw(e.target.value)}
                    placeholder="mf. Imani"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                  />
                </div>
              </div>

              {/* Subtitle / Tagline: English & Kiswahili */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subtitle (English)</label>
                  <input
                    type="text"
                    value={formSubtitleEn}
                    onChange={e => setFormSubtitleEn(e.target.value)}
                    placeholder="e.g. Rooted in Christ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Subtitle (Kiswahili) <span className="text-[#1058A8] font-normal">— For Swahili site</span>
                  </label>
                  <input
                    type="text"
                    value={formSubtitleSw}
                    onChange={e => setFormSubtitleSw(e.target.value)}
                    placeholder="mf. Imejengwa Juu ya Kristo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                  />
                </div>
              </div>

              {/* Description: English */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Theological Description (English) *
                </label>
                <textarea
                  rows={3}
                  value={formDescEn}
                  onChange={e => setFormDescEn(e.target.value)}
                  placeholder="Christ is the centre of all we sing. Our voices flow from lives rooted in prayer and the sacraments."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                  required
                />
              </div>

              {/* Description: Kiswahili */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Theological Description (Kiswahili) <span className="text-[#1058A8] font-normal">— For Swahili site</span>
                </label>
                <textarea
                  rows={3}
                  value={formDescSw}
                  onChange={e => setFormDescSw(e.target.value)}
                  placeholder="Kristo ndiye kiini cha yote tunayoimba. Sauti zetu zinatiririka kutoka kwenye maisha yaliyojikita katika sala na sakramenti."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                />
              </div>

              {/* Scripture Reference */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Scripture Reference (Optional)</label>
                <input
                  type="text"
                  value={formScriptureRef}
                  onChange={e => setFormScriptureRef(e.target.value)}
                  placeholder="e.g. Hebrews 11:1 / Waebrania 11:1"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1058A8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold cursor-pointer shadow-xs"
                >
                  {editingId ? 'Save Changes' : 'Add Core Value'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
