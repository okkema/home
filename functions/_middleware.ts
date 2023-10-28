import sentryPlugin from "@cloudflare/pages-plugin-sentry"

export const onRequest: PagesFunction<ENV> = function(context) {
  return sentryPlugin({
    dsn: context.env.SENTRY_DSN,
  })(context)
}
