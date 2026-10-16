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

// Ensure public and uploads directories exist and are served statically
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use(express.static(PUBLIC_DIR));

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

// Initial seed data for single standalone house: Zuzmo Kabin Vendégház
function getInitialSeedData() {
  const defaultAdminSalt = crypto.randomBytes(16).toString('hex');
  const defaultAdminHash = crypto.scryptSync('Zuzmo2026!', defaultAdminSalt, 64).toString('hex');

  const editorSalt = crypto.randomBytes(16).toString('hex');
  const editorHash = crypto.scryptSync('Editor2026!', editorSalt, 64).toString('hex');

  return {
    users: [
      {
        id: 'usr_owner_1',
        username: 'admin',
        email: 'hello@zuzmokabin.hu',
        name: 'Zuzmo Kabin Házigazda',
        role: 'owner',
        hash: defaultAdminHash,
        salt: defaultAdminSalt,
        createdAt: '2026-01-10T10:00:00Z',
      },
      {
        id: 'usr_editor_1',
        username: 'szerkeszto',
        email: 'szerkeszto@zuzmokabin.hu',
        name: 'Tartalomszerkesztő',
        role: 'editor',
        hash: editorHash,
        salt: editorSalt,
        createdAt: '2026-02-01T12:00:00Z',
      },
    ],
    // Single standalone house
    rooms: [
      {
        id: 'zuzmo-kabin',
        name: 'Zuzmo Kabin Vendégház',
        tagline: 'Teljes önálló erdei vendégház Nagymaroson privát pezsgőfürdővel',
        description: 'Önálló vendégház és hozzá tartozó kerthelyiség a Dunakanyarban, Nagymaros erdőszélén. Amerikai konyhás nappali két kényelmes kihúzható kanapéval, meleg vizes fürdőszoba és emeleti két hálószoba (franciaágyas és két külön ágyas). Akár 6 vendég számára ideális.',
        capacity: 6,
        bedrooms: 2,
        bathrooms: 1,
        sizeM2: 75,
        basePricePerNight: 52000,
        weekendPricePerNight: 62000,
        minNights: 2,
        images: [
          'dc25c9c8-5452-4cf6-a901-9f26c6f8360d.jpeg',
          'fda939cf-838f-4d9e-bbff-f558077614d3.jpeg',
          'fff9d7b5-5d45-4249-8ebe-762d16004806.jpeg',
          '981271ac-3a7d-43cd-8e5b-ac65dab38cca.jpeg',
          'd9175ad3-682d-4cb5-b1ac-bdc3b9a0b562.jpeg',
          '465f8586-0028-4c72-8c8b-3dda5dfcd6a1.jpeg',
          'da3d2dd2-2f92-4043-9a84-e4b1c138dabf.jpeg'
        ],
        amenities: [
          'Privát pezsgőfürdő (egész évben)',
          'Teljesen felszerelt konyha',
          'Wi-Fi',
          'Ingyenes parkolás a helyszínen',
          'Kisállatbarát szálláshely',
          'Légkondicionálás & fűtés',
          'Saját kerthelyiség & grill',
          'Csepegtetős kávéfőző'
        ],
        featured: true,
        active: true
      }
    ],
    // The spaces of this single guesthouse
    houseSpaces: [
      {
        id: 'space-nappali',
        name: 'Amerikai konyhás nappali & étkező',
        subtitle: 'Földszinti tágas közösségi tér',
        description: 'Tágas nappali étkezőasztallal, két kihúzható és kényelmes kanapéval, közvetlen kertkapcsolattal a nagy üveg tolóajtókon keresztül. Teljesen felszerelt modern konyha mosogatóval, főzőlappal és csepegtetős kávéfőzővel.',
        bedsInfo: '2 db kihúzható kényelmes kanapé (4 fő részére)',
        images: [
          'fff9d7b5-5d45-4249-8ebe-762d16004806.jpeg',
          '981271ac-3a7d-43cd-8e5b-ac65dab38cca.jpeg',
          '9c8b5255-e890-43c4-8499-2d1c72951261.jpeg',
          'e412206e-0ae7-464c-9b3b-2fae8efc2d89.jpeg',
          'fda939cf-838f-4d9e-bbff-f558077614d3.jpeg'
        ],
        features: ['Két kihúzható kényelmes kanapé', 'Felszerelt konyha & étkezőasztal', 'Csepegtetős kávéfőző', 'Légkondicionáló & fűtés']
      },
      {
        id: 'space-halo-1',
        name: 'Első hálószoba (Franciaágyas)',
        subtitle: 'Emeleti intim erdei szoba',
        description: 'Természetes natúr faburkolatú meghitt hálószoba kényelmes franciaággyal, szekrénnyel, növénnyel és erdei lombokra néző ablakkal.',
        bedsInfo: '1 db kényelmes franciaágy (2 fő részére)',
        images: [
          'd9175ad3-682d-4cb5-b1ac-bdc3b9a0b562.jpeg',
          'f4ef97e6-7b52-47e6-9c84-3d232024422e.jpeg'
        ],
        features: ['Kényelmes franciaágy', 'Natúr fa burkolat', 'Erdei panoráma ablak', 'Ruhásszekrény & akasztók']
      },
      {
        id: 'space-halo-2',
        name: 'Második hálószoba (Kétágyas)',
        subtitle: 'Emeleti két külön ágyas szoba',
        description: 'Világos, erdei hangulatú hálószoba két különálló egyszemélyes ággyal. Gyermekeknek, barátoknak vagy családtagoknak is tökéletes választás.',
        bedsInfo: '2 db egyszemélyes ágy (2 fő részére)',
        images: [
          '465f8586-0028-4c72-8c8b-3dda5dfcd6a1.jpeg'
        ],
        features: ['2 db egyszemélyes ágy', 'Fa mennyezet és falak', 'Természetes fény & erdei kilátás', 'Olvasólámpa']
      },
      {
        id: 'space-furdo',
        name: 'Fürdőszoba meleg vízzel',
        subtitle: 'Rusztikus kőburkolatú kényelem',
        description: 'Egyedi rusztikus kőburkolattal és dekoratív vakolattal kialakított fürdőszoba, kerek háttérvilágítású dizájntükörrel, modern mosdópulttal, meleg vizes zuhanyzóval és hajszárítóval.',
        bedsInfo: 'Földszinti elhelyezkedés',
        images: [
          'da3d2dd2-2f92-4043-9a84-e4b1c138dabf.jpeg',
          '0d5afb48-2599-405a-b0c1-edbb5de98126.jpeg',
          'c46c7cc6-5d17-480c-b48d-4dd27cfdd78f.jpeg',
          '5abdb651-2b4a-49a2-bdae-c3055d4b3e85.jpeg'
        ],
        features: ['Kényelmes fürdőszoba meleg vízzel', 'Épített kőburkolatú zuhanykabin', 'Kerek dizájn megvilágított tükör', 'Hajszárító & törölközők']
      },
      {
        id: 'space-kert',
        name: 'Saját kerthelyiség & Privát pezsgőfürdő',
        subtitle: 'Közvetlenül az erdő szélén',
        description: 'A vendégházhoz tartozó saját, csendes kerthelyiségben privát pezsgőfürdő várja a vendégeket egész évben. A kertben szabadtéri grillezési és bográcsozási lehetőség biztosított a meghitt estékhez.',
        bedsInfo: 'Kültéri privát wellness & pihenőkert',
        images: [
          'dc25c9c8-5452-4cf6-a901-9f26c6f8360d.jpeg',
          'fda939cf-838f-4d9e-bbff-f558077614d3.jpeg'
        ],
        features: ['Privát pezsgőfürdő (egész évben használható)', 'Grillezési és bográcsozási lehetőség', 'Saját privát kerthelyiség', 'Madárcsicsergés és erdei csend']
      }
    ],
    // EXACTLY the 12 verified amenities
    services: [
      {
        id: 'srv-1',
        title: 'Teljesen felszerelt konyha',
        description: 'Főzőlap, hűtőszekrény, mikrohullámú sütő, edények, evőeszközök és minden szükséges konyhai eszköz az otthoni főzéshez.',
        icon: 'UtensilsCrossed',
        isIncluded: true,
        category: 'konyha',
        active: true
      },
      {
        id: 'srv-2',
        title: 'Wi-Fi',
        description: 'Gyors és stabil vezeték nélküli internetkapcsolat a házban és a kertben.',
        icon: 'Wifi',
        isIncluded: true,
        category: 'kenyelem',
        active: true
      },
      {
        id: 'srv-3',
        title: 'Ingyenes parkolás a helyszínen',
        description: 'Kényelmes és biztonságos ingyenes parkolási lehetőség közvetlenül a vendégháznál.',
        icon: 'Car',
        isIncluded: true,
        category: 'kenyelem',
        active: true
      },
      {
        id: 'srv-4',
        title: 'Privát pezsgőfürdő',
        description: 'Egész évben és a megadott feltételek szerint használható privát kültéri pezsgőfürdő a kertben.',
        icon: 'Bath',
        isIncluded: true,
        category: 'wellness',
        active: true
      },
      {
        id: 'srv-5',
        title: 'Kisállatbarát szálláshely',
        description: 'Szívesen látjuk a négylábú családtagokat is a Zuzmo Kabinban.',
        icon: 'Heart',
        isIncluded: true,
        category: 'kenyelem',
        active: true
      },
      {
        id: 'srv-6',
        title: 'Légkondicionálás',
        description: 'A nyári meleg napokon kellemes hűvöst biztosító modern klímaberendezés.',
        icon: 'Wind',
        isIncluded: true,
        category: 'kenyelem',
        active: true
      },
      {
        id: 'srv-7',
        title: 'Fűtés',
        description: 'Minden évszakban megbízható és komfortos fűtés a hidegebb napokra.',
        icon: 'Flame',
        isIncluded: true,
        category: 'kenyelem',
        active: true
      },
      {
        id: 'srv-8',
        title: 'Saját kerthelyiség',
        description: 'Teljesen önálló, elkerített zöld kert közvetlenül a nagymarosi erdő szélén.',
        icon: 'Trees',
        isIncluded: true,
        category: 'kert',
        active: true
      },
      {
        id: 'srv-9',
        title: 'Grillezési és bográcsozási lehetőség',
        description: 'Kültéri tűzrakó, bográcsállvány és grillsütő a közös szabadtéri sütögetésekhez.',
        icon: 'Sparkles',
        isIncluded: true,
        category: 'kert',
        active: true
      },
      {
        id: 'srv-10',
        title: 'Hajszárító',
        description: 'A fürdőszobában bekészített nagy teljesítményű hajszárító a vendégek kényelméért.',
        icon: 'Sparkles',
        isIncluded: true,
        category: 'kenyelem',
        active: true
      },
      {
        id: 'srv-11',
        title: 'Csepegtetős kávéfőző',
        description: 'Hagyományos csepegtetős kávéfőző áll rendelkezésre, hogy illatos kávéval induljon a reggel.',
        icon: 'Coffee',
        isIncluded: true,
        category: 'konyha',
        active: true
      },
      {
        id: 'srv-12',
        title: 'Kényelmes fürdőszoba meleg vízzel',
        description: 'Rusztikus kőburkolatú, tiszta és igényes fürdőszoba megbízható meleg vizes zuhannyal.',
        icon: 'Droplets',
        isIncluded: true,
        category: 'kenyelem',
        active: true
      }
    ],
    // Real photos of Zuzmo Kabin Vendégház
    gallery: [
      {
        id: 'gal-1',
        title: 'Zuzmo Kabin Vendégház az erdőszélen',
        url: 'dc25c9c8-5452-4cf6-a901-9f26c6f8360d.jpeg',
        category: 'kulso',
        type: 'image',
        isCover: true
      },
      {
        id: 'gal-2',
        title: 'Nappali sarokkanapé és üveg tolóajtó a teraszra',
        url: 'fda939cf-838f-4d9e-bbff-f558077614d3.jpeg',
        category: 'nappali',
        type: 'image'
      },
      {
        id: 'gal-3',
        title: 'Földszinti amerikai konyhás nappali és étkező',
        url: 'fff9d7b5-5d45-4249-8ebe-762d16004806.jpeg',
        category: 'nappali',
        type: 'image'
      },
      {
        id: 'gal-4',
        title: 'Konyhasarok mintás csempével és csepegtetős kávéfőzővel',
        url: '981271ac-3a7d-43cd-8e5b-ac65dab38cca.jpeg',
        category: 'nappali',
        type: 'image'
      },
      {
        id: 'gal-5',
        title: 'Étkezősarok teraszkilátással az erdőre',
        url: 'e412206e-0ae7-464c-9b3b-2fae8efc2d89.jpeg',
        category: 'nappali',
        type: 'image'
      },
      {
        id: 'gal-6',
        title: 'Kényelmes kihúzható ülőgarnitúra párnákkal',
        url: '9c8b5255-e890-43c4-8499-2d1c72951261.jpeg',
        category: 'nappali',
        type: 'image'
      },
      {
        id: 'gal-7',
        title: 'Emeleti franciaágyas hálószoba natúr faburkolattal',
        url: 'd9175ad3-682d-4cb5-b1ac-bdc3b9a0b562.jpeg',
        category: 'haloszobak',
        type: 'image'
      },
      {
        id: 'gal-8',
        title: 'Franciaágyas szoba ruhásszekrénnyel',
        url: 'f4ef97e6-7b52-47e6-9c84-3d232024422e.jpeg',
        category: 'haloszobak',
        type: 'image'
      },
      {
        id: 'gal-9',
        title: 'Emeleti második hálószoba két egyszemélyes ággyal',
        url: '465f8586-0028-4c72-8c8b-3dda5dfcd6a1.jpeg',
        category: 'haloszobak',
        type: 'image'
      },
      {
        id: 'gal-10',
        title: 'Rusztikus kőburkolatú fürdőszoba dizájntükörrel',
        url: 'da3d2dd2-2f92-4043-9a84-e4b1c138dabf.jpeg',
        category: 'furdoszoba',
        type: 'image'
      },
      {
        id: 'gal-11',
        title: 'Fürdőszobai mosdópult háttérvilágítással',
        url: '0d5afb48-2599-405a-b0c1-edbb5de98126.jpeg',
        category: 'furdoszoba',
        type: 'image'
      },
      {
        id: 'gal-12',
        title: 'Kényelmes épített zuhanykabin meleg vízzel',
        url: 'c46c7cc6-5d17-480c-b48d-4dd27cfdd78f.jpeg',
        category: 'furdoszoba',
        type: 'image'
      },
      {
        id: 'gal-13',
        title: 'Előtér nagyméretű tükörrel és faburkolattal',
        url: '5abdb651-2b4a-49a2-bdae-c3055d4b3e85.jpeg',
        category: 'nappali',
        type: 'image'
      },
      {
        id: 'gal-14',
        title: 'Bejárat akasztókkal és beépített gardróbbal',
        url: 'f0b46051-4595-4152-8c4e-5510fb429d7f.jpeg',
        category: 'nappali',
        type: 'image'
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        guestName: 'Kovács Zoltán & Dóra',
        stayDate: '2026. szeptember',
        roomName: 'Zuzmo Kabin Vendégház',
        rating: 5,
        comment: 'Fantasztikus hétvégét töltöttünk itt! A privát pezsgőfürdő a hűvös estéken a csillagos ég alatt valami leírhatatlan élmény volt. A csend, a madárcsicsergés és a ház otthonos felszereltsége azonnal kikapcsolt minket.',
        status: 'approved',
        isFeatured: true,
        createdAt: '2026-09-18T14:20:00Z'
      },
      {
        id: 'rev-2',
        guestName: 'Balogh Katalin és családja',
        stayDate: '2026. augusztus',
        roomName: 'Zuzmo Kabin Vendégház',
        rating: 5,
        comment: 'Öten érkeztünk gyerekekkel és a kiskutyánkkal. A gyerekek imádták a felső kétágyas szobát, a kertben bográcsoztunk, a házigazdák pedig nagyon figyelmesek voltak. A kulcsszéffel történő önálló bejutás pedig szuper kényelmes!',
        status: 'approved',
        isFeatured: true,
        createdAt: '2026-08-27T09:15:00Z'
      },
      {
        id: 'rev-3',
        guestName: 'Tóth Marcell & barátok',
        stayDate: '2026. július',
        roomName: 'Zuzmo Kabin Vendégház',
        rating: 5,
        comment: 'Tökéletes elhelyezkedés Nagymaroson, közvetlenül az erdő szélén. A konyhában minden adott a sütés-főzéshez, a csepegtetős kávé pedig a teraszon a reggeli napfényben igazi napindító volt. Biztosan visszatérünk!',
        status: 'approved',
        isFeatured: true,
        createdAt: '2026-07-14T18:40:00Z'
      }
    ],
    bookings: [
      {
        id: 'ZUZ-2026-8941',
        roomId: 'zuzmo-kabin',
        roomName: 'Zuzmo Kabin Vendégház',
        guestName: 'Nagy Gergely',
        guestEmail: 'nagy.gergely.demo@example.com',
        guestPhone: '+36 30 462 1242',
        checkIn: '2026-10-20',
        checkOut: '2026-10-23',
        guestsCount: 4,
        nights: 3,
        baseTotal: 156000,
        extrasTotal: 0,
        touristTaxTotal: 6000,
        grandTotal: 162000,
        depositRequired: 48600,
        depositPaid: 48600,
        paymentMethod: 'card',
        paymentStatus: 'deposit_paid',
        status: 'confirmed',
        selectedExtras: [],
        specialRequests: 'Késői érkezés várható 19:00 körül. A kulcsszéf kódot kérjük előre elküldeni.',
        createdAt: '2026-10-10T14:22:00Z',
        notes: 'Vendég telefonon egyeztetve.'
      }
    ],
    blockedDates: [],
    siteContent: {
      hero: {
        badge: '✨ Önálló Vendégház Nagymaroson, Akár 6 Fő Részére',
        title: 'zuzmo kabin',
        subtitle: 'Fedezd fel a nyugalmat Nagymaroson, az erdő szélén található, önálló vendégházunkban! A Zuzmo Kabin ideális választás pároknak, családoknak és baráti társaságoknak, akár 6 fő részére.',
        paragraph2: 'Pihenj a privát pezsgőfürdőben, élvezd a kert nyugalmát, grillezz a szabadban, és töltődj fel a természet közelségében. A ház egész évben kényelmes kikapcsolódást kínál.',
        coverImage: 'dc25c9c8-5452-4cf6-a901-9f26c6f8360d.jpeg',
        announcement: '🌲 Teljesen önálló ház és privát kerthelyiség a nagymarosi erdő szélén!'
      },
      about: {
        title: 'A Helyről',
        subtitle: 'Zuzmo Kabin Vendégház a Dunakanyarban',
        storyParagraph1: 'A Dunakanyarban, Nagymaroson, a Szekér utcában, az erdő szélén várja vendégeit a Zuzmo Kabin Vendégház.',
        storyParagraph2: 'A teljesen önálló ház és a hozzá tartozó kerthelyiség ideális akár 6 fős társaságok, családok és párok számára is. A madárcsicsergés, a természet közelsége, a grillezési és bográcsozási lehetőség, valamint a privát pezsgőfürdő gondoskodik a kikapcsolódásról.',
        storyParagraph3: 'A földszinten amerikai konyhás nappali található két kihúzható, kényelmes kanapéval és meleg vizes fürdőszobával. Az emeleten két hálószoba kapott helyet: az egyikben franciaágy, a másikban két egyszemélyes ágy biztosít kényelmes pihenést.',
        storyParagraph4: 'A ház minden évszakban használható, légkondicionálóval és fűtéssel felszerelt.',
        closingNote: 'Várjuk szeretettel vendégeinket!',
        image1: 'dc25c9c8-5452-4cf6-a901-9f26c6f8360d.jpeg',
        image2: 'fda939cf-838f-4d9e-bbff-f558077614d3.jpeg',
        features: [
          {
            title: 'Önálló bejutás',
            desc: 'A vendégek zárható kulcsszéf segítségével, önállóan juthatnak be a házba.'
          },
          {
            title: 'Gyönyörű környék',
            desc: 'Pihenés a Dunakanyarban, Nagymaros erdőszéli, festői környezetében.'
          },
          {
            title: 'Kávézás otthon',
            desc: 'Csepegtetős kávéfőző áll a vendégek rendelkezésére, hogy jól induljon a reggel.'
          }
        ]
      },
      contact: {
        phone: '+36 30 462 1242',
        email: 'info@zuzmokabin.hu',
        address: 'Nagymaros, Szekér utca',
        locationNote: 'A Dunakanyarban, Nagymaroson, a Szekér utcában, az erdő szélén.',
        ntakNumber: 'NTAK regisztrációs szám: MA19023507'
      },
      policy: {
        checkInTime: '15:00-tól (Zárható kulcsszéffel önálló bejutás)',
        checkOutTime: '10:00-ig',
        quietHours: '22:00 - 08:00 között kérjük a természet és a szomszédos erdő csendjének tiszteletben tartását.',
        cancellationDays: 14,
        depositPercentage: 30,
        touristTaxPerPersonPerNight: 500
      }
    },
    faqs: [
      {
        id: 'faq-1',
        category: 'erkezes',
        question: 'Hogyan történik a bejutás a vendégházba?',
        answer: 'A vendégek zárható kulcsszéf segítségével, teljesen önállóan és rugalmasan juthatnak be a házba az érkezés napján 15:00 órától. A távozás napján 10:00 óráig kérjük a szállás elhagyását.'
      },
      {
        id: 'faq-2',
        category: 'wellness',
        question: 'Mikor és hogyan használható a privát pezsgőfürdő?',
        answer: 'A privát pezsgőfürdő a vendégház saját kertjében található, egész évben és a megadott házirendi feltételek szerint használható. Kizárólag a házat kibérlő vendégek privát használatára áll rendelkezésre.'
      },
      {
        id: 'faq-3',
        category: 'foglalas',
        question: 'Hány fő fér el kényelmesen a Zuzmo Kabinban?',
        answer: 'A teljes ház akár 6 fő kényelmes elszállásolására alkalmas. Az emeleten egy franciaágyas szoba (2 fő) és egy két külön ágyas szoba (2 fő) található, a földszinti nappaliban pedig két kényelmes kihúzható kanapé (2-2 fő) biztosít fekhelyet.'
      },
      {
        id: 'faq-4',
        category: 'hazirend',
        question: 'Lehet-e házi kedvencet (kutyust) hozni?',
        answer: 'Igen! A Zuzmo Kabin Vendégház kisállatbarát szálláshely, szívesen látjuk a jól nevelt kutyusokat a saját bekerített kertben.'
      },
      {
        id: 'faq-5',
        category: 'foglalas',
        question: 'Milyen fizetési módok érhetők el?',
        answer: 'Elfogadunk bankkártyás online fizetést, OTP, MBH és K&H SZÉP Kártyát, valamint közvetlen banki átutalást. A foglalás megerősítéséhez 30% előleg szükséges.'
      },
      {
        id: 'faq-6',
        category: 'erkezes',
        question: 'Hol található a ház, és van-e parkolási lehetőség?',
        answer: 'A vendégház Nagymaroson, a Szekér utcában található, közvetlenül az erdő szélén a Dunakanyarban. A helyszínen ingyenes privát parkoló áll a vendégek rendelkezésére.'
      }
    ],
    emailTemplates: [
      {
        id: 'tpl-1',
        name: 'Foglalás Visszaigazolás',
        subject: 'Sikeres foglalás – Zuzmo Kabin Vendégház ({{bookingId}})',
        body: 'Kedves {{guestName}}!\n\nÖrömmel értesítünk, hogy a foglalásodat a Zuzmo Kabin Vendégházban sikeresen rögzítettük!\n\nSzálláshely: Zuzmo Kabin Vendégház (Nagymaros, Szekér utca)\nÉrkezés: {{checkIn}}\nTávozás: {{checkOut}}\nVendégek száma: {{guestsCount}} fő\nVégösszeg: {{grandTotal}} Ft\nBefizetett előleg: {{depositPaid}} Ft\n\nÉrkezés előtt elküldjük az önálló bejutást biztosító zárható kulcsszéf nyitókódját.\nTelefonszámunk: +36 30 462 1242\n\nSzeretettel várunk Benneteket a Dunakanyarban!\nZuzmo Kabin Vendégház'
      },
      {
        id: 'tpl-2',
        name: 'Előleg Bekérő',
        subject: 'Előlegbekérő – Zuzmo Kabin Vendégház ({{bookingId}})',
        body: 'Kedves {{guestName}}!\n\nKöszönjük érdeklődésedet a Zuzmo Kabin Vendégház iránt. A lefoglalt időszak véglegesítéséhez kérjük az alábbi előleg átutalását 48 órán belül:\n\nÖsszeg: {{depositRequired}} Ft\nKedvezményezett: Zuzmo Kabin\nKözlemény: {{bookingId}}\nKapcsolat: +36 30 462 1242\n\nÜdvözlettel,\nZuzmo Kabin Vendégház'
      }
    ],
    emailLogs: [
      {
        id: 'log-1',
        to: 'nagy.gergely.demo@example.com',
        subject: 'Sikeres foglalás – Zuzmo Kabin Vendégház (ZUZ-2026-8941)',
        bookingId: 'ZUZ-2026-8941',
        sentAt: '2026-10-10T14:22:05Z',
        type: 'booking_confirmed',
        contentPreview: 'Kedves Nagy Gergely! Örömmel értesítünk, hogy a foglalásodat a Zuzmo Kabin Vendégházba sikeresen rögzítettük...'
      }
    ],
    settings: {
      integrations: {
        iCalSyncEnabled: true,
        lastSyncAt: '2026-10-16T08:00:00Z',
        onlinePaymentGateway: 'SimplePay & SZÉP Kártya Live',
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
    houseSpaces: db.houseSpaces || [],
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

// 2. Check room availability & calculate quote for single house
app.get('/api/availability', (req: Request, res: Response) => {
  const { checkIn, checkOut, guests } = req.query as {
    checkIn: string;
    checkOut: string;
    guests?: string;
  };

  if (!checkIn || !checkOut) {
    res.status(400).json({ error: 'Hiányzó paraméterek (checkIn, checkOut szükséges)' });
    return;
  }

  const db = loadDb();
  const room = db.rooms[0];
  if (!room) {
    res.status(404).json({ error: 'A szálláshely nem található' });
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
      error: `A minimálisan foglalható éjszakák száma: ${room.minNights} éjszaka`
    });
    return;
  }

  const guestCount = guests ? parseInt(guests, 10) : 2;
  if (guestCount > 6) {
    res.status(400).json({ error: 'A szálláshely legfeljebb 6 vendég számára alkalmas.' });
    return;
  }

  // Check collision with existing active bookings
  const hasConflict = db.bookings.some((b: any) => {
    if (b.status === 'cancelled') return false;
    return !(b.checkOut <= checkIn || b.checkIn >= checkOut);
  });

  // Check collision with blocked dates
  const hasBlockedConflict = (db.blockedDates || []).some((b: any) => {
    return !(b.endDate <= checkIn || b.startDate >= checkOut);
  });

  if (hasConflict || hasBlockedConflict) {
    res.json({
      available: false,
      message: 'A választott időpontban a Zuzmo Kabin Vendégház már foglalt vagy karbantartás alatt áll.'
    });
    return;
  }

  // Calculate pricing
  let baseTotal = 0;
  const cur = new Date(inDate);
  while (cur < outDate) {
    const dayOfWeek = cur.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    baseTotal += isWeekend ? room.weekendPricePerNight : room.basePricePerNight;
    cur.setDate(cur.getDate() + 1);
  }

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
    guestName,
    guestEmail,
    guestPhone,
    checkIn,
    checkOut,
    guestsCount,
    specialRequests,
    paymentMethod
  } = req.body;

  if (!guestName || !guestEmail || !guestPhone || !checkIn || !checkOut || !guestsCount) {
    res.status(400).json({ error: 'Kérjük, töltsd ki az összes kötelező mezőt!' });
    return;
  }

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (inDate >= outDate) {
    res.status(400).json({ error: 'A távozási dátumnak az érkezés után kell lennie.' });
    return;
  }

  if (guestsCount > 6) {
    res.status(400).json({ error: 'A Zuzmo Kabin Vendégház legfeljebb 6 vendég számára foglalható.' });
    return;
  }

  const db = loadDb();
  const room = db.rooms[0];
  const nights = Math.ceil(Math.abs(outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
  if (nights < room.minNights) {
    res.status(400).json({ error: `A minimálisan foglalható éjszakák száma: ${room.minNights} éjszaka.` });
    return;
  }

  // Atomic conflict check
  const conflict = db.bookings.some((b: any) => {
    if (b.status === 'cancelled') return false;
    return !(b.checkOut <= checkIn || b.checkIn >= checkOut);
  });

  const blockConflict = (db.blockedDates || []).some((b: any) => {
    return !(b.endDate <= checkIn || b.startDate >= checkOut);
  });

  if (conflict || blockConflict) {
    res.status(409).json({
      error: 'Sajnáljuk, a választott időpontban a vendégházat épp most foglalták le. Kérjük válassz másik időpontot!'
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

  const ifaPerNight = db.siteContent.policy.touristTaxPerPersonPerNight || 500;
  const touristTaxTotal = guestsCount * nights * ifaPerNight;
  const grandTotal = baseTotal + touristTaxTotal;
  const depositPercent = db.siteContent.policy.depositPercentage || 30;
  const depositRequired = Math.round(grandTotal * (depositPercent / 100));

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `ZUZ-2026-${randomSuffix}`;

  const newBooking = {
    id: bookingId,
    roomId: room.id,
    roomName: room.name,
    guestName,
    guestEmail,
    guestPhone,
    checkIn,
    checkOut,
    guestsCount,
    nights,
    baseTotal,
    extrasTotal: 0,
    touristTaxTotal,
    grandTotal,
    depositRequired,
    depositPaid: 0,
    paymentMethod: paymentMethod || 'card',
    paymentStatus: 'pending',
    status: 'pending',
    selectedExtras: [],
    specialRequests: specialRequests || '',
    createdAt: new Date().toISOString(),
    notes: 'Online foglalás a weboldalról (Nagymaros, Szekér utca).'
  };

  db.bookings.push(newBooking);

  // Log automated email
  db.emailLogs = db.emailLogs || [];
  db.emailLogs.unshift({
    id: `log-${Date.now()}`,
    to: guestEmail,
    subject: `Foglalási igény beérkezett – Zuzmo Kabin Vendégház (${bookingId})`,
    bookingId,
    sentAt: new Date().toISOString(),
    type: 'booking_received',
    contentPreview: `Kedves ${guestName}! Foglalási igényedet a Zuzmo Kabin Vendégházra (${checkIn} - ${checkOut}) sikeresen rögzítettük. Telefon: +36 30 462 1242.`
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

  db.emailLogs = db.emailLogs || [];
  db.emailLogs.unshift({
    id: `log-${Date.now()}`,
    to: booking.guestEmail,
    subject: `Foglalás megerősítve és fizetve – Zuzmo Kabin Vendégház (${booking.id})`,
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

// 5. Submit review
app.post('/api/reviews', (req: Request, res: Response) => {
  const { guestName, stayDate, rating, comment } = req.body;

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
    roomName: 'Zuzmo Kabin Vendégház',
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
    subject: `Új érdeklődés a Zuzmo Kabin weboldalról: ${subject || 'Kérdés'} (${name})`,
    sentAt: new Date().toISOString(),
    type: 'contact_inquiry',
    contentPreview: `Küldő: ${name} (${email}, Tel: ${phone || 'nincs megadva'}). Üzenet: ${message}`
  });

  saveDb(db);

  res.json({
    success: true,
    message: 'Köszönjük megkeresésedet! Munkatársunk hamarosan felveszi veled a kapcsolatot a +36 30 462 1242 számon vagy e-mailben.'
  });
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

app.get('/api/auth/setup-status', (_req: Request, res: Response) => {
  const db = loadDb();
  const hasOwner = (db.users || []).some((u: any) => u.role === 'owner');
  res.json({ hasOwner, userCount: (db.users || []).length });
});

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

app.get('/api/admin/stats', authMiddleware, (_req: Request, res: Response) => {
  const db = loadDb();
  const bookings = db.bookings || [];
  const todayStr = new Date().toISOString().split('T')[0];

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter((b: any) => b.status === 'pending').length;
  const todayArrivals = bookings.filter((b: any) => b.checkIn === todayStr && b.status === 'confirmed').length;

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
    totalRooms: 1
  });
});

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

  list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(list);
});

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

app.delete('/api/admin/bookings/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDb();
  const index = db.bookings.findIndex((b: any) => b.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'A foglalás nem található' });
    return;
  }

  db.bookings[index].status = 'cancelled';
  saveDb(db);
  res.json({ success: true, message: 'Foglalás lemondva' });
});

app.post('/api/admin/bookings/manual', authMiddleware, (req: Request, res: Response) => {
  const data = req.body;
  const db = loadDb();
  const bookingId = `ZUZ-MAN-${Math.floor(1000 + Math.random() * 9000)}`;

  const newBooking = {
    ...data,
    roomId: 'zuzmo-kabin',
    roomName: 'Zuzmo Kabin Vendégház',
    id: bookingId,
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);
  saveDb(db);
  res.status(201).json({ success: true, booking: newBooking });
});

app.get('/api/admin/blocked-dates', authMiddleware, (_req: Request, res: Response) => {
  const db = loadDb();
  res.json(db.blockedDates || []);
});

app.post('/api/admin/blocked-dates', authMiddleware, (req: Request, res: Response) => {
  const { startDate, endDate, reason } = req.body;
  if (!startDate || !endDate) {
    res.status(400).json({ error: 'Hiányzó adatok' });
    return;
  }
  const db = loadDb();
  const newBlock = {
    id: `block-${Date.now()}`,
    roomId: 'zuzmo-kabin',
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

app.get('/api/admin/rooms', authMiddleware, (_req: Request, res: Response) => {
  const db = loadDb();
  res.json(db.rooms || []);
});

app.put('/api/admin/rooms/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const db = loadDb();
  const index = db.rooms.findIndex((r: any) => r.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Vendégház nem található' });
    return;
  }
  db.rooms[index] = { ...db.rooms[index], ...updates };
  saveDb(db);
  res.json({ success: true, room: db.rooms[index] });
});

app.get('/api/admin/services', authMiddleware, (_req: Request, res: Response) => {
  const db = loadDb();
  res.json(db.services || []);
});

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

app.post('/api/admin/upload', authMiddleware, (req: Request, res: Response) => {
  try {
    const { filename, base64, title, category } = req.body;
    if (!base64) {
      res.status(400).json({ error: 'Nincs kép adat megadva' });
      return;
    }
    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = 'jpeg';
    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpeg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64, 'base64');
    }
    const safeName = `zuzmo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, safeName), buffer);
    const fileUrl = `/uploads/${safeName}`;

    const db = loadDb();
    const newItem = {
      id: `med-${Date.now()}`,
      title: title || filename || 'Feltöltött vendégház fotó',
      url: fileUrl,
      category: category || 'kulso',
      type: 'image'
    };
    db.gallery = db.gallery || [];
    db.gallery.unshift(newItem);
    saveDb(db);

    res.json({ success: true, url: fileUrl, item: newItem });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Feltöltési hiba történt' });
  }
});

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

app.put('/api/admin/site-content', authMiddleware, (req: Request, res: Response) => {
  const updates = req.body;
  const db = loadDb();
  db.siteContent = { ...db.siteContent, ...updates };
  saveDb(db);
  res.json({ success: true, content: db.siteContent });
});

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
    console.log(`🌲 Zuzmo Kabin Vendégház szerver fut a http://0.0.0.0:${PORT} porton`);
  });
}

startServer().catch((err) => {
  console.error('Szerver indítási hiba:', err);
  process.exit(1);
});
