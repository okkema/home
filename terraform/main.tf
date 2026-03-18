locals {
  secrets = {
    "TF_API_TOKEN" : var.TF_API_TOKEN,
    "ACTIONS_GITHUB_TOKEN" : var.ACTIONS_GITHUB_TOKEN,
    "NPM_TOKEN" : var.NPM_TOKEN
  }
}

module "secrets" {
  for_each = local.secrets

  source  = "app.terraform.io/okkema/secret/github"
  version = "~> 0.2"

  repository = var.github_repository
  key        = each.key
  value      = each.value
}

module "page" {
  source     = "app.terraform.io/okkema/page/cloudflare"
  version    = "~> 1.0"
  depends_on = [module.application, module.bucket]

  account_id = var.cloudflare_account_id
  zone_id    = var.cloudflare_zone_id
  name       = var.github_repository
  repo_name  = var.github_repository
  hostnames  = ["@"]
  buckets    = [{ name = "BUCKET", bucket_name = module.bucket.id }]
  secrets = [
    { name = "CLOUDFLARE_ACCESS_DOMAIN", text = var.CLOUDFLARE_ACCESS_DOMAIN, },
    { name = "CLOUDFLARE_ACCESS_AUD", text = module.application.aud, },
    { name = "SENTRY_DSN", text = module.sentry.dsn, }
  ]
}

module "application" {
  source     = "app.terraform.io/okkema/application/cloudflare"
  version    = "~> 1.1"
  depends_on = [module.role]

  account_id = var.cloudflare_account_id
  zone_id    = var.cloudflare_zone_id
  name       = var.github_repository
  role       = var.auth0_role
  use_root   = true
  path       = "edit"
}

module "role" {
  source  = "app.terraform.io/okkema/role/auth0"
  version = "~> 0.1"

  name = var.auth0_role
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