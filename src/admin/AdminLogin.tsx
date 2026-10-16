import React, { useState, useEffect } from 'react';
import { Lock, User, Mail, Shield, KeyRound, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { login, checkSetupStatus, setupMaster } = useAuth();
  const [isSetupNeeded, setIsSetupNeeded] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  // Login form state
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Master setup form state
  const [masterName, setMasterName] = useState<string>('');
  const [masterUsername, setMasterUsername] = useState<string>('');
  const [masterEmail, setMasterEmail] = useState<string>('');
  const [masterPassword, setMasterPassword] = useState<string>('');
  const [masterConfirmPassword, setMasterConfirmPassword] = useState<string>('');

  useEffect(() => {
    async function init() {
      const status = await checkSetupStatus();
      setIsSetupNeeded(!status.hasOwner);
      setChecking(false);
    }
    init();
  }, [checkSetupStatus]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);
    const res = await login(usernameOrEmail, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Helytelen adatok');
    }
    setSubmitting(false);
  };

  const handleMasterSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (masterPassword !== masterConfirmPassword) {
      setErrorMessage('A két jelszó nem egyezik!');
      return;
    }
    if (masterPassword.length < 6) {
      setErrorMessage('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
      return;
    }
    setSubmitting(true);
    const res = await setupMaster({
      name: masterName,
      username: masterUsername,
      email: masterEmail,
      password: masterPassword
    });
    if (!res.success) {
      setErrorMessage(res.error || 'Hiba a fiók létrehozásakor.');
    }
    setSubmitting(false);
  };

  // Quick fill helper for review/testing
  const fillCredentials = (user: string, pass: string) => {
    setUsernameOrEmail(user);
    setPassword(pass);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0f241a] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-400">Biztonsági környezet ellenőrzése...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f241a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative pine forest background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2d6a4f]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToSite}
          className="text-xs text-stone-300 hover:text-white flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
        >
          <span>← Vissza a Weboldalra</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1b4332] border border-[#c5a880]/60 flex items-center justify-center text-[#c5a880] mx-auto shadow-2xl mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Zuzmo Kabin Vendégház
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#c5a880] font-sans uppercase tracking-widest">
            Központi Adminisztrációs Rendszer
          </p>
        </div>

        <div className="mt-8 bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-stone-200">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSetupNeeded ? (
            /* First-time Master Admin Setup Wizard */
            <div>
              <div className="mb-5">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Kezdő Beállítás
                </span>
                <h3 className="text-lg font-serif font-bold text-[#0f241a]">
                  Főadminisztrátori Fiók Létrehozása
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  A rendszerben még nincs rögzített tulajdonos. Add meg a biztonságos mester-hozzáférésed adatait.
                </p>
              </div>

              <form onSubmit={handleMasterSetup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Teljes Név
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="pl. Tulajdonos Neve"
                    value={masterName}
                    onChange={(e) => setMasterName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#1b4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Felhasználónév
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="pl. admin"
                    value={masterUsername}
                    onChange={(e) => setMasterUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#1b4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    E-mail cím
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="pl. hello@zuzmaravendeghaz.hu"
                    value={masterEmail}
                    onChange={(e) => setMasterEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#1b4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Biztonságos Mesterjelszó
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Legalább 6 karakter"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#1b4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Jelszó Megerősítése
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Ismételd meg a jelszót"
                    value={masterConfirmPassword}
                    onChange={(e) => setMasterConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#1b4332]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3 rounded-xl font-bold text-sm shadow-lg transition-colors cursor-pointer disabled:opacity-50 mt-2"
                >
                  {submitting ? 'Létrehozás...' : 'Tulajdonosi Fiók Mentése & Belépés'}
                </button>
              </form>
            </div>
          ) : (
            /* Regular Admin Login Form */
            <div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#1b4332]" />
                    <span>Felhasználónév vagy E-mail</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="pl. admin vagy email"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#1b4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#1b4332]" />
                    <span>Jelszó</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#1b4332]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  <span>{submitting ? 'Hitelesítés...' : 'Biztonságos Bejelentkezés'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Fast Test Account Fillers */}
              <div className="mt-8 pt-5 border-t border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2 text-center">
                  ⚡ Gyors Tesztfiók Bejelentkezés:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillCredentials('admin', 'Zuzmara2026!')}
                    className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-left border border-stone-200 transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-[#0f241a] block">👑 Tulajdonos</span>
                    <span className="text-[10px] text-stone-500 font-mono block">admin / Zuzmara2026!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillCredentials('szerkeszto', 'Editor2026!')}
                    className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-left border border-stone-200 transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-[#0f241a] block">✍️ Szerkesztő</span>
                    <span className="text-[10px] text-stone-500 font-mono block">szerkeszto / Editor2026!</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
