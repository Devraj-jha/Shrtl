import { NextResponse } from "next/server";

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** Typed JSON error body: { error: { code, message } }. */
export function apiError(status: number, code: string, message: string) {
  return NextResponse.json(
    { error: { code, message } },
    { status }
  );
}

export function safeHandler(
  handler: () => Promise<NextResponse>,
  fallback = "Something went wrong."
) {
  return handler().catch((err: unknown) => {
    if (err instanceof ApiError) return apiError(err.status, err.code, err.message);
    console.error(err);
    return apiError(500, "INTERNAL", fallback);
  });
}