// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-11-17",
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/color-mode',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  pwa: {
    /* PWA options */

  },
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storage: 'cookie', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode'
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
