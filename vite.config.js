import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves this repository beneath /BiteCraft/.
export default defineConfig({
  base: '/BiteCraft/',
  plugins: [react()],
})
