<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pegadaianBuilding from '@/assets/images/sprint/pegadaian-building.webp'
import pegadaianBuildingShadow from '@/assets/images/sprint/pegadaian-building-shadow.svg'
import LoginForm from '@/components/modules/auth/login/LoginForm.vue'
import { isAdminAuthenticated } from '@/services/authService'

const router = useRouter()
const route = useRoute()
const loginForm = ref<{ selectDemoUser: (email: string) => void } | null>(null)

const demoUsers = [
  { role: 'Kasir', email: 'kasir@pegadaian.co.id' },
  { role: 'Penaksir', email: 'penaksir@pegadaian.co.id' },
  { role: 'Pinca', email: 'pinca@pegadaian.co.id' },
]

function selectDemoUser(email: string) {
  loginForm.value?.selectDemoUser(email)
}

onMounted(() => {
  if (isAdminAuthenticated() && route.query.roleSelection !== 'true') {
    const redirect = route.query.redirect
    router.replace(typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/beranda')
  }
})
</script>

<template>
  <div class="login-page">
    <div class="building-art" aria-hidden="true">
      <img class="building-shadow" :src="pegadaianBuildingShadow" alt="" />
      <img class="building-image" :src="pegadaianBuilding" alt="" />
    </div>

    <section class="right-side">
      <LoginForm ref="loginForm" />
    </section>

    <aside class="demo-price-panel" aria-label="Harga tabungan emas dan akun demo">
      <div class="demo-market">
        <div class="gold-heading">
          <strong>Harga Tabungan Emas</strong>
          <span>10 Januari 2024</span>
        </div>
        <span class="market-divider" aria-hidden="true" />
        <div class="gold-prices">
          <div class="gold-price">
            <span>Harga Beli <span class="price-indicator price-indicator--up" aria-hidden="true">⌃</span></span>
            <strong>Rp 9.150 <small>/ 0,01 gr</small></strong>
          </div>
          <div class="gold-price">
            <span>Harga Jual <span class="price-indicator price-indicator--down" aria-hidden="true">⌄</span></span>
            <strong>Rp 8.648 <small>/ 0,01 gr</small></strong>
          </div>
        </div>
      </div>

      <span class="panel-divider" aria-hidden="true" />

      <div class="demo-users" role="group" aria-label="Pilih akun demo">
        <button
          v-for="(user, index) in demoUsers"
          :key="user.email"
          class="demo-user"
          :class="{ 'demo-user--first': index === 0 }"
          type="button"
          :aria-label="`Gunakan akun demo ${user.role}: ${user.email}`"
          @click="selectDemoUser(user.email)"
        >
          <template v-if="index === 0">
            <strong>Demo User</strong>
            <span>{{ user.email }}</span>
          </template>
          <span v-else>{{ user.email }}</span>
        </button>
      </div>
    </aside>

    <footer>Copyright © 2026 PT Pegadaian. All Rights Reserved</footer>
  </div>
</template>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100svh;
  display: block;
  background:
    linear-gradient(90deg, rgba(0, 39, 32, 0.72) 0%, rgba(0, 52, 41, 0.34) 100%),
    url('@/assets/images/auth-bg.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 46px 50px 24px 80px;
  position: relative;
  overflow: hidden;
}

.building-art {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.building-shadow {
  position: absolute;
  top: 0.21%;
  left: 7.66%;
  width: 38.82%;
  height: 119%;
  max-width: none;
}

.building-image {
  position: absolute;
  top: 3%;
  left: -33%;
  width: 120%;
  height: 139%;
  max-width: none;
}

.right-side {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: min(
    calc(50% + 24.6vw),
    calc(100% - 230px)
  );
  display: flex;
  width: min(422px, calc(100% - 32px));
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%) scale(clamp(0.711, calc(100vw / 1600px), 1.125));
}

footer {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: 24px;
  width: max-content;
  transform: translateX(-50%);
  color: var(--g-kit-white);
  font-size: var(--g-kit-font-size-omega);
  font-weight: var(--g-kit-font-weight-normal);
  line-height: var(--g-kit-line-height-omega);
}

.demo-price-panel {
  position: absolute;
  z-index: 1;
  top: 77%;
  left: 13.1%;
  display: grid;
  width: 632px;
  gap: 8px;
  padding: 8px 22px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(18px);
  backdrop-filter: blur(18px);
  color: var(--g-kit-black-80, #252528);
  transform: translateY(-50%) scale(calc(100vw / 1600px));
  transform-origin: left center;
}

.demo-market {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 238px) minmax(0, 1fr);
  align-items: center;
  gap: 24px;
}

.gold-heading,
.gold-price {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.gold-heading {
  gap: 2px;
}

.gold-heading strong {
  font-size: 20px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 30px;
  white-space: nowrap;
}

.gold-heading > span,
.gold-price > span {
  font-size: 14px;
  line-height: 20px;
}

.gold-prices {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.gold-price {
  gap: 2px;
}

.gold-price > span {
  white-space: nowrap;
}

.gold-price strong {
  font-size: 18px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 26px;
  white-space: nowrap;
}

.gold-price small {
  color: var(--g-kit-black-60, #58585b);
  font-size: 12px;
  font-weight: var(--g-kit-font-weight-normal, 600);
}

.price-indicator {
  display: inline-grid;
  width: 16px;
  height: 16px;
  place-items: center;
  border-radius: 50%;
  color: var(--g-kit-white, #ffffff);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 16px;
  vertical-align: -2px;
}

.price-indicator--up {
  background: var(--g-kit-lime-50, #00ab4e);
}

.price-indicator--down {
  background: var(--g-kit-red-40, #d44c50);
}

.market-divider,
.panel-divider {
  display: block;
  background: rgba(255, 255, 255, 0.9);
}

.market-divider {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 238px;
  width: 1px;
}

.panel-divider {
  width: 100%;
  height: 1px;
}

.demo-users {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
}

.demo-user {
  display: flex;
  min-width: 0;
  min-height: 50px;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 0 8px;
  border: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.9);
  background: transparent;
  color: var(--g-kit-black-80, #252528);
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.demo-user:first-child {
  border-left: 0;
  padding-left: 0;
}

.demo-user strong {
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 20px;
}

.demo-user span {
  overflow-wrap: anywhere;
  font-size: 12px;
  line-height: 18px;
}

.demo-user:hover span,
.demo-user:focus-visible span {
  text-decoration: underline;
}

.demo-user:focus-visible {
  outline: 2px solid var(--g-kit-lime-60, #00883e);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .login-page {
    display: flex;
    flex-direction: column;
    padding: 20px 16px;
    overflow: auto;
  }

  .building-art { display: none; }
  .right-side {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    min-height: calc(100svh - 88px);
    transform: none;
  }

  .demo-price-panel {
    position: relative;
    top: auto;
    bottom: auto;
    left: auto;
    width: min(100%, 632px);
    margin: 20px auto 0;
    transform: none;
  }

  footer { bottom: 20px; }
  .demo-market { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .market-divider { display: none; }
  .gold-prices { gap: 12px; }
  .gold-heading strong { font-size: 18px; }
  .gold-price strong { font-size: 16px; }
  .demo-user { padding: 0 6px; }
  .demo-user span { font-size: 10px; }
  footer { position: static; width: calc(100% - 32px); margin: 20px auto 0; text-align: center; transform: none; }
}

@media (max-width: 480px) {
  .demo-price-panel { padding: 12px; }
  .demo-users { grid-template-columns: minmax(0, 1fr); }
  .demo-user,
  .demo-user:first-child {
    min-height: 0;
    padding: 8px 0;
    border-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.9);
  }
  .demo-user:first-child { border-top: 0; }
}
</style>
