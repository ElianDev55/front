import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    define: {
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL),
      __WOMPI_API_BASE_URL__: JSON.stringify(env.VITE_WOMPI_API_BASE_URL),
      __WOMPI_PUBLIC_KEY__: JSON.stringify(env.VITE_WOMPI_PUBLIC_KEY),
    },
    plugins: [react(), tailwindcss()],
  }
})
