@description('Name of the Linux App Service Plan.')
param name string

@description('Azure region for the plan.')
param location string

@description('SKU name for the plan (e.g. B1, P0v3, P1v3).')
param skuName string = 'P0v3'

resource plan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: name
  location: location
  kind: 'linux'
  sku: {
    name: skuName
  }
  properties: {
    reserved: true // required for Linux plans
  }
}

output id string = plan.id
output name string = plan.name
