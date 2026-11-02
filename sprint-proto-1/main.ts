import { createApp } from 'vue'
import 'kitvue-public/src/assets/scss/g-kit.scss'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
