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

@description('Resource name of the existing App Service managed certificate to bind.')
param certificateResourceName string

// The managed certificate is auto-issued by App Service when the custom
// hostname is added; we reference it to read its thumbprint rather than create
// a duplicate (which fails with a duplicate-certificate conflict).
resource certificate 'Microsoft.Web/certificates@2024-04-01' existing = {
  name: certificateResourceName
}

// Update the existing hostname binding to use the managed certificate via SNI.
resource binding 'Microsoft.Web/sites/hostNameBindings@2024-04-01' = {
  name: '${webAppName}/${hostname}'
  properties: {
    siteName: webAppName
    hostNameType: 'Verified'
    customHostNameDnsRecordType: dnsRecordType
    sslState: 'SniEnabled'
    thumbprint: certificate.properties.thumbprint
  }
}
