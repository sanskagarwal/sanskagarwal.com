targetScope = 'resourceGroup'

@description('Azure region for all resources.')
param location string = 'centralindia'

@description('Name of the web app.')
param webAppName string = 'sanskagarwal'

@description('Name of the App Service Plan to create.')
param appServicePlanName string = 'plan-sanskagarwal'

@description('SKU for the App Service Plan (e.g. P0v3, P1v3; B1 minimum for custom domains + always on).')
param appServicePlanSku string = 'P0v3'

@description('Name of the Key Vault for secret app settings.')
param keyVaultName string

@description('Name of the Function App that runs the heartbeat health checks.')
param functionAppName string = 'sanskagarwal-functions'

@description('Name of the storage account used by the Functions host (3-24 lowercase alphanumeric).')
param functionStorageAccountName string

@description('Name of the storage account for public static assets (3-24 lowercase alphanumeric).')
param assetsStorageAccountName string

@description('Name of the Front Door (CDN) profile for static assets.')
param frontDoorProfileName string = 'afd-sanskagarwal'

@description('Name of the Front Door endpoint for static assets.')
param frontDoorEndpointName string = 'sanskagarwal-assets'

@description('Name of the Log Analytics workspace.')
param logAnalyticsName string = 'log-sanskagarwal'

@description('Name of the Application Insights component.')
param appInsightsName string = 'appi-sanskagarwal'

@description('Email address notified when a heartbeat alert fires.')
param alertEmailAddress string

@description('Apex custom domain (e.g. sanskagarwal.com).')
param apexDomain string = 'sanskagarwal.com'

@description('www custom domain (e.g. www.sanskagarwal.com).')
param wwwDomain string = 'www.sanskagarwal.com'

@description('Name of the Strapi CMS web app.')
param cmsAppName string = 'sanskagarwal-cms'

@description('CMS custom domain (e.g. admin.sanskagarwal.com).')
param cmsDomain string = 'admin.sanskagarwal.com'

@description('Postgres username for the CMS (Strapi) role.')
param databaseCmsUsername string = 'cms_user'

// --- Non-secret app settings ---
@description('Postgres host.')
param databaseHost string

@description('Postgres database name.')
param databaseName string

@description('Postgres username.')
param databaseUsername string

@description('Postgres port.')
param databasePort string = '5432'

@description('Set to "false" to disable TLS to the database.')
param databaseSsl string = 'true'

@description('Set to "false" to allow self-signed DB certificates.')
param databaseSslRejectUnauthorized string = 'true'

// --- Secrets (seeded into Key Vault) ---
@secure()
@description('Postgres password.')
param databasePassword string

@secure()
@description('Tandoor API token.')
param tandoorToken string

@secure()
@description('Postgres password for the CMS (cms_user) role.')
param databaseCmsPassword string = ''

@secure()
@description('Strapi APP_KEYS (comma-separated list).')
param strapiAppKeys string = ''

@secure()
@description('Strapi API_TOKEN_SALT.')
param strapiApiTokenSalt string = ''

@secure()
@description('Strapi ADMIN_JWT_SECRET.')
param strapiAdminJwtSecret string = ''

@secure()
@description('Strapi TRANSFER_TOKEN_SALT.')
param strapiTransferTokenSalt string = ''

@secure()
@description('Strapi users-permissions JWT_SECRET.')
param strapiJwtSecret string = ''

var customHostnames = [
  {
    name: apexDomain
    dnsRecordType: 'A'
    webAppName: webAppName
  }
  {
    name: wwwDomain
    dnsRecordType: 'CName'
    webAppName: webAppName
  }
]

var nonSecretAppSettings = [
  {
    name: 'DATABASE_HOST'
    value: databaseHost
  }
  {
    name: 'DATABASE_NAME'
    value: databaseName
  }
  {
    name: 'DATABASE_USERNAME'
    value: databaseUsername
  }
  {
    name: 'DATABASE_PORT'
    value: databasePort
  }
  {
    name: 'DATABASE_SSL'
    value: databaseSsl
  }
  {
    name: 'DATABASE_SSL_REJECT_UNAUTHORIZED'
    value: databaseSslRejectUnauthorized
  }
]

var webAppSecretRefs = [
  {
    name: 'DATABASE_PASSWORD'
    secretName: 'database-password'
  }
  {
    name: 'TANDOOR_TOKEN'
    secretName: 'tandoor-token'
  }
]

var cmsCustomHostnames = [
  {
    name: cmsDomain
    dnsRecordType: 'CName'
    webAppName: cmsAppName
  }
]

// All custom hostnames across both apps, used to drive the managed-certificate
// and SNI-binding passes in a single loop.
var allCustomHostnames = concat(customHostnames, cmsCustomHostnames)

var cmsNonSecretAppSettings = [
  {
    name: 'NODE_ENV'
    value: 'production'
  }
  {
    name: 'DATABASE_CLIENT'
    value: 'postgres'
  }
  {
    name: 'DATABASE_HOST'
    value: databaseHost
  }
  {
    name: 'DATABASE_NAME'
    value: databaseName
  }
  {
    name: 'DATABASE_USERNAME'
    value: databaseCmsUsername
  }
  {
    name: 'DATABASE_PORT'
    value: databasePort
  }
  {
    name: 'DATABASE_SSL'
    value: databaseSsl
  }
  {
    name: 'DATABASE_SSL_REJECT_UNAUTHORIZED'
    value: databaseSslRejectUnauthorized
  }
]

var cmsSecretRefs = [
  {
    name: 'DATABASE_PASSWORD'
    secretName: 'database-cms-password'
  }
  {
    name: 'APP_KEYS'
    secretName: 'strapi-app-keys'
  }
  {
    name: 'API_TOKEN_SALT'
    secretName: 'strapi-api-token-salt'
  }
  {
    name: 'ADMIN_JWT_SECRET'
    secretName: 'strapi-admin-jwt-secret'
  }
  {
    name: 'TRANSFER_TOKEN_SALT'
    secretName: 'strapi-transfer-token-salt'
  }
  {
    name: 'JWT_SECRET'
    secretName: 'strapi-jwt-secret'
  }
]

module keyVault 'modules/keyVault.bicep' = {
  name: 'keyVault'
  params: {
    name: keyVaultName
    location: location
    databasePassword: databasePassword
    tandoorToken: tandoorToken
    databaseCmsPassword: databaseCmsPassword
    strapiAppKeys: strapiAppKeys
    strapiApiTokenSalt: strapiApiTokenSalt
    strapiAdminJwtSecret: strapiAdminJwtSecret
    strapiTransferTokenSalt: strapiTransferTokenSalt
    strapiJwtSecret: strapiJwtSecret
  }
}

module appServicePlan 'modules/appServicePlan.bicep' = {
  name: 'appServicePlan'
  params: {
    name: appServicePlanName
    location: location
    skuName: appServicePlanSku
  }
}

module webApp 'modules/webApp.bicep' = {
  name: 'webApp'
  params: {
    name: webAppName
    location: location
    serverFarmId: appServicePlan.outputs.id
    keyVaultName: keyVault.outputs.name
    appSettings: nonSecretAppSettings
    customHostnames: customHostnames
    keyVaultSecretRefs: webAppSecretRefs
  }
}

// --- Strapi CMS web app (shares the existing App Service Plan) ---
module cmsApp 'modules/webApp.bicep' = {
  name: 'cmsApp'
  params: {
    name: cmsAppName
    location: location
    serverFarmId: appServicePlan.outputs.id
    keyVaultName: keyVault.outputs.name
    appSettings: cmsNonSecretAppSettings
    customHostnames: cmsCustomHostnames
    keyVaultSecretRefs: cmsSecretRefs
  }
}

// Grant each app's managed identity read access to the Key Vault secrets.
var keyVaultReaderNames = [
  'keyVaultRoleAssignment'
  'cmsKeyVaultRoleAssignment'
]

module keyVaultRoleAssignments 'modules/keyVaultRoleAssignment.bicep' = [
  for (readerName, i) in keyVaultReaderNames: {
    name: readerName
    params: {
      keyVaultName: keyVault.outputs.name
      principalId: i == 0 ? webApp.outputs.principalId : cmsApp.outputs.principalId
    }
  }
]

// --- Observability: Log Analytics + workspace-based Application Insights ---
module logAnalytics 'modules/logAnalytics.bicep' = {
  name: 'logAnalytics'
  params: {
    name: logAnalyticsName
    location: location
  }
}

module appInsights 'modules/appInsights.bicep' = {
  name: 'appInsights'
  params: {
    name: appInsightsName
    location: location
    workspaceId: logAnalytics.outputs.id
  }
}

// --- Heartbeat Function App (shares the existing App Service Plan) ---
module functionStorage 'modules/storageAccount.bicep' = {
  name: 'functionStorage'
  params: {
    name: functionStorageAccountName
    location: location
  }
}

module functionApp 'modules/functionApp.bicep' = {
  name: 'functionApp'
  params: {
    name: functionAppName
    location: location
    serverFarmId: appServicePlan.outputs.id
    storageAccountName: functionStorage.outputs.name
    appInsightsConnectionString: appInsights.outputs.connectionString
  }
}

// Identity-based access to the Functions host storage (keyless): Blob Data
// Owner + Queue Data Contributor cover the host's runtime storage needs.
module functionStorageRoles 'modules/storageRoleAssignment.bicep' = {
  name: 'functionStorageRoles'
  params: {
    storageAccountName: functionStorage.outputs.name
    principalId: functionApp.outputs.principalId
    roleDefinitionIds: [
      'b7e6dc6d-f1e8-4753-8033-0f276bb0955b' // Storage Blob Data Owner
      '974c5e8b-45b9-4653-ba55-5f855dd0fb88' // Storage Queue Data Contributor
    ]
  }
}

// --- Public static assets: storage account + Azure Front Door Standard ---
module assetsStorage 'modules/assetsStorageAccount.bicep' = {
  name: 'assetsStorage'
  params: {
    name: assetsStorageAccountName
    location: location
  }
}

module frontDoor 'modules/frontDoor.bicep' = {
  name: 'frontDoor'
  params: {
    profileName: frontDoorProfileName
    endpointName: frontDoorEndpointName
    originHostName: assetsStorage.outputs.blobHostName
  }
}

// --- Alerting: email action group + scheduled-query rule over heartbeat telemetry ---
module actionGroup 'modules/actionGroup.bicep' = {
  name: 'actionGroup'
  params: {
    name: 'ag-sanskagarwal-heartbeat'
    shortName: 'heartbeat'
    emailAddress: alertEmailAddress
  }
}

module heartbeatAlert 'modules/heartbeatAlert.bicep' = {
  name: 'heartbeatAlert'
  params: {
    name: 'alert-sanskagarwal-heartbeat'
    location: location
    appInsightsId: appInsights.outputs.id
    actionGroupId: actionGroup.outputs.id
  }
}

// Issue a managed certificate per hostname (after the hostname bindings exist).
module certificates 'modules/managedCertificate.bicep' = [
  for host in allCustomHostnames: {
    name: 'cert-${replace(host.name, '.', '-')}'
    params: {
      name: 'cert-${replace(host.name, '.', '-')}'
      location: location
      serverFarmId: appServicePlan.outputs.id
      canonicalName: host.name
    }
    dependsOn: [
      webApp
      cmsApp
    ]
  }
]

// Bind each managed certificate to its hostname via SNI (final pass).
module sniBindings 'modules/sniBinding.bicep' = [
  for (host, i) in allCustomHostnames: {
    name: 'sni-${replace(host.name, '.', '-')}'
    params: {
      webAppName: host.webAppName
      hostname: host.name
      dnsRecordType: host.dnsRecordType
      thumbprint: certificates[i].outputs.thumbprint
    }
  }
]

output webAppName string = webApp.outputs.name
output defaultHostName string = webApp.outputs.defaultHostName
output cmsAppName string = cmsApp.outputs.name
output cmsDefaultHostName string = cmsApp.outputs.defaultHostName
output keyVaultUri string = keyVault.outputs.uri
output functionAppName string = functionApp.outputs.name
output functionAppHostName string = functionApp.outputs.defaultHostName
output appInsightsName string = appInsights.outputs.name
output assetsStorageAccountName string = assetsStorage.outputs.name
output frontDoorEndpointHostName string = frontDoor.outputs.endpointHostName
