@description('Name of the web app.')
param name string

@description('Azure region for the web app.')
param location string

@description('Resource id of the App Service Plan.')
param serverFarmId string

@description('Node runtime, e.g. NODE|24-lts.')
param linuxFxVersion string = 'NODE|24-lts'

@description('Startup command for the app.')
param appCommandLine string = 'npm run start'

@description('Name of the Key Vault holding secret app settings.')
param keyVaultName string

@description('Non-secret app settings as name/value pairs.')
param appSettings array = []

@description('Custom hostnames to register. Each item: { name: string, dnsRecordType: \'A\' | \'CName\' }.')
param customHostnames array = []

@description('Whether the optional DATABASE_CA_CERT secret exists in Key Vault.')
param includeDatabaseCaCert bool = false

var keyVaultSecretSettings = concat(
  [
    {
      name: 'DATABASE_PASSWORD'
      value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=database-password)'
    }
    {
      name: 'TANDOOR_TOKEN'
      value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=tandoor-token)'
    }
  ],
  includeDatabaseCaCert
    ? [
        {
          name: 'DATABASE_CA_CERT'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=database-ca-cert)'
        }
      ]
    : []
)

resource site 'Microsoft.Web/sites@2024-04-01' = {
  name: name
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: serverFarmId
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: linuxFxVersion
      appCommandLine: appCommandLine
      alwaysOn: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      http20Enabled: true
      appSettings: concat(
        [
          {
            name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
            value: 'false'
          }
          {
            name: 'WEBSITE_NODE_DEFAULT_VERSION'
            value: '~24'
          }
        ],
        appSettings,
        keyVaultSecretSettings
      )
    }
  }
}

// Disable basic (local) auth for SCM/Kudu and FTP so deployments must use
// Entra ID (OIDC). This removes publish-profile / username+password access.
resource scmBasicAuth 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2024-04-01' = {
  parent: site
  name: 'scm'
  properties: {
    allow: false
  }
}

resource ftpBasicAuth 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2024-04-01' = {
  parent: site
  name: 'ftp'
  properties: {
    allow: false
  }
}

// Register custom hostnames without SSL first. SNI binding is applied in a later
// pass (sniBinding module) once the managed certificate exists.
resource hostnameBindings 'Microsoft.Web/sites/hostNameBindings@2024-04-01' = [
  for host in customHostnames: {
    parent: site
    name: host.name
    properties: {
      siteName: name
      hostNameType: 'Verified'
      customHostNameDnsRecordType: host.dnsRecordType
      sslState: 'Disabled'
    }
  }
]

output principalId string = site.identity.principalId
output name string = site.name
output defaultHostName string = site.properties.defaultHostName
