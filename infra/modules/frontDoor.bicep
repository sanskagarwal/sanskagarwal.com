@description('Name of the Front Door (CDN) profile.')
param profileName string

@description('Name of the Front Door endpoint (part of the default hostname).')
param endpointName string

@description('Origin hostname Front Door fetches from (e.g. the storage blob endpoint host).')
param originHostName string

@description('Name of the origin group.')
param originGroupName string = 'assets-origin-group'

@description('Custom domain hostname served by Front Door (e.g. assets.sanskagarwal.com).')
param customDomain string

var customDomainResourceName = replace(customDomain, '.', '-')

// Azure Front Door Standard. Front Door is a global service, so the profile and
// endpoint live in the 'Global' location regardless of the resource group region.
resource profile 'Microsoft.Cdn/profiles@2024-02-01' = {
  name: profileName
  location: 'Global'
  sku: {
    name: 'Standard_AzureFrontDoor'
  }
}

resource endpoint 'Microsoft.Cdn/profiles/afdEndpoints@2024-02-01' = {
  parent: profile
  name: endpointName
  location: 'Global'
  properties: {
    enabledState: 'Enabled'
  }
}

// Custom domain with an AFD-managed TLS certificate. Domain ownership is proven
// out-of-band by a DNS TXT record (_dnsauth.<subdomain>) holding the validation
// token, and traffic is routed once a CNAME points the subdomain at the endpoint.
resource customDomainResource 'Microsoft.Cdn/profiles/customDomains@2024-02-01' = {
  parent: profile
  name: customDomainResourceName
  properties: {
    hostName: customDomain
    tlsSettings: {
      certificateType: 'ManagedCertificate'
      minimumTlsVersion: 'TLS12'
    }
  }
}

resource originGroup 'Microsoft.Cdn/profiles/originGroups@2024-02-01' = {
  parent: profile
  name: originGroupName
  properties: {
    loadBalancingSettings: {
      sampleSize: 4
      successfulSamplesRequired: 3
      additionalLatencyInMilliseconds: 50
    }
    healthProbeSettings: {
      probePath: '/'
      probeRequestType: 'HEAD'
      probeProtocol: 'Https'
      probeIntervalInSeconds: 100
    }
  }
}

resource origin 'Microsoft.Cdn/profiles/originGroups/origins@2024-02-01' = {
  parent: originGroup
  name: 'blob-origin'
  properties: {
    hostName: originHostName
    originHostHeader: originHostName
    httpPort: 80
    httpsPort: 443
    priority: 1
    weight: 1000
    enabledState: 'Enabled'
    enforceCertificateNameCheck: true
  }
}

resource route 'Microsoft.Cdn/profiles/afdEndpoints/routes@2024-02-01' = {
  parent: endpoint
  name: 'assets-route'
  dependsOn: [
    origin
  ]
  properties: {
    customDomains: [
      {
        id: customDomainResource.id
      }
    ]
    originGroup: {
      id: originGroup.id
    }
    supportedProtocols: [
      'Http'
      'Https'
    ]
    patternsToMatch: [
      '/*'
    ]
    forwardingProtocol: 'HttpsOnly'
    linkToDefaultDomain: 'Enabled'
    httpsRedirect: 'Enabled'
    enabledState: 'Enabled'
  }
}

output profileName string = profile.name
output endpointHostName string = endpoint.properties.hostName
output customDomainHostName string = customDomainResource.properties.hostName
output customDomainValidationToken string = customDomainResource.properties.validationProperties.validationToken
