import { defineMiddleware } from "astro:middleware"

const PACKAGE_NAME = "@okkema/home"
const PACKAGE_VERSION = "development"

async function captureException(error: any, request: Request, DSN: string) {
  const { origin, pathname, username } = new URL(DSN)
  const url = `${origin}/api${pathname}/store/?sentry_key=${username}&sentry_version=7&sentry_client=${PACKAGE_VERSION}`
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        event_id: crypto.randomUUID(),
        timestamp: new Date().toISOString().substr(0, 19),
        platform: "javascript",
        sdk: {
          name: PACKAGE_NAME,
          version: PACKAGE_VERSION,
        },
        level: "error",
        transaction: request.url,
        server_name: "cloudflare",
        environment: "development",
        exception: {
          values: [
            {
              type: error.name,
              value: error.message,
            },
          ],
        },
        request: {
          url: request.url,
          method: request.method,
        },
      }),
    })
    return (await response.json<{ id: string }>()).id
  } catch (error) {
    return null
  }
}

export const onRequest = defineMiddleware(async function(context, next) {
  try {
    const response = await next()
    return response
  } catch (error) {
    const id = await captureException(error, context.request, process.env.SENTRY_DSN!)
    const message = `An error occurred while rendering the page. Please contact the administrator with the following identifier: ${id}`
    return new Response(message)
  }
})