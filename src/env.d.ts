/// <reference types="astro/client" />

type R2Bucket = import("@cloudflare/workers-types").R2Bucket
type ENV = {
  BUCKET: R2Bucket
  CLOUDFLARE_ACCESS_DOMAIN: string
  CLOUDFLARE_ACCESS_AUD: string
  SENTRY_DSN: string
}

type SemanticSIZES = import("semantic-ui-react").SemanticSIZES
type Settings = {
  title: string
  description: string
  image: {
    src: string
    size: SemanticSIZES
  }
  links: {
    title: string
    href: string
  }[]
}

// Runtime type corresponds to "mode" in /astro.config.mjs
type Runtime = import("@astrojs/cloudflare").DirectoryRuntime<ENV>
declare namespace App {
  interface Locals extends Runtime {}
}
