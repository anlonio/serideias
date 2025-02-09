export const signInUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type SignInUser = Zod.input<typeof signInUserSchema>