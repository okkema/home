export const onRequestPost: PagesFunction<ENV> = async function(context) {
  const settings = await context.request.json()
  await context.env.BUCKET.put("settings.json", JSON.stringify(settings))
  return new Response(JSON.stringify(settings), {
    headers: { "Content-Type": "application/json" },
  })
}