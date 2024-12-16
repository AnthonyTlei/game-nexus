import { GameType } from "./validation";

export interface GamesPage {
  games: GameType[];
  nextCursor: string | null;
}
