export const signUpUserSchema = z.object({
  email: z.string().email(),
  password: z
    .object({
      password: z.string().min(6).max(32),
      confirmPassword: z.string().min(6).max(32),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: 'custom',
          message: 'Senhas não são equivalentes',
          path: ['confirmPassword'],
        })
      }
    })
    .transform(({ password }) => {
      return password
    }),
  username: z.string().min(4).max(32),
  fullName: z.string().min(4).max(200),
})

// need to manually create inteface cause transform don't change password type
export type SignUpUser = {
  email: string;
  password: string;
  username: string;
  fullName: string;
}