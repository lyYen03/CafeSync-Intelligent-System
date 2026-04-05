import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cấu hình Port 3001 cho trang khách hàng của Yến
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: true,
  }
})