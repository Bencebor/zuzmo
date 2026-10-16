export interface Room {
  id: string;
  name: string;
  tagline: string;
  description: string;
  capacity: number; // max guests
  bedrooms: number;
  bathrooms: number;
  sizeM2: number;
  basePricePerNight: number; // in HUF
  weekendPricePerNight: number; // in HUF
  minNights: number;
  images: string[];
  amenities: string[];
  featured: boolean;
  active: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon identifier
  isIncluded: boolean; // included in price or extra
  extraPrice?: number;
  category: 'wellness' | 'gasztronomia' | 'kenyelem' | 'aktiv';
  active: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  category: 'kulso' | 'wellness' | 'szobak' | 'hangulat';
  type: 'image' | 'video';
  thumbnail?: string;
  isCover?: boolean;
}

export interface Review {
  id: string;
  guestName: string;
  stayDate: string; // e.g. "2026. szeptember"
  roomName: string;
  rating: number; // 1-5
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  createdAt: string;
}

export interface Booking {
  id: string; // unique code e.g. "ZUZ-2026-8941"
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestsCount: number;
  nights: number;
  baseTotal: number;
  extrasTotal: number;
  touristTaxTotal: number; // IFA (500 Ft/fő/éj felnőtteknek)
  grandTotal: number;
  depositRequired: number; // e.g. 30% of grandTotal
  depositPaid: number;
  paymentMethod: 'card' | 'szep_card' | 'bank_transfer';
  paymentStatus: 'pending' | 'deposit_paid' | 'fully_paid' | 'refunded';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  selectedExtras: {
    serviceId: string;
    title: string;
    price: number;
  }[];
  specialRequests?: string;
  createdAt: string;
  notes?: string;
}

export interface BlockedDate {
  id: string;
  roomId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
}

export interface SiteContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    coverImage: string;
    announcement: string;
  };
  about: {
    title: string;
    subtitle: string;
    storyParagraph1: string;
    storyParagraph2: string;
    storyParagraph3: string;
    image1: string;
    image2: string;
    features: { title: string; desc: string }[];
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    locationNote: string;
    ntakNumber: string;
    gpsCoords: string;
  };
  policy: {
    checkInTime: string;
    checkOutTime: string;
    quietHours: string;
    cancellationDays: number;
    depositPercentage: number;
    touristTaxPerPersonPerNight: number;
  };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'foglalas' | 'wellness' | 'erkezes' | 'hazirend';
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'owner' | 'editor';
  name: string;
  createdAt: string;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  bookingId?: string;
  sentAt: string;
  type: 'booking_received' | 'booking_confirmed' | 'cancellation' | 'contact_inquiry';
  contentPreview: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}
