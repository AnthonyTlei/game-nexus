# Game Nexus

Game Nexus is an online game catalogue that allows users to explore, track, and get personalized game recommendations using advanced vector-based similarity matching. The platform is built technologies like Next.js 15, Prisma, Neon PostgreSQL, GraphQL, and OpenAI embeddings to deliver fast and accurate recommendations.

## Features

- User authentication with NextAuth v5
- Personalized game recommendations based on user-owned games
- Integration with RAWG API for game data
- Vector-based AI recommendations using OpenAI embeddings
- GraphQL API for flexible data querying
- Admin tools for managing the game database and embeddings

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/), [ShadCN UI](https://ui.shadcn.dev/)
- **Backend**: [GraphQL](https://graphql.org/), [Apollo Server](https://www.apollographql.com/)
- **Database**: [Neon PostgreSQL](https://neon.tech/), [Prisma ORM](https://www.prisma.io/)
- **AI**: [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- **Hosting**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (Neon recommended)
- RAWG API Key ([Get yours here](https://rawg.io/apidocs))
- OpenAI API Key ([Get yours here](https://platform.openai.com/signup))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AnthonyTlei/game-nexus.git
   cd game-nexus
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a .env file in the root directory and add the variables from .env.example
4. Set up the database:
   ```bash
   npx prisma db push
   ```
5. Add vector support for neon
   In the neon project page, execute:
   ```
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
