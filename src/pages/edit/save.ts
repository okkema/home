import type { APIContext } from "astro"

export async function POST(context: APIContext) {
  const settings = await context.request.json()
  await context.locals.runtime.env.BUCKET.put("settings.json", JSON.stringify(settings))
  return new Response(JSON.stringify(settings), {
    headers: { "Content-Type": "application/json" },
  })
}