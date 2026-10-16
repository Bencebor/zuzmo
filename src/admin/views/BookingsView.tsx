import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Mail,
  Phone,
  FileText,
  X,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Booking, Room } from '../../types';

export const BookingsView: React.FC = () => {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Booking Modal
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Manual Booking Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    roomId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    guestsCount: 2,
    nights: 2,
    baseTotal: 100000,
    extrasTotal: 0,
    touristTaxTotal: 2000,
    grandTotal: 102000,
    depositRequired: 30600,
    depositPaid: 30600,
    paymentMethod: 'card' as const,
    paymentStatus: 'deposit_paid' as const,
    status: 'confirmed' as const,
    notes: 'Telefonon egyeztetett vendég.'
  });

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/admin/bookings?status=${statusFilter}&search=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/admin/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
        if (data.length > 0 && !manualForm.roomId) {
          setManualForm((prev) => ({ ...prev, roomId: data[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, [statusFilter, searchQuery]);

  const updateBookingStatus = async (
    id: string,
    status: 'confirmed' | 'cancelled' | 'pending',
    paymentStatus?: 'deposit_paid' | 'fully_paid'
  ) => {
    try {
      const body: any = { status };
      if (paymentStatus) body.paymentStatus = paymentStatus;

      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        fetchBookings();
        if (activeBooking && activeBooking.id === id) {
          setActiveBooking({ ...activeBooking, ...body });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    const selRoom = rooms.find((r) => r.id === manualForm.roomId) || rooms[0];
    try {
      const res = await fetch('/api/admin/bookings/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...manualForm,
          roomName: selRoom?.name || 'Zuzmara Faház',
          selectedExtras: []
        })
      });
      if (res.ok) {
        setIsManualModalOpen(false);
        fetchBookings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#0f241a]">Foglalások Kezelése</h2>
          <p className="text-xs text-stone-500">Minden beérkezett és rögzített foglalás részletei</p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-[#c5a880]" />
          <span>Új Manuális Foglalás</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Keresés név, kód, e-mail szerint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1b4332]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'Összes' },
            { id: 'confirmed', label: 'Megerősített' },
            { id: 'pending', label: 'Függőben' },
            { id: 'cancelled', label: 'Lemondott' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#1b4332] text-white font-bold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Kód</th>
                <th className="py-3.5 px-4">Vendég Neve</th>
                <th className="py-3.5 px-4">Szállásegység</th>
                <th className="py-3.5 px-4">Időszak</th>
                <th className="py-3.5 px-4">Fő</th>
                <th className="py-3.5 px-4">Végösszeg</th>
                <th className="py-3.5 px-4">Fizetés</th>
                <th className="py-3.5 px-4">Státusz</th>
                <th className="py-3.5 px-4 text-right">Műveletek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400">
                    Nincs a megadott szűrésnek megfelelő foglalás.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1b4332]">{b.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#0f241a]">{b.guestName}</div>
                      <div className="text-[10px] text-stone-400">{b.guestPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700 font-medium">{b.roomName}</td>
                    <td className="py-3 px-4 text-stone-500">
                      {b.checkIn} – {b.checkOut}
                      <span className="block text-[10px] text-stone-400">{b.nights} éjszaka</span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-semibold">{b.guestsCount} fő</td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {b.grandTotal.toLocaleString('hu-HU')} Ft
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.paymentStatus === 'fully_paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.paymentStatus === 'deposit_paid'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.paymentStatus === 'fully_paid' && 'Teljesen kifizetve'}
                        {b.paymentStatus === 'deposit_paid' && 'Előleg rendezve'}
                        {b.paymentStatus === 'pending' && 'Fizetésre vár'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.status === 'confirmed' && 'Megerősítve'}
                        {b.status === 'pending' && 'Függőben'}
                        {b.status === 'cancelled' && 'Lemondva'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveBooking(b)}
                        className="p-1.5 hover:bg-stone-200 rounded-lg text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                        title="Részletek megtekintése"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setActiveBooking(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs bg-[#1b4332] text-white px-3 py-1 rounded-md font-bold">
                {activeBooking.id}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeBooking.status === 'confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {activeBooking.status === 'confirmed' ? 'Megerősített Foglalás' : 'Függőben lévő'}
              </span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-[#0f241a] mb-6">
              {activeBooking.guestName} foglalása
            </h3>

            {/* Guest & Contact Card */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs mb-6">
              <div className="flex items-center gap-2 text-stone-700">
                <Mail className="w-4 h-4 text-[#1b4332]" />
                <a href={`mailto:${activeBooking.guestEmail}`} className="underline">
                  {activeBooking.guestEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Phone className="w-4 h-4 text-[#1b4332]" />
                <a href={`tel:${activeBooking.guestPhone}`} className="underline">
                  {activeBooking.guestPhone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Calendar className="w-4 h-4 text-[#1b4332]" />
                <span>
                  {activeBooking.checkIn} – {activeBooking.checkOut} ({activeBooking.nights} éjszaka, {activeBooking.guestsCount} vendég)
                </span>
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="space-y-2 text-xs border-b border-stone-200 pb-4 mb-4">
              <div className="flex justify-between text-stone-600">
                <span>Szállás:</span>
                <strong className="text-stone-900">{activeBooking.roomName}</strong>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Alap szállásdíj:</span>
                <span>{activeBooking.baseTotal.toLocaleString('hu-HU')} Ft</span>
              </div>
              {activeBooking.extrasTotal > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Kért extrák:</span>
                  <span>+{activeBooking.extrasTotal.toLocaleString('hu-HU')} Ft</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Idegenforgalmi adó (IFA):</span>
                <span>+{activeBooking.touristTaxTotal.toLocaleString('hu-HU')} Ft</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#0f241a] pt-1">
                <span>Teljes Végösszeg:</span>
                <span>{activeBooking.grandTotal.toLocaleString('hu-HU')} Ft</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Eddig befizetve:</span>
                <span>{activeBooking.depositPaid.toLocaleString('hu-HU')} Ft ({activeBooking.paymentStatus})</span>
              </div>
            </div>

            {activeBooking.specialRequests && (
              <div className="mb-4 text-xs bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900">
                <strong>Vendég megjegyzése:</strong> {activeBooking.specialRequests}
              </div>
            )}

            {activeBooking.notes && (
              <div className="mb-6 text-xs bg-stone-100 p-3 rounded-xl border border-stone-200 text-stone-700">
                <strong>Belső admin jegyzet:</strong> {activeBooking.notes}
              </div>
            )}

            {/* Admin Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex gap-2">
                {activeBooking.status !== 'confirmed' && (
                  <button
                    onClick={() => updateBookingStatus(activeBooking.id, 'confirmed', 'deposit_paid')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Megerősítés & Előleg rögzítése
                  </button>
                )}
                {activeBooking.paymentStatus !== 'fully_paid' && (
                  <button
                    onClick={() => updateBookingStatus(activeBooking.id, 'confirmed', 'fully_paid')}
                    className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Teljesen kifizetve
                  </button>
                )}
                {activeBooking.status !== 'cancelled' && (
                  <button
                    onClick={() => updateBookingStatus(activeBooking.id, 'cancelled')}
                    className="bg-rose-100 hover:bg-rose-200 text-rose-800 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Foglalás Lemondása
                  </button>
                )}
              </div>

              <button
                onClick={() => setActiveBooking(null)}
                className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Bezárás
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Booking Creation Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-serif font-bold text-[#0f241a] mb-1">
              Új Manuális Foglalás Felvétele
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Telefonon vagy személyesen egyeztetett foglalás rögzítése a naptárba
            </p>

            <form onSubmit={handleCreateManual} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Szállásegység *
                </label>
                <select
                  value={manualForm.roomId}
                  onChange={(e) => setManualForm({ ...manualForm, roomId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Vendég Neve *
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.guestName}
                  onChange={(e) => setManualForm({ ...manualForm, guestName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    E-mail cím *
                  </label>
                  <input
                    type="email"
                    required
                    value={manualForm.guestEmail}
                    onChange={(e) => setManualForm({ ...manualForm, guestEmail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Telefonszám *
                  </label>
                  <input
                    type="tel"
                    required
                    value={manualForm.guestPhone}
                    onChange={(e) => setManualForm({ ...manualForm, guestPhone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Érkezés
                  </label>
                  <input
                    type="date"
                    required
                    value={manualForm.checkIn}
                    onChange={(e) => setManualForm({ ...manualForm, checkIn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Távozás
                  </label>
                  <input
                    type="date"
                    required
                    value={manualForm.checkOut}
                    onChange={(e) => setManualForm({ ...manualForm, checkOut: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Végösszeg (Ft)
                  </label>
                  <input
                    type="number"
                    value={manualForm.grandTotal}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, grandTotal: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Vendégek (fő)
                  </label>
                  <input
                    type="number"
                    value={manualForm.guestsCount}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, guestsCount: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Belső Megjegyzés
                </label>
                <textarea
                  rows={2}
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer mt-2"
              >
                Manuális Foglalás Mentése
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
