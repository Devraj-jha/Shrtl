import { z } from "zod";

/** 3–16 chars, letters/digits, optional single dashes between segments. */
const slugRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,14}[a-zA-Z0-9]$/;

/** Slugs that would shadow app routes or the short-redirect prefix. */
const RESERVED_SLUGS = new Set([
  "api",
  "auth",
  "login",
  "logout",
  "dashboard",
  "pricing",
  "settings",
  "r",
  "www",
  "favicon",
]);

export const createLinkSchema = z.object({
  longUrl: z
    .string()
    .min(1, "A destination URL is required.")
    .max(2048)
    .refine((v) => {
      try {
        const u = new URL(v);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    }, "That doesn't look like a valid http(s) URL."),
  slug: z
    .string()
    .regex(slugRegex, "Slugs are 3–16 chars of letters, digits, and dashes.")
    .refine((s) => !RESERVED_SLUGS.has(s.toLowerCase()), "That slug is reserved.")
    .optional()
    .or(z.literal("").optional()),
  title: z.string().max(80, "Keep titles under 80 characters.").optional(),
});

export const patchLinkSchema = z
  .object({
    title: z.string().max(80).optional(),
    archivedAt: z.union([z.literal(""), z.date()]).optional(),
    archive: z.boolean().optional(),
  })
  .optional();

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type PatchLinkInput = z.infer<typeof patchLinkSchema>;