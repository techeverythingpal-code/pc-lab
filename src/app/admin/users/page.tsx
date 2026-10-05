import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import Link from "next/link";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;
  const all = await db
    .select({ id: users.id, name: users.name, username: users.username, role: users.role })
    .from(users)
    .orderBy(asc(users.id));

  async function addUser(formData: FormData) {
    "use server";
    await requireAdmin();
    const name = String(formData.get("name") ?? "").trim();
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const role = formData.get("role") === "admin" ? "admin" : "user";

    if (!name || !username || password.length < 6) redirect("/admin/users?error=invalid");

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.username, username));
    if (existing.length) redirect("/admin/users?error=exists");

    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(users).values({ name, username, passwordHash, role });
    revalidatePath("/admin/users");
    redirect("/admin/users");
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <Link href="/" className="text-sm text-blue-600">← Home</Link>
      <h1 className="text-2xl font-semibold">Users</h1>

      {error === "invalid" && (
        <p className="text-sm text-red-600">Fill all fields. Password must be at least 6 characters.</p>
      )}
      {error === "exists" && <p className="text-sm text-red-600">That username is already taken.</p>}

      <form action={addUser} className="grid grid-cols-2 gap-2 rounded border bg-white p-4">
        <input name="name" placeholder="Full name" required className="rounded border p-2" />
        <input name="username" placeholder="Username" required className="rounded border p-2" />
        <input name="password" type="password" placeholder="Password (min 6)" required className="rounded border p-2" />
        <select name="role" className="rounded border p-2">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="col-span-2 rounded bg-blue-600 p-2 text-white">Create user</button>
      </form>

      <ul className="divide-y rounded border bg-white">
        {all.map((u) => (
          <li key={u.id} className="flex justify-between p-3">
            <span>{u.name} <span className="text-gray-500">({u.username})</span></span>
            <span className="text-sm text-gray-600">{u.role}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}