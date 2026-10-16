import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const BookingCalendarSection: React.FC = () => {
  const { rooms, openBookingModal } = useSiteData();
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');

  // Year/Month controller
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate calendar days for the current month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Convert to Monday = 0: (day + 6) % 7
  const startDayOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Január',
    'Február',
    'Március',
    'Április',
    'Május',
    'Június',
    'Július',
    'Augusztus',
    'Szeptember',
    'Október',
    'November',
    'December',
  ];

  const weekDayNames = ['Hé', 'Ke', 'Sze', 'Csü', 'Pén', 'Szo', 'Vas'];

  return (
    <section id="naptar" className="py-20 bg-[#faf8f5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0f241a] rounded-3xl p-6 sm:p-12 text-white shadow-2xl border border-[#2d6a4f]/50 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2d6a4f]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332] text-[#c5a880] text-xs font-semibold uppercase tracking-wider border border-[#c5a880]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interaktív Foglaltsági Naptár</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Tervezd Meg az Erdei Pihenésedet
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                Válassz faházat, tekintsd meg a szabad időpontokat, és foglald le közvetlenül jutalékmentesen a garantált legkedvezőbb áron.
              </p>

              {/* House selector pills */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#c5a880] uppercase tracking-wider block">
                  Szállásegység Kiválasztása
                </label>
                <div className="flex flex-col gap-2">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                        (selectedRoomId || rooms[0]?.id) === room.id
                          ? 'bg-[#c5a880] text-[#0f241a] font-bold shadow'
                          : 'bg-white/10 hover:bg-white/15 text-stone-200'
                      }`}
                    >
                      <span>{room.name}</span>
                      <span className="text-[11px] opacity-80">{room.basePricePerNight.toLocaleString('hu-HU')} Ft/éj</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA button */}
              <div className="pt-4">
                <button
                  onClick={() => openBookingModal(selectedRoomId || rooms[0]?.id)}
                  className="w-full sm:w-auto bg-[#c5a880] hover:bg-[#d4af37] text-[#0f241a] font-bold px-8 py-3.5 rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Időpont Lefoglalása</span>
                </button>
              </div>
            </div>

            {/* Right Calendar Column */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
              {/* Calendar header with navigation */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <button
                  onClick={handlePrevMonth}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-200 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <h3 className="font-serif font-bold text-lg text-white">
                    {monthNames[month]} {year}
                  </h3>
                  <span className="text-xs text-[#c5a880]">{activeRoom?.name}</span>
                </div>
                <button
                  onClick={handleNextMonth}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-200 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Day header row */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {weekDayNames.map((d, i) => (
                  <div key={i} className="text-xs font-bold text-stone-400 py-1 uppercase">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {/* Empty cells before month start */}
                {Array.from({ length: startDayOffset }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-9 sm:h-11 rounded-lg" />
                ))}

                {/* Actual month days */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNumber = idx + 1;
                  // Dummy demo booked pattern: e.g. Oct 20-23
                  const isDemoBooked =
                    month === 9 && (dayNumber === 20 || dayNumber === 21 || dayNumber === 22);

                  return (
                    <div
                      key={`day-${dayNumber}`}
                      onClick={() => openBookingModal(activeRoom?.id)}
                      className={`h-9 sm:h-11 rounded-xl flex flex-col items-center justify-center text-xs font-medium transition-all cursor-pointer ${
                        isDemoBooked
                          ? 'bg-rose-900/40 text-rose-300 border border-rose-500/30'
                          : 'bg-white/5 hover:bg-[#c5a880] hover:text-[#0f241a] text-white border border-white/5'
                      }`}
                    >
                      <span>{dayNumber}</span>
                      <span className="text-[9px] opacity-70">
                        {isDemoBooked ? 'Foglalt' : 'Szabad'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-6 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-white/20 border border-white/40" />
                  <span>Szabad időpont</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-rose-900/60 border border-rose-500/50" />
                  <span>Foglalt nap</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
