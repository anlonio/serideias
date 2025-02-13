export const usePostStore = defineStore('post', () => {
  const supabase = useSupabaseClient<Database>()

  const posts = ref<PostsRowFull[]>([])
  const post = ref<PostsRowFullWithReplies | null>(null)

  const rootReplies = computed(() => {
    return post.value?.replies.filter((reply) => !reply.reply_id)
  })

  const nestedReplies = computed(() => {
    return (parentReply: RepliesRow) =>
      post.value?.replies.filter((reply) => reply.reply_id === parentReply.id)
  })

  const fetchPosts = async () => {
    const result = await supabase
      .from('posts')
      .select(
        `
        *,
        author:profiles(
          *,
          location: locations(*)
        ),
        totalReplies:replies(count),
        location:locations(*)
      `,
      )
      .order('created_at', { ascending: false })
      .limit(20)

    if (result.data) {
      posts.value = result.data
    }
  }

  const fetchPost = async (uuid: string) => {
    const result = await supabase
      .from('posts')
      .select(
        `
        *,
        author:profiles(
          *,
          location: locations(*)
        ),
        totalReplies:replies(count),
        replies(
          *,
          author:profiles(
            *,
            location: locations(*)
          ) 
        ),
        location:locations(*)
      `,
      )
      .eq('uuid', uuid)
      .maybeSingle()

    if (result.data) {
      post.value = result.data
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

  const createPost = async (post: NewPost) => {
    const { error } = await supabase.from('posts').insert(post)
    if (error) {
      throw error
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

  return {
    posts,
    post,
    rootReplies,
    nestedReplies,
    fetchPosts,
    fetchPost,
    fetchVotes,
    fetchLocations,
    createPost,
    locations,
  }
})

