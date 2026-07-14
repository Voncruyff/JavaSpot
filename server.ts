import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Destination, Article, ActivityLog } from './src/types';

const app = express();
const PORT = 3000;
const COOKIE_SECRET = 'javaspot_super_secret_cookie_salt';
const ADMIN_TOKEN_VALUE = 'javaspot_secure_session_token_2026';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'javaspot2026'; // Preconfigured admin password

app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

// Database file path for persisting destinations
const DB_FILE_PATH = path.join(process.cwd(), 'destinations.json');
const ARTICLES_FILE_PATH = path.join(process.cwd(), 'articles.json');
const LOGS_FILE_PATH = path.join(process.cwd(), 'logs.json');

// Default initial articles seed data
const DEFAULT_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Panduan Lengkap Menikmati Sunrise Eksotis di Candi Borobudur',
    content: 'Menyaksikan matahari terbit di atas Candi Borobudur adalah salah satu pengalaman spiritual dan visual paling menakjubkan di Pulau Jawa. Kabut pagi yang menyelimuti lembah Kedu, dikelilingi oleh Gunung Merapi, Merbabu, Sumbing, dan Sindoro, menciptakan siluet mistis stupa-stupa Borobudur yang megah.\n\nUntuk mendapatkan pemandangan terbaik, disarankan untuk masuk melalui rute khusus fajar atau menginap di hotel dekat kawasan candi. Datanglah sekitar pukul 4:30 pagi agar mendapatkan posisi duduk terbaik menghadap timur.\n\nJangan lupa untuk membawa senter kecil karena tangga candi masih gelap di waktu fajar, gunakan jaket karena udara subuh cukup dingin, dan pastikan kamera Anda siap merekam momen magis ini.',
    imageUrl: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=800&q=80',
    author: 'Siti Rahmawati',
    createdAt: '2026-06-25T08:30:00Z',
    readTime: '5 Menit Baca',
    tags: ['Candi', 'Sunrise', 'Jawa Tengah', 'Tips Wisata']
  },
  {
    id: '2',
    title: 'Pesona Laut Pasir Gunung Bromo: Petualangan ke Kawah Vulkanik Aktif',
    content: 'Taman Nasional Bromo Tengger Semeru menawarkan keindahan lanskap vulkanis yang tiada duanya di dunia. Dengan berkendara menggunakan Jeep 4x4, Anda akan menuruni tebing kaldera curam menuju lautan pasir seluas 10 kilometer persegi yang sunyi namun memukau.\n\nMenjelajahi kawah aktif Bromo membutuhkan fisik yang bugar karena Anda harus mendaki tangga beton setinggi lebih dari 250 anak tangga. Bau belerang yang pekat sesekali terhembus angin fajar, mengingatkan kita akan kekuatan alam bumi yang dahsyat.\n\nTips paling penting saat mendaki kawah adalah menggunakan masker penutup debu pasir dan kacamata pelindung. Anda juga bisa menyewa jasa kuda Tengger untuk mengantar Anda dari kaki kaldera menuju bawah tangga kawah.',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    author: 'Dwi Saputra',
    createdAt: '2026-06-24T10:15:00Z',
    readTime: '4 Menit Baca',
    tags: ['Gunung', 'Petualangan', 'Jawa Timur', 'Kawah']
  },
  {
    id: '3',
    title: 'Eksplorasi Kuliner Malam Legendaris di Sekitar Jalan Malioboro Yogyakarta',
    content: 'Yogyakarta adalah surga bagi para pecinta kuliner tradisional manis dan gurih. Begitu senja mulai turun, trotoar Jalan Malioboro yang rindang seketika berubah menjadi jajaran warung lesehan dengan tikar tradisional yang hangat.\n\nDari sekian banyak menu kuliner, Anda wajib mencicipi Sate Kere (sate gembus sapi dengan bumbu kacang pedas manis), Gudeg Wijilan legendaris yang manis gurih berteman areh kental, serta menikmati hangatnya Kopi Joss yang disajikan dengan arang membara langsung di dalam gelas Anda.\n\nJangan lupa pula mengunjungi Pasar Beringharjo di siang hari untuk berburu pecel sayuran segar bertabur siraman bumbu kacang pekat khas kraton dengan harga yang sangat bersahabat.',
    imageUrl: 'https://images.unsplash.com/photo-1571731956686-34372ed41b0c?auto=format&fit=crop&w=800&q=80',
    author: 'Agung Laksono',
    createdAt: '2026-06-23T14:45:00Z',
    readTime: '6 Menit Baca',
    tags: ['Kuliner', 'Yogyakarta', 'Malioboro', 'Lesehan']
  }
];

// Default initial destinations seed data
const DEFAULT_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Candi Borobudur',
    province: 'Jawa Tengah',
    city: 'Magelang',
    category: 'Sejarah & Budaya',
    description: 'Candi Buddha terbesar di dunia yang dibangun pada abad ke-9 oleh wangsa Syailendra. Bangunan ini dihiasi oleh 2.672 panel relief dan 504 arca Buddha. Borobudur merupakan salah satu monumen Buddha terbesar sekaligus warisan budaya dunia UNESCO yang menawarkan pemandangan matahari terbit yang magis di atas kabut pagi.',
    imageUrl: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1200&q=80',
    entranceFee: 50000,
    rating: 4.9,
    reviewsCount: 2450,
    featured: true,
    locationCoordinates: '-7.607869, 110.203752',
    bestTimeToVisit: 'Pagi Hari (04:30 - 07:00) untuk mengejar Golden Sunrise',
    recommendedTips: [
      'Datanglah sepagi mungkin untuk menyaksikan matahari terbit yang terkenal.',
      'Kenakan pakaian yang sopan (menutup bahu dan lutut).',
      'Sewa pemandu lokal berlisensi untuk menceritakan kisah relief candi secara mendalam.',
      'Gunakan alas kaki yang nyaman karena Anda akan banyak menaiki tangga batu.'
    ]
  },
  {
    id: '2',
    name: 'Gunung Bromo',
    province: 'Jawa Timur',
    city: 'Probolinggo',
    category: 'Alam',
    description: 'Gunung berapi aktif legendaris yang terletak di tengah Kaldera Tengger yang luas dan dikelilingi laut pasir seluas 10 kilometer persegi. Keindahan Bromo yang terkenal adalah panorama kaldera raksasa dari Penanjakan 1 di kala fajar, dengan latar belakang Gunung Batok yang berulir dan Gunung Semeru yang mengepulkan abu di kejauhan.',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80',
    entranceFee: 35000,
    rating: 4.8,
    reviewsCount: 1980,
    featured: true,
    locationCoordinates: '-7.942493, 112.953012',
    bestTimeToVisit: 'Musim Kemarau (Mei - September) untuk langit fajar yang cerah',
    recommendedTips: [
      'Bawalah jaket tebal, sarung tangan, syal, dan penutup telinga karena suhu bisa mencapai 5°C.',
      'Gunakan masker penutup hidung untuk menghindari abu pasir berlerang di sekitar kawah.',
      'Pesanlah armada Jeep 4x4 jauh-jauh hari untuk transportasi di kawasan pasir Bromo.',
      'Jika lelah berjalan dari area parkir Jeep menuju tangga kawah, Anda bisa menyewa kuda lokal.'
    ]
  },
  {
    id: '3',
    name: 'Kawah Putih Ciwidey',
    province: 'Jawa Barat',
    city: 'Bandung',
    category: 'Alam',
    description: 'Sebuah danau kawah vulkanis yang menakjubkan dengan air berwarna putih kehijauan yang dramatis, kontras dengan tebing kapur dan pepohonan kering di sekelilingnya. Air kawah ini sering kali berubah warna tergantung pada kadar belerang, suhu, dan cuaca. Udara dingin pegunungan Ciwidey yang segar menyelimuti kawasan mistis berbau belerang ini.',
    imageUrl: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=1200&q=80',
    entranceFee: 28000,
    rating: 4.6,
    reviewsCount: 1120,
    featured: false,
    locationCoordinates: '-7.166205, 107.402125',
    bestTimeToVisit: 'Sore Hari (14:00 - 16:00) saat kabut tipis mulai turun berhias cahaya lembut',
    recommendedTips: [
      'Jangan terlalu lama berada di tepi kawah karena konsentrasi gas belerang cukup menyengat.',
      'Masker sangat direkomendasikan dan biasanya juga dijual oleh pedagang lokal di gerbang.',
      'Bawa jaket tipis atau sweater karena kawasan ini cukup berangin dan dingin.',
      'Gunakan shuttle Ontang-Anting yang seru untuk menaiki rute menanjak dari gerbang utama ke kawah.'
    ]
  },
  {
    id: '4',
    name: 'Candi Prambanan',
    province: 'DI Yogyakarta',
    city: 'Sleman',
    category: 'Sejarah & Budaya',
    description: 'Kompleks candi Hindu (Siwa) terbesar di Indonesia yang dibangun pada abad ke-9 Masehi oleh raja-raja Dinasti Sanjaya. Arsitekturnya yang tinggi ramping menjulang setinggi 47 meter melambangkan Gunung Mahameru. Candi ini menyuguhkan relief epik Ramayana yang terpahat indah dan pertunjukan legendaris Sendratari Ramayana di panggung terbuka berlatar belakang candi.',
    imageUrl: 'https://images.unsplash.com/photo-1626125336183-4a6c6e730825?auto=format&fit=crop&w=1200&q=80',
    entranceFee: 50000,
    rating: 4.8,
    reviewsCount: 1670,
    featured: false,
    locationCoordinates: '-7.752020, 110.491467',
    bestTimeToVisit: 'Sore Hari (15:30 - 18:00) saat langit senja merona indah di balik siluet candi',
    recommendedTips: [
      'Sempatkan menonton Sendratari Ramayana yang biasanya diadakan saat malam hari di tanggal tertentu.',
      'Gunakan payung atau topi jika berkunjung di siang hari karena pelataran sangat luas dan terbuka.',
      'Sewa sepeda santai di dalam kompleks candi untuk mengeksplorasi candi-candi pendukung seperti Candi Sewu.',
      'Pastikan kamera Anda terisi penuh, pencahayaan matahari sore di Prambanan sangat luar biasa.'
    ]
  },
  {
    id: '5',
    name: 'Taman Nasional Ujung Kulon',
    province: 'Banten',
    city: 'Pandeglang',
    category: 'Alam',
    description: 'Situs Warisan Dunia UNESCO yang terletak di ujung barat Pulau Jawa. Taman nasional ini merupakan habitat alami terakhir bagi Badak Jawa yang terancam punah. Daerah ini menyimpan hutan hujan tropis dataran rendah terluas di Jawa, terumbu karang yang murni di Pulau Peucang, pantai pasir putih yang spektakuler, serta padang penggembalaan banteng liar di Cidaon.',
    imageUrl: 'https://images.unsplash.com/photo-1611602132416-ab200fa4079a?auto=format&fit=crop&w=1200&q=80',
    entranceFee: 15000,
    rating: 4.7,
    reviewsCount: 450,
    featured: false,
    locationCoordinates: '-6.745484, 105.334237',
    bestTimeToVisit: 'Musim Kemarau (April - Oktober) untuk ombak laut yang lebih tenang dan penjelajahan pulau yang aman',
    recommendedTips: [
      'Gunakan jasa pemandu resmi dari Balai Taman Nasional demi keamanan ekspedisi.',
      'Nikmati snorkeling yang menakjubkan di sekitar perairan murni Pulau Peucang.',
      'Lakukan pengamatan satwa liar dari menara pantau padang penggembalaan Cidaon di pagi atau sore hari.',
      'Siapkan fisik yang prima dan bawa obat-obatan pribadi serta pelindung anti-nyamuk hutan.'
    ]
  },
  {
    id: '6',
    name: 'Kota Tua Jakarta',
    province: 'DKI Jakarta',
    city: 'Jakarta Barat',
    category: 'Sejarah & Budaya',
    description: 'Kawasan bersejarah seluas 1,3 kilometer persegi di Jakarta Utara dan Barat yang juga dikenal dengan sebutan Oud Batavia. Merupakan pusat perdagangan VOC di Asia pada abad ke-17. Berpusat di Museum Fatahillah (Taman Fatahillah), kawasan ramah pejalan kaki ini dikelilingi gedung kolonial megah, aktivitas seniman jalanan, penyewaan sepeda ontel berwarna-warni, serta Kafe Batavia yang legendaris.',
    imageUrl: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=1200&q=80',
    entranceFee: 5000,
    rating: 4.5,
    reviewsCount: 3120,
    featured: false,
    locationCoordinates: '-6.135201, 106.813301',
    bestTimeToVisit: 'Sore hingga Malam Hari (16:00 - 20:00) saat lampu kolonial mulai menyala hangat',
    recommendedTips: [
      'Sewa sepeda ontel hias lengkap dengan topi klasik berwarna senada untuk berfoto estetik di alun-alun.',
      'Kunjungi museum-museum di sekitarnya seperti Museum Sejarah Jakarta, Museum Wayang, dan Museum Seni Rupa.',
      'Cicipi hidangan otentik khas Betawi seperti Kerak Telor yang dijual oleh pedagang tradisional.',
      'Gunakan transportasi umum KRL Commuterline dan turun tepat di Stasiun Jakarta Kota untuk akses yang sangat dekat.'
    ]
  },
  {
    id: '7',
    name: 'Dunia Fantasi (Dufan)',
    province: 'DKI Jakarta',
    city: 'Jakarta Utara',
    category: 'Taman Rekreasi',
    description: 'Taman hiburan tematik pertama dan terbesar di Indonesia yang terletak di dalam kawasan wisata Ancol Taman Impian. Dufan menawarkan petualangan fantasi keliling dunia melalui puluhan wahana permainan berteknologi tinggi yang memicu adrenalin, seperti Halilintar (Roller Coaster), Niagara-Gara, Kora-Kora, hingga Istana Boneka yang ramah keluarga.',
    imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=80',
    entranceFee: 250000,
    rating: 4.7,
    reviewsCount: 4230,
    featured: true,
    locationCoordinates: '-6.125211, 106.833111',
    bestTimeToVisit: 'Hari Kerja (Senin - Jumat) untuk menghindari antrean wahana yang terlalu panjang',
    recommendedTips: [
      'Beli tiket secara online terlebih dahulu untuk menghemat waktu masuk gerbang.',
      'Bawa pakaian ganti karena beberapa wahana air seperti Niagara-Gara dan Arung Jeram akan membuat Anda basah kuyup.',
      'Kenakan pakaian berbahan katun kasual dan sepatu olahraga karena Anda akan banyak berjalan kaki.',
      'Pertimbangkan menggunakan tiket Fast Track jika berkunjung pada akhir pekan agar tidak mengantre lama.'
    ]
  },
  {
    id: '8',
    name: 'Jalan Malioboro & Pasar Beringharjo',
    province: 'DI Yogyakarta',
    city: 'Yogyakarta',
    category: 'Kuliner',
    description: 'Poros kultural dan jantung kota Yogyakarta yang menyajikan surga belanja cendramata, batik tulis tradisional, pertunjukan seni angklung jalanan yang meriah, dan kuliner khas angkringan malam. Di ujung selatan jalan, Anda bisa menjelajahi Pasar Beringharjo yang legendaris untuk berburu batik berkualitas tinggi dengan harga yang sangat bersahabat serta menikmati kuliner Pecel Senggol.',
    imageUrl: 'https://images.unsplash.com/photo-1571731956686-34372ed41b0c?auto=format&fit=crop&w=1200&q=80',
    entranceFee: 0,
    rating: 4.7,
    reviewsCount: 3890,
    featured: false,
    locationCoordinates: '-7.794025, 110.366050',
    bestTimeToVisit: 'Malam Hari (18:30 - 22:00) saat lampu jalanan syahdu menyala diringi lantunan musisi jalanan',
    recommendedTips: [
      'Nikmati sate koyor atau gudeg lesehan malam hari di sepanjang pedestrian Malioboro.',
      'Gunakan kemampuan tawar-menawar yang ramah saat membeli barang di Pasar Beringharjo.',
      'Sempatkan naik andong (kereta kuda tradisional) atau becak kayuh untuk menyusuri jalan klasik Yogyakarta.',
      'Selalu jaga barang bawaan Anda dengan baik saat berada di tengah kerumunan pengunjung.'
    ]
  }
];

// Helper to read database
function readDestinations(): Destination[] {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(DEFAULT_DESTINATIONS, null, 2), 'utf-8');
      return DEFAULT_DESTINATIONS;
    }
    const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading destinations.json database:', error);
    return DEFAULT_DESTINATIONS;
  }
}

// Helper to write database
function writeDestinations(destinations: Destination[]): boolean {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(destinations, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to destinations.json database:', error);
    return false;
  }
}

// Helper to read Articles database
function readArticles(): Article[] {
  try {
    if (!fs.existsSync(ARTICLES_FILE_PATH)) {
      fs.writeFileSync(ARTICLES_FILE_PATH, JSON.stringify(DEFAULT_ARTICLES, null, 2), 'utf-8');
      return DEFAULT_ARTICLES;
    }
    const data = fs.readFileSync(ARTICLES_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading articles.json database:', error);
    return DEFAULT_ARTICLES;
  }
}

// Helper to write Articles database
function writeArticles(articles: Article[]): boolean {
  try {
    fs.writeFileSync(ARTICLES_FILE_PATH, JSON.stringify(articles, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to articles.json database:', error);
    return false;
  }
}

// Helper to read Logs database
function readLogs(): ActivityLog[] {
  try {
    if (!fs.existsSync(LOGS_FILE_PATH)) {
      fs.writeFileSync(LOGS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const data = fs.readFileSync(LOGS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading logs.json database:', error);
    return [];
  }
}

// Helper to write a new Activity Log
function writeLog(action: string, details: string) {
  try {
    const logs = readLogs();
    const newLog: ActivityLog = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      action,
      details,
      timestamp: new Date().toISOString(),
      username: 'admin'
    };
    logs.unshift(newLog);
    if (logs.length > 50) {
      logs.splice(50); // Keep last 50 logs
    }
    fs.writeFileSync(LOGS_FILE_PATH, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing activity log:', error);
  }
}

// Ensure database files are initialized at boot
readDestinations();
readArticles();
readLogs();

// ================= MIDDLEWARE AUTHENTICATION =================
// Custom administrative authorization middleware requested by user.
// It verifies if the admin token is present in signed/unsigned cookies.
// If valid, it allows proceeding; if not, it returns 401 Unauthorized.
function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.admin_token;
  if (token === ADMIN_TOKEN_VALUE) {
    next();
  } else {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Akses ditolak. Anda harus login sebagai Admin untuk mengakses menu ini.'
    });
  }
}

// ================= API ENDPOINTS =================

// Public Endpoints
app.get('/api/destinations', (req: Request, res: Response) => {
  const destinations = readDestinations();
  res.json(destinations);
});

// Admin Verification Endpoint
app.get('/api/admin/verify', (req: Request, res: Response) => {
  const token = req.cookies?.admin_token;
  if (token === ADMIN_TOKEN_VALUE) {
    res.json({ loggedIn: true, username: ADMIN_USERNAME });
  } else {
    res.json({ loggedIn: false });
  }
});

// Admin Login Endpoint
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set a secure, HTTP-only cookie containing the token
    res.cookie('admin_token', ADMIN_TOKEN_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    writeLog('Login Admin', 'Admin berhasil masuk ke dashboard JavaSpot.');
    res.json({ success: true, loggedIn: true, username: ADMIN_USERNAME });
  } else {
    writeLog('Gagal Login', `Percobaan login gagal dengan username: ${username}`);
    res.status(400).json({ success: false, error: 'Kredensial salah', message: 'Username atau Password admin tidak sesuai.' });
  }
});

// Admin Logout Endpoint
app.post('/api/admin/logout', (req: Request, res: Response) => {
  writeLog('Logout Admin', 'Admin keluar dari sesi dashboard.');
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ success: true, loggedIn: false });
});

// Admin-Protected REST operations

// Create Destination
app.post('/api/destinations', adminAuthMiddleware, (req: Request, res: Response) => {
  try {
    const destinations = readDestinations();
    const newDest: Destination = {
      ...req.body,
      id: Date.now().toString(),
      rating: parseFloat(req.body.rating) || 5.0,
      reviewsCount: parseInt(req.body.reviewsCount) || 0,
      entranceFee: parseInt(req.body.entranceFee) || 0,
      recommendedTips: Array.isArray(req.body.recommendedTips) ? req.body.recommendedTips.filter((t: string) => t.trim() !== '') : []
    };

    destinations.unshift(newDest); // Add to the top
    const saved = writeDestinations(destinations);
    if (saved) {
      writeLog('Tambah Destinasi', `Berhasil menambahkan destinasi wisata baru: ${newDest.name}`);
      res.status(201).json({ success: true, destination: newDest });
    } else {
      res.status(500).json({ error: 'DatabaseError', message: 'Gagal menulis ke database.' });
    }
  } catch (err: any) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
});

// Update Destination
app.put('/api/destinations/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const destinations = readDestinations();
    const index = destinations.findIndex(d => d.id === id);

    if (index === -1) {
       res.status(404).json({ error: 'NotFound', message: 'Destinasi tidak ditemukan.' });
       return;
    }

    const currentDest = destinations[index];
    const updatedDest: Destination = {
      ...currentDest,
      ...req.body,
      id: currentDest.id, // ID must remain invariant
      rating: parseFloat(req.body.rating) || currentDest.rating,
      reviewsCount: parseInt(req.body.reviewsCount) || currentDest.reviewsCount,
      entranceFee: parseInt(req.body.entranceFee) !== undefined ? parseInt(req.body.entranceFee) : currentDest.entranceFee,
      recommendedTips: Array.isArray(req.body.recommendedTips) ? req.body.recommendedTips.filter((t: string) => t.trim() !== '') : currentDest.recommendedTips
    };

    destinations[index] = updatedDest;
    const saved = writeDestinations(destinations);
    if (saved) {
      writeLog('Edit Destinasi', `Berhasil mengubah destinasi wisata: ${updatedDest.name}`);
      res.json({ success: true, destination: updatedDest });
    } else {
      res.status(500).json({ error: 'DatabaseError', message: 'Gagal menulis ke database.' });
    }
  } catch (err: any) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
});

// Delete Destination
app.delete('/api/destinations/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const destinations = readDestinations();
  const index = destinations.findIndex(d => d.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'NotFound', message: 'Destinasi tidak ditemukan.' });
    return;
  }

  const deletedName = destinations[index].name;
  destinations.splice(index, 1);
  const saved = writeDestinations(destinations);
  if (saved) {
    writeLog('Hapus Destinasi', `Berhasil menghapus destinasi wisata: ${deletedName}`);
    res.json({ success: true, message: 'Destinasi berhasil dihapus.' });
  } else {
    res.status(500).json({ error: 'DatabaseError', message: 'Gagal menulis ke database.' });
  }
});

// Reset Destinations to Defaults (Utility Endpoint for Admin ease-of-use)
app.post('/api/admin/reset-data', adminAuthMiddleware, (req: Request, res: Response) => {
  const saved = writeDestinations(DEFAULT_DESTINATIONS);
  if (saved) {
    writeLog('Reset Database', 'Mengembalikan database destinasi ke pengaturan bawaan.');
    res.json({ success: true, message: 'Database destinasi berhasil direset ke pengaturan bawaan.' });
  } else {
    res.status(500).json({ error: 'DatabaseError', message: 'Gagal mereset database.' });
  }
});

// ================= ARTICLES ENDPOINTS =================

// Public: Get all articles
app.get('/api/articles', (req: Request, res: Response) => {
  const articles = readArticles();
  res.json(articles);
});

// Admin-Protected REST operations for Articles

// Create Article
app.post('/api/articles', adminAuthMiddleware, (req: Request, res: Response) => {
  try {
    const articles = readArticles();
    const newArt: Article = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      readTime: req.body.readTime || '5 Menit Baca',
      tags: Array.isArray(req.body.tags) ? req.body.tags.filter((t: string) => t.trim() !== '') : []
    };

    articles.unshift(newArt);
    const saved = writeArticles(articles);
    if (saved) {
      writeLog('Tambah Artikel', `Berhasil menulis artikel baru: ${newArt.title}`);
      res.status(201).json({ success: true, article: newArt });
    } else {
      res.status(500).json({ error: 'DatabaseError', message: 'Gagal menulis artikel ke database.' });
    }
  } catch (err: any) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
});

// Update Article
app.put('/api/articles/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const articles = readArticles();
    const index = articles.findIndex(a => a.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'NotFound', message: 'Artikel tidak ditemukan.' });
      return;
    }

    const currentArt = articles[index];
    const updatedArt: Article = {
      ...currentArt,
      ...req.body,
      id: currentArt.id, // Invariant
      tags: Array.isArray(req.body.tags) ? req.body.tags.filter((t: string) => t.trim() !== '') : currentArt.tags
    };

    articles[index] = updatedArt;
    const saved = writeArticles(articles);
    if (saved) {
      writeLog('Edit Artikel', `Berhasil mengubah artikel: ${updatedArt.title}`);
      res.json({ success: true, article: updatedArt });
    } else {
      res.status(500).json({ error: 'DatabaseError', message: 'Gagal menulis artikel ke database.' });
    }
  } catch (err: any) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
});

// Delete Article
app.delete('/api/articles/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const articles = readArticles();
  const index = articles.findIndex(a => a.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'NotFound', message: 'Artikel tidak ditemukan.' });
    return;
  }

  const deletedTitle = articles[index].title;
  articles.splice(index, 1);
  const saved = writeArticles(articles);
  if (saved) {
    writeLog('Hapus Artikel', `Berhasil menghapus artikel: ${deletedTitle}`);
    res.json({ success: true, message: 'Artikel berhasil dihapus.' });
  } else {
    res.status(500).json({ error: 'DatabaseError', message: 'Gagal menghapus artikel dari database.' });
  }
});

// ================= ACTIVITY LOGS ENDPOINTS =================

// Admin-Protected: Get activity logs
app.get('/api/admin/logs', adminAuthMiddleware, (req: Request, res: Response) => {
  const logs = readLogs();
  res.json(logs);
});

// ================= VITE ASSET SERVER MIDDLEWARE =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JavaSpot FullStack] Server listening at http://localhost:${PORT}`);
  });
}

startServer();
