variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "resume-fazabillah"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "eastus"
}

variable "cosmosdb_database_name" {
  description = "CosmosDB database name"
  type        = string
  default     = "viewCounterDb"
}

variable "cosmosdb_container_name" {
  description = "CosmosDB container name"
  type        = string
  default     = "counter"
}

variable "function_app_name_prefix" {
  description = "Prefix for Function App name"
  type        = string
  default     = "faza-counter"
}

variable "allowed_origins" {
  description = "CORS allowed origins"
  type        = list(string)
  default     = ["*"]
}