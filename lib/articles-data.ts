export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Panduan Sewa" | "Tips Finansial" | "Tren Properti" | "Legalitas & Biaya";
  tags: string[];
  image: string;
  secondaryImage?: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    bio: string;
  };
  publishedAt: string;
  readTime: string;
  isFeatured?: boolean;
}

export const ARTICLES_DATA: ArticleItem[] = [
  {
    id: "art-001",
    slug: "strategi-memilih-apartemen-kawasan-transit-cbd-jakarta",
    title: "Strategi Cerdas Memilih Apartemen di Kawasan Transit CBD: Hemat Waktu & Biaya",
    excerpt:
      "Panduan praktis menentukan unit sewa di sepanjang koridor MRT dan LRT Jabodetabek agar mobilitas kerja efisien tanpa mengorbankan kenyamanan istirahat harian.",
    category: "Panduan Sewa",
    tags: ["Kawasan Transit", "Apartemen CBD", "Mobilitas Komuter", "Tips Sewa", "Jabodetabek"],
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Bambang Sudibyo",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Senior Property Analyst Tapak.",
      bio: "Praktisi riset pasar properti perkotaan dengan pengalaman lebih dari 10 tahun memetakan dinamika hunian sewa di kawasan metropolitan Jakarta.",
    },
    publishedAt: "28 Februari 2026",
    readTime: "5 menit baca",
    isFeatured: true,
    content: `
      <p class="lead text-lg font-medium text-slate-700 leading-relaxed mb-6">
        Tinggal di kawasan transit terpadu kini bukan sekadar gaya hidup, melainkan keputusan finansial dan efisiensi waktu yang krusial bagi profesional modern di kota-kota besar Indonesia. Dengan waktu tempuh harian yang dapat dipangkas hingga 60%, memilih unit sewa yang tepat di sekitar koridor transportasi publik menjadi kunci produktivitas jangka panjang.
      </p>

      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Menghitung Radius Jarak Tempuh Pejalan Kaki (Walkability)</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Salah satu kesalahan umum calon penyewa adalah menganggap jarak 1 kilometer di atas kertas mudah ditempuh setiap hari. Di iklim tropis, jarak ideal untuk berjalan kaki adalah antara 300 hingga 500 meter (sekitar 5–7 menit jalan kaki santai). Pastikan rute pejalan kaki memiliki trotoar yang terawat, penerangan memadai di malam hari, dan kanopi peneduh jika memungkinkan.
      </p>

      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Memperhitungkan Insulasi Suara dari Jalur Rel</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Unit apartemen yang berjarak sangat dekat dengan jalur layang kereta seringkali terpapar getaran dan kebisingan konstan. Sebelum menyepakati kontrak sewa tahunan, lakukan survei di dua waktu berbeda: saat jam sibuk pagi hari dan malam hari saat jadwal kereta ekspres melintas.
      </p>

      <div class="my-8 p-6 bg-blue-50/70 border-l-4 border-[#3D77EE] rounded-r-[14px]">
        <h4 class="font-bold text-[#1E3A8A] text-base mb-1">Standar Verifikasi Tapak.</h4>
        <p class="text-sm text-slate-700 leading-relaxed">
          Semua unit berlabel <strong>Gold</strong> dan <strong>Silver</strong> di Tapak telah melalui uji tingkat kebisingan desibel akustik serta verifikasi fasilitas kedap suara jendela ganda (double-glazed windows).
        </p>
      </div>

      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Bandingkan Total Biaya Sewa dengan Penghematan Ongkos Transportasi</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Unit di dekat stasiun transit biasanya memiliki premi harga sewa 10% hingga 18% lebih tinggi. Namun, jika Anda menghitung penghematan biaya bahan bakar, tarif jalan tol, tarif parkir harian gedung kantor, dan biaya taksi daring, selisih harga sewa tersebut seringkali impas atau bahkan menghasilkan penghematan bersih bulanan.
      </p>
    `,
  },
  {
    id: "art-002",
    slug: "5-manfaat-mengetahui-ipl-dan-utilitas-nyata-sebelum-kontrak-sewa",
    title: "5 Manfaat Mengetahui IPL & Utilitas Nyata Sebelum Menandatangani Kontrak Sewa",
    excerpt:
      "Banyak penyewa terkejut dengan lonjakan tagihan bulanan. Pelajari cara menghitung total biaya riil hunian apartemen dan rumah tapak secara transparan.",
    category: "Legalitas & Biaya",
    tags: ["Biaya IPL", "Utilitas Listrik", "Deposit Sewa", "Transparansi Biaya", "Legalitas"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Ni Putu Dewi",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      role: "Legal & Valuation Specialist",
      bio: "Konsultan hukum kontrak sewa properti komersial dan hunian dengan sertifikasi manajemen aset real estate.",
    },
    publishedAt: "24 Februari 2026",
    readTime: "6 menit baca",
    isFeatured: true,
    content: `
      <p class="lead text-lg font-medium text-slate-700 leading-relaxed mb-6">
        Biaya sewa bersih yang tertera di iklan seringkali belum mencakup Iuran Pengelolaan Lingkungan (IPL), biaya pemeliharaan fasilitas bersama, sinking fund, dan estimasi pemakaian listrik serta air. Tanpa kepastian angka di awal, penyewa dapat menghadapi pengeluaran tak terduga hingga jutaan rupiah per bulan.
      </p>

      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Menghindari Shock Tagihan di Akhir Bulan Pertama</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Apartemen mewah dengan fasilitas private lift dan kolam renang olympic umumnya mengenakan IPL berbasis luas unit ($/m²). Untuk unit berukuran 100 m² dengan tarif IPL Rp 35.000/m², Anda perlu menyiapkan Rp 3.500.000 per bulan di luar sewa pokok. Mengetahui angka ini di muka membantu Anda menyusun anggaran keluarga yang realistis.
      </p>

      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Memperjelas Batasan Tanggung Jawab Kerusakan</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Jika AC sentral atau pipa air mengalami kebocoran internal, apakah biaya reparasi ditanggung oleh pemilik unit atau dibebankan ke penyewa? Kontrak sewa standar Tapak mewajibkan penulisan klausul pertanggungan kerusakan struktural secara eksplisit.
      </p>

      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Menjaga Keamanan Dana Jaminan Deposit Sewa</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Sengketa pengembalian deposit sewa sering kali berakar dari klaim sepihak atas tunggakan utilitas atau tagihan IPL yang belum tercatat. Selalu minta bukti lunas bulan terakhir sebelum Anda serah terima kunci pertama kali.
      </p>
    `,
  },
  {
    id: "art-003",
    slug: "tips-finansial-alokasi-dana-darurat-dan-deposit-sewa-rumah",
    title: "Alokasi Dana Darurat & Deposit Sewa: Berapa Porsi Ideal dari Penghasilan Bulanan?",
    excerpt:
      "Ketahui rumus rasio 30% pendapatan untuk tempat tinggal serta metode aman menyimpan dana jaminan sewa agar kembali utuh di akhir masa kontrak.",
    category: "Tips Finansial",
    tags: ["Tips Finansial", "Rasio 30%", "Dana Darurat", "Perencanaan Anggaran", "Sewa Rumah"],
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Arya Wibawa",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      role: "Personal Finance & Property Writer",
      bio: "Penulis edukasi keuangan keluarga dan perencana anggaran independen berbasis di Jakarta Selatan.",
    },
    publishedAt: "20 Februari 2026",
    readTime: "4 menit baca",
    content: `
      <p class="lead text-lg font-medium text-slate-700 leading-relaxed mb-6">
        Menyewa hunian idaman adalah komitmen pengeluaran terbesar sebagian besar rumah tangga. Mengikuti aturan emas 30/30/3 dapat menyelamatkan keuangan Anda dari beban cicilan atau sewa berlebihan.
      </p>

      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Prinsip Alokasi Maksimal 30% Gaji Bersih</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Total pengeluaran tempat tinggal—termasuk harga sewa bulanan, tagihan IPL, pemakaian listrik, air, dan internet—sebaiknya tidak melampaui 30% dari total pendapatan bersih bulanan Anda dan pasangan. Jika melebihi angka tersebut, Anda berisiko memotong porsi tabungan investasi dan dana darurat.
      </p>

      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Memisahkan Rekening Khusus Deposit</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Deposit sewa (biasanya setara 1 atau 2 bulan harga sewa) bukanlah biaya yang hilang, melainkan aset jaminan. Pastikan bukti transfer deposit memiliki keterangan tertulis dan disimpan rapi dalam arsip digital Anda.
      </p>
    `,
  },
  {
    id: "art-004",
    slug: "tren-hunian-co-living-generasi-muda-di-kota-besar",
    title: "Transformasi Tren Co-Living di Kota Metropolitan: Lebih dari Sekadar Tempat Tinggal",
    excerpt:
      "Mengapa profesional muda Jabodetabek semakin melirik konsep co-living premium dengan fasilitas komunal lengkap dan fleksibilitas kontrak tinggi.",
    category: "Tren Properti",
    tags: ["Co-Living", "Kost Eksklusif", "Tren Generasi Muda", "Komunitas", "Fleksibilitas Sewa"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Clara Tanuwidjaja",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      role: "Lifestyle & Urban Living Editor",
      bio: "Kurator tren arsitektur interior dan gaya hidup perkotaan kontemporer untuk Tapak Media.",
    },
    publishedAt: "16 Februari 2026",
    readTime: "4 menit baca",
    content: `
      <p class="lead text-lg font-medium text-slate-700 leading-relaxed mb-6">
        Konsep indekos konvensional telah berevolusi pesat menjadi ekosistem co-living terpadu. Bukan sekadar kamar tidur pribadi, penyewa kini menikmati lounge kerja bersama (coworking space), dapur katering komunal, dan jaringan pertemanan profesional.
      </p>

      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Fleksibilitas Durasi Tanpa Komitmen Kaku</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Berbeda dengan apartemen yang sering menuntut pembayaran sewa setahun di muka, operator co-living modern menawarkan opsi bulanan atau kuartalan dengan tagihan all-in satu pintu mencakup Wi-Fi kencang dan pembersihan rutin.
      </p>
    `,
  },
  {
    id: "art-005",
    slug: "panduan-legalitas-perjanjian-sewa-menyewa-dan-klausul-wajib",
    title: "Bedah Klausul Perjanjian Sewa Menyewa: Poin Kritis yang Wajib Dipahami Penyewa",
    excerpt:
      "Pemeriksaan hak reparasi, biaya kerusakan struktural, hingga ketentuan pengembalian deposit agar kedua belah pihak terlindungi hukum perdata.",
    category: "Legalitas & Biaya",
    tags: ["Surat Kontrak", "Hukum Sewa", "Klausul Hukum", "Notaris", "Perlindungan Hak"],
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Ni Putu Dewi",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      role: "Legal & Valuation Specialist",
      bio: "Konsultan hukum kontrak sewa properti komersial dan hunian dengan sertifikasi manajemen aset real estate.",
    },
    publishedAt: "12 Februari 2026",
    readTime: "7 menit baca",
    content: `
      <p class="lead text-lg font-medium text-slate-700 leading-relaxed mb-6">
        Perjanjian Sewa Menyewa (PKS) di atas meterai resmi adalah benteng perlindungan terkuat Anda. Namun, banyak pihak menandatangani dokumen tanpa membaca klausul force majeure, terminasi dini, atau sanksi keterlambatan pembayaran.
      </p>

      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Tiga Klausul Krusial yang Sering Terlewat</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        1. <strong>Klausul Perbaikan Struktural vs Kosmetik:</strong> Pastikan kerusakan atap bocor atau pipa tanam adalah tanggung jawab pemilik, bukan penyewa.<br/>
        2. <strong>Batas Waktu Pengembalian Deposit:</strong> Tetapkan jangka waktu maksimal (misalnya 14 hari kerja setelah serah terima kunci) bagi pemilik untuk mengembalikan dana jaminan.<br/>
        3. <strong>Hak Akses Pemilik:</strong> Pemilik tidak boleh memasuki properti yang disewa tanpa pemberitahuan tertulis minimal 24 jam sebelumnya.
      </p>
    `,
  },
  {
    id: "art-006",
    slug: "dekorasi-dan-penataan-interior-apartemen-studio-agar-lapang",
    title: "Trik Menata Interior Apartemen Studio 24–35 m² agar Terasa Dua Kali Lebih Lapang",
    excerpt:
      "Sentuhan pencahayaan tersembunyi, furnitur multifungsi, dan palet warna netral yang membuat hunian kompak tetap bernuansa lega dan mewah.",
    category: "Panduan Sewa",
    tags: ["Desain Interior", "Apartemen Studio", "Dekorasi Minimalis", "Furnitur Multifungsi", "Ruang Kompak"],
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Clara Tanuwidjaja",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      role: "Lifestyle & Urban Living Editor",
      bio: "Kurator tren arsitektur interior dan gaya hidup perkotaan kontemporer untuk Tapak Media.",
    },
    publishedAt: "08 Februari 2026",
    readTime: "5 menit baca",
    content: `
      <p class="lead text-lg font-medium text-slate-700 leading-relaxed mb-6">
        Keterbatasan luas meter persegi tidak berarti Anda harus mengorbankan estetika dan kenyamanan. Dengan penataan zoning pintar dan pemilihan furnitur berkaki ramping, apartemen tipe studio berukuran 24 m² bisa disulap layaknya suite hotel butik.
      </p>

      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Gunakan Partisi Kaca atau Rak Terbuka Ketimbang Dinding Masif</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Memisahkan area tidur dari ruang duduk dapat dilakukan menggunakan rak buku tanpa punggung atau tirai linen tembus pandang. Sirkulasi cahaya alami dari jendela utama tetap mengalir lancar ke seluruh sudut ruangan.
      </p>
    `,
  },
  {
    id: "art-007",
    slug: "analisis-investasi-sewa-rumah-resort-dan-vila-tropis-bali",
    title: "Dinamika Pasar Sewa Vila Tropis & Hunian Resort di Bali & Sekitarnya Tahun 2026",
    excerpt:
      "Tinjauan mendalam pergeseran minat nomad digital global dan pelancong domestik terhadap sewa jangka menengah di area Sanur dan Canggu.",
    category: "Tren Properti",
    tags: ["Vila Tropis", "Pasar Bali", "Investasi Sewa", "Digital Nomad", "Resort Living"],
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Bambang Sudibyo",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Senior Property Analyst Tapak.",
      bio: "Praktisi riset pasar properti perkotaan dengan pengalaman lebih dari 10 tahun memetakan dinamika hunian sewa di kawasan metropolitan Jakarta dan Bali.",
    },
    publishedAt: "02 Februari 2026",
    readTime: "6 menit baca",
    content: `
      <p class="lead text-lg font-medium text-slate-700 leading-relaxed mb-6">
        Permintaan sewa jangka menengah (3–6 bulan) untuk vila tropis di Bali terus meningkat seiring adopsi kerja jarak jauh (work from anywhere). Kawasan Sanur dengan atmosfer yang tenang menjadi magnet bagi keluarga, sementara Canggu dan Kuta Utara tetap dominan bagi pegiat startup kreatif.
      </p>

      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Pentingnya Verifikasi Keabsahan IMB & Izin Sewa Komersial</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Menyewa vila di pulau dewata menuntut kehati-hatian ekstra terhadap zonasi tata ruang dan perizinan. Verifikasi legalitas sertifikat hak sewa (leasehold) di Tapak memastikan masa sewa Anda berjalan tanpa risiko sengketa tanah adat.
      </p>
    `,
  },
];

export function getArticles(): ArticleItem[] {
  return ARTICLES_DATA;
}

export function getArticleBySlug(slug: string): ArticleItem | undefined {
  return ARTICLES_DATA.find((a) => a.slug === slug);
}

export function getFeaturedArticles(): ArticleItem[] {
  return ARTICLES_DATA.slice(0, 3);
}
