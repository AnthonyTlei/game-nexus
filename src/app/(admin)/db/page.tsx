import getSession from "@/lib/getSession";
import AdminDashboard from "./AdminDashboard";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <main>
      <AdminDashboard />
    </main>
  );
}
