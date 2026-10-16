import React, { useState } from 'react';
import {
  Bath,
  Flame,
  Coffee,
  Heart,
  Car,
  Sparkles,
  Wifi,
  Compass,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const ServicesSection: React.FC = () => {
  const { services } = useSiteData();
  const [filter, setFilter] = useState<string>('all');

  // Map icon string names to Lucide icons
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bath':
        return <Bath className="w-6 h-6 text-[#1b4332]" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-[#1b4332]" />;
      case 'Coffee':
        return <Coffee className="w-6 h-6 text-[#1b4332]" />;
      case 'Heart':
        return <Heart className="w-6 h-6 text-[#1b4332]" />;
      case 'Car':
        return <Car className="w-6 h-6 text-[#1b4332]" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-[#1b4332]" />;
      case 'Wifi':
        return <Wifi className="w-6 h-6 text-[#1b4332]" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-[#1b4332]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#1b4332]" />;
    }
  };

  const categories = [
    { id: 'all', label: 'Összes Szolgáltatás' },
    { id: 'wellness', label: 'Wellness & Pihenés' },
    { id: 'gasztronomia', label: 'Gasztronómia' },
    { id: 'kenyelem', label: 'Kényelem & Technológia' },
    { id: 'aktiv', label: 'Erdei Élmények' },
  ];

  const filteredServices = services.filter((s) => {
    if (filter === 'all') return true;
    return s.category === filter;
  });

  return (
    <section id="szolgaltatasok" className="py-24 bg-[#faf8f5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-3">
            <span>Kényeztetés & Felszereltség</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f241a]">
            Szolgáltatásaink az Ön Kényelméért
          </h2>
          <p className="mt-4 text-stone-600 text-base sm:text-lg">
            A Zuzmara Vendégházban mindent biztosítunk a gondtalan regenerációhoz: privát wellness eszközök, friss helyi ízek és erdei élmények várnak.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  filter === cat.id
                    ? 'bg-[#1b4332] text-white shadow-md'
                    : 'bg-stone-200/60 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-stone-200/70 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Icon & Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#f4efea] group-hover:bg-[#c5a880]/20 flex items-center justify-center transition-colors">
                    {renderIcon(service.icon)}
                  </div>
                  {service.isIncluded ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Az árban</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Tag className="w-3 h-3 text-amber-600" />
                      <span>+{service.extraPrice?.toLocaleString('hu-HU')} Ft</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-serif font-bold text-[#0f241a] group-hover:text-[#1b4332] transition-colors">
                  {service.title}
                </h3>
                <p className="text-stone-600 text-sm mt-2 leading-relaxed font-light">
                  {service.description}
                </p>
              </div>

              {/* Extra note or indicator */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                <span className="capitalize">{service.category}</span>
                {service.isIncluded ? (
                  <span className="text-emerald-700 font-medium">Korlátlan használat</span>
                ) : (
                  <span className="text-amber-700 font-medium">Foglaláskor választható</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
