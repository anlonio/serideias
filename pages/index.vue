<template>
  <VMain>
    <VContainer>
      <VRow justify="center">
        <VCol sm="12" md="10" lg="4" xl="5">
          <VBtn variant="outlined" color="success" block to="/posts/new">
            Nova publicação
          </VBtn>
        </VCol>
      </VRow>
      <VRow v-for="post in posts" :key="post.uuid" justify="center">
        <VCol sm="12" md="10" lg="4" xl="5">
          <PostItem :post="post" />
        </VCol>
      </VRow>
    </VContainer>
  </VMain>
</template>

<script lang="ts" setup>
definePageMeta({
  title: 'Serideias',
  name: 'posts',
})

const postStore = usePostStore()
const { posts } = storeToRefs(postStore)

postStore.fetchPosts()
</script>

<style></style>

