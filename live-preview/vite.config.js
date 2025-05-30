import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 3000, // Ensure it runs on port 3000 to match nexadew-components expectation
  },
});