import { stringify } from "@/utils/string";
import { NextRequest, NextResponse } from "next/server";

const API_PATH = "/api/postmark/inbound/webhook";

export async function GET(request: NextRequest) {
  try {
    const data = await handler(request);
    return NextResponse.json(
      { data, message: "Hello World!" },
      { status: 200, statusText: "OK" },
    );
  } catch (error) {
    console.warn(API_PATH, { error: stringify(error) });
    return NextResponse.json(
      { error },
      { status: 500, statusText: "Internal Server Errror" },
    );
  }
}

async function handler(request: NextRequest) {
  const LOG_NAME = API_PATH + "." + handler.name;
  try {
    const body = Object.fromEntries(request.nextUrl.searchParams.entries());
    console.info(API_PATH, { body: stringify(body) });
    return body;
  } catch (error) {
    console.warn(LOG_NAME, { error: stringify(error) });
    throw error;
  }
}
