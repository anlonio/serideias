import { z } from "zod";

export default defineEventHandler(async (event) => {
  const bodySchema = z.object({
    full_name: z.string(),
    website: z.string().optional(),
    bio: z.string().optional(),
    occupation: z.string().optional()
  })
  const { success, data: body, error } = bodySchema.safeParse(await readBody(event))

  if (!success) {
    return error.message
  }

  return body
})
