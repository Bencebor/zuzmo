import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteContent, Room, HouseSpace, ServiceItem, MediaItem, Review, FaqItem } from '../types';

interface SiteDataContextType {
  content: SiteContent | null;
  rooms: Room[];
  houseSpaces: HouseSpace[];
  services: ServiceItem[];
  gallery: MediaItem[];
  reviews: Review[];
  faqs: FaqItem[];
  settings: any;
  loading: boolean;
  refreshSiteData: () => Promise<void>;
  // Quick booking modal controller
  isBookingModalOpen: boolean;
  selectedRoomId: string | null;
  openBookingModal: (roomId?: string) => void;
  closeBookingModal: () => void;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [houseSpaces, setHouseSpaces] = useState<HouseSpace[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const fetchSiteData = useCallback(async () => {
    try {
      const res = await fetch('/api/site-data');
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
        setRooms(data.rooms || []);
        setHouseSpaces(data.houseSpaces || []);
        setServices(data.services || []);
        setGallery(data.gallery || []);
        setReviews(data.reviews || []);
        setFaqs(data.faqs || []);
        setSettings(data.settings || {});
      }
    } catch (err) {
      console.error('Hiba a weboldal adatainak betöltésekor:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  const openBookingModal = (roomId?: string) => {
    if (roomId) {
      setSelectedRoomId(roomId);
    }
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  return (
    <SiteDataContext.Provider
      value={{
        content,
        rooms,
        houseSpaces,
        services,
        gallery,
        reviews,
        faqs,
        settings,
        loading,
        refreshSiteData: fetchSiteData,
        isBookingModalOpen,
        selectedRoomId,
        openBookingModal,
        closeBookingModal
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
