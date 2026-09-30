import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Welcome, {session.user.name}</h1>
      <p>Role: {session.user.role}</p>
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