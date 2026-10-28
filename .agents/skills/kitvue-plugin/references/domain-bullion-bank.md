# Bullion Bank CMS — Domain Implementation Rules

Dokumen ini berisi aturan khusus domain untuk repositori **Bullion Bank CMS**. Gunakan dokumen ini sebagai referensi tambahan ketika tugas implementasi berada di dalam repositori atau modul transaksi Bullion Bank.

---

## 1. Aturan Transaksi & Custody Data

Untuk komponen atau layar yang menampilkan data transaksi, status mutasi emas, atau laporan custody, struktur data dummy wajib merefleksikan response backend operasional:

- `id`: identifier unik transaksi
- `transactionHash`: transaction hash / payment reference
- `custodyReference`: ID referensi vault / kustodi
- `type`: tipe transaksi (misal: *Deposit*, *Withdrawal*, *Transfer*, *Trading*)
- `status`: status transaksi (*Success*, *Pending*, *Failed*, *Under Review*)
- `fromCompany`: nama institusi/perusahaan pengirim
- `fromWallet`: public address / account pengirim
- `toCompany`: nama institusi/perusahaan penerima
- `toWallet`: public address / account penerima
- `asset`: jenis aset (misal: *XAU / Emas Fisik*, *Digital Gold*)
- `network`: settlement network / ledger
- `dateTime`: ISO timestamp transaksi
- `amount`: nominal / berat emas (gram/troy ounce)
- `fee`: biaya transaksi
- `netAmount`: total bersih transaksi

### Penyimpanan Mock Data
- Jangan meng-hardcode dataset kompleks langsung di dalam template Vue SFC.
- Simpan berkas mock di: `src/utils/data/transaction-history.mock.json` atau `src/utils/data/[feature-name].mock.json`.
- Impor data dummy tersebut ke dalam script SFC atau composable mock.

---

## 2. Pola Wrapper Komponen Project Bullion Bank

Proyek Bullion Bank CMS memiliki beberapa wrapper standar yang membungkus komponen `kitvue-public`:

| Fungsi | Wrapper Project | Komponen Inti Kitvue |
| :--- | :--- | :--- |
| **Top Navbar** | `src/components/shared/header/BerandaHeaderWrapper.vue` | `GBerandaHeader` |
| **Breadcrumb** | `src/components/shared/breadcrumb/Breadcrumb.vue` | `GBreadcrumb` |
| **Back Navigation** | `src/components/shared/navBack/navBack.vue` | `GNavBackNavigator` |
| **Global Alert** | Host project alert / `src/components/shared/alert/` | `GAlert` (`AlertVarian.vue`) |

> **Catatan Penggunaan**: Selalu utamakan wrapper project yang sudah ada di atas jika tersedia, agar integrasi route, event bus, dan global state aplikasi tetap konsisten.

---

## 3. Responsive Behavior Khusus CMS Transaksi

1. **Table vs Card List**:
   - Tampilan Desktop (`min-width: 1024px`): Wajib menggunakan layout tabel data (`GTable` atau `GTablePagination`) dengan kolom lengkap.
   - Tampilan Mobile (`< 768px`): Riwayat transaksi harus otomatis berubah menjadi representasi **Card List** kompak yang menampilkan ringkasan aset, status badge, dan nominal, dengan trigger tap untuk melihat rincian di Bottomsheet.
2. **Action Sheet**:
   - Filter transaksi, detail mutasi, dan konfirmasi aksi pada layar mobile harus ditampilkan melalui `BottomSheet/GOffCanvas.vue` dengan overlay gelap (`rgba(0,0,0,0.5)`).
3. **Sticky Action Buttons**:
   - Pastikan container halaman memiliki `padding-bottom` yang memadai (minimal `80px` - `100px`) agar tombol aksi sticky mobile tidak menutupi informasi atau pagination di bagian paling bawah.

