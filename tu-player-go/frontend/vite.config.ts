import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias: {
        "@repo/ui-next/*": "../../../apps/ui-next/src/*"
    }
  }
})
