import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
name: "Tonni Diaz", age: 23,

        // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
        // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
        // See https://svelte.dev/docs/kit/adapters for more information about adapters.
        adapter: adapter(),
        vite: {
            optimizeDeps: {
                include: ["lodash.get", "lodash.isequal", "lodash.clonedeep"],
            
  },
        },
        custom: ()=>{
            console.log("\nHello Tu world\n")
            return {hello: 'tu world'}
        }
    },
};

export default config;
