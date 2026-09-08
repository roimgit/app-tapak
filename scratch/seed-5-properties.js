const { PrismaClient, AmenityCategory, VerificationTier } = require("@prisma/client");

const prisma = new PrismaClient();

const NEW_PROPERTIES = [
  {
    title: "Signature Park Grande MT Haryono 2BR Corner Unit",
    slug: "signature-park-grande-mt-haryono-2br-corner-unit",
    description:
      "Unit apartemen sudut lantai menengah dengan pencahayaan alami optimal dan view kota tanpa halangan. Dilengkapi 2 kamar tidur full furnished, balkon privat, kitchen set komplit, dan akses langsung ke stasiun LRT Cawang.",
    price: 8500000,
    deposit: 8500000,
    maintenance_fee: 650000,
    utility_estimate: 500000,
    verification_tier: VerificationTier.GOLD,
    property_type: "Apartemen",
    bedrooms: 2,
    bathrooms: 1,
    area_sqm: 43,
    address: "Jl. Letjen M.T. Haryono No. 20, Cawang",
    district: "Cawang",
    city: "Jakarta Timur",
    latitude: -6.2442,
    longitude: 106.8647,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80",
    ],
    amenities: [
      "AC Inverter Tiap Kamar",
      "Kolam Renang Olympic Size",
      "Pusat Kebugaran / Gym",
      "Kartu Akses Lift Privat",
      "Balkon Pemandangan Kota",
      "Keamanan 24 Jam & CCTV",
      "Minimarket 24 Jam di Lobby",
    ],
    agent_name: "Mitra Pemilik Oim",
    agent_phone: "6281234567890",
    nearby_amenities: [
      {
        category: AmenityCategory.TRANSPORT,
        name: "Stasiun LRT Cawang",
        distance: "280 m",
        duration: "4 menit jalan kaki",
        latitude: -6.2448,
        longitude: 106.8652,
      },
      {
        category: AmenityCategory.TRANSPORT,
        name: "Halte TransJakarta Cawang BNN",
        distance: "420 m",
        duration: "6 menit jalan kaki",
        latitude: -6.2455,
        longitude: 106.8661,
      },
      {
        category: AmenityCategory.HEALTH,
        name: "RSUD Budhi Asih",
        distance: "750 m",
        duration: "9 menit jalan kaki",
        latitude: -6.2471,
        longitude: 106.8682,
      },
      {
        category: AmenityCategory.EDUCATION,
        name: "SMA Negeri 8 Jakarta",
        distance: "1.4 km",
        duration: "5 menit berkendara",
        latitude: -6.2345,
        longitude: 106.8612,
      },
      {
        category: AmenityCategory.SHOPPING,
        name: "Transmart MT Haryono",
        distance: "600 m",
        duration: "8 menit jalan kaki",
        latitude: -6.2428,
        longitude: 106.8615,
      },
    ],
  },
  {
    title: "Rumah Modern Kontemporer Symphonia Summarecon Serpong",
    slug: "rumah-modern-kontemporer-symphonia-summarecon-serpong",
    description:
      "Hunian tapak 2 lantai konsep smart eco-living di cluster Symphonia Summarecon Serpong. Memiliki inner courtyard asri, carport 2 mobil, sistem tata udara ventilasi silang, dan keamanan sistem one gate terpadu.",
    price: 16000000,
    deposit: 16000000,
    maintenance_fee: 750000,
    utility_estimate: 900000,
    verification_tier: VerificationTier.GOLD,
    property_type: "Rumah",
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 128,
    address: "Cluster Mozart Symphonia Blok B No. 12, Gading Serpong",
    district: "Kelapa Dua",
    city: "Tangerang",
    latitude: -6.2625,
    longitude: 106.6190,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1000&auto=format&fit=crop&q=80",
    ],
    amenities: [
      "Smart Lock & Door Sensor",
      "Solar Water Heater",
      "Carport 2 Mobil Kanopi",
      "Taman Belakang Privat",
      "Clubhouse & Kolam Renang Cluster",
      "Jogging Track Danau Symphonia",
      "Keamanan 24 Jam Patroli",
    ],
    agent_name: "Mitra Pemilik Oim",
    agent_phone: "6281234567890",
    nearby_amenities: [
      {
        category: AmenityCategory.EDUCATION,
        name: "Universitas Multimedia Nusantara (UMN)",
        distance: "850 m",
        duration: "10 menit jalan kaki",
        latitude: -6.2575,
        longitude: 106.6185,
      },
      {
        category: AmenityCategory.HEALTH,
        name: "RS Bethsaida Gading Serpong",
        distance: "1.2 km",
        duration: "4 menit berkendara",
        latitude: -6.2552,
        longitude: 106.6241,
      },
      {
        category: AmenityCategory.SHOPPING,
        name: "Summarecon Mall Serpong (SMS)",
        distance: "2.1 km",
        duration: "6 menit berkendara",
        latitude: -6.2435,
        longitude: 106.6288,
      },
      {
        category: AmenityCategory.WORSHIP,
        name: "Masjid Raya Asmaul Husna",
        distance: "1.5 km",
        duration: "5 menit berkendara",
        latitude: -6.2512,
        longitude: 106.6265,
      },
      {
        category: AmenityCategory.TRANSPORT,
        name: "Halte Shuttle Bus Paramount Skyline",
        distance: "650 m",
        duration: "8 menit jalan kaki",
        latitude: -6.2595,
        longitude: 106.6215,
      },
    ],
  },
  {
    title: "Kost Putri Eksklusif Kemang Pratama Suites",
    slug: "kost-putri-eksklusif-kemang-pratama-suites",
    description:
      "Kamar sewa co-living eksklusif khusus mahasiswi dan wanita karir di jantung kawasan Kemang. Dilengkapi springbed queen, kamar mandi dalam water heater, smart TV, WiFi gigabit, pembersihan kamar 2x seminggu, dan dapur bersama lengkap.",
    price: 4200000,
    deposit: 2000000,
    maintenance_fee: 0,
    utility_estimate: 300000,
    verification_tier: VerificationTier.SILVER,
    property_type: "Kost",
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 22,
    address: "Jl. Kemang Timur Raya No. 45",
    district: "Mampang Prapatan",
    city: "Jakarta Selatan",
    latitude: -6.2612,
    longitude: 106.8155,
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop&q=80",
    ],
    amenities: [
      "Kamar Mandi Dalam & Water Heater",
      "AC Daikin Hemat Energi",
      "WiFi Cepat 100 Mbps",
      "Smart Android TV 43 Inch",
      "Dapur Komunal & Kulkas Bersama",
      "Layanan Laundry Baju",
      "CCTV & Akses Pintu Smart Lock",
    ],
    agent_name: "Mitra Pemilik Oim",
    agent_phone: "6281234567890",
    nearby_amenities: [
      {
        category: AmenityCategory.SHOPPING,
        name: "Kemang Village Mall (Lippo Mall)",
        distance: "750 m",
        duration: "9 menit jalan kaki",
        latitude: -6.2642,
        longitude: 106.8125,
      },
      {
        category: AmenityCategory.TRANSPORT,
        name: "Stasiun MRT Blok A",
        distance: "1.8 km",
        duration: "6 menit berkendara",
        latitude: -6.2558,
        longitude: 106.7972,
      },
      {
        category: AmenityCategory.HEALTH,
        name: "RS Brawijaya Duren Tiga",
        distance: "1.2 km",
        duration: "5 menit berkendara",
        latitude: -6.2521,
        longitude: 106.8245,
      },
      {
        category: AmenityCategory.EDUCATION,
        name: "Sekolah Al-Azhar Syifa Budi Kemang",
        distance: "500 m",
        duration: "6 menit jalan kaki",
        latitude: -6.2592,
        longitude: 106.8172,
      },
    ],
  },
  {
    title: "Private Pool Villa Canggu Echo Beach Sanctuary",
    slug: "private-pool-villa-canggu-echo-beach-sanctuary",
    description:
      "Vila bergaya tropical bohemian modern berjarak 5 menit dari pantai Echo Beach Canggu. Memiliki kolam renang pribadi dengan dek berjemur, ruang keluarga semi-terbuka menghadap taman tropis, dapur bar elegan, dan kamar tidur king size ber-en suite bathtub.",
    price: 28500000,
    deposit: 20000000,
    maintenance_fee: 1200000,
    utility_estimate: 1500000,
    verification_tier: VerificationTier.GOLD,
    property_type: "Vila",
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 180,
    address: "Jl. Pantai Batu Mejan No. 28, Canggu",
    district: "Kuta Utara",
    city: "Badung",
    latitude: -8.6534,
    longitude: 115.1298,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80",
    ],
    amenities: [
      "Private Swimming Pool & Sunbeds",
      "High Speed Fiber Optic WiFi",
      "Bathtub Terbuka Tropical",
      "Open Plan Kitchen & Dining Bar",
      "Daily Pool & Garden Maintenance",
      "Private Carport & Scooter Bay",
      "Smart TV & Soundbar Bluetooth",
    ],
    agent_name: "Mitra Pemilik Oim",
    agent_phone: "6281234567890",
    nearby_amenities: [
      {
        category: AmenityCategory.TRANSPORT,
        name: "Pangkalan Taxi & Ojek Echo Beach",
        distance: "350 m",
        duration: "4 menit jalan kaki",
        latitude: -8.6545,
        longitude: 115.1282,
      },
      {
        category: AmenityCategory.SHOPPING,
        name: "Pepito Supermarket Canggu",
        distance: "800 m",
        duration: "10 menit jalan kaki",
        latitude: -8.6512,
        longitude: 115.1345,
      },
      {
        category: AmenityCategory.HEALTH,
        name: "Canggu Medical Clinic 24 Jam",
        distance: "950 m",
        duration: "12 menit jalan kaki",
        latitude: -8.6495,
        longitude: 115.1368,
      },
      {
        category: AmenityCategory.WORSHIP,
        name: "Pura Batu Bolong Canggu",
        distance: "650 m",
        duration: "8 menit jalan kaki",
        latitude: -8.6562,
        longitude: 115.1265,
      },
    ],
  },
  {
    title: "Ruko Komersial Prime 3 Lantai Central Park Ahmad Yani",
    slug: "ruko-komersial-prime-3-lantai-central-park-ahmad-yani",
    description:
      "Ruko komersial 3 lantai siap pakai berada di jalan protokol utama Ahmad Yani Kota Bekasi. Lokasi sangat strategis untuk kantor cabang perbankan, klinik estetika, cafe/resto kekinian, atau kantor ekspedisi dengan area parkir bersama luas.",
    price: 24000000,
    deposit: 15000000,
    maintenance_fee: 600000,
    utility_estimate: 800000,
    verification_tier: VerificationTier.SILVER,
    property_type: "Ruko",
    bedrooms: 1,
    bathrooms: 3,
    area_sqm: 195,
    address: "Komplek Ruko Central Park Blok A No. 8, Jl. Jend. Ahmad Yani",
    district: "Bekasi Selatan",
    city: "Bekasi",
    latitude: -6.2415,
    longitude: 106.9942,
    images: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80",
    ],
    amenities: [
      "Area Parkir Luas Bebas Biaya",
      "Listrik PLN 6.600 VA 3 Phase",
      "Rolling Door Besi & Kaca Tempered",
      "Kamar Mandi Tiap Lantai",
      "Toren Air 1000L & Pompa Pendorong",
      "Jalur Telepon & Internet Fiber Optik",
      "Keamanan Kawasan 24 Jam",
    ],
    agent_name: "Mitra Pemilik Oim",
    agent_phone: "6281234567890",
    nearby_amenities: [
      {
        category: AmenityCategory.TRANSPORT,
        name: "Stasiun KRL Bekasi",
        distance: "1.1 km",
        duration: "4 menit berkendara",
        latitude: -6.2362,
        longitude: 106.9995,
      },
      {
        category: AmenityCategory.SHOPPING,
        name: "Metropolitan Mall Bekasi",
        distance: "650 m",
        duration: "8 menit jalan kaki",
        latitude: -6.2448,
        longitude: 106.9915,
      },
      {
        category: AmenityCategory.HEALTH,
        name: "RS Mitra Keluarga Bekasi Barat",
        distance: "900 m",
        duration: "11 menit jalan kaki",
        latitude: -6.2465,
        longitude: 106.9885,
      },
      {
        category: AmenityCategory.WORSHIP,
        name: "Masjid Agung Al-Barkah Bekasi",
        distance: "850 m",
        duration: "10 menit jalan kaki",
        latitude: -6.2385,
        longitude: 106.9972,
      },
    ],
  },
];

async function seed() {
  console.log("Memulai penambahan 5 data properti baru...");

  for (const item of NEW_PROPERTIES) {
    const { nearby_amenities, ...propData } = item;

    // Hapus properti lama dengan slug yang sama jika pernah diuji
    await prisma.nearbyAmenity.deleteMany({
      where: { listing: { slug: propData.slug } },
    });
    await prisma.listing.deleteMany({
      where: { slug: propData.slug },
    });

    const createdListing = await prisma.listing.create({
      data: propData,
    });

    console.log(`[OK] Berhasil membuat listing: ${createdListing.title} (${createdListing.id})`);

    // Update PostGIS location
    try {
      await prisma.$executeRawUnsafe(
        `UPDATE listings SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3`,
        propData.longitude,
        propData.latitude,
        createdListing.id
      );
      console.log(`  -> PostGIS point geometry tersimpan.`);
    } catch (geomErr) {
      console.warn(`  -> PostGIS warning:`, geomErr.message);
    }

    // Insert Nearby Amenities
    if (nearby_amenities && nearby_amenities.length > 0) {
      await prisma.nearbyAmenity.createMany({
        data: nearby_amenities.map((a) => ({
          listing_id: createdListing.id,
          category: a.category,
          name: a.name,
          distance: a.distance,
          duration: a.duration,
          latitude: a.latitude,
          longitude: a.longitude,
        })),
      });
      console.log(`  -> ${nearby_amenities.length} fasilitas sekitar tersimpan.`);
    }
  }

  const total = await prisma.listing.count();
  console.log(`\nSELESAI! Total data properti di database Supabase saat ini: ${total}`);
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
