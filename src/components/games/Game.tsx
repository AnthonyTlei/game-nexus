import { GameType } from "@/lib/validation";

interface GameProps {
  game: GameType;
}

export default function Game({ game }: GameProps) {
  return <div>{game.name}</div>;
}
