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
        <VRow class="text-center">
          <VCol>
            <h1>Resumo por cidade</h1>
          </VCol>
        </VRow>
        <VRow justify="center">
          <VCol sm="12" md="10" lg="12" xl="8">
            <VRow justify="center">
              <VCol
                v-for="location in locationsWithPosts"
                :key="location.uuid"
                cols="12"
                sm="6"
                lg="4"
              >
                <VMainCard
                  :title="location.name"
                  :to="{ path: '/', query: { location: location.uuid } }"
                >
                  <template #append>
                    <VBadge bordered color="grey" class="pr-4">
                      <template #badge>{{ location.posts[0].count }}</template>
                      <VIcon icon="mdi-post"></VIcon>
                    </VBadge>
                    <VBadge bordered color="grey">
                      <template #badge>{{
                        location.profiles[0].count
                      }}</template>
                      <VIcon icon="mdi-account"></VIcon>
                    </VBadge>
                  </template>
                </VMainCard>
              </VCol>
            </VRow>
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

const { locationsWithPosts } = storeToRefs(postStore)

const { status, execute } = useAsyncData(
  'posts-from-locations',
  async () => await postStore.fetchPostsFromLocations(),
)
</script>

<style></style>

