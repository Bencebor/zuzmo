import React, { useState, useEffect } from 'react';
import { Calendar, Menu, X, Shield, Phone, Sparkles } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface NavbarProps {
  onAdminClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAdminClick }) => {
  const { content, openBookingModal } = useSiteData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Bemutatkozás', href: '#bemutatkozas' },
    { name: 'A Ház Helyiségei', href: '#helyisegek' },
    { name: 'Felszereltség', href: '#felszereltseg' },
    { name: 'Galéria', href: '#galeria' },
    { name: 'Vélemények', href: '#velemenyek' },
    { name: 'GYIK', href: '#gyik' },
    { name: 'Kapcsolat', href: '#kapcsolat' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top announcement bar */}
      {content?.hero?.announcement && (
        <div className="bg-[#0f241a] text-[#c5a880] text-xs py-1.5 px-4 text-center font-medium border-b border-[#2d6a4f]/30 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{content.hero.announcement}</span>
        </div>
      )}

      {/* Main navigation */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-lg border-b border-[#2d6a4f]/40 py-3'
            : 'bg-gradient-to-b from-[#0f241a]/90 via-[#0f241a]/60 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-[#1b4332] border border-[#c5a880]/50 flex items-center justify-center text-[#c5a880] shadow-md group-hover:border-[#c5a880] transition-colors">
                <span className="text-xl font-serif">🌲</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-serif tracking-wide text-white font-semibold">
                  Zuzmo Kabin <span className="text-[#c5a880] font-normal">Vendégház</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-emerald-300/80 -mt-1 font-sans">
                  Nagymaros • Dunakanyar
                </span>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-stone-200 hover:text-[#c5a880] transition-colors tracking-wide"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="tel:+36304621242"
                className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>+36 30 462 1242</span>
              </a>

              {/* Admin Portal Link */}
              <button
                onClick={onAdminClick}
                title="Adminisztráció"
                className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-[#c5a880] p-2 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-[#c5a880]/30 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-[#c5a880]" />
                <span className="hidden xl:inline">Admin</span>
              </button>

              {/* Main Booking Button */}
              <button
                onClick={() => openBookingModal()}
                className="flex items-center gap-2 bg-[#c5a880] hover:bg-[#d4af37] text-[#0f241a] px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:shadow-[#c5a880]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Foglalás</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href="tel:+36304621242"
                className="text-stone-300 p-2"
                title="Hívás"
              >
                <Phone className="w-4 h-4 text-[#c5a880]" />
              </a>
              <button
                onClick={() => openBookingModal()}
                className="bg-[#c5a880] text-[#0f241a] px-3 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Foglalás</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2 rounded-lg hover:bg-white/10 cursor-pointer"
                aria-label="Menü megnyitása"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0f241a]/98 border-b border-[#2d6a4f]/40 px-4 pt-3 pb-6 space-y-3 mt-3 backdrop-blur-xl">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-stone-200 hover:text-[#c5a880] text-base font-medium border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="tel:+36304621242"
                className="flex items-center gap-2 text-stone-300 text-sm py-2 hover:text-white"
              >
                <Phone className="w-4 h-4 text-[#c5a880]" />
                <span>+36 30 462 1242</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="flex items-center gap-2 text-stone-300 text-sm py-2 hover:text-[#c5a880] text-left cursor-pointer"
              >
                <Shield className="w-4 h-4 text-[#c5a880]" />
                <span>Adminisztrációs felület</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
