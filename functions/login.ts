import { generateLoginURL } from "@cloudflare/pages-plugin-cloudflare-access/api"

export const onRequest: PagesFunction<ENV> = function(context) {
  const Location = generateLoginURL({
    redirectURL: `https://${context.env.CLOUDFLARE_ZONE}/edit`,
    domain: `https://${context.env.CLOUDFLARE_ACCESS_DOMAIN}.cloudflareaccess.com`,
    aud: context.env.CLOUDFLARE_ACCESS_AUD,
  })
  return new Response(null, {
    status: 302,
    headers: { Location },
  })
}