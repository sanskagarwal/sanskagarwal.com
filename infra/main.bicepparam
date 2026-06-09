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

// Custom domains
param apexDomain = 'sanskagarwal.com'
param wwwDomain = 'www.sanskagarwal.com'

// Strapi CMS web app
param cmsAppName = 'sanskagarwal-cms'
param cmsDomain = 'admin.sanskagarwal.com'
param databaseCmsUsername = 'cms_user'

// Non-secret database config (edit to match your environment)
param databaseHost = ''
param databaseName = ''
param databaseUsername = ''
param databasePort = '5432'
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
