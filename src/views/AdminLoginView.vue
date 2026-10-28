<script setup lang="ts">
/**
 * @file AdminLoginView.vue
 * @description Halaman Login Portal CMS Administrator Arrum Zada.
 * Mengikuti arsitektur, layout, dan styling 1:1 dari bullion-bank-cms.
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginHero from '@/components/modules/auth/login/LoginHero.vue'
import LoginForm from '@/components/modules/auth/login/LoginForm.vue'
import { isAdminAuthenticated } from '@/services/authService'

const router = useRouter()

onMounted(() => {
  if (isAdminAuthenticated()) {
    router.replace('/admin')
  }
})
</script>

<template>
  <div class="login-page">
    <section class="left-side">
      <LoginHero />
    </section>

    <section class="right-side">
      <LoginForm />
    </section>

    <footer>Copyright © 2026 PT Pegadaian. All Rights Reserved</footer>
  </div>
</template>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100svh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 592px;
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

.left-side {
  display: flex;
  min-width: 0;
}

.right-side {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
}

footer {
  position: absolute;
  right: 174px;
  bottom: 24px;
  color: var(--g-kit-white);
  font-size: var(--g-kit-font-size-omega);
  font-weight: var(--g-kit-font-weight-normal);
  line-height: var(--g-kit-line-height-omega);
}

@media (max-width: 1200px) {
  .login-page {
    grid-template-columns: 1fr;
    padding: 32px 24px 56px;
    overflow: auto;
  }

  .left-side {
    display: none;
  }

  .right-side {
    min-height: calc(100svh - 88px);
    align-items: center;
    justify-content: center;
  }

  footer {
    right: 50%;
    bottom: 20px;
    width: max-content;
    transform: translateX(50%);
  }
}

@media (max-width: 768px) {
  .login-page {
    display: flex;
    flex-direction: column;
    padding: 20px 16px;
  }

  footer {
    position: static;
    width: calc(100% - 32px);
    margin: 20px auto 0;
    text-align: center;
    transform: none;
  }
}
</style>
