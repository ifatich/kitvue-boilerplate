# Kitvue UI & SPRINT Single UI Guidelines

Aturan ini wajib dipatuhi oleh AI saat membuat, memodifikasi, atau merefaktor komponen dan tampilan antarmuka di dalam project ini.

---

## 1. Arsitektur Pemisahan Shell & Modul (SPRINT Single UI)
- **Layer Cangkang Reusable:**
  - `SprintModuleShell`: Menangani SPRINT navbar, breadcrumb, tombol back, flexbox sticky footer (`margin-top: auto`), dan fixed bottom actions bar dengan dynamic clearance.
  - `MobileStepperBanner`: Menampilkan progres langkah di perangkat mobile (`Langkah X dari Y`).
  - `ModuleSectionCard`: Card collapsible dengan animasi CSS Grid (`grid-template-rows: 0fr ↔ 1fr`) bebas glitch/flicker dan heading semantik WAI-ARIA.
- **Layer Modul Bisnis:**
  - View modul murni mengelola data form, alur step, validasi, dan menyuntikkan konten ke slot `#notice`, `<ModuleSectionCard>`, dan `#actions`.

---

## 2. Standar Responsif & Layout Mobile (Cardless Standard)
- **Mobile (< 768px):** Konten modul **TIDAK BOLEH** dibungkus oleh outer card atau container ber-border/padding. Setiap section adalah blok putih edge-to-edge (`width: 100%; border: none; border-radius: 0; padding: 16px;`) yang dipisahkan gap 8px menampilkan background abu-abu `#f8f8f8` (1:1 dengan Figma Waskat & Rahn).
- **Desktop (≥ 768px):** Lebar dibatasi 1152px (`width: min(calc(100% - 32px), 1152px)`), card berbingkai (border 1px, border-radius 8px, padding 24px).
- **Sticky Footer & Floating Actions:** Selalu terapkan flex column root dengan `margin-top: auto` pada footer agar footer tidak melayang di layar dengan konten pendek. Footer diberi dynamic padding-bottom clearance agar teks footer tidak tertutup fixed action bar di mobile.

---

## 3. Prioritas Komponen & Reuse
- **Cek Library Terlebih Dahulu:** Selalu periksa `src/components.ts` dan pustaka `kitvue-public` sebelum membuat komponen kustom.
- **Komponen Standar:**
  - Tombol: `GButton`
  - Input: `GInputText`, `GInputNominalStart`, `GInputNominalEnd`, `GTextArea`, `GRangeDatePicker`
  - Struktur & Stepper: `SprintModuleShell`, `MobileStepperBanner`, `ModuleSectionCard`, `GStepper`, `ModalBottomSheet`
  - Data & Feedback: `GTable`, `GTablePagination`, `GBadge`, `GAlert`, `GDropdown`, `GTeleportDropdown`
  - Navigasi: `GBreadcrumb`, `NavBack`, `SprintNavbar`

---

## 4. Token Desain & Styling
- **CSS Variables Pegadaian:** Wajib menggunakan token desain resmi `--g-kit-*` yang telah dimuat dari `kitvue-public/src/assets/scss/g-kit.scss` dan `src/assets/styles/tokens.css`.
- **Warna & Elevasi:** Gunakan `--g-kit-broccoli-50`, `--g-kit-white`, `--g-kit-black-80`, `--bb-elevation-card`, dll. Jangan gunakan hardcoded color codes jika token tersedia.
- **Tipografi:** Menggunakan font standar Pegadaian `Nunito Sans` dengan token `--g-kit-font-size-*`, `--g-kit-font-weight-normal` (600), dan `--g-kit-font-weight-bold` (800).
- **Utility Layout:** Gunakan Bootstrap 5 utilities (`d-flex`, `justify-content-*`, `align-items-*`, `gap-3`, `p-3`, dll.) untuk layout spacing.
- **Scoped CSS:** Gunakan scoped CSS hanya untuk page wrapper dan custom grid khusus. Jangan melakukan CSS override agresif terhadap komponen internal kitvue.

---

## 5. Kebijakan Ketat Ikonografi & Asset Hygiene
- **DILARANG** mengimpor atau menambahkan package icon eksternal baru (seperti `lucide-vue-next`, `@heroicons/vue`, `font-awesome`) yang tidak terdaftar di `package.json`.
- Gunakan asset icon resmi library (`kitvue-public/src/assets/icon/`) atau `@/assets/images/sprint/`.
- Jika vector kustom dari Figma, gunakan clean inline SVG (`viewBox="0 0 24 24"`, `fill="currentColor"`).
- Optimalkan ukuran gambar; jangan pernah menyematkan raster PNG resolusi raksasa di dalam file SVG icon kecil.

---

## 6. Standar Vue 3, Clean Code, & Efisiensi Penyimpanan
- Wajib menggunakan `<script setup lang="ts">`.
- Strict type checking: Dilarang menggunakan tipe `any`. Definisikan interface props (`defineProps<Props>()`) dan emits (`defineEmits<Emits>()`) secara eksplisit.
- **Hapus Tuntas Dead Code:** Jangan pernah membiarkan file boilerplate, komponen, mock data, atau layout yang tidak terpakai mengendap di dalam repositori. Hapus segera yang tidak digunakan.
