<template>
  <VRow>
    <VCol>
      <VRow>
        <VCol class="pa-0 ma-0">
          <VForm ref="replyForm" @submit.prevent="onSubmit">
            <VMainCard variant="flat" :text="reply.content">
              <template #append>
                <VMenu
                  v-if="reply.author_id === profile?.id"
                  location="bottom end"
                >
                  <template #activator="{ props }">
                    <VBtn
                      icon="mdi-dots-vertical"
                      density="compact"
                      variant="plain"
                      v-bind="props"
                      @click.stop="() => {}"
                    />
                  </template>
                  <VList class="elevation-0 pa-0" variant="outlined">
                    <VListItem
                      title="excluir"
                      append-icon="mdi-delete"
                      @click.stop="deleteDialog = true"
                    />
                  </VList>
                </VMenu>
                <VDialog v-model="deleteDialog" width="240px">
                  <VMainCard variant="flat">
                    <template #title>
                      <div class="text-center">Apagar publicação?</div>
                    </template>
                    <template #actions>
                      <VBtn
                        variant="text"
                        color="error"
                        @click="deleteDialog = false"
                        >Cancelar</VBtn
                      >
                      <VBtn
                        variant="text"
                        color="success"
                        @click="deleteDialog = false"
                        >Confirmar</VBtn
                      >
                    </template>
                  </VMainCard>
                </VDialog>
              </template>
              <template #title>
                <ProfileItem
                  :author="reply.author"
                  :created-at="reply.created_at"
                />
              </template>
              <template #actions>
                <PostVotesItem :reply-id="reply.id" />
                <input id="submitForm" type="submit" hidden />
                <VTextarea
                  v-if="showInput"
                  v-model="replyContent.value.value"
                  autofocus
                  :error-messages="replyContent.errors.value"
                  :loading="loading"
                  counter
                  maxlength="500"
                  rows="1"
                  auto-grow
                  hide-details
                  density="compact"
                  :placeholder="`Responder @${reply.author.username}`"
                  append-icon="mdi-close"
                  @click:append="showInput = false"
                  @keydown.esc="showInput = false"
                >
                  <template #append-inner>
                    <VBtn
                      icon="mdi-send"
                      variant="plain"
                      density="compact"
                      :ripple="false"
                      :disabled="!!errors.content"
                      @click="replyForm?.requestSubmit()"
                    />
                  </template>
                </VTextarea>
                <VBtn
                  v-else
                  prepend-icon="mdi-comment-outline"
                  variant="plain"
                  density="compact"
                  class="text-none"
                  @click="showInput = true"
                >
                  responder
                </VBtn>
              </template>
            </VMainCard>
          </VForm>
        </VCol>
        <VDivider />
      </VRow>
      <template v-if="!parentReplyId">
        <VRow
          v-for="nestedReply in nestedReplies(reply)"
          :key="nestedReply.uuid"
        >
          <VCol cols="1" class="text-center pa-0 ma-0">
            <VDivider inset vertical length="100%" thickness="2" />
          </VCol>
          <VCol>
            <PostReplyItem :reply="nestedReply" :parent-reply-id="reply.id" />
          </VCol>
        </VRow>
      </template>
    </VCol>
  </VRow>
</template>

<script lang="ts" setup>
const { reply, parentReplyId } = defineProps<{
  reply: RepliesRow
  parentReplyId?: number
}>()
const postStore = usePostStore()
const authStore = useAuthStore()
const { nestedReplies } = storeToRefs(postStore)
const { profile } = storeToRefs(authStore)

const deleteDialog = ref(false)

const replyForm = useTemplateRef('replyForm')
const { onSubmit, loading, errors } = useReplyForm(
  reply.post_id,
  parentReplyId ?? reply.id,
)

const replyContent = useField<string>('content')

const showInput = ref(false)
</script>

<style></style>

