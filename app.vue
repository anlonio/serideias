<template>
  <NuxtLayout>
    <VApp>
      <VAppBar color="primary">
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>
        <VAppBarTitle>{{ $route.meta.title }}</VAppBarTitle>
        <template v-slot:append>
          <v-btn icon="mdi-magnify"></v-btn>
          <v-btn icon="mdi-theme-light-dark" @click="toggleTheme"></v-btn>
          <v-btn icon="mdi-dots-vertical"></v-btn>
        </template>
      </VAppBar>
      <NuxtPage />
    </VApp>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

const theme = useTheme()
const mode = useColorMode()

onMounted(() => {
  if (!mode.unknown) {
    theme.global.name.value = mode.value
  }
})

watchEffect(() => {
  if (!mode.unknown) {
    theme.global.name.value = mode.value
  }
})

function toggleTheme() {
  mode.preference = mode.value === 'dark' ? 'light' : 'dark'
}
</script>

