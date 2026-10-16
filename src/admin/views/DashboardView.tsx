import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Booking } from '../../types';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/bookings?status=all', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setRecentBookings(bookingsData.slice(0, 5));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [token]);

  if (loading) {
    return (
      <div className="p-8 text-center text-stone-500">
        <div className="w-8 h-8 border-2 border-[#1b4332] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Irányítópult betöltése...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs uppercase tracking-widest text-[#c5a880] font-bold">
            {user?.role === 'owner' ? '👑 Tulajdonosi Központ' : '✍️ Tartalomszerkesztői Felület'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1">
            Üdvözöljük, {user?.name}!
          </h2>
          <p className="text-stone-200 text-xs sm:text-sm mt-2 leading-relaxed">
            Itt követheti nyomon a Zuzmo Kabin Vendégház aktuális foglalásait, naptárát és beállításait.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Megerősített Foglalások
            </span>
            <div className="text-2xl font-serif font-bold text-[#0f241a] mt-1">
              {stats?.confirmedBookings || 0} db
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              Összes rögzített: {stats?.totalBookings || 0} db
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Mai Érkezések
            </span>
            <div className="text-2xl font-serif font-bold text-[#0f241a] mt-1">
              {stats?.todayArrivals || 0} vendég
            </div>
            <span className="text-[11px] text-stone-400">Kulcsszéf-kódok aktívak</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Becsült Árbevétel
            </span>
            <div className="text-2xl font-serif font-bold text-[#1b4332] mt-1">
              {(stats?.totalRevenue || 0).toLocaleString('hu-HU')} Ft
            </div>
            <span className="text-[11px] text-stone-400">Megerősített & Teljesített</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Függőben Lévő Vélemények
            </span>
            <div className="text-2xl font-serif font-bold text-[#0f241a] mt-1">
              {stats?.pendingReviews || 0} új
            </div>
            <button
              onClick={() => onNavigateTab('reviews')}
              className="text-[11px] text-[#c5a880] hover:underline font-medium cursor-pointer"
            >
              Moderálás megnyitása →
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#0f241a]">Legfrissebb Foglalások</h3>
            <p className="text-xs text-stone-500">A legutóbb beérkezett online és manuális foglalások</p>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-bold text-[#1b4332] hover:text-[#2d6a4f] flex items-center gap-1 cursor-pointer"
          >
            <span>Összes Megtekintése ({recentBookings.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Azonosító</th>
                <th className="py-3 px-4">Vendég</th>
                <th className="py-3 px-4">Szállás</th>
                <th className="py-3 px-4">Időszak</th>
                <th className="py-3 px-4">Végösszeg</th>
                <th className="py-3 px-4">Fizetés</th>
                <th className="py-3 px-4">Státusz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1b4332]">{b.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#0f241a]">{b.guestName}</td>
                  <td className="py-3.5 px-4 text-stone-600">{b.roomName}</td>
                  <td className="py-3.5 px-4 text-stone-500">
                    {b.checkIn} – {b.checkOut} ({b.nights} éj)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    {b.grandTotal.toLocaleString('hu-HU')} Ft
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.paymentStatus === 'fully_paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.paymentStatus === 'deposit_paid'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.paymentStatus === 'fully_paid' && 'Fizetve'}
                      {b.paymentStatus === 'deposit_paid' && 'Előleg OK'}
                      {b.paymentStatus === 'pending' && 'Függőben'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
