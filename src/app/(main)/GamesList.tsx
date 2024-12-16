"use client";

import Game from "@/components/games/Game";
import GamesLoadingSkeleton from "@/components/games/GamesLoadingSkeleton";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import kyInstance from "@/lib/ky";
import { GamesPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function GamesList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["games", "all"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/games/",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<GamesPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const games = data?.pages.flatMap((page) => page.games) || [];

  if (status === "pending") {
    return <GamesLoadingSkeleton />;
  }

  if (status === "success" && !games.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">No games available.</p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading games.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {games.map((game) => (
        <Game key={game.id} game={game} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
