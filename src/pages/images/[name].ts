import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const path = `images/${context.params.name}`
  const object = await context.locals.runtime.env.BUCKET.get(path)
  if (!object) return new Response("Not Found", { status: 404 })
  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set("etag", object.httpEtag)
  return new Response(object.body, { headers })
}