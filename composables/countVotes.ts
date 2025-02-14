export const useCountVotes = () => {
  const upVote = ref<number>(0)
  const downVote = ref<number>(0)
  const myVote = ref<VotesRow | null>(null)
  const totalVotes = computed(() => {
    return upVote.value - downVote.value
  })
  const firstLoad = ref(true)

  const postStore = usePostStore()
  const getVotes = async ({
    postId,
    replyId,
  }: {
    postId?: number
    replyId?: number
  }) => {
    const result = await postStore.fetchVotes({ postId, replyId })
    firstLoad.value = false
    upVote.value = result.upVote
    downVote.value = result.downVote
    myVote.value = result.myVote
  }
  return { upVote, downVote, myVote, firstLoad, totalVotes, getVotes }
}

