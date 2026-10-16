import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { RoomsSection } from './components/RoomsSection';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { BookingCalendarSection } from './components/BookingCalendarSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { LegalModals } from './components/LegalModals';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const { loading: siteLoading } = useSiteData();

  // Route state
  const [inAdmin, setInAdmin] = useState<boolean>(() => {
    return (
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#admin'
    );
  });

  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  // Sync route on popstate
  useEffect(() => {
    const handlePopState = () => {
      setInAdmin(
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#admin'
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setInAdmin(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSite = () => {
    window.history.pushState({}, '', '/');
    setInAdmin(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (siteLoading || authLoading) {
    return (
      <div className="min-h-screen bg-[#0f241a] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-2 border-[#c5a880] border-t-transparent animate-spin mb-4" />
        <span className="font-serif text-lg tracking-wide text-[#c5a880]">
          Zuzmo Kabin Vendégház
        </span>
        <span className="text-xs text-stone-400 mt-1">Betöltés folyamatban...</span>
      </div>
    );
  }

  // Admin section
  if (inAdmin) {
    if (!user) {
      return <AdminLogin onBackToSite={navigateToSite} />;
    }
    return <AdminLayout onBackToSite={navigateToSite} />;
  }

  // Public Website
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a201c] flex flex-col font-sans selection:bg-[#c5a880] selection:text-[#0f241a]">
      {/* Navigation */}
      <Navbar onAdminClick={navigateToAdmin} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <RoomsSection />
        <ServicesSection />
        <GallerySection />
        <ReviewsSection />
        <BookingCalendarSection />
        <FaqSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModal('privacy')}
        onOpenTerms={() => setLegalModal('terms')}
        onAdminClick={navigateToAdmin}
      />

      {/* Global Booking Modal */}
      <BookingModal />

      {/* Privacy & Terms Modals */}
      <LegalModals activeModal={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteDataProvider>
        <MainApp />
      </SiteDataProvider>
    </AuthProvider>
  );
}
