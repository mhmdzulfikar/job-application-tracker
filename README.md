src/
├── assets/          # Gambar, Logo, Icon statis
├── components/      # Komponen KECIL (Re-usable)
│   ├── ui/          # Button, Input, Modal, Badge (Atomic Design)
│   ├── Navbar.jsx
│   └── Sidebar.jsx
├── features/        # Komponen BESAR (Fitur Spesifik)
│   ├── board/       # Logic Kanban (Column, DraggableCard)
│   ├── jobs/        # Form Tambah Job, Detail Job
│   └── stats/       # Chart & Statistik
├── hooks/           # Custom Logic (useJobs, useDragDrop)
├── context/         # Global State (JobContext) - Pengganti Redux
├── services/        # Urusan Data (localStorageService.js, api.js)
├── utils/           # Fungsi Pembantu (formatRupiah, formatDate)
├── pages/           # Halaman Utama (Dashboard, Analytics, Settings)
├── App.jsx
└── main.jsx