// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    alias: { "#cmn/*": "../../../packages/common/src/*" },
    typescript: {
        tsConfig: (c: any) => {
            return {
                ...c,
                include: ["../../../../packages/common/src/**/*.ts"],
            };
        },
    },
    vite: {
        // optimizeDeps: {
        //     include: ["@repo/common"],
        // },
    },
}); 
