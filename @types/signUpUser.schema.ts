export const signUpUserSchema = z.object({
  email: z.string().trim().email(),
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
  username: z
    .string()
    .trim()
    .min(4)
    .max(32)
    .regex(/^[a-zA-Z0-9_.]+$/, {
      message: 'usuário só pode conter letras, números, underline e ponto',
    })
    .regex(/^\S*$/, { message: 'usuário não pode conter espaços' }),
  fullName: z.string().trim().min(4).max(200),
})

// need to manually create inteface cause transform don't change password type
export type SignUpUser = {
  email: string
  password: string
  username: string
  fullName: string
}

