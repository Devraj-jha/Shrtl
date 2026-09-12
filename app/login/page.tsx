import { signIn } from "@/auth";
import { WaypointMarker } from "@/components/waypoint-marker";

async function signInGithub(formData: FormData) {
  "use server";
  const callbackUrl = formData.get("callbackUrl")?.toString() ?? "/dashboard";
  await signIn("github", { redirectTo: callbackUrl });
}

async function signInEmail(formData: FormData) {
  "use server";
  const email = formData.get("email")?.toString() ?? "";
  await signIn("email", { email, redirectTo: "/dashboard" });
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ink-deep text-paper">
      <div
        aria-hidden
        className="absolute inset-0 bg-contour-dark opacity-70"
      />
      <div
        aria-hidden
        className="absolute -left-16 top-10 h-72 w-72 rounded-full border border-brass/30"
      />
      <div
        aria-hidden
        className="absolute -right-20 bottom-10 h-96 w-96 rounded-full border border-brass/20"
      />

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="mb-8 flex items-center gap-3">
          <WaypointMarker className="h-9 w-9 text-brass" dotFill="var(--brass)" label="Waypoint mark" />
          <span className="font-display text-2xl font-semibold tracking-wide">Waypoint</span>
        </div>

        <h1 className="font-display text-3xl font-semibold">Plot your first waypoint</h1>
        <p className="mt-2 text-sm text-paper/70">
          Sign in to chart a course. No password required — a magic link lands in your inbox.
        </p>

        <div className="mt-8 space-y-4">
          <form action={signInGithub}>
            <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/dashboard"} />
            <button
              type="submit"
              className="w-full rounded-md bg-paper px-4 py-3 text-sm font-semibold text-ink-deep transition hover:bg-brass hover:text-ink-deep"
            >
              Continue with GitHub
            </button>
          </form>

          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-paper/40">
            <span className="h-px flex-1 bg-depth-line" />
            or
            <span className="h-px flex-1 bg-depth-line" />
          </div>

          <form action={signInEmail} className="space-y-3">
            <label className="block text-sm font-medium" htmlFor="email">
              Email — get a magic link
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-md bg-ink-mid/60 px-4 py-3 text-sm text-paper ring-1 ring-inset ring-brass/30 placeholder:text-paper/30 focus:ring-2 focus:ring-coral"
            />
            <button
              type="submit"
              className="w-full rounded-md border border-brass px-4 py-3 text-sm font-semibold text-brass transition hover:bg-brass hover:text-ink-deep"
            >
              Send magic link
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}