import prisma from "@/lib/prisma";

export const resolvers = {
  Query: {
    async games() {
      return await prisma.game.findMany();
    },
  },
};
