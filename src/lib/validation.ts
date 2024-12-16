import { z } from "zod";

export const GameSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  released: z.string(),
  tba: z.boolean(),
  background_image: z.string(),
  rating: z.number(),
  added: z.number(),
});

export type GameType = z.infer<typeof GameSchema>;
