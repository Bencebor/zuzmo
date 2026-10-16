import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

app.use(express.json({ limit: '10mb' }));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing helper
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return { hash, salt: actualSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
}

// Initial seed data with authentic Hungarian guesthouse details
function getInitialSeedData() {
  const defaultAdminSalt = crypto.randomBytes(16).toString('hex');
  const defaultAdminHash = crypto.scryptSync('Zuzmara2026!', defaultAdminSalt, 64).toString('hex');

  const editorSalt = crypto.randomBytes(16).toString('hex');
  const editorHash = crypto.scryptSync('Editor2026!', editorSalt, 64).toString('hex');

  return {
    users: [
      {
        id: 'usr_owner_1',
        username: 'admin',
        email: 'hello@zuzmaravendeghaz.hu',
        name: 'Kovács Balázs (Tulajdonos)',
        role: 'owner',
        hash: defaultAdminHash,
        salt: defaultAdminSalt,
        createdAt: '2026-01-10T10:00:00Z',
      },
      {
        id: 'usr_editor_1',
        username: 'szerkeszto',
        email: 'szerkeszto@zuzmaravendeghaz.hu',
        name: 'Varga Dóra (Tartalomfelelős)',
        role: 'editor',
        hash: editorHash,
        salt: editorSalt,
        createdAt: '2026-02-01T12:00:00Z',
      },
    ],
    rooms: [
      {
        id: 'room-1',
        name: 'Erdőzsongás Prémium Faház',
        tagline: 'Közvetlen erdőszéli luxusház privát dézsával és panoráma szaunával',
        description: 'Tágas, skandináv stílusú prémium faház hatalmas üvegfalakkal, amelyekből a fenyves erdőre nyílik kilátás. Privát fatüzelésű jakuzzi a teraszon, belső öntöttvas kandalló és teljes kényelem.',
        capacity: 4,
        bedrooms: 2,
        bathrooms: 1,
        sizeM2: 68,
        basePricePerNight: 58000,
        weekendPricePerNight: 68000,
        minNights: 2,
        images: [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: [
          'Privát melegvizes dézsa',
          'Fatüzelésű kandalló',
          'Panorámás terasz napozóágyakkal',
          'Nespresso kávégép & tea válogatás',
          'Teljesen felszerelt konyha',
          'Starlink High-Speed Wi-Fi',
          'Padlófűtés & hűtő-fűtő klíma',
          'Prémium bio kozmetikumok'
        ],
        featured: true,
        active: true
      },
      {
        id: 'room-2',
        name: 'Zuzmara Panoráma Lodge',
        tagline: 'Exkluzív páros kuckó beépített hidromasszázs káddal és erdőpanorámával',
        description: 'Kifejezetten pároknak megálmodott romantikus menedék. Az ágyból és a szabadon álló dizájn kádból is a csillagos égboltot és a lombok lágy ringását élvezhetitek.',
        capacity: 2,
        bedrooms: 1,
        bathrooms: 1,
        sizeM2: 45,
        basePricePerNight: 46000,
        weekendPricePerNight: 54000,
        minNights: 2,
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: [
          'Szabadon álló panoráma kád',
          'King-size prémium matrac',
          'Elektromos látványkandalló',
          'Bose Bluetooth hangrendszer',
          'Nespresso kávégép',
          'Privát fedett terasz függőággyal',
          'Fürdőköpeny és papucs bekészítés'
        ],
        featured: true,
        active: true
      },
      {
        id: 'room-3',
        name: 'Hegyvidéki Családi Villa',
        tagline: 'Két szintes tágas vendégház nagy családoknak vagy baráti társaságoknak',
        description: 'Három külön hálószobával, hatalmas amerikai konyhás nappalival, tágas kültéri pihenőkerttel és privát szaunaházzal ellátott prémium hegyi otthon.',
        capacity: 6,
        bedrooms: 3,
        bathrooms: 2,
        sizeM2: 110,
        basePricePerNight: 78000,
        weekendPricePerNight: 92000,
        minNights: 2,
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: [
          'Privát finn szaunaház',
          '8 személyes fedett étkezőterasz',
          'Kerti grillező & bográcsozó szett',
          '2 külön fürdőszoba',
          'Mosogatógép & mosógép',
          'Társasjáték sarok & könyvtár',
          'Borbár válogatás a legjobb helyi pincészetekből'
        ],
        featured: false,
        active: true
      }
    ],
    services: [
      {
        id: 'srv-1',
        title: 'Fatüzelésű Erdei Dézsafürdő',
        description: '38-40 fokos parajdi sós forró fürdő a csillagos égbolt alatt, közvetlenül az erdő szélén.',
        icon: 'Bath',
        isIncluded: true,
        category: 'wellness',
        active: true
      },
      {
        id: 'srv-2',
        title: 'Panorámás Finn Szauna',
        description: 'Hőkezelt rezgőnyárból épült szaunakabin illóolajokkal és merülő vödörrel a teljes regenerációért.',
        icon: 'Flame',
        isIncluded: true,
        category: 'wellness',
        active: true
      },
      {
        id: 'srv-3',
        title: 'Kézműves Reggeli Kosár',
        description: 'Környékbeli kistermelők sajtjai, füstölt finomságai, friss kovászos kenyér, házi lekvárok és friss gyümölcslé az ajtótok elé készítve.',
        icon: 'Coffee',
        isIncluded: false,
        extraPrice: 4500, // Ft/fő/reggeli
        category: 'gasztronomia',
        active: true
      },
      {
        id: 'srv-4',
        title: 'Romantikus Érkezési Csomag',
        description: 'Hűtött prémium pezsgő, kézműves bonbonválogatás és friss virágcsokor várja a párokat.',
        icon: 'Heart',
        isIncluded: false,
        extraPrice: 12900,
        category: 'gasztronomia',
        active: true
      },
      {
        id: 'srv-5',
        title: 'Zárt Kamerás Parkoló',
        description: 'Elektromos autó töltési lehetőséggel ellátott (Type 2) biztonságos belső udvari parkolás.',
        icon: 'Car',
        isIncluded: true,
        category: 'kenyelem',
        active: true
      },
      {
        id: 'srv-6',
        title: 'Erdei Tűzrakó & Grillező',
        description: 'Előkészített száraz bükkfa, bogrács, nyársak és modern grillfelszerelés a hangulatos estékhez.',
        icon: 'Sparkles',
        isIncluded: true,
        category: 'aktiv',
        active: true
      },
      {
        id: 'srv-7',
        title: 'Starlink Prémium Wi-Fi',
        description: 'Stabil, villámgyors műholdas internet, ha a pihenés mellett home office munkára is szükség lenne.',
        icon: 'Wifi',
        isIncluded: true,
        category: 'kenyelem',
        active: true
      },
      {
        id: 'srv-8',
        title: 'E-Bike Kölcsönzés & Túratérkép',
        description: 'Prémium elektromos össztelós hegyikerékpárok előre beállított erdei GPS útvonalakkal.',
        icon: 'Compass',
        isIncluded: false,
        extraPrice: 9500,
        category: 'aktiv',
        active: true
      }
    ],
    gallery: [
      {
        id: 'gal-1',
        title: 'Zuzmara Vendégház téli reggelen',
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80',
        category: 'kulso',
        type: 'image',
        isCover: true
      },
      {
        id: 'gal-2',
        title: 'Privát gőzölgő dézsafürdő a fenyvesben',
        url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
        category: 'wellness',
        type: 'image'
      },
      {
        id: 'gal-3',
        title: 'Tágas nappali hatalmas erdei üvegfelületekkel',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        category: 'szobak',
        type: 'image'
      },
      {
        id: 'gal-4',
        title: 'Romantikus kandalló pattogó tűzzel',
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        category: 'hangulat',
        type: 'image'
      },
      {
        id: 'gal-5',
        title: 'Finn szauna kilátással a természetre',
        url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
        category: 'wellness',
        type: 'image'
      },
      {
        id: 'gal-6',
        title: 'Reggeli a napsütötte erdei teraszon',
        url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
        category: 'hangulat',
        type: 'image'
      },
      {
        id: 'gal-7',
        title: 'Modern hálószoba prémium pamut ágyneművel',
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        category: 'szobak',
        type: 'image'
      },
      {
        id: 'gal-8',
        title: 'Alkotó csend és madárcsicsergés naplementekor',
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
        category: 'kulso',
        type: 'image'
      },
      {
        id: 'gal-video-1',
        title: 'Zuzmara Élményvideó – Drónos bejárás és téli hangulat',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
        category: 'hangulat',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        guestName: 'Horváth Ákos & Eszter',
        stayDate: '2026. szeptember',
        roomName: 'Erdőzsongás Prémium Faház',
        rating: 5,
        comment: 'Felejthetetlen 3 napot töltöttünk a Zuzmarában! A dézsából nézni a naplementét a fenyők között, miközben csend vesz körül – szavakkal leírhatatlan. A reggeli kosárban lévő házi sajtok pedig külön dicséretet érdemelnek. Biztosan visszatérünk télen is!',
        status: 'approved',
        isFeatured: true,
        createdAt: '2026-09-18T14:20:00Z'
      },
      {
        id: 'rev-2',
        guestName: 'Dr. Szabó Péter',
        stayDate: '2026. augusztus',
        roomName: 'Zuzmara Panoráma Lodge',
        rating: 5,
        comment: 'A feleségemmel érkeztünk a házassági évfordulónkra. A ház minden apró részlete a luxusról és az ízlésről tanúskodik. Külön kiemelem a szaunát és a patyolattisztaságot. A kommunikáció a házigazdával végtelenül kedves és gördülékeny volt.',
        status: 'approved',
        isFeatured: true,
        createdAt: '2026-08-27T09:15:00Z'
      },
      {
        id: 'rev-3',
        guestName: 'Kerekes Nikolett & barátok',
        stayDate: '2026. július',
        roomName: 'Hegyvidéki Családi Villa',
        rating: 5,
        comment: 'Hatunk kényelmesen elfért a villában. A kerti sütögető és a tágas terasz fantasztikus estéket biztosított. A Starlink net meglepően gyors volt, a konyha pedig mindennel fel volt szerelve, amire csak szükségünk volt.',
        status: 'approved',
        isFeatured: true,
        createdAt: '2026-07-14T18:40:00Z'
      },
      {
        id: 'rev-4',
        guestName: 'Bognár Tamás',
        stayDate: '2026. október',
        roomName: 'Erdőzsongás Prémium Faház',
        rating: 5,
        comment: 'Tökéletes elvonulás a városi pörgésből. A kandalló melege, az erdő illata és a csend azonnal feltöltötte az akkumulátorainkat. Minden szállásadónak így kellene csinálnia!',
        status: 'approved',
        isFeatured: true,
        createdAt: '2026-10-02T11:00:00Z'
      }
    ],
    bookings: [
      {
        id: 'ZUZ-2026-8941',
        roomId: 'room-1',
        roomName: 'Erdőzsongás Prémium Faház',
        guestName: 'Nagy Gergely',
        guestEmail: 'nagy.gergely.demo@example.com',
        guestPhone: '+36 30 123 4567',
        checkIn: '2026-10-20',
        checkOut: '2026-10-23',
        guestsCount: 2,
        nights: 3,
        baseTotal: 174000,
        extrasTotal: 27000,
        touristTaxTotal: 3000,
        grandTotal: 204000,
        depositRequired: 61200,
        depositPaid: 61200,
        paymentMethod: 'card',
        paymentStatus: 'deposit_paid',
        status: 'confirmed',
        selectedExtras: [
          { serviceId: 'srv-3', title: 'Kézműves Reggeli Kosár', price: 27000 }
        ],
        specialRequests: 'Késői érkezés várható 19:00 körül. Kérjük a dézsa előzetes felfűtését, köszönjük!',
        createdAt: '2026-10-10T14:22:00Z',
        notes: 'Vendég telefonon megerősítette az érkezési időt.'
      },
      {
        id: 'ZUZ-2026-9210',
        roomId: 'room-2',
        roomName: 'Zuzmara Panoráma Lodge',
        guestName: 'Farkas Lili',
        guestEmail: 'farkas.lili.demo@example.com',
        guestPhone: '+36 70 987 6543',
        checkIn: '2026-10-24',
        checkOut: '2026-10-26',
        guestsCount: 2,
        nights: 2,
        baseTotal: 108000,
        extrasTotal: 12900,
        touristTaxTotal: 2000,
        grandTotal: 122900,
        depositRequired: 36870,
        depositPaid: 122900,
        paymentMethod: 'szep_card',
        paymentStatus: 'fully_paid',
        status: 'confirmed',
        selectedExtras: [
          { serviceId: 'srv-4', title: 'Romantikus Érkezési Csomag', price: 12900 }
        ],
        specialRequests: 'Házassági évfordulós meglepetés.',
        createdAt: '2026-10-12T16:05:00Z',
        notes: 'OTP SZÉP Kártyával teljesen kifizetve.'
      }
    ],
    blockedDates: [
      {
        id: 'block-1',
        roomId: 'room-3',
        startDate: '2026-10-28',
        endDate: '2026-10-31',
        reason: 'Éves szauna karbantartás és fafelület ápolás'
      }
    ],
    siteContent: {
      hero: {
        badge: '✨ Prémium Természetközeli Vendégház & Wellness',
        title: 'Ahol a csend és a luxus találkozik a Börzsöny fenyveseiben',
        subtitle: 'Zuzmara Vendégház – exkluzív erdei faházak privát dézsafürdővel, panorámás finn szaunával és kényeztető helyi ízekkel a festői Zebegény erdejében.',
        coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=85',
        announcement: '🌲 Téli előfoglalási akció: 3 éjszaka feletti foglalás esetén ajándék kézműves reggeli kosár!'
      },
      about: {
        title: 'A Zuzmara Vendégház Története',
        subtitle: 'Egy álom, amely a természet iránti mély tiszteletből született',
        storyParagraph1: 'A Zuzmara Vendégház gondolata egy téli erdei túránk alkalmával fogant meg bennünk, amikor a fenyőfák ágain csillogó kristálytiszta zuzmara látványa és a mindent betöltő mély csend megállította az időt. Elhatároztuk, hogy létrehozunk egy olyan helyet, ahol a prémium elegancia és a vadregényes természet tökéletes harmóniában él együtt.',
        storyParagraph2: 'A faházak építése során a természetes, fenntartható anyagokra és a skandináv letisztultságra fókuszáltunk. Minden rönk és deszka gondos kezek munkája, a hatalmas üvegfelületek pedig azt az érzést keltik, mintha a vendég a lombok között pihenne. Nincsenek szomszédok, nincsen zaj, csak a szél susogása és a pattogó kandallótűz.',
        storyParagraph3: 'Nálunk a vendéglátás nem szolgáltatás, hanem szívből jövő gondoskodás: a fűtött sós vizes dézsától a környékbeli őstermelők legfinomabb reggelijéig minden azért van, hogy ti újra egymásra és önmagatokra találjatok.',
        image1: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80',
        image2: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
        features: [
          { title: '100% Privát Szféra', desc: 'Nincs közös recepció vagy átmenő forgalom. A birtok és a wellness eszközök kizárólag a tiétek.' },
          { title: 'Egész Éves Wellness', desc: 'Fatüzelésű forró sós dézsafürdő és üvegfalú finn szauna akár hófúvásban is.' },
          { title: 'Helyi Ízek & Gondoskodás', desc: 'A Dunakanyar és a Börzsöny legkiválóbb kézműves termelőinek finomságai közvetlenül a házatokhoz szállítva.' },
          { title: 'Öko-Tudatos Luxus', desc: 'Megújuló energiák, prémium hőszigetelés és natúr fából készült építészeti megoldások.' }
        ]
      },
      contact: {
        phone: '+36 30 789 4512',
        email: 'info@zuzmaravendeghaz.hu',
        address: '2628 Zebegény, Vadvirág dűlő 14.',
        locationNote: 'Zebegény központjától 4 perces festői erdei autóúton, jól járható szilárd burkolatú hegyi úton közelíthető meg. Télen is karbantartott út!',
        ntakNumber: 'NTAK regisztrációs szám: EG23000987 (Magánszálláshely)',
        gpsCoords: '47.7981, 18.9125'
      },
      policy: {
        checkInTime: '15:00 - 20:00 (Kódos okos kulcsszéffel rugalmas érkezés)',
        checkOutTime: '10:00-ig',
        quietHours: '22:00 - 08:00 között kérjük a természet és a szomszédos erdő csendjének tiszteletben tartását.',
        cancellationDays: 14, // napokkal előtte díjmentes
        depositPercentage: 30, // 30% előleg
        touristTaxPerPersonPerNight: 500 // Ft/fő/éj IFA (18 év felett)
      }
    },
    faqs: [
      {
        id: 'faq-1',
        category: 'erkezes',
        question: 'Mikor lehet elfoglalni és mikor kell elhagyni a szállást?',
        answer: 'Az érkezés napján 15:00 órától lehet bejelentkezni. Az önálló, kontaktmentes érkezést biztonsági kódos okosszéf biztosítja, így akár késő este is rugalmasan érkezhettek. A távozás napján 10:00 óráig kérjük a szállás elhagyását.'
      },
      {
        id: 'faq-2',
        category: 'wellness',
        question: 'Hogyan működik a dézsa és a szauna használata? Van-e külön díja?',
        answer: 'A dézsafürdő és a panoráma szauna használata TELJESEN INGYENES és korlátlan a tartózkodásotok alatt! A dézsát érkezésetekre kérésre előre felfűtjük tiszta parajdi sós vízzel, a helyszínen pedig bőségesen találtok bekészített száraz bükkfát a további fűtéshez.'
      },
      {
        id: 'faq-3',
        category: 'foglalas',
        question: 'Milyen fizetési módok érhetők el? Elfogadtok SZÉP Kártyát?',
        answer: 'Igen! Elfogadunk OTP, MBH és K&H SZÉP Kártyát, bankkártyás online fizetést (Mastercard, Visa), valamint közvetlen azonnali banki átutalást. A foglalás megerősítéséhez 30% előleg szükséges, a fennmaradó összeget érkezés előtt vagy a helyszínen rendezhetitek.'
      },
      {
        id: 'faq-4',
        category: 'foglalas',
        question: 'Milyen lemondási feltételek érvényesek?',
        answer: 'Az érkezést megelőző 14. napig a foglalás teljesen díjmentesen lemondható vagy módosítható egy későbbi szabad időpontra, és a befizetett előleget 100%-ban visszatérítjük. 14 napon belüli lemondás esetén az előleg a vendégházat illeti.'
      },
      {
        id: 'faq-5',
        category: 'hazirend',
        question: 'Lehet-e házi kedvencet hozni a vendégházba?',
        answer: 'A Zuzmara Panoráma Lodge és Erdőzsongás faházunk hipoallergén környezet biztosítása érdekében kisállat-mentes, azonban a Hegyvidéki Családi Villánkba előzetes egyeztetés alapján jól nevelt, szobatiszta kistestű kutyusokat szeretettel fogadunk (3.000 Ft/éj felár ellenében).'
      },
      {
        id: 'faq-6',
        category: 'erkezes',
        question: 'Milyen úton közelíthető meg a vendégház télen vagy esős időben?',
        answer: 'A vendégházhoz vezető hegyi út aszfaltozott és szilárd burkolatú, télen is rendszeresen takarított és sózott. Normál személyautóval bármely évszakban könnyedén és biztonságosan járható.'
      }
    ],
    emailTemplates: [
      {
        id: 'tpl-1',
        name: 'Foglalás Visszaigazolás',
        subject: 'Sikeres foglalás – Zuzmara Vendégház ({{bookingId}})',
        body: 'Kedves {{guestName}}!\n\nÖrömmel értesítünk, hogy a foglalásodat a Zuzmara Vendégházban sikeresen rögzítettük!\n\nSzállásegység: {{roomName}}\nÉrkezés: {{checkIn}}\nTávozás: {{checkOut}}\nVendégek száma: {{guestsCount}} fő\nVégösszeg: {{grandTotal}} Ft\nBefizetett előleg: {{depositPaid}} Ft\n\nÉrkezés előtt 2 nappal elküldjük a kulcsszéf nyitókódját és az erdei útvonaltervet.\n\nSzeretettel várunk Benneteket!\nZuzmara Vendégház Csapata'
      },
      {
        id: 'tpl-2',
        name: 'Előleg Bekérő',
        subject: 'Előlegbekérő – Zuzmara Vendégház ({{bookingId}})',
        body: 'Kedves {{guestName}}!\n\nKöszönjük a foglalási igényt. A lefoglalt időszak véglegesítéséhez kérjük az alábbi előleg átutalását 48 órán belül:\n\nÖsszeg: {{depositRequired}} Ft\nBankszámlaszám: 11773000-12345678-00000000 (OTP Bank)\nKedvezményezett: Zuzmara Vendégház Kft.\nKözlemény: {{bookingId}}\n\nÜdvözlettel,\nZuzmara Vendégház'
      }
    ],
    emailLogs: [
      {
        id: 'log-1',
        to: 'nagy.gergely.demo@example.com',
        subject: 'Sikeres foglalás – Zuzmara Vendégház (ZUZ-2026-8941)',
        bookingId: 'ZUZ-2026-8941',
        sentAt: '2026-10-10T14:22:05Z',
        type: 'booking_confirmed',
        contentPreview: 'Kedves Nagy Gergely! Örömmel értesítünk, hogy a foglalásodat sikeresen rögzítettük...'
      }
    ],
    settings: {
      integrations: {
        iCalSyncEnabled: true,
        lastSyncAt: '2026-10-14T07:00:00Z',
        onlinePaymentGateway: 'SimplePay & OTP SZÉP Kártya Live Sandbox',
        status: 'online'
      }
    }
  };
}

// Database helper functions with atomic write
function loadDb(): any {
  if (!fs.existsSync(DB_FILE)) {
    const seed = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, recreating from seed', err);
    const seed = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

function saveDb(data: any): void {
  const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

// Active session tokens map: token -> { userId, role, expiresAt }
const sessions = new Map<string, { userId: string; username: string; role: 'owner' | 'editor'; expiresAt: number }>();

function generateToken(user: any): string {
  const token = crypto.randomBytes(32).toString('hex');
  // 7 days expiration
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  sessions.set(token, {
    userId: user.id,
    username: user.username,
    role: user.role,
    expiresAt
  });
  return token;
}

// Auth Middleware
function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Nincs érvényes hitelesítési token' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) sessions.delete(token);
    res.status(401).json({ error: 'A munkamenet lejárt, kérjük jelentkezz be újra' });
    return;
  }
  (req as any).user = session;
  next();
}

function requireOwner(req: Request, res: Response, next: NextFunction): void {
  const user = (req as any).user;
  if (!user || user.role !== 'owner') {
    res.status(403).json({ error: 'Csak a tulajdonos/főadminisztrátor jogosult erre a műveletre' });
    return;
  }
  next();
}

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// 1. Get site public data
app.get('/api/site-data', (_req: Request, res: Response) => {
  const db = loadDb();
  res.json({
    content: db.siteContent,
    rooms: db.rooms.filter((r: any) => r.active),
    services: db.services.filter((s: any) => s.active),
    gallery: db.gallery,
    reviews: db.reviews.filter((r: any) => r.status === 'approved'),
    faqs: db.faqs,
    settings: {
      policy: db.siteContent.policy,
      integrations: db.settings?.integrations
    }
  });
});

// 2. Check room availability & calculate quote
app.get('/api/availability', (req: Request, res: Response) => {
  const { roomId, checkIn, checkOut, guests } = req.query as {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests?: string;
  };

  if (!roomId || !checkIn || !checkOut) {
    res.status(400).json({ error: 'Hiányzó paraméterek (roomId, checkIn, checkOut szükséges)' });
    return;
  }

  const db = loadDb();
  const room = db.rooms.find((r: any) => r.id === roomId && r.active);
  if (!room) {
    res.status(404).json({ error: 'A keresett szállásegység nem található vagy inaktív' });
    return;
  }

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime()) || inDate >= outDate) {
    res.status(400).json({ error: 'Érvénytelen dátumtartomány' });
    return;
  }

  const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (nights < room.minNights) {
    res.status(400).json({
      error: `A minimálisan foglalható éjszakák száma ehhez a házhoz: ${room.minNights} éjszaka`
    });
    return;
  }

  // Check collision with existing active bookings
  const hasConflict = db.bookings.some((b: any) => {
    if (b.roomId !== roomId) return false;
    if (b.status === 'cancelled') return false;
    // Overlap condition: NOT (b.checkOut <= checkIn || b.checkIn >= checkOut)
    return !(b.checkOut <= checkIn || b.checkIn >= checkOut);
  });

  // Check collision with blocked dates
  const hasBlockedConflict = (db.blockedDates || []).some((b: any) => {
    if (b.roomId !== roomId) return false;
    return !(b.endDate <= checkIn || b.startDate >= checkOut);
  });

  if (hasConflict || hasBlockedConflict) {
    res.json({
      available: false,
      message: 'A választott időpontban a szállásegység már foglalt vagy karbantartás alatt áll.'
    });
    return;
  }

  // Calculate pricing breakdown
  let baseTotal = 0;
  const cur = new Date(inDate);
  while (cur < outDate) {
    const dayOfWeek = cur.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    baseTotal += isWeekend ? room.weekendPricePerNight : room.basePricePerNight;
    cur.setDate(cur.getDate() + 1);
  }

  const guestCount = guests ? parseInt(guests, 10) : 2;
  const ifaPerNight = db.siteContent.policy.touristTaxPerPersonPerNight || 500;
  const touristTaxTotal = guestCount * nights * ifaPerNight;
  const depositPercent = db.siteContent.policy.depositPercentage || 30;
  const depositRequired = Math.round((baseTotal + touristTaxTotal) * (depositPercent / 100));

  res.json({
    available: true,
    room: {
      id: room.id,
      name: room.name,
      basePricePerNight: room.basePricePerNight,
      weekendPricePerNight: room.weekendPricePerNight,
    },
    nights,
    baseTotal,
    touristTaxTotal,
    estimatedGrandTotal: baseTotal + touristTaxTotal,
    depositRequired,
    depositPercentage: depositPercent
  });
});

// 3. Submit a new Booking with Server-Side Concurrency check
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    roomId,
    guestName,
    guestEmail,
    guestPhone,
    checkIn,
    checkOut,
    guestsCount,
    selectedExtras,
    specialRequests,
    paymentMethod
  } = req.body;

  if (!roomId || !guestName || !guestEmail || !guestPhone || !checkIn || !checkOut || !guestsCount) {
    res.status(400).json({ error: 'Kérjük, töltsd ki az összes kötelező mezőt!' });
    return;
  }

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (inDate >= outDate) {
    res.status(400).json({ error: 'A távozási dátumnak a távozás előtt kell lennie.' });
    return;
  }

  const db = loadDb();
  const room = db.rooms.find((r: any) => r.id === roomId && r.active);
  if (!room) {
    res.status(404).json({ error: 'A választott szállásegység nem található.' });
    return;
  }

  if (guestsCount > room.capacity) {
    res.status(400).json({ error: `A maximális vendégszám ebben a házban: ${room.capacity} fő.` });
    return;
  }

  const nights = Math.ceil(Math.abs(outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
  if (nights < room.minNights) {
    res.status(400).json({ error: `A minimálisan foglalható éjszakák száma: ${room.minNights} éjszaka.` });
    return;
  }

  // Atomic conflict check
  const conflict = db.bookings.some((b: any) => {
    if (b.roomId !== roomId) return false;
    if (b.status === 'cancelled') return false;
    return !(b.checkOut <= checkIn || b.checkIn >= checkOut);
  });

  const blockConflict = (db.blockedDates || []).some((b: any) => {
    if (b.roomId !== roomId) return false;
    return !(b.endDate <= checkIn || b.startDate >= checkOut);
  });

  if (conflict || blockConflict) {
    res.status(409).json({
      error: 'Sajnáljuk, a választott időpontban a házat épp most foglalták le. Kérjük válassz másik dátumot vagy szállásegységet!'
    });
    return;
  }

  // Calculate pricing
  let baseTotal = 0;
  const cur = new Date(inDate);
  while (cur < outDate) {
    const dayOfWeek = cur.getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    baseTotal += isWeekend ? room.weekendPricePerNight : room.basePricePerNight;
    cur.setDate(cur.getDate() + 1);
  }

  let extrasTotal = 0;
  const formattedExtras = (selectedExtras || []).map((extra: any) => {
    extrasTotal += extra.price || 0;
    return {
      serviceId: extra.serviceId,
      title: extra.title,
      price: extra.price
    };
  });

  const ifaPerNight = db.siteContent.policy.touristTaxPerPersonPerNight || 500;
  const touristTaxTotal = guestsCount * nights * ifaPerNight;
  const grandTotal = baseTotal + extrasTotal + touristTaxTotal;
  const depositPercent = db.siteContent.policy.depositPercentage || 30;
  const depositRequired = Math.round(grandTotal * (depositPercent / 100));

  // Generate unique human-readable booking code
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `ZUZ-2026-${randomSuffix}`;

  const newBooking = {
    id: bookingId,
    roomId,
    roomName: room.name,
    guestName,
    guestEmail,
    guestPhone,
    checkIn,
    checkOut,
    guestsCount,
    nights,
    baseTotal,
    extrasTotal,
    touristTaxTotal,
    grandTotal,
    depositRequired,
    depositPaid: 0,
    paymentMethod: paymentMethod || 'card',
    paymentStatus: 'pending',
    status: 'pending',
    selectedExtras: formattedExtras,
    specialRequests: specialRequests || '',
    createdAt: new Date().toISOString(),
    notes: 'Weboldalról indított online foglalás.'
  };

  db.bookings.push(newBooking);

  // Log automated email
  db.emailLogs = db.emailLogs || [];
  db.emailLogs.unshift({
    id: `log-${Date.now()}`,
    to: guestEmail,
    subject: `Foglalási igény beérkezett – Zuzmara Vendégház (${bookingId})`,
    bookingId,
    sentAt: new Date().toISOString(),
    type: 'booking_received',
    contentPreview: `Kedves ${guestName}! Foglalási igényedet a(z) ${room.name} szállásegységre (${checkIn} - ${checkOut}) sikeresen rögzítettük.`
  });

  saveDb(db);

  res.status(201).json({
    success: true,
    booking: newBooking,
    message: 'Foglalás sikeresen létrehozva!'
  });
});

// 4. Payment processing / simulation
app.post('/api/payment/confirm', (req: Request, res: Response) => {
  const { bookingId, amount, paymentMethod, transactionRef } = req.body;

  if (!bookingId) {
    res.status(400).json({ error: 'Hiányzó foglalási azonosító' });
    return;
  }

  const db = loadDb();
  const bookingIndex = db.bookings.findIndex((b: any) => b.id === bookingId);
  if (bookingIndex === -1) {
    res.status(404).json({ error: 'A foglalás nem található' });
    return;
  }

  const booking = db.bookings[bookingIndex];
  const paidAmount = amount || booking.depositRequired;

  booking.depositPaid = (booking.depositPaid || 0) + paidAmount;
  booking.paymentMethod = paymentMethod || booking.paymentMethod;
  booking.paymentStatus = booking.depositPaid >= booking.grandTotal ? 'fully_paid' : 'deposit_paid';
  booking.status = 'confirmed';
  booking.notes = (booking.notes ? booking.notes + '\n' : '') +
    `Fizetés sikeresen megerősítve (${paidAmount.toLocaleString('hu-HU')} Ft) - Tranzakció: ${transactionRef || 'TRX-' + Date.now()}`;

  // Log confirmation email
  db.emailLogs = db.emailLogs || [];
  db.emailLogs.unshift({
    id: `log-${Date.now()}`,
    to: booking.guestEmail,
    subject: `Foglalás megerősítve és fizetve – Zuzmara Vendégház (${booking.id})`,
    bookingId: booking.id,
    sentAt: new Date().toISOString(),
    type: 'booking_confirmed',
    contentPreview: `Kedves ${booking.guestName}! Előlegfizetésed (${paidAmount.toLocaleString('hu-HU')} Ft) beérkezett, foglalásod véglegesítve!`
  });

  saveDb(db);

  res.json({
    success: true,
    booking,
    message: 'Fizetés sikeresen feldolgozva, foglalás megerősítve!'
  });
});

// 5. Submit guest review (public, queued for moderation)
app.post('/api/reviews', (req: Request, res: Response) => {
  const { guestName, roomName, stayDate, rating, comment } = req.body;

  if (!guestName || !comment || !rating) {
    res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
    return;
  }

  const numRating = parseInt(rating, 10);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    res.status(400).json({ error: 'Az értékelésnek 1 és 5 csillag között kell lennie.' });
    return;
  }

  const db = loadDb();
  const newReview = {
    id: `rev-${Date.now()}`,
    guestName,
    roomName: roomName || 'Zuzmara Vendégház',
    stayDate: stayDate || new Date().toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' }),
    rating: numRating,
    comment,
    status: 'pending',
    isFeatured: false,
    createdAt: new Date().toISOString()
  };

  db.reviews.unshift(newReview);
  saveDb(db);

  res.status(201).json({
    success: true,
    message: 'Köszönjük az értékelésedet! Az adminisztrátori ellenőrzés után megjelenik az oldalon.'
  });
});

// 6. Contact message submit
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Név, e-mail és üzenet megadása kötelező.' });
    return;
  }

  const db = loadDb();
  db.emailLogs = db.emailLogs || [];
  db.emailLogs.unshift({
    id: `contact-${Date.now()}`,
    to: db.siteContent.contact.email,
    subject: `Új érdeklődés a weboldalról: ${subject || 'Általános kérdés'} (${name})`,
    sentAt: new Date().toISOString(),
    type: 'contact_inquiry',
    contentPreview: `Küldő: ${name} (${email}, Tel: ${phone || 'nincs megadva'}). Üzenet: ${message}`
  });

  saveDb(db);

  res.json({
    success: true,
    message: 'Köszönjük üzenetedet! Hamarosan, általában 2-4 órán belül válaszolunk.'
  });
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// Setup status check
app.get('/api/auth/setup-status', (_req: Request, res: Response) => {
  const db = loadDb();
  const hasOwner = (db.users || []).some((u: any) => u.role === 'owner');
  res.json({ hasOwner, userCount: (db.users || []).length });
});

// First admin setup
app.post('/api/auth/setup-master', (req: Request, res: Response) => {
  const { username, email, password, name } = req.body;
  if (!username || !email || !password || !name) {
    res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
    return;
  }

  const db = loadDb();
  const hasOwner = (db.users || []).some((u: any) => u.role === 'owner');
  if (hasOwner) {
    res.status(400).json({ error: 'A rendszerben már létezik tulajdonosi fiók. Kérjük jelentkezz be!' });
    return;
  }

  const { hash, salt } = hashPassword(password);
  const newUser = {
    id: `usr_${Date.now()}`,
    username,
    email,
    name,
    role: 'owner' as const,
    hash,
    salt,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  const token = generateToken(newUser);
  res.status(201).json({
    success: true,
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }
  });
});

// Admin login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    res.status(400).json({ error: 'Felhasználónév / e-mail és jelszó szükséges' });
    return;
  }

  const db = loadDb();
  const user = (db.users || []).find(
    (u: any) => u.username.toLowerCase() === usernameOrEmail.toLowerCase() || u.email.toLowerCase() === usernameOrEmail.toLowerCase()
  );

  if (!user || !verifyPassword(password, user.hash, user.salt)) {
    res.status(401).json({ error: 'Helytelen felhasználónév vagy jelszó' });
    return;
  }

  const token = generateToken(user);
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// Get current session
app.get('/api/auth/me', authMiddleware, (req: Request, res: Response) => {
  const session = (req as any).user;
  const db = loadDb();
  const user = db.users.find((u: any) => u.id === session.userId);
  if (!user) {
    res.status(404).json({ error: 'Felhasználó nem található' });
    return;
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessions.delete(token);
  }
  res.json({ success: true, message: 'Sikeres kijelentkezés' });
});

// ==========================================
// ADMIN PROTECTED ENDPOINTS
// ==========================================

// Dashboard stats
app.get('/api/admin/stats', authMiddleware, (_req: Request, res: Response) => {
  const db = loadDb();
  const bookings = db.bookings || [];
  const todayStr = new Date().toISOString().split('T')[0];

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter((b: any) => b.status === 'pending').length;
  const todayArrivals = bookings.filter((b: any) => b.checkIn === todayStr && b.status === 'confirmed').length;

  // Estimated gross revenue
  const totalRevenue = bookings
    .filter((b: any) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum: number, b: any) => sum + (b.grandTotal || 0), 0);

  const pendingReviews = (db.reviews || []).filter((r: any) => r.status === 'pending').length;

  res.json({
    totalBookings,
    confirmedBookings,
    pendingBookings,
    todayArrivals,
    totalRevenue,
    pendingReviews,
    totalRooms: (db.rooms || []).length
  });
});

// Manage bookings
app.get('/api/admin/bookings', authMiddleware, (req: Request, res: Response) => {
  const db = loadDb();
  let list = db.bookings || [];
  const { status, search } = req.query as { status?: string; search?: string };

  if (status && status !== 'all') {
    list = list.filter((b: any) => b.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (b: any) =>
        b.id.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q) ||
        b.guestPhone.toLowerCase().includes(q)
    );
  }

  // Sort descending by created date
  list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(list);
});

// Update booking status or notes
app.put('/api/admin/bookings/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const db = loadDb();
  const index = db.bookings.findIndex((b: any) => b.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'A foglalás nem található' });
    return;
  }

  db.bookings[index] = { ...db.bookings[index], ...updates };
  saveDb(db);
  res.json({ success: true, booking: db.bookings[index] });
});

// Cancel / delete booking
app.delete('/api/admin/bookings/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDb();
  const index = db.bookings.findIndex((b: any) => b.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'A foglalás nem található' });
    return;
  }

  // Rather than hard delete, mark as cancelled to preserve history
  db.bookings[index].status = 'cancelled';
  saveDb(db);
  res.json({ success: true, message: 'Foglalás lemondva' });
});

// Create manual booking from admin
app.post('/api/admin/bookings/manual', authMiddleware, (req: Request, res: Response) => {
  const data = req.body;
  const db = loadDb();
  const bookingId = `ZUZ-MAN-${Math.floor(1000 + Math.random() * 9000)}`;

  const newBooking = {
    ...data,
    id: bookingId,
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);
  saveDb(db);
  res.status(201).json({ success: true, booking: newBooking });
});

// Blocked dates
app.get('/api/admin/blocked-dates', authMiddleware, (_req: Request, res: Response) => {
  const db = loadDb();
  res.json(db.blockedDates || []);
});

app.post('/api/admin/blocked-dates', authMiddleware, (req: Request, res: Response) => {
  const { roomId, startDate, endDate, reason } = req.body;
  if (!roomId || !startDate || !endDate) {
    res.status(400).json({ error: 'Hiányzó adatok' });
    return;
  }
  const db = loadDb();
  const newBlock = {
    id: `block-${Date.now()}`,
    roomId,
    startDate,
    endDate,
    reason: reason || 'Karbantartás'
  };
  db.blockedDates = db.blockedDates || [];
  db.blockedDates.push(newBlock);
  saveDb(db);
  res.status(201).json({ success: true, blockedDate: newBlock });
});

app.delete('/api/admin/blocked-dates/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDb();
  db.blockedDates = (db.blockedDates || []).filter((b: any) => b.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Rooms CRUD
app.get('/api/admin/rooms', authMiddleware, (_req: Request, res: Response) => {
  const db = loadDb();
  res.json(db.rooms || []);
});

app.post('/api/admin/rooms', authMiddleware, (req: Request, res: Response) => {
  const roomData = req.body;
  const db = loadDb();
  const newRoom = {
    ...roomData,
    id: `room-${Date.now()}`,
    active: true
  };
  db.rooms.push(newRoom);
  saveDb(db);
  res.status(201).json({ success: true, room: newRoom });
});

app.put('/api/admin/rooms/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const db = loadDb();
  const index = db.rooms.findIndex((r: any) => r.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Szoba nem található' });
    return;
  }
  db.rooms[index] = { ...db.rooms[index], ...updates };
  saveDb(db);
  res.json({ success: true, room: db.rooms[index] });
});

app.delete('/api/admin/rooms/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDb();
  const index = db.rooms.findIndex((r: any) => r.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Szoba nem található' });
    return;
  }
  // Soft delete by deactivating
  db.rooms[index].active = false;
  saveDb(db);
  res.json({ success: true, message: 'Szoba archiválva' });
});

// Services CRUD
app.get('/api/admin/services', authMiddleware, (_req: Request, res: Response) => {
  const db = loadDb();
  res.json(db.services || []);
});

app.post('/api/admin/services', authMiddleware, (req: Request, res: Response) => {
  const data = req.body;
  const db = loadDb();
  const newService = {
    ...data,
    id: `srv-${Date.now()}`,
    active: true
  };
  db.services.push(newService);
  saveDb(db);
  res.status(201).json({ success: true, service: newService });
});

app.put('/api/admin/services/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const db = loadDb();
  const index = db.services.findIndex((s: any) => s.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Szolgáltatás nem található' });
    return;
  }
  db.services[index] = { ...db.services[index], ...updates };
  saveDb(db);
  res.json({ success: true, service: db.services[index] });
});

app.delete('/api/admin/services/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDb();
  db.services = db.services.filter((s: any) => s.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Gallery & Videos
app.get('/api/admin/gallery', authMiddleware, (_req: Request, res: Response) => {
  const db = loadDb();
  res.json(db.gallery || []);
});

app.post('/api/admin/gallery', authMiddleware, (req: Request, res: Response) => {
  const media = req.body;
  const db = loadDb();
  const newItem = {
    ...media,
    id: `med-${Date.now()}`
  };
  db.gallery.push(newItem);
  saveDb(db);
  res.status(201).json({ success: true, item: newItem });
});

app.delete('/api/admin/gallery/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDb();
  db.gallery = db.gallery.filter((g: any) => g.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Reviews moderation
app.get('/api/admin/reviews', authMiddleware, (_req: Request, res: Response) => {
  const db = loadDb();
  res.json(db.reviews || []);
});

app.put('/api/admin/reviews/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, isFeatured } = req.body;
  const db = loadDb();
  const index = db.reviews.findIndex((r: any) => r.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Vélemény nem található' });
    return;
  }
  if (status) db.reviews[index].status = status;
  if (isFeatured !== undefined) db.reviews[index].isFeatured = isFeatured;
  saveDb(db);
  res.json({ success: true, review: db.reviews[index] });
});

app.delete('/api/admin/reviews/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDb();
  db.reviews = db.reviews.filter((r: any) => r.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Site Content updates
app.put('/api/admin/site-content', authMiddleware, (req: Request, res: Response) => {
  const updates = req.body;
  const db = loadDb();
  db.siteContent = { ...db.siteContent, ...updates };
  saveDb(db);
  res.json({ success: true, content: db.siteContent });
});

// Users management (Owner only)
app.get('/api/admin/users', authMiddleware, requireOwner, (_req: Request, res: Response) => {
  const db = loadDb();
  const safeUsers = (db.users || []).map((u: any) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json(safeUsers);
});

app.post('/api/admin/users', authMiddleware, requireOwner, (req: Request, res: Response) => {
  const { username, email, password, name, role } = req.body;
  if (!username || !email || !password || !name) {
    res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
    return;
  }
  const db = loadDb();
  const exists = db.users.some(
    (u: any) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    res.status(400).json({ error: 'Ilyen felhasználónévvel vagy e-maillel már létezik fiók.' });
    return;
  }

  const { hash, salt } = hashPassword(password);
  const newUser = {
    id: `usr_${Date.now()}`,
    username,
    email,
    name,
    role: role === 'owner' ? 'owner' : 'editor',
    hash,
    salt,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt
    }
  });
});

app.delete('/api/admin/users/:id', authMiddleware, requireOwner, (req: Request, res: Response) => {
  const { id } = req.params;
  const session = (req as any).user;
  if (session.userId === id) {
    res.status(400).json({ error: 'Saját magadat nem törölheted!' });
    return;
  }
  const db = loadDb();
  db.users = (db.users || []).filter((u: any) => u.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Email templates and logs
app.get('/api/admin/email-templates', authMiddleware, (_req: Request, res: Response) => {
  const db = loadDb();
  res.json(db.emailTemplates || []);
});

app.put('/api/admin/email-templates/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { subject, body } = req.body;
  const db = loadDb();
  const index = (db.emailTemplates || []).findIndex((t: any) => t.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Sablon nem található' });
    return;
  }
  db.emailTemplates[index].subject = subject;
  db.emailTemplates[index].body = body;
  saveDb(db);
  res.json({ success: true, template: db.emailTemplates[index] });
});

app.get('/api/admin/email-logs', authMiddleware, (_req: Request, res: Response) => {
  const db = loadDb();
  res.json(db.emailLogs || []);
});

// ==========================================
// VITE DEV SERVER OR STATIC SERVE
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌲 Zuzmara Vendégház szerver fut a http://0.0.0.0:${PORT} porton`);
  });
}

startServer().catch((err) => {
  console.error('Szerver indítási hiba:', err);
  process.exit(1);
});
