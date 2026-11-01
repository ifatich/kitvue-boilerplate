import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: process.env.VITE_POS_BASE_PATH || '/',
  plugins: [vue()],
  server: {
    port: 5175,
    strictPort: true,
  },
})
