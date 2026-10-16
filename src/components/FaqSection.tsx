import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const FaqSection: React.FC = () => {
  const { faqs } = useSiteData();
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const categories = [
    { id: 'all', label: 'Összes Kérdés' },
    { id: 'erkezes', label: 'Érkezés & Megközelítés' },
    { id: 'wellness', label: 'Privát Pezsgőfürdő' },
    { id: 'foglalas', label: 'Foglalás & Fizetés' },
    { id: 'hazirend', label: 'Házirend & Kisállatok' },
  ];

  const filteredFaqs = faqs.filter((f) => {
    if (activeCategory === 'all') return true;
    return f.category === activeCategory;
  });

  return (
    <section id="gyik" className="py-24 bg-[#f4efea] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#1b4332]" />
            <span>Gyakori Kérdések</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f241a]">
            Gyakran Ismételt Kérdések
          </h2>
          <p className="mt-4 text-stone-600 text-base sm:text-lg">
            Minden hasznos tudnivaló az érkezésről, az önálló bejutásról, a pezsgőfürdőről és a nagymarosi vendégházról.
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-[#1b4332] text-white shadow-md'
                    : 'bg-stone-200/60 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Faq Items Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-[#0f241a] text-base sm:text-lg hover:text-[#1b4332] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#1b4332] text-white' : 'text-stone-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-stone-600 text-sm sm:text-base leading-relaxed border-t border-stone-100 font-light">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
