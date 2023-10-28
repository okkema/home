import cloudflareAccessPlugin from "@cloudflare/pages-plugin-cloudflare-access"

export const onRequest: PagesFunction<ENV> = function(context) {
  // Cloudflare Access does not work while running locally
  const url = new URL(context.request.url)
  if (url.hostname === "localhost") return context.next()
  return cloudflareAccessPlugin({
    domain: `https://${context.env.CLOUDFLARE_ACCESS_DOMAIN}.cloudflareaccess.com`,
    aud: context.env.CLOUDFLARE_ACCESS_AUD,
  })(context)
}
