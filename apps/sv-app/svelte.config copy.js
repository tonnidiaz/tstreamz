import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const uiPath1 = "../ui/src";
const uiPath2 = "../../ui/src";

/** @type {import('@sveltejs/kit').Config} */
const config = 
{
    // Consult https://svelte.dev/docs/kit/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
        // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
        // See https://svelte.dev/docs/kit/adapters for more information about adapters.
        adapter: adapter(),
        
    },
    ssr: {
        noExternal: ["mongodb", "@mapbox/node-pre-gyp", "engine.io-client"],
    },
};
console.log(JSON.stringify(config));
export default config;
