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
      <VContainer>
        <VRow justify="space-between" justify-sm="center">
          <VCol v-if="!$vuetify.display.mdAndDown" xl="3"></VCol>
          <VCol sm="10" md="8" lg="6" xl="5">
            <template v-if="status === 'success'">
              <VRow justify="center" align="center">
                <VCol cols="9" md="12">
                  <VBtn color="success" block to="/posts/new">
                    Nova publicação
                  </VBtn>
                </VCol>
                <VCol v-if="$vuetify.display.smAndDown" cols="auto">
                  <VMenu>
                    <template #activator="{ props }">
                      <VBtn
                        v-bind="props"
                        variant="elevated"
                        icon="mdi-filter-menu"
                        color="success"
                      >
                      </VBtn>
                    </template>
                    <VCard title="Filtrar por cidade">
                      <VCardText>
                        <VChipGroup
                          v-model="location"
                          column
                          selected-class="text-info"
                          @update:model-value="setLocation"
                        >
                          <VChip
                            v-for="loc in locations"
                            :key="loc.uuid"
                            filter
                            :value="loc.uuid"
                            >{{ loc.name }}</VChip
                          >
                        </VChipGroup>
                      </VCardText>
                    </VCard>
                  </VMenu>
                </VCol>
              </VRow>
              <VRow
                v-if="$vuetify.display.smAndDown && getLocation"
                align="center"
              >
                <VCol>
                  <span>Filtros:</span>
                  <VChip
                    class="ml-2"
                    append-icon="mdi-close"
                    @click="setLocation()"
                    >{{ getLocation.name }}</VChip
                  >
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
            </template>
            <template v-else>
              <VRow justify="center">
                <VCol>
                  <VBtn color="success" block to="/posts/new">
                    Nova publicação
                  </VBtn>
                </VCol>
              </VRow>
              <VRow justify="center">
                <VCol>
                  <SkeletonPostCard />
                </VCol>
              </VRow>
            </template>
          </VCol>
          <VCol v-if="!$vuetify.display.smAndDown" lg="3" md="4" xl="3">
            <span class="text-h5">Filtrar pro cidade:</span>
            <VChipGroup
              v-model="location"
              column
              selected-class="text-info"
              @update:model-value="setLocation"
            >
              <VChip
                v-for="loc in locations"
                :key="loc.uuid"
                filter
                :value="loc.uuid"
                >{{ loc.name }}</VChip
              >
            </VChipGroup>
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

const { posts, locations } = storeToRefs(postStore)

const route = useRoute()

const location = ref<string>()

const getLocation = computed(() =>
  locations.value.find((loc) => loc.uuid === location.value),
)

const setLocation = (location?: string) => {
  router.push({
    path: '/',
    query: { ...route.query, location: location },
  })
}

const { status, execute } = await useAsyncData(
  'posts',
  async () => await postStore.fetchPosts(),
)

await useAsyncData('locations', async () => await postStore.fetchLocations())

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

const searchText = ref<string>()

const processQuery = () => {
  location.value = route.query.location?.toString()
  searchText.value = route.query.search?.toString()
}

processQuery()

watch(
  () => route.query,
  () => {
    processQuery()
    execute()
  },
  {
    deep: true,
  },
)

const router = useRouter()
const search = () =>
  router.push({
    path: '/',
    query: { ...route.query, search: searchText.value },
  })
</script>

<style></style>

