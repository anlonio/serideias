<template>
  <VMain>
    <VContainer v-if="post">
      <VRow justify="center">
        <VCol sm="12" md="10" lg="8" xl="5">
          <VRow justify="center" class="pt-4">
            <VCol>
              <h1 class="text-h2 font-weight-bold">{{ post.title }}</h1>
            </VCol>
          </VRow>
          <VRow>
            <VCol>
              <ProfileItem :author="post.author" :created-at="post.created_at">
                <template #append>
                  <VBtn
                    variant="plain"
                    density="compact"
                    icon="mdi-arrow-up-bold"
                  />
                  <span>{{ totalVotes }}</span>
                  <VBtn
                    variant="plain"
                    density="compact"
                    icon="mdi-arrow-down-bold"
                  />
                </template>
              </ProfileItem>
            </VCol>
          </VRow>
          <VRow>
            <VDivider />
          </VRow>
          <VRow>
            <VCol class="py-4">
              <p>{{ post.content }}</p>
              <br />
              <span class="text-caption font-weight-bold">Palavras-chave:</span>
              <VChipGroup>
                <VChip
                  v-if="post.location"
                  variant="outlined"
                  prepend-icon="mdi-map-marker"
                  >{{ post.location.name }}</VChip
                >
                <VChip
                  v-for="keyword in post.keywords"
                  :key="keyword"
                  variant="outlined"
                >
                  {{ keyword }}
                </VChip>
              </VChipGroup>
            </VCol>
          </VRow>
          <VRow>
            <VDivider />
          </VRow>
          <VRow>
            <VCol>
              <span class="text-h4"
                >Respostas ({{ post.totalReplies[0].count }})</span
              >
            </VCol>
          </VRow>
          <VRow>
            <VCol>
              <VTextField
                placeholder="Comentar algo sobre"
                variant="filled"
                append-inner-icon="mdi-send"
              />
            </VCol>
          </VRow>
          <VRow>
            <VDivider />
          </VRow>
          <VRow v-for="reply in rootReplies" :key="reply.uuid">
            <VCol>
              <VRow>
                <VCol class="pa-0 ma-0">
                  <VCard variant="flat" :text="reply.content">
                    <template #title>
                      <ProfileItem
                        :author="reply.author"
                        :created-at="reply.created_at"
                      />
                    </template>
                    <template #actions>
                      <VBtn
                        variant="plain"
                        density="compact"
                        icon="mdi-arrow-up-bold"
                      />
                      <span>{{ totalVotes }}</span>
                      <VBtn
                        variant="plain"
                        density="compact"
                        icon="mdi-arrow-down-bold"
                      />
                    </template>
                  </VCard>
                </VCol>
              </VRow>
              <VRow
                v-for="nestedReply in nestedReplies(reply)"
                :key="nestedReply.uuid"
              >
                <VCol cols="1" class="text-center pa-0 ma-0">
                  <VDivider inset vertical length="100%" thickness="2" />
                </VCol>
                <VCol>
                  <VCard variant="flat" :text="nestedReply.content">
                    <template #title>
                      <ProfileItem
                        :author="nestedReply.author"
                        :created-at="nestedReply.created_at"
                      />
                    </template>
                    <template #actions>
                      <VBtn
                        variant="plain"
                        density="compact"
                        icon="mdi-arrow-up-bold"
                      />
                      <span>{{ totalVotes }}</span>
                      <VBtn
                        variant="plain"
                        density="compact"
                        icon="mdi-arrow-down-bold"
                      />
                    </template>
                  </VCard>
                </VCol>
              </VRow>
            </VCol>
            <VDivider />
          </VRow>
        </VCol>
      </VRow>
    </VContainer>
  </VMain>
</template>

<script lang="ts" setup>
definePageMeta({
  props: true,
})
const { uuid } = defineProps<{ uuid: string }>()

const postStore = usePostStore()
const { post, rootReplies, nestedReplies } = storeToRefs(postStore)
const upVote = ref<number | null>(null)
const downVote = ref<number | null>(null)
const totalVotes = computed(() => {
  return (upVote.value ?? 0) - (downVote.value ?? 0)
})

const getVotes = async (post: PostsRowFullWithReplies) => {
  const result = await postStore.fetchVotes(post.id)
  upVote.value = result.upVote
  downVote.value = result.downVote
}

watchEffect(() => {
  if (post.value) {
    getVotes(post.value)
  }
})

postStore.fetchPost(uuid)
</script>

<style></style>

