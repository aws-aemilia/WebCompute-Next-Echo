import querystring from 'querystring';
import { NextResponse, NextRequest } from "next/server";

async function handler(req: NextRequest, context: any) {
  let body = "";

  try {
    console.log("reading body as JSON");
    body = await req.json();
  } catch (err) {
    console.log("cannot read body as JSON");
  }

  if (!body) {
    try {
      console.log("reading body as text");
      const body = await req.text();

      console.log("body: ", body);
    } catch (_) {
      console.log("cannot read body as text");
    }
  }

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
