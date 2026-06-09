@description('Name of the action group.')
param name string

@description('Short name shown in notifications (max 12 characters).')
@maxLength(12)
param shortName string

@description('Email address to notify when an alert fires.')
param emailAddress string

resource actionGroup 'Microsoft.Insights/actionGroups@2024-10-01-preview' = {
  name: name
  location: 'global'
  properties: {
    groupShortName: shortName
    enabled: true
    emailReceivers: [
      {
        name: 'primary-email'
        emailAddress: emailAddress
        useCommonAlertSchema: true
      }
    ]
  }
}

output id string = actionGroup.id
output name string = actionGroup.name
