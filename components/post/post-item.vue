<template>
  <v-card class="mx-auto" hover variant="outlined">
    <VCardTitle>{{ post.title }}</VCardTitle>
    <VCardSubtitle> {{ post.created_at }} </VCardSubtitle>
    <VCardText>
      <p>
        {{ post.content }}
      </p>
      <VChipGroup>
        <VChip
          v-for="keyword in post.keywords?.slice(0, 5)"
          :key="keyword"
          variant="outlined"
        >
          {{ keyword }}
        </VChip>
        <VChip
          v-if="keywordsSize > 5"
          v-tooltip="extraKeywords"
          variant="outlined"
        >
          +{{ keywordsSize - 5 }}
        </VChip>
      </VChipGroup>
    </VCardText>
    <VCardActions>
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
    </VCardActions>
  </v-card>
</template>

<script lang="ts" setup>
const { post } = defineProps<{ post: PostsRowFull }>()

const postStore = usePostStore()
const upVote = ref<number | null>(null)
const downVote = ref<number | null>(null)
const totalVotes = computed(() => {
  return (upVote.value ?? 0) - (downVote.value ?? 0)
})

const getVotes = async () => {
  const result = await postStore.fetchVotes(post.id)
  upVote.value = result.upVote
  downVote.value = result.downVote
}

const getVotesIcon = computed(() => {
  return totalVotes.value >= 0 ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold'
})

getVotes()

const keywordsSize = computed(() => post.keywords?.length ?? 0)
const extraKeywords = computed(() => post.keywords?.slice(5).join(', '))
</script>

<style></style>

