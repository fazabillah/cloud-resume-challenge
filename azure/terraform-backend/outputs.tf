output "function_app_name" {
  description = "Name of the Function App"
  value       = azurerm_linux_function_app.main.name
}

output "function_app_url" {
  description = "Function App base URL"
  value       = "https://${azurerm_linux_function_app.main.default_hostname}"
}

output "function_api_endpoint" {
  description = "Full API endpoint URL"
  value       = "https://${azurerm_linux_function_app.main.default_hostname}/api/view_counter"
}

output "cosmosdb_account_name" {
  description = "CosmosDB account name"
  value       = azurerm_cosmosdb_account.main.name
}

output "cosmosdb_endpoint" {
  description = "CosmosDB endpoint"
  value       = azurerm_cosmosdb_account.main.endpoint
}

output "resource_group_name" {
  description = "Resource group name"
  value       = data.azurerm_resource_group.main.name
}

output "cosmosdb_primary_key" {
  description = "CosmosDB primary key"
  value       = azurerm_cosmosdb_account.main.primary_key
  sensitive   = true
}