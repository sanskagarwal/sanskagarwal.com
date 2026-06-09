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
@description('Database CA certificate (PEM contents). Optional; pass empty string to skip.')
param databaseCaCert string = ''

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
    softDeleteRetentionInDays: 7
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

resource databaseCaCertSecret 'Microsoft.KeyVault/vaults/secrets@2024-11-01' = if (!empty(databaseCaCert)) {
  parent: vault
  name: 'database-ca-cert'
  properties: {
    value: databaseCaCert
  }
}

output name string = vault.name
output id string = vault.id
output uri string = vault.properties.vaultUri
