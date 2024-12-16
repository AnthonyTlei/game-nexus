import { Game } from "@prisma/client";

export interface GamesPage {
  games: Game[];
  nextCursor: string | null;
}

export type RawgGame = {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  tba: boolean;
  background_image: string | null;
  rating: number;
  added: number;
  genres?: { slug: string }[];
  tags?: { slug: string }[];
};
