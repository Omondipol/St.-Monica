import React, { useState } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { MassItem } from '../../data/choirContent';
import { AfricanGeometricBorder } from '../AfricanGeometricBorder';
import { Plus, Trash2, Edit3, Save, Clock, Check, X, RotateCcw, AlertTriangle } from 'lucide-react';

interface AdminMassesTabProps {
  onNotify: (msg: string) => void;
}

export const AdminMassesTab: React.FC<AdminMassesTabProps> = ({ onNotify }) => {
  const {
    lang,
    massesList,
    addMass,
    updateMass,
    deleteMass,
    massSchedule,
    updateMassSchedule,
    footerContact,
    updateFooterContact,
    choirStats,
    updateChoirStats
  } = useChoir();

  // Modal / Form state for adding/editing a Mass
  const [showMassModal, setShowMassModal] = useState<boolean>(false);
  const [editingMassId, setEditingMassId] = useState<string | null>(null);

  const [massForm, setMassForm] = useState({
    title: '',
    titleSw: '',
    time: '10:00 AM',
    desc: '',
    descSw: '',
    isSungMass: false
  });

  // Rehearsals state
  const [rehearsalsEn, setRehearsalsEn] = useState<string>(
    footerContact?.rehearsalsEn || massSchedule?.rehearsals || choirStats?.rehearsalSchedule || 'Wednesdays & Fridays: 5:30 PM – 7:30 PM (Parish Hall)'
  );
  const [rehearsalsSw, setRehearsalsSw] = useState<string>(
    footerContact?.rehearsalsSw || massSchedule?.rehearsalsSw || choirStats?.rehearsalScheduleSw || 'Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku (Ukumbi wa Parokia)'
  );

  React.useEffect(() => {
    const valEn = footerContact?.rehearsalsEn || massSchedule?.rehearsals || choirStats?.rehearsalSchedule;
    if (valEn) setRehearsalsEn(valEn);
  }, [footerContact?.rehearsalsEn, massSchedule?.rehearsals, choirStats?.rehearsalSchedule]);

  React.useEffect(() => {
    const valSw = footerContact?.rehearsalsSw || massSchedule?.rehearsalsSw || choirStats?.rehearsalScheduleSw;
    if (valSw) setRehearsalsSw(valSw);
  }, [footerContact?.rehearsalsSw, massSchedule?.rehearsalsSw, choirStats?.rehearsalScheduleSw]);

  const openAddMass = () => {
    setEditingMassId(null);
    setMassForm({
      title: '',
      titleSw: '',
      time: '10:00 AM',
      desc: '',
      descSw: '',
      isSungMass: false
    });
    setShowMassModal(true);
  };

  const openEditMass = (m: MassItem) => {
    setEditingMassId(m.id);
    setMassForm({
      title: m.title,
      titleSw: m.titleSw || '',
      time: m.time,
      desc: m.desc,
      descSw: m.descSw || '',
      isSungMass: !!m.isSungMass
    });
    setShowMassModal(true);
  };

  const handleSaveMassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!massForm.title.trim() || !massForm.time.trim()) {
      alert('Please provide Mass Title and Time.');
      return;
    }

    if (editingMassId) {
      updateMass(editingMassId, {
        title: massForm.title.trim(),
        titleSw: massForm.titleSw.trim() || undefined,
        time: massForm.time.trim(),
        desc: massForm.desc.trim(),
        descSw: massForm.descSw.trim() || undefined,
        isSungMass: massForm.isSungMass
      });
      onNotify(lang === 'sw' ? 'Misa imesasishwa kikamilifu!' : 'Mass schedule item updated successfully!');
    } else {
      addMass({
        title: massForm.title.trim(),
        titleSw: massForm.titleSw.trim() || undefined,
        time: massForm.time.trim(),
        desc: massForm.desc.trim(),
        descSw: massForm.descSw.trim() || undefined,
        isSungMass: massForm.isSungMass
      });
      onNotify(lang === 'sw' ? 'Misa mpya imeongezwa kwenye ratiba!' : 'New Mass added to Sunday schedule!');
    }
    setShowMassModal(false);
  };

  const handleDeleteMass = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from the Sunday schedule?`)) {
      deleteMass(id);
      onNotify(lang === 'sw' ? 'Misa imeondolewa!' : `"${title}" deleted from schedule.`);
    }
  };

  const handleSaveRehearsals = (e: React.FormEvent) => {
    e.preventDefault();
    updateFooterContact({
      rehearsalsEn: rehearsalsEn.trim(),
      rehearsalsSw: rehearsalsSw.trim()
    });
    updateMassSchedule({
      rehearsals: rehearsalsEn.trim(),
      rehearsalsSw: rehearsalsSw.trim()
    });
    updateChoirStats({
      rehearsalSchedule: rehearsalsEn.trim(),
      rehearsalScheduleSw: rehearsalsSw.trim()
    });
    onNotify(lang === 'sw' ? 'Ratiba ya mazoezi imehifadhiwa!' : 'Rehearsal schedule updated live!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-[#0C2340]/10 shadow-sm overflow-hidden">
        <AfricanGeometricBorder />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0C2340]/10">
            <div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340]">
                Sunday Mass Schedules & Service Times
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-source mt-1">
                Add, edit, or delete any Mass service at St. Monica Catholic Church. Changes update both the homepage schedule and footer automatically.
              </p>
              <p className="text-[11px] text-slate-400 font-source italic mt-0.5">
                (Ongeza, hariri au futa Misa za Jumapili na ratiba ya ibada)
              </p>
            </div>

            <button
              type="button"
              onClick={openAddMass}
              className="px-4 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sunday Mass (Ongeza Misa)</span>
            </button>
          </div>

          {/* Mass List */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#0C2340] uppercase tracking-wider block">
              Active Sunday Masses ({massesList?.length || 0})
            </span>

            {massesList && massesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {massesList.map((m) => (
                  <div
                    key={m.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      m.isSungMass
                        ? 'bg-[#EAF4FB] border-[#1058A8]/40 shadow-xs'
                        : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1058A8] tabular-nums font-eb-garamond">
                          {m.time}
                        </span>
                        {m.isSungMass && (
                          <span className="text-[10px] font-bold bg-[#1058A8] text-white px-2 py-0.5 rounded-full">
                            Sung Mass · Kwaya
                          </span>
                        )}
                      </div>

                      <div>
                        <strong className="text-base font-bold text-[#0C2340] block font-eb-garamond leading-snug">
                          {m.title}
                        </strong>
                        {m.titleSw && (
                          <span className="text-xs text-slate-500 font-source block mt-0.5">
                            SW: {m.titleSw}
                          </span>
                        )}
                      </div>

                      {m.desc && (
                        <p className="text-xs text-slate-700 font-source line-clamp-2">
                          {m.desc}
                        </p>
                      )}
                      {m.descSw && (
                        <p className="text-[11px] text-slate-500 font-source line-clamp-2">
                          SW: {m.descSw}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => openEditMass(m)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1058A8] hover:bg-[#1058A8]/10 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMass(m.id, m.title)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-600">No Masses configured.</p>
                <button
                  type="button"
                  onClick={openAddMass}
                  className="px-4 py-2 bg-[#1058A8] text-white rounded-xl text-xs font-bold"
                >
                  Add Your First Sunday Mass
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Rehearsals */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#0C2340] font-source">
                Choir Rehearsals Schedule (Mazoezi ya Kwaya)
              </h3>
            </div>

            <form onSubmit={handleSaveRehearsals} className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#0C2340]/10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1">
                    Rehearsal Hours (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={rehearsalsEn}
                    onChange={e => setRehearsalsEn(e.target.value)}
                    placeholder="Wednesdays & Fridays: 5:30 PM – 7:30 PM (Parish Hall)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ratiba ya Mazoezi (Kiswahili) *
                  </label>
                  <input
                    type="text"
                    required
                    value={rehearsalsSw}
                    onChange={e => setRehearsalsSw(e.target.value)}
                    placeholder="Jumatano na Ijumaa: Saa 11:30 Jioni – Saa 1:30 Usiku (Ukumbi wa Parokia)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Rehearsal Times</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add / Edit Mass Modal */}
      {showMassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C2340]/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#0C2340]/15 space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-eb-garamond text-xl sm:text-2xl font-bold text-[#0C2340]">
                {editingMassId ? 'Edit Sunday Mass' : 'Add New Sunday Mass'}
              </h3>
              <button
                type="button"
                onClick={() => setShowMassModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMassSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1">
                    Mass Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={massForm.title}
                    onChange={e => setMassForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. 3rd Mass (Sunday Sung Mass)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jina la Misa (Kiswahili)
                  </label>
                  <input
                    type="text"
                    value={massForm.titleSw}
                    onChange={e => setMassForm(prev => ({ ...prev, titleSw: e.target.value }))}
                    placeholder="e.g. Misa ya 3 (Misa Inayoimbwa ya Jumapili)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] uppercase tracking-wider mb-1">
                    Mass Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={massForm.time}
                    onChange={e => setMassForm(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#1058A8]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={massForm.isSungMass}
                      onChange={e => setMassForm(prev => ({ ...prev, isSungMass: e.target.checked }))}
                      className="w-4 h-4 accent-[#1058A8] cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[#0C2340]">
                      Official Choir Sung Mass (Misa Inayoimbwa)
                    </span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brief Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={massForm.desc}
                    onChange={e => setMassForm(prev => ({ ...prev, desc: e.target.value }))}
                    placeholder="St. Monica Third Mass Choir leads solemn four-part SATB liturgy."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maelezo Mafupi (Kiswahili)
                  </label>
                  <textarea
                    rows={2}
                    value={massForm.descSw}
                    onChange={e => setMassForm(prev => ({ ...prev, descSw: e.target.value }))}
                    placeholder="Kwaya ya Mtakatifu Monika huongoza liturujia ya sauti nne."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowMassModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  {editingMassId ? 'Update Mass' : 'Save New Mass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
