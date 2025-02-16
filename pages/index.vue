<template>
  <NuxtLayout name="default">
    <template #toolbar-default>
      <VTextField
        v-model="searchText"
        label="Pesquisar por publicações"
        density="compact"
        append-inner-icon="mdi-magnify"
        hide-details
        variant="solo-filled"
        single-line
        flat
        max-width="320px"
        clearable
        @click:clear="search"
        @click:append-inner="search"
        @keydown.enter="search"
      />
      <VProgressLinear
        v-if="status === 'pending'"
        indeterminate
        location="bottom"
        absolute
      />
    </template>
    <template #toolbar-append>
      <v-btn icon="mdi-refresh" @click="execute" />
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
          <VCol sm="10" md="10" lg="6" xl="5">
            <VBtn color="success" block to="/posts/new"> Nova publicação </VBtn>
          </VCol>
        </VRow>
        <VRow justify="center">
          <VCol sm="10" md="10" lg="6" xl="5">
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

const { status, execute } = useAsyncData(
  'posts',
  async () => await postStore.fetchPosts(),
)

const route = useRoute()

watch(
  () => route.query,
  () => {
    postStore.fetchPosts()
  },
  {
    deep: true,
  },
)

const searchText = ref('')

if (route.query.search) {
  searchText.value = route.query.search.toString()
}

const router = useRouter()
const search = () =>
  router.push({ path: '/', query: { search: searchText.value } })
</script>

<style></style>

