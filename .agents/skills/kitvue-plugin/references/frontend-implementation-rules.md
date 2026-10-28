# Frontend Implementation Rules — Vue 3 & Design System

Dokumen ini adalah aturan kerja standar saat mengubah desain Figma menjadi implementasi Vue 3 di ekosistem web Pegadaian (termasuk Bullion Bank CMS dan portal internal lainnya). Fokus utama: optimalkan Figma MCP, utamakan reusabilitas komponen library (`@pegadaian/kitvue` / `kitvue-public`), dan tegakkan penggunaan design token `--g-kit-*` serta Bootstrap 5.3.2 utilities.

---

## 1. Prinsip Utama

1. **Figma MCP sebagai Sumber Desain**: Layout, hierarki visual, spacing, dan typography bersumber dari Figma.
2. **Variable-First Architecture**: Seluruh nilai visual warna dan tipografi di Figma dipetakan secara deterministik ke CSS variables `--g-kit-*`.
3. **Fondasi Bootstrap 5.3.2**: Library `@pegadaian/kitvue` dibangun di atas Bootstrap 5.3.2 (`$prefix: "g-bs-"`). Gunakan utility classes Bootstrap 5 untuk spacing (`p-*`, `m-*`, `gap-*`), alignment (`d-flex`, `justify-content-*`), dan grid layout.
4. **Tidak Ada Token Spacing/Radius CSS Variable**: CSS variable `:root` di library **hanya** mendefinisikan warna (`--g-kit-{palette}-{shade}`) dan tipografi (`--g-kit-font-*`). **Dilarang keras** mengarang token fiktif seperti `var(--g-kit-space-*)` atau `var(--g-kit-radius-*)`.
5. **Pustaka Komponen Library**: Cek komponen yang tersedia di `@pegadaian/kitvue` atau `kitvue-public` sebelum membuat komponen kustom.
6. **Scoped CSS untuk Custom Layout**: Gunakan Scoped CSS semata-mata untuk styling kontainer spesifik atau gap yang tidak ter-cover Bootstrap, bukan untuk meng-override paksa internal style komponen library.
7. **Domain-Specific Rules**: Jika sedang mengerjakan modul khusus perbankan/emas, rujuk dokumen tambahan [domain-bullion-bank.md](domain-bullion-bank.md).

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
     - `lime/50` atau `lime-50` ➔ `var(--g-kit-lime-50)`
     - `black/80` ➔ `var(--g-kit-black-80)`
     - `omicron` ➔ font size `var(--g-kit-font-size-omicron)` & line height `var(--g-kit-line-height-omicron)`
4. **Spacing & Layout Resolution (Bootstrap 5 Utilities)**:
   - Gunakan utility classes Bootstrap 5 pada template HTML:
     - Spacing 4px ➔ `p-1` / `m-1` / `gap-1`
     - Spacing 8px ➔ `p-2` / `m-2` / `gap-2`
     - Spacing 16px ➔ `p-3` / `m-3` / `gap-3`
     - Spacing 24px ➔ `p-4` / `m-4` / `gap-4`
     - Spacing 32px ➔ `p-5` / `m-5` / `gap-5`
   - Jika membutuhkan spacing kustom pada scoped CSS, tuliskan nilai piksel langsung mengacu pada baseline:
     ```css
     .custom-card-container {
       padding: 24px;
       border-radius: 8px; /* Standard card radius */
     }
     ```
   - Radius resmi:
     - Input/Form control: `border-radius: 6px;` (sesuai `$input-border-radius`)
     - Card / Container / Modal: `border-radius: 8px;`

---

## 3. Kebijakan Iconography & SVGs Resmi Pegadaian

Pustaka `@pegadaian/kitvue` memiliki ratusan asset icon SVG resmi di `src/assets/icon/`. Ikuti hierarki berikut:

1. **Prioritas 1: Asset Icon Resmi Library**:
   - Cek apakah icon tersedia di direktori asset library:
     - System Icons: `@pegadaian/kitvue/src/assets/icon/icon-system/` (contoh: `icon-arrow-up.svg`, `icon-calendar.svg`, `icon-profile-fill.svg`, `icon-transaction.svg`, `icon-search.svg`).
     - Product Icons: `@pegadaian/kitvue/src/assets/icon/icon-product/` (contoh: `icon-submenu_gadai-gadai.svg`, `icon-submenu_cicil_emas-*.svg`, `icon-submenu_pembiayaan-haji.svg`).
   - Gunakan komponen `LabelIcon.vue` jika menampilkan teks dengan ikon.
2. **Prioritas 2: Clean Inline SVG Component**:
   - Jika icon di Figma merupakan vector kustom yang belum ada di library, ekspor node vector tersebut sebagai **clean inline SVG**.
   - Pastikan atribut warna pada path menggunakan `currentColor` atau token `--g-kit-*`:
     ```html
     <svg class="icon-inline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="..." fill="currentColor" />
     </svg>
     ```
3. **Larangan Keras (Strict Ban)**:
   - **Dilarang keras** mengasumsikan atau meng-install package icon eksternal (seperti `lucide-vue-next`, `@heroicons/vue`, `@tabler/icons-vue`, atau `font-awesome`).

---

## 4. Pemetaan Variabel Figma ke Token `--g-kit-*`

Gunakan tabel resolusi berikut sebagai acuan utama:

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
| `font-style/normal` | `var(--g-kit-font-style-normal)` | Normal Style |
| `font-style/italic` | `var(--g-kit-font-style-italic)` | Italic Style |

> [!WARNING]
> Token font-weight resmi di pustaka `kitvue` hanya `normal` (`600`) dan `bold` (`800`). Jangan pernah menggunakan `--g-kit-font-weight-semibold` atau `--g-kit-font-weight-extrabold`.

---

## 5. Komponen First Rule

Sebelum membuat komponen UI baru dari nol, lakukan pengecekan dengan urutan berikut:

1. `src/components.ts` (alias project yang sudah terdaftar)
2. `node_modules/@pegadaian/kitvue/src/components` atau `node_modules/kitvue-public/src/components`
3. [kitvue-public-design-system.md](kitvue-public-design-system.md)

### Perintah Cepat untuk Eksplorasi:
```bash
# Cek alias komponen yang sudah ada di project
grep -E "export const G" src/components.ts 2>/dev/null || true

# Cek komponen yang tersedia di pustaka kitvue
find node_modules/@pegadaian/kitvue/src/components node_modules/kitvue-public/src/components -maxdepth 2 -type f -name '*.vue' 2>/dev/null | sort

# Cek asset icon resmi
ls node_modules/@pegadaian/kitvue/src/assets/icon/icon-system 2>/dev/null || true
```

Jika komponen tersedia di library namun belum memiliki alias project, **tambahkan alias di `src/components.ts`** alih-alih mengimpor path panjang berulang-ulang di setiap berkas SFC.

---

## 6. Mapping Komponen Standar

| Kebutuhan Antarmuka | Komponen Pilihan Utama |
| :--- | :--- |
| **Button / Aksi Utama** | `GButton` (`Button/Button.vue`) |
| **Input Text** | `GInputText` (`Input/InputText.vue` / `InputSmallText.vue`) |
| **Text Area** | `GTextArea` (`Input/InputTextArea.vue`) |
| **Dropdown / Select** | `GDropdown` (`Dropdown/InputDropdown.vue`) |
| **Auto Complete** | `AutoComplete` (`SelectOption/AutoComplete.vue`) |
| **Date / Time Picker** | `GDatePicker`, `InputTimePicker`, `TimePickerResponsive` |
| **Camera & QR** | `NewInputCamera`, `InputSearchQR` |
| **Filter CMS** | `FilterCMS`, `InputFilter` |
| **Alert / Feedback Box** | `GAlert` (`Alert/AlertVarian.vue`) |
| **Badge / Tag Status** | `GBadge` (`Badge/Badge.vue`) |
| **Breadcrumb** | `GBreadcrumb` (`Breadcrumb/Breadcrumb.vue`) |
| **Navigasi Back** | `GNavBackNavigator` (`Navbar/NavBackNavigator.vue`) |
| **Header Beranda / CMS** | `GBerandaHeader`, `HeaderCMS`, `NavbarCorporate` |
| **Sidebar CMS** | `SideNavCMS`, `ItemSideNav` |
| **Tabel Data & Paginasi** | `GTable`, `GTablePagination`, `TableSticky`, `DataTable` |
| **Modal Dialog** | `GModal` (`Modal/ModalComponent.vue`), `CustomModal` |
| **Mobile Drawer / Bottomsheet** | `BottomSheet/GOffCanvas.vue`, `ModalBottomSheet` |
| **Tracking Status** | `TrackingStatus`, `ModalTrackingStatus` |
| **Financial Charts** | `BarChart`, `LineChart`, `StackedBarChart`, `DoughnutChart` |
| **Accordion / Collapsible** | `GAccordion`, `GAccordionItem` |

---

## 7. Responsive & Layout Rules

1. **Table vs Mobile Card**: Tabel horizontal pada layar desktop harus bertransformasi menjadi daftar Card ringkas pada tampilan mobile jika jumlah kolom melebihi lebar layar.
2. **Modal vs Bottomsheet**: Dialog modal desktop wajib berubah menjadi **Bottomsheet** (`BottomSheet/GOffCanvas.vue` atau `ModalBottomSheet.vue`) pada viewport mobile (`< 768px`).
3. **Overlay & Z-Index**: Bottomsheet harus memiliki overlay latar belakang gelap dengan pengaturan z-index yang terisolasi.
4. **Sticky Action Area**: Pastikan container halaman memiliki `padding-bottom` ekstra (minimal 80px - 100px) agar tombol sticky di mobile tidak menutupi konten utama.
5. **Navbar Adaptif**: Header mobile hanya menampilkan elemen navigasi esensial (logo dan profil/menu trigger) dan menjadi sticky saat halaman di-scroll.

---

## 8. Definition of Done (DoD)

Implementasi dianggap tuntas hanya jika:

- [ ] Figma variable definitions dan visual screenshot telah diverifikasi.
- [ ] Seluruh nilai styling warna & tipografi dipetakan ke token `--g-kit-*` (tidak ada arbitrary hex).
- [ ] Spacing dan layout memanfaatkan utility Bootstrap 5 (`p-*`, `m-*`, `gap-*`, `d-flex`) atau piksel SCSS presisi (tanpa token fiktif `--g-kit-space-*`).
- [ ] Komponen library `@pegadaian/kitvue` / `kitvue-public` digunakan sebagai prioritas utama.
- [ ] Iconography mematuhi aturan asset resmi library atau clean inline SVG (tanpa package luar fiktif).
- [ ] Responsivitas desktop dan mobile (termasuk konversi bottomsheet) berfungsi dengan mulus.
- [ ] Aksi interaktif dasar (modal open/close, copy, filter, toggle) telah terpasang.
- [ ] Pengecekan tipe TypeScript (`vue-tsc --noEmit`) dan build project berhasil tanpa error.
