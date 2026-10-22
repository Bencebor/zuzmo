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
  isBookingModalOpen: boolean;
  selectedRoomId: string | null;
  openBookingModal: (roomId?: string) => void;
  closeBookingModal: () => void;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

const STATIC_GALLERY: MediaItem[] = [
  { id: 'zuzmo-01', title: 'Zuzmó Vendégház – 1. fotó', url: '/gallery/galeria-01.jpg', category: 'kulso', type: 'image' },
  { id: 'zuzmo-02', title: 'Zuzmó Vendégház – 2. fotó', url: '/gallery/galeria-02.jpg', category: 'kulso', type: 'image' },
  { id: 'zuzmo-03', title: 'Zuzmó Vendégház – 3. fotó', url: '/gallery/galeria-03.jpg', category: 'kulso', type: 'image' },
  { id: 'zuzmo-04', title: 'Zuzmó Vendégház – 4. fotó', url: '/gallery/galeria-04.jpg', category: 'nappali', type: 'image' },
  { id: 'zuzmo-05', title: 'Zuzmó Vendégház – 5. fotó', url: '/gallery/galeria-05.jpg', category: 'nappali', type: 'image' },
  { id: 'zuzmo-06', title: 'Zuzmó Vendégház – 6. fotó', url: '/gallery/galeria-06.jpg', category: 'nappali', type: 'image' },
  { id: 'zuzmo-07', title: 'Zuzmó Vendégház – 7. fotó', url: '/gallery/galeria-07.jpg', category: 'haloszobak', type: 'image' },
  { id: 'zuzmo-08', title: 'Zuzmó Vendégház – 8. fotó', url: '/gallery/galeria-08.jpg', category: 'haloszobak', type: 'image' },
  { id: 'zuzmo-09', title: 'Zuzmó Vendégház – 9. fotó', url: '/gallery/galeria-09.jpg', category: 'haloszobak', type: 'image' },
  { id: 'zuzmo-10', title: 'Zuzmó Vendégház – 10. fotó', url: '/gallery/galeria-10.jpg', category: 'haloszobak', type: 'image' },
  { id: 'zuzmo-11', title: 'Zuzmó Vendégház – 11. fotó', url: '/gallery/galeria-11.jpg', category: 'haloszobak', type: 'image' },
  { id: 'zuzmo-12', title: 'Zuzmó Vendégház – 12. fotó', url: '/gallery/galeria-12.jpg', category: 'furdoszoba', type: 'image' },
  { id: 'zuzmo-13', title: 'Zuzmó Vendégház – 13. fotó', url: '/gallery/galeria-13.jpg', category: 'furdoszoba', type: 'image' },
  { id: 'zuzmo-14', title: 'Zuzmó Vendégház – 14. fotó', url: '/gallery/galeria-14.jpg', category: 'furdoszoba', type: 'image' }
];

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
        setContent(data.content || null);
        setRooms(data.rooms || []);
        setHouseSpaces(data.houseSpaces || []);
        setServices(data.services || []);
        setGallery(Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : STATIC_GALLERY);
        setReviews(data.reviews || []);
        setFaqs(data.faqs || []);
        setSettings(data.settings || {});
      } else {
        setGallery(STATIC_GALLERY);
      }
    } catch (err) {
      console.error('Hiba a weboldal adatainak betöltésekor:', err);
      setGallery(STATIC_GALLERY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSiteData(); }, [fetchSiteData]);

  const openBookingModal = (roomId?: string) => {
    if (roomId) setSelectedRoomId(roomId);
    setIsBookingModalOpen(true);
  };
  const closeBookingModal = () => setIsBookingModalOpen(false);

  return (
    <SiteDataContext.Provider value={{ content, rooms, houseSpaces, services, gallery, reviews, faqs, settings, loading, refreshSiteData: fetchSiteData, isBookingModalOpen, selectedRoomId, openBookingModal, closeBookingModal }}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) throw new Error('useSiteData must be used within a SiteDataProvider');
  return context;
};
