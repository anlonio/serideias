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
    <VMain>
      <VContainer v-if="status === 'success'">
        <VRow justify="center">
          <VCol sm="10" md="10" lg="6" xl="5">
            <VRow justify="center">
              <VCol>
                <VBtn color="success" block to="/posts/new">
                  Nova publicação
                </VBtn>
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
  layout: false,
})
const postStore = usePostStore()

const { posts } = storeToRefs(postStore)

const { status, execute } = await postStore.fetchPosts()
</script>

<style></style>

