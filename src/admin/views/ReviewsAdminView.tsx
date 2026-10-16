import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Review } from '../../types';

export const ReviewsAdminView: React.FC = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setReviews(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFeature = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isFeatured: !current })
      });
      if (res.ok) fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt a véleményt?')) return;
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#0f241a]">Vélemények Moderációja</h2>
        <p className="text-xs text-stone-500">
          A vendégek által beküldött értékelések jóváhagyása, kiemelése és elutasítása
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              rev.status === 'pending'
                ? 'border-purple-300 bg-purple-50/20'
                : rev.status === 'approved'
                ? 'border-stone-200'
                : 'border-rose-200 bg-rose-50/20 opacity-60'
            }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-serif font-bold text-[#0f241a] text-sm">{rev.guestName}</span>
                <span className="text-xs text-stone-400">• {rev.roomName}</span>
                <span className="text-xs text-stone-400">• {rev.stayDate}</span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    rev.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rev.status === 'pending'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {rev.status === 'approved' && 'Jóváhagyva'}
                  {rev.status === 'pending' && 'Függőben / Moderálásra vár'}
                  {rev.status === 'rejected' && 'Elutasítva'}
                </span>
              </div>

              <p className="text-stone-600 text-sm leading-relaxed italic">"{rev.comment}"</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {rev.status !== 'approved' && (
                <button
                  onClick={() => handleUpdateStatus(rev.id, 'approved')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Jóváhagyás</span>
                </button>
              )}

              {rev.status !== 'rejected' && (
                <button
                  onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Elutasítás</span>
                </button>
              )}

              <button
                onClick={() => handleToggleFeature(rev.id, rev.isFeatured)}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  rev.isFeatured
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
                }`}
                title={rev.isFeatured ? 'Kiemelt vélemény' : 'Kiemelés bekapcsolása'}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
              </button>

              <button
                onClick={() => handleDelete(rev.id)}
                className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-xl cursor-pointer"
                title="Törlés"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
