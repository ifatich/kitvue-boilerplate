import { createApp } from 'vue'
import { createPinia } from 'pinia'
import BootstrapVueNext, { vBColorMode } from 'bootstrap-vue-next'
import App from './App.vue'
import router from './router'

// Kitvue standard styling & Pegadaian tokens
import 'kitvue-public/src/assets/scss/g-kit.scss'
import './assets/styles/tokens.css'

// Polyfill legacy webpack require() used in kitvue components
declare global {
  interface Window {
    require?: (path: string) => string
  }
}

if (typeof window.require === 'undefined') {
  window.require = (path: string) => path
}

const app = createApp(App)
app.directive('b-color-mode', vBColorMode)
app.use(
  BootstrapVueNext({
    plugins: {
      modalController: true,
      modalManager: true,
      breadcrumb: true,
    },
  }),
)
app.use(createPinia())
app.use(router)
app.mount('#app')
