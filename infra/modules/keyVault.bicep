@description('Name of the Key Vault.')
param name string

@description('Azure region for the Key Vault.')
param location string

@description('Entra (Azure AD) tenant id used by the Key Vault.')
param tenantId string = subscription().tenantId

@secure()
@description('Postgres database password.')
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

resource vault 'Microsoft.KeyVault/vaults@2024-11-01' = {
  name: name
  location: location
  properties: {
    tenantId: tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    enableRbacAuthorization: true
    enableSoftDelete: true
    publicNetworkAccess: 'Enabled'
  }
}

resource databasePasswordSecret 'Microsoft.KeyVault/vaults/secrets@2024-11-01' = {
  parent: vault
  name: 'database-password'
  properties: {
    value: databasePassword
  }
}

resource tandoorTokenSecret 'Microsoft.KeyVault/vaults/secrets@2024-11-01' = {
  parent: vault
  name: 'tandoor-token'
  properties: {
    value: tandoorToken
  }
}

resource databaseCmsPasswordSecret 'Microsoft.KeyVault/vaults/secrets@2024-11-01' = if (!empty(databaseCmsPassword)) {
  parent: vault
  name: 'database-cms-password'
  properties: {
    value: databaseCmsPassword
  }
}

resource strapiAppKeysSecret 'Microsoft.KeyVault/vaults/secrets@2024-11-01' = if (!empty(strapiAppKeys)) {
  parent: vault
  name: 'strapi-app-keys'
  properties: {
    value: strapiAppKeys
  }
}

resource strapiApiTokenSaltSecret 'Microsoft.KeyVault/vaults/secrets@2024-11-01' = if (!empty(strapiApiTokenSalt)) {
  parent: vault
  name: 'strapi-api-token-salt'
  properties: {
    value: strapiApiTokenSalt
  }
}

resource strapiAdminJwtSecretSecret 'Microsoft.KeyVault/vaults/secrets@2024-11-01' = if (!empty(strapiAdminJwtSecret)) {
  parent: vault
  name: 'strapi-admin-jwt-secret'
  properties: {
    value: strapiAdminJwtSecret
  }
}

resource strapiTransferTokenSaltSecret 'Microsoft.KeyVault/vaults/secrets@2024-11-01' = if (!empty(strapiTransferTokenSalt)) {
  parent: vault
  name: 'strapi-transfer-token-salt'
  properties: {
    value: strapiTransferTokenSalt
  }
}

resource strapiJwtSecretSecret 'Microsoft.KeyVault/vaults/secrets@2024-11-01' = if (!empty(strapiJwtSecret)) {
  parent: vault
  name: 'strapi-jwt-secret'
  properties: {
    value: strapiJwtSecret
  }
}

output name string = vault.name
output id string = vault.id
output uri string = vault.properties.vaultUri
