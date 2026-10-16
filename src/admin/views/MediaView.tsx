import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Video, Image as ImageIcon, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MediaItem } from '../../types';

export const MediaView: React.FC = () => {
  const { token } = useAuth();
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New media modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<{
    title: string;
    url: string;
    category: 'kulso' | 'wellness' | 'szobak' | 'hangulat';
    type: 'image' | 'video';
    thumbnail?: string;
  }>({
    title: '',
    url: '',
    category: 'kulso',
    type: 'image',
    thumbnail: ''
  });

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/admin/gallery', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setGallery(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewItem({
          title: '',
          url: '',
          category: 'kulso',
          type: 'image',
          thumbnail: ''
        });
        fetchGallery();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt a médiaelemet?')) return;
    try {
      await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGallery();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#0f241a]">Fotó- & Videógaléria</h2>
          <p className="text-xs text-stone-500">
            Nagy felbontású vendégház képek feltöltése, kategóriák és beágyazott bemutató videók
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-[#c5a880]" />
          <span>Új Média Elem Hozzáadása</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between group"
          >
            <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
              <img
                src={item.type === 'video' ? item.thumbnail || item.url : item.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 flex gap-1">
                <span className="bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  {item.type === 'video' ? <Video className="w-3 h-3 text-[#c5a880]" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                  {item.category}
                </span>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer"
                title="Törlés"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5">
              <h4 className="font-serif font-bold text-xs text-[#0f241a] truncate">{item.title}</h4>
              <span className="text-[10px] text-stone-400 capitalize block mt-0.5">
                Típus: {item.type === 'video' ? 'Videó' : 'Fotó'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Media Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-serif font-bold text-[#0f241a] mb-1">
              Új Kép vagy Videó Rögzítése
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Add meg a kép vagy videó közvetlen hivatkozását és kategóriáját.
            </p>

            <form onSubmit={handleAddMedia} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Média Típusa
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewItem({ ...newItem, type: 'image' })}
                    className={`py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      newItem.type === 'image'
                        ? 'bg-[#1b4332] text-white border-[#1b4332]'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    Fotó
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewItem({ ...newItem, type: 'video' })}
                    className={`py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      newItem.type === 'video'
                        ? 'bg-[#1b4332] text-white border-[#1b4332]'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    Videó
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Cím / Leírás
                </label>
                <input
                  type="text"
                  required
                  placeholder="pl. Erdőszéli terasz naplementekor"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Média URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... vagy mp4 link"
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              {newItem.type === 'video' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Videó Előnézeti Kép (Thumbnail URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newItem.thumbnail || ''}
                    onChange={(e) => setNewItem({ ...newItem, thumbnail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Kategória
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none"
                >
                  <option value="kulso">Birtok & Kert (Külső)</option>
                  <option value="wellness">Dézsa & Szauna (Wellness)</option>
                  <option value="szobak">Házak & Belső Tér</option>
                  <option value="hangulat">Erdei Hangulat</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Média Elem Mentése
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Mégse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
