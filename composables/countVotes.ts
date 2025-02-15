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
    const { data } = await postStore.fetchVotes({ postId, replyId })
    if (!data.value) throw 'boo'
    firstLoad.value = false
    upVote.value = data.value.upVote
    downVote.value = data.value.downVote
    myVote.value = data.value.myVote
  }
  return { upVote, downVote, myVote, firstLoad, totalVotes, getVotes }
}

