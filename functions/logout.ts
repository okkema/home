import { generateLogoutURL } from "@cloudflare/pages-plugin-cloudflare-access/api"

export const onRequest: PagesFunction<ENV> = function(context) {
  const Location =  generateLogoutURL({
    domain: `https://${context.env.CLOUDFLARE_ACCESS_DOMAIN}.cloudflareaccess.com`,
  })
  return new Response(null, {
    status: 302,
    headers: { Location },
  })
}
