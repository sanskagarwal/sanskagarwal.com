const appInsights = require("applicationinsights");
appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || "")
    .start();

const client = appInsights.defaultClient;

export function trackEvent(name: string, properties?: { [key: string]: any }) {
    client.trackEvent({ name, properties });
}

export function trackException(exception: Error, properties?: { [key: string]: any }) {
    client.trackException({ exception, properties });
}
