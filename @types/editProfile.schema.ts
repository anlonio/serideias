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

