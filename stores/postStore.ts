export const usePostStore = defineStore('post', () => {
  const supabase = useSupabaseClient<Database>()

  const authStore = useAuthStore()

  const posts = ref<PostsRowFull[]>([])
  const post = ref<PostsRowFullWithReplies | null>(null)
  const locationsWithPosts = ref<LocationsRowWithPosts[]>([])

  const rootReplies = computed(() => {
    return post.value?.replies.filter((reply) => !reply.reply_id)
  })

  const nestedReplies = computed(() => {
    return (parentReply: RepliesRow) =>
      post.value?.replies.filter((reply) => reply.reply_id === parentReply.id)
  })

  const route = useRoute()

  const fetchPosts = () =>
    useAsyncData('posts', async () => {
      let queryBuilder = supabase
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

      if (route.query.search) {
        queryBuilder = queryBuilder.textSearch(
          'title_content_keywords',
          route.query.search?.toString(),
          {
            type: 'websearch',
          },
        )
      }
      return await queryBuilder.then((result) => {
        const postsData = result.data
        if (postsData) {
          posts.value = postsData
        }
        console.log(result.error)

        return result
      })
    })

  const fetchPostsFromLocations = () =>
    useAsyncData(
      'posts',
      async () =>
        await supabase
          .from('locations')
          .select(
            `
              *,
              posts(count),
              profiles(count)
              `,
          )
          .order('name', { ascending: true })
          .then((result) => {
            if (result.data) {
              locationsWithPosts.value = result.data.sort((a, b) => {
                const countA = a.posts[0]?.count || 0
                const countB = b.posts[0]?.count || 0
                return countB - countA
              })
            }
            console.log(result.error)

            return result
          }),
    )

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

  const fetchVotes = async ({
    postId,
    replyId,
  }: {
    postId: number | undefined
    replyId: number | undefined
  }) => {
    const itemId = postId ? postId : replyId

    if (itemId === undefined) {
      throw 'boooooo'
    }

    const fieldId = postId ? 'post_id' : 'reply_id'

    return useAsyncData('votes', async () => {
      const { count: upVote } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq(fieldId, itemId)
        .eq('is_upvote', true)

      const { count: downVote } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq(fieldId, itemId)
        .eq('is_upvote', false)

      let myVote = null

      if (authStore.profile) {
        const { data } = await supabase
          .from('votes')
          .select('*')
          .eq('author_id', authStore.profile.id)
          .eq(fieldId, itemId)
          .maybeSingle()

        if (data) myVote = data
      }

      return {
        upVote: upVote ?? 0,
        downVote: downVote ?? 0,
        myVote,
      }
    })
  }

  const createPost = (post: NewPost) => {
    return supabase.from('posts').insert(post).select().maybeSingle()
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

  const saveVote = async (
    upVote: boolean | undefined,
    post_id?: number,
    reply_id?: number,
  ) => {
    if (!authStore.profile) return

    if (upVote === undefined) {
      return supabase
        .from('votes')
        .delete()
        .eq('author_id', authStore.profile.id)
        .then((result) => {
          if (result.error) {
            throw result.error
          }
          return result
        })
    }

    return supabase
      .from('votes')
      .upsert(
        {
          is_upvote: upVote,
          post_id,
          author_id: authStore.profile.id,
          reply_id,
        },
        {
          onConflict: 'post_id, author_id',
        },
      )
      .then((result) => {
        if (result.error) {
          throw result.error
        }
        return result
      })
  }

  const locations = ref<LocationsRow[]>([])

  const fetchLocations = () => {
    return useAsyncData('locations', async () => {
      console.log('foo')
      const { data } = await supabase
        .from('locations')
        .select('*')
        .order('name')
      locations.value = data ?? []
      return data ?? []
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
    saveVote,
    locations,
    fetchPostsFromLocations,
    locationsWithPosts,
  }
})

