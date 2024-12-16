import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import getSession from "@/lib/getSession";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async () => {
    const session = await getSession();

    if (!session || !session.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    return {
      user: session.user,
    };
  },
});

export const GET = handler;
export const POST = handler;
