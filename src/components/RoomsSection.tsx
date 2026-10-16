import React, { useState } from 'react';
import { Users, Bed, Bath, Maximize2, Sparkles, Check, ArrowRight, Eye, X } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { Room } from '../types';

export const RoomsSection: React.FC = () => {
  const { rooms, openBookingModal } = useSiteData();
  const [activeImageIndex, setActiveImageIndex] = useState<{ [roomId: string]: number }>({});
  const [detailModalRoom, setDetailModalRoom] = useState<Room | null>(null);

  const setImage = (roomId: string, index: number) => {
    setActiveImageIndex((prev) => ({ ...prev, [roomId]: index }));
  };

  return (
    <section id="szallasegysegek" className="py-24 bg-[#f4efea] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-3">
            <span>Szállásegységek & Lakosztályok</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f241a]">
            Válassz Prémium Erdei Házaink Közül
          </h2>
          <p className="mt-4 text-stone-600 text-base sm:text-lg">
            Minden házunk egyedi tervezésű, közvetlenül a fenyves erdő szélén helyezkedik el, saját privát wellnesszel és teljes diszkrécióval.
          </p>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {rooms.map((room) => {
            const currentImgIdx = activeImageIndex[room.id] || 0;
            const currentImg = room.images[currentImgIdx] || room.images[0];

            return (
              <div
                key={room.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 flex flex-col group hover:shadow-2xl transition-all duration-300"
              >
                {/* Image Section with Thumbnails */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={currentImg}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Featured Badge */}
                  {room.featured && (
                    <div className="absolute top-4 left-4 bg-[#c5a880] text-[#0f241a] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3" />
                      <span>Legnépszerűbb</span>
                    </div>
                  )}

                  {/* Quick Detail View Button */}
                  <button
                    onClick={() => setDetailModalRoom(room)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                    title="Részletek és képek"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Thumbnail Dots */}
                  {room.images.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                      {room.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImage(room.id, i)}
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
                    {/* Key Stats Bar */}
                    <div className="flex items-center gap-4 text-xs font-medium text-stone-500 pb-3 border-b border-stone-100">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-[#1b4332]" />
                        Max. {room.capacity} fő
                      </span>
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4 text-[#1b4332]" />
                        {room.bedrooms} háló
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4 text-[#1b4332]" />
                        {room.bathrooms} fürdő
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-4 h-4 text-[#1b4332]" />
                        {room.sizeM2} m²
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-2xl font-serif font-bold text-[#0f241a] mt-4 group-hover:text-[#1b4332] transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-xs text-[#c5a880] font-medium mt-1 uppercase tracking-wider">
                      {room.tagline}
                    </p>

                    <p className="text-stone-600 text-sm mt-3 line-clamp-2 leading-relaxed">
                      {room.description}
                    </p>

                    {/* Key Amenities Snippet */}
                    <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5">
                      {room.amenities.slice(0, 3).map((amenity, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-600">
                          <Check className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" />
                          <span className="truncate">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-stone-400">Hétköznap</div>
                      <div className="text-xl sm:text-2xl font-serif font-bold text-[#0f241a]">
                        {room.basePricePerNight.toLocaleString('hu-HU')}{' '}
                        <span className="text-xs font-sans font-normal text-stone-500">Ft / éj</span>
                      </div>
                      <div className="text-[11px] text-stone-400">
                        Hétvégén: {room.weekendPricePerNight.toLocaleString('hu-HU')} Ft • min. {room.minNights} éj
                      </div>
                    </div>

                    <button
                      onClick={() => openBookingModal(room.id)}
                      className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      <span>Foglalás</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {detailModalRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            {/* Modal Header with Close */}
            <div className="relative aspect-[16/9] overflow-hidden bg-stone-900">
              <img
                src={detailModalRoom.images[0]}
                alt={detailModalRoom.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setDetailModalRoom(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full bg-[#c5a880] text-[#0f241a] text-xs font-bold">
                  {detailModalRoom.tagline}
                </span>
                <h3 className="text-3xl font-serif font-bold mt-2 drop-shadow-md">
                  {detailModalRoom.name}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="text-center">
                  <div className="text-xs text-stone-400">Kapacitás</div>
                  <div className="text-base font-bold text-[#0f241a]">Max. {detailModalRoom.capacity} fő</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-stone-400">Hálószobák</div>
                  <div className="text-base font-bold text-[#0f241a]">{detailModalRoom.bedrooms} szoba</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-stone-400">Fürdőszobák</div>
                  <div className="text-base font-bold text-[#0f241a]">{detailModalRoom.bathrooms} fürdő</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-stone-400">Alapterület</div>
                  <div className="text-base font-bold text-[#0f241a]">{detailModalRoom.sizeM2} m²</div>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-lg text-[#0f241a] mb-2">A Házról</h4>
                <p className="text-stone-600 leading-relaxed">{detailModalRoom.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-serif font-bold text-lg text-[#0f241a] mb-3">Felszereltség & Kényelem</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {detailModalRoom.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-stone-700">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-800" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos Gallery Inside Modal */}
              {detailModalRoom.images.length > 1 && (
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#0f241a] mb-3">További Fotók</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {detailModalRoom.images.map((img, i) => (
                      <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                        <img src={img} alt="Szoba fotó" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price & CTA */}
              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-stone-500">
                    Hétköznap: <strong className="text-[#0f241a]">{detailModalRoom.basePricePerNight.toLocaleString('hu-HU')} Ft</strong> / éj
                  </div>
                  <div className="text-sm text-stone-500">
                    Hétvégén (Péntek-Szombat): <strong className="text-[#0f241a]">{detailModalRoom.weekendPricePerNight.toLocaleString('hu-HU')} Ft</strong> / éj
                  </div>
                </div>
                <button
                  onClick={() => {
                    const id = detailModalRoom.id;
                    setDetailModalRoom(null);
                    openBookingModal(id);
                  }}
                  className="w-full sm:w-auto bg-[#c5a880] hover:bg-[#d4af37] text-[#0f241a] px-8 py-3.5 rounded-2xl font-bold shadow-lg transition-colors cursor-pointer"
                >
                  Időpont Foglalása Erre a Házra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
