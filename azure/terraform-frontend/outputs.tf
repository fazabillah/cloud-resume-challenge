output "website_url" {
  description = "Your website URL"
  value       = "https://${var.domain_name}"
}

output "www_url" {
  description = "WWW subdomain URL"
  value       = "https://www.${var.domain_name}"
}

output "nameservers" {
  description = "Cloudflare nameservers"
  value       = data.cloudflare_zone.domain.name_servers
}

output "zone_status" {
  description = "Zone status"
  value       = data.cloudflare_zone.domain.status
}