using './main.bicep'

// Region / naming
param location = 'centralindia'
param webAppName = 'sanskagarwal'
param appServicePlanName = 'plan-sanskagarwal'
param appServicePlanSku = 'P0v3'
param keyVaultName = 'sanskagarwal-kv'

// Heartbeat Function App + observability
param functionAppName = 'sanskagarwal-functions'
param functionStorageAccountName = 'stsanskagarwalfunc'
param logAnalyticsName = 'log-sanskagarwal'
param appInsightsName = 'appi-sanskagarwal'
param alertEmailAddress = readEnvironmentVariable('ALERT_EMAIL', '')

// Public static assets (resume PDF) + Azure Front Door
param assetsStorageAccountName = 'stsanskagarwalassets'
param frontDoorProfileName = 'afd-sanskagarwal'
param frontDoorEndpointName = 'sanskagarwal-assets'
param assetsCustomDomain = 'assets.sanskagarwal.com'

// Custom domains
param apexDomain = 'sanskagarwal.com'
param wwwDomain = 'www.sanskagarwal.com'

// Strapi CMS web app
param cmsAppName = 'sanskagarwal-cms'
param cmsDomain = 'admin.sanskagarwal.com'
param databaseCmsUsername = readEnvironmentVariable('DATABASE_CMS_USERNAME', '')

// Non-secret database config (supplied at deploy time via environment variables)
param databaseHost = readEnvironmentVariable('DATABASE_HOST', '')
param databaseName = readEnvironmentVariable('DATABASE_NAME', '')
param databaseUsername = readEnvironmentVariable('DATABASE_USERNAME', '')
param databasePort = readEnvironmentVariable('DATABASE_PORT', '5432')
param databaseSsl = 'true'
param databaseSslRejectUnauthorized = 'true'

// Secrets sourced from environment variables at deploy time (never commit values)
param databasePassword = readEnvironmentVariable('DATABASE_PASSWORD', '')
param tandoorToken = readEnvironmentVariable('TANDOOR_TOKEN', '')
param databaseCmsPassword = readEnvironmentVariable('DATABASE_CMS_PASSWORD', '')
param strapiAppKeys = readEnvironmentVariable('STRAPI_APP_KEYS', '')
param strapiApiTokenSalt = readEnvironmentVariable('STRAPI_API_TOKEN_SALT', '')
param strapiAdminJwtSecret = readEnvironmentVariable('STRAPI_ADMIN_JWT_SECRET', '')
param strapiTransferTokenSalt = readEnvironmentVariable('STRAPI_TRANSFER_TOKEN_SALT', '')
param strapiJwtSecret = readEnvironmentVariable('STRAPI_JWT_SECRET', '')
