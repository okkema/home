export const onRequestGet: PagesFunction<ENV> = async function(context) {
  const { params, env } = context
  const object = await env.BUCKET.get(`images/${params.name}`)
  if (!object) return new Response("Not Found", { status: 404 })
  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set("etag", object.httpEtag)
  return new Response(object.body, { headers })
}
