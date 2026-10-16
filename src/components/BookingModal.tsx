import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Users,
  CheckCircle,
  CreditCard,
  Building,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSiteData } from '../context/SiteDataContext';
import { Booking } from '../types';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    selectedRoomId,
    rooms,
    services,
    content,
    refreshSiteData
  } = useSiteData();

  // Wizard steps: 1: Időpont & Ház -> 2: Extrák -> 3: Vendégadatok -> 4: Fizetés & Megerősítés -> 5: Siker
  const [step, setStep] = useState<number>(1);

  // Form State
  const defaultIn = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultOut = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [roomId, setRoomId] = useState<string>('');
  const [checkIn, setCheckIn] = useState<string>(defaultIn);
  const [checkOut, setCheckOut] = useState<string>(defaultOut);
  const [guestsCount, setGuestsCount] = useState<number>(2);

  const [selectedExtras, setSelectedExtras] = useState<{ [serviceId: string]: boolean }>({});

  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState<boolean>(false);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'szep_card' | 'bank_transfer'>('card');
  const [szepBank, setSzepBank] = useState<'OTP' | 'MBH' | 'KH'>('OTP');

  // Calculation & Verification state
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Sync selectedRoomId from trigger
  useEffect(() => {
    if (selectedRoomId) {
      setRoomId(selectedRoomId);
    } else if (rooms.length > 0 && !roomId) {
      setRoomId(rooms[0].id);
    }
  }, [selectedRoomId, rooms, roomId]);

  // Whenever modal opens, reset state
  useEffect(() => {
    if (isBookingModalOpen) {
      setStep(1);
      setErrorMessage('');
      setCreatedBooking(null);
    }
  }, [isBookingModalOpen]);

  if (!isBookingModalOpen) return null;

  const currentRoom = rooms.find((r) => r.id === roomId) || rooms[0];

  // Extra purchasable services
  const purchasableServices = services.filter((s) => !s.isIncluded && s.extraPrice);

  // Check Availability with backend
  const handleVerifyStep1 = async () => {
    setErrorMessage('');
    if (!roomId) {
      setErrorMessage('Kérjük, válassz ki egy szállásegységet!');
      return;
    }
    if (!checkIn || !checkOut) {
      setErrorMessage('Kérjük, válaszd ki az érkezési és távozási dátumokat!');
      return;
    }
    if (checkIn >= checkOut) {
      setErrorMessage('A távozási dátumnak az érkezés után kell lennie!');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch(
        `/api/availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guestsCount}`
      );
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'A kiválasztott időpont nem foglalható.');
      } else if (!data.available) {
        setErrorMessage(data.message || 'Ez a szállásegység a választott időszakban már foglalt.');
      } else {
        setQuoteData(data);
        setStep(2);
      }
    } catch {
      setErrorMessage('Hálózati hiba a szabad időpontok ellenőrzése során.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Calculate grand total dynamically
  const calculateTotals = () => {
    const base = quoteData?.baseTotal || 0;
    const ifa = quoteData?.touristTaxTotal || 0;
    const nights = quoteData?.nights || 1;

    let extras = 0;
    purchasableServices.forEach((srv) => {
      if (selectedExtras[srv.id]) {
        // If breakfast, multiply by guests and nights
        if (srv.id === 'srv-3') {
          extras += (srv.extraPrice || 0) * guestsCount * nights;
        } else {
          extras += srv.extraPrice || 0;
        }
      }
    });

    const grand = base + ifa + extras;
    const depositPct = content?.policy?.depositPercentage || 30;
    const deposit = Math.round(grand * (depositPct / 100));

    return { base, extras, ifa, grand, deposit };
  };

  const totals = calculateTotals();

  // Step 3 to 4: Create booking in pending status on the server
  const handleCreateBooking = async () => {
    setErrorMessage('');
    if (!guestName || !guestEmail || !guestPhone) {
      setErrorMessage('Kérjük, töltsd ki az összes kötelező elérhetőségi adatot!');
      return;
    }
    if (!acceptTerms || !acceptPrivacy) {
      setErrorMessage('A foglaláshoz el kell fogadnod a Házirendet és az Adatkezelési tájékoztatót!');
      return;
    }

    setIsVerifying(true);
    try {
      const extrasArray = purchasableServices
        .filter((s) => selectedExtras[s.id])
        .map((s) => ({
          serviceId: s.id,
          title: s.title,
          price:
            s.id === 'srv-3'
              ? (s.extraPrice || 0) * guestsCount * (quoteData?.nights || 1)
              : s.extraPrice || 0
        }));

      const payload = {
        roomId,
        guestName,
        guestEmail,
        guestPhone,
        checkIn,
        checkOut,
        guestsCount,
        selectedExtras: extrasArray,
        specialRequests,
        paymentMethod
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Hiba történt a foglalás rögzítésekor.');
      } else {
        setCreatedBooking(data.booking);
        setStep(4);
      }
    } catch {
      setErrorMessage('Hálózati hiba a foglalás létrehozása során.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Step 4: Confirm payment & finalize
  const handleConfirmPayment = async () => {
    if (!createdBooking) return;
    setIsProcessingPayment(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: createdBooking.id,
          amount: createdBooking.depositRequired,
          paymentMethod,
          transactionRef: `TRX-${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'A fizetés megerősítése sikertelen volt.');
      } else {
        setCreatedBooking(data.booking);
        setStep(5);
        refreshSiteData();
        // Trigger festive confetti!
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          console.error(e);
        }
      }
    } catch {
      setErrorMessage('Hálózati hiba a fizetés feldolgozása közben.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#0f241a] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#2d6a4f]/40 relative">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#c5a880] uppercase">
              Zuzmo Kabin Vendégház • Online Foglalás
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
              {step === 5 ? '🎉 Foglalás Megerősítve!' : 'Közvetlen Szállásfoglalás'}
            </h2>
          </div>

          <button
            onClick={closeBookingModal}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Bar */}
        {step < 5 && (
          <div className="bg-[#f4efea] px-6 py-3 border-b border-stone-200 flex items-center justify-between text-xs font-medium text-stone-500 overflow-x-auto">
            <span className={step >= 1 ? 'text-[#1b4332] font-bold flex items-center gap-1.5' : ''}>
              1. Időpont & Ház
            </span>
            <span>→</span>
            <span className={step >= 2 ? 'text-[#1b4332] font-bold flex items-center gap-1.5' : ''}>
              2. Kényelmi Extrák
            </span>
            <span>→</span>
            <span className={step >= 3 ? 'text-[#1b4332] font-bold flex items-center gap-1.5' : ''}>
              3. Vendégadatok
            </span>
            <span>→</span>
            <span className={step >= 4 ? 'text-[#1b4332] font-bold flex items-center gap-1.5' : ''}>
              4. Fizetés & Előleg
            </span>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-700 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* STEP 1: Date & Room Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Válassz Szállásegységet *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setRoomId(room.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        roomId === room.id
                          ? 'border-[#1b4332] bg-[#1b4332]/5 shadow-md'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                      }`}
                    >
                      <div>
                        <div className="aspect-video rounded-xl overflow-hidden mb-2">
                          <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-serif font-bold text-[#0f241a] text-sm">{room.name}</h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">Max. {room.capacity} fő</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-stone-200 text-xs font-bold text-[#1b4332]">
                        {room.basePricePerNight.toLocaleString('hu-HU')} Ft / éjtől
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#1b4332]" />
                    Érkezés dátuma *
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#1b4332]" />
                    Távozás dátuma *
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                  />
                </div>
              </div>

              {/* Guests Count */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#1b4332]" />
                  Vendégek száma (felnőttek és gyermekek)
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm bg-white"
                >
                  {Array.from({ length: currentRoom?.capacity || 4 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} vendég
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-400 mt-1">
                  A választott házban maximum {currentRoom?.capacity || 4} fő szállásolható el.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Optional Extras */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-[#1b4332]/5 border border-[#1b4332]/20 rounded-2xl p-4 flex items-center justify-between text-sm">
                <div>
                  <span className="font-serif font-bold text-[#0f241a] block">
                    {quoteData?.room?.name}
                  </span>
                  <span className="text-stone-500 text-xs">
                    {checkIn} – {checkOut} ({quoteData?.nights} éjszaka, {guestsCount} fő)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400 block">Szállás alapára</span>
                  <span className="font-serif font-bold text-[#1b4332] text-base">
                    {quoteData?.baseTotal?.toLocaleString('hu-HU')} Ft
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider mb-3">
                  Válassz Prémium Bekészítéseket & Kényelmi Csomagokat
                </h3>

                <div className="space-y-3">
                  {purchasableServices.map((srv) => {
                    const isChecked = !!selectedExtras[srv.id];
                    const priceFormatted =
                      srv.id === 'srv-3'
                        ? `${(srv.extraPrice || 0).toLocaleString('hu-HU')} Ft / fő / reggeli`
                        : `${(srv.extraPrice || 0).toLocaleString('hu-HU')} Ft / tartózkodás`;

                    return (
                      <div
                        key={srv.id}
                        onClick={() =>
                          setSelectedExtras({ ...selectedExtras, [srv.id]: !isChecked })
                        }
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'border-[#1b4332] bg-[#1b4332]/5'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-5 h-5 text-[#1b4332] rounded focus:ring-0 cursor-pointer"
                          />
                          <div>
                            <h4 className="font-serif font-bold text-[#0f241a] text-sm">{srv.title}</h4>
                            <p className="text-stone-500 text-xs mt-0.5">{srv.description}</p>
                          </div>
                        </div>
                        <div className="font-semibold text-stone-800 text-xs sm:text-sm whitespace-nowrap ml-4">
                          +{priceFormatted}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price calculation summary box */}
              <div className="bg-[#f4efea] p-5 rounded-2xl border border-stone-200 space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Szállásdíj ({quoteData?.nights} éj):</span>
                  <span>{totals.base.toLocaleString('hu-HU')} Ft</span>
                </div>
                {totals.extras > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Választott extrák:</span>
                    <span>+{totals.extras.toLocaleString('hu-HU')} Ft</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Idegenforgalmi adó (IFA):</span>
                  <span>+{totals.ifa.toLocaleString('hu-HU')} Ft</span>
                </div>
                <div className="pt-2 border-t border-stone-300 flex justify-between font-serif font-bold text-base text-[#0f241a]">
                  <span>Végösszeg:</span>
                  <span>{totals.grand.toLocaleString('hu-HU')} Ft</span>
                </div>
                <div className="flex justify-between text-xs text-[#1b4332] font-semibold pt-1">
                  <span>Foglaláshoz fizetendő előleg ({content?.policy?.depositPercentage || 30}%):</span>
                  <span>{totals.deposit.toLocaleString('hu-HU')} Ft</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Guest Information */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Teljes Név *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="pl. Kiss Péter"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    E-mail cím * (ide küldjük a visszaigazolást)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="pl. pelda@email.hu"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Telefonszám *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="pl. +36 30 123 4567"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Egyedi kérések, megjegyzések (opcionális)
                </label>
                <textarea
                  rows={2}
                  placeholder="pl. Várható érkezési idő, dézsa előzetes felfűtése, diétás kérések a reggelihez..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1b4332] text-sm"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Preferált Fizetési Mód
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                      paymentMethod === 'card'
                        ? 'border-[#1b4332] bg-[#1b4332]/5 text-[#0f241a]'
                        : 'border-stone-200 bg-stone-50 text-stone-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#1b4332]" />
                    <span className="text-xs font-bold">Bankkártya</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('szep_card')}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                      paymentMethod === 'szep_card'
                        ? 'border-[#1b4332] bg-[#1b4332]/5 text-[#0f241a]'
                        : 'border-stone-200 bg-stone-50 text-stone-600'
                    }`}
                  >
                    <Building className="w-5 h-5 text-[#1b4332]" />
                    <span className="text-xs font-bold">SZÉP Kártya</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#1b4332] bg-[#1b4332]/5 text-[#0f241a]'
                        : 'border-stone-200 bg-stone-50 text-stone-600'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-[#1b4332]" />
                    <span className="text-xs font-bold">Banki Átutalás</span>
                  </div>
                </div>

                {paymentMethod === 'szep_card' && (
                  <div className="mt-2 flex gap-2">
                    {(['OTP', 'MBH', 'KH'] as const).map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setSzepBank(b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          szepBank === b
                            ? 'bg-[#1b4332] text-white'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {b} SZÉP Kártya
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="pt-2 space-y-2 text-xs text-stone-600">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 text-[#1b4332] mt-0.5 rounded focus:ring-0"
                  />
                  <span>
                    Elolvastam és elfogadom a <strong>Házirendet és Lemondási Feltételeket</strong> (érkezés előtt 14 nappal díjmentesen lemondható).
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptPrivacy}
                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                    className="w-4 h-4 text-[#1b4332] mt-0.5 rounded focus:ring-0"
                  />
                  <span>
                    Hozzájárulok a megadott adataim kezeléséhez a foglalás lebonyolítása céljából az <strong>Adatkezelési Tájékoztatónak</strong> megfelelően.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Execution & Summary */}
          {step === 4 && createdBooking && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block p-3 rounded-full bg-emerald-100 text-emerald-800 mb-2">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#0f241a]">
                  Foglalási Azonosító: {createdBooking.id}
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm mt-1">
                  A foglalást rögzítettük. Az alábbi előleg befizetésével válik véglegessé a foglalásod.
                </p>
              </div>

              {/* Payment Summary Card */}
              <div className="bg-[#f4efea] p-5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Szállásegység:</span>
                  <span className="font-semibold text-[#0f241a]">{createdBooking.roomName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Dátum:</span>
                  <span className="font-semibold text-[#0f241a]">
                    {createdBooking.checkIn} – {createdBooking.checkOut} ({createdBooking.nights} éj)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Vendégek:</span>
                  <span className="font-semibold text-[#0f241a]">{createdBooking.guestsCount} fő</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Teljes szállásköltség:</span>
                  <span className="font-semibold text-[#0f241a]">
                    {createdBooking.grandTotal.toLocaleString('hu-HU')} Ft
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-300 flex justify-between font-serif font-bold text-lg text-[#1b4332]">
                  <span>Fizetendő Előleg (30%):</span>
                  <span>{createdBooking.depositRequired.toLocaleString('hu-HU')} Ft</span>
                </div>
              </div>

              {/* Online Payment Interface Simulator */}
              <div className="p-5 border-2 border-dashed border-[#1b4332]/40 rounded-2xl bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {paymentMethod === 'card' && <CreditCard className="w-5 h-5 text-[#1b4332]" />}
                    {paymentMethod === 'szep_card' && <Building className="w-5 h-5 text-[#1b4332]" />}
                    {paymentMethod === 'bank_transfer' && <ShieldCheck className="w-5 h-5 text-[#1b4332]" />}
                    <span className="font-serif font-bold text-[#0f241a]">
                      {paymentMethod === 'card' && 'Biztonságos Online Bankkártyás Fizetés'}
                      {paymentMethod === 'szep_card' && `${szepBank} SZÉP Kártya Közvetlen Zárolás`}
                      {paymentMethod === 'bank_transfer' && 'Azonnali Banki Átutalás Adatok'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    256-bit SSL Védelem
                  </span>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600">
                      💳 A tesztkörnyezetben a gombra kattintva a fizetés automatikusan és biztonságosan jóváírásra kerül.
                    </div>
                  </div>
                )}

                {paymentMethod === 'szep_card' && (
                  <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600">
                    🏨 <strong>{szepBank} SZÉP Kártya</strong> azonosító: <strong>ZUZMO-OTP-99214</strong>. A gombra kattintva a zárolás szimulációja lefut és a foglalás megerősítést nyer.
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 space-y-1">
                    <div><strong>Kedvezményezett:</strong> Zuzmo Kabin Vendégház</div>
                    <div><strong>Bankszámlaszám:</strong> 11773000-12345678-00000000 (OTP Bank)</div>
                    <div><strong>Közlemény rovatba:</strong> {createdBooking.id}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Success & Confirmation View */}
          {step === 5 && createdBooking && (
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div>
                <span className="text-xs font-mono text-[#c5a880] tracking-widest uppercase">
                  Sikeres Fizetés & Megerősített Időpont
                </span>
                <h3 className="text-3xl font-serif font-bold text-[#0f241a] mt-1">
                  Köszönjük a foglalásodat, {createdBooking.guestName}!
                </h3>
                <p className="text-stone-600 text-sm mt-2 max-w-md mx-auto">
                  Visszaigazoló e-mailt küldtünk a megadott e-mail címre (<strong>{createdBooking.guestEmail}</strong>).
                </p>
              </div>

              {/* Printable Voucher Slip */}
              <div className="bg-[#f4efea] p-6 rounded-3xl border border-stone-200 text-left max-w-lg mx-auto shadow-inner space-y-3 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-stone-300">
                  <span className="font-serif font-bold text-lg text-[#0f241a]">Zuzmo Kabin Vendégház</span>
                  <span className="font-mono text-xs bg-[#1b4332] text-white px-2.5 py-1 rounded-md">
                    {createdBooking.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-stone-400 block">Ház:</span>
                    <strong className="text-stone-800">{createdBooking.roomName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Vendégek:</span>
                    <strong className="text-stone-800">{createdBooking.guestsCount} fő</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Érkezés:</span>
                    <strong className="text-stone-800">{createdBooking.checkIn} (15:00-tól)</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Távozás:</span>
                    <strong className="text-stone-800">{createdBooking.checkOut} (10:00-ig)</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-300 flex justify-between items-center">
                  <span className="text-stone-500">Befizetett előleg:</span>
                  <span className="font-serif font-bold text-[#1b4332] text-base">
                    {createdBooking.depositPaid.toLocaleString('hu-HU')} Ft
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-5 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Visszaigazolás Nyomtatása</span>
                </button>
                <button
                  onClick={closeBookingModal}
                  className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-7 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-colors cursor-pointer"
                >
                  Bezárás & Vissza a Főoldalra
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        {step < 5 && (
          <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-medium text-xs sm:text-sm px-4 py-2 rounded-xl hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Vissza</span>
              </button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleVerifyStep1}
                className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isVerifying ? 'Ellenőrzés...' : 'Tovább az Extrákhoz'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>Tovább az Adatokhoz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleCreateBooking}
                className="bg-[#c5a880] hover:bg-[#d4af37] text-[#0f241a] font-bold px-7 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isVerifying ? 'Rögzítés...' : 'Tovább a Fizetéshez'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleConfirmPayment}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <span>
                  {isProcessingPayment
                    ? 'Feldolgozás...'
                    : `Előleg Fizetése (${createdBooking?.depositRequired?.toLocaleString('hu-HU')} Ft)`}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
