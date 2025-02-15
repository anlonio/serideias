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
                    <PostVotesItem :post-id="post.id" />
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
              <VuetifyViewer
                markdown-theme="github"
                :value="post.content"
              ></VuetifyViewer>
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
              <span class="text-h5"
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
            <PostReplyItem
              v-for="reply in rootReplies"
              :key="reply.uuid"
              :reply="reply"
            ></PostReplyItem>
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
import { VuetifyViewer } from 'vuetify-pro-tiptap'

const postStore = usePostStore()
const { post, rootReplies } = storeToRefs(postStore)

const replyForm = useTemplateRef('replyForm')

const { onSubmit, loading } = useReplyForm(post.value?.id ?? 0)

const replyContent = useField<string>('content')

post.value = null
postStore.fetchPost()
</script>

<style></style>

