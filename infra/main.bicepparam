using './main.bicep'

// Region / naming
param location = 'centralindia'
param webAppName = 'sanskagarwal'
param appServicePlanName = 'plan-sanskagarwal'
param appServicePlanSku = 'P0v3'
param keyVaultName = 'kv-sanskagarwal'

// Custom domains
param apexDomain = 'sanskagarwal.com'
param wwwDomain = 'www.sanskagarwal.com'

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
param databaseCaCert = readEnvironmentVariable('DATABASE_CA_CERT', '')
