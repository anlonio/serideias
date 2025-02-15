<template>
  <NuxtLayout name="default">
    <template #toolbar-append>
      <v-btn icon="mdi-refresh" @click="execute" />
    </template>
    <template #toolbar-default>
      <VProgressLinear
        v-if="status === 'pending'"
        indeterminate
        location="bottom"
        absolute
      />
    </template>
    <VMain v-if="profile">
      <VContainer v-if="status === 'success'">
        <VRow justify="center">
          <VCol sm="10" md="10" lg="6" xl="5">
            <VRow justify="center">
              <VCol>
                <VMainCard
                  :title="profile.full_name"
                  :subtitle="`@${profile.username}`"
                >
                  <template #prepend>
                    <VAvatar
                      v-if="profile.avatar_url"
                      size="80"
                      :image="profile.avatar_url"
                    />
                    <VAvatar
                      v-else
                      size="80"
                      image="/public/account-circle.png"
                    />
                  </template>
                  <VCardText>
                    <VBtn
                      v-if="profile.location"
                      prepend-icon="mdi-map-marker"
                      variant="text"
                      class="text-none"
                      density="compact"
                      slim
                      readonly
                      >{{ profile.location.name }}</VBtn
                    >
                    <br />
                    <VBtn
                      v-if="profile.website"
                      prepend-icon="mdi-web"
                      variant="text"
                      class="text-none"
                      density="compact"
                      slim
                      target="_blank"
                      >{{ profile.website }}</VBtn
                    >
                    <br />
                    <VBtn
                      v-if="profile.occupation"
                      prepend-icon="mdi-briefcase"
                      variant="text"
                      class="text-none"
                      density="compact"
                      slim
                      readonly
                      >{{ profile.occupation }}</VBtn
                    >
                    <br />
                    <VBtn
                      v-if="profile.education"
                      prepend-icon="mdi-school"
                      variant="text"
                      class="text-none"
                      density="compact"
                      slim
                      readonly
                      >{{ profile.education }}</VBtn
                    >
                    <br />
                    <br />
                    <p>{{ profile.bio }}</p>
                  </VCardText>
                  <template #append>
                    <VBtn color="info" to="/profile/edit">Editar perfil</VBtn>
                  </template>
                </VMainCard>
              </VCol>
            </VRow>
            <VRow v-for="post in posts" :key="post.uuid" justify="center">
              <VCol>
                <PostItem :post="post" />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VContainer>
      <VContainer v-else>
        <VRow justify="center">
          <VCol sm="12" md="10" lg="4" xl="5">
            <VBtn color="success" block to="/posts/new"> Nova publicação </VBtn>
          </VCol>
        </VRow>
        <VRow justify="center">
          <VCol sm="12" md="10" lg="4" xl="5">
            <SkeletonPostCard />
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'MyPosts',
  layout: false,
})
const postStore = usePostStore()
const authStore = useAuthStore()
const { profile } = storeToRefs(authStore)

const { posts } = storeToRefs(postStore)

const { status, execute } = await postStore.fetchPosts()
</script>

<style></style>

