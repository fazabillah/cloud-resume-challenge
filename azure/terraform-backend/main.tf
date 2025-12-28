# Get existing resource group
data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

# Unique suffix for globally unique names
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# ============================================
# COSMOSDB
# ============================================

resource "azurerm_cosmosdb_account" "main" {
  name                = "cosmos-${var.function_app_name_prefix}-${random_string.suffix.result}"
  location            = data.azurerm_resource_group.main.location
  resource_group_name = data.azurerm_resource_group.main.name

  # IMPORTANT: Enable free tier
  enable_free_tier = true
  offer_type       = "Standard"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = data.azurerm_resource_group.main.location
    failover_priority = 0
  }

  capabilities {
    name = "EnableServerless"
  }

  tags = {
    Environment = "Production"
    Project     = "CloudResume"
  }
}

resource "azurerm_cosmosdb_sql_database" "main" {
  name                = var.cosmosdb_database_name
  resource_group_name = data.azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
}

resource "azurerm_cosmosdb_sql_container" "main" {
  name                = var.cosmosdb_container_name
  resource_group_name = data.azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_path  = "/id"
  default_ttl         = -1
}

# ============================================
# STORAGE (for Azure Functions)
# ============================================

resource "azurerm_storage_account" "function" {
  name                     = "stfunc${random_string.suffix.result}"
  resource_group_name      = data.azurerm_resource_group.main.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    Environment = "Production"
    Project     = "CloudResume"
  }
}

# ============================================
# APP SERVICE PLAN (Consumption)
# ============================================

resource "azurerm_service_plan" "main" {
  name                = "plan-${var.function_app_name_prefix}-${random_string.suffix.result}"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "Y1"

  tags = {
    Environment = "Production"
    Project     = "CloudResume"
  }
}

# ============================================
# AZURE FUNCTION APP
# ============================================

resource "azurerm_linux_function_app" "main" {
  name                = "func-${var.function_app_name_prefix}-${random_string.suffix.result}"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = var.location

  storage_account_name       = azurerm_storage_account.function.name
  storage_account_access_key = azurerm_storage_account.function.primary_access_key
  service_plan_id            = azurerm_service_plan.main.id

  site_config {
    application_stack {
      python_version = "3.11"
    }

    cors {
      allowed_origins = var.allowed_origins
    }
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"       = "python"
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
    "COSMOSDB_ENDPOINT"              = azurerm_cosmosdb_account.main.endpoint
    "COSMOSDB_KEY"                   = azurerm_cosmosdb_account.main.primary_key
    "COSMOSDB_DATABASE_NAME"         = var.cosmosdb_database_name
    "COSMOSDB_CONTAINER_NAME"        = var.cosmosdb_container_name
    "COSMOSDB_PARTITION_KEY"         = "global"
  }

  tags = {
    Environment = "Production"
    Project     = "CloudResume"
  }
}