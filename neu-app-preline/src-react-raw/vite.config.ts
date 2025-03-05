import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tsconfigPaths from 'vite-tsconfig-paths'
console.log(path.resolve("../../ui-next/src/") );
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths({ignoreConfigErrors: true})],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@mobile/ui-next": path.resolve("../../ui-next/src/") 
    },
  },
})
