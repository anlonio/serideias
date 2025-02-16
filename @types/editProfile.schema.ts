export const contactSchema = z
  .object({
    type: z.enum(['email', 'phone', 'whatsapp', 'other']),
    label: z.string().nonempty(),
    contact: z.string(),
  })
  .superRefine((value, ctx) => {
    switch (value.type) {
      case 'email':
        if (!/.+@.+\..+/.test(value.contact)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'E-mail inválido',
          })
        }
        break

      case 'phone':
      case 'other':
        if (!/^\d{10,11}$/.test(value.contact)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Número de telefone inválido',
          })
        }
        break
    }
  })

export type Contact = Zod.input<typeof contactSchema>

export const editProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(4)
    .max(32)
    .regex(/^[a-zA-Z0-9_.]+$/, {
      message: 'usuário só pode conter letras, números, underline e ponto',
    })
    .regex(/^\S*$/, { message: 'usuário não pode conter espaços' }),
  full_name: z.string().trim(),
  avatar_url: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .optional(),
  bio: z.string().trim().nullish(),
  website: z.string().trim().url().nullish(),
  occupation: z.string().trim().nullish(),
  education: z.string().trim().nullish(),
  location_id: z.number().nullish(),
})

export type EditProfile = Zod.input<typeof editProfileSchema>

