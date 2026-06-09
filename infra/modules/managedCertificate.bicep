@description('Name of the certificate resource.')
param name string

@description('Azure region (must match the web app).')
param location string

@description('Resource id of the App Service Plan hosting the app.')
param serverFarmId string

@description('Hostname the certificate is issued for (must already be bound to the app).')
param canonicalName string

// App Service Managed Certificate (free). The hostname must already exist as a
// hostname binding on the app, otherwise issuance fails.
resource certificate 'Microsoft.Web/certificates@2024-04-01' = {
  name: name
  location: location
  properties: {
    serverFarmId: serverFarmId
    canonicalName: canonicalName
    domainValidationMethod: 'http-token'
  }
}

output thumbprint string = certificate.properties.thumbprint
