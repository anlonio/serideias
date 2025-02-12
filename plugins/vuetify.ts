// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

import colors from 'vuetify/util/colors'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    locale: {
      locale: 'pt-BR',
    },
    ssr: true,
    theme: {
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: colors.deepOrange.base,
            secondary: colors.amber.base,
          },
        },
        light: {
          dark: false,
          colors: {
            primary: colors.orange.base,
            secondary: colors.brown.base,
          },
        },
      },
    },
  })
  app.vueApp.use(vuetify)
})

