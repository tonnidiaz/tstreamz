import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	,

    alias: {"@cmn/*":"../../packages/common/src","@repo/ui/*":"../ui/src","@/*":"src/*"},
    typescript: {
        config: (c) => {
            return {
                ...c,

                include: [
                    ...c.include,
                    "**/*.ts",
                    "../../../node_modules/svelte/elements.d.ts",
                    "../../../packages/common/src", "../../ui/src",
                    ""
                ],
                exclude: [
                    ...c.exclude,
                    "../../../**/*.js",
                    "../../../node_modules",
                    "../../../**/**.spec.ts",
                    "../../../**/**.js",
                ],
            };
        },
    },
}
};

export default config;
