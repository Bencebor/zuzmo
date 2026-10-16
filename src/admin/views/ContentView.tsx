import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Type, Info, Shield, Phone, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SiteContent } from '../../types';

export const ContentView: React.FC = () => {
  const { token } = useAuth();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/site-data');
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return <div className="p-8 text-center text-stone-500">Tartalom betöltése...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#0f241a]">Weboldal Szövegek & Tartalom</h2>
          <p className="text-xs text-stone-500">
            Főoldali címek, bemutatkozó történet, elérhetőségek és házirend feltételek szerkesztése
          </p>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Sikeresen elmentve a weboldalra!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* HERO SECTION */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Sparkles className="w-5 h-5 text-[#c5a880]" />
            <h3 className="font-serif font-bold text-lg text-[#0f241a]">Nyitó Kép & Főoldali Hero</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Felső Értesítési Sáv (Announcement)
            </label>
            <input
              type="text"
              value={content.hero.announcement || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, announcement: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Kiemelt Plecsni Felirat
            </label>
            <input
              type="text"
              value={content.hero.badge || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, badge: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Főcím *
            </label>
            <input
              type="text"
              required
              value={content.hero.title || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, title: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Alcím / Bevezető
            </label>
            <textarea
              rows={2}
              value={content.hero.subtitle || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, subtitle: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Borítókép URL
            </label>
            <input
              type="url"
              value={content.hero.coverImage || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, coverImage: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Info className="w-5 h-5 text-[#c5a880]" />
            <h3 className="font-serif font-bold text-lg text-[#0f241a]">
              A Vendégház Története & Bemutatkozás
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Szekció Címe
            </label>
            <input
              type="text"
              value={content.about.title || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, title: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Alcím
            </label>
            <input
              type="text"
              value={content.about.subtitle || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, subtitle: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Történet 1. Bekezdés
            </label>
            <textarea
              rows={3}
              value={content.about.storyParagraph1 || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, storyParagraph1: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Történet 2. Bekezdés
            </label>
            <textarea
              rows={3}
              value={content.about.storyParagraph2 || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, storyParagraph2: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Történet 3. Bekezdés
            </label>
            <textarea
              rows={3}
              value={content.about.storyParagraph3 || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, storyParagraph3: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* CONTACT & NTAK */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Phone className="w-5 h-5 text-[#c5a880]" />
            <h3 className="font-serif font-bold text-lg text-[#0f241a]">
              Kapcsolat, Cím & Hatósági Adatok
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Telefonszám
              </label>
              <input
                type="text"
                value={content.contact.phone || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, phone: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                E-mail Cím
              </label>
              <input
                type="email"
                value={content.contact.email || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, email: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Pontos Cím
            </label>
            <input
              type="text"
              value={content.contact.address || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, address: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              NTAK Nyilvántartási Szám
            </label>
            <input
              type="text"
              value={content.contact.ntakNumber || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, ntakNumber: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* POLICY & PRICING RULES */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Shield className="w-5 h-5 text-[#c5a880]" />
            <h3 className="font-serif font-bold text-lg text-[#0f241a]">
              Házirend, Előleg & Lemondási Feltételek
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Előleg Mértéke (%)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={content.policy.depositPercentage || 30}
                onChange={(e) =>
                  setContent({
                    ...content,
                    policy: {
                      ...content.policy,
                      depositPercentage: parseInt(e.target.value, 10)
                    }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Díjmentes Lemondás (Nap)
              </label>
              <input
                type="number"
                min={0}
                value={content.policy.cancellationDays || 14}
                onChange={(e) =>
                  setContent({
                    ...content,
                    policy: {
                      ...content.policy,
                      cancellationDays: parseInt(e.target.value, 10)
                    }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                IFA (Ft / fő / éj)
              </label>
              <input
                type="number"
                min={0}
                value={content.policy.touristTaxPerPersonPerNight || 500}
                onChange={(e) =>
                  setContent({
                    ...content,
                    policy: {
                      ...content.policy,
                      touristTaxPerPersonPerNight: parseInt(e.target.value, 10)
                    }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-8 py-3.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#c5a880]" />
            <span>{saving ? 'Mentés folyamatban...' : 'Minden Tartalom Mentése'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
