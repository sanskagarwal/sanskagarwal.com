@description('Name of the existing storage account to scope the role assignments to.')
param storageAccountName string

@description('Principal (object) id of the identity to grant access to.')
param principalId string

@description('Role definition ids (GUIDs) to assign at the storage account scope.')
param roleDefinitionIds array

resource storage 'Microsoft.Storage/storageAccounts@2024-01-01' existing = {
  name: storageAccountName
}

resource roleAssignments 'Microsoft.Authorization/roleAssignments@2022-04-01' = [
  for roleId in roleDefinitionIds: {
    name: guid(storage.id, principalId, roleId)
    scope: storage
    properties: {
      roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', roleId)
      principalId: principalId
      principalType: 'ServicePrincipal'
    }
  }
]
