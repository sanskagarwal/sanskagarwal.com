@description('Name of the Application Insights component.')
param name string

@description('Azure region for the component.')
param location string

@description('Resource id of the Log Analytics workspace backing this component.')
param workspaceId string

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: name
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: workspaceId
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

output id string = appInsights.id
output name string = appInsights.name

@secure()
output connectionString string = appInsights.properties.ConnectionString
