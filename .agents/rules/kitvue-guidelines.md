# Kitvue UI & Design System Guidelines

Aturan ini wajib dipatuhi oleh AI saat membuat, memodifikasi, atau merefaktor komponen dan tampilan antarmuka di dalam project ini.

---

## 1. Prioritas Komponen & Reuse
- **Cek Library Terlebih Dahulu:** Selalu periksa `src/components.ts` dan pustaka `kitvue-public` sebelum membuat komponen kustom.
- **Komponen Standar:** Gunakan komponen resmi yang telah di-reexport di `@/components`:
  - Tombol: `GButton`
  - Input: `GInputText`, `GInputNominalStart`, `GInputNominalEnd`, `GTextArea`, `GRangeDatePicker`
  - Struktur: `GModal`, `GBaseModal`, `GAccordion`, `GAccordionItem`, `GStepper`
  - Data: `GTable`, `GTablePagination`, `GBadge`, `GAlert`, `GDropdown`, `GTeleportDropdown`
  - Navigasi: `GBreadcrumb`, `GNavBackNavigator`, `GBerandaHeader`

---

## 2. Token Desain & Styling
- **CSS Variables Pegadaian:** Wajib menggunakan token desain resmi `--g-kit-*` yang telah dimuat dari `kitvue-public/src/assets/scss/g-kit.scss` dan `src/assets/styles/tokens.css`.
- **Warna & Elevasi:** Gunakan `--g-kit-broccoli-50`, `--g-kit-white`, `--g-kit-black-80`, `--bb-elevation-card`, dll. Jangan gunakan hardcoded color codes jika token tersedia.
- **Tipografi:** Menggunakan font standar Pegadaian `Nunito Sans` dengan token `--g-kit-font-size-*`, `--g-kit-font-weight-normal` (600), dan `--g-kit-font-weight-bold` (800).
- **Utility Layout:** Gunakan Bootstrap 5 utilities (`d-flex`, `justify-content-*`, `align-items-*`, `gap-3`, `p-3`, dll.) untuk layout spacing.
- **Scoped CSS:** Gunakan scoped CSS hanya untuk page wrapper dan custom grid khusus. Jangan melakukan CSS override agresif terhadap komponen internal kitvue.

---

## 3. Kebijakan Ketat Ikonografi (Strict Iconography)
- **DILARANG** mengimpor atau menambahkan package icon eksternal baru (seperti `lucide-vue-next`, `@heroicons/vue`, `font-awesome`) yang tidak terdaftar di `package.json`.
- Gunakan inline SVG bersih (`viewBox="0 0 24 24"`, `stroke="currentColor"`, `fill="none"`) yang dibungkus rapi pada elemen span/button.

---

## 4. Integrasi Figma MCP & Skill kitvue-plugin
- Saat diminta mengimplementasikan atau merevisi desain dari Figma, aktifkan dan rujuk skill `.agents/skills/kitvue-plugin/SKILL.md`.
- Periksa `boundVariables` (fills, strokes, textStyles) dari node Figma MCP untuk memetakan langsung ke token `--g-kit-*`.
- Rujuk template referensi kanonikal di `.agents/skills/kitvue-plugin/examples/canonical-screen.vue`.

---

## 5. Standar Vue 3 & TypeScript
- Wajib menggunakan `<script setup lang="ts">`.
- Strict type checking: Dilarang menggunakan tipe `any`. Definisikan interface props (`defineProps<Props>()`) dan emits (`defineEmits<Emits>()`) secara eksplisit.
- Responsivitas: Pastikan tampilan desktop beradaptasi anggun ke mobile (tabel bertransformasi menjadi daftar kartu, dan modal beradaptasi menjadi bottomsheet).
