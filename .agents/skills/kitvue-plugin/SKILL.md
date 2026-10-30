---
name: kitvue-plugin
description: Implement Vue 3 CMS screens, SPRINT Single UI modules, components, modals, bottomsheets, and responsive layouts from Figma MCP using @pegadaian/kitvue or kitvue-public components, SprintModuleShell, ModuleSectionCard, --g-kit design tokens, and Bootstrap 5 utilities. Supports Bullion Bank CMS, SPRINT Single UI (Pinjaman Rahn, Tabungan Emas, Waskat), and Pegadaian Vue projects. Use when the user asks to implement or revise a Figma design, match a Figma node, inspect design tokens and bound variables, reuse kitvue components, avoid custom components before checking the library, or convert Figma MCP output into Vue code for this style system.
---

# Kitvue Plugin

## Overview

Use this skill to turn Figma MCP designs into production-ready Vue 3 implementations aligned with `@pegadaian/kitvue` (or `kitvue-public`), official `--g-kit-*` design tokens, Bootstrap 5.3.2 utilities, and the **SPRINT Single UI** architectural standards. Always inspect Figma variables (`boundVariables`) and map color and typography directly to `--g-kit-*` tokens before writing CSS.

---

## Architectural Separation (Shell vs Module Layer)

To maintain scalable, modular, and maintainable code, strictly decouple universal layout infrastructure from domain/module logic:

### 1. Shell & Layout Layer (`src/components/shared/admin-layout/` & `stepper/`)
- **`SprintModuleShell.vue`**: Universal parent page shell owning:
  - Top SPRINT Navbar with embedded pattern, mobile title, back button, and info action.
  - Breadcrumb band & desktop `NavBack` navigation.
  - Full-bleed mobile container (`width: 100%; padding: 0;`) and 1152px constrained desktop canvas.
  - **Flexbox Sticky Footer** (`margin-top: auto;`) — guarantees the footer is pinned to the bottom of the viewport even on short content pages (preventing "floating footer" glitches).
  - **Fixed Action Sheet (`#actions`)**: Responsive bottom floating bar (horizontal flex on desktop, rounded top sheet with drop shadow on mobile) with dynamic footer clearance padding via CSS `:has()` (e.g. 88px for 1 button, 136px for 2 stacked buttons).
  - Slots: `#mobile-stepper`, `#notice`, `#default`, `#actions`.
- **`MobileStepperBanner.vue`**: Mobile step progress header (`Langkah X dari Y` & `Tahap X - [Title]`) displayed edge-to-edge above module content.

### 2. Collapsible Card Containers (`src/components/shared/card/`)
- **`ModuleSectionCard.vue` & `.form-card` Pattern**: Standardized collapsible card container:
  - **Desktop (≥ 768px) Unified Card:** When multiple sections belong to one form stage (e.g. `Informasi Rahn` & `Beneficial Owner`), wrap them in `.form-card` (`border: 1px solid var(--g-kit-black-20); border-radius: 8px; background: #fff;`). Sections are divided by `border-top: 8px solid var(--g-kit-black-10)`. Do NOT render them as multiple floating separate cards with empty space between them.
  - **Mobile (< 768px) Edge-to-Edge Standard:** Must **NOT** be wrapped in an outer bordered card or padded page container. The `.form-card` becomes a transparent flex column with `gap: 8px`. Each `<ModuleSectionCard>` renders as an edge-to-edge borderless white section (`border: none; border-radius: 0; padding: 16px; width: 100%;`) separated by an 8px gap displaying the page's light grey surface (`#f8f8f8`).
  - **Zero-Flicker Animation:** Uses CSS Grid (`grid-template-rows: 0fr ↔ 1fr`) with `cubic-bezier(0.4, 0, 0.2, 1)` and inner `overflow: hidden; min-height: 0;` to eliminate height jumps, glitches, and flickering.
  - **Accessibility (A11y):** Semantic heading button with `aria-expanded`, `aria-controls`, and smooth 180° rotating chevron.

### 3. Module Layer (`src/views/[ModuleName]View.vue`)
- Responsible **strictly** for business domain logic:
  - Reactive form state (`fields`, validation states).
  - Multi-step state management (`activeStep`, `canContinue`, `nextStep`, `prevStep`).
  - Slot content injection: contextual warnings (`<GAlert>` in `#notice`), domain input grids inside `<ModuleSectionCard>`, and submit/navigation buttons in `#actions`.

---

## Core Workflow

1. **Inspect Project Dependencies & Aliases**:
   - Check `package.json` to verify whether the library is installed as `@pegadaian/kitvue` or `kitvue-public`.
   - Identify existing component aliases in `src/components.ts` (e.g. `GButton`, `GDropdown`, `GInputText`, `GAlert`, `GStepper`).
2. **Inspect Figma MCP**:
   - For a Figma URL or node ID, query design context, variable definitions (`boundVariables`), and capture a visual screenshot before coding.
3. **Map Color & Typography (Variable-First)**:
   - Map bound variables (`color/lime/50`, `black/80`, `omicron`, `normal`) directly to `--g-kit-*` CSS variables.
   - Respect official font weights: only `var(--g-kit-font-weight-normal)` (600) and `var(--g-kit-font-weight-bold)` (800).
4. **Spacing & Layout Resolution (Bootstrap 5 Utilities)**:
   - Use **Bootstrap 5.3.2 utility classes** (`p-1`–`p-5`, `mb-3`, `gap-3`, `d-flex`, `justify-content-*`) on template HTML.
   - **Do not generate non-existent CSS variables** such as `var(--g-kit-space-*)` or `var(--g-kit-radius-*)`.
   - For custom wrapper styles in scoped CSS, use explicit pixel values (`16px`, `24px`, `border-radius: 6px` for inputs, `border-radius: 8px` for cards).
5. **Enforce Component Reuse & Shell Integration**:
   - Use `SprintModuleShell` as the standard outer shell for SPRINT Single UI screens.
   - Wrap collapsible sections in `ModuleSectionCard`.
   - Use official kitvue form components: `GButton`, `GInputText`, `GDropdown`, `GInputNominalStart`, `GAlert`, `GStepper`, `ModalBottomSheet`.
6. **Strict Iconography Policy**:
   - Prioritize official Pegadaian SVG icons from the library (`src/assets/icon/icon-system/` and `src/assets/icon/icon-product/`) or `@/assets/images/sprint/`.
   - If writing standalone SVG, use clean inline SVG with `fill="currentColor"`.
   - **Never** import or install unauthorized icon packages (e.g. `lucide-vue-next`, `@heroicons/vue`).
7. **Clean Code & Storage Hygiene**:
   - **Delete unused code immediately**: Do not leave unused mock data, orphaned layout files, or unreferenced components.
   - **Optimize assets**: Do not embed massive raster PNGs inside SVG vectors; optimize and compress assets before bundling.
8. **Verify Responsive Behavior**:
   - Desktop: Constrained container (1152px), stepper sidebar, card borders.
   - Mobile: Full-bleed edge-to-edge layout, mobile stepper banner, borderless white sections with 8px gap on `#f8f8f8`, sticky bottom action sheet with dynamic footer clearance.
9. **Build & Type Check**:
   - Run `pnpm run type-check` (`vue-tsc --noEmit`), `pnpm run test` (`vitest run`), and `pnpm run build` to verify integrity with zero errors.

---

## Token Reference Essentials

Use CSS variables instead of hardcoded hex values:

- **Text Primary**: `var(--g-kit-black-80, #252528)`
- **Text Secondary**: `var(--g-kit-black-60, #58585b)`
- **Placeholder / Tertiary**: `var(--g-kit-black-50, #939597)`
- **Border Disabled**: `var(--g-kit-black-40, #bbbdc0)`
- **Border Neutral**: `var(--g-kit-black-20, #eeeeef)`
- **Background Light**: `var(--g-kit-black-10, #f8f8f8)` or `var(--g-kit-white, #ffffff)`
- **Primary / Success**: `var(--g-kit-lime-50, #00ab4e)`
- **Primary Hover / Active**: `var(--g-kit-lime-60, #00883e)` / `var(--g-kit-lime-80, #00662e)`
- **Pending / Warning**: `var(--g-kit-orange-50, #e07e26)`
- **Failed / Danger**: `var(--g-kit-red-50, #ae1e22)`
- **Info**: `var(--g-kit-blue-50, #1868ab)`
- **Gold Accent**: `var(--g-kit-gold-50, #d8b56d)`

Official font weights:
- `var(--g-kit-font-weight-normal)` = `600`
- `var(--g-kit-font-weight-bold)` = `800`

*(Do not use undefined tokens like `--g-kit-font-weight-semibold` or `--g-kit-font-weight-extrabold`)*.

---

## Definition Of Done

An implementation is considered complete only when:
- Figma design context, bound variables, and screenshots have been inspected.
- Screen is cleanly decoupled into Shell layer (`SprintModuleShell`) and Module layer.
- Collapsible cards use `ModuleSectionCard` with zero-flicker CSS Grid collapse.
- Mobile layout is cardless: edge-to-edge white blocks with 8px gap on `#f8f8f8`.
- Flexbox sticky footer (`margin-top: auto`) prevents floating footer issues.
- Fixed action bar on mobile has dynamic clearance padding ensuring footer visibility.
- All styles use `--g-kit-*` tokens without arbitrary hex values.
- Spacing uses Bootstrap 5 utilities or standard pixel values (zero fake `--g-kit-space-*` variables).
- Kitvue components have been prioritized over custom code.
- Clean inline SVG icons or official library icon assets are used (no foreign icon libraries).
- `vue-tsc --noEmit`, `vitest run`, and project build succeed with zero errors.
