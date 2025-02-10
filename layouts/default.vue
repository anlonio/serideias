<template>
  <VResponsive>
    <VApp>
      <VNavigationDrawer
        v-model:rail="railToggle"
        :expand-on-hover="expandOnHoverActive"
        mobile-breakpoint="md"
      >
        <VList>
          <VListItem
            v-if="profile"
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            :subtitle="`@${profile.username}`"
            :title="profile.full_name"
            to="/profile/view"
          />
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
              title="Posts por cidade"
              prepend-icon="mdi-folder-marker"
            />
            <VListItem
              to="/posts/my-posts"
              title="Meus posts"
              prepend-icon="mdi-folder-account"
            />
            <VListItem
              to="/profile/view"
              title="Editar Perfil"
              prepend-icon="mdi-account-cog"
            />
            <VListItem
              to="/profile/preferences"
              title="Preferências"
              prepend-icon="mdi-cog"
            />
            <VListItem
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
        <VAppBarTitle>Serideias</VAppBarTitle>
        <template #append>
          <v-btn icon="mdi-magnify" />
          <VBtn v-if="isAnon" variant="outlined" color="info" to="/login"
            >fazer login</VBtn
          >
          <v-btn icon="mdi-dots-vertical" />
        </template>
      </VAppBar>
      <slot />
    </VApp>
  </VResponsive>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { isAnon, profile } = storeToRefs(authStore)

const railToggle = ref(true)
const drawerToggle = ref(false)
const expandOnHoverActive = ref(true)

const setNavigationDrawer = () => {
  expandOnHoverActive.value = !expandOnHoverActive.value
  drawerToggle.value = true
  railToggle.value = !railToggle.value
}

const signOut = async () => {
  const { error } = await authStore.signOut()
  if (error) {
    console.log(error)
  }
}
</script>

<style></style>

