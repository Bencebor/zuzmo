import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Ban, Plus, Trash2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Room, BlockedDate, Booking } from '../../types';

export const CalendarAdminView: React.FC = () => {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Month controller
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Block modal
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reason: 'Karbantartás és felújítás'
  });

  const fetchData = async () => {
    try {
      const [roomsRes, blocksRes, bookingsRes] = await Promise.all([
        fetch('/api/admin/rooms', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/blocked-dates', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/bookings?status=confirmed', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setRooms(roomsData);
        if (roomsData.length > 0 && !selectedRoomId) {
          setSelectedRoomId(roomsData[0].id);
        }
      }
      if (blocksRes.ok) {
        setBlockedDates(await blocksRes.json());
      }
      if (bookingsRes.ok) {
        setBookings(await bookingsRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/blocked-dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: selectedRoomId,
          startDate: blockForm.startDate,
          endDate: blockForm.endDate,
          reason: blockForm.reason
        })
      });
      if (res.ok) {
        setIsBlockModalOpen(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    try {
      await fetch(`/api/admin/blocked-dates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
    'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
  ];
  const weekDays = ['Hé', 'Ke', 'Sze', 'Csü', 'Pén', 'Szo', 'Vas'];
  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#0f241a]">Naptár & Időszak Zárolások</h2>
          <p className="text-xs text-stone-500">
            Szabad kapacitások, megerősített vendégfoglalások és karbantartási zárolások kezelése
          </p>
        </div>

        <button
          onClick={() => setIsBlockModalOpen(true)}
          className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
        >
          <Ban className="w-4 h-4" />
          <span>Időszak Zárolása</span>
        </button>
      </div>

      {/* Room Tabs */}
      <div className="flex flex-wrap gap-2">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => setSelectedRoomId(room.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRoomId === room.id
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>

      {/* Main Calendar Card */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        {/* Month Navigator */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>

          <div className="text-center">
            <h3 className="font-serif font-bold text-xl text-[#0f241a]">
              {monthNames[month]} {year}
            </h3>
            <span className="text-xs text-stone-500">{activeRoom?.name}</span>
          </div>

          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-stone-700" />
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekDays.map((d, i) => (
            <div key={i} className="text-xs font-bold text-stone-400 py-1 uppercase">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 rounded-xl bg-stone-50/50" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

            // Check if day falls in any booking
            const bookedItem = bookings.find((b) => {
              if (b.roomId !== selectedRoomId) return false;
              return formattedDate >= b.checkIn && formattedDate < b.checkOut;
            });

            // Check if day falls in any blocked range
            const blockedItem = blockedDates.find((b) => {
              if (b.roomId !== selectedRoomId) return false;
              return formattedDate >= b.startDate && formattedDate < b.endDate;
            });

            return (
              <div
                key={`day-${dayNum}`}
                className={`h-16 p-1.5 rounded-xl border flex flex-col justify-between transition-all ${
                  blockedItem
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : bookedItem
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-stone-50/70 border-stone-200 text-stone-800'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">{dayNum}</span>
                  {blockedItem && <Ban className="w-3.5 h-3.5 text-amber-600" />}
                  {bookedItem && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>

                <div className="truncate text-[10px] leading-tight">
                  {blockedItem && <span className="font-semibold text-amber-800">Zárolva</span>}
                  {bookedItem && (
                    <span className="font-semibold text-emerald-800 truncate block">
                      {bookedItem.guestName}
                    </span>
                  )}
                  {!blockedItem && !bookedItem && (
                    <span className="text-stone-400 font-light">Szabad</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocked Dates List */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <h3 className="font-serif font-bold text-lg text-[#0f241a] mb-4">
          Aktív Zárolások a kiválasztott szálláshoz
        </h3>

        {blockedDates.filter((b) => b.roomId === selectedRoomId).length === 0 ? (
          <p className="text-xs text-stone-400 py-3">Nincsenek érvényes zárolt időszakok.</p>
        ) : (
          <div className="space-y-2">
            {blockedDates
              .filter((b) => b.roomId === selectedRoomId)
              .map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-amber-900 font-mono">
                      {b.startDate} – {b.endDate}
                    </strong>
                    <span className="text-amber-700 block mt-0.5">Indok: {b.reason}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteBlock(b.id)}
                    className="p-1.5 text-amber-700 hover:text-red-700 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                    title="Zárolás feloldása"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Block Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <h3 className="text-lg font-serif font-bold text-[#0f241a] mb-1">
              Időszak Zárolása
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Karbantartás vagy magáncélú foglaltság miatt a kiválasztott napok nem lesznek foglalhatók.
            </p>

            <form onSubmit={handleCreateBlock} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Kezdő Dátum
                </label>
                <input
                  type="date"
                  required
                  value={blockForm.startDate}
                  onChange={(e) => setBlockForm({ ...blockForm, startDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Befejező Dátum
                </label>
                <input
                  type="date"
                  required
                  value={blockForm.endDate}
                  onChange={(e) => setBlockForm({ ...blockForm, endDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Zárolás Oka
                </label>
                <input
                  type="text"
                  required
                  placeholder="pl. Szauna karbantartás, Dézsa felújítás"
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Zárolás Mentése
                </button>
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(false)}
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
