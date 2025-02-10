export const usePostStore = defineStore('post', () => {
  const supabase = useSupabaseClient()

  const posts = ref<PostsRowFull[]>([])

  const fetchPosts = async () => {
    const result = await supabase
      .from('posts')
      .select(
        `
        *,
        author:profiles(*),
        totalReplies:replies(count)
      `,
      )
      .limit(20)
      .returns<PostsRowFull[]>()

    if (result.data) {
      posts.value = result.data
    }
  }

  const fetchVotes = async (post_id: number) => {
    const { count: upVote } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', post_id)
      .eq('is_upvote', true)
      .returns<{ count: number }>()

    const { count: downVote } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', post_id)
      .eq('is_upvote', false)
      .returns<{ count: number }>()

    return {
      upVote,
      downVote,
    }
  }

  const locations = ref<LocationsRow[]>([])

  const fetchLocations = () => {
    return useAsyncData('locations', async () => {
      console.log('foo')
      const { data } = await supabase
        .from('locations')
        .select('*')
        .returns<LocationsRow[]>()
      locations.value = data ?? []
      return data
    })
  }

  return { posts, fetchPosts, fetchVotes, fetchLocations, locations }
})

