import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({ 
	server: { fs: { allow: ["../../../ui/src/styles/fonts"] } }, 
	plugins: [sveltekit()]
});
