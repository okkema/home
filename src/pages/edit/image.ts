import type { APIContext } from "astro"

function getExtensionFromType(type: string) {
  if (type.startsWith("image/")) return type.split("/")[1]
  throw new Error("Unsupported MIME type")
}

async function getFileHash(file: File) {
  const buffer = await file.arrayBuffer()
  const digest = await crypto.subtle.digest("SHA-1", buffer)
  const array = Array.from(new Uint8Array(digest))
  return array.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function POST(context: APIContext) {
  const formData = await context.request.formData()
  const file = formData.get("file") as File
  const ext = getExtensionFromType(file.type)
  const hash = await getFileHash(file)
  const name = `images/${hash}.${ext}`
  await context.locals.runtime.env.BUCKET.put(name, file.stream())
  return new Response(JSON.stringify({ path: `/${name}` }), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}