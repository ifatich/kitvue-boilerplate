<script setup lang="ts">
import { ref } from 'vue'
import BaseCard from '@/components/shared/card/Card.vue'
import { GButton, GInputText } from '@/components'
import { useAppAlert } from '@/hooks/useAppAlert'
import { useLogin } from '@/hooks/useLogin'
import LoginHeader from './LoginHeader.vue'

const { username, password, loading, login } = useLogin()
const { showAlert } = useAppAlert()
const showPassword = ref(false)

function selectDemoUser(email: string) {
  username.value = email
}

function showPasswordHelp() {
  showAlert({
    label: 'Fitur lupa password belum tersedia untuk akun demo.',
    variant: 'info',
  })
}

defineExpose({ selectDemoUser })
</script>

<template>
  <BaseCard class="login-card">
    <div class="login-card-inner">
      <LoginHeader />

      <form class="login-form" @submit.prevent="login">
        <div class="fields">
          <GInputText
            id="login-username"
            v-model="username"
            name="username"
            label="Username"
            placeholder="Username HCMS / Aralia"
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

          <div class="password-field">
            <GInputText
              id="login-password"
              v-model="password"
              name="password"
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
                      d="M2 12C4.5 8 8 6 12 6s7.5 2 10 6c-2.5 4-6 6-10 6s-7.5-2-10-6Z"
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

            <button class="forgot-password" type="button" @click="showPasswordHelp">
              Lupa Password?
            </button>
          </div>
        </div>

        <GButton
          class="login-action"
          :loading="loading"
          :icon="false"
          label="Masuk"
          size="md"
          type="primary"
        />
      </form>
    </div>
  </BaseCard>
</template>

<style scoped>
.login-card {
  width: 100%;
  max-width: 422px;
  min-height: 510px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: none;
}

.login-card-inner {
  width: 100%;
  margin: 0 auto;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.fields {
  display: grid;
  gap: 16px;
  margin-bottom: 16px;
}

.password-field {
  display: grid;
  gap: 8px;
}

.forgot-password {
  justify-self: end;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--g-kit-lime-50, #00ab4e);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 18px;
}

.forgot-password:focus-visible {
  outline: 2px solid var(--g-kit-lime-50, #00ab4e);
  outline-offset: 2px;
}

.login-action {
  width: 100%;
}

.field-icon {
  display: inline-flex;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: var(--g-kit-black-60, #58585b);
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
  .login-card {
    min-height: 0;
  }
}

@media (max-width: 420px) {
  .login-card {
    padding: 20px 16px;
  }
}
</style>
