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
    let json = await req.clone().json();
    return json;
  } catch (_) {
    console.log("cannot read body as JSON");
  }

  try {
    console.log("reading body as text");
    let text = await req.clone().text();
    console.log("text:", text)
    return text;
  } catch (_) {
    console.log("cannot read body as text");
  }

  return "";
}

function isImage(contentType: string | null) {
  return contentType && contentType.startsWith("image/");
}

async function handler(req: NextRequest) {
  let requestHeaders = new Headers(req.headers);
  let headers: any = {};

  if (isImage(requestHeaders.get("content-type"))) {
    console.log("handling image data");

    let body = await req.arrayBuffer();
    return new NextResponse(body, {
      headers: {
        "content-type": requestHeaders.get("content-type") || "",
      },
    });
  }

  requestHeaders.forEach((value, key) => {
    headers[key] = value;
  });

  let body = await readBody(req);

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
