import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


const root = "../.."
const root1 = root + "/.."
// apps/tstreamz/apps/root
const root2 = root + "/../.."
const root3 = root2 + "/.."


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
            "@/*": "src/*",
            "@repo/ui/*": root2 + "/apps/ui/src/*",
            "@pkg/cmn": root + "/packages/common/src/*"
        },
        typescript: {
            config: (c)=>{
                return {...c,
                    exclude: [...c.exclude, root3 + "/packages/common/node_modules", root3 + "/node_modules", root3 + "/**/*.js", root3 + "/*.d.ts"],
                    include: [...c.include, root3 + "/packages/common/**/*.ts", root1 + "/packages/common/**/*.ts",  root3 + "/node_modules/svelte/elements.d.ts"],
                    
                }
            }
        }
	},
    ssr: {
        noExternal: ['mongodb', "@mapbox/node-pre-gyp", 'engine.io-client']
      }
}; 

export default config;
