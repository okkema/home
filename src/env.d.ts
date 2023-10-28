/// <reference types="astro/client" />

type R2Bucket = import("@cloudflare/workers-types").R2Bucket
type ENV = {
  BUCKET: R2Bucket
  CLOUDFLARE_ACCESS_DOMAIN: string
  CLOUDFLARE_ACCESS_AUD: striing
  CLOUDFLARE_ZONE: string
  SENTRY_DSN: string
}

// Runtime type corresponds to "mode" in /astro.config.mjs
type Runtime = import("@astrojs/cloudflare").DirectoryRuntime<ENV>
declare namespace App {
  interface Locals extends Runtime {}
}
