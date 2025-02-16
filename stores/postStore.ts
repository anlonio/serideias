export const usePostStore = defineStore('post', () => {
  const supabase = useSupabaseClient<Database>()

  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)

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

  // @ts-expect-error complex item param type, will do it later
  const convertCounts = (item) => {
    return {
      ...item,
      totalReplies: item.totalReplies[0].count,
      upVotes: item.upVotes[0].count,
      downVotes: item.downVotes[0].count,
      myVote: item.myVote[0],
      ...(item.replies && { replies: item.replies.map(convertCounts) }),
    }
  }

  const fetchPosts = async ({ nextPage }: { nextPage?: boolean } = {}) => {
    let queryBuilder = supabase
      .from('posts')
      .select(
        `
          *,
          author:profiles(
            *,
            location: locations(*),
            contacts(*)
            ),
          totalReplies:replies(count),
          location:locations(*),
          upVotes:votes(count),
          downVotes:votes(count),
          myVote:votes(*)
          `,
      )
      .eq('upVotes.is_upvote', true)
      .eq('downVotes.is_upvote', false)

    if (user.value) {
      queryBuilder = queryBuilder.eq('myVote.author_id', user.value?.id)
    } else {
      queryBuilder = queryBuilder.is('myVote.author_id', null)
    }

    const route = useRoute()

    if (route.query.search) {
      queryBuilder = queryBuilder.textSearch(
        'title_content_keywords',
        route.query.search?.toString(),
        {
          type: 'websearch',
        },
      )
    }

    if (route.name?.toString().startsWith('MyPosts')) {
      queryBuilder = queryBuilder.eq('author_id', user.value?.id ?? '')
    }

    if (nextPage) {
      const count = posts.value.length
      queryBuilder = queryBuilder.range(count, count + 19)
    } else {
      queryBuilder = queryBuilder.limit(20)
    }

    queryBuilder = queryBuilder.order('created_at', { ascending: false })

    return await queryBuilder.then((result) => {
      const postsData = result.data
      if (!postsData) {
        return result
      }

      if (nextPage) {
        posts.value.push(...postsData.map(convertCounts))
        return result
      }

      posts.value = postsData.map(convertCounts)
      return result
    })
  }

  const fetchPostsFromLocations = async () =>
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

        return result
      })

  const fetchPost = () => {
    const route = useRoute()
    const uuid = route.params.uuid.toString()

    let queryBuilder = supabase
      .from('posts')
      .select(
        `
        *,
        author:profiles(
          *,
          location: locations(*),
          contacts(*)
        ),
        replies(
          *,
          author:profiles(
            *,
            location: locations(*),
            contacts(*)
          ),
          upVotes:votes(count),
          downVotes:votes(count),
          myVote:votes(*),
          totalReplies:replies(count)
        ),
        totalReplies:replies(count),
        upVotes:votes(count),
        downVotes:votes(count),
        myVote:votes(*),
        location:locations(*)
      `,
      )
      .eq('uuid', uuid)
      .eq('upVotes.is_upvote', true)
      .eq('downVotes.is_upvote', false)
      .eq('replies.upVotes.is_upvote', true)
      .eq('replies.downVotes.is_upvote', false)

    if (user.value) {
      queryBuilder = queryBuilder
        .eq('myVote.author_id', user.value?.id)
        .eq('replies.myVote.author_id', user.value?.id)
    } else {
      queryBuilder = queryBuilder
        .is('myVote.author_id', null)
        .is('replies.myVote.author_id', null)
    }

    return queryBuilder
      .order('created_at', { ascending: false, referencedTable: 'replies' })
      .single()
      .then((result) => {
        if (result.data) {
          const postData = convertCounts(result.data)

          post.value = postData
        }
        return result
      })
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

    const from = postId ? 'posts' : 'replies'

    let queryBuilder = supabase
      .from(from)
      .select(
        `
          upVotes:votes(count),
          downVotes:votes(count),
          myVote:votes(*)
      `,
      )
      .eq('id', itemId)
      .eq('upVotes.is_upvote', true)
      .eq('downVotes.is_upvote', false)

    if (user.value) {
      queryBuilder = queryBuilder.eq('myVote.author_id', user.value?.id)
    } else {
      queryBuilder = queryBuilder.is('myVote.author_id', null)
    }

    const result = await queryBuilder.single()

    return {
      upVote: result.data?.upVotes[0].count ?? 0,
      downVote: result.data?.downVotes[0].count ?? 0,
      myVote: result.data?.myVote[0] ?? null,
    }
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
    if (!user.value) return

    if (upVote === undefined) {
      let queryBuilder = supabase
        .from('votes')
        .delete()
        .eq('author_id', user.value.id)

      if (post_id) {
        queryBuilder = queryBuilder.eq('post_id', post_id)
      }
      if (reply_id) {
        queryBuilder = queryBuilder.eq('reply_id', reply_id)
      }

      return queryBuilder.then((result) => {
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
          author_id: user.value.id,
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

