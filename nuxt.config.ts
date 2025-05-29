// https://nuxt.com/docs/api/configuration/nuxt-config
// import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: ['nuxt-posthog', '@nuxtjs/tailwindcss', '@nuxthub/core', 'nuxt-gtag'],

  gtag: {
    id: 'GTM-T947JWMX'
  },
  
  posthog: {
    capturePageViews: true,
    capturePageLeaves: true,
    proxy: false
  },
})