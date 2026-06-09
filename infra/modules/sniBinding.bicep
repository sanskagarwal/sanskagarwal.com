@description('Name of the existing web app.')
param webAppName string

@description('Hostname to enable SNI SSL for.')
param hostname string

@description('DNS record type for the hostname: A (apex) or CName (subdomain).')
@allowed([
  'A'
  'CName'
])
param dnsRecordType string

@description('Thumbprint of the managed certificate to bind.')
param thumbprint string

// Update the existing hostname binding to use the managed certificate via SNI.
// Deployed after managedCertificate to avoid the cert <-> binding circular dependency.
resource binding 'Microsoft.Web/sites/hostNameBindings@2024-04-01' = {
  name: '${webAppName}/${hostname}'
  properties: {
    siteName: webAppName
    hostNameType: 'Verified'
    customHostNameDnsRecordType: dnsRecordType
    sslState: 'SniEnabled'
    thumbprint: thumbprint
  }
}
