import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { MediaItem } from '../types';

export const GallerySection: React.FC = () => {
  const { gallery } = useSiteData();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photos = gallery.filter((item) => item.type === 'image');

  const filteredPhotos = photos.filter((p) => {
    if (categoryFilter === 'all') return true;
    return p.category === categoryFilter;
  });

  const categories = [
    { id: 'all', label: 'Összes Fotó (14)' },
    { id: 'kulso', label: 'Ház & Kert' },
    { id: 'nappali', label: 'Nappali & Konyha' },
    { id: 'haloszobak', label: 'Hálószobák' },
    { id: 'furdoszoba', label: 'Fürdőszoba' },
  ];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
    }
  };

  return (
    <section id="galeria" className="py-24 bg-[#f4efea] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-3">
            <span>Fotógaléria</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f241a]">
            Pillantás a Zuzmo Kabinba
          </h2>
          <p className="mt-4 text-stone-600 text-base sm:text-lg">
            Valódi fotók a nagymarosi vendégház külső és belső tereiről, a kényelmes hálószobákról és a rusztikus fürdőszobáról.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  categoryFilter === c.id
                    ? 'bg-[#1b4332] text-white shadow-md font-bold'
                    : 'bg-stone-200/60 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 shadow-md hover:shadow-xl cursor-pointer transition-all duration-300"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-[10px] font-semibold text-[#c5a880] uppercase tracking-wider">
                  Zuzmo Kabin
                </span>
                <p className="text-white text-xs sm:text-sm font-medium leading-snug drop-shadow">
                  {photo.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Image & Caption */}
          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredPhotos[lightboxIndex].url}
              alt={filteredPhotos[lightboxIndex].title}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 text-center text-white">
              <p className="text-lg font-serif font-medium">{filteredPhotos[lightboxIndex].title}</p>
              <span className="text-xs text-stone-400">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      )}
    </section>
  );
};
