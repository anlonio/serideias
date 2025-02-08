import prisma from "~/lib/prisma"

export default defineEventHandler(async (_event) => {
  return {
    profiles: await prisma.profiles.findMany()
  }
})
