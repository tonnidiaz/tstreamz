import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const allowedDirs  = [
    "tauri-app", "ui", "ui-next", "common"
]
// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), tailwindcss(), tsconfigPaths({skip(dir) {
    return false//!allowedDirs.includes(dir)
  },ignoreConfigErrors: true}) as any],
}));
