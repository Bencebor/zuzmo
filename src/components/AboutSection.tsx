import React from 'react';
import { Heart, Trees, Compass, ShieldCheck } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const AboutSection: React.FC = () => {
  const { content } = useSiteData();
  const about = content?.about;

  const pillarIcons = [
    <ShieldCheck key="1" className="w-6 h-6 text-[#c5a880]" />,
    <Trees key="2" className="w-6 h-6 text-[#c5a880]" />,
    <Heart key="3" className="w-6 h-6 text-[#c5a880]" />,
    <Compass key="4" className="w-6 h-6 text-[#c5a880]" />
  ];

  return (
    <section id="bemutatkozas" className="py-24 bg-[#faf8f5] relative overflow-hidden">
      {/* Decorative subtle pine background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1b4332]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-semibold tracking-wider uppercase">
              <span>A Zuzmara Története</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f241a] leading-tight">
              {about?.title || 'A Zuzmara Vendégház Története'}
            </h2>

            <p className="text-lg text-[#c5a880] font-medium font-serif italic">
              {about?.subtitle || 'Egy álom, amely a természet iránti mély tiszteletből született'}
            </p>

            <div className="space-y-4 text-stone-600 leading-relaxed font-light text-base sm:text-lg">
              <p>{about?.storyParagraph1}</p>
              <p>{about?.storyParagraph2}</p>
              <p>{about?.storyParagraph3}</p>
            </div>

            {/* Feature pillars */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-stone-200">
              {about?.features?.map((f, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#1b4332]/10 flex items-center justify-center shrink-0">
                    {pillarIcons[i % pillarIcons.length]}
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-[#0f241a] text-base">{f.title}</h3>
                    <p className="text-stone-500 text-sm mt-0.5 leading-snug">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary image */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]">
                <img
                  src={
                    about?.image1 ||
                    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80'
                  }
                  alt="Zuzmara faház erdei környezetben"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating secondary accent image */}
              <div className="hidden sm:block absolute -bottom-10 -left-10 w-3/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-stone-100">
                <img
                  src={
                    about?.image2 ||
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80'
                  }
                  alt="Hangulatos erdei pillanatok"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Decorative floating badge */}
              <div className="absolute -top-5 -right-5 bg-[#1b4332] text-white p-4 rounded-2xl shadow-xl border border-[#c5a880]/40 flex flex-col items-center">
                <span className="text-2xl font-serif font-bold text-[#c5a880]">100%</span>
                <span className="text-[11px] uppercase tracking-wider text-stone-200">Privát Erdei Birtok</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
