export const newPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  keywords: z.array(z.string()).default([]),
  location_id: z.number().nullable(),
})

export type NewPost = Zod.input<typeof newPostSchema>

