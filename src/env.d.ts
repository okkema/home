/// <reference types="astro/client" />

type R2Bucket = import("@cloudflare/workers-types").R2Bucket
type ENV = {
  BUCKET: R2Bucket
  SENTRY_DSN: string
  OAUTH_AUDIENCE: string
  OAUTH_CLIENT_ID: string
  OAUTH_CLIENT_SECRET: string
  OAUTH_TENANT: string
  OAUTH_SCOPE: string
}

type OpenGraphType = "website" | "profile"
type SchemaOrgType = "Organization"
type Link = {
  title: string
  href: string
  icon?: string
  color: string
}
type Settings = {
  image: {
    src: string
    size: "mini" | "tiny" | "small" | "medium" | "large"
    alt: string
  }
  title: {
    value: string
    visible: boolean
  }
  location: {
    value: string
    visible: boolean
    icon?: string
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
type Runtime = import("@astrojs/cloudflare").Runtime<ENV>
declare namespace App {
  interface Locals extends Runtime {}
}