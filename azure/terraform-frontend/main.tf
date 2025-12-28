# Get zone info
data "cloudflare_zone" "domain" {
  zone_id = var.cloudflare_zone_id
}

# DNS Record: www subdomain
resource "cloudflare_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  content = var.storage_endpoint
  type    = "CNAME"
  proxied = true
  comment = "Points to Azure Storage"
}

# DNS Record: root domain
resource "cloudflare_record" "apex" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  content = var.storage_endpoint
  type    = "CNAME"
  proxied = true
  comment = "Points to Azure Storage"
}

# SSL and performance settings
resource "cloudflare_zone_settings_override" "settings" {
  zone_id = var.cloudflare_zone_id

  settings {
    ssl                      = "flexible"
    always_use_https         = "on"
    automatic_https_rewrites = "on"
    min_tls_version          = "1.2"
    security_level           = "medium"
    browser_check            = "on"
    brotli                   = "on"
    http3                    = "on"
    zero_rtt                 = "on"
  }
}

# Worker: Rewrite Host header for Azure Storage
resource "cloudflare_worker_script" "azure_proxy" {
  account_id = var.cloudflare_account_id
  name       = "azure-storage-proxy"
  content    = file("${path.module}/worker.js")

  compatibility_date = "2024-01-01"
}

# Route root domain through worker
resource "cloudflare_worker_route" "main" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "fazabillah.my/*"
  script_name = cloudflare_worker_script.azure_proxy.name
}

# Route www subdomain through worker
resource "cloudflare_worker_route" "www" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "www.fazabillah.my/*"
  script_name = cloudflare_worker_script.azure_proxy.name
}