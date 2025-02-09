import { z } from "zod";
// import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const bodySchema = z.object({
    full_name: z.string().min(3).max(256).optional(),
    website: z.string().optional(),
    bio: z.string().max(256).optional(),
    occupation: z.string().max(256).optional()
  })
  const { success, data: body, error } = bodySchema.safeParse(await readBody(event))

  if (!success) {
    setResponseStatus(event, 422)
    return error.message
  }

  if (Object.keys(body).length === 0) {
    setResponseStatus(event, 400)
    return { error: 'nothing_sent'}
  }

  // prisma.profiles.update({
  // })

  return body
})
