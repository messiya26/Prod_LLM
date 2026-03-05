import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://prod-llm.onrender.com/api/v1/health", {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json({ status: "ok", backend: data });
  } catch {
    return NextResponse.json({ status: "backend_sleeping" }, { status: 503 });
  }
}

export const revalidate = 0;
