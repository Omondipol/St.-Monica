import React, { useState } from 'react';
import { useChoir } from '../../context/ChoirContext';
import { Album } from '../../data/choirContent';
import { AfricanGeometricBorder } from '../AfricanGeometricBorder';
import { ImageUploadField, PresetImageOption } from '../ImageUploadField';
import { Disc, Plus, Edit3, Trash2, Save, X, ExternalLink, Music, Sparkles } from 'lucide-react';
import choirCoverImg from '../../assets/images/st_monica_choir_cover_1791450290430.jpg';
import choirSingingPhoto from '../../assets/images/choir_singing_moment_1791356740170.jpg';

interface AdminAlbumsTabProps {
  onNotify: (msg: string) => void;
}

export const AdminAlbumsTab: React.FC<AdminAlbumsTabProps> = ({ onNotify }) => {
  const { lang, albums, addAlbum, updateAlbum, deleteAlbum, songs } = useChoir();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formYear, setFormYear] = useState<number>(2024);
  const [formTrackCount, setFormTrackCount] = useState<number>(4);
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formPriceKes, setFormPriceKes] = useState<number>(500);
  const [formDescription, setFormDescription] = useState('');
  const [formDescriptionSw, setFormDescriptionSw] = useState('');
  const [formYoutubeUrl, setFormYoutubeUrl] = useState('');
  const [formSongsText, setFormSongsText] = useState('');

  const albumPresets: PresetImageOption[] = [
    {
      label: 'Studio Master Cover (Jalada Kuu)',
      url: choirCoverImg
    },
    {
      label: 'Choir Polyphony (Waimbaji Altareni)',
      url: choirSingingPhoto
    }
  ];

  const handleOpenAdd = () => {
    setEditingAlbum(null);
    setFormTitle('');
    setFormYear(new Date().getFullYear());
    setFormTrackCount(4);
    setFormCoverImage('');
    setFormPriceKes(500);
    setFormDescription('Master studio recording collection from St. Monica Third Mass Choir, Nakuru.');
    setFormDescriptionSw('Mkusanyiko rasmi wa nyimbo za kiliturujia kutoka Kwaya ya Mtakatifu Monika Nakuru.');
    setFormYoutubeUrl('https://www.youtube.com/@KwayayaMtakatifuMonicaSection5');
    setFormSongsText(songs.map(s => s.title).join('\n'));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (album: Album) => {
    setEditingAlbum(album);
    setFormTitle(album.title);
    setFormYear(album.releaseYear);
    setFormTrackCount(album.trackCount);
    setFormCoverImage(album.coverImage || '');
    setFormPriceKes(album.priceKes);
    setFormDescription(album.description);
    setFormDescriptionSw(album.descriptionSw);
    setFormYoutubeUrl(album.youtubePlaylistUrl || '');
    setFormSongsText(album.songs ? album.songs.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert(lang === 'sw' ? 'Weka jina la albamu' : 'Please provide album title');
      return;
    }

    const songsArray = formSongsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload: Omit<Album, 'id'> = {
      title: formTitle.trim(),
      releaseYear: Number(formYear) || 2024,
      trackCount: songsArray.length || Number(formTrackCount) || 1,
      coverImage: formCoverImage.trim() || 'choir_singing_moment',
      priceKes: Number(formPriceKes) || 500,
      description: formDescription.trim(),
      descriptionSw: formDescriptionSw.trim() || formDescription.trim(),
      youtubePlaylistUrl: formYoutubeUrl.trim() || undefined,
      songs: songsArray
    };

    if (editingAlbum) {
      updateAlbum(editingAlbum.id, payload);
      onNotify(lang === 'sw' ? `Albamu "${formTitle}" imesasishwa!` : `Album "${formTitle}" updated!`);
    } else {
      addAlbum(payload);
      onNotify(lang === 'sw' ? `Albamu mpya "${formTitle}" imeongezwa!` : `New album "${formTitle}" added!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (album: Album) => {
    if (confirm(lang === 'sw' ? `Je, una uhakika wa kufuta albamu "${album.title}"?` : `Are you sure you want to delete album "${album.title}"?`)) {
      deleteAlbum(album.id);
      onNotify(lang === 'sw' ? `Albamu "${album.title}" imefutwa.` : `Album "${album.title}" deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-[#0C2340]/10 shadow-sm overflow-hidden">
        <AfricanGeometricBorder />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0C2340]/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF4FB] text-[#1058A8] border border-[#7EC8F0]/40">
                  {lang === 'sw' ? 'Albamu na Rekodi za Studio' : 'Official Albums & Discography'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {albums.length} {albums.length === 1 ? 'Album' : 'Albums'} in Catalog
                </span>
              </div>
              <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold text-[#0C2340] mt-1">
                {lang === 'sw' ? 'Usimamizi wa Albamu za Kwaya' : 'Choir Albums & Track Content'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-source mt-1 max-w-2xl">
                {lang === 'sw'
                  ? 'Weka picha za jalada la albamu, idadi ya nyimbo, maelezo ya Kiswahili na Kiingereza, na viungo vya YouTube vinavyoonekana kwenye ukurasa wa "Albamu Yetu".'
                  : 'Manage album titles, release years, cover artwork, tracklists, and YouTube playlist links that display on the public "Our Albums" view.'}
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-[#1058A8] hover:bg-[#0C2340] text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'sw' ? 'Ongeza Albamu Mpya' : 'Add New Album'}</span>
            </button>
          </div>

          {/* Albums List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {albums.map((album) => {
              const coverSrc = album.coverImage && (album.coverImage.startsWith('http') || album.coverImage.startsWith('data:'))
                ? album.coverImage
                : choirCoverImg;

              return (
                <div 
                  key={album.id}
                  className="bg-[#FAF8F5] border border-[#0C2340]/10 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-[#0C2340]/10 shadow-xs">
                      <img
                        src={coverSrc}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#1058A8]/10 text-[#1058A8]">
                          {album.releaseYear}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {album.trackCount} {lang === 'sw' ? 'Nyimbo' : 'Tracks'}
                        </span>
                      </div>

                      <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340] truncate">
                        {album.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 font-source">
                        {lang === 'sw' ? album.descriptionSw : album.description}
                      </p>

                      {album.youtubePlaylistUrl && (
                        <a
                          href={album.youtubePlaylistUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1058A8] hover:underline"
                        >
                          <span>YouTube Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Tracklist Preview */}
                  {album.songs && album.songs.length > 0 && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs font-source space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Tracklist ({album.songs.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {album.songs.map((songTitle, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {i + 1}. {songTitle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(album)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#1058A8] text-xs font-semibold text-[#0C2340] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#1058A8]" />
                      <span>Edit Album</span>
                    </button>
                    {albums.length > 1 && (
                      <button
                        onClick={() => handleDelete(album)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-xs font-semibold text-rose-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Album Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0C2340]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#0C2340]/10">
              <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
                {editingAlbum ? 'Edit Album Details' : 'Add New Album'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-source">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-[#0C2340] mb-1">Album Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. Nyimbo za Kiliturujia Vol. 2"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Release Year</label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={e => setFormYear(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0C2340] mb-1">Track Count</label>
                  <input
                    type="number"
                    value={formTrackCount}
                    onChange={e => setFormTrackCount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                  />
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="Album Cover Artwork"
                  labelSw="Picha ya Jalada la Albamu"
                  value={formCoverImage}
                  onChange={setFormCoverImage}
                  helpText="Upload album artwork (square 1:1 ratio) or select from official choir presets."
                  presets={albumPresets}
                  aspectRatio="aspect-square"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Album Description (English)</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Master studio recording collection from St. Monica Choir..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Album Description (Kiswahili)</label>
                <textarea
                  rows={2}
                  value={formDescriptionSw}
                  onChange={e => setFormDescriptionSw(e.target.value)}
                  placeholder="Mkusanyiko rasmi wa nyimbo za kiliturujia..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">Tracklist Songs (1 song per line)</label>
                <textarea
                  rows={4}
                  value={formSongsText}
                  onChange={e => setFormSongsText(e.target.value)}
                  placeholder="Machozi ya Imani&#10;Maisha ya Mwanadamu&#10;Ni Mzima&#10;Jumuiya Ndogondogo"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0C2340] mb-1">YouTube Playlist or Video URL</label>
                <input
                  type="url"
                  value={formYoutubeUrl}
                  onChange={e => setFormYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/@KwayayaMtakatifuMonicaSection5"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-[#1058A8] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1058A8] hover:bg-[#0C2340] rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingAlbum ? 'Update Album' : 'Save Album'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
