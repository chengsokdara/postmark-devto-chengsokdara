import { controlPostmarkWebhook } from "@/app/api/postmark/webhook/controller";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export const GET = () => {
  return NextResponse.json({ message: "Hello World." }, { status: 200 });
};

export const POST = controlPostmarkWebhook;
