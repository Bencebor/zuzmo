import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ShieldCheck, UserCheck, KeyRound, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminUser } from '../../types';

export const UsersView: React.FC = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'editor' as 'owner' | 'editor'
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (user?.role !== 'owner') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center max-w-xl mx-auto space-y-3">
        <ShieldCheck className="w-12 h-12 text-amber-700 mx-auto" />
        <h3 className="font-serif font-bold text-lg text-amber-900">
          Korlátozott Hozzáférés
        </h3>
        <p className="text-xs text-amber-800 leading-relaxed">
          A felhasználók és rendszerjogosultságok kezeléséhez kizárólag a <strong>Tulajdonos / Főadminisztrátor</strong> fiók rendelkezik jogosultsággal. Tartalomszerkesztőként a képeket, leírásokat és árakat módosíthatod.
        </p>
      </div>
    );
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Hiba a felhasználó létrehozásakor.');
      } else {
        setIsModalOpen(false);
        setForm({
          name: '',
          username: '',
          email: '',
          password: '',
          role: 'editor'
        });
        fetchUsers();
      }
    } catch {
      setErrorMsg('Hálózati hiba.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt a felhasználót?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#0f241a]">Felhasználók & Jogosultságok</h2>
          <p className="text-xs text-stone-500">
            Adminisztrátori és tartalomszerkesztői fiókok hozzáadása és kezelése
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-[#c5a880]" />
          <span>Új Felhasználó Létrehozása</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
            <tr>
              <th className="py-3.5 px-4">Név & Felhasználónév</th>
              <th className="py-3.5 px-4">E-mail</th>
              <th className="py-3.5 px-4">Szerepkör</th>
              <th className="py-3.5 px-4">Létrehozva</th>
              <th className="py-3.5 px-4 text-right">Művelet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#0f241a]">{u.name}</div>
                  <div className="text-[11px] text-stone-400 font-mono">@{u.username}</div>
                </td>
                <td className="py-3.5 px-4 text-stone-600">{u.email}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'owner'
                        ? 'bg-purple-100 text-purple-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {u.role === 'owner' ? '👑 Tulajdonos / Admin' : '✍️ Tartalomszerkesztő'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-stone-400">
                  {new Date(u.createdAt).toLocaleDateString('hu-HU')}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {u.id !== user?.id && (
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Felhasználó törlése"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-serif font-bold text-[#0f241a] mb-1">
              Új Felhasználó Felvétele
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Add meg a kolléga adatait és válaszd ki a jogosultsági szintet.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Teljes Név *
                </label>
                <input
                  type="text"
                  required
                  placeholder="pl. Minta Márta"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Felhasználónév *
                </label>
                <input
                  type="text"
                  required
                  placeholder="pl. marta"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  E-mail Cím *
                </label>
                <input
                  type="email"
                  required
                  placeholder="pl. marta@zuzmaravendeghaz.hu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Kezdő Jelszó *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Jogosultsági Szint
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none"
                >
                  <option value="editor">
                    ✍️ Tartalomszerkesztő (képek, szövegek, árak, vélemények)
                  </option>
                  <option value="owner">
                    👑 Tulajdonos / Adminisztrátor (teljes hozzáférés)
                  </option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Fiók Mentése
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
