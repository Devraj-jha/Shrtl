import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { WaypointMarker } from "@/components/waypoint-marker";

async function SignOut() {
  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-deep hover:bg-brass/20"
      >
        Sign out
      </button>
    </form>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-svh bg-paper text-text-primary">
      <header className="border-b border-grid-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 no-underline">
              <WaypointMarker className="h-6 w-6 text-brass" dotFill="var(--brass)" />
              <span className="font-display text-lg font-semibold tracking-wide">Waypoint</span>
            </Link>
            <nav className="hidden items-center gap-1 text-sm sm:flex">
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-1.5 font-medium text-ink-deep no-underline hover:bg-brass/20"
              >
                Chart
              </Link>
              <Link
                href="/dashboard/settings"
                className="rounded-md px-3 py-1.5 font-medium text-ink-deep no-underline hover:bg-brass/20"
              >
                Settings
              </Link>
              <Link
                href="/pricing"
                className="ml-2 rounded-md px-3 py-1.5 font-medium text-text-muted no-underline hover:bg-brass/20"
              >
                Pro
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-text-muted md:inline">
              {session.user.name ?? session.user.email}
            </span>
            <SignOut />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}