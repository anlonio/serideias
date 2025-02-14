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
        text: `+ ${upVote} | - ${downVote}`,
      }"
      class="text-center mt-3"
    >
      {{ firstLoad ? '-' : totalVotes }}
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
const { postId, replyId } = defineProps<{
  postId?: number
  replyId?: number
}>()

if (postId && replyId) {
  throw Error('Invalid Props')
}

const { upVote, downVote, myVote, firstLoad, totalVotes, getVotes } =
  useCountVotes()

const postStore = usePostStore()

const isUpVote = ref<boolean | undefined>(undefined)

watch(
  () => myVote.value,
  (value) => {
    if (value) {
      isUpVote.value = value.is_upvote
    }
  },
)

watch(
  () => isUpVote.value,
  (value, oldValue) => {
    if (value === myVote.value?.is_upvote) {
      return
    }
    if (oldValue === true) {
      upVote.value -= 1
    }

    if (oldValue === false) {
      downVote.value -= 1
    }

    if (value === true) {
      upVote.value += 1
    }

    if (value === false) {
      downVote.value += 1
    }

    saveVote(value)
  },
)

const pending = ref(false)
const saveVote = async (value: boolean | undefined) => {
  try {
    pending.value = true
    await postStore.saveVote(value, postId, replyId)
    await getVotes({ postId, replyId })
  } catch (error) {
    console.log(error)
  } finally {
    pending.value = false
  }
}

getVotes({ postId, replyId })
</script>

<style></style>

