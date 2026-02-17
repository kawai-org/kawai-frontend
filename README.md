# Kawai-chan Frontend

Dashboard web untuk Kawai-chan - Personal Assistant WhatsApp Bot yang membantu mengelola catatan, link, dan pengingat.

## 📋 Deskripsi

Kawai-chan Frontend adalah aplikasi web dashboard yang bekerja sebagai pendamping dari bot WhatsApp Kawai-chan. Aplikasi ini memungkinkan user untuk:
- Melihat dan mengelola catatan yang dibuat via WhatsApp
- Mengelola link yang telah disimpan
- Mengatur pengingat/reminder
- Melihat kalender dengan event
- Melihat statistik aktivitas

## 🚀 Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 6.0
- **Styling:** Tailwind CSS 3.4
- **UI Components:** shadcn/ui + Radix UI
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Package Manager:** Bun

## 📦 Prerequisites

Pastikan sudah menginstall:
- [Bun](https://bun.sh/) (versi terbaru)
- Node.js (v18+ direkomendasikan)
- Git

### Install Bun

```bash
# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

## 🛠️ Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd kawai-frontend
   ```

2. **Install dependencies dengan Bun**
   ```bash
   bun install
   ```

3. **Setup Environment Variables**
   
   Buat file `.env` di root project:
   ```env
   VITE_API_URL=http://localhost:8080
   VITE_BOT_NUMBER=YOUR_BOT_NUMBER
   ```
   
   Sesuaikan nilai:
   - `VITE_API_URL`: URL backend API (contoh: `http://localhost:8080` untuk development lokal)
   - `VITE_BOT_NUMBER`: Nomor WhatsApp bot (format: 628xxxxxxxxxx)

## 🎯 Penggunaan

### Development Server

Jalankan development server dengan hot reload:

```bash
bun run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Build untuk Production

```bash
bun run build
```

Hasil build akan ada di folder `dist/`

### Preview Production Build

```bash
bun run preview
```

### Linting

```bash
bun run lint
```

## 🔐 Alur Autentikasi

1. **Registrasi via WhatsApp**
   - Chat bot Kawai-chan dengan nomor yang telah dikonfigurasi
   - Kirim command: `Dashboard`
   - Bot akan mengirimkan Magic Link

2. **Login via Magic Link**
   - Klik link yang dikirim bot
   - Sistem akan otomatis login dengan JWT token
   - Token disimpan di localStorage

3. **Akses Dashboard**
   - Setelah login, user akan diarahkan ke `/dashboard-user`
   - Sidebar tersedia untuk navigasi antar fitur

## 📱 Fitur Utama

### 1. Dashboard (`/dashboard-user`)
- Ringkasan statistik (Notes, Links, Reminders)
- Grafik aktivitas mingguan
- Catatan terbaru

### 2. Notes (`/notes`)
- Melihat semua catatan
- Detail catatan dengan tags
- Hapus catatan
- Pencarian catatan

### 3. Links (`/links`)
- Daftar link yang tersimpan
- Copy link ke clipboard
- Hapus link

### 4. Reminders (`/reminders`)
- Daftar pengingat
- Status: Pending / Executed
- Edit dan hapus reminder

### 5. Calendar (`/calendar`)
- Kalender interaktif
- Melihat event per tanggal
- Tampilan event di sidebar

### 6. FAQ (`/faq`)
- Pertanyaan umum
- Form feedback
- Kontak WhatsApp

## 🤖 Command WhatsApp Bot

| Command | Fungsi |
|---------|--------|
| `Catat [isi]` | Simpan catatan baru |
| `Simpan Link [URL]` | Simpan link |
| `Ingatkan [tugas] [waktu]` | Buat pengingat |
| `List` | Lihat daftar data |
| `Dashboard` | Dapatkan link login |

## 📁 Struktur Project

```
kawai-frontend/
├── src/
│   ├── api/              # API layer (Axios clients)
│   ├── components/       # React components
│   │   ├── common/       # Shared components
│   │   └── ui/           # shadcn/ui components
│   ├── context/          # React Context (AuthProvider)
│   ├── features/         # Feature-based modules
│   │   ├── auth/         # Authentication
│   │   ├── dashboard/    # Dashboard page
│   │   ├── notes/        # Notes page
│   │   ├── links/        # Links page
│   │   ├── reminders/    # Reminders page
│   │   ├── calendar/     # Calendar page
│   │   └── faq/          # FAQ page
│   ├── hooks/            # Custom React hooks
│   ├── layout/           # Layout components
│   ├── lib/              # Utility functions
│   ├── assets/           # Static assets
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables
├── package.json
└── README.md
```

## 🔧 Development Tips

### Menambah Komponen shadcn/ui

```bash
# Jika menggunakan shadcn CLI
npx shadcn add [component-name]
```

### Custom Tailwind Config

Edit `tailwind.config.js` untuk menyesuaikan tema:
- Colors
- Border radius
- Shadows
- Animations

### API Endpoints

Semua request otomatis menyertakan Bearer token dari localStorage melalui Axios interceptor.

Endpoint yang tersedia (sesuaikan dengan backend Anda):
- `GET /api/dashboard/notes` - Mendapatkan daftar catatan
- `GET /api/dashboard/reminders` - Mendapatkan daftar pengingat
- `PUT /api/notes/:id` - Update catatan
- `DELETE /api/notes/:id` - Hapus catatan
- `PUT /api/reminders/:id` - Update pengingat
- `DELETE /api/reminders/:id` - Hapus pengingat

## 🌐 Deployment

### Build Manual

```bash
bun run build
```

Upload folder `dist/` ke hosting static (Vercel, Netlify, dll).

### Deploy ke Vercel

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel
```

## 🐛 Troubleshooting

### Masalah Umum

1. **Port sudah digunakan**
   ```bash
   bun run dev -- --port 3000
   ```

2. **Module tidak ditemukan**
   ```bash
   bun install
   ```

3. **Env variables tidak terbaca**
   - Pastikan file `.env` ada di root
   - Restart development server

4. **CORS Error**
   - Pastikan backend URL di `.env` sudah benar
   - Periksa konfigurasi CORS di backend

5. **Tidak bisa login**
   - Pastikan backend berjalan
   - Periksa URL backend di `.env`
   - Pastikan bot WhatsApp sudah dikonfigurasi dengan benar

## 📝 Catatan Penting

- Aplikasi menggunakan **localStorage** untuk menyimpan token JWT
- Pastikan browser mengizinkan localStorage
- Token expired akan otomatis logout
- Semua data tersimpan di backend, frontend hanya menampilkan
- Backend dan bot WhatsApp perlu dikonfigurasi terpisah

## 🔗 Repository Terkait

- **Backend:** [kawai-backend](link-ke-repo-backend) - API dan WhatsApp Bot handler

## 🤝 Contributing

1. Fork repository
2. Buat branch baru (`git checkout -b feature/nama-fitur`)
3. Commit perubahan (`git commit -m 'Add: nama fitur'`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Buat Pull Request

## 📄 License

[MIT License](LICENSE)

---

Dibuat dengan ❤️ menggunakan React + Vite + Bun
