import { NextRequest, NextResponse } from "next/server";
import { controlPostmarkWebhook } from "./webhook/controller";

export async function GET() {
  console.log("hi");
  return NextResponse.json({ message: "Hello World." }, { status: 200 });
}

export async function POST(request: NextRequest) {
  console.log("hi");
  await controlPostmarkWebhook(request);
  return NextResponse.json({ message: "Hello World." }, { status: 200 });
}
