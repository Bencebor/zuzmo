import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Room } from '../../types';

export const RoomsView: React.FC = () => {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create Modal state
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formState, setFormState] = useState<Partial<Room>>({});
  const [amenityInput, setAmenityInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/admin/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setRooms(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openEdit = (room: Room) => {
    setIsCreateMode(false);
    setEditingRoom(room);
    setFormState({ ...room });
  };

  const openCreate = () => {
    setIsCreateMode(true);
    setEditingRoom(null);
    setFormState({
      name: '',
      tagline: '',
      description: '',
      capacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      sizeM2: 50,
      basePricePerNight: 50000,
      weekendPricePerNight: 60000,
      minNights: 2,
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: ['Privát dézsafürdő', 'Panoráma szauna', 'Nespresso kávégép', 'Starlink Wi-Fi'],
      featured: false,
      active: true
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isCreateMode) {
        const res = await fetch('/api/admin/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formState)
        });
        if (res.ok) {
          setEditingRoom(null);
          setIsCreateMode(false);
          fetchRooms();
        }
      } else if (editingRoom) {
        const res = await fetch(`/api/admin/rooms/${editingRoom.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formState)
        });
        if (res.ok) {
          setEditingRoom(null);
          fetchRooms();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Biztosan törölni (archiválni) szeretnéd ezt a szállásegységet?')) return;
    try {
      await fetch(`/api/admin/rooms/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRooms();
    } catch (e) {
      console.error(e);
    }
  };

  const addAmenity = () => {
    if (!amenityInput.trim()) return;
    const current = formState.amenities || [];
    setFormState({ ...formState, amenities: [...current, amenityInput.trim()] });
    setAmenityInput('');
  };

  const removeAmenity = (index: number) => {
    const current = [...(formState.amenities || [])];
    current.splice(index, 1);
    setFormState({ ...formState, amenities: current });
  };

  const addImage = () => {
    if (!imageInput.trim()) return;
    const current = formState.images || [];
    setFormState({ ...formState, images: [...current, imageInput.trim()] });
    setImageInput('');
  };

  const removeImage = (index: number) => {
    const current = [...(formState.images || [])];
    current.splice(index, 1);
    setFormState({ ...formState, images: current });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#0f241a]">Szállásegységek & Árak</h2>
          <p className="text-xs text-stone-500">
            Faházak, lakosztályok, éjszakánkénti és hétvégi árak, minimum tartózkodás beállítása
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-[#c5a880]" />
          <span>Új Szállásegység Létrehozása</span>
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`bg-white rounded-3xl border overflow-hidden shadow-sm flex flex-col justify-between ${
              room.active ? 'border-stone-200' : 'border-stone-300 opacity-60'
            }`}
          >
            <div>
              <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                <img
                  src={room.images[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                {!room.active && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
                    Inaktív / Archivált
                  </div>
                )}
                {room.featured && (
                  <span className="absolute top-3 left-3 bg-[#c5a880] text-[#0f241a] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Kiemelt
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-serif font-bold text-lg text-[#0f241a]">{room.name}</h3>
                <p className="text-xs text-[#c5a880] font-medium mt-0.5">{room.tagline}</p>

                <div className="mt-3 flex items-center gap-3 text-xs text-stone-500 pb-3 border-b border-stone-100">
                  <span>Max. {room.capacity} fő</span>
                  <span>•</span>
                  <span>{room.bedrooms} háló</span>
                  <span>•</span>
                  <span>{room.sizeM2} m²</span>
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Hétköznap:</span>
                    <strong className="text-[#0f241a]">
                      {room.basePricePerNight.toLocaleString('hu-HU')} Ft / éj
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Hétvégén (P-Szo):</span>
                    <strong className="text-[#0f241a]">
                      {room.weekendPricePerNight.toLocaleString('hu-HU')} Ft / éj
                    </strong>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Min. tartózkodás:</span>
                    <span>{room.minNights} éjszaka</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => openEdit(room)}
                className="text-xs font-bold text-[#1b4332] hover:text-[#2d6a4f] flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Szerkesztés</span>
              </button>

              <button
                onClick={() => handleDelete(room.id)}
                className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Inaktiválás</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {(editingRoom || isCreateMode) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => {
                setEditingRoom(null);
                setIsCreateMode(false);
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-[#0f241a] mb-1">
              {isCreateMode ? 'Új Szállásegység Létrehozása' : `Szerkesztés: ${editingRoom?.name}`}
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              A módosítások azonnal életbe lépnek a nyilvános weboldalon és a foglalási kalkulátorban.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Ház / Szoba Neve *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name || ''}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#1b4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Rövid Alcím (Tagline)
                  </label>
                  <input
                    type="text"
                    value={formState.tagline || ''}
                    onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#1b4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Részletes Leírás
                </label>
                <textarea
                  rows={3}
                  value={formState.description || ''}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              {/* Pricing row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Hétköznapi Ár (Ft/éj) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formState.basePricePerNight || 0}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        basePricePerNight: parseInt(e.target.value, 10)
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Hétvégi Ár (Ft/éj) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formState.weekendPricePerNight || 0}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        weekendPricePerNight: parseInt(e.target.value, 10)
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Min. Éjszaka *
                  </label>
                  <input
                    type="number"
                    required
                    value={formState.minNights || 2}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        minNights: parseInt(e.target.value, 10)
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Capacities */}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                    Max Fő
                  </label>
                  <input
                    type="number"
                    value={formState.capacity || 2}
                    onChange={(e) =>
                      setFormState({ ...formState, capacity: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                    Hálók
                  </label>
                  <input
                    type="number"
                    value={formState.bedrooms || 1}
                    onChange={(e) =>
                      setFormState({ ...formState, bedrooms: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                    Fürdők
                  </label>
                  <input
                    type="number"
                    value={formState.bathrooms || 1}
                    onChange={(e) =>
                      setFormState({ ...formState, bathrooms: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                    Méret (m²)
                  </label>
                  <input
                    type="number"
                    value={formState.sizeM2 || 50}
                    onChange={(e) =>
                      setFormState({ ...formState, sizeM2: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Images list */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Képek URL-jei
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Hozzáadás
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {(formState.images || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border">
                      <img src={img} alt="Szoba fotó" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities tags */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Felszereltség & Jellemzők
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="pl. Nespresso kávégép, Kandalló..."
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Hozzáadás
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(formState.amenities || []).map((am, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-full text-stone-700"
                    >
                      {am}
                      <button
                        type="button"
                        onClick={() => removeAmenity(idx)}
                        className="text-stone-400 hover:text-stone-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formState.featured || false}
                    onChange={(e) => setFormState({ ...formState, featured: e.target.checked })}
                    className="w-4 h-4 text-[#1b4332] rounded focus:ring-0"
                  />
                  <span>Kiemelt szoba (Legnépszerűbb plecsni)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formState.active !== false}
                    onChange={(e) => setFormState({ ...formState, active: e.target.checked })}
                    className="w-4 h-4 text-[#1b4332] rounded focus:ring-0"
                  />
                  <span>Aktív (Látható a weboldalon)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Szállásegység Mentése
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingRoom(null);
                    setIsCreateMode(false);
                  }}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-5 py-3 rounded-xl font-bold text-xs cursor-pointer"
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
