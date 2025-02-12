export const newPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  keywords: z.array(z.string()),
  location_id: z.number(),
})

export type NewPost = Zod.input<typeof newPostSchema>
