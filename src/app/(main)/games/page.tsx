import getSession from "@/lib/getSession";
import GamesList from "../GamesList";
import { redirect } from "next/navigation";

export default async function Games() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/");
  }
  return <main>{<GamesList />}</main>;
}
