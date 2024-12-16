import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const root2 = "../.."
const root = root2 + "/.." 
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
    
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
        alias: {
            "@/*": "src/*",
            "@repo/ui/*": root2 + "/apps/ui/src/*",
            "@cmn/*": root2 + "/packages/common/src/*",
        },
        typescript: {
            config: (c)=>{
                return {...c,
                    exclude: [...c.exclude, root +"/packages/common/node_modules", root +"/node_modules", root +"/**/*.js", root +"/*.d.ts", "../.svelte-kit"],
                    include: [...c.include, root +"/packages/common/**/*.ts", root +"/node_modules/svelte/elements.d.ts", root + "/apps/ui/src", '../rf/**/*.ts'],
                    
                }
            }
        }
	}
};

export default config;
