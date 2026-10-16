import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle, Heart, Quote, X } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const ReviewsSection: React.FC = () => {
  const { reviews, refreshSiteData } = useSiteData();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    rating: 5,
    stayDate: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          roomName: 'Zuzmo Kabin Vendégház'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Hiba történt a vélemény beküldésekor.');
      } else {
        setSubmitSuccess(true);
        refreshSiteData();
        setTimeout(() => {
          setIsSubmitModalOpen(false);
          setSubmitSuccess(false);
          setFormData({
            guestName: '',
            rating: 5,
            stayDate: '',
            comment: ''
          });
        }, 2500);
      }
    } catch {
      setErrorMsg('Hálózati hiba történt.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="velemenyek" className="py-24 bg-[#faf8f5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-3">
              <span>Vendégértékelések</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f241a]">
              Amit a Vendégeink Mondanak
            </h2>
            <p className="mt-3 text-stone-600 text-base sm:text-lg max-w-xl">
              Nálunk töltött emlékezetes pillanatok, valódi vendégek beszámolói a nagymarosi erdőszéli nyugalomról és a privát pezsgőfürdőről.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Rating pill */}
            <div className="bg-white border border-stone-200/90 rounded-2xl px-5 py-3 shadow-md flex items-center gap-4">
              <div className="text-3xl font-serif font-bold text-[#0f241a]">4.98</div>
              <div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">Zuzmo Kabin Vendégház</div>
              </div>
            </div>

            {/* Write review button */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#c5a880]" />
              <span>Vélemény Írása</span>
            </button>
          </div>
        </div>

        {/* Rating Category Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 bg-[#f4efea] p-5 rounded-3xl border border-stone-200">
          <div className="text-center p-2">
            <span className="text-xs text-stone-500 font-medium">Tisztaság & Higiénia</span>
            <div className="text-xl font-serif font-bold text-[#0f241a] mt-1">5.0 / 5.0</div>
            <div className="w-full bg-stone-300 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#1b4332] h-full w-[100%]" />
            </div>
          </div>
          <div className="text-center p-2">
            <span className="text-xs text-stone-500 font-medium">Privát Pezsgőfürdő</span>
            <div className="text-xl font-serif font-bold text-[#0f241a] mt-1">4.98 / 5.0</div>
            <div className="w-full bg-stone-300 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#1b4332] h-full w-[99%]" />
            </div>
          </div>
          <div className="text-center p-2">
            <span className="text-xs text-stone-500 font-medium">Nagymarosi Erdőszél</span>
            <div className="text-xl font-serif font-bold text-[#0f241a] mt-1">5.0 / 5.0</div>
            <div className="w-full bg-stone-300 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#1b4332] h-full w-[100%]" />
            </div>
          </div>
          <div className="text-center p-2">
            <span className="text-xs text-stone-500 font-medium">Önálló Bejutás</span>
            <div className="text-xl font-serif font-bold text-[#0f241a] mt-1">4.97 / 5.0</div>
            <div className="w-full bg-stone-300 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#1b4332] h-full w-[99%]" />
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl border border-stone-200/80 transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#c5a880]/30 group-hover:text-[#c5a880]/60 transition-colors" />
                </div>

                <p className="text-stone-600 text-sm leading-relaxed font-light italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-[#0f241a] text-sm">{rev.guestName}</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {rev.stayDate} • Zuzmo Kabin
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold" title="Ellenőrzött vendég">
                  <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 p-1 rounded-full cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#0f241a]">Köszönjük az értékelést!</h3>
                <p className="text-stone-600 text-sm">
                  Véleményedet sikeresen rögzítettük. Az adminisztrátori moderáció után megjelenik a weboldalon.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-serif font-bold text-[#0f241a] mb-2">
                  Írd meg véleményedet!
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm mb-6">
                  Oszd meg tapasztalataidat a Zuzmo Kabin Vendégházban töltött időről.
                </p>

                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Neved *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="pl. Kiss Péter és családja"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Tartózkodás ideje
                    </label>
                    <input
                      type="text"
                      placeholder="pl. 2026. október"
                      value={formData.stayDate}
                      onChange={(e) => setFormData({ ...formData, stayDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Értékelés (1-5 csillag)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= formData.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Tapasztalataid & Véleményed *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Meséld el, milyen volt a pihenés nálunk..."
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3.5 rounded-xl font-bold shadow-lg transition-colors cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {submitting ? 'Beküldés folyamatban...' : 'Vélemény Elküldése Moderációra'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
