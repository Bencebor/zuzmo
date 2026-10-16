import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Tag, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ServiceItem } from '../../types';

export const ServicesView: React.FC = () => {
  const { token } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create modal state
  const [activeItem, setActiveItem] = useState<Partial<ServiceItem> | null>(null);
  const [isCreate, setIsCreate] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setServices(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreate = () => {
    setIsCreate(true);
    setActiveItem({
      title: '',
      description: '',
      icon: 'Sparkles',
      isIncluded: true,
      extraPrice: 0,
      category: 'wellness',
      active: true
    });
  };

  const openEdit = (item: ServiceItem) => {
    setIsCreate(false);
    setActiveItem({ ...item });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    try {
      if (isCreate) {
        const res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(activeItem)
        });
        if (res.ok) {
          setActiveItem(null);
          fetchServices();
        }
      } else if (activeItem.id) {
        const res = await fetch(`/api/admin/services/${activeItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(activeItem)
        });
        if (res.ok) {
          setActiveItem(null);
          fetchServices();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt a szolgáltatást?')) return;
    try {
      await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#0f241a]">Szolgáltatások & Extrák</h2>
          <p className="text-xs text-stone-500">
            Wellness eszközök, bekészítések, extra opciók és kényelmi felszereltség kezelése
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-[#c5a880]" />
          <span>Új Szolgáltatás Hozzáadása</span>
        </button>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md">
                  Ikon: {item.icon}
                </span>
                {item.isIncluded ? (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Az árban
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    +{item.extraPrice?.toLocaleString('hu-HU')} Ft
                  </span>
                )}
              </div>

              <h3 className="font-serif font-bold text-lg text-[#0f241a]">{item.title}</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.description}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400 capitalize">{item.category}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 text-stone-600 hover:text-[#1b4332] hover:bg-stone-100 rounded-lg cursor-pointer"
                  title="Szerkesztés"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                  title="Törlés"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-serif font-bold text-[#0f241a] mb-1">
              {isCreate ? 'Új Szolgáltatás Rögzítése' : 'Szolgáltatás Módosítása'}
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Megjelenik a nyilvános oldalon és bejelölhető a foglalási folyamatban
            </p>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Megnevezés *
                </label>
                <input
                  type="text"
                  required
                  value={activeItem.title || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Leírás *
                </label>
                <textarea
                  rows={2}
                  required
                  value={activeItem.description || ''}
                  onChange={(e) => setActiveItem({ ...activeItem, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Kategória
                  </label>
                  <select
                    value={activeItem.category || 'wellness'}
                    onChange={(e) =>
                      setActiveItem({ ...activeItem, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none"
                  >
                    <option value="wellness">Wellness</option>
                    <option value="gasztronomia">Gasztronómia</option>
                    <option value="kenyelem">Kényelem</option>
                    <option value="aktiv">Aktív erdei</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Ikon Típus
                  </label>
                  <select
                    value={activeItem.icon || 'Sparkles'}
                    onChange={(e) => setActiveItem({ ...activeItem, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none"
                  >
                    <option value="Bath">Bath (Dézsa / Fürdő)</option>
                    <option value="Flame">Flame (Szauna / Kandalló)</option>
                    <option value="Coffee">Coffee (Reggeli / Kávé)</option>
                    <option value="Heart">Heart (Romantika)</option>
                    <option value="Car">Car (Parkoló)</option>
                    <option value="Sparkles">Sparkles (Grillező / Prémium)</option>
                    <option value="Wifi">Wifi (Internet)</option>
                    <option value="Compass">Compass (Túra / Kerékpár)</option>
                  </select>
                </div>
              </div>

              {/* Included vs Extra */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={activeItem.isIncluded || false}
                    onChange={(e) => setActiveItem({ ...activeItem, isIncluded: e.target.checked })}
                    className="w-4 h-4 text-[#1b4332] rounded focus:ring-0"
                  />
                  <span>Benne van a szállás alapárában (ingyenes a vendégeknek)</span>
                </label>

                {!activeItem.isIncluded && (
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Külön fizetendő felár (Ft)
                    </label>
                    <input
                      type="number"
                      value={activeItem.extraPrice || 0}
                      onChange={(e) =>
                        setActiveItem({
                          ...activeItem,
                          extraPrice: parseInt(e.target.value, 10)
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Szolgáltatás Mentése
                </button>
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
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
