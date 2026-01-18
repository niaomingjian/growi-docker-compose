import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['tools.lmmqxyx.online']
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: ['tools.lmmqxyx.online'],
  },
})