# Frontend Implementation Rules — Vue 3 & Design System

Dokumen ini adalah aturan kerja standar saat mengubah desain Figma menjadi implementasi Vue 3 di ekosistem web Pegadaian (termasuk SPRINT Single UI, Pinjaman Rahn, Tabungan Emas, Waskat, dan Bullion Bank CMS). Fokus utama: optimalkan Figma MCP, pisahkan layer Cangkang (Shell) dan Modul Bisnis, utamakan reusabilitas komponen library (`@pegadaian/kitvue` / `kitvue-public`), dan tegakkan penggunaan design token `--g-kit-*` serta Bootstrap 5.3.2 utilities.

---

## 1. Prinsip Arsitektur SPRINT Single UI (Shell vs Modul)

Untuk memastikan kode tidak bloated, mudah dipelihara, dan memiliki UX yang mulus, struktur layar dipecah secara ketat:

### A. Layer Cangkang Reusable (`SprintModuleShell.vue`)
- **Tanggung Jawab:** Mengelola seluruh layout pembungkus halaman (agnostik terhadap modul bisnis):
  1. **SPRINT Navbar:** Header hijau dengan pattern SPRINT, back button di mobile, icon info, dan profil peran.
  2. **Breadcrumb & NavBack:** Navigasi hirarki desktop.
  3. **Canvas Responsif:** Lebar desktop dibatasi maksimal 1152px (`width: min(calc(100% - 32px), 1152px)`), sedangkan mobile dibuat full-bleed edge-to-edge (`width: 100%; padding: 0;`).
  4. **Flexbox Sticky Footer:** Menggunakan flexbox layout (`display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh;`) dengan `margin-top: auto;` pada elemen `<footer>`. Menjamin footer selalu menempel di dasar layar dan tidak pernah melayang di tengah layar (*floating footer*), bahkan jika konten form sangat pendek.
  5. **Fixed Bottom Action Sheet (`#actions`):** Bar aksi melayang di bagian bawah dengan drop shadow dan sudut melengkung di mobile (`border-radius: 12px 12px 0 0;`). Footer secara otomatis diberi dynamic padding-bottom clearance (88px untuk 1 tombol, 136px untuk 2 tombol bertumpuk pada mobile via selector `:has()`) agar teks footer selalu terbaca penuh.
  6. **Slots Standar:** `#mobile-stepper`, `#notice`, `#default`, `#actions`.

### B. Indikator Langkah Mobile (`MobileStepperBanner.vue`)
- Banner abu-abu edge-to-edge (`#f8f8f8`) di bawah navbar mobile yang menampilkan *"Langkah X dari Y"* dan *"Tahap X - [Nama Step]"*.

### C. Collapsible Card Container (`ModuleSectionCard.vue`)
- **Mobile Cardless Standard (< 768px):** Konten modul di mobile **TIDAK BOLEH** dibungkus oleh outer card atau container ber-border/padding. Setiap section adalah blok putih edge-to-edge (`width: 100%; border: none; border-radius: 0; padding: 16px;`) yang dipisahkan oleh gap/margin 8px menampilkan background abu-abu `#f8f8f8` (1:1 sesuai acuan Figma).
- **Desktop Standard (≥ 768px):** Section tampil sebagai card berbingkai (`border: 1px solid var(--g-kit-black-20); border-radius: 8px; padding: 24px; margin-bottom: 16px; background: #fff;`).
- **Animasi Collapse Bebas Glitch/Flicker:** Menggunakan CSS Grid (`grid-template-rows: 0fr ↔ 1fr`) dengan transisi `cubic-bezier(0.4, 0, 0.2, 1)` dan inner `overflow: hidden; min-height: 0;`. Menghindari abrupt height pop atau layout flicker.
- **WAI-ARIA Accessibility:** Tombol heading semantik dengan atribut `aria-expanded`, `aria-controls`, dan chevron yang berputar 180° saat terbuka/tertutup.

### D. Layer Modul Domain (`src/views/[NamaModul]View.vue`)
- Hanya mengelola logika domain murni:
  - State form reaktif (`fields`, validasi).
  - Alur stepper (`activeStep`, `canContinue`, `nextStep`, `prevStep`).
  - Injeksi konten ke slot shell (`#notice`, grid form di `<ModuleSectionCard>`, dan tombol aksi di `#actions`).

---

## 2. Alur Inspeksi Figma MCP (Variable-First)

Untuk setiap screen, modal, bottomsheet, atau komponen dari Figma:

1. **Dapatkan Context & Screenshot**:
   - Ambil konteks struktur node dari Figma MCP.
   - Ambil visual screenshot sebagai referensi tata letak visual absolut.
2. **Ekstraksi `boundVariables` (Figma Variables)**:
   - Periksa properti `boundVariables` pada node (fills, strokes, textStyle).
   - Dapatkan nama variabel dari koleksi desain (misal: `color/lime/50`, `black/80`, `font-size/omicron`).
3. **Resolusi Deterministik ke Token `--g-kit-*`**:
   - Ubah nama variabel Figma langsung ke token CSS resmi:
     - `lime/50` atau `lime-50` ➔ `var(--g-kit-lime-50, #00ab4e)`
     - `black/80` ➔ `var(--g-kit-black-80, #252528)`
     - `omicron` ➔ font size `var(--g-kit-font-size-omicron, 16px)` & line height `var(--g-kit-line-height-omicron, 24px)`
4. **Spacing & Layout Resolution (Bootstrap 5 Utilities)**:
   - Gunakan utility classes Bootstrap 5 pada template HTML:
     - Spacing 4px ➔ `p-1` / `m-1` / `gap-1`
     - Spacing 8px ➔ `p-2` / `m-2` / `gap-2`
     - Spacing 16px ➔ `p-3` / `m-3` / `gap-3`
     - Spacing 24px ➔ `p-4` / `m-4` / `gap-4`
     - Spacing 32px ➔ `p-5` / `m-5` / `gap-5`
   - Radius resmi:
     - Input/Form control: `border-radius: 6px;` (sesuai `$input-border-radius`)
     - Card / Container / Modal Desktop: `border-radius: 8px;`
     - Sheet Bottom Action Mobile: `border-radius: 12px 12px 0 0;`

---

## 3. Kebijakan Iconography & Asset Hygiene

1. **Prioritas 1: Asset Icon Resmi Library**:
   - Cek apakah icon tersedia di direktori asset library:
     - System Icons: `kitvue-public/src/assets/icon/icon-system/`
     - Product Icons: `kitvue-public/src/assets/icon/icon-product/`
     - SPRINT Navbar Icons: `@/assets/images/sprint/`
2. **Prioritas 2: Clean Inline SVG Component**:
   - Jika icon di Figma merupakan vector kustom, ekspor node vector sebagai **clean inline SVG** dengan `fill="currentColor"`.
3. **Larangan Keras (Strict Ban)**:
   - **Dilarang keras** mengasumsikan atau meng-install package icon eksternal (seperti `lucide-vue-next`, `@heroicons/vue`, `@tabler/icons-vue`, atau `font-awesome`).
4. **Efisiensi Penyimpanan Aset**:
   - **Dilarang keras** menyematkan raster PNG beresolusi raksasa (misal 2000x4000px base64) di dalam file SVG untuk icon berukuran kecil (80x80px).
   - Selalu kompres atau resize gambar raster sebelum dibungkus SVG agar bobot file hemat (>90% kompresi).

## 3.5 Pola Card Grouping & Alert Feedback
1. **Grouping Section Card (`.form-card`)**:
   - Pada desktop: Sections form dalam 1 tahap (misal `Informasi Rahn` & `Beneficial Owner`) **harus dibungkus dalam 1 container `.form-card`** (`border: 1px solid var(--g-kit-black-20); border-radius: 8px; background: var(--g-kit-white)`). Antar section dipisahkan dengan pembatas divider `border-top: 8px solid var(--g-kit-black-10)`. Jangan memecahnya menjadi kartu-kartu terisolasi yang mengambang.
   - Pada mobile (`< 768px`): `.form-card` bertransformasi menjadi flex column transparan dengan `gap: 8px`. Setiap `<ModuleSectionCard>` di dalamnya menjadi section putih edge-to-edge tanpa border/radius, sehingga background `#f8f8f8` muncul sebagai pemisah 8px yang bersih.
2. **GAlert Styling & Positioning**:
   - Selalu gunakan `class="... variant"` (contoh: `class="rahn-notice variant"`) saat memanggil `GAlert` dengan `color="light-blue"` dan `variant="info"`.
   - Hal ini memastikan style resmi `_alert-varian.scss` aktif dengan background `--g-kit-blue-10` dan ilustrasi `aksen-blue.svg`. Jangan menghilangkan kelas `.variant` agar tidak jatuh ke override Bootstrap solid dark blue (`--g-kit-blue-50`).
   - Pada mobile, beri margin horizontal `12px 16px` agar alert tidak menempel pada tepi layar.
3. **Spasi Footer Mobile Entry Point**:
   - Pastikan ada spasi pemisah minimal 16px–24px (menggunakan `padding-bottom: 24px` pada `.mobile-entry-view` atau `margin-top: 16px` pada `footer`) agar footer tidak menempel langsung pada batas bawah card modul terakhir ("Laporan").

---

## 4. Pemetaan Variabel Figma ke Token `--g-kit-*`

| Figma Variable / Value | CSS Token Resmi | Kategori |
| :--- | :--- | :--- |
| `color/lime/50` / `#00ab4e` | `var(--g-kit-lime-50)` | Primary / Success Brand |
| `color/lime/60` / `#00883e` | `var(--g-kit-lime-60)` | Primary Hover |
| `color/lime/80` / `#00662e` | `var(--g-kit-lime-80)` | Primary Active / Pressed |
| `color/black/80` / `#252528` | `var(--g-kit-black-80)` | Text Primary |
| `color/black/60` / `#58585b` | `var(--g-kit-black-60)` | Text Secondary |
| `color/black/50` / `#939597` | `var(--g-kit-black-50)` | Placeholder / Helper / Disabled Text |
| `color/black/40` / `#bbbdc0` | `var(--g-kit-black-40)` | Neutral Disabled Border / Divider |
| `color/black/20` / `#eeeeef` | `var(--g-kit-black-20)` | Structural Border |
| `color/black/10` / `#f8f8f8` | `var(--g-kit-black-10)` | Light Neutral Surface |
| `color/white` / `#ffffff` | `var(--g-kit-white)` | Pure White Surface / Text on Dark |
| `color/red/50` / `#ae1e22` | `var(--g-kit-red-50)` | Danger / Error State |
| `color/orange/50` / `#e07e26` | `var(--g-kit-orange-50)` | Warning / Pending State |
| `color/blue/50` / `#1868ab` | `var(--g-kit-blue-50)` | Information State |
| `color/gold/50` / `#d8b56d` | `var(--g-kit-gold-50)` | Gold / Bullion Accent |
| `font-size/omicron` (16px) | `var(--g-kit-font-size-omicron)` | Body / Form Input Text |
| `line-height/omicron` (24px) | `var(--g-kit-line-height-omicron)` | Line height Body |
| `font-size/sigma` (14px) | `var(--g-kit-font-size-sigma)` | Table / Caption Text |
| `line-height/sigma` (20px) | `var(--g-kit-line-height-sigma)` | Line height Caption |
| `font-size/omega` (12px) | `var(--g-kit-font-size-omega)` | Helper / Metadata Text |
| `line-height/omega` (18px) | `var(--g-kit-line-height-omega)` | Line height Helper |
| `font-weight/normal` (600) | `var(--g-kit-font-weight-normal)` | Regular / Normal Weight |
| `font-weight/bold` (800) | `var(--g-kit-font-weight-bold)` | Bold Weight |

> [!WARNING]
> Token font-weight resmi di pustaka `kitvue` hanya `normal` (`600`) dan `bold` (`800`). Jangan pernah menggunakan `--g-kit-font-weight-semibold` atau `--g-kit-font-weight-extrabold`.

---

## 5. Komponen First Rule & Mapping Standar

| Kebutuhan Antarmuka | Komponen Pilihan Utama |
| :--- | :--- |
| **Shell Halaman SPRINT** | `SprintModuleShell` (`@/components/shared/admin-layout/SprintModuleShell.vue`) |
| **Header SPRINT** | `SprintNavbar` (`@/components/shared/admin-layout/SprintNavbar.vue`) |
| **Mobile Stepper Header** | `MobileStepperBanner` (`@/components/shared/stepper/MobileStepperBanner.vue`) |
| **Collapsible Section Card** | `ModuleSectionCard` (`@/components/shared/card/ModuleSectionCard.vue`) |
| **Button / Aksi Utama** | `GButton` (`Button/Button.vue`) |
| **Input Text** | `GInputText` (`Input/InputText.vue`) |
| **Input Nominal (Mulai Rp)** | `GInputNominalStart` (`Input/InputNominalStart.vue`) |
| **Input Nominal (Akhir Rp)** | `GInputNominalEnd` (`Input/InputNominalEnd.vue`) |
| **Dropdown / Select** | `GDropdown` (`Dropdown/InputDropdown.vue`) / `GTeleportDropdown` |
| **Alert / Feedback Box** | `GAlert` (`Alert/AlertVarian.vue`) |
| **Badge / Tag Status** | `GBadge` (`Badge/Badge.vue`) |
| **Breadcrumb** | `GBreadcrumb` (`Breadcrumb/Breadcrumb.vue`) |
| **Navigasi Back** | `GNavBackNavigator` / `NavBack` (`@/components/shared/navBack/navBack.vue`) |
| **Modal / Bottomsheet Hybrid**| `ModalBottomSheet` (`@/components/shared/modal/ModalBottomSheet.vue`) |
| **Stepper Desktop** | `GStepper` (`Stepper/Stepper.vue`) |

---

## 6. Clean Code & Kebijakan Hapus Dead Code

- **Hapus tuntas kode mati:** Jika suatu komponen, helper, utilitas, atau mock data tidak digunakan oleh routing atau komponen aktif, **langsung hapus**. Jangan meninggalkan placeholder mati atau file terlantar di dalam repositori.
- **Strict TypeScript:** Hindari `any`. Selalu berikan type definition lengkap pada form fields, props, dan emits.

---

## 7. Definition of Done (DoD)

Implementasi dianggap tuntas hanya jika:

- [ ] Figma variable definitions dan visual screenshot telah diverifikasi.
- [ ] Layar mengadopsi arsitektur terpisah: `SprintModuleShell` (layer shell) dan `[Module]View` (layer bisnis).
- [ ] Section card collapsible menggunakan `ModuleSectionCard` dengan animasi CSS grid bebas flicker.
- [ ] Layout mobile mematuhi standar cardless: blok putih edge-to-edge dengan gap 8px pada background `#f8f8f8`.
- [ ] Flexbox sticky footer (`margin-top: auto`) mencegah footer melayang di tengah layar.
- [ ] Action bar sticky di mobile memiliki clearance dynamic padding pada footer.
- [ ] Seluruh nilai styling warna & tipografi dipetakan ke token `--g-kit-*` (tidak ada arbitrary hex).
- [ ] Spacing dan layout memanfaatkan utility Bootstrap 5 (`p-*`, `m-*`, `gap-*`, `d-flex`) atau piksel SCSS presisi.
- [ ] Komponen library `@pegadaian/kitvue` / `kitvue-public` digunakan sebagai prioritas utama.
- [ ] Iconography mematuhi aturan asset resmi library atau clean inline SVG (tanpa package luar).
- [ ] Pengecekan tipe TypeScript (`vue-tsc --noEmit`), pengujian (`vitest run`), dan build project berhasil tanpa error.
