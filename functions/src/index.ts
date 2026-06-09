// Initialize OpenTelemetry before anything else so the SDK is ready when
// function handlers run. Telemetry is exported to Azure Monitor (Application
// Insights) via the APPLICATIONINSIGHTS_CONNECTION_STRING app setting.
import { useAzureMonitor } from '@azure/monitor-opentelemetry';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { AzureFunctionsInstrumentation } from '@azure/functions-opentelemetry-instrumentation';

import { app } from '@azure/functions';

useAzureMonitor();

registerInstrumentations({
    instrumentations: [new AzureFunctionsInstrumentation()],
});

app.setup({
    enableHttpStream: true,
});
