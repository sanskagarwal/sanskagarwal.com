@description('Name of the storage account (3-24 lowercase alphanumeric characters).')
@minLength(3)
@maxLength(24)
param name string

@description('Azure region for the storage account.')
param location string

@description('Name of the public blob container that holds static assets.')
param containerName string = 'public'

// Public static-asset storage (e.g. the resume PDF), fronted by Azure Front Door.
// Anonymous blob reads are allowed so Front Door can serve the assets directly.
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
    allowBlobPublicAccess: true
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2024-01-01' = {
  parent: storage
  name: 'default'
}

resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@2024-01-01' = {
  parent: blobService
  name: containerName
  properties: {
    publicAccess: 'Blob'
  }
}

output id string = storage.id
output name string = storage.name
output blobHostName string = '${storage.name}.blob.${environment().suffixes.storage}'
