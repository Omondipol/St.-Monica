import React, { useState } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { CoreValueItem, ALL_EIGHT_VIRTUES_CATALOG } from '../../data/choirContent';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  RotateCcw, 
  BookOpen, 
  Eye, 
  EyeOff
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
    const existing = coreValues.find(v => v.titleEn.toLowerCase() === preset.titleEn.toLowerCase());
    if (existing) {
      updateCoreValue(existing.id, { active: true });
      onNotify(`Activated "${preset.titleEn}" in core values.`);
      return;
    }

    addCoreValue({
      badgeNumber: preset.badgeNumber,
      titleEn: preset.titleEn,
      titleSw: preset.titleSw,
      subtitleEn: preset.subtitleEn,
      subtitleSw: preset.subtitleSw,
      descriptionEn: preset.descriptionEn,
      descriptionSw: preset.descriptionSw,
      scriptureRef: preset.scriptureRef,
      active: true
    });
    onNotify(`Added "${preset.titleEn}".`);
  };

  const handleToggleActive = (id: string, current: boolean) => {
    updateCoreValue(id, { active: !current });
    onNotify(`Toggled visibility for core value.`);
  };

  const activeCount = coreValues.filter(v => v.active !== false).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-[#0C2340]/10 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5">
              {activeCount} of 3 shown on the home page
            </div>
            <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
              Core values
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-source mt-1 max-w-2xl">
              The first three active values appear on the home page. Edit them, add your own, or pick from the list below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (window.confirm('Reset core values to the 3 default values?')) {
                  resetCoreValues();
                  onNotify('Reset core values to defaults.');
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>

            <button
              onClick={openAddModal}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-md transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add value</span>
            </button>
          </div>
        </div>
      </div>

      {/* Choose from 8 virtues shelf */}
      <div className="bg-[#FAF8F5] border border-[#0C2340]/10 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#1058A8]" />
          <h3 className="font-eb-garamond text-base sm:text-lg font-bold text-[#0C2340]">
            Choose from 8 virtues
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ALL_EIGHT_VIRTUES_CATALOG.map(preset => {
            const isAlreadyActive = coreValues.some(v => v.titleEn.toLowerCase() === preset.titleEn.toLowerCase() && v.active !== false);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleAddFromCatalog(preset)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between text-xs ${
                  isAlreadyActive
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-white border-slate-200 hover:border-[#1058A8] text-[#0C2340] hover:bg-[#EAF4FB]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold font-eb-garamond text-sm">
                      {preset.badgeNumber}. {preset.titleEn}
                    </span>
                    {isAlreadyActive ? (
                      <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        <span>In use</span>
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

      {/* Configured Core Values List */}
      <div className="space-y-3">
        <div className="px-1">
          <h3 className="font-eb-garamond text-lg font-bold text-[#0C2340]">
            Configured Values ({coreValues.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coreValues.map((val, idx) => {
            const isActive = val.active !== false;
            return (
              <div
                key={val.id}
                className={`p-4 rounded-lg border transition-all flex flex-col justify-between space-y-3 ${
                  isActive
                    ? 'bg-white border-[#0C2340]/15'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#0C2340] text-amber-400 font-bold font-eb-garamond flex items-center justify-center text-xs border border-amber-400">
                        {val.badgeNumber || idx + 1}
                      </div>
                      <div>
                        <strong className="font-eb-garamond text-base font-bold text-[#0C2340] block leading-tight">
                          {val.titleEn}
                        </strong>
                        <span className="text-[11px] text-[#1058A8] font-source italic">
                          SW: {val.titleSw}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(val.id, isActive)}
                      className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
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
                  <div className="text-xs text-slate-700 font-source bg-[#FAF8F5] p-2.5 rounded-md border border-slate-100">
                    <p className="italic">“{val.descriptionEn}”</p>
                  </div>

                  {/* Kiswahili Description */}
                  <div className="text-xs text-slate-700 font-source bg-[#FAF8F5] p-2.5 rounded-md border border-slate-100">
                    <p className="italic">“{val.descriptionSw}”</p>
                  </div>

                  {val.scriptureRef && (
                    <div className="text-[11px] text-slate-500 font-source">
                      Scripture: <strong>{val.scriptureRef}</strong>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[11px] font-semibold ${
                    isActive ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    {isActive ? 'In use' : 'Hidden'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(val)}
                      className="p-1.5 text-[#1058A8] hover:bg-[#EAF4FB] rounded-md transition-colors cursor-pointer"
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
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
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

      {/* Edit / Add Modal */}
      {showModal && (
        <div 
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-lg w-full p-5 space-y-4 shadow-xl border border-[#0C2340]/20 cursor-default"
          >
            <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
              {editingId ? 'Edit Value' : 'Add Value'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs font-source">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={formTitleEn}
                    onChange={e => setFormTitleEn(e.target.value)}
                    placeholder="e.g. Faith"
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Title (Kiswahili)</label>
                  <input
                    type="text"
                    value={formTitleSw}
                    onChange={e => setFormTitleSw(e.target.value)}
                    placeholder="e.g. Imani"
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Subtitle (English)</label>
                  <input
                    type="text"
                    value={formSubtitleEn}
                    onChange={e => setFormSubtitleEn(e.target.value)}
                    placeholder="e.g. Rooted in Christ"
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Subtitle (Kiswahili)</label>
                  <input
                    type="text"
                    value={formSubtitleSw}
                    onChange={e => setFormSubtitleSw(e.target.value)}
                    placeholder="e.g. Imejengwa Juu ya Kristo"
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Description (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={formDescEn}
                  onChange={e => setFormDescEn(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Description (Kiswahili)</label>
                <textarea
                  rows={3}
                  value={formDescSw}
                  onChange={e => setFormDescSw(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Scripture Citation</label>
                <input
                  type="text"
                  value={formScriptureRef}
                  onChange={e => setFormScriptureRef(e.target.value)}
                  placeholder="e.g. Hebrews 11:1"
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formActive}
                  onChange={e => setFormActive(e.target.checked)}
                  className="rounded text-[#1058A8]"
                />
                <label htmlFor="activeCheck" className="text-slate-700 font-semibold cursor-pointer">
                  Feature on home page (active)
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#1058A8] hover:bg-[#0C2340] text-white cursor-pointer font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
