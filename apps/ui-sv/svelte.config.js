import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const root = "../../.."
const root2 = "../.."
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
        alias: {
            "@cmn/*": root2 + "/packages/common/src/*",
            "@repo/ui-sv/*": "src/*"
        },
        typescript: {
            config: (c)=>{
                return {...c,
                    exclude: [...c.exclude, root +"/packages/common/node_modules", root +"/node_modules", root +"/**/*.js", root +"/*.d.ts"],
                    include: [...c.include, root +"/packages/common/**/*.ts", root +"/node_modules/svelte/elements.d.ts", root + "/apps/ui/src"],
                    
                }
            }
        }
	},
    ssr: {
        noExternal: []
      }
}; 

export default config;
