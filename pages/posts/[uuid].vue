<template>
  <VMain>
    <VContainer v-if="post">
      <VRow justify="center">
        <VCol sm="12" md="10" lg="4" xl="5">
          <VRow justify="center">
            <VCol class="text-center">
              <h1>{{ post.title }}</h1>
            </VCol>
          </VRow>
          <VRow>
            <VCol>
              <VListItem
                :title="post.author.full_name"
                :subtitle="`@${post.author.username}`"
              >
                <template #prepend>
                  <VIcon
                    v-if="!post.author.avatar_url"
                    icon="mdi-account-circle"
                    size="48"
                  />
                  <VAvatar v-else :image="post.author.avatar_url ?? ''" />
                </template>
                <template #append>
                  <span>{{ createdAt }}</span>
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
              </VListItem>
            </VCol>
          </VRow>
          <VRow>
            <VCol>
              <p>{{ post.content }}</p>
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
          <VRow v-for="reply in post.replies" :key="reply.uuid">
            <VCol>
              <VCard
                variant="flat"
                :title="reply.author.full_name"
                :subtitle="`@${reply.author.username}`"
                :text="reply.content"
              >
                <template #prepend>
                  <VIcon
                    v-if="!post.author.avatar_url"
                    icon="mdi-account-circle"
                    size="48"
                  />
                  <VAvatar v-else :image="post.author.avatar_url ?? ''" />
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
              <VDivider />
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VContainer>
  </VMain>
</template>

<script lang="ts" setup>
import { useDate } from 'vuetify'

definePageMeta({
  props: true,
})
const { uuid } = defineProps<{ uuid: string }>()

const postStore = usePostStore()
const { post } = storeToRefs(postStore)
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

const createdAt = useDate().format(post.value?.created_at, 'keyboardDateTime')

postStore.fetchPost(uuid)
</script>

<style></style>

