import React, { useState } from 'react';
import { Calendar, Users, Star, Sparkles, Flame, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const Hero: React.FC = () => {
  const { content, rooms, openBookingModal } = useSiteData();

  // Quick search state
  const today = new Date().toISOString().split('T')[0];
  const nextTwoDays = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState<string>(today);
  const [checkOut, setCheckOut] = useState<string>(nextTwoDays);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);

  const heroImage =
    content?.hero?.coverImage ||
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=85';

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    openBookingModal(selectedRoom || undefined);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Dark Pine Tint Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Zuzmara Vendégház"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f241a] via-[#0f241a]/65 to-[#0f241a]/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0f241a]/30 to-[#0f241a]/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mt-6">
        {/* Top Highlight Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b4332]/80 border border-[#c5a880]/40 text-[#c5a880] text-xs sm:text-sm font-medium backdrop-blur-md mb-6 shadow-xl animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span>{content?.hero?.badge || '✨ Prémium Természetközeli Vendégház & Wellness'}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white font-bold tracking-tight max-w-4xl mx-auto leading-tight drop-shadow-md">
          {content?.hero?.title || 'Ahol a csend és a luxus találkozik az erdei fenyvesekben'}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-stone-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
          {content?.hero?.subtitle ||
            'Zuzmara Vendégház – exkluzív erdei faházak privát fatüzelésű dézsafürdővel, panorámás finn szaunával és kényeztető reggelivel a Dunakanyar ölelésében.'}
        </p>

        {/* Quick Booking Search Box */}
        <div className="mt-10 max-w-4xl mx-auto bg-[#0f241a]/90 backdrop-blur-xl border border-[#2d6a4f]/50 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl">
          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Check-in */}
            <div className="text-left bg-white/5 border border-white/10 rounded-xl p-2.5 hover:border-[#c5a880]/50 transition-colors">
              <label className="block text-[11px] font-semibold text-[#c5a880] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Érkezés</span>
              </label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
              />
            </div>

            {/* Check-out */}
            <div className="text-left bg-white/5 border border-white/10 rounded-xl p-2.5 hover:border-[#c5a880]/50 transition-colors">
              <label className="block text-[11px] font-semibold text-[#c5a880] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Távozás</span>
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
              />
            </div>

            {/* Room selection & guests */}
            <div className="text-left bg-white/5 border border-white/10 rounded-xl p-2.5 hover:border-[#c5a880]/50 transition-colors">
              <label className="block text-[11px] font-semibold text-[#c5a880] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Szállás & Vendégek</span>
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full bg-[#1b4332] text-white text-sm font-medium focus:outline-none cursor-pointer py-0.5 rounded"
              >
                <option value="">Bármelyik szabad ház</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} (max. {room.capacity} fő)
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="bg-[#c5a880] hover:bg-[#d4af37] text-[#0f241a] font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-[#c5a880]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Szabad Időpontok</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 border-t border-white/10 text-stone-300">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-white">4.98 / 5 Értékelés</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
            <Flame className="w-4 h-4 text-[#c5a880]" />
            <span>Privát Dézsa & Szauna</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Csend & Erdőszél</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-[#c5a880]" />
            <span>SZÉP Kártya Elfogadás</span>
          </div>
        </div>
      </div>
    </section>
  );
};
