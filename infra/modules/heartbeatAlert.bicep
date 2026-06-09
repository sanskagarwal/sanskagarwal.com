@description('Name of the scheduled query alert rule.')
param name string

@description('Azure region for the alert rule.')
param location string

@description('Resource id of the Application Insights component to query.')
param appInsightsId string

@description('Resource id of the action group to notify when the alert fires.')
param actionGroupId string

@description('How often the rule is evaluated (ISO 8601 duration).')
param evaluationFrequency string = 'PT1H'

@description('Time window the query spans (ISO 8601 duration).')
param windowSize string = 'PT1H'

@description('Alert severity (0 = critical, 4 = verbose).')
@minValue(0)
@maxValue(4)
param severity int = 1

// The heartbeat function logs an Error-severity trace ("heartbeat: <endpoint>
// unhealthy") for every failed endpoint check. Any such trace in the window
// fires the alert. The rule is scoped directly to the Application Insights
// component, so it uses the classic AI schema (table "traces", column
// "message") rather than the Log Analytics workspace schema (AppTraces/Message).
var query = '''
traces
| where message startswith "heartbeat:" and message has "unhealthy"
'''

resource rule 'Microsoft.Insights/scheduledQueryRules@2023-03-15-preview' = {
  name: name
  location: location
  kind: 'LogAlert'
  properties: {
    displayName: name
    description: 'Fires when one or more sanskagarwal.com endpoints fail their heartbeat health check.'
    severity: severity
    enabled: true
    scopes: [
      appInsightsId
    ]
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      allOf: [
        {
          query: query
          timeAggregation: 'Count'
          operator: 'GreaterThan'
          threshold: 0
          failingPeriods: {
            numberOfEvaluationPeriods: 1
            minFailingPeriodsToAlert: 1
          }
        }
      ]
    }
    autoMitigate: false
    actions: {
      actionGroups: [
        actionGroupId
      ]
    }
  }
}

output id string = rule.id
output name string = rule.name
