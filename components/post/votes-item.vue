<template>
  <VBtnToggle v-model="isUpVote" class="gc-2">
    <VBtn
      v-tooltip="{ location: 'top', text: 'Achei relevante' }"
      variant="plain"
      density="compact"
      icon="mdi-arrow-up-bold"
      :value="true"
      :readonly="pending"
    />
    <span
      v-tooltip="{
        location: 'top',
        text: `+ ${upVotes} | - ${downVotes}`,
      }"
      class="text-center mt-3"
    >
      {{ totalVotes }}
    </span>
    <VBtn
      v-tooltip="{
        location: 'top',
        text: 'Não achei relevante',
      }"
      variant="plain"
      density="compact"
      icon="mdi-arrow-down-bold"
      :value="false"
      :readonly="pending"
    />
  </VBtnToggle>
</template>

<script lang="ts" setup>
const { post, reply } = defineProps<{
  post?: PostsRowFullWithReplies
  reply?: RepliesRow
}>()

if ((post && reply) || (!post && !reply)) {
  throw Error('Invalid Props')
}

const entityName = post ? 'post' : 'reply'
const entity = post ??
  reply ?? { upVotes: 0, downVotes: 0, myVote: null, id: null }

const myVote = ref(entity.myVote)
const upVotes = ref(entity.upVotes)
const downVotes = ref(entity.downVotes)

const totalVotes = computed(() => upVotes.value - downVotes.value)

const postStore = usePostStore()

const isUpVote = ref<boolean | undefined>(myVote.value?.is_upvote)

const supabase = useSupabaseClient()

const { execute: fetchVotes, data } = useAsyncData(
  `${entityName}Votes:${entity.id}`,
  () => postStore.fetchVotes({ postId: post?.id, replyId: reply?.id }),
  { immediate: false },
)

watch(data, (value) => {
  if (value) {
    upVotes.value = value.upVote
    downVotes.value = value.downVote
    myVote.value = value.myVote
  }
})

const channel = await supabase
  .channel('room1')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'votes',
      filter: `${entityName}_id=eq.${entity.id}`,
    },
    () => {
      fetchVotes()
    },
  )
  .subscribe()

onBeforeUnmount(() => {
  supabase.removeChannel(channel)
})

watch(
  () => isUpVote.value,
  (value, oldValue) => {
    if (oldValue === true) {
      upVotes.value -= 1
    }

    if (oldValue === false) {
      downVotes.value -= 1
    }

    if (value === true) {
      upVotes.value += 1
    }

    if (value === false) {
      downVotes.value += 1
    }

    saveVote(value)
  },
)

const pending = ref(false)
const saveVote = async (value: boolean | undefined) => {
  try {
    pending.value = true
    await postStore.saveVote(value, post?.id, reply?.id)
  } catch (error) {
    console.error(error)
  } finally {
    pending.value = false
  }
}
</script>

<style></style>

