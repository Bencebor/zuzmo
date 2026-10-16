import React, { useState, useEffect } from 'react';
import { X, Shield, FileText, Check } from 'lucide-react';

interface LegalModalsProps {
  activeModal: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  // Cookie banner state
  const [cookieAccepted, setCookieAccepted] = useState<boolean>(() => {
    return localStorage.getItem('zuzmara_cookies_accepted') === 'true';
  });

  const handleAcceptCookies = () => {
    localStorage.setItem('zuzmara_cookies_accepted', 'true');
    setCookieAccepted(true);
  };

  if (activeModal === 'privacy') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-stone-200">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2.5 text-[#1b4332] mb-3">
            <Shield className="w-6 h-6 text-[#c5a880]" />
            <h3 className="font-serif font-bold text-2xl text-[#0f241a]">
              Adatkezelési Tájékoztató (GDPR)
            </h3>
          </div>
          <span className="text-xs text-stone-400 block mb-6">
            Hatályos: 2026. január 1-től visszavonásig • Zuzmara Vendégház Kft.
          </span>

          <div className="space-y-4 text-stone-600 text-sm leading-relaxed">
            <h4 className="font-bold text-[#0f241a]">1. Az adatkezelő adatai</h4>
            <p>
              Adatkezelő megnevezése: Zuzmara Vendégház Kft.<br />
              Székhely: 2628 Zebegény, Vadvirág dűlő 14.<br />
              NTAK regisztrációs szám: EG23000987<br />
              E-mail: info@zuzmaravendeghaz.hu • Telefon: +36 30 789 4512
            </p>

            <h4 className="font-bold text-[#0f241a]">2. A kezelt adatok köre és célja</h4>
            <p>
              A weboldalon történő szállásfoglalás során a következő személyes adatokat kezeljük:
              teljes név, e-mail cím, telefonszám, lakcím (számlázáshoz), vendégszám, érkezési és távozási dátumok.
              Az adatkezelés célja a szálláshely-szolgáltatási szerződés teljesítése, kapcsolattartás, visszaigazoló e-mailek és kulcsszéf-kódok elküldése, valamint a jogszabályban előírt NTAK és VIZA adatszolgáltatási kötelezettség teljesítése.
            </p>

            <h4 className="font-bold text-[#0f241a]">3. Az adatkezelés jogalapja</h4>
            <p>
              A GDPR 6. cikk (1) bekezdés b) pontja: a szerződés teljesítése, amelyben az érintett az egyik fél, vagy a szerződés megkötését megelőzően az érintett kérésére történő lépések megtétele.
            </p>

            <h4 className="font-bold text-[#0f241a]">4. Adattovábbítás és biztonság</h4>
            <p>
              A személyes adatokat harmadik félnek kereskedelmi célból nem adjuk át. Az adatokat biztonságos szervereken tároljuk és 256 bites SSL titkosítással védjük.
            </p>

            <h4 className="font-bold text-[#0f241a]">5. Az érintettek jogai</h4>
            <p>
              Ön bármikor kérheti személyes adatainak helyesbítését, törlését vagy az adatkezelés korlátozását az info@zuzmaravendeghaz.hu e-mail címen.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-stone-200 text-right">
            <button
              onClick={onClose}
              className="bg-[#1b4332] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d6a4f] transition-colors cursor-pointer"
            >
              Megértettem és bezárom
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === 'terms') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-stone-200">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2.5 text-[#1b4332] mb-3">
            <FileText className="w-6 h-6 text-[#c5a880]" />
            <h3 className="font-serif font-bold text-2xl text-[#0f241a]">
              Házirend & Foglalási Feltételek
            </h3>
          </div>
          <span className="text-xs text-stone-400 block mb-6">
            Zuzmara Vendégház – Békés pihenés a természet ölelésében
          </span>

          <div className="space-y-4 text-stone-600 text-sm leading-relaxed">
            <h4 className="font-bold text-[#0f241a]">1. Érkezés és elutazás</h4>
            <p>
              A szálláshely az érkezés napján 15:00 órától foglalható el, és a távozás napján legkésőbb 10:00 óráig kérjük átadni.
              Az érkezéshez okos kulcsszéf áll rendelkezésre, amelynek kódját 48 órával az érkezés előtt e-mailben és SMS-ben küldjük meg.
            </p>

            <h4 className="font-bold text-[#0f241a]">2. Foglalási előleg és lemondás</h4>
            <p>
              A foglalás megerősítéséhez a teljes szállásdíj 30%-ának megfelelő előleg fizetendő bankkártyával, SZÉP Kártyával vagy átutalással.
              A foglalás az érkezést megelőző 14. napig 100%-ban díjmentesen lemondható vagy módosítható. 14 napon belüli lemondás esetén az előleg nem visszatérítendő.
            </p>

            <h4 className="font-bold text-[#0f241a]">3. Erdei Dézsa és Finn Szauna használata</h4>
            <p>
              A dézsafürdő és a szauna kizárólag a házban tartózkodó regisztrált vendégek által vehető igénybe.
              Kérjük, a víz tisztaságának megőrzése érdekében a használat előtt zuhanyozzanak le. A fatüzelésű kályha biztonsági előírásainak betartása kötelező.
            </p>

            <h4 className="font-bold text-[#0f241a]">4. Csendrendelet és természetvédelem</h4>
            <p>
              A vendégház csendes erdei környezetben fekszik. 22:00 és 08:00 között a hangoskodás, kültéri zenelejátszás szigorúan tilos.
              A ház nem alkalmas legénybúcsúk, lánybúcsúk vagy hangos bulik lebonyolítására.
            </p>

            <h4 className="font-bold text-[#0f241a]">5. Dohányzás</h4>
            <p>
              A faházak belső terében a dohányzás (beleértve az e-cigarettát és hevítő rudakat is) szigorúan tilos! Dohányozni kizárólag a kültéri teraszon, a kijelölt hamutartók mellett engedélyezett.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-stone-200 text-right">
            <button
              onClick={onClose}
              className="bg-[#1b4332] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d6a4f] transition-colors cursor-pointer"
            >
              Elfogadom és bezárom
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Floating Cookie Consent Banner
  if (!cookieAccepted) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#0f241a] text-white p-5 rounded-2xl shadow-2xl border border-[#2d6a4f]/60 backdrop-blur-xl animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1b4332] text-[#c5a880] flex items-center justify-center shrink-0 mt-0.5">
            🍪
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-white">Sütik (Cookie-k) Használata</h4>
            <p className="text-stone-300 text-xs mt-1 leading-relaxed">
              Weboldalunk sütiket használ a biztonságos foglalási folyamat biztosítása és a felhasználói élmény fokozása érdekében.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleAcceptCookies}
                className="bg-[#c5a880] hover:bg-[#d4af37] text-[#0f241a] px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Minden Süti Elfogadása
              </button>
              <button
                onClick={handleAcceptCookies}
                className="bg-white/10 hover:bg-white/20 text-stone-300 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Csak a Szükségesek
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
