// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

import colors from 'vuetify/util/colors'
import { VCard } from 'vuetify/components'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    aliases: {
      VMainCard: VCard,
    },
    defaults: {
      VMainCard: {
        variant: 'outlined',
      },
      VBtn: {
        variant: 'outlined',
      },
      VChip: {
        variant: 'outlined',
        readonly: true,
      },
      VChipGroup: {
        variant: 'outlined',
        readonly: true,
      },
      VAutocomplete: {
        variant: 'outlined',
      },
      VSelect: {
        variant: 'outlined',
      },
      VCombobox: {
        variant: 'outlined',
      },
      VTextField: {
        variant: 'outlined',
      },
      VTextarea: {
        variant: 'outlined',
      },
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

