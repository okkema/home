variable "cloudflare_account_id" {}
variable "cloudflare_zone_id" {}
variable "github_repository" {}
variable "google_email" {
  sensitive = true
}

# GitHub Actions Secrets
variable "TF_API_TOKEN" {
  sensitive = true
}
variable "ACTIONS_GITHUB_TOKEN" {
  sensitive = true
}

# Environment Variables
variable "SENTRY_DSN" {
  sensitive = true
}
variable "CLOUDFLARE_ACCESS_DOMAIN" {}