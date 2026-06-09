@description('Name of the storage account (3-24 lowercase alphanumeric characters).')
@minLength(3)
@maxLength(24)
param name string

@description('Azure region for the storage account.')
param location string

// Used by the Functions host via identity-based connection (keyless): shared key
// access is disabled, so the function app authenticates with its managed identity.
resource storage 'Microsoft.Storage/storageAccounts@2024-01-01' = {
  name: name
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

output id string = storage.id
output name string = storage.name
