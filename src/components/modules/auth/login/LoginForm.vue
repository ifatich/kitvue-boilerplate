<script setup lang="ts">
import { ref } from 'vue'

import BaseCard from '@/components/shared/card/Card.vue'
import { GButton, GInputText } from '@/components'
import LoginHeader from './LoginHeader.vue'

import { useLogin } from '@/hooks/useLogin'

const { username, password, loading, login, quickLogin } = useLogin()
const showPassword = ref(false)
</script>

<template>
  <BaseCard class="login-card">
    <div class="login-card-inner">
      <LoginHeader title="Portal Admin Starter" subtitle="Kitvue UI - Pegadaian & Bullion" />

      <form class="login-form" @submit.prevent="login">
        <div class="fields">
          <GInputText
            id="login-username"
            name="username"
            v-model="username"
            label="Username / Email"
            placeholder="admin@pegadaian.co.id"
            autocomplete="username"
          >
            <template #prefix>
              <span class="field-icon field-icon-prefix" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </template>
          </GInputText>

          <GInputText
            id="login-password"
            name="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            placeholder="Password"
            autocomplete="current-password"
          >
            <template #prefix>
              <span class="field-icon field-icon-prefix" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
            </template>

            <template #suffix>
              <button
                class="field-icon field-icon-button"
                type="button"
                :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                @click="showPassword = !showPassword"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" />
                </svg>
              </button>
            </template>
          </GInputText>
        </div>

        <div class="action-buttons">
          <GButton
            class="login-action"
            :loading="loading"
            :icon="false"
            label="Masuk (Simulasi)"
            size="md"
            type="primary"
          />

          <button
            type="button"
            class="btn-quick-login"
            @click="quickLogin"
          >
            ⚡ Masuk Cepat (1-Click Test)
          </button>
        </div>
      </form>
    </div>
  </BaseCard>
</template>

<style scoped>
.login-card {
  width: 100%;
  max-width: 542px;
  min-height: 716px;
  padding: 95px 0;
  border-radius: 10px;
  box-shadow: none;
}

.login-card-inner {
  width: 372px;
  margin: 0 auto;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.fields {
  display: grid;
  gap: 24px;
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-action {
  width: 100%;
}

.btn-quick-login {
  width: 100%;
  padding: 10px 16px;
  background: #f1f5f9;
  border: 1px dashed #94a3b8;
  border-radius: 8px;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-quick-login:hover {
  background: #e2e8f0;
  border-color: #64748b;
  color: #0f172a;
}

.field-icon {
  display: inline-flex;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  color: var(--g-kit-black-60);
  flex: 0 0 auto;
}

.field-icon svg {
  width: 20px;
  height: 20px;
}

.field-icon-prefix {
  margin-left: 14px;
}

.field-icon-button {
  margin-right: 14px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

@media (max-width: 768px) {
  .login-card-inner {
    width: min(372px, calc(100vw - 64px));
  }

  .login-card {
    min-height: auto;
    padding: 48px 0;
  }
}

@media (max-width: 420px) {
  .login-card-inner {
    width: calc(100vw - 48px);
  }
}
</style>
