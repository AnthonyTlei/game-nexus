import { z } from "zod";

const GenreTagSchema = z.object({
  slug: z.string(),
});

export const GameSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  released: z.string().nullable(),
  tba: z.boolean(),
  background_image: z.string().nullable(),
  rating: z.number(),
  added: z.number(),
  genres: z
    .array(GenreTagSchema)
    .default([])
    .transform((genres) => genres.map((g) => g.slug)),
  tags: z
    .array(GenreTagSchema)
    .default([])
    .transform((tags) => tags.map((t) => t.slug)),
});

export type GameType = z.infer<typeof GameSchema>;
