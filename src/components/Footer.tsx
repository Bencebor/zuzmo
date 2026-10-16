import React from 'react';
import { Phone, Mail, MapPin, Heart, Shield, Lock } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms, onAdminClick }) => {
  const { content } = useSiteData();
  const contact = content?.contact;

  return (
    <footer className="bg-[#0b1b13] text-stone-300 pt-16 pb-12 border-t border-[#1b4332]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1b4332] border border-[#c5a880]/50 flex items-center justify-center text-[#c5a880]">
                <span className="text-xl">❄️</span>
              </div>
              <div>
                <span className="text-xl font-serif text-white font-bold block">
                  Zuzmara <span className="text-[#c5a880] font-normal">Vendégház</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-emerald-400 block -mt-1">
                  Prémium Erdei Wellness
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Exkluzív hegyvidéki szálláshely a Börzsöny erdeinek csendjében. Fatüzelésű privát dézsafürdő, panorámás finn szauna és termelői kézműves reggeli.
            </p>

            <div className="pt-1">
              <span className="inline-block px-3 py-1 bg-white/5 rounded-md text-[11px] font-mono text-[#c5a880] border border-[#c5a880]/20">
                {contact?.ntakNumber || 'NTAK: EG23000987'}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-4">Navigáció</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#bemutatkozas" className="hover:text-[#c5a880] transition-colors">
                  A Vendégház Története
                </a>
              </li>
              <li>
                <a href="#szallasegysegek" className="hover:text-[#c5a880] transition-colors">
                  Szobák & Faházak
                </a>
              </li>
              <li>
                <a href="#szolgaltatasok" className="hover:text-[#c5a880] transition-colors">
                  Wellness & Szolgáltatások
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-[#c5a880] transition-colors">
                  Fotó- és Videógaléria
                </a>
              </li>
              <li>
                <a href="#velemenyek" className="hover:text-[#c5a880] transition-colors">
                  Vendégvélemények
                </a>
              </li>
              <li>
                <a href="#naptar" className="hover:text-[#c5a880] transition-colors">
                  Foglaltsági Naptár
                </a>
              </li>
              <li>
                <a href="#gyik" className="hover:text-[#c5a880] transition-colors">
                  Gyakori Kérdések (GYIK)
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-4">Elérhetőségek</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                <span>{contact?.address || '2628 Zebegény, Vadvirág dűlő 14.'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#c5a880] shrink-0" />
                <a href={`tel:${contact?.phone}`} className="hover:text-white transition-colors">
                  {contact?.phone || '+36 30 789 4512'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#c5a880] shrink-0" />
                <a href={`mailto:${contact?.email}`} className="hover:text-white transition-colors">
                  {contact?.email || 'info@zuzmaravendeghaz.hu'}
                </a>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="text-[11px] text-stone-400 block font-medium">Fizetési Lehetőségek:</span>
              <span className="text-[11px] text-[#c5a880] mt-1 block">
                Bankkártya • OTP, MBH, K&H SZÉP Kártya • Átutalás
              </span>
            </div>
          </div>

          {/* Legal & Security */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-4">Biztonság & Jog</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-[#c5a880] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Adatkezelési Tájékoztató (GDPR)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-[#c5a880] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Házirend & Lemondási Feltételek</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onAdminClick}
                  className="hover:text-[#c5a880] transition-colors flex items-center gap-1.5 cursor-pointer text-left pt-2 text-stone-400 hover:text-white"
                >
                  <Lock className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Központi Adminisztráció (/admin)</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div>
            © {new Date().getFullYear()} Zuzmara Vendégház. Minden jog fenntartva.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Szeretettel megálmodva a Dunakanyarban</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
