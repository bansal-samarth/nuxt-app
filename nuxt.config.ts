// https://nuxt.com/docs/api/configuration/nuxt-config
// import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // Ensure PDFme works client-side
  build: {
    transpile: ['@pdfme/generator', '@pdfme/common']
  },
  
  // Optional: Add build optimizations for PDFme
  vite: {
    optimizeDeps: {
      include: ['@pdfme/generator', '@pdfme/common']
    }
  },

  modules: ['@nuxtjs/tailwindcss', '@nuxthub/core'],
})