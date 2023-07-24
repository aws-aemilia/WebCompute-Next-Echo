import querystring from "querystring";
import { NextResponse, NextRequest } from "next/server";

async function readBody(req: NextRequest) {
  try {
    console.log("reading body as FormData");
    const data = await req.clone().formData();
    let json: Record<string, FormDataEntryValue> = {};
    for (const [key, value] of data) {
      json[key] = value;
    }
    return json;
  } catch (err) {
    console.log("cannot read body as FormData");
  }

  try {
    console.log("reading body as JSON");
    return await req.clone().json();
  } catch (_) {
    console.log("cannot read body as JSON");
  }

  try {
    console.log("reading body as text");
    await req.clone().text();
  } catch (_) {
    console.log("cannot read body as text");
  }

  return "";
}

async function handler(req: NextRequest) {
  let body = await readBody(req);

  let requestHeaders = new Headers(req.headers);
  let headers: any = {};

  requestHeaders.forEach((value, key) => {
    headers[key] = value;
  });

  const url = new URL(req.url);
  const queryParams = querystring.parse(url.search.slice(1));

  const parts = {
    path: url.pathname,
    queryString: url.search,
    queryParams,
    method: req.method,
    headers: headers,
    httpVersion: (req as any).httpVersion,
    body,
  };

  return NextResponse.json(parts);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
