import { Destination, CategoryType } from './types';

export const STATIC_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Candi Borobudur',
    description: 'Candi Buddha terbesar di dunia peninggalan wangsa Syailendra.',
    category: 'Sejarah & Budaya',
    province: 'Jawa Tengah',
    city: 'Magelang',
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 12500,
    featured: true,
    entranceFee: 50000,
    locationCoordinates: '-7.6078, 110.2038',
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'Pagi hari (06:00)',
    recommendedTips: ['Gunakan pakaian sopan', 'Bawa payung atau topi'],
  },
  {
    id: '2',
    name: 'Candi Prambanan',
    description: 'Kompleks candi Hindu terbesar di Indonesia.',
    category: 'Sejarah & Budaya',
    province: 'DI Yogyakarta',
    city: 'Sleman',
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 10200,
    featured: true,
    entranceFee: 50000,
    locationCoordinates: '-7.7520, 110.4914',
    bestTimeToVisit: 'Sore hari (16:00)',
    recommendedTips: ['Datang saat sunset'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '3',
    name: 'Kota Lama Semarang',
    description: 'Kawasan bersejarah dengan bangunan peninggalan kolonial Belanda.',
    category: 'Sejarah & Budaya',
    province: 'Jawa Tengah',
    city: 'Semarang',
    imageUrl: 'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 8400,
    featured: true,
    entranceFee: 0,
    locationCoordinates: '-6.9691, 110.4284',
    bestTimeToVisit: 'Sore atau malam hari',
    recommendedTips: ['Sewa sepeda ontel'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '4',
    name: 'Baturaden',
    description: 'Wisata alam pegunungan yang asri dengan air terjun.',
    category: 'Alam',
    province: 'Jawa Tengah',
    city: 'Banyumas',
    imageUrl: 'https://images.unsplash.com/photo-1629851610471-ab7fbfebbd4d?auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewsCount: 5200,
    featured: false,
    entranceFee: 25000,
    locationCoordinates: '-7.3117, 109.2275',
    bestTimeToVisit: 'Pagi atau siang hari',
    recommendedTips: ['Bawa jaket'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '5',
    name: 'Dataran Tinggi Dieng',
    description: 'Kawasan pegunungan dengan telaga warna dan kawah.',
    category: 'Alam',
    province: 'Jawa Tengah',
    city: 'Banjarnegara',
    imageUrl: 'https://images.unsplash.com/photo-1611039860431-7e3f2250c6fb?auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 9100,
    featured: true,
    entranceFee: 20000,
    locationCoordinates: '-7.2023, 109.9168',
    bestTimeToVisit: 'Pagi hari (05:00)',
    recommendedTips: ['Bawa baju hangat tebal'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '6',
    name: 'Gunung Bromo',
    description: 'Gunung berapi aktif dengan pemandangan kawah dan lautan pasir yang menakjubkan.',
    category: 'Alam',
    province: 'Jawa Timur',
    city: 'Probolinggo',
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 20000,
    featured: true,
    entranceFee: 35000,
    locationCoordinates: '-7.9425, 112.9530',
    bestTimeToVisit: 'Subuh (04:00)',
    recommendedTips: ['Sewa jeep', 'Bawa jaket dan masker'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '7',
    name: 'Kawah Putih',
    description: 'Danau kawah vulkanik yang berwarna putih kehijauan.',
    category: 'Alam',
    province: 'Jawa Barat',
    city: 'Bandung',
    imageUrl: 'https://images.unsplash.com/photo-1629851610471-ab7fbfebbd4d?auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 11000,
    featured: false,
    entranceFee: 30000,
    locationCoordinates: '-7.1663, 107.4021',
    bestTimeToVisit: 'Pagi hari',
    recommendedTips: ['Bawa masker', 'Gunakan baju tebal'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '8',
    name: 'Keraton Yogyakarta',
    description: 'Istana resmi Kesultanan Ngayogyakarta Hadiningrat.',
    category: 'Sejarah & Budaya',
    province: 'DI Yogyakarta',
    city: 'Yogyakarta',
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 15000,
    featured: true,
    entranceFee: 15000,
    locationCoordinates: '-7.8053, 110.3642',
    bestTimeToVisit: 'Pagi hari',
    recommendedTips: ['Patuhi aturan berpakaian'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '9',
    name: 'Taman Safari Indonesia',
    description: 'Taman hiburan dan kebun binatang konservasi.',
    category: 'Taman Rekreasi',
    province: 'Jawa Barat',
    city: 'Bogor',
    imageUrl: 'https://images.unsplash.com/photo-1611039860431-7e3f2250c6fb?auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 25000,
    featured: true,
    entranceFee: 250000,
    locationCoordinates: '-6.7214, 106.9458',
    bestTimeToVisit: 'Pagi hari',
    recommendedTips: ['Bawa wortel untuk hewan', 'Datang lebih awal'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '10',
    name: 'Pantai Parangtritis',
    description: 'Pantai populer dengan ombak besar dan pemandangan matahari terbenam.',
    category: 'Alam',
    province: 'DI Yogyakarta',
    city: 'Bantul',
    imageUrl: 'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewsCount: 18000,
    featured: false,
    entranceFee: 10000,
    locationCoordinates: '-8.0243, 110.3323',
    bestTimeToVisit: 'Sore hari menjelang sunset',
    recommendedTips: ['Tidak disarankan berenang', 'Naik ATV'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '11',
    name: 'Jalan Malioboro',
    description: 'Pusat perbelanjaan dan wisata budaya ikonik di jantung kota Yogyakarta.',
    category: 'Sejarah & Budaya',
    province: 'DI Yogyakarta',
    city: 'Yogyakarta',
    imageUrl: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 30000,
    featured: true,
    entranceFee: 0,
    locationCoordinates: '-7.7926, 110.3658',
    bestTimeToVisit: 'Sore hingga malam hari',
    recommendedTips: ['Coba kuliner malam', 'Tawar menawar saat belanja'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '12',
    name: 'Gunung Tangkuban Perahu',
    description: 'Gunung berapi dengan bentuk menyerupai perahu terbalik.',
    category: 'Alam',
    province: 'Jawa Barat',
    city: 'Bandung',
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewsCount: 14000,
    featured: false,
    entranceFee: 20000,
    locationCoordinates: '-6.7596, 107.6097',
    bestTimeToVisit: 'Pagi hari',
    recommendedTips: ['Gunakan masker belerang'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '13',
    name: 'Candi Cetho',
    description: 'Candi bercorak Hindu di lereng Gunung Lawu dengan pemandangan di atas awan.',
    category: 'Sejarah & Budaya',
    province: 'Jawa Tengah',
    city: 'Karanganyar',
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 6500,
    featured: true,
    entranceFee: 15000,
    locationCoordinates: '-7.5951, 111.1578',
    bestTimeToVisit: 'Pagi atau sore cerah',
    recommendedTips: ['Gunakan kendaraan yang sehat', 'Bawa jaket'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '14',
    name: 'Taman Mini Indonesia Indah',
    description: 'Taman hiburan bertema budaya Indonesia dengan replika anjungan daerah.',
    category: 'Taman Rekreasi',
    province: 'DKI Jakarta',
    city: 'Jakarta',
    imageUrl: 'https://images.unsplash.com/photo-1611039860431-7e3f2250c6fb?auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 22000,
    featured: false,
    entranceFee: 25000,
    locationCoordinates: '-6.3024, 106.8951',
    bestTimeToVisit: 'Pagi hari',
    recommendedTips: ['Gunakan kendaraan keliling', 'Sewa sepeda'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '15',
    name: 'Kawah Ijen',
    description: 'Kawah vulkanik terkenal dengan fenomena api biru (blue fire).',
    category: 'Alam',
    province: 'Jawa Timur',
    city: 'Banyuwangi',
    imageUrl: 'https://images.unsplash.com/photo-1629851610471-ab7fbfebbd4d?auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 16000,
    featured: true,
    entranceFee: 50000,
    locationCoordinates: '-8.0583, 114.2420',
    bestTimeToVisit: 'Tengah malam (01:00)',
    recommendedTips: ['Sewa pemandu', 'Gunakan masker gas'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '16',
    name: 'Pantai Menganti',
    description: 'Pantai pasir putih dengan tebing karang indah mirip di Selandia Baru.',
    category: 'Alam',
    province: 'Jawa Tengah',
    city: 'Kebumen',
    imageUrl: 'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 8800,
    featured: false,
    entranceFee: 15000,
    locationCoordinates: '-7.7709, 109.4124',
    bestTimeToVisit: 'Sore hari (15:00)',
    recommendedTips: ['Bawa sunblock', 'Siapkan kamera'],
    googleMapsUrl: 'https://maps.app.goo.gl/9Qd4R45j1YtD3aQv6',
    gallery: [
      'https://images.unsplash.com/photo-1583093228698-3f86e8893475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555026938-16e7b251000b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627445778844-3112beec01ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const CATEGORIES: { name: CategoryType | 'Semua', icon: any }[] = [
  { name: 'Semua', icon: null },
  { name: 'Alam', icon: null },
  { name: 'Sejarah & Budaya', icon: null },
  { name: 'Taman Rekreasi', icon: null },
  { name: 'Kuliner', icon: null }
];

export const CITIES = [
  'Semua',
  'Magelang',
  'Sleman',
  'Semarang',
  'Banyumas',
  'Banjarnegara',
  'Probolinggo',
  'Bandung',
  'Yogyakarta',
  'Bogor',
  'Bantul',
  'Karanganyar',
  'Jakarta',
  'Banyuwangi',
  'Kebumen'
];

export const NEWS_ARTICLES = [
  {
    id: '1',
    title: 'Sambut Libur Idul Fitri, Ini 7 Destinasi Wisata Populer di Jawa Barat',
    author: 'LIU BEI',
    date: '9 MEI 2026',
    description: 'Hari Raya Idul Fitri 1447 Hijriah sudah di depan mata. Seperti tahun-tahun sebelumnya, momentum idul fitri akan dijadikan ajang silaturahmi sekaligus menghabiskan waktu liburan bersama orang-orang terdekat.',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    content: 'Hari Raya Idul Fitri 1447 Hijriah sudah di depan mata. Seperti tahun-tahun sebelumnya, momentum idul fitri akan dijadikan ajang silaturahmi sekaligus menghabiskan waktu liburan bersama orang-orang terdekat.\n\nBeberapa destinasi populer di Jawa Barat siap menyambut wisatawan dari berbagai daerah. Pastikan merencanakan perjalanan Anda dari jauh-jauh hari agar liburan menjadi lebih nyaman dan menyenangkan.'
  },
  {
    id: '2',
    title: '10 Destinasi Wisata Liburan Terpopuler dan Wajib Dikunjungi di Jawa Timur 2026',
    author: 'LIU KANG',
    date: '7 MEI 2026',
    description: 'Jawa Timur kembali menjadi tujuan wisata favorit wisatawan domestik. Temukan 10 destinasi terbaik untuk liburan akhir tahun Anda.',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f419c96c?auto=format&fit=crop&w=800&q=80',
    content: 'Jawa Timur kembali menjadi tujuan wisata favorit wisatawan domestik. Dari Bromo yang megah hingga Pantai Klayar yang eksotis, semuanya menawarkan pengalaman yang tidak terlupakan.\n\nPemerintah daerah juga telah meningkatkan fasilitas umum di sekitar tempat wisata ini agar pengunjung merasa lebih aman dan nyaman.'
  },
  {
    id: '3',
    title: 'Kunjungan wisata pantai di Kabupaten Trenggalek melonjak',
    author: 'LU BU',
    date: '7 MEI 2026',
    description: 'Pantai di kawasan Trenggalek mencatat lonjakan wisatawan yang sangat signifikan pada libur panjang minggu ini.',
    image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?auto=format&fit=crop&w=800&q=80',
    content: 'Pantai di kawasan Trenggalek mencatat lonjakan wisatawan yang sangat signifikan pada libur panjang minggu ini. Hal ini terlihat dari antrean kendaraan menuju kawasan pantai sejak pagi hari.\n\nPengelola setempat mengimbau wisatawan untuk tetap menjaga kebersihan pantai dan mematuhi rambu-rambu keselamatan yang ada.'
  },
  {
    id: '4',
    title: 'Kemenpar: Pulau Jawa destinasi wisata favorit pada libur tahun baru',
    author: 'CHAO CHAO',
    date: '29 DESEMBER 2025',
    description: 'Kementerian Pariwisata mencatat bahwa Pulau Jawa masih menjadi destinasi paling diminati wisatawan saat libur panjang.',
    image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
    content: 'Kementerian Pariwisata mencatat bahwa Pulau Jawa masih menjadi destinasi paling diminati wisatawan saat libur panjang. Akses infrastruktur yang semakin baik menjadikan Pulau Jawa primadona bagi mereka yang mencari liburan alam maupun budaya.\n\nKemenpar berharap tren positif ini berlanjut pada tahun-tahun berikutnya dengan terus memperhatikan keberlanjutan lingkungan wisata.'
  }
];
