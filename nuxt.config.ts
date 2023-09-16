// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ["@pinia/nuxt", 'nuxt-simple-sitemap'],
    image: {domains: ['image.tmdb.org']},
  devtools: { enabled: false },
  routeRules: {
    // Don't add any /secret/** URLs to the sitemap.xml
    '/rf': { index: false },
    '/me/**': { index: false },
  },
  site: {
    url: "https://tstreamz.vercel.app"
  }

 
})
    