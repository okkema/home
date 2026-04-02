locals {
  audience = "https://${module.zone.name}"
  scope = "write:settings"
}

module "page" {
  source     = "app.terraform.io/okkema/page/cloudflare"
  version    = "~> 1.0"

  account_id = var.cloudflare_account_id
  zone_id    = var.cloudflare_zone_id
  name       = var.github_repository
  repo_name  = var.github_repository
  hostnames  = ["@"]
  buckets    = [{ name = "BUCKET", bucket_name = module.bucket.id }]
  secrets = [
    { name = "OAUTH_CLIENT_ID", text = module.client.client_id, },
    { name = "OAUTH_AUDIENCE", text = local.audience, },
    { name = "OAUTH_TENANT", text = module.server.domain, },
    { name = "SENTRY_DSN", text = module.sentry.dsn, }
  ]
}

module "role" {
  source  = "app.terraform.io/okkema/role/auth0"
  version = "~> 0.1"

  name = var.auth0_role
  scopes = [
    { name = local.scope, audience = local.audience }
  ]
}

module "bucket" {
  source  = "app.terraform.io/okkema/bucket/cloudflare"
  version = "~> 2.0"

  account_id = var.cloudflare_account_id
  name       = var.github_repository
}


module "sentry" {
  source  = "app.terraform.io/okkema/project/sentry"
  version = "~> 0.4"

  github_repository   = var.github_repository
  platform            = "other"
}

module "zone" {
  source  = "app.terraform.io/okkema/zone/cloudflare"
  version = "~> 1.0"

  zone_id = var.cloudflare_zone_id
}

module "client" {
  source  = "app.terraform.io/okkema/client/auth0"
  version = "~> 1.0"

  name = var.github_repository
  callbacks = [
    "${local.audience}/auth/login/callback",
    "http://localhost:4321/auth/login/callback"
  ]
  logouts = [
    "${local.audience}/auth/logout/callback",
    "http://localhost:4321/auth/logout/callback"
  ]
}

module "server" {
  source  = "app.terraform.io/okkema/server/auth0"
  version = "~> 1.0"

  name       = var.github_repository
  identifier = local.audience
  scopes = [
    { name = local.scope, description = "Update settings" }
  ]
}
