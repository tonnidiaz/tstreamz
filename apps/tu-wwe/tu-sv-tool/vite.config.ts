import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
    optimizeDeps: {
        include: ["lodash.get", "lodash.isequal", "lodash.clonedeep"],
    },
    ssr: {
        noExternal: ['@sveltejs/kit', 'svelte-carousel'],
      },
});
