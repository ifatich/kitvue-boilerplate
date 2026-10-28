# Kitvue Plugin — AI Agent Skill

> **Skill & Extension Resmi untuk Pengembang Frontend Pegadaian**  
> Mengonversi desain Figma MCP menjadi antarmuka **Vue 3 (TypeScript)** siap produksi dengan pustaka komponen resmi **`@pegadaian/kitvue`** (atau `kitvue-public`), design token **`--g-kit-*`**, dan fondasi **Bootstrap 5.3.2**.

---

## 🎯 Gambaran Umum

Skill ini dirancang untuk agen AI (seperti OpenAI Codex, Antigravity, Claude Code, atau Cursor) agar dapat mengimplementasikan halaman antarmuka web, modal, drawer/bottomsheet, dan komponen responsif secara konsisten dan terstandarisasi di seluruh proyek CMS dan aplikasi web Pegadaian.

### Jaminan Kualitas:
- **Variable-First Token Resolution**: Membaca variabel desain Figma (`boundVariables`) dan memetakannya secara deterministik ke variabel CSS `--g-kit-*` tanpa menerka nilai hex mentah.
- **Bootstrap 5.3.2 Layout Foundation**: Memanfaatkan utility classes bawaan Bootstrap 5 (`p-1`–`p-5`, `mb-3`, `gap-3`, `d-flex`) untuk spacing dan layout template, serta mengeliminasi ketergantungan token fiktif (`--g-kit-space-*`).
- **Katalog Komponen Terlengkap (87+ Komponen)**: Mencakup komponen form inputs, filter CMS, navigation (`HeaderCMS`, `SideNavCMS`), modal responsif, financial charts, hingga pelacak status (`TrackingStatus`).
- **Official Pegadaian Icon Assets**: Terintegrasi langsung dengan asset icon resmi library (`src/assets/icon/icon-system/` dan `icon-product/`) serta clean inline SVG. Mencegah agen meng-install package icon eksternal sembarangan.
- **Mobile-First Responsiveness**: Menangani adaptasi tata letak dari tabel desktop ke daftar kartu (*card list*) dan modal ke *bottomsheet* di perangkat mobile.

---

## 📁 Struktur Direktori

```text
kitvue-plugin/
├── SKILL.md                          # Instruksi utama pemicu agen
├── README.md                         # Panduan instalasi dan penggunaan bagi developer
├── agents/
│   └── openai.yaml                   # Metadata antarmuka agen (Codex/Copilot)
├── assets/
│   ├── kitvue-figma-logo.svg         # Logo visual resolusi penuh
│   └── kitvue-figma-small.svg        # Icon avatar kecil
├── examples/
│   └── canonical-screen.vue          # Template referensi kode Vue 3 SFC produksi
└── references/
    ├── frontend-implementation-rules.md  # Aturan kerja teknis, checklist, dan alur MCP
    ├── kitvue-public-design-system.md     # Inventaris 87+ komponen, token, dan icon
    └── domain-bullion-bank.md             # Aturan khusus domain transaksi & custody
```

---

## 🚀 Panduan Pemasangan (Installation)

### Opsi 1: Pemasangan Global di OpenAI Codex
Salin folder skill ini ke direktori skills pengguna:
```bash
# macOS / Linux
mkdir -p ~/.codex/skills/
cp -r "kitvue-plugin" ~/.codex/skills/
```

### Opsi 2: Pemasangan di Google Antigravity / Agentic IDE
Salin atau tautkan ke direktori skills workspace atau global:
```bash
# Simpan di level workspace proyek
mkdir -p .agents/skills/
cp -r "kitvue-plugin" .agents/skills/
```

### Opsi 3: Distribusi Melalui Git Submodule
Di dalam repositori CMS Anda, tambahkan skill ini sebagai submodule:
```bash
git submodule add <URL_REPO_SKILL> .agents/skills/kitvue-plugin
```

---

## 📋 Prasyarat Lingkungan (Prerequisites)

1. **Figma MCP Server**: Agen AI harus memiliki akses ke tool Figma MCP (misal: `get_node_info`, `get_design_context`, `get_variable_definitions`).
2. **Akses Registry Pustaka**: Proyek telah menginstal pustaka `@pegadaian/kitvue` (internal registry) atau `kitvue-public` (public npm) dan `bootstrap` v5.3.2.
3. **Environment**: Node.js v18+, Vue 3 dengan `<script setup lang="ts">`, dan TypeScript.

---

## 💡 Contoh Prompt Penggunaan (Prompt Examples)

Setelah skill terpasang, Anda dapat memicunya langsung dalam percakapan dengan agen menggunakan tag `$kitvue-plugin`:

### 1. Implementasi Layar Baru dari Node Figma
```text
Tolong implementasikan screen dari Figma URL berikut memakai $kitvue-plugin:
https://www.figma.com/design/XXXXX/Pegadaian-Design?node-id=123-456
Gunakan komponen resmi kitvue dan Bootstrap 5 utilities untuk spacing layout.
```

### 2. Audit Komponen yang Sudah Ada
```text
Gunakan $kitvue-plugin untuk mengaudit berkas `src/modules/transaction/views/History.vue`
terhadap node Figma #456:789. Pastikan semua warna dan font weight selaras dengan token --g-kit-*.
```

### 3. Implementasi Modal / Bottomsheet
```text
Buat modal detail persetujuan dari Figma ini memakai $kitvue-plugin.
Di mobile, pastikan bertransformasi menjadi bottomsheet dengan overlay yang benar.
```

---

## 🛡️ Aturan Utama Bagi Developer & Agen

1. **Font Weight**: Hanya gunakan `var(--g-kit-font-weight-normal)` (600) dan `var(--g-kit-font-weight-bold)` (800).
2. **Spacing & Radius**: Gunakan kelas utilitas Bootstrap 5 (`p-3`, `mb-3`, `gap-3`) atau nilai piksel SCSS langsung. Dilarang mengarang variabel `var(--g-kit-space-*)`.
3. **Scoped CSS**: Scoped CSS hanya diizinkan untuk container dan gap layout kustom; dilarang menimpa paksa internal CSS bawaan komponen library.
4. **Verifikasi Build**: Selalu jalankan `vue-tsc --noEmit` setelah menghasilkan kode untuk memastikan integritas TypeScript.
