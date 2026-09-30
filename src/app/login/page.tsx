import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        username: formData.get("username"),
        password: formData.get("password"),
        redirectTo: "/",
      });
    } catch (e) {
      if (e instanceof AuthError) redirect("/login?error=1");
      throw e;
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form action={login} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">PC Lab Login</h1>
        {error && <p className="text-sm text-red-600">Wrong username or password.</p>}
        <input name="username" placeholder="Username" required className="w-full rounded border p-2" />
        <input name="password" type="password" placeholder="Password" required className="w-full rounded border p-2" />
        <button className="w-full rounded bg-blue-600 p-2 text-white">Sign in</button>
      </form>
    </main>
  );
}