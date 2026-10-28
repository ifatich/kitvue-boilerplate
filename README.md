# Kitvue Starter Template (Vue 3 + Vite + TypeScript)

> **Standardized Frontend Boilerplate for Pegadaian & Bullion Bank Ecosystems**  
> Didesain khusus untuk pengembangan cepat di layer **Frontend (Pure Frontend Case)** dengan integrasi desain sistem `kitvue-public`, arsitektur layout korporat `AdminShell`, serta fitur **Dummy Toggle Auth** bawaan untuk kemudahan prototyping tanpa ketergantungan backend.

---

## 🛠️ Tech Stack & Konfigurasi

* **Core Framework:** [Vue 3.5](https://vuejs.org/) (`<script setup>`, Composition API)
* **Build Tool & Dev Server:** [Vite 6](https://vitejs.dev/)
* **Type System:** [TypeScript 5.7](https://www.typescriptlang.org/) (Strict Types, Zero `any`)
* **UI Design System:** [`kitvue-public`](https://www.npmjs.com/package/kitvue-public) v1.0.5 + Bootstrap 5.3 & `bootstrap-vue-next`
* **Tokens & Theming:**
  - `kitvue-public/src/assets/scss/g-kit.scss` (G-Kit Pegadaian color palettes, elevations, variables)
  - `src/assets/styles/tokens.css` (G-Kit component normalizations & WCAG 2.4.7 focus outlines)
  - Tipografi resmi `Nunito Sans`
* **State Management:** [Pinia 3](https://pinia.vuejs.org/)
* **Routing:** [Vue Router 4](https://router.vuejs.org/) dengan navigation guards
* **Testing:** [Vitest](https://vitest.dev/)

---

## ⚡ Fitur Utama Boilerplate

1. **Pure Frontend Case (Bebas Backend Runtime):**
   Tidak memerlukan API server backend lokal atau proxy eksternal. Semua navigasi guard, state simulasi, dan status autentikasi dikelola langsung di browser.
2. **Dummy Toggle Auth Switch:**
   Tersedia tombol toggle instan di Navbar publik (`[ 🔒 Logged In ]` / `[ 🔓 Guest ]`) untuk menguji perilaku halaman publik vs terproteksi secara instan tanpa perlu bolak-balik mengisi form login.
3. **AdminShell Siap Pakai:**
   Layout standar CMS korporat dengan responsive rail/drawer (80px -> 334px), top navigation bar, status indicator, profile menu bottomsheet, breadcrumb, dan kanvas konten modular.
4. **Adapter Komponen Terstandardisasi (`@/components.ts`):**
   Re-ekspor terpusat seluruh komponen `kitvue-public` dengan prefix `G*` (`GButton`, `GModal`, `GTable`, `GInputText`, `GDropdown`, dll.) untuk kemudahan impor.
5. **Skill & Rule AI Terintegrasi (`kitvue-plugin`):**
   Dilengkapi skill AI lokal di `.agents/skills/kitvue-plugin` dan workspace rule `.agents/rules/kitvue-guidelines.md` untuk mengonversi desain dari Figma MCP secara akurat menggunakan token desain `--g-kit-*` dan komponen kitvue resmi.
6. **Template Entry Point Homescreen (`/` atau `/entry`):**
   Implementasi 1:1 dari Figma Single UI (Node `232-83245`) dengan navbar SPRINT, slider metrik dinamis (EGC/OGC, OSL Gross, NPL), pintasan TJSL, kartu Tugasku terhubung rute, Menu Favorit, dan widget Monitoring.
7. **Template Base Container Data Table (`/admin`):**
   Implementasi 1:1 dari Figma Single UI (Node `1773-39151`) dengan SPRINT breadcrumbs, header aksi kembali, kotak filter 8 field responsif, tabel hijau standar Pegadaian dengan pagination, dan modal detail interaktif.

---

## 🚀 Panduan Memulai (Quickstart)

Pastikan telah menginstal [Node.js](https://nodejs.org/) (v18+) dan [pnpm](https://pnpm.io/).

```bash
# Masuk ke direktori template
cd kitvue-starter-template

# Instal dependensi
pnpm install

# Jalankan server development
pnpm dev
```

Buka peramban di: `http://localhost:5173`

---

## 📜 Perintah Kerja (Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `pnpm dev` | Menjalankan Vite dev server lokal dengan HMR instan |
| `pnpm build` | Membangun bundle produksi teroptimasi ke direktori `dist/` |
| `pnpm preview` | Menjalankan preview lokal dari bundle produksi `dist/` |
| `pnpm type-check` | Menjalankan validasi tipe TypeScript via `vue-tsc --noEmit` |
| `pnpm test` | Menjalankan unit tests menggunakan Vitest |

---

## 🏛️ Struktur Direktori

```
kitvue-starter-template/
├── .agents/
│   ├── rules/
│   │   └── kitvue-guidelines.md # Rule AI untuk penegakan standar Kitvue & token
│   └── skills/
│       └── kitvue-plugin/       # Skill konversi Figma MCP ke Vue 3 + Kitvue tokens
├── index.html                   # HTML Entrypoint & Google Fonts Nunito Sans
├── package.json                 # Metadata dependensi & skrip NPM
├── vite.config.ts               # Konfigurasi Vite & module alias (@ -> src, kitvue)
├── tsconfig.json                # Strict TypeScript configuration
├── public/                      # Aset statis publik & favicon
├── src/
│   ├── App.vue                  # Root component & dynamic public navbar host
│   ├── main.ts                  # Inisialisasi Vue, Pinia, Router, & Kitvue styles
│   ├── components.ts            # Re-ekspor terpusat G* Kitvue components
│   ├── assets/
│   │   ├── images/              # Logo resmi Pegadaian, Bullion, & background auth
│   │   └── styles/
│   │       └── tokens.css       # Token elevasi, input fix, & WCAG a11y focus outlines
│   ├── components/
│   │   └── shared/              # Komponen modular reusable
│   │       ├── AppNavbar.vue    # Navbar publik dengan Dummy Toggle Auth switch
│   │       ├── admin-layout/    # AdminShell, AdminTopNav, AdminSideNav, AdminFooter
│   │       ├── alert/           # AppAlertHost & alert management
│   │       ├── breadcrumb/      # Breadcrumb navigasi
│   │       ├── card/            # Card container
│   │       ├── dropdown/        # TeleportDropdown
│   │       ├── layouts/         # AdminPageLayout
│   │       ├── logo/            # StarterLogo vector SVG universal
│   │       ├── modals/          # BaseModal container
│   │       └── table/           # TableHeader, TableFooter, TableRowControl
│   ├── hooks/
│   │   ├── useAppAlert.ts       # Hook toast/banner alert
│   │   └── useLogin.ts          # Hook logika form login frontend & quick login
│   ├── router/
│   │   └── index.ts             # Rute (/ -> Home, /login -> Login, /admin -> Dashboard)
│   ├── services/
│   │   └── authService.ts       # Helper utilitas autentikasi frontend
│   ├── stores/
│   │   └── authStore.ts         # Pinia store reaktif status Dummy Auth
│   ├── types/
│   │   └── admin.ts             # Interface TypeScript akun & profil dinas
│   ├── utils/
│   │   ├── date.util.ts         # Helper format tanggal & waktu
│   │   └── normalizeInput.ts    # Helper sanitasi input teks & angka
│   └── views/
│       ├── HomeView.vue         # Landing page starter
│       ├── LoginView.vue        # Form login mockup frontend dengan 1-click test
│       └── AdminDashboardView.vue # Blank admin starter di dalam AdminShell
└── tests/
    ├── authStore.test.ts        # Unit test status Pinia auth & helper service
    └── normalizeInput.test.ts   # Unit test fungsi sanitasi input
```

---

## 💡 Contoh Penggunaan Komponen Kitvue

Impor komponen langsung dari `@/components`:

```vue
<script setup lang="ts">
import { GButton, GInputText, GModal } from '@/components'
import { ref } from 'vue'

const showModal = ref(false)
const keyword = ref('')
</script>

<template>
  <div class="my-module">
    <GInputText
      v-model="keyword"
      label="Cari Data"
      placeholder="Ketik kata kunci..."
    />

    <GButton
      label="Buka Modal"
      type="primary"
      size="md"
      @click="showModal = true"
    />

    <GModal v-model="showModal" title="Contoh Modal Kitvue">
      <p>Konten modal menggunakan standar desain sistem Pegadaian.</p>
    </GModal>
  </div>
</template>
```

---

## 🔒 Konvensi Proteksi Rute (Auth Guard)

Untuk menambahkan rute admin baru yang terproteksi, tambahkan `meta: { requiresAuth: true }` pada file `src/router/index.ts`:

```ts
{
  path: '/admin/master-data',
  name: 'admin-master-data',
  component: () => import('../views/MasterDataView.vue'),
  meta: { requiresAuth: true },
}
```

Ketika pengguna belum login (`authStore.isAuthenticated == false`), navigasi akan secara otomatis dialihkan ke `/login?redirect=...`.

---

## 🎨 Skill & Rule AI (`kitvue-plugin`)

Boilerplate ini telah dilengkapi skill AI lokal yang siap diaktifkan saat mengembangkan antarmuka baru:

- **Lokasi Skill:** `.agents/skills/kitvue-plugin/SKILL.md`
- **Lokasi Rule:** `.agents/rules/kitvue-guidelines.md`

### Kemampuan:
1. **Konversi Figma MCP ke Vue 3:** Membaca node Figma dan memetakan `boundVariables` langsung ke CSS variables resmi `--g-kit-*`.
2. **Katalog Komponen Kitvue Lengkap:** Menghindari pembuatan komponen kustom jika telah disediakan oleh `kitvue-public`.
3. **Template Referensi Kanonikal:** Menyertakan file referensi `examples/canonical-screen.vue` dan `references/kitvue-public-design-system.md` sebagai panduan implementasi.

