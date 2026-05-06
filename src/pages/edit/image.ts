import type { APIContext } from "astro"

function getExtensionFromType(type: string | null) {
  if (!type) throw new Error("Missing Content-Type header")
  if (type.startsWith("image/")) return type.split("/")[1]
  throw new Error("Unsupported MIME type")
}

async function getFileHash(buffer: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-1", buffer)
  const array = Array.from(new Uint8Array(digest))
  return array.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function PUT(context: APIContext) {
  const ext = getExtensionFromType(context.request.headers.get("Content-Type"))
  const buffer = await context.request.arrayBuffer()
  const hash = await getFileHash(buffer)
  const name = `images/${hash}.${ext}`
  await context.locals.runtime.env.BUCKET.put(name, buffer)
  return new Response(JSON.stringify({ path: `/${name}` }), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}