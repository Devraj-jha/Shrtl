import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { apiError, ApiError, safeHandler } from "@/lib/api";
import { patchLinkSchema } from "@/lib/validations/links";

export const runtime = "nodejs";

/**
 * Resolve a link but only if it belongs to the current user.
 * Throws ApiError 403 when the link isn't theirs.
 */
async function ownLink(id: string, userId: string) {
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) throw new ApiError(404, "NOT_FOUND", "That waypoint doesn't exist.");
  if (link.userId !== userId) {
    throw new ApiError(403, "FORBIDDEN", "That waypoint isn't yours to change.");
  }
  return link;
}

/** PATCH /api/links/[id] — edit title or archive/unarchive a waypoint. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return safeHandler(async () => {
    const user = await getCurrentUser();
    if (!user) return apiError(401, "UNAUTHORIZED", "Sign in to edit your chart.");
    const { id } = await params;

    const existing = await ownLink(id, user.id);

    const body = await req.json().catch(() => ({}));
    const parsed = patchLinkSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(422, "VALIDATION", parsed.error.issues[0]?.message ?? "Invalid input.");
    }
    const patch = parsed.data ?? {};

    const data: { title?: string; archivedAt?: Date | null } = {};

    if (patch.title !== undefined && patch.title !== existing.title) {
      data.title = patch.title;
    }
    // archive: true → set archivedAt; archive: false → clear it.
    if (patch.archive !== undefined) {
      data.archivedAt = patch.archive ? new Date() : null;
    }

    const link = await prisma.link.update({
      where: { id },
      data,
      select: {
        id: true,
        slug: true,
        title: true,
        archivedAt: true,
        expiresAt: true,
      },
    });

    return NextResponse.json({ link });
  });
}

/** DELETE /api/links/[id] — permanently delete a waypoint. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return safeHandler(async () => {
    const user = await getCurrentUser();
    if (!user) return apiError(401, "UNAUTHORIZED", "Sign in to edit your chart.");
    const { id } = await params;

    await ownLink(id, user.id);
    await prisma.link.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  });
}