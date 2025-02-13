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
                  <VRow class="gc-2">
                    <VBtn
                      v-tooltip="{ location: 'top', text: 'Achei relevante' }"
                      variant="plain"
                      density="compact"
                      icon="mdi-arrow-up-bold"
                    />
                    <span
                      v-tooltip="{
                        location: 'top',
                        text: `+ ${upVote} | - ${downVote}`,
                      }"
                      >{{ totalVotes }}</span
                    >
                    <VBtn
                      v-tooltip="{
                        location: 'top',
                        text: 'Não achei relevante',
                      }"
                      variant="plain"
                      density="compact"
                      icon="mdi-arrow-down-bold"
                    />
                  </VRow>
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
                <VChip v-if="post.location" prepend-icon="mdi-map-marker">
                  {{ post.location.name }}
                </VChip>
                <VChip v-for="keyword in post.keywords" :key="keyword">
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
              <VForm ref="replyForm" @submit.prevent="onSubmit">
                <input id="submitForm" type="submit" hidden />
                <VTextField
                  v-model="replyContent.value.value"
                  :error-messages="replyContent.errors.value"
                  placeholder="Comentar algo sobre"
                  variant="filled"
                  counter
                  maxlength="200"
                  :loading="loading"
                >
                  <template #append-inner>
                    <VBtn
                      icon="mdi-send"
                      variant="plain"
                      density="compact"
                      :ripple="false"
                      @click="replyForm?.requestSubmit()"
                    />
                  </template>
                </VTextField>
              </VForm>
            </VCol>
          </VRow>
          <VRow>
            <VDivider />
          </VRow>
          <v-expand-transition group>
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
          </v-expand-transition>
        </VCol>
      </VRow>
    </VContainer>
    <VContainer v-else>
      <SkeletonPostView />
    </VContainer>
  </VMain>
</template>

<script lang="ts" setup>
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

const replyForm = useTemplateRef('replyForm')

const { handleSubmit, handleReset } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      content: z.string().nonempty('Digite algo').max(200),
      replyId: z.number().optional(),
    }),
  ),
})

const replyContent = useField<string>('content')
const loading = ref(false)
const replyId = useField<number>('replyId')

const onSubmit = handleSubmit(async ({ content, replyId }) => {
  loading.value = true
  await postStore.replyPost(content, post.value?.id ?? 0, replyId)
  await postStore.fetchPost()
  handleReset()
  loading.value = false
})

post.value = null
postStore.fetchPost()
</script>

<style></style>

