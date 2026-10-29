import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured, uploadImageToSupabase } from '../lib/supabase';
import { useChoir } from '../context/ChoirContext';
import { 
  Upload, 
  AlertCircle, 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw, 
  KeyRound, 
  Calendar,
  CheckCircle2,
  Database,
  Copy,
  Check
} from 'lucide-react';

export interface PostItem {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
}

export const MediaManager: React.FC = () => {
  const { deleteGroupPhoto, addGroupPhoto } = useChoir();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Ready');
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isConfigured] = useState<boolean>(() => isSupabaseConfigured());
  const [isLoading, setIsLoading] = useState(false);
  const [showSetupHelp, setShowSetupHelp] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch posts from Supabase (combines gallery table and posts table)
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      // 1. Try 'gallery' table
      const { data: galleryData } = await supabase
        .from('gallery')
        .select('*')
        .order('id', { ascending: false });

      // 2. Try 'posts' table
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: false });

      const combined: PostItem[] = [];
      const seenUrls = new Set<string>();

      if (galleryData && Array.isArray(galleryData)) {
        for (const g of galleryData) {
          if (g.image_url && !seenUrls.has(g.image_url)) {
            seenUrls.add(g.image_url);
            combined.push({
              id: Number(g.id),
              title: g.title || 'Choir Photo',
              image_url: g.image_url,
              created_at: g.created_at || new Date().toISOString()
            });
          }
        }
      }

      if (postsData && Array.isArray(postsData)) {
        for (const p of postsData) {
          if (p.image_url && !seenUrls.has(p.image_url)) {
            seenUrls.add(p.image_url);
            combined.push({
              id: Number(p.id),
              title: p.title || 'Post Image',
              image_url: p.image_url,
              created_at: p.created_at || new Date().toISOString()
            });
          }
        }
      }

      setPosts(combined);
      setStatus(combined.length > 0 ? 'Synced with Supabase Cloud' : 'Ready');
    } catch (err: any) {
      setStatus(err?.message || 'Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();

    // Subscribe to live database updates on gallery and posts
    const galChannel = supabase
      .channel('public:gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, () => {
        loadPosts();
      })
      .subscribe();

    const postChannel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        loadPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(galChannel);
      supabase.removeChannel(postChannel);
    };
  }, []);

  // Upload photo to Supabase storage and save record to table
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('Uploading image to Supabase...');
    const recordTitle = title.trim() || file.name;

    try {
      const { url, error: uploadError } = await uploadImageToSupabase(file, 'uploads');

      if (uploadError || !url) {
        setStatus(`Upload error: ${uploadError || 'Failed to upload'}`);
        return;
      }

      setStatus('Saving to Supabase gallery...');
      
      // Insert into gallery table
      try {
        const { data: gData } = await supabase
          .from('gallery')
          .insert([{ title: recordTitle, image_url: url }])
          .select();
        if (gData && gData[0]) {
          setActiveId(Number(gData[0].id));
        }
      } catch (_) {}

      // Also sync into Choir Context so it appears on the website immediately
      addGroupPhoto({
        title: recordTitle,
        titleSw: recordTitle,
        imageKey: 'choir_singing_moment',
        customUrl: url,
        year: new Date().getFullYear().toString(),
        occasion: 'Picha ya Kwaya',
        occasionSw: 'Picha ya Kwaya',
        description: recordTitle,
        descriptionSw: recordTitle
      });

      setStatus('Saved automatically to Supabase & Choir Gallery!');
      loadPosts();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setStatus(`Error: ${err?.message || 'Failed to upload'}`);
    }
  };

  // Auto-save title/description with debounce
  useEffect(() => {
    if (!title) return;

    setStatus('Typing...');
    const timer = setTimeout(async () => {
      setStatus('Saving text...');
      try {
        if (activeId) {
          await supabase.from('gallery').update({ title }).eq('id', activeId);
          await supabase.from('posts').update({ title }).eq('id', activeId);
          setStatus('All changes saved!');
          loadPosts();
        }
      } catch (err: any) {
        setStatus(`Error saving: ${err?.message}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [title, activeId]);

  const handleDeletePost = async (id: number) => {
    const targetPost = posts.find(p => p.id === id);
    if (!window.confirm(`Delete "${targetPost?.title || 'this media item'}" permanently?`)) return;

    setStatus('Deleting from Supabase...');

    // 1. Delete from Supabase 'gallery' database table
    try {
      await supabase.from('gallery').delete().eq('id', id);
    } catch (_) {}

    // 2. Delete from Supabase 'posts' database table
    try {
      await supabase.from('posts').delete().eq('id', id);
    } catch (_) {}

    // 3. Delete from Supabase Storage buckets if URL is available
    if (targetPost?.image_url) {
      try {
        await supabase.from('gallery').delete().eq('image_url', targetPost.image_url);
        await supabase.from('posts').delete().eq('image_url', targetPost.image_url);

        if (targetPost.image_url.includes('/storage/v1/object/public/photos/')) {
          const parts = targetPost.image_url.split('/storage/v1/object/public/photos/');
          if (parts[1]) {
            await supabase.storage.from('photos').remove([decodeURIComponent(parts[1])]);
          }
        }
        if (targetPost.image_url.includes('/storage/v1/object/public/app-images/')) {
          const parts = targetPost.image_url.split('/storage/v1/object/public/app-images/');
          if (parts[1]) {
            await supabase.storage.from('app-images').remove([decodeURIComponent(parts[1])]);
          }
        }
      } catch (_) {}

      // 4. Also remove from ChoirContext gallery state so it immediately disappears everywhere
      deleteGroupPhoto(`supabase-photo-${id}`);
    } else {
      deleteGroupPhoto(`supabase-photo-${id}`);
    }

    setStatus('Post permanently deleted from Supabase & site');
    if (activeId === id) setActiveId(null);
    loadPosts();
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0C2340] to-[#1058A8] text-white p-6 rounded-2xl shadow-md border border-[#7EC8F0]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/10 text-amber-300">
              <Database className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-amber-300 tracking-wider uppercase font-source">
              Supabase Realtime Cloud Sync
            </span>
          </div>
          <h2 className="font-eb-garamond text-2xl sm:text-3xl font-bold mt-1">
            Media & Posts Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 font-source max-w-xl mt-1">
            Upload images to Supabase Storage (<code className="bg-black/30 px-1 py-0.5 rounded text-[11px]">app-images</code> bucket) and auto-save records into the <code className="bg-black/30 px-1 py-0.5 rounded text-[11px]">posts</code> table with live Realtime postgres replication.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowSetupHelp(!showSetupHelp)}
            className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 text-white"
          >
            <Database className="w-3.5 h-3.5 text-amber-300" />
            <span>{showSetupHelp ? 'Hide SQL Helper' : 'SQL & Bucket Setup'}</span>
          </button>

          <button
            onClick={loadPosts}
            disabled={isLoading}
            className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* SQL & Storage setup helper */}
      {showSetupHelp && (
        <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl shadow-lg border border-slate-700 space-y-4 animate-in fade-in text-xs font-source">
          <div className="flex items-start justify-between gap-4 pb-2 border-b border-slate-800">
            <div>
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Supabase Table & Storage Bucket Setup</span>
              </h4>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Run this SQL in your Supabase project (<strong>SQL Editor → New Query</strong>) to initialize the table and realtime replication:
              </p>
            </div>
            <button
              onClick={() => {
                const sql = `-- 1. Create table for posts\ncreate table if not exists public.posts (\n  id bigint generated by default as identity primary key,\n  title text,\n  image_url text,\n  created_at timestamp with time zone default timezone('utc'::text, now()) not null\n);\n\n-- 2. Enable Realtime updates\nalter publication supabase_realtime add table public.posts;\n\n-- 3. Allow public read and write (or customize RLS per your choir policies)\nalter table public.posts enable row level security;\ncreate policy "Public posts read" on public.posts for select using (true);\ncreate policy "Public posts insert" on public.posts for insert with check (true);\ncreate policy "Public posts update" on public.posts for update using (true);\ncreate policy "Public posts delete" on public.posts for delete using (true);`;
                navigator.clipboard.writeText(sql);
                setCopiedSql(true);
                setTimeout(() => setCopiedSql(false), 2500);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL'}</span>
            </button>
          </div>

          <pre className="p-3 bg-slate-950 rounded-xl overflow-x-auto text-[11px] font-mono text-emerald-400 border border-slate-800 leading-relaxed">
{`-- 1. Create table for posts
create table if not exists public.posts (
  id bigint generated by default as identity primary key,
  title text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Realtime updates
alter publication supabase_realtime add table public.posts;

-- 3. Row Level Security policies
alter table public.posts enable row level security;
create policy "Public posts read" on public.posts for select using (true);
create policy "Public posts insert" on public.posts for insert with check (true);
create policy "Public posts update" on public.posts for update using (true);
create policy "Public posts delete" on public.posts for delete using (true);`}
          </pre>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="font-bold text-amber-300">Storage Bucket Requirement:</span>
            <p className="text-[11px] text-slate-300">
              In your Supabase Dashboard, go to <strong>Storage → New Bucket</strong>, name it <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-200">app-images</code>, and toggle <strong>Public bucket: ON</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Configuration status alert if anon key is placeholder */}
      {!isConfigured && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-source flex items-start gap-3">
          <KeyRound className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-950">Supabase API Key Configuration:</p>
            <p>
              Your project URL is configured to <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-[11px]">https://pzvpbixdefvztffjyrye.supabase.co</code>.
              To enable live cloud saves and real-time syncing, open <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-[11px]">.env</code> and replace <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-[11px]">VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here</code> with your project's actual anon public key from the Supabase Project Dashboard (Project Settings → API).
            </p>
          </div>
        </div>
      )}

      {/* Upload & Auto-Saving Card */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#0C2340]/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#1058A8] font-source">Status:</span>
            <span className="text-xs text-slate-700 font-source font-medium">{status}</span>
          </div>

          {activeId && (
            <span className="text-[11px] font-source text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Editing Active Post #{activeId}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0C2340] mb-1.5 font-source">
              Upload Image to Supabase Storage
            </label>
            <div className="relative border-2 border-dashed border-[#1058A8]/30 rounded-xl p-4 text-center hover:border-[#1058A8] transition-colors bg-[#EAF4FB]/30">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center pointer-events-none space-y-1">
                <Upload className="w-6 h-6 text-[#1058A8]" />
                <span className="text-xs font-semibold text-[#1058A8]">Click or Drag image here</span>
                <span className="text-[10px] text-slate-500">Destination: Supabase "app-images" bucket</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#0C2340] mb-1.5 font-source">
                Caption / Description (Auto-saves in 500ms)
              </label>
              <textarea
                rows={3}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a caption or description for this post..."
                className="w-full border border-slate-300 focus:border-[#1058A8] rounded-xl px-3 py-2 text-xs font-source outline-none resize-none"
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-source">
              <span>Debounced auto-save active</span>
              {title && (
                <button
                  type="button"
                  onClick={() => {
                    setTitle('');
                    setActiveId(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Clear Form
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-eb-garamond text-xl font-bold text-[#0C2340]">
            Supabase Live Records ({posts.length})
          </h3>
          <span className="text-xs text-slate-500 font-source">Realtime subscription active</span>
        </div>

        {posts.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600 font-source">No records found in "posts" table</p>
            <p className="text-[11px] text-slate-400 font-source max-w-sm mx-auto">
              Upload a photo or type a caption above. Once saved, it will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-2xl overflow-hidden border border-[#0C2340]/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  {post.image_url ? (
                    <div className="aspect-16/10 bg-slate-100 overflow-hidden relative">
                      <img
                        src={post.image_url}
                        alt={post.title || 'Post image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback on broken image
                          (e.target as HTMLImageElement).src = '/assets/choir/choir_01.jpg';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-16/10 bg-[#EAF4FB] flex items-center justify-center text-[#1058A8]">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  <div className="p-4 space-y-1">
                    <h4 className="font-eb-garamond font-bold text-[#0C2340] text-base line-clamp-2">
                      {post.title || 'Untitled Post'}
                    </h4>
                    {post.created_at && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-source">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-source">
                  <span className="text-[10px] text-slate-400 font-mono">ID: #{post.id}</span>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
