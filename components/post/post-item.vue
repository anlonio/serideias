<template>
  <v-card class="mx-auto" hover :to="{ path: `/posts/${post.uuid}` }">
    <VCardTitle>{{ post.title }}</VCardTitle>
    <VCardSubtitle> {{ createdAt }} </VCardSubtitle>
    <VCardText>
      <p>
        {{ post.content }}
      </p>
      <VChipGroup>
        <VChip v-if="post.location" prepend-icon="mdi-map-marker">{{
          post.location.name
        }}</VChip>
        <VChip v-for="keyword in post.keywords" :key="keyword">
          {{ keyword }}
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
import { useDate } from 'vuetify'

const { post } = defineProps<{ post: PostsRowFull }>()

const { totalVotes, getVotes } = useCountVotes()

getVotes({ postId: post.id })

const getVotesIcon = computed(() => {
  return totalVotes.value >= 0 ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold'
})

const createdAt = useDate().format(post.created_at, 'keyboardDateTime')
</script>

<style></style>

