import React from 'react';
import { KeyRound, Trees, Coffee, ShieldCheck } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { formatImgUrl, handleImageError } from '../utils/formatImage';

export const AboutSection: React.FC = () => {
  const { content } = useSiteData();
  const about = content?.about;

  return (
    <section id="bemutatkozas" className="py-24 bg-[#faf8f5] relative overflow-hidden">
      {/* Decorative subtle pine background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1b4332]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-semibold tracking-wider uppercase">
              <span>Zuzmo Kabin Vendégház</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f241a] leading-tight">
              {about?.title || 'A Helyről'}
            </h2>

            <p className="text-lg text-[#c5a880] font-medium font-serif italic">
              {about?.subtitle || 'Kikapcsolódás a Dunakanyar erdőszélén'}
            </p>

            <div className="space-y-4 text-stone-600 leading-relaxed font-light text-base sm:text-lg">
              <p>
                {about?.storyParagraph1 ||
                  'A Dunakanyarban, Nagymaroson, a Szekér utcában, az erdő szélén várja vendégeit a Zuzmo Kabin Vendégház.'}
              </p>
              <p>
                {about?.storyParagraph2 ||
                  'A teljesen önálló ház és a hozzá tartozó kerthelyiség ideális akár 6 fős társaságok, családok és párok számára is. A madárcsicsergés, a természet közelsége, a grillezési és bográcsozási lehetőség, valamint a privát pezsgőfürdő gondoskodik a kikapcsolódásról.'}
              </p>
              <p>
                {about?.storyParagraph3 ||
                  'A földszinten amerikai konyhás nappali található két kihúzható, kényelmes kanapéval és meleg vizes fürdőszobával. Az emeleten két hálószoba kapott helyet: az egyikben franciaágy, a másikban két egyszemélyes ágy biztosít kényelmes pihenést.'}
              </p>
              <p>
                {about?.storyParagraph4 ||
                  'A ház minden évszakban használható, légkondicionálóval és fűtéssel felszerelt.'}
              </p>
              <p className="font-serif font-semibold text-[#1b4332] text-lg pt-1">
                {about?.closingNote || 'Várjuk szeretettel vendégeinket!'}
              </p>
            </div>

            {/* Kiemelt előnyök (3 key highlights) */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-stone-200">
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332]">
                  <KeyRound className="w-5 h-5 text-[#c5a880]" />
                </div>
                <h3 className="font-serif font-bold text-[#0f241a] text-sm">Önálló bejutás</h3>
                <p className="text-stone-500 text-xs leading-snug">
                  A vendégek zárható kulcsszéf segítségével, önállóan juthatnak be a házba.
                </p>
              </div>

              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332]">
                  <Trees className="w-5 h-5 text-[#c5a880]" />
                </div>
                <h3 className="font-serif font-bold text-[#0f241a] text-sm">Gyönyörű környék</h3>
                <p className="text-stone-500 text-xs leading-snug">
                  Pihenés a Dunakanyarban, Nagymaros erdőszéli, festői környezetében.
                </p>
              </div>

              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332]">
                  <Coffee className="w-5 h-5 text-[#c5a880]" />
                </div>
                <h3 className="font-serif font-bold text-[#0f241a] text-sm">Kávézás otthon</h3>
                <p className="text-stone-500 text-xs leading-snug">
                  Csepegtetős kávéfőző áll a vendégek rendelkezésére, hogy jól induljon a reggel.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image Composition with Real Photos */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary real exterior image */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-stone-900">
                <img
                  src={formatImgUrl(about?.image1 || 'dc25c9c8-5452-4cf6-a901-9f26c6f8360d.jpeg')}
                  alt="Zuzmo Kabin Vendégház az erdő szélén"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80')}
                />
              </div>

              {/* Floating secondary real interior image */}
              <div className="hidden sm:block absolute -bottom-8 -left-8 w-3/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-stone-100">
                <img
                  src={formatImgUrl(about?.image2 || 'fda939cf-838f-4d9e-bbff-f558077614d3.jpeg')}
                  alt="Zuzmo Kabin nappali és terasz"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80')}
                />
              </div>

              {/* Decorative floating badge */}
              <div className="absolute -top-5 -right-5 bg-[#1b4332] text-white p-4 rounded-2xl shadow-xl border border-[#c5a880]/40 flex flex-col items-center">
                <span className="text-2xl font-serif font-bold text-[#c5a880]">100%</span>
                <span className="text-[11px] uppercase tracking-wider text-stone-200">Önálló Vendégház</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
