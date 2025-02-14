export const useReplyForm = (postId: number, replyId?: number) => {
  const { handleSubmit, handleReset, errors } = useForm({
    validationSchema: toTypedSchema(
      z.object({
        content: z.string().nonempty('Digite algo').max(200),
      }),
    ),
  })

  const loading = ref(false)
  const postStore = usePostStore()
  const onSubmit = handleSubmit(async ({ content }) => {
    loading.value = true
    await postStore.replyPost(content, postId, replyId)
    await postStore.fetchPost()
    handleReset()
    loading.value = false
  })
  return { onSubmit, loading, errors }
}

