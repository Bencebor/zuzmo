import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, Navigation } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const ContactSection: React.FC = () => {
  const { content } = useSiteData();
  const contact = content?.contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Általános kérdés',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Hiba történt az üzenet küldésekor.');
      } else {
        setSuccessMsg(data.message || 'Üzenet sikeresen elküldve!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Általános kérdés',
          message: ''
        });
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch {
      setErrorMsg('Hálózati hiba.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="kapcsolat" className="py-24 bg-[#faf8f5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-3">
            <span>Elérhetőség & Megközelítés</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f241a]">
            Kérdésed Van? Vedd Fel Velünk a Kapcsolatot!
          </h2>
          <p className="mt-4 text-stone-600 text-base sm:text-lg">
            Házigazdaként örömmel segítünk egyedi igényekben, romantikus meglepetések szervezésében vagy az utazás megtervezésében.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact info & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-stone-200 space-y-6">
              <h3 className="font-serif font-bold text-2xl text-[#0f241a]">Elérhetőségeink</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 uppercase tracking-wider block font-semibold">
                      Telefonszám
                    </span>
                    <a
                      href={`tel:${contact?.phone || '+36304621242'}`}
                      className="text-base font-bold text-[#0f241a] hover:text-[#1b4332] transition-colors"
                    >
                      {contact?.phone || '+36 30 462 1242'}
                    </a>
                    <p className="text-xs text-stone-500 mt-0.5">Mindennap 08:00 – 20:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 uppercase tracking-wider block font-semibold">
                      E-mail cím
                    </span>
                    <a
                      href={`mailto:${contact?.email || 'info@zuzmokabin.hu'}`}
                      className="text-base font-bold text-[#0f241a] hover:text-[#1b4332] transition-colors"
                    >
                      {contact?.email || 'info@zuzmokabin.hu'}
                    </a>
                    <p className="text-xs text-stone-500 mt-0.5">Átlagos válaszidő: 2-4 óra</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 uppercase tracking-wider block font-semibold">
                      Cím & Helyszín
                    </span>
                    <div className="text-base font-bold text-[#0f241a]">
                      {contact?.address || 'Nagymaros, Szekér utca'}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{contact?.locationNote || 'A Dunakanyarban, Nagymaroson, a Szekér utcában, az erdő szélén.'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 uppercase tracking-wider block font-semibold">
                      Érkezés & Távozás
                    </span>
                    <div className="text-sm font-semibold text-[#0f241a]">
                      Check-in: 15:00-tól • Check-out: 10:00-ig
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">Zárható kulcsszéf az önálló bejutáshoz</p>
                  </div>
                </div>
              </div>

              {/* NTAK Badge */}
              <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-600 font-mono flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#1b4332] shrink-0" />
                <span>{contact?.ntakNumber || 'NTAK: MA19023507 (Magánszálláshely)'}</span>
              </div>
            </div>

            {/* Embedded interactive map visualizer */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200">
              <div className="relative aspect-[16/9] w-full">
                <iframe
                  title="Zuzmo Kabin Vendégház Térkép"
                  className="w-full h-full border-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2680.0!2d18.96!3d47.785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476a63583569a715%3A0x400c4290c1e1470!2sNagymaros!5e0!3m2!1shu!2shu!4v1700000000000!5m2!1shu!2shu"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-stone-200">
            <h3 className="font-serif font-bold text-2xl text-[#0f241a] mb-2">
              Közvetlen Üzenetküldés
            </h3>
            <p className="text-stone-500 text-sm mb-6">
              Töltsd ki az alábbi űrlapot, és munkatársunk néhány órán belül személyre szabott válasszal keres meg.
            </p>

            {successMsg && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Neved *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="pl. Szabó Gábor"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    E-mail címed *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="pl. gabor@pelda.hu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Telefonszámod (opcionális)
                  </label>
                  <input
                    type="tel"
                    placeholder="pl. +36 30 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Üzenet Témája
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm bg-white"
                  >
                    <option value="Általános kérdés">Általános kérdés</option>
                    <option value="Egyedi ajánlatkérés">Egyedi ajánlatkérés</option>
                    <option value="Romantikus bekészítés">Romantikus bekészítés</option>
                    <option value="SZÉP Kártyás fizetés">SZÉP Kártyás fizetés</option>
                    <option value="Céges vagy csapatépítő elvonulás">Céges vagy csapatépítő elvonulás</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Üzeneted *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Írd meg nekünk miben segíthetünk..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-[#c5a880]" />
                <span>{submitting ? 'Küldés folyamatban...' : 'Üzenet Elküldése'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
