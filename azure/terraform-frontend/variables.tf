variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for fazabillah.my"
  type        = string
}

variable "domain_name" {
  description = "Your domain"
  type        = string
  default     = "fazabillah.my"
}

variable "storage_endpoint" {
  description = "Azure Storage endpoint (without https://)"
  type        = string
}