export const newPasswordSchema = z.object({
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
})

// need to manually create inteface cause transform don't change password type
export type NewPassword = {
  password: string
}

