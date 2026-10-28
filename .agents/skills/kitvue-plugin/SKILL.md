---
name: kitvue-plugin
description: Implement Vue 3 CMS screens, components, modals, bottomsheets, and responsive layouts from Figma MCP using @pegadaian/kitvue or kitvue-public components, --g-kit design tokens, and Bootstrap 5 utilities. Supports Bullion Bank CMS and other Pegadaian Vue projects. Use when the user asks to implement or revise a Figma design, match a Figma node, inspect design tokens and bound variables, reuse kitvue components, avoid custom components before checking the library, or convert Figma MCP output into Vue code for this style system.
---

# Kitvue Plugin

## Overview

Use this skill to turn Figma MCP designs into production-ready Vue 3 implementations aligned with `@pegadaian/kitvue` (or `kitvue-public`), official `--g-kit-*` design tokens, and Bootstrap 5.3.2 utilities. Always inspect Figma variables (`boundVariables`) and map color and typography directly to `--g-kit-*` tokens before writing CSS.

## Core Workflow

1. **Inspect Project Dependencies & Aliases**:
   - Check `package.json` to verify whether the library is installed as `@pegadaian/kitvue` or `kitvue-public`.
   - Identify existing component aliases in `src/components.ts`.
2. **Inspect Figma MCP**:
   - For a Figma URL or node ID, query design context, variable definitions (`boundVariables`), and capture a visual screenshot before coding.
3. **Map Color & Typography (Variable-First)**:
   - Map bound variables (`color/lime/50`, `black/80`, `omicron`, `normal`) directly to `--g-kit-*` CSS variables.
   - Respect official font weights: only `var(--g-kit-font-weight-normal)` (600) and `var(--g-kit-font-weight-bold)` (800).
4. **Spacing & Layout Resolution (Bootstrap 5 Utilities)**:
   - Use **Bootstrap 5.3.2 utility classes** (`p-1`–`p-5`, `mb-3`, `gap-3`, `d-flex`, `justify-content-*`) on template HTML.
   - **Do not generate non-existent CSS variables** such as `var(--g-kit-space-*)` or `var(--g-kit-radius-*)`.
   - For custom wrapper styles in scoped CSS, use explicit pixel values (`16px`, `24px`, `border-radius: 6px` for inputs, `border-radius: 8px` for cards).
5. **Enforce Component Reuse**:
   - Search the library's components (`src/components/`) and `src/components.ts` before creating any custom component.
   - Use official components: `GButton`, `GInputText`, `GDropdown`, `GAlert`, `GTablePagination`, `GBreadcrumb`, `GNavBackNavigator`, `GBerandaHeader`, `HeaderCMS`, `SideNavCMS`, `FilterCMS`, `TrackingStatus`, etc.
6. **Strict Iconography Policy**:
   - Prioritize official Pegadaian SVG icons from the library:
     - System Icons: `@pegadaian/kitvue/src/assets/icon/icon-system/`
     - Product Icons: `@pegadaian/kitvue/src/assets/icon/icon-product/`
     - Or use `LabelIcon.vue`.
   - If writing standalone SVG, use clean inline SVG with `fill="currentColor"`.
   - **Never** import or install unauthorized icon packages (e.g. `lucide-vue-next`, `@heroicons/vue`).
7. **Scoped CSS for Layout Wrappers Only**:
   - Use scoped CSS solely for page containers, responsive wrappers, and custom gaps. Do not override internal styles of kitvue components.
8. **Verify Responsive Behavior**:
   - Verify both desktop and mobile layouts. Ensure desktop tables convert to mobile card lists, and modals convert to bottomsheets (`BottomSheet/GOffCanvas.vue` or `ModalBottomSheet.vue`) with backdrop overlays.
9. **Check Domain Rules**:
   - If working on Bullion Bank CMS modules, consult `references/domain-bullion-bank.md` for transaction data schemas and mock data storage.
10. **Build & Type Check**:
    - Run `vue-tsc --noEmit` and the project build after making changes to verify TypeScript integrity.

## Figma MCP Inspection Guidelines

- **Design Context**: Use Figma MCP design context for hierarchy and structure hints.
- **Variable Definitions**: Query `boundVariables` (fills, strokes, textStyles) to recover official token bindings.
- **Visual Reference**: Use Figma screenshots as the visual ground truth. If screenshot and code hints conflict, prioritize the screenshot for visual layout and code hints for hierarchy.
- **Read-Only Operation**: Do not write changes back to Figma unless explicitly instructed by the user.

## Reference Files

Consult these reference files for deeper specifications:

- `references/frontend-implementation-rules.md`: Complete implementation rules, checklist, and Figma MCP inspection workflow.
- `references/kitvue-public-design-system.md`: Full token inventory (colors, Greek typography, input baselines, and complete 87+ component catalog).
- `references/domain-bullion-bank.md`: Domain-specific rules for Bullion Bank transactions, custody mock data, and project wrappers.
- `examples/canonical-screen.vue`: Production-ready canonical Vue 3 SFC reference template.

## Token Reference Essentials

Use CSS variables instead of hardcoded hex values:

- **Text Primary**: `var(--g-kit-black-80)`
- **Text Secondary**: `var(--g-kit-black-60)`
- **Placeholder / Tertiary**: `var(--g-kit-black-50)`
- **Border Disabled**: `var(--g-kit-black-40)`
- **Border Neutral**: `var(--g-kit-black-20)`
- **Background Light**: `var(--g-kit-black-10)` or `var(--g-kit-white)`
- **Primary / Success**: `var(--g-kit-lime-50)`
- **Primary Hover / Active**: `var(--g-kit-lime-60)` / `var(--g-kit-lime-80)`
- **Pending / Warning**: `var(--g-kit-orange-50)`
- **Failed / Danger**: `var(--g-kit-red-50)`
- **Info**: `var(--g-kit-blue-50)`
- **Gold Accent**: `var(--g-kit-gold-50)`

Official font weights:
- `var(--g-kit-font-weight-normal)` = `600`
- `var(--g-kit-font-weight-bold)` = `800`

*(Do not use undefined tokens like `--g-kit-font-weight-semibold` or `--g-kit-font-weight-extrabold`)*.

## Definition Of Done

An implementation is considered complete only when:
- Figma design context, bound variables, and screenshots have been inspected.
- All styles use `--g-kit-*` tokens without arbitrary hex values.
- Spacing uses Bootstrap 5 utilities or standard pixel values (zero fake `--g-kit-space-*` variables).
- Kitvue components have been prioritized over custom code.
- Clean inline SVG icons or official library icon assets are used (no foreign icon libraries).
- Mobile layout transitions (cards and bottomsheets) are tested and functional.
- `vue-tsc --noEmit` and project build succeed with zero errors.
