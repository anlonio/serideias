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

  const fetchPosts = (options = {}) => {
    const result = useAsyncData(
      'posts',
      async () =>
        await supabase
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
          .limit(20),
      options,
    )
    result.then((result) => {
      const postsData = result.data.value?.data
      if (postsData) {
        posts.value = postsData
      }
      return result
    })

    return result
  }

  const fetchPost = () => {
    const route = useRoute()
    const uuid = route.params.uuid.toString()

    const result = useAsyncData(
      'post',
      async () =>
        await supabase
          .from('posts')
          .select(
            `
        *,
        author:profiles(
          *,
          location: locations(*)
        ),
        replies(
          *,
          author:profiles(
            *,
            location: locations(*)
          ) 
        ),
        totalReplies:replies(count),
        location:locations(*)
      `,
          )
          .eq('uuid', uuid)
          .order('created_at', { ascending: false, referencedTable: 'replies' })
          .maybeSingle(),
    )

    result.then((result) => {
      const postData = result.data.value?.data
      if (postData) {
        post.value = postData
      }
      return result
    })

    return result
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

  const replyPost = async (
    content: string,
    post_id: number,
    reply_id?: number,
  ) => {
    const { error } = await supabase.from('replies').insert({
      content,
      post_id,
      reply_id,
    })
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
    replyPost,
    locations,
  }
})

