import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/FigmaVibeCoding/' : '/',
  plugins: [tailwindcss(), react()],
  server: {
    port: 5175,
    strictPort: true,
  },
}))
