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
            <VRow
              v-if="infiniteScrollActive"
              class="text-center mb-4"
              align="center"
            >
              <VCol>
                <span
                  >Acabamos aqui.
                  <VBtn class="text-none" color="info" slim @click="execute"
                    >Recarregar</VBtn
                  >
                </span>
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
      <VProgressLinear
        v-if="isLoading"
        indeterminate
        location="bottom"
        color="info"
        absolute
      />
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

const infiniteScrollActive = ref(false)

watch(
  status,
  (value) => {
    if (value === 'success') {
      return (infiniteScrollActive.value = true)
    }
    infiniteScrollActive.value = false
  },
  {
    immediate: true,
  },
)

const loadPosts = async () => {
  console.log('here')

  const { data } = await postStore.fetchPosts({ nextPage: true })
  if (data?.length === 0) {
    infiniteScrollActive.value = false
  } else {
    infiniteScrollActive.value = true
  }
}
const { isLoading } = useInfiniteScroll(window, loadPosts, {
  canLoadMore: () => infiniteScrollActive.value,
  distance: 30,
})

const route = useRoute()

watch(() => route.query, execute, {
  deep: true,
})

const searchText = ref('')

if (route.query.search) {
  searchText.value = route.query.search.toString()
}

const router = useRouter()
const search = () =>
  router.push({ path: '/', query: { search: searchText.value } })
</script>

<style></style>

