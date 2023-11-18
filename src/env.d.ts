/// <reference types="astro/client" />

type R2Bucket = import("@cloudflare/workers-types").R2Bucket
type ENV = {
  BUCKET: R2Bucket
  CLOUDFLARE_ACCESS_DOMAIN: string
  CLOUDFLARE_ACCESS_AUD: string
  SENTRY_DSN: string
}

type SemanticSIZES = import("semantic-ui-react").SemanticSIZES
type SemanticCOLORS = import("semantic-ui-react").SemanticCOLORS
type OpenGraphType = "website" | "profile"
type SchemaOrgType = "Organization"
type Link = {
  title: string
  href: string
  icon?: string
  color: SemanticCOLORS | ""
}
type Settings = {
  image: {
    src: string
    size: SemanticSIZES
    alt: string
  }
  title: {
    value: string
    visible: boolean
  }
  location: {
    value: string
    visible: boolean
  }
  description: {
    value: string
    visible: boolean
  }
  og: OpenGraphType
  schema: SchemaOrgType
  author: {
    name: string
    email: string
  }
  url: string
  links: Link[]
}

// Runtime type corresponds to "mode" in /astro.config.mjs
type Runtime = import("@astrojs/cloudflare").DirectoryRuntime<ENV>
declare namespace App {
  interface Locals extends Runtime {}
}
