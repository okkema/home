locals {
  secrets = {
    "TF_API_TOKEN" : var.TF_API_TOKEN,
    "ACTIONS_GITHUB_TOKEN" : var.ACTIONS_GITHUB_TOKEN
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
  version    = "~> 0.3"
  depends_on = [module.application, module.bucket]

  account_id     = var.cloudflare_account_id
  zone_id        = var.cloudflare_zone_id
  name           = var.github_repository
  repo_name      = var.github_repository
  pages_hostname = "@"
  production_buckets = {
    BUCKET = module.bucket.id
  }
  production_secrets = {
    CLOUDFLARE_ACCESS_DOMAIN = var.CLOUDFLARE_ACCESS_DOMAIN
    CLOUDFLARE_ACCESS_AUD    = module.application.aud
    SENTRY_DSN               = var.SENTRY_DSN
  }
}

module "application" {
  source     = "app.terraform.io/okkema/application/cloudflare"
  version    = "~> 0.4"
  depends_on = [module.team]

  zone_id      = var.cloudflare_zone_id
  name         = var.github_repository
  github_teams = [var.github_repository]
  use_root     = true
  path         = "edit"
}

module "team" {
  source  = "app.terraform.io/okkema/team/github"
  version = "~> 0.1"

  name = var.github_repository
}

module "bucket" {
  source  = "app.terraform.io/okkema/bucket/cloudflare"
  version = "~> 1.0"

  account_id = var.cloudflare_account_id
  name       = var.github_repository
}