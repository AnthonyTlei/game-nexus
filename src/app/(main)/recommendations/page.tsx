import getSession from "@/lib/getSession";
import RecommendationsList from "./RecommendationsList";
import { redirect } from "next/navigation";

export default async function Recommendation() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/");
  }
  return <RecommendationsList />;
}
