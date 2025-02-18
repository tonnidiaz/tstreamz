import path, { dirname } from "path";

const getPkgPath = (pkg: string) => require.resolve(pkg + "/package.json").replace("package.json", "");
const paths = {
    "###repo/ui-nuxt/*": path.join(getPkgPath("@repo/ui-nuxt"), "src/*")
}

const paths2 = Object.values(paths).map(el=>(path.join("../", el, "/**/*.ts")))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: false },
    // alias: { "#cmn/*": "../../../packages/common/src/*", ...paths},
    
    vite: {
        // optimizeDeps: {
        //     include: ["@repo/common"],
        // },
    }, 
}); 
