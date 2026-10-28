# Kitvue Public Design System Reference

Dokumen ini menjadi inventaris dan checklist lokal sebelum merealisasikan desain Figma MCP ke dalam kode Vue 3. Tujuannya: menjamin seluruh elemen antarmuka memanfaatkan design token resmi `--g-kit-*`, komponen yang tersedia di `@pegadaian/kitvue` / `kitvue-public`, serta fondasi Bootstrap 5.3.2.

---

## 1. Sumber & Fondasi Token

Pustaka `@pegadaian/kitvue` (atau `kitvue-public`) mengemas definisi SCSS dan CSS Variables di lokasi berikut:

- `node_modules/@pegadaian/kitvue/src/assets/scss/g-kit/_colors.scss`
- `node_modules/@pegadaian/kitvue/src/assets/scss/g-kit/_typography.scss`
- `node_modules/@pegadaian/kitvue/src/assets/scss/g-kit/_variables.scss`
- `node_modules/@pegadaian/kitvue/src/assets/scss/g-kit.scss`

Bundle CSS global diimpor melalui `@pegadaian/kitvue/dist/style.css` (atau `kitvue-public/dist/style.css`), sehingga variabel CSS `--g-kit-*` dapat langsung dikonsumsi di dalam Single File Component (SFC) tanpa perlu impor SCSS manual.

> [!IMPORTANT]
> **Scope Token `:root`**: CSS variables di `:root` **hanya** mendefinisikan warna (`--g-kit-{palette}-{shade}`) dan tipografi (`--g-kit-font-*`). Variabel seperti `--g-kit-space-*` atau `--g-kit-radius-*` **tidak ada**. Untuk spacing dan layout, gunakan utility classes **Bootstrap 5.3.2** (`p-1` sampai `p-5`, `mb-3`, `gap-3`, `d-flex`) atau nilai piksel SCSS langsung.

---

## 2. Palet Warna & Pemetaan Variabel Figma

Gunakan format CSS variable `--g-kit-{palette}-{scale}`.

| Figma Variable Name | Nilai Hex | CSS Variable Resmi | Peran & Penggunaan |
| :--- | :--- | :--- | :--- |
| `color/black/80` / `black-80` | `#252528` | `var(--g-kit-black-80)` | Text Utama / Heading |
| `color/black/60` / `black-60` | `#58585b` | `var(--g-kit-black-60)` | Text Sekunder / Subtitle |
| `color/black/50` / `black-50` | `#939597` | `var(--g-kit-black-50)` | Placeholder / Helper / Disabled Text |
| `color/black/40` / `black-40` | `#bbbdc0` | `var(--g-kit-black-40)` | Disabled Border / Garis Pemisah |
| `color/black/20` / `black-20` | `#eeeeef` | `var(--g-kit-black-20)` | Structural Border Netral |
| `color/black/10` / `black-10` | `#f8f8f8` | `var(--g-kit-black-10)` | Background Ringan / Card Surface |
| `color/white` / `white` | `#ffffff` | `var(--g-kit-white)` | Background Utama / Text on Dark |
| `color/lime/50` / `lime-50` | `#00ab4e` | `var(--g-kit-lime-50)` | Primary Action / Success State |
| `color/lime/60` / `lime-60` | `#00883e` | `var(--g-kit-lime-60)` | Primary Hover |
| `color/lime/80` / `lime-80` | `#00662e` | `var(--g-kit-lime-80)` | Primary Active / Pressed |
| `color/orange/50` / `orange-50` | `#e07e26` | `var(--g-kit-orange-50)` | Warning / Pending State |
| `color/red/50` / `red-50` | `#ae1e22` | `var(--g-kit-red-50)` | Danger / Failed State |
| `color/blue/50` / `blue-50` | `#1868ab` | `var(--g-kit-blue-50)` | Information State |
| `color/gold/50` / `gold-50` | `#d8b56d` | `var(--g-kit-gold-50)` | Gold / Bullion Brand Accent |
| `color/broccoli/50` | `#004d43` | `var(--g-kit-broccoli-50)` | Dark Brand Header / Surface |

### Skala Lengkap Seluruh Palet Warna:
Tersedia 13 palet: `broccoli`, `lime`, `pear`, `kiwi`, `red`, `orange`, `yellow`, `gold`, `turquoise`, `blue`, `purple`, `black`, `white`.  
Tiap palet (kecuali white) memiliki skala: `90`, `80`, `60`, `50`, `40`, `20`, `10`.

---

## 3. Tipografi (Nunito Sans & Skala Yunani)

Font family standar adalah **Nunito Sans**. Skala ukuran dan line-height diatur menggunakan nomenklatur alfabet Yunani:

| Figma Typography Token | Font Size | Line Height | CSS Variable | Penggunaan Standar |
| :--- | :---: | :---: | :--- | :--- |
| `alpha` | 72px | 108px | `var(--g-kit-font-size-alpha)` | Display Hero Sangat Besar |
| `beta` | 60px | 90px | `var(--g-kit-font-size-beta)` | Display Banner |
| `gamma` | 48px | 72px | `var(--g-kit-font-size-gamma)` | Title Banner / Hero Page |
| `delta` | 36px | 54px | `var(--g-kit-font-size-delta)` | Heading Besar H1 |
| `epsilon` | 30px | 44px | `var(--g-kit-font-size-epsilon)` | Page Title H2 |
| `zeta` | 24px | 36px | `var(--g-kit-font-size-zeta)` | Section Title H3 |
| `kappa` | 20px | 30px | `var(--g-kit-font-size-kappa)` | Modal Title / Card Title |
| `lambda` | 18px | 26px | `var(--g-kit-font-size-lambda)` | Subtitle / Standout Text |
| `omicron` | 16px | 24px | `var(--g-kit-font-size-omicron)` | **Body Text / Default Form Control** |
| `sigma` | 14px | 20px | `var(--g-kit-font-size-sigma)` | **Tabel Data / Caption / Subtext** |
| `omega` | 12px | 18px | `var(--g-kit-font-size-omega)` | **Helper Text / Badge / Metadata** |
| `atom` | 10px | 14px | `var(--g-kit-font-size-atom)` | Fine Print / Legal Disclaimer |

### Font Weight & Style Resmi:
- **Normal (600)**: `var(--g-kit-font-weight-normal)`
- **Bold (800)**: `var(--g-kit-font-weight-bold)`
- **Style Normal**: `var(--g-kit-font-style-normal)`
- **Style Italic**: `var(--g-kit-font-style-italic)`

---

## 4. Asset Icon Resmi Pegadaian

Asset icon SVG resmi tersedia di dalam pustaka pada direktori:
- **System Icons**: `src/assets/icon/icon-system/`
  - Contoh: `icon-arrow-up.svg`, `icon-calendar.svg`, `icon-profile-fill.svg`, `icon-transaction.svg`, `icon-search.svg`, `icon-trash.svg`, `icon-edit.svg`, `icon-filter.svg`, `icon-download.svg`.
- **Product Icons**: `src/assets/icon/icon-product/`
  - Contoh: `icon-submenu_gadai-gadai.svg`, `icon-submenu_cicil_emas-*.svg`, `icon-submenu_pembiayaan-haji.svg`.
- **Icon Label Component**: `src/components/Label/LabelIcon.vue`.

---

## 5. Katalog Komponen Lengkap (Terverifikasi di Library)

Berikut adalah daftar katalog komponen UI yang tersedia di `src/components/`:

### 5.1 Form Inputs & Pickers
| Komponen | Path Berkas Sumber | Deskripsi |
| :--- | :--- | :--- |
| `GInputText` | `Input/InputText.vue` / `InputSmallText.vue` | Input teks umum (mendukung label, error, helper) |
| `GTextArea` | `Input/InputTextArea.vue` | Area teks multi-baris |
| `GInputRupiah` | `Input/InputNominalEnd.vue` | Input nominal mata uang Rupiah / persen |
| `GInputKtp` | `Input/InputKTP.vue` | Input terformat khusus 16 digit NIK/KTP |
| `GInputPhone` | `Input/InputPhone.vue` | Input nomor telepon dengan prefix +62 |
| `GInputSearch` | `Input/InputSearch.vue` | Input pencarian dengan icon search |
| `GInputSearchQR` | `Input/InputSearchQR.vue` | Input pencarian terintegrasi scan QR code |
| `GDatePicker` | `Input/InputSmallDate.vue` / `DatePicker.vue` | Pemilih tanggal tunggal |
| `GRangeDatePicker`| `Input/DateRangePicker.vue` | Pemilih rentang tanggal |
| `GTimePicker` | `Input/InputTimePicker.vue` / `TimePickerResponsive.vue` | Pemilih waktu responsif |
| `NewInputCamera` | `Input/NewInputCamera.vue` | Komponen ambil foto kamera (KTP / selfie) |
| `AutoComplete` | `SelectOption/AutoComplete.vue` | Input dropdown dengan fitur autocomplete live |

### 5.2 CMS & Navigation
| Komponen | Path Berkas Sumber | Deskripsi |
| :--- | :--- | :--- |
| `HeaderCMS` | `Header/HeaderCMS.vue` | Header topbar khusus layout CMS |
| `SideNavCMS` | `Navbar/SideNavCMS.vue` | Sidebar navigasi menu CMS |
| `ItemSideNav` | `Navbar/ItemSideNav.vue` | Item menu individual untuk SideNavCMS |
| `GBerandaHeader` | `Navbar/BerandaHeader.vue` | Header dashboard beranda pengguna |
| `NavbarCorporate` | `Navbar/NavbarCorporate.vue` | Navbar formal korporat Pegadaian |
| `GBreadcrumb` | `Breadcrumb/Breadcrumb.vue` | Navigasi jejak rekam (breadcrumb) |
| `GNavBackNavigator`| `Navbar/NavBackNavigator.vue` | Tombol navigasi kembali dengan judul halaman |
| `TabGroup` | `Tab/TabGroup.vue` | Wadah grup navigasi tab horizontal |
| `TabKategori` | `Tab/TabKategori.vue` | Tab filter kategori produk |
| `TabProduct` | `Tab/TabProduct.vue` | Tab navigasi varian produk |
| `TabPembinaan` | `Navbar/TabPembinaan.vue` | Tab navigasi modul pembinaan |

### 5.3 Filter & Data Display
| Komponen | Path Berkas Sumber | Deskripsi |
| :--- | :--- | :--- |
| `FilterCMS` | `Filter/FilterCMS.vue` | Komponen bilah filter multi-parameter CMS |
| `InputFilter` | `Filter/InputFilter.vue` | Kontrol input terintegrasi filter |
| `GTable` | `Table/TableData.vue` / `CustomTable.vue` | Tabel data standar dengan striping dan hover |
| `GTablePagination`| `Table/TablePagination.vue` | Kontrol paginasi data tabel |
| `TableSticky` | `Table/TableSticky.vue` | Tabel data dengan header kolom sticky saat di-scroll |
| `GBadge` | `Badge/Badge.vue` | Tag label status visual |
| `LabelIcon` | `Label/LabelIcon.vue` | Label teks terintegrasi icon SVG |
| `AddAmountCounter`| `AddAmount/AddAmountCounter.vue`| Kontrol counter penambahan jumlah (+ / -) |
| `AddAmountDenom` | `AddAmount/AddAmountDenom.vue` | Pilihan denominasi penambahan instan |

### 5.4 Modals, Overlays & Feedback
| Komponen | Path Berkas Sumber | Deskripsi |
| :--- | :--- | :--- |
| `GModal` | `Modal/ModalComponent.vue` | Dialog modal desktop standar |
| `CustomModal` | `Modal/CustomModal.vue` | Dialog modal dengan custom slot header/footer |
| `ModalBottomSheet`| `Modal/ModalBottomSheet.vue` | Drawer / sheet yang muncul dari bawah pada mobile |
| `GOffCanvas` | `BottomSheet/GOffCanvas.vue` | Offcanvas / drawer responsif multi-platform |
| `ProductSelectionModal` | `Modal/ProductSelectionModal.vue` | Modal dialog khusus pemilihan produk |
| `GAlert` | `Alert/AlertVarian.vue` | Kotak peringatan status (*success, warning, danger*) |
| `TrackingStatus` | `TrackingStatus/TrackingStatus.vue` | Pelacak tahapan proses / timeline status |
| `ModalTrackingStatus` | `TrackingStatus/ModalTrackingStatus.vue` | Modal dialog pelacak progres status |
| `Tooltip` | `Tooltip/TooltipComponent.vue` | Popover keterangan bantuan saat hover |

### 5.5 Charts & Analytics
| Komponen | Path Berkas Sumber | Deskripsi |
| :--- | :--- | :--- |
| `BarChart` | `Chart/BarChart.vue` | Grafik batang finansial / performa |
| `LineChart` | `Chart/LineChart.vue` | Grafik garis tren fluktuasi harga/transaksi |
| `StackedBarChart` | `Chart/StackedBarChart.vue` | Grafik batang bertumpuk multi-kategori |
| `DoughnutChart` | `Chart/DoughnutChart.vue` | Grafik donat proporsi portofolio aset |
