<template>
  <VMainCard
    class="mx-auto d-flex flex-column"
    height="300px"
    hover
    @click="$router.push({ path: `/posts/${post.uuid}` })"
  >
    <VCardTitle class="d-flex align-center">
      {{ post.title }}
      <VSpacer></VSpacer>
      <VMenu v-if="post.author_id === profile?.id" location="bottom end">
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
            <VBtn variant="text" color="error" @click="deleteDialog = false"
              >Cancelar</VBtn
            >
            <VBtn variant="text" color="success" @click="deleteDialog = false"
              >Confirmar</VBtn
            >
          </template>
        </VMainCard>
      </VDialog>
    </VCardTitle>
    <VCardSubtitle> {{ createdAt }} </VCardSubtitle>
    <VCardText class="flex-grow-1 overflow-y-hidden">
      <VuetifyViewer
        markdown-theme="github"
        :value="post.content"
      ></VuetifyViewer>
      <br />
    </VCardText>
    <VCardActions>
      <VContainer>
        <VRow>
          <VChipGroup>
            <VChip v-if="post.location" prepend-icon="mdi-map-marker">{{
              post.location.name
            }}</VChip>
            <VChip v-for="keyword in post.keywords" :key="keyword">
              {{ keyword }}
            </VChip>
          </VChipGroup>
        </VRow>
        <VRow>
          <v-list-item class="w-100">
            <template v-if="$vuetify.display.smAndUp" #prepend>
              <v-avatar color="grey-darken-3" />
            </template>

            <v-list-item-title>{{ post.author.full_name }}</v-list-item-title>

            <v-list-item-subtitle>
              @{{ post.author.username }}
            </v-list-item-subtitle>
            <template #append>
              <div>
                <v-icon class="me-1" :icon="getVotesIcon" />
                <span class="subheading me-2">{{ totalVotes }}</span>
                <span class="me-1">·</span>
                <v-icon class="me-1" icon="mdi-comment" />
                <span class="subheading">{{
                  post.totalReplies[0].count ?? 0
                }}</span>
              </div>
            </template>
          </v-list-item>
        </VRow>
      </VContainer>
    </VCardActions>
  </VMainCard>
</template>

<script lang="ts" setup>
import { useDate } from 'vuetify'

const authStore = useAuthStore()
const { profile } = storeToRefs(authStore)

const { post } = defineProps<{ post: PostsRowFull }>()

const { totalVotes, getVotes } = useCountVotes()

const deleteDialog = ref(false)

getVotes({ postId: post.id })

const getVotesIcon = computed(() => {
  return totalVotes.value >= 0 ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold'
})

const createdAt = useDate().format(post.created_at, 'keyboardDateTime')
</script>

<style></style>

