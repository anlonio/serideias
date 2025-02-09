<template>
  <VResponsive>
    <VApp>
      <VAppBar>
        <template #prepend>
          <v-app-bar-nav-icon />
        </template>
        <VAppBarTitle>{{ $route.meta.title }}</VAppBarTitle>
        <template #append>
          <v-btn icon="mdi-magnify" />
          <v-btn icon="mdi-theme-light-dark" @click="toggleTheme" />
          <VBtn v-if="isAnon" variant="outlined" color="info" to="/login"
            >fazer login</VBtn
          >
          <v-btn icon="mdi-dots-vertical" />
        </template>
      </VAppBar>
      <slot />
      <VFooter app>
        <VRow>{{ $vuetify.display.name }}</VRow>
      </VFooter>
    </VApp>
  </VResponsive>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

const { isAnon } = useAuthStore()

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

<style></style>

