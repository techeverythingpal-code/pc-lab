import { db } from "@/db";
import { schools } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function SchoolsPage() {
  await requireAdmin();
  const all = await db.select().from(schools).orderBy(desc(schools.createdAt));

  async function addSchool(formData: FormData) {
    "use server";
    await requireAdmin();
    const name = String(formData.get("name") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    if (!name) return;
    await db.insert(schools).values({ name, city: city || null });
    revalidatePath("/admin/schools");
  }

  async function deleteSchool(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = Number(formData.get("id"));
    if (!id) return;
    await db.delete(schools).where(eq(schools.id, id));
    revalidatePath("/admin/schools");
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <Link href="/" className="text-sm text-blue-600">← Home</Link>
      <h1 className="text-2xl font-semibold">Schools</h1>

      <form action={addSchool} className="flex gap-2">
        <input name="name" placeholder="School name" required className="flex-1 rounded border p-2" />
        <input name="city" placeholder="City (optional)" className="w-40 rounded border p-2" />
        <button className="rounded bg-blue-600 px-4 text-white">Add</button>
      </form>

      <ul className="divide-y rounded border bg-white">
        {all.length === 0 && <li className="p-3 text-gray-500">No schools yet.</li>}
        {all.map((s) => (
          <li key={s.id} className="flex items-center justify-between p-3">
            <div>
              <div className="font-medium">{s.name}</div>
              {s.city && <div className="text-sm text-gray-500">{s.city}</div>}
            </div>
            <form action={deleteSchool}>
              <input type="hidden" name="id" value={s.id} />
              <button className="text-sm text-red-600">Delete</button>
            </form>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500">
        Deleting a school also deletes its rooms and PCs.
      </p>
    </main>
  );
}