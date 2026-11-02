<script setup lang="ts">
import { useRouter } from 'vue-router'

interface EntryPoint {
  number: string
  title: string
  description: string
  path: string
}

const router = useRouter()

const publicEntryPoints: EntryPoint[] = [
  {
    number: '01',
    title: 'Beranda',
    description: 'Halaman utama aplikasi saat ini.',
    path: '/beranda',
  },
  {
    number: '02',
    title: 'Gadai 1 Page',
    description: 'Prototype alur pengajuan gadai.',
    path: '/gadai-1-page',
  },
  {
    number: '03',
    title: 'POS',
    description: 'Dashboard dan alur Point of Sale.',
    path: '/pos',
  },
]

const sprintEntryPoints: EntryPoint[] = [
  {
    number: '04',
    title: 'SPRINT Prototype 1',
    description: 'Prototype CMS Kasir.',
    path: '/sprint-proto-1',
  },
  {
    number: '05',
    title: 'SPRINT Prototype 2',
    description: 'Service Launcher dengan navigasi sesuai role.',
    path: '/sprint-proto-2',
  },
  {
    number: '06',
    title: 'SPRINT Existing',
    description: 'Prototype SPRINT yang sudah ada.',
    path: '/sprint-existing',
  },
]

const sprintRoles = ['Kasir', 'Pinca', 'Penaksir']

function openEntryPoint(entry: EntryPoint, requiresRoleLogin = false) {
  if (requiresRoleLogin) {
    void router.push({
      name: 'admin-login',
      query: {
        redirect: entry.path,
        roleSelection: 'true',
      },
    })
    return
  }

  void router.push(entry.path)
}
</script>

<template>
  <main class="entry-point-page">
    <div class="entry-point-container">
      <header class="entry-point-header">
        <div class="entry-point-brand">
          <span class="brand-mark" aria-hidden="true">K</span>
          <span>Kitvue <span class="brand-divider">/</span> Demo Apps</span>
        </div>

        <div class="hero-copy">
          <p class="entry-point-eyebrow">PUSAT AKSES</p>
          <h1>Mulai dari mana hari ini?</h1>
          <p class="entry-point-intro">
            Pilih aplikasi yang ingin dibuka. Informasi login dan role tersedia
            langsung di setiap pilihan.
          </p>
        </div>

        <aside class="access-summary" aria-label="Ringkasan kebutuhan login">
          <div class="summary-item">
            <span class="summary-dot summary-dot--public" aria-hidden="true" />
            <span><strong>3 aplikasi</strong> tanpa login</span>
          </div>
          <div class="summary-item">
            <span class="summary-dot summary-dot--login" aria-hidden="true" />
            <span><strong>3 prototype SPRINT</strong> dengan login role</span>
          </div>
        </aside>
      </header>

      <section class="entry-group" aria-labelledby="public-heading">
        <div class="group-heading">
          <div>
            <div class="group-title-row">
              <span class="group-indicator group-indicator--public" aria-hidden="true" />
              <h2 id="public-heading">Bisa langsung dibuka</h2>
            </div>
            <p>Tidak perlu login untuk mengakses aplikasi ini.</p>
          </div>
          <span class="group-count">3 aplikasi</span>
        </div>

        <div class="entry-grid">
          <button
            v-for="entry in publicEntryPoints"
            :key="entry.number"
            class="entry-card"
            type="button"
            @click="openEntryPoint(entry)"
          >
            <span class="entry-card-top">
              <span class="entry-number">{{ entry.number }}</span>
              <span class="access-badge access-badge--public">Tanpa login</span>
            </span>
            <span class="entry-card-copy">
              <strong>{{ entry.title }}</strong>
              <span>{{ entry.description }}</span>
            </span>
            <span class="entry-card-action">
              Buka aplikasi <span aria-hidden="true">→</span>
            </span>
          </button>
        </div>
      </section>

      <section class="entry-group entry-group--sprint" aria-labelledby="sprint-heading">
        <div class="group-heading">
          <div>
            <div class="group-title-row">
              <span class="group-indicator group-indicator--login" aria-hidden="true" />
              <h2 id="sprint-heading">Prototype SPRINT</h2>
            </div>
            <p>Login diperlukan untuk menentukan role sebelum masuk.</p>
          </div>
          <span class="group-count">3 prototype</span>
        </div>

        <div class="role-availability" aria-label="Role yang tersedia">
          <span class="role-availability-label">Role tersedia</span>
          <span v-for="role in sprintRoles" :key="role" class="role-chip">{{ role }}</span>
        </div>

        <div class="entry-grid">
          <button
            v-for="entry in sprintEntryPoints"
            :key="entry.number"
            class="entry-card entry-card--sprint"
            type="button"
            @click="openEntryPoint(entry, true)"
          >
            <span class="entry-card-top">
              <span class="entry-number">{{ entry.number }}</span>
              <span class="access-badge access-badge--login">Login diperlukan</span>
            </span>
            <span class="entry-card-copy">
              <strong>{{ entry.title }}</strong>
              <span>{{ entry.description }}</span>
            </span>
            <span class="entry-card-action">
              Pilih role &amp; masuk <span aria-hidden="true">→</span>
            </span>
          </button>
        </div>
      </section>

      <footer class="entry-point-footer">
        Role dipilih melalui halaman login sebelum membuka prototype SPRINT.
      </footer>
    </div>
  </main>
</template>

<style scoped>
.entry-point-page {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 48px 24px 40px;
  background:
    radial-gradient(ellipse at 12% 0%, rgba(0, 171, 78, 0.1), transparent 34%),
    var(--g-kit-black-10, #f8f8f8);
  color: var(--g-kit-black-80, #252528);
  font-family: var(--g-kit-font-family, 'Nunito Sans', sans-serif);
}

.entry-point-container {
  width: min(100%, 1040px);
  margin: 0 auto;
}

.entry-point-header {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 24px;
  padding: 0 0 32px;
  border-bottom: 1px solid var(--g-kit-black-20, #eeeeef);
}

.entry-point-brand {
  display: flex;
  grid-column: 1 / -1;
  align-items: center;
  gap: 10px;
  color: var(--g-kit-black-60, #58585b);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
}

.brand-mark {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 9px;
  background: var(--g-kit-lime-50, #00ab4e);
  color: var(--g-kit-white, #ffffff);
  font-size: 16px;
}

.brand-divider {
  margin: 0 4px;
  color: var(--g-kit-black-40, #bbbdc0);
}

.hero-copy {
  min-width: 0;
}

.entry-point-eyebrow {
  margin: 0 0 8px;
  color: var(--g-kit-lime-60, #00883e);
  font-size: 12px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  letter-spacing: 0.1em;
}

.hero-copy h1 {
  margin: 0 0 8px;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: var(--g-kit-font-weight-bold, 800);
  letter-spacing: -0.035em;
  line-height: 1.15;
}

.entry-point-intro {
  max-width: 600px;
  margin: 0;
  color: var(--g-kit-black-60, #58585b);
  font-size: 16px;
  line-height: 24px;
}

.access-summary {
  display: grid;
  min-width: 248px;
  gap: 12px;
  padding: 16px 18px;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 10px;
  background: var(--g-kit-white, #ffffff);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--g-kit-black-60, #58585b);
  font-size: 13px;
}

.summary-item strong {
  color: var(--g-kit-black-80, #252528);
  font-weight: var(--g-kit-font-weight-bold, 800);
}

.summary-dot,
.group-indicator {
  width: 9px;
  height: 9px;
  flex: 0 0 auto;
  border-radius: 50%;
}

.summary-dot--public,
.group-indicator--public {
  background: var(--g-kit-lime-50, #00ab4e);
}

.summary-dot--login,
.group-indicator--login {
  background: var(--g-kit-orange-50, #e07e26);
}

.entry-group {
  margin-top: 30px;
}

.group-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.group-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-heading h2 {
  margin: 0;
  font-size: 20px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 28px;
}

.group-heading p {
  margin: 4px 0 0 19px;
  color: var(--g-kit-black-60, #58585b);
  font-size: 14px;
  line-height: 20px;
}

.group-count {
  flex: 0 0 auto;
  color: var(--g-kit-black-50, #939597);
  font-size: 13px;
  font-weight: var(--g-kit-font-weight-bold, 800);
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.entry-card {
  display: flex;
  min-width: 0;
  min-height: 188px;
  flex-direction: column;
  align-items: stretch;
  gap: 18px;
  padding: 18px;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 10px;
  background: var(--g-kit-white, #ffffff);
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.entry-card:hover {
  transform: translateY(-2px);
  border-color: var(--g-kit-lime-50, #00ab4e);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
}

.entry-card--sprint:hover {
  border-color: var(--g-kit-orange-50, #e07e26);
}

.entry-card:focus-visible {
  outline: 3px solid rgba(0, 171, 78, 0.28);
  outline-offset: 3px;
}

.entry-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.entry-number {
  color: var(--g-kit-black-40, #bbbdc0);
  font-size: 13px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  letter-spacing: 0.04em;
}

.access-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 20px;
  padding: 5px 9px;
  font-size: 11px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 16px;
  white-space: nowrap;
}

.access-badge--public {
  background: rgba(0, 171, 78, 0.1);
  color: var(--g-kit-lime-60, #00883e);
}

.access-badge--login {
  background: rgba(224, 126, 38, 0.12);
  color: var(--g-kit-orange-50, #e07e26);
}

.entry-card-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
}

.entry-card-copy strong {
  font-size: 16px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 22px;
}

.entry-card-copy > span {
  color: var(--g-kit-black-60, #58585b);
  font-size: 13px;
  line-height: 19px;
}

.entry-card-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--g-kit-black-20, #eeeeef);
  color: var(--g-kit-lime-60, #00883e);
  font-size: 13px;
  font-weight: var(--g-kit-font-weight-bold, 800);
}

.entry-card--sprint .entry-card-action {
  color: var(--g-kit-black-80, #252528);
}

.entry-card-action span {
  color: var(--g-kit-lime-50, #00ab4e);
  font-size: 18px;
  transition: transform 160ms ease;
}

.entry-card:hover .entry-card-action span {
  transform: translateX(3px);
}

.role-availability {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: -2px 0 14px;
}

.role-availability-label {
  margin-right: 2px;
  color: var(--g-kit-black-60, #58585b);
  font-size: 13px;
}

.role-chip {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 4px 10px;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 20px;
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-black-80, #252528);
  font-size: 12px;
  font-weight: var(--g-kit-font-weight-bold, 800);
}

.entry-point-footer {
  margin-top: 28px;
  color: var(--g-kit-black-50, #939597);
  font-size: 12px;
  line-height: 18px;
  text-align: center;
}

@media (max-width: 800px) {
  .entry-point-header {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
  }

  .entry-point-brand {
    grid-column: auto;
  }

  .access-summary {
    min-width: 0;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .entry-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .entry-point-page {
    padding: 24px 16px 32px;
  }

  .entry-point-header {
    gap: 20px;
    padding-bottom: 24px;
  }

  .access-summary {
    grid-template-columns: minmax(0, 1fr);
  }

  .entry-group {
    margin-top: 24px;
  }

  .group-heading {
    align-items: flex-start;
  }

  .group-heading h2 {
    font-size: 18px;
  }

  .group-count {
    padding-top: 5px;
    font-size: 11px;
  }

  .entry-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  .entry-card {
    min-height: 158px;
    gap: 14px;
    padding: 16px;
  }
}
</style>
