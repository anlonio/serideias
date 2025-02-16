<template>
  <VResponsive>
    <VApp>
      <VNavigationDrawer
        v-model:rail="railToggle"
        v-model="drawerToggle"
        :expand-on-hover="expandOnHoverActive"
        mobile-breakpoint="lg"
      >
        <VList>
          <VListItem
            v-if="profile"
            :subtitle="`@${profile.username}`"
            :title="profile.full_name"
            @click="$router.push('/posts/my-posts')"
          >
            <template #prepend>
              <VAvatar v-if="profile.avatar_url" :image="profile.avatar_url" />
              <VAvatar v-else image="/public/account-circle.png" />
            </template>
          </VListItem>
          <VListItem
            v-else
            title="Fazer Login"
            to="/login"
            prepend-icon="mdi-account-circle"
          />
          <VDivider />
          <VList>
            <VListItem to="/" title="Início" prepend-icon="mdi-home" />
            <VListItem
              to="/posts/new"
              title="Novo Post"
              prepend-icon="mdi-plus-box"
            />
            <VListItem
              to="/posts/city"
              title="Resumo por cidade"
              prepend-icon="mdi-folder-marker"
            />
            <VListItem
              to="/posts/my-posts"
              title="Meus posts"
              prepend-icon="mdi-folder-account"
            />
            <VListItem
              to="/profile/edit"
              title="Editar Perfil"
              prepend-icon="mdi-account-cog"
            />
            <VListItem
              v-if="profile"
              title="Sair"
              prepend-icon="mdi-logout"
              @click="signOut"
            />
          </VList>
        </VList>
      </VNavigationDrawer>
      <VAppBar flat border density="comfortable">
        <template #prepend>
          <v-app-bar-nav-icon @click="setNavigationDrawer" />
        </template>
        <VAppBarTitle v-if="$vuetify.display.smAndUp">Serideias</VAppBarTitle>
        <slot name="toolbar-default" />
        <template #append>
          <slot name="toolbar-append" />
          <VBtn v-if="isAnon" color="info" to="/login">fazer login</VBtn>
        </template>
      </VAppBar>
      <slot />
    </VApp>
  </VResponsive>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const authStore = useAuthStore()
const { isAnon, profile } = storeToRefs(authStore)

const railToggle = ref(true)
const drawerToggle = ref(false)
const expandOnHoverActive = ref(true)

const display = useDisplay()

watch(
  display.mdAndDown,
  (value) => {
    expandOnHoverActive.value = !value
    railToggle.value = !value
    drawerToggle.value = !value
  },
  {
    immediate: true,
  },
)

const setNavigationDrawer = () => {
  if (display.mdAndDown.value) {
    drawerToggle.value = !drawerToggle.value
    return
  }
  expandOnHoverActive.value = !expandOnHoverActive.value
  railToggle.value = !railToggle.value
  drawerToggle.value = true
}

const signOut = async () => {
  const { error } = await authStore.signOut()
  if (error) {
    console.error(error)
  }
}
</script>

<style></style>

