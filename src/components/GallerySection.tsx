import React, { useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Image as ImageIcon, Video } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { MediaItem } from '../types';

export const GallerySection: React.FC = () => {
  const { gallery } = useSiteData();
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<MediaItem | null>(null);

  const photos = gallery.filter((item) => item.type === 'image');
  const videos = gallery.filter((item) => item.type === 'video');

  const filteredPhotos = photos.filter((p) => {
    if (categoryFilter === 'all') return true;
    return p.category === categoryFilter;
  });

  const categories = [
    { id: 'all', label: 'Összes Fotó' },
    { id: 'kulso', label: 'Birtok & Kert' },
    { id: 'wellness', label: 'Dézsa & Szauna' },
    { id: 'szobak', label: 'Házak & Belső Tér' },
    { id: 'hangulat', label: 'Erdei Hangulat' },
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
            <span>Vizuális Élmények</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f241a]">
            Pillantás a Zuzmara Világába
          </h2>
          <p className="mt-4 text-stone-600 text-base sm:text-lg">
            Nézd meg a vendégház életképeit, a gőzölgő erdei fürdőket és a természet nyugalmát bemutató fotóinkat és videóinkat.
          </p>

          {/* Main Media Tabs */}
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-[#1b4332] text-white shadow-lg'
                  : 'bg-white text-stone-700 hover:bg-stone-100'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Fotógaléria ({photos.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-[#1b4332] text-white shadow-lg'
                  : 'bg-white text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Videógaléria ({videos.length})</span>
            </button>
          </div>

          {/* Sub-category pills for photos */}
          {activeTab === 'photos' && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    categoryFilter === c.id
                      ? 'bg-[#c5a880] text-[#0f241a] font-bold shadow'
                      : 'bg-stone-200/60 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Photos Grid */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-[11px] font-semibold text-[#c5a880] uppercase tracking-wider">
                    {photo.category}
                  </span>
                  <p className="text-white text-sm font-medium leading-snug drop-shadow">
                    {photo.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Gallery */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-200 flex flex-col group"
              >
                <div
                  className="relative aspect-video bg-black cursor-pointer overflow-hidden"
                  onClick={() => setActiveVideoModal(vid)}
                >
                  <img
                    src={
                      vid.thumbnail ||
                      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={vid.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#c5a880] text-[#0f241a] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-[#0f241a] ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white text-xs bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span>▶ Kattints a videó lejátszásához</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-bold text-xl text-[#0f241a]">{vid.title}</h3>
                  <p className="text-stone-500 text-sm mt-2">
                    Légi felvételek és hangulatos bejárás a Zuzmara Vendégház varázslatos erdei birtokán.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
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

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="bg-stone-900 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-stone-800 text-white">
              <h3 className="font-serif font-bold text-lg">{activeVideoModal.title}</h3>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="w-8 h-8 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={activeVideoModal.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
