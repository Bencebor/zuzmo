import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Home,
  Sparkles,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DashboardView } from './views/DashboardView';
import { BookingsView } from './views/BookingsView';
import { CalendarAdminView } from './views/CalendarAdminView';
import { RoomsView } from './views/RoomsView';
import { ServicesView } from './views/ServicesView';
import { ContentView } from './views/ContentView';
import { MediaView } from './views/MediaView';
import { ReviewsAdminView } from './views/ReviewsAdminView';
import { UsersView } from './views/UsersView';
import { SettingsView } from './views/SettingsView';

interface AdminLayoutProps {
  onBackToSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToSite }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const menuItems = [
    { id: 'dashboard', label: 'Irányítópult', icon: LayoutDashboard },
    { id: 'bookings', label: 'Foglalások', icon: CalendarCheck },
    { id: 'calendar', label: 'Naptár & Zárolások', icon: CalendarDays },
    { id: 'rooms', label: 'Szobák & Árak', icon: Home },
    { id: 'services', label: 'Szolgáltatások', icon: Sparkles },
    { id: 'content', label: 'Weboldal Szövegek', icon: FileText },
    { id: 'media', label: 'Fotó- & Videógaléria', icon: ImageIcon },
    { id: 'reviews', label: 'Vélemények', icon: MessageSquare },
    ...(user?.role === 'owner' ? [{ id: 'users', label: 'Felhasználók', icon: Users }] : []),
    { id: 'settings', label: 'Rendszer & E-mail', icon: Settings },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'bookings':
        return <BookingsView />;
      case 'calendar':
        return <CalendarAdminView />;
      case 'rooms':
        return <RoomsView />;
      case 'services':
        return <ServicesView />;
      case 'content':
        return <ContentView />;
      case 'media':
        return <MediaView />;
      case 'reviews':
        return <ReviewsAdminView />;
      case 'users':
        return <UsersView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigateTab={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0f241a] text-white flex-col justify-between shrink-0 border-r border-[#1b4332]">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1b4332] border border-[#c5a880]/50 flex items-center justify-center text-[#c5a880] text-lg font-serif">
              ❄️
            </div>
            <div>
              <span className="font-serif font-bold text-base text-white block">Zuzmara Admin</span>
              <span className="text-[10px] tracking-wider uppercase text-[#c5a880] block">
                {user?.role === 'owner' ? '👑 Tulajdonos' : '✍️ Szerkesztő'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#c5a880] text-[#0f241a] shadow-md font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-stone-200 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Weboldal Megtekintése</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kijelentkezés</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header bar */}
        <header className="bg-white border-b border-stone-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-serif font-bold text-[#0f241a] capitalize">
              {menuItems.find((m) => m.id === activeTab)?.label || 'Irányítópult'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-[#0f241a] block">{user?.name}</span>
              <span className="text-[10px] text-stone-400 block font-mono">{user?.email}</span>
            </div>

            <button
              onClick={onBackToSite}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <span>Vissza a Weboldalra</span>
            </button>
          </div>
        </header>

        {/* Dynamic View Container */}
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">{renderActiveView()}</main>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-[#0f241a] text-white flex flex-col justify-between p-4 z-10 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="font-serif font-bold text-base text-white">Zuzmara Admin</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-stone-300 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#c5a880] text-[#0f241a] font-bold'
                          : 'text-stone-300 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  onBackToSite();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium bg-white/10 text-stone-200"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Weboldal Megtekintése</span>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-rose-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Kijelentkezés</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
