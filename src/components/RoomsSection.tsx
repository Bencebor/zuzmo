import React, { useState } from 'react';
import { Users, Bed, Bath, Sparkles, Check, ArrowRight, Eye, X, Home, Trees, UtensilsCrossed } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { HouseSpace } from '../types';

export const RoomsSection: React.FC = () => {
  const { houseSpaces, rooms, openBookingModal } = useSiteData();
  const [activeImageIndex, setActiveImageIndex] = useState<{ [spaceId: string]: number }>({});
  const [detailModalSpace, setDetailModalSpace] = useState<HouseSpace | null>(null);

  const setImage = (spaceId: string, index: number) => {
    setActiveImageIndex((prev) => ({ ...prev, [spaceId]: index }));
  };

  const cabin = rooms[0];

  return (
    <section id="helyisegek" className="py-24 bg-[#f4efea] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-3">
            <span>A Vendégház Elrendezése</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f241a]">
            Ismerd Meg a Zuzmo Kabin Helyiségeit
          </h2>
          <p className="mt-4 text-stone-600 text-base sm:text-lg">
            A ház egyetlen, teljesen önálló egységként bérelhető ki akár 6 fő számára. Tágas nappali, két külön hálószoba, rusztikus fürdőszoba és privát pezsgőfürdős kerthelyiség vár.
          </p>
        </div>

        {/* Spaces Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {houseSpaces.map((space) => {
            const currentImgIdx = activeImageIndex[space.id] || 0;
            const currentImg = space.images[currentImgIdx] || space.images[0];

            return (
              <div
                key={space.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 flex flex-col group hover:shadow-2xl transition-all duration-300"
              >
                {/* Image Section with Thumbnails */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={currentImg}
                    alt={space.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />

                  {/* Quick Detail View Button */}
                  <button
                    onClick={() => setDetailModalSpace(space)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                    title="Részletek és fotók"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Thumbnail Dots */}
                  {space.images.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                      {space.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImage(space.id, i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                            i === currentImgIdx ? 'bg-white w-6' : 'bg-white/60 hover:bg-white'
                          }`}
                          aria-label={`Kép ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#c5a880] uppercase tracking-wider block">
                      {space.subtitle}
                    </span>

                    <h3 className="text-xl font-serif font-bold text-[#0f241a] mt-1 group-hover:text-[#1b4332] transition-colors">
                      {space.name}
                    </h3>

                    <p className="text-stone-600 text-xs sm:text-sm mt-2.5 line-clamp-3 leading-relaxed font-light">
                      {space.description}
                    </p>

                    {/* Beds and Features snippet */}
                    <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#1b4332]">
                        <Bed className="w-3.5 h-3.5 shrink-0" />
                        <span>{space.bedsInfo}</span>
                      </div>
                      {space.features.slice(0, 2).map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-500">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => setDetailModalSpace(space)}
                      className="text-xs font-bold text-[#1b4332] hover:text-[#2d6a4f] flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Részletek & Fotók</span>
                    </button>

                    <button
                      onClick={() => openBookingModal()}
                      className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-3.5 py-2 rounded-xl font-medium text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Ház Foglalása</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full House Booking Highlight Banner */}
        <div className="mt-16 bg-[#0f241a] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#2d6a4f]/50 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-mono text-[#c5a880] tracking-widest uppercase block">
              Zuzmo Kabin Vendégház • Nagymaros
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              A teljes ház és privát kerthelyiség kizárólag a tiétek
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl font-light">
              Nincs más vendég, nincsenek közös terek. Két hálószoba, tágas nappali konyhával, meleg vizes fürdőszoba és egész évben használható privát pezsgőfürdő vár, akár 6 vendég számára.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="text-center sm:text-right">
              <span className="text-xs text-stone-400 block">Ház alapára</span>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#c5a880]">
                {cabin?.basePricePerNight?.toLocaleString('hu-HU') || '52 000'}{' '}
                <span className="text-xs font-sans font-normal text-stone-300">Ft / éj</span>
              </div>
              <span className="text-[11px] text-stone-400 block">
                Hétvégén: {cabin?.weekendPricePerNight?.toLocaleString('hu-HU') || '62 000'} Ft • min. {cabin?.minNights || 2} éj
              </span>
            </div>

            <button
              onClick={() => openBookingModal()}
              className="bg-[#c5a880] hover:bg-[#d4af37] text-[#0f241a] px-8 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              Teljes Ház Lefoglalása
            </button>
          </div>
        </div>
      </div>

      {/* Space Detail Modal */}
      {detailModalSpace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="relative aspect-[16/9] overflow-hidden bg-stone-900">
              <img
                src={detailModalSpace.images[0]}
                alt={detailModalSpace.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setDetailModalSpace(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full bg-[#c5a880] text-[#0f241a] text-xs font-bold">
                  {detailModalSpace.subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold mt-2 drop-shadow-md">
                  {detailModalSpace.name}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#0f241a] mb-2">A Helyiségről</h4>
                <p className="text-stone-600 leading-relaxed text-sm">{detailModalSpace.description}</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Fekhelyek & Elhelyezés
                </span>
                <div className="text-sm font-serif font-bold text-[#1b4332]">
                  {detailModalSpace.bedsInfo}
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-lg text-[#0f241a] mb-3">Felszereltség</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {detailModalSpace.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-800" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {detailModalSpace.images.length > 1 && (
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#0f241a] mb-3">További Fotók</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {detailModalSpace.images.map((img, i) => (
                      <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                        <img
                          src={img}
                          alt="Fotó"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => {
                    setDetailModalSpace(null);
                    openBookingModal();
                  }}
                  className="bg-[#c5a880] hover:bg-[#d4af37] text-[#0f241a] px-8 py-3.5 rounded-xl font-bold shadow-lg transition-colors cursor-pointer text-sm"
                >
                  Teljes Ház Foglalása
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
