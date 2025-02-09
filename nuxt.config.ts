// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-11-17",
  build: {
    transpile: ['vuetify'],
  },
  imports: {
    dirs: ['stores', '@types'],
    presets: [
      { 
        from: 'zod',
        imports: ['z']
      }
    ]
  },
  modules: [
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    'nuxt-zod-i18n',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/color-mode',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error plugins is possibly undefined
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
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
  i18n: {
    defaultLocale: 'pt-BR',
    locales: [{code: 'pt-BR', file: 'pt-BR.json'}],
    lazy: true
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/register' , '/api/*']
    }
  }
})
