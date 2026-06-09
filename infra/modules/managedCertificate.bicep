@description('Resource name of the existing App Service managed certificate to reference.')
param certificateResourceName string

resource certificate 'Microsoft.Web/certificates@2024-04-01' existing = {
  name: certificateResourceName
}

output thumbprint string = certificate.properties.thumbprint
