import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <main className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Welcome, {session.user.name}</h1>
      <p>Role: {session.user.role}</p>

      {session.user.role === "admin" && (
        <div className="flex gap-3">
          <Link href="/admin/schools" className="rounded bg-blue-600 px-3 py-2 text-white">Manage schools</Link>
          <Link href="/admin/users" className="rounded bg-blue-600 px-3 py-2 text-white">Manage users</Link>
        </div>
      )}

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button className="rounded bg-gray-800 px-3 py-2 text-white">Sign out</button>
      </form>
    </main>
  );
}